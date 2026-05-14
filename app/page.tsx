import Link from 'next/link'
import { ArrowRight, Shield, Brain, Network, Search } from 'lucide-react'

const FEATURES = [
  {
    icon: Search,
    title: 'Multi-source OSINT',
    body: 'Pivot across VirusTotal, Shodan, AbuseIPDB, passive DNS, certificate transparency, and blockchain in one workspace.',
  },
  {
    icon: Network,
    title: 'Entity graph',
    body: 'Automatically maps relationships between IPs, domains, emails, usernames, and wallets into a navigable force graph.',
  },
  {
    icon: Brain,
    title: 'AI Analyst',
    body: 'Claude-powered analyst summarises threat context, suggests pivot paths, and writes structured reports on demand.',
  },
  {
    icon: Shield,
    title: 'Investigation workspace',
    body: 'Organise entities into named investigations with notes, timeline, pinned indicators, and collaborative threat scoring.',
  },
]

const STACK = [
  ['Runtime',    'Next.js 16 · App Router · Edge-ready'],
  ['AI',         'Anthropic Claude via streaming SSE'],
  ['Graph',      'React Flow (@xyflow/react v12)'],
  ['State',      'Zustand + TanStack Query v5'],
  ['Design',     'Tailwind CSS v4 · Geist Mono · token-first'],
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-surface-base text-text-primary flex flex-col">

      {/* Nav */}
      <nav className="h-10 shrink-0 flex items-center px-6 gap-4 border-b border-border-subtle bg-surface-raised">
        <span className="font-mono text-[12px] text-signal tracking-wide">RAVENPOINT</span>
        <div className="flex-1" />
        <Link
          href="/sessions"
          className="flex items-center gap-1.5 h-6 px-3 border border-border-default text-text-tertiary hover:text-text-primary hover:border-border-strong transition-colors duration-[120ms] font-sans text-[11px]"
          style={{ borderRadius: '2px' }}
        >
          Open workspace
          <ArrowRight size={11} />
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center gap-6 border-b border-border-subtle">
        <div
          className="inline-block font-mono text-[9px] tracking-[0.12em] uppercase text-signal border border-signal px-2 py-0.5 mb-2"
          style={{ borderRadius: '2px' }}
        >
          v0.9.0 · open beta
        </div>

        <h1 className="font-mono text-[36px] leading-[1.1] text-text-primary tracking-tight max-w-xl">
          OSINT with an AI analyst built&nbsp;in
        </h1>

        <p className="font-sans text-[15px] text-text-secondary max-w-md leading-relaxed">
          Ravenpoint is an open-source threat intelligence workspace for solo investigators.
          Pivot across data sources, map entity relationships, and let Claude write your reports.
        </p>

        <div className="flex items-center gap-3 mt-2">
          <Link
            href="/sessions"
            className="flex items-center gap-2 h-8 px-4 bg-signal text-surface-base font-sans text-[13px] font-medium hover:opacity-90 transition-opacity duration-[120ms]"
            style={{ borderRadius: '2px' }}
          >
            Launch workspace
            <ArrowRight size={13} />
          </Link>
          <a
            href="https://github.com/xcodenexus/Ravenpoint"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 h-8 px-4 border border-border-default text-text-secondary font-sans text-[13px] hover:text-text-primary hover:border-border-strong transition-colors duration-[120ms]"
            style={{ borderRadius: '2px' }}
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* Terminal preview strip */}
      <section className="px-6 py-10 border-b border-border-subtle flex justify-center">
        <div
          className="w-full max-w-2xl bg-surface-raised border border-border-default overflow-hidden"
          style={{ borderRadius: '2px' }}
        >
          <div className="flex items-center gap-2 h-8 px-4 border-b border-border-subtle bg-surface-overlay">
            <span className="w-2 h-2 rounded-full bg-danger shrink-0" />
            <span className="w-2 h-2 rounded-full bg-warning shrink-0" />
            <span className="w-2 h-2 rounded-full bg-signal shrink-0" />
            <span className="font-mono text-[10px] text-text-tertiary ml-2">ravenpoint — entity analysis</span>
          </div>
          <div className="p-4 font-mono text-[12px] leading-loose">
            <div><span className="text-text-tertiary">›</span> <span className="text-signal">investigate</span> <span className="text-text-primary">94.102.49.193</span></div>
            <div className="text-text-tertiary ml-4">↳ VirusTotal  <span className="text-danger">67/94 detections</span></div>
            <div className="text-text-tertiary ml-4">↳ Shodan      <span className="text-text-secondary">ports 22, 80, 443, 8080</span></div>
            <div className="text-text-tertiary ml-4">↳ AbuseIPDB   <span className="text-warning">abuse score 98 · 1.2k reports</span></div>
            <div className="text-text-tertiary ml-4">↳ Passive DNS <span className="text-text-secondary">12 domains resolved here</span></div>
            <div className="mt-2"><span className="text-text-tertiary">›</span> <span className="text-signal">analyst</span> <span className="text-text-primary">summarise</span></div>
            <div className="text-text-secondary ml-4 max-w-md">
              This IP shows strong indicators of command-and-control infrastructure.
              High detection ratio, active abuse reports, and multiple domains resolving
              to this host suggest a coordinated threat actor…
              <span className="inline-block w-1.5 h-3.5 bg-signal ml-0.5 align-middle animate-[cursor-blink_1s_step-end_infinite]" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 border-b border-border-subtle">
        <div className="max-w-3xl mx-auto">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-text-tertiary mb-8">Capabilities</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border-subtle border border-border-subtle">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-surface-base p-6 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Icon size={14} className="text-signal shrink-0" />
                  <span className="font-mono text-[13px] text-text-primary">{title}</span>
                </div>
                <p className="font-sans text-[13px] text-text-tertiary leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="px-6 py-16 border-b border-border-subtle">
        <div className="max-w-3xl mx-auto">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-text-tertiary mb-8">Tech stack</p>
          <div className="flex flex-col divide-y divide-border-subtle border border-border-subtle max-w-lg">
            {STACK.map(([k, v]) => (
              <div key={k} className="flex items-center h-9 px-4 gap-6">
                <span className="font-mono text-[11px] text-text-tertiary w-20 shrink-0">{k}</span>
                <span className="font-sans text-[13px] text-text-secondary">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 flex flex-col items-center gap-6 text-center">
        <p className="font-mono text-[11px] text-text-tertiary uppercase tracking-[0.1em]">
          Open source · MIT license
        </p>
        <h2 className="font-mono text-[22px] text-text-primary">Start investigating</h2>
        <Link
          href="/sessions"
          className="flex items-center gap-2 h-8 px-5 bg-signal text-surface-base font-sans text-[13px] font-medium hover:opacity-90 transition-opacity duration-[120ms]"
          style={{ borderRadius: '2px' }}
        >
          Open workspace
          <ArrowRight size={13} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="h-8 shrink-0 border-t border-border-subtle flex items-center px-6 gap-4 bg-surface-raised mt-auto">
        <span className="font-mono text-[10px] text-text-tertiary">RAVENPOINT v0.9.0</span>
        <div className="flex-1" />
        <a
          href="https://github.com/xcodenexus/Ravenpoint"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] text-text-tertiary hover:text-text-primary transition-colors duration-[120ms]"
        >
          github.com/xcodenexus/Ravenpoint
        </a>
      </footer>

    </main>
  )
}
