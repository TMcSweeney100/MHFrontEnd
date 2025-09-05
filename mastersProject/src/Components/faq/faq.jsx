import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Search, Link as LinkIcon, ThumbsUp, ThumbsDown, RefreshCcw } from "lucide-react";

const Faq = () => {
  // --- Data -----------------------------------------------------------------
  const faqs = [
    {
      id: "1",
      category: "General",
      question: "What is this app about?",
      answer:
        "This app helps you cut down or quit alcohol and substances with practical tools, education, and progress tracking.",
    },
    {
      id: "2",
      category: "Getting Started",
      question: "How do I get started?",
      answer:
        "Create an account, set your goals (e.g., target days sober), and complete your first profile. From there, log your days and notes.",
    },
    {
      id: "3",
      category: "Privacy",
      question: "Is my data secure?",
      answer:
        "Yes. We follow industry-standard security practices. Your personal data is never shared without your consent.",
    },
    {
      id: "4",
      category: "Support",
      question: "Can I contact a support team?",
      answer:
        "Absolutely. Use the Contact page in the app or email us at support@example.com if you need help.",
    },
    {
      id: "5",
      category: "Tracking",
      question: "How do I set my start date and track progress?",
      answer:
        "Open the Alcohol Profile form, pick your start date with the calendar, and set a target number of days. Your landing page then shows a live progress bar.",
    },
    {
      id: "6",
      category: "Insights",
      question: "Where can I see mood trends over time?",
      answer:
        "Visit the Insights section to see your mood chart, recent entries carousel, and helpful stats like average and best mood.",
    },
      {
    id: "7",
    category: "Getting Started",
    question: "What should I do first after creating an account?",
    answer: "Go to the Alcohol Profile form, set your start date and target days, then visit the Alcohol landing page to see your progress bar. Next, try logging a mood and saving a note in the Notes section."
  },
  {
    id: "8",
    category: "Routines",
    question: "How do I use routines to build momentum?",
    answer: "Pick one small daily habit (e.g., morning check-in) and anchor it to something you already do (breakfast, brushing teeth). Open the app, log your mood, add a note, and glance at your streak. Keep it under 2 minutes so it’s easy to repeat."
  },
  {
    id: "9",
    category: "Routines",
    question: "What’s a good daily check-in flow?",
    answer: "1) Log mood (1–10). 2) Add 1–2 tags (e.g., ‘stress’, ‘exercise’). 3) Write a one-sentence note. 4) Review your Alcohol progress bar for motivation. 5) Save any helpful thought to Notes. Done."
  },
  {
    id: "10",
    category: "Alcohol Tracking",
    question: "How do I set or change my start date for alcohol tracking?",
    answer: "Open the Alcohol Profile form, use the calendar to pick your start date, and Save. The DayTracker and progress bar update automatically. If you picked the wrong date, just update and save again."
  },
  {
    id: "11",
    category: "Alcohol Tracking",
    question: "What happens if I slip up on my streak?",
    answer: "No judgement here. Update your start date to the new Day 1 when you’re ready. Use a quick note to reflect on what happened and what might help next time. The goal is learning, not perfection."
  },
  {
    id: "12",
    category: "Alcohol Tracking",
    question: "How often should I check my alcohol progress?",
    answer: "A 60-second daily glance works well. Seeing Day X of Y keeps your ‘why’ fresh. Pair it with a mood log so you can see how progress and feelings move together over time."
  },
  {
    id: "13",
    category: "Chat Assistant",
    question: "How do I use the chat to learn faster?",
    answer: "Pick a Mode (Study, Wellbeing, Motivation). Ask a clear task (“Explain CBT basics in 5 bullets” or “Plan my next 7 days”). Use follow-ups like “give an example,” “simplify more,” or “turn into a checklist,” then save helpful replies to Notes."
  },
  {
    id: "14",
    category: "Chat Assistant",
    question: "What type of prompts work best with the assistant?",
    answer: "State the goal + constraints + format. Example: “Create a 30-minute evening routine to reduce cravings; low energy; bullet list; 3 steps max.” Specific inputs → specific, useful outputs."
  },
  {
    id: "15",
    category: "Notes & Resources",
    question: "How do I save useful chat answers to Notes?",
    answer: "Click the bookmark icon on an assistant message to save it instantly. You’ll see it in Notes, where you can search, sort, and export to Markdown or CSV."
  },
  {
    id: "16",
    category: "Notes & Resources",
    question: "How should I organize my notes?",
    answer: "Use short, action-focused notes (checklists, ‘If-Then’ plans). Add tags like ‘cravings’, ‘sleep’, ‘study’. Quick, searchable notes beat long essays."
  },
  {
    id: "17",
    category: "Mood & Insights",
    question: "How do mood logs help my recovery or study?",
    answer: "Daily mood logs reveal patterns (sleep, exercise, stress). Over time, the chart + recent entries carousel show what helps and what hurts—so you can adjust faster."
  },
  {
    id: "18",
    category: "Mood & Insights",
    question: "Any tips for good mood notes?",
    answer: "Keep it short: situation → thought → action. Example: “Exam week; anxious; took a 10-min walk.” Small, consistent notes are more valuable than occasional long ones."
  },
  {
    id: "19",
    category: "Routines",
    question: "How can I use reminders without feeling overwhelmed?",
    answer: "Choose one key time (morning or evening). Link reminder → open app → log mood + glance at progress bar. If reminders annoy you, reduce to 3–4 days/week."
  },
  {
    id: "20",
    category: "Chat Assistant",
    question: "How do I get the assistant to create study plans I’ll actually follow?",
    answer: "Share constraints: time, energy, deadlines, preferred blocks. Ask for the plan in small steps with checkboxes. If it feels too big, say “shrink to 20 minutes” and save to Notes."
  },
  {
    id: "21",
    category: "Goal Setting",
    question: "How do I pick a target number of days?",
    answer: "Start with a realistic horizon (e.g., 14 or 30 days). Reassess every week. You can extend later. Hitting smaller milestones builds momentum and confidence."
  },
  {
    id: "22",
    category: "Streaks & Motivation",
    question: "How do I stay motivated on tough days?",
    answer: "Open the Alcohol landing page, read your ‘why’, and scan your streak. Use the chat in Motivation mode to generate a 3-step micro-plan for today only. Save it to Notes."
  },
  {
    id: "23",
    category: "Tags & Filtering",
    question: "How should I use tags on mood entries?",
    answer: "Pick 1–3 tags that describe key factors (sleep, stress, social, exercise). Tags make search and trend spotting easier. Click a tag chip to remove it quickly."
  },
  {
    id: "24",
    category: "Export & Sharing",
    question: "Can I export my notes or share progress with a mentor?",
    answer: "Yes—export Notes to Markdown or CSV from the Notes section. You can share specific FAQ or chat links, or copy a chat answer and paste it into an email."
  },
  {
    id: "25",
    category: "Privacy",
    question: "What if I want to remove my data?",
    answer: "Contact support and request deletion. We’ll guide you through removing profiles, logs, and saved notes. We respect your control over your information."
  },
  {
    id: "26",
    category: "Support & Safety",
    question: "Where can I get help if I’m in crisis?",
    answer: "If you’re in immediate danger, call emergency services (112/999 in Ireland). For non-urgent support, reach out to your GP or local mental health services. The app is supportive but not a crisis service."
  }
    
  ];

  const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category)))];

  // --- State ----------------------------------------------------------------
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [openItems, setOpenItems] = useState([]); // Accordion open state (multiple)
  const [feedback, setFeedback] = useState({}); // { [id]: 'up' | 'down' }

  // Reset open items on filter changes so UI doesn't feel "stuck open" on hidden items
  useEffect(() => {
    setOpenItems([]);
  }, [query, category]);

  // --- Derived --------------------------------------------------------------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((f) => {
      const matchesCat = category === "All" || f.category === category;
      const matchesText =
        !q ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q);
      return matchesCat && matchesText;
    });
  }, [faqs, query, category]);

  // Expand/collapse helpers
  const expandAll = () => setOpenItems(filtered.map((f) => f.id));
  const collapseAll = () => setOpenItems([]);

  // --- Utils ----------------------------------------------------------------
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const highlight = (text, q) => {
    if (!q) return text;
    const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "gi"));
    return parts.map((p, i) =>
      p.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 px-0.5 rounded">
          {p}
        </mark>
      ) : (
        <span key={i}>{p}</span>
      )
    );
  };

  const copyLink = async (id) => {
    const url = `${window.location.origin}${window.location.pathname}#faq-${id}`;
    await navigator.clipboard.writeText(url);
    toast("Question link copied");
  };

  // When navigated with #hash, auto-open and scroll
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const id = hash.startsWith("faq-") ? hash.replace("faq-", "") : null;
    if (!id) return;
    setOpenItems((prev) => Array.from(new Set([...prev, id])));
    // slight delay so Accordion renders, then scroll
    setTimeout(() => {
      const el = document.getElementById(`faq-${id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }, []);

  // --- UI -------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold">Frequently Asked Questions</CardTitle>
            <CardDescription>
              Find quick answers. Use search, filter by category, or copy a link to share a specific question.
            </CardDescription>

            {/* Search + Category + Controls */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions…"
                  className="pl-8"
                />
              </div>

              {/* Category chips */}
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Button
                    key={c}
                    variant={c === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(c)}
                    className="rounded-full"
                  >
                    {c}
                  </Button>
                ))}
              </div>
            </div>

            {/* Expand/Collapse / Reset */}
            <div className="flex items-center gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={expandAll}>
                Expand all
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                Collapse all
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
                title="Clear filters"
              >
                <RefreshCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {filtered.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">
                No results. Try clearing filters or using different keywords.
              </div>
            ) : (
              <ScrollArea className="max-h-[70vh] pr-2">
                <Accordion
                  type="multiple"
                  value={openItems}
                  onValueChange={setOpenItems}
                  className="w-full"
                >
                  {filtered.map((f) => (
                    <AccordionItem key={f.id} value={f.id} id={`faq-${f.id}`}>
                      <AccordionTrigger>
                        <div className="flex flex-col items-start">
                          <div className="text-left">
                            {highlight(f.question, query)}
                          </div>
                          <Badge variant="secondary" className="mt-1">
                            {f.category}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <p className="text-sm leading-relaxed">
                            {highlight(f.answer, query)}
                          </p>

                          <div className="flex items-center gap-2 pt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              onClick={() => copyLink(f.id)}
                              title="Copy link to this question"
                            >
                              <LinkIcon className="h-4 w-4 mr-1" />
                              Copy link
                            </Button>

                            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                              <span>Was this helpful?</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className={`h-7 w-7 ${feedback[f.id] === "up" ? "text-green-600" : ""}`}
                                onClick={() => {
                                  setFeedback((prev) => ({ ...prev, [f.id]: "up" }));
                                  toast("Thanks for the feedback");
                                }}
                                title="Helpful"
                              >
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className={`h-7 w-7 ${feedback[f.id] === "down" ? "text-red-600" : ""}`}
                                onClick={() => {
                                  setFeedback((prev) => ({ ...prev, [f.id]: "down" }));
                                  toast("Thanks for the feedback");
                                }}
                                title="Not helpful"
                              >
                                <ThumbsDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            )}


             <div className="mt-6 rounded-lg border bg-muted/40 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="font-medium">Have a more specific question?</div>
                  <div className="text-sm text-muted-foreground">
                    Reach out to our tailored chat assitant, which can help point ypu in the direction that you need.
                  </div>
                </div>
                </div>
                <div className="mt-2 w-full flex items-center gap-2">
                  <a href="/chat">
                    <Button className="flex:1">Chat Assistant</Button>
                  </a>
              </div>
            </div>
            {/* CTA */}
            <div className="mt-6 rounded-lg border bg-muted/40 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="font-medium">Still stuck?</div>
                  <div className="text-sm text-muted-foreground">
                    Reach out and we’ll help you find the right resource.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href="mailto:support@example.com">
                    <Button>Email support</Button>
                  </a>
                  <a href="/contact">
                    <Button variant="outline">Contact page</Button>
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Faq;
