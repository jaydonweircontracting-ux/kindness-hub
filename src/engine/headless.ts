/**
 * Headless harness — runs the engine with no renderer. Used by tests,
 * benchmarks and the in-app diagnostics panel to prove determinism.
 */
import { Engine, type System } from "./core/engine";
import type { EngineConfig } from "./core/config";
import { now } from "./core/perf";

export interface HeadlessReport {
  ticks: number;
  simTime: number;
  wallMs: number;
  ticksPerSecond: number;
  seed: number;
  /** Checksum of the run — identical seed + inputs must give identical value. */
  checksum: number;
  counters: Record<string, { last: number; avg: number; max: number }>;
}

/**
 * A trivial deterministic system used to verify the loop end-to-end without
 * any gameplay: it advances a checksum from its own RNG stream every tick.
 */
export class ChecksumSystem implements System {
  readonly name = "checksum";
  value = 0;
  private stream = 0;

  init(engine: Engine): void {
    this.stream = engine.rng.derive("checksum").seed;
  }

  tick(engine: Engine, _dt: number): void {
    const roll = engine.rng.derive(`checksum:${engine.tickCount}`).int(0, 0xffff);
    this.value = (Math.imul(this.value ^ roll, 0x01000193) ^ this.stream) >>> 0;
    if (engine.tickCount % 32 === 0) {
      engine.events.emit("engine.heartbeat", { tick: engine.tickCount }, engine.tickCount);
    }
  }
}

export function runHeadless(
  ticks: number,
  overrides: Partial<EngineConfig> = {},
): HeadlessReport {
  const engine = new Engine({ ...overrides, headless: true });
  const checksum = new ChecksumSystem();
  engine.add(checksum);

  const start = now();
  engine.runTicks(ticks);
  const wallMs = now() - start;

  return {
    ticks: engine.tickCount,
    simTime: engine.simTime,
    wallMs,
    ticksPerSecond: wallMs > 0 ? (engine.tickCount / wallMs) * 1000 : Infinity,
    seed: engine.rng.seed,
    checksum: checksum.value,
    counters: engine.perf.snapshot(),
  };
}