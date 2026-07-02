# Ignite — Frontend

A dark, modern marketing site + auth flow + dashboard for the FastAPI
SaaS Starter Kit. Built with React, React Router, and Tailwind CSS.

## What's included

- Landing page (hero, features, stack, pricing)
- Login / Register pages wired to the backend's `/auth` endpoints
- A dashboard showing account + subscription status

## Quick start

```bash
cp .env.example .env
# Edit .env if your backend isn't running on localhost:8000

npm install
npm run dev
```

Opens at `http://localhost:5173`. Make sure the backend (see the root
README) is running first, since login/register call it directly.

## Design tokens

| Token | Value | Use |
|---|---|---|
| `void` | `#0D0B14` | Page background |
| `surface` / `surface-2` | `#171420` / `#211C2E` | Cards, panels |
| `ember` → `gold` | `#FF6B4A` → `#FFC24A` | Primary gradient, CTAs |
| `violet` | `#8B7CFF` | Secondary accent |
| Display font | Clash Display | Headlines |
| Body font | Satoshi | Body copy |
| Mono font | JetBrains Mono | Code, labels, data |

Customize colors and fonts in `tailwind.config.js`.

## Build for production

```bash
npm run build
```

Outputs static files to `dist/` — deploy to Vercel, Netlify, or any
static host. Set `VITE_API_URL` to your production backend URL before
building.
