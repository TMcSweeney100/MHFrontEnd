import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/authContexts";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { toast } from "sonner";
import {
  Plus, Download, Copy, RefreshCcw, Search, Loader2, ChevronDown, ChevronUp,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ✅ env-driven helper (Vercel + local)
import { get, post } from "@/lib/api";

function NotesSection() {
  const { currentUser } = useAuth();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest"); // 'newest' | 'oldest' | 'az'
  const [tab, setTab] = useState("saved");

  const [newText, setNewText] = useState("");

  const fetchNotes = async () => {
    if (!currentUser?.uid) return;
    setLoading(true);
    setErr(null);
    try {
      // ⬇️ CHANGED
      const data = await get(`/notesAI/${currentUser.uid}`);
      const normalized = (Array.isArray(data) ? data : [])
        .map((n) => {
          const ts = n.timeStampDateTime || n.timestamp || n.timeStamp || n.createdAt;
          const d = ts ? new Date(ts) : new Date();
          return {
            id: n.id || n._id || n.noteId || Math.random().toString(36).slice(2),
            text: n.text || "",
            tags: Array.isArray(n.tags) ? n.tags : [],
            date: d,
          };
        })
        .sort((a, b) => b.date - a.date);
      setNotes(normalized);
    } catch (e) {
      setErr(e.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [currentUser]);

  // Auto-refresh when chat saves a note
  useEffect(() => {
    const handler = () => fetchNotes();
    window.addEventListener("notes:refresh", handler);
    return () => window.removeEventListener("notes:refresh", handler);
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let arr = notes;
    if (term) {
      arr = arr.filter(
        (n) =>
          n.text.toLowerCase().includes(term) ||
          n.tags.some((t) => t.toLowerCase().includes(term))
      );
    }
    if (sort === "newest") arr = [...arr].sort((a, b) => b.date - a.date);
    if (sort === "oldest") arr = [...arr].sort((a, b) => a.date - b.date);
    if (sort === "az") arr = [...arr].sort((a, b) => a.text.localeCompare(b.text));
    return arr;
  }, [notes, q, sort]);

  const addNote = async () => {
    if (!currentUser?.uid) {
      toast("Please log in to save notes");
      return;
    }
    const text = newText.trim();
    if (!text) return;
    try {
      // ⬇️ CHANGED
      await post(`/notesAI`, {
        userIdString: currentUser.uid,
        text,
        timeStampDateTime: new Date().toISOString(),
      });
      toast("Note saved");
      setNewText("");
      setTab("saved");
      fetchNotes();
    } catch {
      toast("Could not save note");
    }
  };

  const copyNote = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied");
    } catch {
      toast("Copy failed");
    }
  };

  const exportMarkdown = () => {
    const md = filtered
      .map((n) => `### ${n.date.toLocaleString()}\n\n${n.text}\n`)
      .join("\n");
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const rows = [["date", "text"]];
    filtered.forEach((n) => {
      const date = n.date.toISOString();
      const text = (n.text || "").replace(/"/g, '""');
      rows.push([date, `"${text}"`]);
    });
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full">
      <CardHeader className="space-y-1">
        <CardTitle>Notes</CardTitle>
        <CardDescription>Save helpful answers and your own ideas.</CardDescription>
      </CardHeader>

      <CardContent className="h-[calc(100%-5.6rem)]">
        <Tabs value={tab} onValueChange={setTab} className="h-full flex flex-col">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>

          {/* SAVED TAB */}
          <TabsContent value="saved" className="flex-1 mt-4">
            {/* Controls */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search notes…"
                    className="pl-8"
                  />
                </div>
                <select
                  className="h-9 rounded-md border bg-background px-2 text-sm"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  title="Sort"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="az">A–Z</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={fetchNotes} title="Refresh">
                  <RefreshCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={exportMarkdown} title="Export Markdown">
                  <Download className="h-4 w-4 mr-1" />
                  MD
                </Button>
                <Button variant="outline" size="sm" onClick={exportCSV} title="Export CSV">
                  <Download className="h-4 w-4 mr-1" />
                  CSV
                </Button>
              </div>
            </div>

            {/* List */}
            <div className="mt-4 h-[calc(100%-6rem)]">
              {loading ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Loading…
                </div>
              ) : err ? (
                <div className="h-full flex items-center justify-center text-destructive">
                  {String(err)}
                </div>
              ) : !filtered.length ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm text-center px-6">
                  No notes yet. Save replies from the chat or create a new one in the tab above.
                </div>
              ) : (
                <ScrollArea className="h-full pr-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filtered.map((n) => (
                      <NoteCard key={n.id} note={n} onCopy={() => copyNote(n.text)} />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </TabsContent>

          {/* NEW TAB */}
          <TabsContent value="new" className="flex-1 mt-4">
            <div className="space-y-3 h-full flex flex-col">
              <label className="text-sm font-medium">New note</label>
              <Textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Paste a helpful idea or write your own…"
                className="min-h-[180px] flex-1"
              />
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" onClick={() => setNewText("")}>Clear</Button>
                <Button onClick={addNote}>
                  <Plus className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function NoteCard({ note, onCopy }) {
  const [expanded, setExpanded] = useState(false);
  const dateStr =
    note.date instanceof Date ? note.date.toLocaleString() : String(note.date);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="text-xs text-muted-foreground">{dateStr}</div>
          <Button size="icon" variant="ghost" className="h-7 w-7" title="Copy" onClick={onCopy}>
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>

        {Array.isArray(note.tags) && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {note.tags.map((t) => (
              <Badge key={t} variant="secondary" className="rounded-full">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {/* Clamp long notes so cards don't stretch; allow expand */}
        <div className={expanded ? "max-h-64 overflow-auto pr-1" : "max-h-24 overflow-hidden"}>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {note.text || "_(empty note)_"}
            </ReactMarkdown>
          </div>
        </div>

        {/* Expand / collapse */}
        {note.text && note.text.length > 180 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 h-7 px-2"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? (
              <>
                Show less <ChevronUp className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Show more <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default NotesSection;
