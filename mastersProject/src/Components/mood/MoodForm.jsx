import React, { useState } from "react"
import { useAuth } from "../contexts/authContexts"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandList,
  CommandEmpty
} from "@/components/ui/command"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import ComboboxDemo from "../combobox-demo"
import { ComboboxPopoverTags } from "../ui/combobox-popover-tags"
import { ComboboxPopoverActivites } from "../ui/combobox-popover-activites"
import { toast } from "sonner"

// ✅ env-driven helper (works on Vercel + local)
import { post } from "@/lib/api";

const MoodForm = () => {
  const auth = useAuth();
  const currentUser = auth.currentUser;
  
  const [moodScore, setMoodScore] = useState(5) // default value
  const [notes,setNotes] = useState(" ");

  const [selectedTags, setSelectedTags] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const moodEntry = {
      userId: currentUser.uid,
      moodInNum: moodScore,
      notes,
      timeStamp: new Date().toISOString(),
      tags: selectedTags
    }

    try {
      // ⬇️ CHANGED: use env-based helper instead of hardcoded localhost
      const data = await post(`/moodLog`, moodEntry);

      console.log("Submitting:", moodEntry);
      console.log("Successfully saved", data);
      toast("Your day has been logged")
    } catch (error) {
      console.log("It didn't save", error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-2xl border bg-card shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold tracking-tight">
              How are you feeling today?
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Log your mood, add a couple of tags, and jot a quick note.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Mood score */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">Mood score</label>
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{moodScore}</span> / 10
                </span>
              </div>

              <Slider
                value={[moodScore]}
                min={1}
                max={10}
                step={1}
                onValueChange={(val) => setMoodScore(val[0])}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground">
                1 = very low · 10 = excellent
              </p>
            </section>

            {/* Tags */}
            <section className="space-y-3">
              <label className="font-medium">Tags</label>
              <ComboboxPopoverTags
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
              />

              {!!selectedTags.length && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer rounded-full px-3 py-1 transition hover:ring-2 hover:ring-primary/30"
                      onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                      title="Remove tag"
                    >
                      {tag} <span className="ml-1 opacity-70">✕</span>
                    </Badge>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Click a tag to remove it.
              </p>
            </section>

            {/* Notes */}
            <section className="space-y-3">
              <Label htmlFor="notes">Notes for today</Label>
              <Textarea
                id="notes"
                placeholder="What affected your mood?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[110px] resize-y"
              />
              <p className="text-xs text-muted-foreground">
                A sentence or two is perfect.
              </p>
            </section>

            {/* Submit */}
            <Button type="submit" className="w-full h-11 text-base">
              Log day
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MoodForm
