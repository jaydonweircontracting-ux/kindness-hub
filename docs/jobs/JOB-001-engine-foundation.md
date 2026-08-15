# JOB 001 — Engine Foundation

**Phase:** 1
**Status:** BENCHMARKED (awaiting APPROVED)
**Dependencies:** none

## Objective

Establish the engine core: lifecycle, deterministic timing, deterministic
randomness, logging, configuration, event dispatch, performance measurement and
headless operation. NO GAMEPLAY.

## Scope

- Fixed-timestep simulation loop, independent of render rate.
- Seeded RNG with derivable independent streams.
- Levelled logger with a ring buffer for debug panels.
- Central configuration object; no hard-coded world dimensions.
- Queued event bus drained once per tick.
- Rolling performance counters.
- Headless run harness producing a determinism checksum.
- Unit + integration tests, and a benchmark.

## Non-goals

World coordinates, chunks, terrain, entities, player, rendering of a game world,
save/load, any gameplay system.

## Files

- `src/engine/core/config.ts`
- `src/engine/core/rng.ts`
- `src/engine/core/logger.ts`
- `src/engine/core/events.ts`
- `src/engine/core/perf.ts`
- `src/engine/core/engine.ts`
- `src/engine/headless.ts`
- `src/engine/index.ts`
- `src/engine/__tests__/engine.test.ts`
- `src/routes/index.tsx` (diagnostics surface)

## Implementation notes

- `Engine.step()` is the only place simulation time advances; it adds `dt`, never
  a wall-clock delta.
- `Engine.advance(ms)` clamps catch-up to `maxStepsPerFrame` and discards the
  excess with a warning rather than spiralling.
- `Rng.derive(label)` XORs the parent seed with an FNV-1a hash of the label, so
  stream creation order cannot affect results.
- Events queue during a tick and drain at the end of it, making listener
  registration order irrelevant.
- Each system is timed into `system:<name>`.

## Tests

`bunx vitest run` — 15 tests, all passing.

- RNG: same-seed sequence equality, different-seed divergence, derived-stream
  independence and order-independence, bounds, save/restore round trip, stable
  string hash.
- Events: FIFO delivery on drain, no delivery before drain, unsubscribe.
- Engine: wall-time to tick conversion, remainder carry across calls, catch-up
  clamp, one system tick per engine tick.
- Headless: identical checksum for identical seed, different checksum for
  different seed, counters recorded.

## Benchmark

Headless empty loop (2026-08-15):

| Ticks | Wall | Rate | tick.ms avg | tick.ms max |
| --- | --- | --- | --- | --- |
| 1,000 | 4.7 ms | 215k/s | 0.0027 | 0.040 |
| 10,000 | 12.0 ms | 836k/s | 0.0009 | 0.002 |
| 100,000 | 82.2 ms | 1.22M/s | 0.0004 | 0.001 |

Loop overhead is negligible relative to the 4 ms tick budget.

## Success criteria

- [x] Engine starts, ticks, pauses, stops.
- [x] Simulation time is independent of frame rate.
- [x] Identical seed produces an identical run checksum.
- [x] Engine runs with no renderer attached.
- [x] Performance counters produce measured numbers.
- [x] Tests pass.
- [x] Benchmark recorded.
- [x] Documentation updated.