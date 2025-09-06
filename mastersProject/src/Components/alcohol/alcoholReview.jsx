import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContexts";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import { get, post } from "@/lib/api"; // uses VITE_API_BASE_URL

const GET_PATH  = (uid) => `/alcohol/profile/${uid}`;
const SAVE_PATH = `/alcohol/profile`; // POST create/update

export default function AlcoholReview() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [edit, setEdit]       = useState(false);

  const [form, setForm] = useState({
    why: "",
    positives: "",
    who: "",
    targetDays: 0,
  });

  useEffect(() => {
    const run = async () => {
      if (!currentUser?.uid) return;
      setLoading(true);
      setError("");
      try {
        const p = await get(GET_PATH(currentUser.uid));
        setForm({
          why:        p?.why ?? "",
          positives:  p?.positives ?? "",
          who:        p?.who ?? "",
          targetDays: Number(p?.targetDays ?? 0),
        });
        setEdit(false);
      } catch (e) {
        // if no profile yet (404 from our api.js throws), start in edit mode
        setEdit(true);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [currentUser]);

  const change = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!currentUser?.uid) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        userId: currentUser.uid,
        why: form.why,
        positives: form.positives,
        who: form.who,
        targetDays: Number(form.targetDays || 0),
        // createdAt/startDate handled by backend if needed
      };
      await post(SAVE_PATH, payload);
      setEdit(false);
    } catch (e) {
      console.error(e);
      setError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <div className="mx-auto w-full max-w-2xl">
        <Card className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Review & Update Motivation</h2>
            <p className="text-sm text-muted-foreground">
              These are the motivations you set when starting your plan.
            </p>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="why">Why are you doing this?</Label>
              {edit ? (
                <Textarea id="why" value={form.why} onChange={change("why")} />
              ) : (
                <p className="rounded-md border p-3 bg-muted/40">{form.why || "—"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="positives">What are the positives?</Label>
              {edit ? (
                <Textarea id="positives" value={form.positives} onChange={change("positives")} />
              ) : (
                <p className="rounded-md border p-3 bg-muted/40">{form.positives || "—"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="who">Who are you doing this for?</Label>
              {edit ? (
                <Input id="who" value={form.who} onChange={change("who")} />
              ) : (
                <p className="rounded-md border p-3 bg-muted/40">{form.who || "—"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDays">Target number of days</Label>
              {edit ? (
                <Input
                  id="targetDays"
                  type="number"
                  min={0}
                  value={form.targetDays}
                  onChange={change("targetDays")}
                />
              ) : (
                <p className="rounded-md border p-3 bg-muted/40">{form.targetDays || 0}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            {!edit ? (
              <>
                <Button onClick={() => setEdit(true)}>Edit</Button>
                <Button variant="outline" onClick={() => navigate("/alcohol")}>Back</Button>
              </>
            ) : (
              <>
                <Button onClick={save} disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </Button>
                <Button variant="outline" onClick={() => setEdit(false)} disabled={saving}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
