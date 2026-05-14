# RAVENPOINT

> Open-source OSINT investigation platform with an AI analyst built in.

Ravenpoint is a dark-theme, keyboard-first threat intelligence workspace for solo investigators. Pivot across OSINT data sources, visualise entity relationships as a force graph, and generate threat reports with a streaming Claude analyst — all in one Next.js application.

## Features

| Capability | Details |
|---|---|
| **Multi-source OSINT** | VirusTotal, Shodan, AbuseIPDB, passive DNS, certificate transparency, blockchain |
| **Entity graph** | React Flow force graph mapping IPs, domains, emails, usernames, wallets |
| **AI Analyst** | Claude-powered streaming analyst — summarise, pivot suggestions, full reports |
| **Investigation workspace** | Named investigations with notes, timeline, pinned indicators, threat scoring |
| **Command palette** | `⌘K` global search across entities, investigations, and actions |
| **Keyboard nav** | `j/k` row navigation, `g e` / `g g` go-to shortcuts, `⌘J` analyst toggle |

## Tech Stack

- **Next.js 16.2** — App Router, React Server Components, streaming API routes
- **React 19.2 / TypeScript** strict mode
- **Tailwind CSS v4** — `@theme` CSS-first configuration, token-first design
- **Geist Mono + Geist Sans** — all identifiers rendered in monospace
- **Zustand** — client state (UI flags, investigation notes)
- **TanStack Query v5** — server state and caching
- **@xyflow/react v12** — React Flow graph canvas
- **@anthropic-ai/sdk** — Anthropic Claude streaming via SSE

## Quick Start

```bash
# Install dependencies
npm install

# Copy env template and fill in your keys
cp .env.local.example .env.local

# Run dev server
npm run dev
# → http://localhost:3000
```

## Environment Variables

Create `.env.local` with the following:

```env
# Required for AI Analyst feature
ANTHROPIC_API_KEY=sk-ant-...

# Optional OSINT integrations
VIRUSTOTAL_API_KEY=
SHODAN_API_KEY=
ABUSEIPDB_API_KEY=
RF_API_TOKEN=
```

API keys can also be configured in the app at **Settings → API Keys**.

## Project Structure

```
app/
  (workspace)/          # Sidebar + topbar layout
    sessions/           # Investigation list
    investigation/[id]/ # Investigation detail (entities, graph, notes)
    entity/[type]/[value]/ # Entity profile (infra, exposure, social, timeline)
    graph/[id]/         # Full-screen force graph
    settings/           # API keys, data sources, shortcuts, about
  api/
    analyst/            # Streaming SSE route → Anthropic API
  page.tsx              # Landing page
components/
  ui/                   # Design system (Button, Input, Tabs, DataTable, etc.)
  entity/               # Entity profile sub-components
  graph/                # React Flow canvas + node types + panel
  analyst/              # AI Analyst streaming panel
lib/
  types/                # Shared TypeScript types (entity, whois, dns, cert, etc.)
  stores/               # Zustand stores (ui, investigation)
  queries/              # TanStack Query hooks
  services/             # Static mock data layer (swap for real APIs)
  utils/                # cn(), misc helpers
styles/
  tokens.css            # Design token CSS variables (surfaces, text, signal, semantic)
```

## Data Layer

The current data layer is a **static mock** — JSON maps in `lib/services/` — designed to be replaced with real OSINT API calls. Every mock service file contains a `// LATER: fetch()` comment marking the swap point. No backend database is required; the app is fully client-rendered against a mocked API shape.

## Design System

Sharp corners only (max 6px radius). Token hierarchy:

```
surface-base → surface-raised → surface-overlay → surface-hover
text-primary → text-secondary → text-tertiary → text-disabled
signal (green) · danger (red) · warning (amber) · info (blue)
```

Motion: 120ms micro-interactions, 180ms panels, 240ms modals.

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `⌘K` | Open command palette |
| `⌘J` | Toggle AI Analyst panel |
| `j / ↓` | Navigate table row down |
| `k / ↑` | Navigate table row up |
| `↵` | Open selected row |
| `Esc` | Close dialog / palette / panel |
| `⌘C` | Copy entity value |
| `g e` | Go to Sessions list |
| `g g` | Go to Graph view |

## License

MIT — see [LICENSE](LICENSE) for details.
