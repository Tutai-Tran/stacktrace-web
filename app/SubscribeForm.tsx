"use client";
// Subscribe form -> POST /api/subscribe (Resend add-contact, server-side).
// Keeps the existing hero/footer class names so styling is unchanged.
import { useState, type FormEvent } from "react";

export function SubscribeForm({ variant = "hero" }: { variant?: "hero" | "footer" }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  const isFooter = variant === "footer";
  const formCls = isFooter ? "footer-form" : "fade d2 cta-form";
  const inputCls = isFooter ? "footer-input inp-dark" : "cta-input";
  const btnCls = isFooter ? "footer-btn mag" : "cta-btn mag";
  const id = isFooter ? "fe" : "he";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) {
        setState("ok"); setMsg("You're in. Check your inbox to confirm."); setEmail("");
      } else {
        setState("error"); setMsg(d.error || "Could not subscribe, try again.");
      }
    } catch {
      setState("error"); setMsg("Could not subscribe, try again.");
    }
  }

  if (state === "ok") {
    return <p className={isFooter ? "footer-note" : "note"} role="status">{msg}</p>;
  }

  return (
    <form className={formCls} onSubmit={onSubmit}>
      <label className="sr-only" htmlFor={id} style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Email address</label>
      <input
        id={id} className={inputCls} type="email" name="email" required
        placeholder="you@company.com" autoComplete="email"
        value={email} onChange={(e) => setEmail(e.target.value)} disabled={state === "loading"}
      />
      <button type="submit" className={btnCls} disabled={state === "loading"}>
        {state === "loading" ? "…" : "Get the free weekly →"}
      </button>
      {state === "error" && (
        <span role="alert" style={{ display: "block", marginTop: 6, fontSize: 13, color: "#ff5c5c" }}>{msg}</span>
      )}
    </form>
  );
}
