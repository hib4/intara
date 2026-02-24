function App() {
  return (
    <div className="min-h-screen bg-background p-8 font-sans text-foreground">
      {/* Header */}
      <header className="mx-auto max-w-3xl space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Intara Design System
        </h1>
        <p className="text-muted-foreground">
          Ocean Blue &middot; Warm Orange &middot; Plus Jakarta Sans &middot; 8
          px grid
        </p>
      </header>

      <main className="mx-auto mt-8 max-w-3xl space-y-8">
        {/* Colour swatches */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Colour Tokens</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Swatch
              label="Primary"
              className="bg-primary text-primary-foreground"
            />
            <Swatch
              label="CTA (Orange)"
              className="bg-cta text-cta-foreground"
            />
            <Swatch
              label="Background"
              className="bg-background border text-foreground"
            />
            <Swatch label="Muted" className="bg-muted text-muted-foreground" />
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition hover:opacity-90">
              Primary Action
            </button>
            <button className="rounded-lg bg-cta px-6 py-3 font-medium text-cta-foreground shadow-sm transition hover:opacity-90">
              Create AI Bot
            </button>
            <button className="rounded-lg border border-border bg-card px-6 py-3 font-medium text-foreground transition hover:bg-muted">
              Secondary
            </button>
          </div>
        </section>

        {/* Card */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Card</h2>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-card-foreground">
              My First AI Bot
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Trained on 24 documents &middot; Last active 2 hours ago
            </p>
            <button className="mt-4 rounded-lg bg-cta px-4 py-2 text-sm font-medium text-cta-foreground transition hover:opacity-90">
              Open Dashboard &rarr;
            </button>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Typography Scale</h2>
          <div className="space-y-2">
            <p className="text-4xl font-bold">Heading 1 — Plus Jakarta Sans</p>
            <p className="text-2xl font-semibold">Heading 2</p>
            <p className="text-xl font-medium">Heading 3</p>
            <p className="text-base">
              Body text in slate-900 on a slate-50 background for maximum
              readability and reduced eye strain.
            </p>
            <p className="text-sm text-muted-foreground">
              Muted helper text for secondary information.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function Swatch({ label, className }: { label: string; className: string }) {
  return (
    <div
      className={`flex h-20 items-center justify-center rounded-lg text-sm font-medium ${className}`}
    >
      {label}
    </div>
  );
}

export default App;
