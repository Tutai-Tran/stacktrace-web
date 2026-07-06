import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StackTrace Weekly, what changed in 30 dev tools, by severity",
  description:
    "A weekly email digest of what changed in 30 developer tools (Stripe, Next.js, Supabase, the AI SDKs and more), AI-classified CRITICAL / NOTABLE / FYI with plain-English summaries and a grounded what-to-do line.",
  metadataBase: new URL("https://stacktrace-web.vercel.app"),
  openGraph: {
    title: "StackTrace Weekly",
    description: "What changed in your stack this week, classified by severity.",
    url: "https://stacktrace-web.vercel.app",
    siteName: "StackTrace Weekly",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
