// Components/contact/contact.jsx
import React, { useMemo, useState } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import { toast } from "sonner";
import { Loader2, Mail, Send, Phone, MapPin } from "lucide-react";
import { useAuth } from "../contexts/authContexts"; // same pattern as Chat/Notes
import { post } from "@/lib/api"; // same env-based helper used elsewhere

const SUPPORT_EMAIL = "tim.mcsweeney.2024@mumail.ie";

function Contact() {
  const { currentUser } = useAuth();

  const [name, setName] = useState(currentUser?.displayName || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);

  const userId = currentUser?.uid ?? "anon";

  const isValid = useMemo(() => {
    const ok =
      name.trim().length >= 2 &&
      /^\S+@\S+\.\S+$/.test(email.trim()) &&
      subject.trim().length >= 3 &&
      message.trim().length >= 10 &&
      consent;
    return ok;
  }, [name, email, subject, message, consent]);

  const buildMailto = () => {
    const body = [
      `Category: ${category}`,
      `From: ${name} (${email})`,
      userId ? `User ID: ${userId}` : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");
    const u = new URL(`mailto:${SUPPORT_EMAIL}`);
    u.searchParams.set("subject", subject || "Contact request");
    u.searchParams.set("body", body);
    return u.toString();
  };

  const clearForm = () => {
    setSubject("");
    setCategory("General");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      toast("Please complete all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Try backend first (you can add a /contact endpoint server-side later)
      await post(`/contact`, {
        userIdString: userId,
        name,
        email,
        subject,
        category,
        message,
        createdAt: new Date().toISOString(),
        consent,
      });

      toast("Message sent — we’ll be in touch.");
      clearForm();
    } catch {
      // Fallback to email if backend route isn’t ready yet
      window.location.href = buildMailto();
      toast("Opening your email app as a fallback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold">Contact us</CardTitle>
            <CardDescription>
              Questions, feedback, or a quick bug report — we’re listening.
            </CardDescription>

            {/* Quick info / safety box */}
            <div className="mt-2 rounded-lg border bg-muted/40 p-3 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Note</Badge>
                <span>
                  If you’re in immediate danger, call emergency services (112/999 in Ireland).
                  This form isn’t monitored for crises.
                </span>
              </div>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>General</option>
                    <option>Account</option>
                    <option>Bug report</option>
                    <option>Feature request</option>
                    <option>Content issue</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Short summary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what’s up — steps to reproduce, expected vs actual, or your idea."
                  className="min-h-[160px]"
                  required
                />
                <div className="mt-1 text-xs text-muted-foreground">
                  Minimum 10 characters.
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                I agree to be contacted back at this email.
              </label>

              {/* Alt contact options */}
              <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => (window.location.href = `mailto:${SUPPORT_EMAIL}`)}
                    title="Email support"
                    className="h-9"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {SUPPORT_EMAIL}
                  </Button>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>—</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Maynooth University, Co. Kildare</span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={clearForm}
                disabled={loading}
                title="Clear form"
              >
                Clear
              </Button>
              <Button type="submit" disabled={loading || !isValid} title="Send message">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                {loading ? "Sending…" : "Send"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Contact;
