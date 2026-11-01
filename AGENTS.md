# Hermineo

Next.js 16 App Router for "Social Development Events Platform" (`requerment.txt` is authoritative). Source lives under `src/` (`src/app/`, `src/app/api/`, `src/lib/`), not repo root `app/`. `@/*` resolves to repo root (tsconfig). Dependencies include `better-auth`, `@better-auth/mongo-adapter`, `mongodb` — auth/DB stack is present in deps even if not fully wired.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — Next dev on :3000 (owns managed block above).
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`).
- `npx next typegen && npx tsc --noEmit` — typecheck. Run `next typegen` first on clean checkout (`LayoutProps`/`PageProps` generated into `.next/types`; bare `tsc` fails without them).
- `npm run build` — production build with Turbopack.
- Use `npm`; `package-lock.json` only. No test/formatter/CI configured — use lint + typegen/typecheck + build as verification.

## Framework gotchas

- `next.config.ts`: `cacheComponents: true`, `partialPrefetching: true`, `experimental.agentFeedback: true`, Turbopack rule loads `@tailwindcss/turbopack` for `*.css` (no PostCSS config).
- Cache Components: `export const dynamic`, `revalidate`, `fetchCache` are errors. Use `use cache` / `cacheLife` / `cacheTag` with `<Suspense>`, or `export const instant = false` to opt out of instant-nav validation.
- Synchronous IO during prerender (`new Date()`, `Date.now()`, `Math.random()`, `crypto.randomUUID()`) fails build. For event dates compute at request time (inside `<Suspense>` after `connection()`) or in a Client Component; `instant = false` does not suppress this.
- URL-reading hooks (`useSearchParams`, `usePathname`, `useParams`) may need `<Suspense>`.
- Tailwind v4 via `@import "tailwindcss"`, tokens in `src/app/globals.css`. Dark mode uses `data-theme` attribute + `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))`.
- Theme: initialized inline in `src/app/layout.tsx` from `localStorage` key `hermineo-theme` (fallback to system), toggled in `src/app/components/theme-toggle.tsx`, persisted to `localStorage`. Root `<html>` sets `data-theme="light"` by default but script overrides.
- Generated: `next-env.d.ts`, `.next/**`, `*.tsbuildinfo` — don't edit.
- Layout uses `LayoutProps<"/">` (App Router types). Keep imports consistent with `src/` paths.

## Product constraints (`requerment.txt`)

- Requirements: email/password auth + one OAuth provider, protected routes surviving reload, event CRUD, join/joined-events, manage-events, light/dark toggle.
- No Lorem ipsum; no browser `alert()` for errors/success — use custom toasts/dialogs.
- Spec mentions BetterAuth + MongoDB, JWT-protected APIs, separate Express server — deps suggest BetterAuth/MongoDB present; verify wiring before changing stack.
- `README.md` must name site, include live URL, and list >=5 features.
