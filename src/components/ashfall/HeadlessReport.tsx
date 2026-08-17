import { useEffect, useState } from "react";
import { runHeadless, type HeadlessReport as Report } from "@/engine";

/**
 * Runs the headless harness twice with the same seed and once with a different
 * seed, in the browser, as live proof of determinism. Also reports throughput.
 */
export function HeadlessReport() {
  const [ticks, setTicks] = useState(10_000);
  const [runId, setRunId] = useState(0);
  const [runs, setRuns] = useState<{ a: Report; b: Report; c: Report } | null>(null);

  // Runs only in the browser: wall-clock timings differ per run, so rendering
  // them during SSR would guarantee a hydration mismatch.
  useEffect(() => {
    setRuns({
      a: runHeadless(ticks, { seed: "ashfall" }),
      b: runHeadless(ticks, { seed: "ashfall" }),
      c: runHeadless(ticks, { seed: "emberfall" }),
    });
  }, [ticks, runId]);

  const deterministic =
    runs !== null && runs.a.checksum === runs.b.checksum && runs.a.checksum !== runs.c.checksum;

  return (
    <div className="panel">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Headless determinism run
        </h2>
        <span
          className="font-mono text-xs uppercase tracking-widest"
          style={{
            color: !runs ? "var(--ash)" : deterministic ? "var(--ember)" : "var(--destructive)",
          }}
        >
          {!runs ? "running" : deterministic ? "deterministic" : "divergent"}
        </span>
      </div>

      <div className="divide-y divide-border">
        <Row label='seed "ashfall" — run 1' report={runs?.a} />
        <Row label='seed "ashfall" — run 2' report={runs?.b} />
        <Row label='seed "emberfall"' report={runs?.c} />
      </div>

      <div className="flex gap-px border-t border-border bg-border">
        {[1_000, 10_000, 100_000].map((n) => (
          <button
            key={n}
            onClick={() => {
              setTicks(n);
              setRunId((i) => i + 1);
            }}
            className="flex-1 bg-card px-3 py-3 font-mono text-xs tracking-widest transition-colors hover:bg-secondary"
            style={{ color: n === ticks ? "var(--ember)" : undefined }}
          >
            {n.toLocaleString()} ticks
          </button>
        ))}
      </div>
    </div>
  );
}

function Row({ label, report }: { label: string; report: Report | undefined }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-4 py-3">
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-sm" style={{ color: "var(--ember)" }}>
        {report ? `checksum ${report.checksum.toString(16).padStart(8, "0")}` : "checksum ————————"}
      </span>
      <span className="font-mono text-xs text-muted-foreground">
        {report
          ? `${report.wallMs.toFixed(1)}ms · ${Math.round(report.ticksPerSecond).toLocaleString()} ticks/s`
          : "—"}
      </span>
    </div>
  );
}