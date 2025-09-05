import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import NotesSection from "./notesSection";
import { useAuth } from "../contexts/authContexts";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Send, Copy, RefreshCcw, Bookmark, Loader2, ThumbsUp, ThumbsDown, AlertCircle } from "lucide-react";


import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatPage() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([
    { sender: "assistant", text: "Hey! I’m your study & wellbeing helper. Ask me anything.", ts: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("study"); // 'study' | 'wellbeing' | 'motivation'
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  const SUGGESTIONS = [
    "Create a 7-day study plan for my modules.",
    "Explain cognitive behavioural techniques in simple terms.",
    "Help me break down a big assignment into steps.",
    "Give me a short pre-exam calming routine.",
  ];

  const modePrompt = {
    study:
      "You are a helpful study assistant. Be concise, structured, and give step-by-step plans when helpful.",
    wellbeing:
      "You are a supportive mental health assistant for students. Be empathetic, practical, and non-judgmental.",
    motivation:
      "You are a motivational coach for students. Be encouraging, specific, and action-oriented.",
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text) return;

    const userMessage = { sender: "user", text, ts: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const payload = { message: `${modePrompt[mode]}\n\nUser: ${text}` };

      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const assistantMessage = {
        sender: "assistant",
        text: data.reply ?? "I’m here. How else can I help?",
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: "Sorry, something went wrong. Try again in a moment.",
          ts: Date.now(),
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [safety, setSafety] = useState(null);

useEffect(() => {
  const last = messages[messages.length - 1];
  if (!last || last.sender !== "user") return;

  // expand as needed
  const risky = /\b(suicide|self-harm|hurt myself|kill myself|end my life|overdose)\b/i;

  if (risky.test(last.text || "")) {
    setSafety(
      "If you’re in immediate danger, call emergency services (112/999 in Ireland). You’re not alone — help is available."
    );
  } else {
    setSafety(null);
  }
}, [messages]);

// optional: auto-hide after 30s
useEffect(() => {
  if (!safety) return;
  const t = setTimeout(() => setSafety(null), 30000);
  return () => clearTimeout(t);
}, [safety]);

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied to clipboard");
    } catch {
      toast("Copy failed");
    }
  };

  const saveAsNote = async (text) => {
    if (!currentUser?.uid) {
      toast("Please log in to save notes");
      return;
    }
    const note = {
      userIdString: currentUser.uid,
      text,
      timeStampDateTime: new Date().toISOString(),
    };
    try {
      const res = await fetch("http://localhost:5000/notesAI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      if (!res.ok) throw new Error();
      toast("Saved to notes");
      window.dispatchEvent(new Event("notes:refresh"));
    } catch {
      toast("Could not save note");
    }
  };

  // ✅ Feedback sender (kept in parent so it can use currentUser)
  const sendFeedback = async (msg, value) => {
    try {
      await fetch("http://localhost:5000/chat/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser?.uid ?? "anon",
          ts: msg.ts,
          value, // "up" | "down"
        }),
      });
      toast("Thanks for the feedback");
    } catch {
      // ignore silently
    }
  };

  const regenerateLast = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === "user") {
        handleSend(messages[i].text);
        return;
      }
    }
    toast("No user message to regenerate");
  };

  return (
    <div className="flex flex-row w-full h-full min-h-screen bg-muted/30 p-4 gap-4">
      {/* Left: Chat */}
      <div className="flex flex-col flex-1 w-1/2">
        <Card className="flex h-full flex-col">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resource Chat Assistant</CardTitle>
                <CardDescription>
                  Study support, wellbeing tips, and motivation — all in one place.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Mode</label>
                <select
                  className="h-9 rounded-md border bg-background px-2 text-sm"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                >
                  <option value="study">Study</option>
                  <option value="wellbeing">Wellbeing</option>
                  <option value="motivation">Motivation</option>
                </select>
              </div>
            </div>

            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <Badge
                  key={s}
                  variant="secondary"
                  className="cursor-pointer hover:ring-2 hover:ring-primary/30"
                  onClick={() => handleSend(s)}
                  title="Send this prompt"
                >
                  {s}
                </Badge>
              ))}
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden">
  {safety && (
    <div className="mb-3 rounded-md border border-yellow-200 bg-yellow-50 text-yellow-900 p-3 text-xs flex items-start gap-2">
      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
      <div className="flex-1">{safety}</div>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 px-2 text-yellow-900 hover:bg-yellow-100"
        onClick={() => setSafety(null)}
      >
        Dismiss
      </Button>
    </div>
  )}

            <ScrollArea className="h-[560px] pr-2">
              {messages.map((msg, idx) => (
                <MessageBubble
                  key={idx}
                  msg={msg}
                  onCopy={() => copyText(msg.text)}
                  onSave={() => msg.sender === "assistant" && saveAsNote(msg.text)}
                  onFeedback={(value) => sendFeedback(msg, value)} // ✅ pass feedback handler
                />
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="max-w-[75%] mr-auto bg-gray-100 text-gray-900 rounded-2xl p-3 mb-3 shadow-sm">
                  <div className="text-xs opacity-70 mb-1">Assistant</div>
                  <div className="flex gap-1 items-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking…</span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </ScrollArea>
          </CardContent>

          <CardFooter className="flex gap-2">
            <Textarea
              placeholder="Ask a question… (Shift+Enter for newline)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="min-h-[44px] max-h-40"
              disabled={loading}
            />
            <Button onClick={() => handleSend()} disabled={loading || !input.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
            <Button variant="outline" onClick={regenerateLast} disabled={loading}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Right: Notes */}
      <div className="flex flex-col flex-1 w-1/2">
        <Card className="h-full">
          <NotesSection />
        </Card>
      </div>
    </div>
  );
}

function MessageBubble({ msg, onCopy, onSave, onFeedback }) {
  const [fb, setFb] = useState(null); // 'up' | 'down'
  const isUser = msg.sender === "user";

  return (
    <div
      className={`max-w-[75%] rounded-2xl p-3 mb-3 shadow-sm ${
        isUser ? "ml-auto bg-blue-500 text-white" : "mr-auto bg-gray-100 text-gray-900"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs opacity-70">{isUser ? "You" : "Assistant"}</div>
        <div className="flex items-center gap-1">
          {/* Copy (both sides) */}
          <Button
            size="icon"
            variant={isUser ? "secondary" : "ghost"}
            className={`h-7 w-7 ${isUser ? "bg-blue-600/40 text-white hover:bg-blue-600/60" : ""}`}
            onClick={onCopy}
            title="Copy"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>

          {/* Save (assistant only) */}
          {!isUser && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={onSave}
              title="Save to notes"
            >
              <Bookmark className="h-3.5 w-3.5" />
            </Button>
          )}

          {/* Feedback (assistant only) */}
          {!isUser && (
            <>
              <Button
                size="icon"
                variant="ghost"
                className={`h-7 w-7 ${fb === "up" ? "text-green-600" : ""}`}
                onClick={() => {
                  setFb("up");
                  onFeedback?.("up");
                }}
                title="Helpful"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className={`h-7 w-7 ${fb === "down" ? "text-red-600" : ""}`}
                onClick={() => {
                  setFb("down");
                  onFeedback?.("down");
                }}
                title="Not helpful"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content: Markdown for assistant, plain text for user */}
      {isUser ? (
        <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
      ) : (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {msg.text}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
