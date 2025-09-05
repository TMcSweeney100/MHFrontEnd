import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "../contexts/authContexts";
import MoodEntriesCarousel from "./MoodEntriesCarousel";

// ✅ env-driven helper (Vercel + local)
import { get } from "@/lib/api";

const MoodGraph = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState([]);
  const [range, setRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const fetchMoodData = async () => {
      if (!currentUser?.uid) return;
      setLoading(true);
      setErr(null);
      try {
        // ⬇️ CHANGED: env-based helper instead of hardcoded localhost
        const moodEntries = await get(`/moodLog/${currentUser.uid}`);

        const formatted = (moodEntries || [])
          .map((entry) => {
            const raw = entry.timestamp ?? entry.timeStamp;
            const d = raw ? new Date(raw) : null;
            if (!d || isNaN(d)) return null;
            return {
              date: d.toLocaleDateString(),
              dateISO: d.toISOString().slice(0, 10),
              score: Number(entry.moodInNum),
            };
          })
          .filter(Boolean)
          .sort((a, b) => (a.dateISO < b.dateISO ? -1 : 1));

        setData(formatted);
      } catch (e) {
        setErr(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchMoodData();
  }, [currentUser]);

  const filtered = useMemo(() => {
    if (range === "all") return data;
    const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return data.filter((d) => new Date(d.dateISO) >= cutoff);
  }, [data, range]);

  const stats = useMemo(() => {
    if (!filtered.length) return { avg: "-", latest: "-", count: 0, best: "-" };
    const count = filtered.length;
    const sum = filtered.reduce((acc, d) => acc + (Number.isFinite(d.score) ? d.score : 0), 0);
    const avg = (sum / count).toFixed(1);
    const latest = filtered[filtered.length - 1]?.score ?? "-";
    const best = Math.max(...filtered.map((d) => d.score));
    return { avg, latest, count, best };
  }, [filtered]);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload;
    return (
      <div className="rounded-md border bg-background/95 p-2 text-xs shadow-sm">
        <div className="font-medium">{p.date}</div>
        <div className="opacity-80">
          Score: <span className="font-semibold">{p.score}</span>/10
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <div className="mx-auto w-full max-w-5xl">
        <Card className="w-full shadow-sm border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Mood Insights</CardTitle>
            <p className="text-sm text-muted-foreground">
              Track how your mood is trending. Use the range to focus on recent weeks or your full history.
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Stats + Range */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatTile label="Average" value={stats.avg} />
                <StatTile label="Latest" value={stats.latest} />
                <StatTile label="Best" value={stats.best} />
                <StatTile label="Entries" value={stats.count} />
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="range" className="text-sm text-muted-foreground">Range</label>
                <select
                  id="range"
                  className="h-9 rounded-md border bg-background px-2 text-sm"
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="all">All time</option>
                </select>
              </div>
            </div>

            {/* Chart */}
            {loading ? (
              <div className="h-[360px] flex items-center justify-center text-muted-foreground">
                Loading…
              </div>
            ) : err ? (
              <div className="h-[360px] flex items-center justify-center text-destructive">
                {String(err)}
              </div>
            ) : !filtered.length ? (
              <div className="h-[360px] flex items-center justify-center text-muted-foreground text-sm">
                No mood entries yet. Log a few days to see your trend here.
              </div>
            ) : (
              <div className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={filtered}
                    margin={{ top: 8, right: 12, bottom: 8, left: 12 }}
                  >
                    <defs>
                      <linearGradient id="moodLine" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickMargin={8}
                      interval="preserveStartEnd"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      domain={[1, 10]}
                      tickCount={10}
                      width={36}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="url(#moodLine)"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      isAnimationActive
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent entries */}
            <div className="space-y-2">
              <h3 className="text-base font-medium">Recent mood entries</h3>
              <div className="rounded-lg border bg-card/50 p-2">
                <MoodEntriesCarousel />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Tip: Aim for consistency. A small daily note helps explain dips and spikes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatTile = ({ label, value }) => (
  <div className="rounded-lg border bg-card px-3 py-2 min-w-[130px]">
    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="text-lg font-semibold">{value}</div>
  </div>
);

export default MoodGraph;
