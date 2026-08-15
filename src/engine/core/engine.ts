/**
 * ASHFALL engine core — JOB 001.
 *
 * Responsibilities: lifecycle, fixed-timestep simulation, deterministic RNG
 * ownership, logging, configuration, event dispatch, performance counters,
 * and headless operation. NO GAMEPLAY lives here.
 *
 * Simulation time and render time are strictly separated: `step()` advances
 * the simulation by exactly one fixed tick, `advance(realDeltaMs)` decides
 * how many ticks a wall-clock delta is worth.
 */
import { makeConfig, type EngineConfig } from "./config";
import { EventBus } from "./events";
import { Logger } from "./logger";
import { PerfRegistry, now } from "./perf";
import { Rng } from "./rng";

export interface System {
  readonly name: string;
  init?(engine: Engine): void;
  /** Called once per fixed tick. dt is always the same fixed value (seconds). */
  tick(engine: Engine, dt: number): void;
  dispose?(engine: Engine): void;
}

export type EngineState = "created" | "running" | "paused" | "stopped";

export class Engine {
  readonly config: EngineConfig;
  readonly rng: Rng;
  readonly events = new EventBus();
  readonly perf = new PerfRegistry();
  readonly log: Logger;

  private systems: System[] = [];
  private accumulatorMs = 0;
  private frameHandle: number | null = null;
  private lastFrameTime = 0;

  state: EngineState = "created";
  tickCount = 0;
  /** Accumulated simulation time in seconds — never derived from wall clock. */
  simTime = 0;

  constructor(overrides: Partial<EngineConfig> = {}) {
    this.config = makeConfig(overrides);
    this.rng = new Rng(this.config.seed);
    this.log = new Logger(this.config.logLevel, "engine", !this.config.headless);
    this.log.info(`engine created seed=${this.rng.seed} tps=${this.config.ticksPerSecond}`);
  }

  /** Fixed timestep in seconds. */
  get dt(): number {
    return 1 / this.config.ticksPerSecond;
  }

  add(system: System): this {
    this.systems.push(system);
    system.init?.(this);
    this.log.debug(`system registered: ${system.name}`);
    return this;
  }

  /** Advance exactly one fixed simulation tick. Deterministic. */
  step(): void {
    const start = now();
    const dt = this.dt;
    for (const system of this.systems) {
      this.perf.measure(`system:${system.name}`, () => system.tick(this, dt));
    }
    const drained = this.events.drain();
    this.perf.counter("events.perTick").sample(drained);
    this.tickCount++;
    this.simTime += dt;
    this.perf.counter("tick.ms").sample(now() - start);
  }

  /**
   * Convert a wall-clock delta into whole fixed ticks. Returns how many ticks
   * ran. Excess time beyond maxStepsPerFrame is discarded rather than allowed
   * to spiral.
   */
  advance(realDeltaMs: number): number {
    this.accumulatorMs += realDeltaMs;
    const stepMs = 1000 / this.config.ticksPerSecond;
    let steps = 0;
    while (this.accumulatorMs >= stepMs && steps < this.config.maxStepsPerFrame) {
      this.step();
      this.accumulatorMs -= stepMs;
      steps++;
    }
    if (this.accumulatorMs > stepMs * this.config.maxStepsPerFrame) {
      this.log.warn(`simulation behind, discarding ${Math.round(this.accumulatorMs)}ms`);
      this.accumulatorMs = 0;
    }
    return steps;
  }

  /** Interpolation factor in [0,1) for renderers between two fixed ticks. */
  get alpha(): number {
    return this.accumulatorMs / (1000 / this.config.ticksPerSecond);
  }

  /** Headless: run a fixed number of ticks as fast as possible. */
  runTicks(count: number): void {
    this.state = "running";
    for (let i = 0; i < count; i++) this.step();
    this.state = "stopped";
  }

  /** Attached mode: drive the loop from requestAnimationFrame. */
  start(onFrame?: (engine: Engine) => void): void {
    if (this.state === "running") return;
    this.state = "running";
    this.lastFrameTime = now();
    const frame = () => {
      if (this.state !== "running") return;
      const t = now();
      const delta = t - this.lastFrameTime;
      this.lastFrameTime = t;
      this.perf.counter("frame.ms").sample(delta);
      this.advance(delta);
      onFrame?.(this);
      this.frameHandle = requestAnimationFrame(frame);
    };
    this.frameHandle = requestAnimationFrame(frame);
    this.log.info("engine started");
  }

  pause(): void {
    if (this.state !== "running") return;
    this.state = "paused";
    if (this.frameHandle !== null) cancelAnimationFrame(this.frameHandle);
    this.frameHandle = null;
  }

  stop(): void {
    this.state = "stopped";
    if (this.frameHandle !== null) cancelAnimationFrame(this.frameHandle);
    this.frameHandle = null;
    for (const system of this.systems) system.dispose?.(this);
    this.log.info(`engine stopped after ${this.tickCount} ticks`);
  }

  /** Snapshot for debug panels and future save games. */
  snapshot() {
    return {
      state: this.state,
      seed: this.rng.seed,
      tickCount: this.tickCount,
      simTime: this.simTime,
      systems: this.systems.map((s) => s.name),
      counters: this.perf.snapshot(),
      eventsProcessed: this.events.totalProcessed,
    };
  }
}