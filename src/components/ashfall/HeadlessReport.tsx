import { useMemo, useState } from "react";
import { runHeadless, type HeadlessReport as Report } from "@/engine";

/**
 * Runs the headless harness twice with the same seed and once with a different
 * seed, in the browser, as live proof of determinism. Also reports throughput.
 */
export function HeadlessReport() {
  const [ticks, setTicks] = useState(10_000);
  const [runId, setRunId] = useState(0);

  const { a, b, c } = useMemo(() => {
    void runId;
    return {
      a: runHeadless(ticks, { seed: "ashfall" }),
      b: runHeadless(ticks, { seed: "ashfall" }),
      c: runHeadless(ticks, { seed: "emberfall" }),
    };
  }, [ticks, runId]);

  const deterministic = a.checksum === b.checksum && a.checksum !== c.checksum;

  return (
    <div className="panel">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Headless determinism run
        </h2>
        <span
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: deterministic ? "var(--ember)" : "var(--destructive)" }}
        >
          {deterministic ? "deterministic" : "divergent"}
        </span>
      </div>

      <div className="divide-y divide-border">
        <Row label='seed "ashfall" — run 1' report={a} />
        <Row label='seed "ashfall" — run 2' report={b} />
        <Row label='seed "emberfall"' report={c} />
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

function Row({ label, report }: { label: string; report: Report }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-4 py-3">
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-sm" style={{ color: "var(--ember)" }}>
        checksum {report.checksum.toString(16).padStart(8, "0")}
      </span>
      <span className="font-mono text-xs text-muted-foreground">
        {report.wallMs.toFixed(1)}ms · {Math.round(report.ticksPerSecond).toLocaleString()} ticks/s
      </span>
    </div>
  );
}