import { createFileRoute } from "@tanstack/react-router";
import { EngineDiagnostics } from "@/components/ashfall/EngineDiagnostics";
import { HeadlessReport } from "@/components/ashfall/HeadlessReport";

const TITLE = "ASHFALL — Engine Foundation";
const DESCRIPTION =
  "Deterministic fixed-timestep simulation core for ASHFALL: live tick loop, seeded RNG and headless determinism checks.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="border-b border-border pb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            Phase 1 · Job 001
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">ASHFALL</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Engine foundation only — lifecycle, fixed-timestep simulation, seeded randomness,
            event dispatch and performance measurement. No gameplay yet.
          </p>
        </header>

        <EngineDiagnostics />
        <HeadlessReport />

        <footer className="border-t border-border pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Next: Job 002 — world coordinate system
        </footer>
      </div>
    </main>
  );
}
