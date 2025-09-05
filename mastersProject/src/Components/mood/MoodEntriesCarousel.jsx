import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../contexts/authContexts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ✅ env-driven helper (Vercel + local)
import { get } from "@/lib/api";

const MoodEntriesCarousel = () => {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!currentUser?.uid) return;
      setLoading(true);
      setErr(null);
      try {
        // ⬇️ CHANGED: use env-based helper instead of hardcoded localhost
        const raw = await get(`/moodLog/${currentUser.uid}`);

        const formatted = (raw || [])
          .map((e) => {
            // handle both timeStamp and timestamp
            const rawTs = e.timeStamp ?? e.timestamp;
            const d = rawTs ? new Date(rawTs) : null;
            if (!d || isNaN(d)) return null;
            return {
              dateISO: d.toISOString(),
              date: d.toLocaleDateString(),
              time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              score: Number(e.moodInNum),
              notes: e.notes || "",
              tags: Array.isArray(e.tags) ? e.tags : [],
            };
          })
          .filter(Boolean)
          .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1)); // newest first

        setEntries(formatted);
      } catch (e) {
        setErr(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, [currentUser]);

  const haveEntries = useMemo(() => entries.length > 0, [entries]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader><CardTitle>Recent Mood Entries</CardTitle></CardHeader>
        <CardContent className="h-[180px] flex items-center justify-center text-muted-foreground">
          Loading…
        </CardContent>
      </Card>
    );
  }

  if (err) {
    return (
      <Card className="w-full">
        <CardHeader><CardTitle>Recent Mood Entries</CardTitle></CardHeader>
        <CardContent className="h-[180px] flex items-center justify-center text-destructive">
          {String(err)}
        </CardContent>
      </Card>
    );
  }

  if (!haveEntries) {
    return (
      <Card className="w-full">
        <CardHeader><CardTitle>Recent Mood Entries</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          You haven’t logged any mood entries yet. Log a few days to see them here.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Mood Entries</CardTitle>
      </CardHeader>

      <CardContent>
        <Carousel className="w-full">
          <CarouselContent>
            {entries.map((e, idx) => (
              <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">{e.date}</div>
                          <div className="text-xs text-muted-foreground/80">{e.time}</div>
                        </div>
                        <Badge className="text-base px-3 py-1" variant="secondary">
                          {e.score}/10
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {e.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {e.tags.map((t) => (
                            <Badge key={t} variant="outline" className="rounded-full">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="text-sm leading-relaxed max-h-28 overflow-auto whitespace-pre-wrap">
                        {e.notes || <span className="text-muted-foreground">No notes</span>}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default MoodEntriesCarousel;
