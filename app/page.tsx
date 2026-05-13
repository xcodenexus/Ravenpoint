export default function Home() {
  return (
    <main className="min-h-screen bg-surface-base flex items-center justify-center px-8">
      <div className="w-full max-w-md space-y-10">

        {/* Session marker */}
        <p className="text-[11px] uppercase tracking-[0.08em] font-sans text-text-tertiary">
          Session 1 — Visual Identity
        </p>

        {/* Heading: Geist Sans */}
        <div className="space-y-2">
          <h1 className="text-[20px] font-medium font-sans text-text-primary leading-tight">
            Ravenpoint
          </h1>
          <p className="text-[14px] font-sans text-text-secondary">
            OSINT, with an analyst built in.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-border-subtle" />

        {/* Identifier: Geist Mono */}
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.08em] font-sans text-text-tertiary">
            Target identifier
          </p>
          <div
            className="flex items-center gap-3 px-4 py-3 bg-surface-raised border border-border-default"
            style={{ borderRadius: "4px" }}
          >
            <span className="text-[13px] font-mono text-text-primary">
              192.0.2.1
            </span>
            <span className="text-[11px] font-mono text-text-tertiary ml-auto">
              IPv4
            </span>
          </div>
          <div
            className="flex items-center gap-3 px-4 py-3 bg-surface-raised border border-border-default"
            style={{ borderRadius: "4px" }}
          >
            <span className="text-[13px] font-mono text-text-primary">
              maltego.com
            </span>
            <span className="text-[11px] font-mono text-text-tertiary ml-auto">
              DOMAIN
            </span>
          </div>
        </div>

        {/* Signal color proof */}
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.08em] font-sans text-text-tertiary">
            Signal
          </p>
          <div className="flex items-center gap-3">
            <span
              className="block w-2 h-2 bg-signal shrink-0"
              style={{ borderRadius: "2px" }}
            />
            <span className="text-[13px] font-mono text-signal">
              ACTIVE INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Token swatches: surfaces */}
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.08em] font-sans text-text-tertiary">
            Surface tokens
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "base", bg: "bg-surface-base", border: true },
              { label: "raised", bg: "bg-surface-raised", border: false },
              { label: "overlay", bg: "bg-surface-overlay", border: false },
              { label: "hover", bg: "bg-surface-hover", border: false },
            ].map(({ label, bg, border }) => (
              <div key={label} className="space-y-1">
                <div
                  className={`h-8 ${bg} ${border ? "border border-border-subtle" : ""}`}
                  style={{ borderRadius: "2px" }}
                />
                <p className="text-[10px] font-mono text-text-tertiary">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
