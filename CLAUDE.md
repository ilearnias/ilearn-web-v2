# Claude Notes

This project is the iLearn IAS web app. `main` now contains the merged history from the previous `main` SEO/SSR work and the `production` API/content/admin work.

## Branch Context

- Preserve both sides of the merge: `main` brought Vite SSR, page-level SEO, GTM, and server build support.
- `production` brought API-backed content, admin editors, additional program/blog/result pages, video/media helpers, and the Railway backend API configuration.
- Do not replace the merged app with only one branch's older shape.

## Architecture

- Frontend lives in `client/src`.
- Express/server entrypoints live in `server`.
- Shared Drizzle schema lives in `shared/schema.ts`.
- SSR depends on `client/src/entry-server.tsx`, `server/vite.ts`, `server/index.ts`, and the build script in `package.json`.
- API configuration lives in `client/src/config/api.ts`, `client/src/config/apiClient.ts`, and `client/src/config/queryKeys.ts`.

## Commands

- Install dependencies: `npm install`
- Development server: `npm run dev`
- Production build: `npm run build`
- Production start after build: `npm run start`
- Type check: `npm run check`

`npm run build` is the current deployment verification command and has passed on the merged branch. `npm run check` currently reports existing strict TypeScript issues in admin/media/server files, so treat those separately from merge/deploy readiness.

## Deployment Notes

- The production build emits the client to `dist/public`, the SSR entry to `dist/server`, and the server bundle to `dist/index.js`.
- `npm run start` runs `NODE_ENV=production node dist/index.js`.
- Server/database code expects `DATABASE_URL` when DB-backed routes are used.
- Keep Google Tag Manager `GTM-M8M6JN78` and the current Meta Pixel setup from `client/index.html`; do not reintroduce the older standalone GA4 `gtag` snippet.

