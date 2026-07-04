// Subscribe endpoint — adds the email to the Resend audience server-side.
// RESEND_API_KEY + RESEND_AUDIENCE_ID are Vercel env vars (never shipped to the client).
// Until they're set, returns 503 so the form can fall back / show a message.
import { NextResponse } from "next/server";

export const runtime = "edge";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  let email = "";
  try {
    email = String((await req.json())?.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "enter a valid email" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const audience = process.env.RESEND_AUDIENCE_ID;
  if (!key || !audience) {
    return NextResponse.json({ ok: false, error: "signups are not live yet" }, { status: 503 });
  }

  try {
    const r = await fetch(`https://api.resend.com/audiences/${audience}/contacts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, unsubscribed: false }),
    });
    // 2xx = added; a duplicate is still a success from the subscriber's point of view.
    if (r.ok || r.status === 409 || r.status === 422) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: "could not subscribe, try again" }, { status: 502 });
  } catch {
    return NextResponse.json({ ok: false, error: "could not subscribe, try again" }, { status: 502 });
  }
}
