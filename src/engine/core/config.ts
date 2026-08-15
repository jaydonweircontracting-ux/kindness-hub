/**
 * Engine configuration. Nothing about world size is hard-coded in systems —
 * every dimension is read from here so test worlds and the eventual full
 * world share one code path.
 */
export interface EngineConfig {
  /** World seed. All RNG streams derive from this. */
  seed: number | string;
  /** Fixed simulation steps per second. Rendering is independent. */
  ticksPerSecond: number;
  /** Upper bound on catch-up steps per frame, prevents spiral of death. */
  maxStepsPerFrame: number;
  /** Cells per chunk edge. */
  chunkSize: number;
  /** Chunks per region edge. */
  regionSize: number;
  /** Radius in chunks kept at simulation LOD 0 around the player. */
  simRadius: number;
  /** Run without any renderer attached (tests, benchmarks, CI). */
  headless: boolean;
  logLevel: "trace" | "debug" | "info" | "warn" | "error";
}

export const DEFAULT_CONFIG: EngineConfig = {
  seed: "ashfall",
  ticksPerSecond: 30,
  maxStepsPerFrame: 5,
  chunkSize: 32,
  regionSize: 16,
  simRadius: 2,
  headless: false,
  logLevel: "info",
};

export function makeConfig(overrides: Partial<EngineConfig> = {}): EngineConfig {
  return { ...DEFAULT_CONFIG, ...overrides };
}