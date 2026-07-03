// Curated launch content (Issue #1). The weekly pipeline overwrites this file via
// publish.write_next_data so numbers/sample/archive stay fresh. No em-dashes.
import type { SiteData } from "./types";

export const site: SiteData = {
  issueNo: 1,
  issueDate: "JUN 30 2026",
  totalChanges: 117,
  critCount: 1,
  notableCount: 3,
  fyiCount: 104,
  subscribeUrl: "https://stacktraceweekly.beehiiv.com/subscribe",
  critical: {
    tool: "Liveblocks",
    version: "v3.20.1",
    summary:
      "A bug in @liveblocks/client could cause data loss by overwriting room storage with initial values when large WebSocket messages are sent. This is a critical fix for a stable release that users in production must deploy immediately.",
    action:
      "Update to v3.20.1 immediately to prevent data loss from large WebSocket messages overwriting room storage.",
  },
  notable: [
    { tool: "Cloudflare Workers", version: "@cloudflare/vitest-pool-workers@0.18.0", summary: "Adds support for declarative Durable Object exports." },
    { tool: "Cloudflare Workers", version: "@cloudflare/workers-auth@0.4.0", summary: "Opt-in OS keychain storage for OAuth credentials." },
    { tool: "Cloudflare Workers", version: "@cloudflare/vite-plugin@1.43.0", summary: "Declarative Durable Object exports via an exports map." },
  ],
  feed: [
    { name: "@liveblocks/client", version: "v3.20.1", tier: "crit" },
    { name: "@cloudflare/vite-plugin", version: "1.43.0", tier: "not" },
    { name: "next", version: "15.4.1", tier: "fyi" },
    { name: "@cloudflare/workers-auth", version: "0.4.0", tier: "not" },
    { name: "drizzle-orm", version: "0.36.4", tier: "fyi" },
    { name: "@clerk/nextjs", version: "6.9.6", tier: "fyi" },
  ],
  tools: [
    "Stripe", "Supabase", "Neon", "Turso", "Vercel", "Railway", "Cloudflare Workers",
    "Prisma", "Drizzle ORM", "Kysely", "Clerk", "Auth.js", "Better Auth", "Resend",
    "Trigger.dev", "Inngest", "Vercel AI SDK", "OpenAI SDK", "Anthropic SDK", "Next.js",
    "tRPC", "shadcn/ui", "Radix UI", "Tailwind CSS", "Bun", "Deno", "Payload CMS",
    "Directus", "PocketBase", "Liveblocks",
  ],
};
