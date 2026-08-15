import { useEffect, useRef, useState } from "react";
import { Engine, type System } from "@/engine";

/**
 * A deliberately trivial system: it exists only to prove the loop dispatches
 * work every fixed tick and that events flow. No gameplay.
 */
class HeartbeatSystem implements System {
  readonly name = "heartbeat";
  beats = 0;
  tick(engine: Engine): void {
    if (engine.tickCount % 30 === 0) {
      engine.events.emit("engine.heartbeat", { tick: engine.tickCount }, engine.tickCount);
    }
  }
}

interface Readout {
  state: string;
  tick: number;
  simTime: number;
  tickMs: number;
  frameMs: number;
  fps: number;
  beats: number;
  events: number;
}

const EMPTY: Readout = {
  state: "created",
  tick: 0,
  simTime: 0,
  tickMs: 0,
  frameMs: 0,
  fps: 0,
  beats: 0,
  events: 0,
};

export function EngineDiagnostics() {
  const engineRef = useRef<Engine | null>(null);
  const [readout, setReadout] = useState<Readout>(EMPTY);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const engine = new Engine({ seed: "ashfall", ticksPerSecond: 30, logLevel: "warn" });
    const heartbeat = new HeartbeatSystem();
    engine.add(heartbeat);
    engine.events.on("engine.heartbeat", () => {
      heartbeat.beats++;
    });
    engineRef.current = engine;

    let last = 0;
    engine.start((e) => {
      const t = e.perf.counter("frame.ms").last;
      last += t;
      if (last < 100) return; // throttle React updates to ~10Hz
      last = 0;
      const frameMs = e.perf.counter("frame.ms").avg;
      setReadout({
        state: e.state,
        tick: e.tickCount,
        simTime: e.simTime,
        tickMs: e.perf.counter("tick.ms").avg,
        frameMs,
        fps: frameMs > 0 ? 1000 / frameMs : 0,
        beats: heartbeat.beats,
        events: e.events.totalProcessed,
      });
    });

    return () => {
      engine.stop();
      engineRef.current = null;
    };
  }, []);

  function toggle() {
    const engine = engineRef.current;
    if (!engine) return;
    if (engine.state === "running") {
      engine.pause();
      setRunning(false);
      setReadout((r) => ({ ...r, state: "paused" }));
    } else {
      engine.start();
      setRunning(true);
      setReadout((r) => ({ ...r, state: "running" }));
    }
  }

  function stepOnce() {
    const engine = engineRef.current;
    if (!engine || engine.state === "running") return;
    engine.step();
    setReadout((r) => ({ ...r, tick: engine.tickCount, simTime: engine.simTime }));
  }

  return (
    <div className="panel">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Live engine loop
        </h2>
        <span
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: running ? "var(--ember)" : "var(--ash)" }}
        >
          {readout.state}
        </span>
      </div>

      <dl className="grid grid-cols-2 sm:grid-cols-4">
        <Stat label="Tick" value={readout.tick.toLocaleString()} />
        <Stat label="Sim time" value={`${readout.simTime.toFixed(1)}s`} />
        <Stat label="Tick avg" value={`${readout.tickMs.toFixed(3)}ms`} />
        <Stat label="Frame" value={`${readout.fps.toFixed(0)} fps`} />
        <Stat label="Heartbeats" value={String(readout.beats)} />
        <Stat label="Events" value={String(readout.events)} />
        <Stat label="Seed" value="ashfall" />
        <Stat label="Rate" value="30 tps" />
      </dl>

      <div className="flex gap-px border-t border-border bg-border">
        <button
          onClick={toggle}
          className="flex-1 bg-card px-4 py-3 font-mono text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-secondary"
        >
          {running ? "Pause" : "Resume"}
        </button>
        <button
          onClick={stepOnce}
          disabled={running}
          className="flex-1 bg-card px-4 py-3 font-mono text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-secondary disabled:text-muted-foreground disabled:hover:bg-card"
        >
          Step one tick
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-r border-border px-4 py-3 last:border-r-0">
      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-mono text-lg text-foreground">{value}</dd>
    </div>
  );
}