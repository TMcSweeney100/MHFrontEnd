// src/Components/alcohol/AlcoholReview.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContexts";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { get, post } from "@/lib/api";
import { toast } from "sonner";

const GET_PATH  = (uid) => `/alcohol/profile/${uid}`;
const SAVE_PATH = `/alcohol/profile`; // POST create/update

const LIMITS = { why: 300, positives: 300, who: 80 };

export default function AlcoholReview() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [edit, setEdit]       = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState("");

  const [form, setForm] = useState({
    why: "",
    positives: "",
    who: "",
    targetDays: 0,
    startDate: "", // "YYYY-MM-DD"
  });

  const [initial, setInitial] = useState(form);

  // --- load profile ---
  useEffect(() => {
    const run = async () => {
      if (!currentUser?.uid) return;
      setLoading(true);
      setError("");
      try {
        const p = await get(GET_PATH(currentUser.uid));
        const loaded = {
          why:        p?.why ?? "",
          positives:  p?.positives ?? "",
          who:        p?.who ?? "",
          targetDays: Number(p?.targetDays ?? 0),
          startDate:  p?.startDate ?? "",
        };
        setForm(loaded);
        setInitial(loaded);
        setEdit(false);
      } catch {
        // 404 -> no profile yet: start in edit mode
        setEdit(true);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [currentUser]);

  // --- helpers ---
  const change = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: k === "targetDays" ? e.target.value.replace(/[^\d]/g, "") : e.target.value }));

  const dirty = useMemo(
    () => JSON.stringify({ ...form, targetDays: Number(form.targetDays || 0) }) !==
          JSON.stringify({ ...initial, targetDays: Number(initial.targetDays || 0) }),
    [form, initial]
  );

  const isValid = useMemo(() => {
    const td = Number(form.targetDays || 0);
    return (
      td >= 0 &&
      form.why.length <= LIMITS.why &&
      form.positives.length <= LIMITS.positives &&
      form.who.length <= LIMITS.who
    );
  }, [form]);

  const onCancel = () => {
    if (dirty && !confirm("Discard your unsaved changes?")) return;
    setForm(initial);
    setEdit(false);
  };

  const onSave = async () => {
    if (!currentUser?.uid || saving || !isValid) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        userId: currentUser.uid,
        why: form.why.trim(),
        positives: form.positives.trim(),
        who: form.who.trim(),
        targetDays: Number(form.targetDays || 0),
        startDate: form.startDate || null,
      };
      await post(SAVE_PATH, payload);
      setInitial(payload);
      setEdit(false);
      const ts = new Date().toISOString();
      setLastSavedAt(ts);
      toast.success("Motivation saved");
    } catch (e) {
      console.error(e);
      setError("Save failed. Please try again.");
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  // Ctrl/Cmd+S to save when editing
  const keyHandler = useCallback(
    (e) => {
      const key = e.key?.toLowerCase();
      if (edit && ( (e.ctrlKey && key === "s") || (e.metaKey && key === "s") )) {
        e.preventDefault();
        onSave();
      }
    },
    [edit, onSave]
  );

  useEffect(() => {
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [keyHandler]);

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
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Review & Update Motivation</h2>
              <p className="text-sm text-muted-foreground">
                Keep these reasons handy—edit them any time.
              </p>
            </div>
            <Badge variant="secondary">{edit ? "Editing" : "Viewing"}</Badge>
          </div>

          {!!error && <div className="text-sm text-red-600">{error}</div>}

          {edit && dirty && (
            <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm">
              You have unsaved changes.
            </div>
          )}

          <Separator />

          {/* FORM / READ */}
          <div className="space-y-5">
            {/* Why */}
            <div className="space-y-2">
              <Label htmlFor="why">Why are you doing this?</Label>
              {edit ? (
                <>
                  <Textarea
                    id="why"
                    value={form.why}
                    onChange={change("why")}
                    maxLength={LIMITS.why}
                    className="min-h-[90px]"
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {form.why.length}/{LIMITS.why}
                  </div>
                </>
              ) : (
                <p className="rounded-md border p-3 bg-muted/40 whitespace-pre-wrap">{form.why || "—"}</p>
              )}
            </div>

            {/* Positives */}
            <div className="space-y-2">
              <Label htmlFor="positives">What are the positives?</Label>
              {edit ? (
                <>
                  <Textarea
                    id="positives"
                    value={form.positives}
                    onChange={change("positives")}
                    maxLength={LIMITS.positives}
                    className="min-h-[90px]"
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {form.positives.length}/{LIMITS.positives}
                  </div>
                </>
              ) : (
                <p className="rounded-md border p-3 bg-muted/40 whitespace-pre-wrap">{form.positives || "—"}</p>
              )}
            </div>

            {/* Who */}
            <div className="space-y-2">
              <Label htmlFor="who">Who are you doing this for?</Label>
              {edit ? (
                <>
                  <Input
                    id="who"
                    value={form.who}
                    onChange={change("who")}
                    maxLength={LIMITS.who}
                    placeholder="e.g. Myself, family, partner…"
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {form.who.length}/{LIMITS.who}
                  </div>
                </>
              ) : (
                <p className="rounded-md border p-3 bg-muted/40">{form.who || "—"}</p>
              )}
            </div>

            {/* Target days */}
            <div className="space-y-2">
              <Label htmlFor="targetDays">Target number of days</Label>
              {edit ? (
                <Input
                  id="targetDays"
                  inputMode="numeric"
                  pattern="\d*"
                  value={String(form.targetDays)}
                  onChange={change("targetDays")}
                />
              ) : (
                <p className="rounded-md border p-3 bg-muted/40">{Number(form.targetDays) || 0}</p>
              )}
            </div>

            {/* Start date (optional) */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start date (optional)</Label>
              {edit ? (
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate || ""}
                  onChange={change("startDate")}
                />
              ) : (
                <p className="rounded-md border p-3 bg-muted/40">{form.startDate || "—"}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* ACTIONS */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {!edit ? (
              <>
                <Button onClick={() => setEdit(true)}>Edit</Button>
                <Button variant="outline" onClick={() => navigate("/alcohol")}>Back</Button>
                {lastSavedAt && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Last saved {new Date(lastSavedAt).toLocaleString()}
                  </span>
                )}
              </>
            ) : (
              <>
                <Button onClick={onSave} disabled={saving || !dirty || !isValid}>
                  {saving ? "Saving…" : "Save"}
                </Button>
                <Button variant="outline" onClick={onCancel} disabled={saving}>
                  Cancel
                </Button>
                <span className="ml-auto text-xs text-muted-foreground">
                  Tip: Press <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>S</kbd> to save
                </span>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
