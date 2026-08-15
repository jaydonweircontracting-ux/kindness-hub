# ASHFALL — Current State

Last updated: 2026-08-15

## Current phase

PHASE 1 — Engine Foundation

## Current job

JOB 001 — Engine Foundation. Status: TESTED + BENCHMARKED.

## Completed jobs

- PHASE 0 — project reset and documentation architecture.
- JOB 001 — engine foundation (lifecycle, fixed timestep, deterministic RNG,
  logging, configuration, event bus, performance counters, headless mode).

## Active systems

| System | File | State |
| --- | --- | --- |
| Engine lifecycle + fixed timestep | `src/engine/core/engine.ts` | working |
| Deterministic RNG | `src/engine/core/rng.ts` | working |
| Event bus | `src/engine/core/events.ts` | working |
| Logger (ring buffer) | `src/engine/core/logger.ts` | working |
| Configuration | `src/engine/core/config.ts` | working |
| Performance counters | `src/engine/core/perf.ts` | working |
| Headless harness | `src/engine/headless.ts` | working |
| Diagnostics page | `src/routes/index.tsx` | working |

## Not implemented

World coordinates, grid, chunks, terrain, generation, streaming, player,
movement, camera, creatures, combat, loot, inventory, equipment, dungeons,
outposts, save/load, NPCs, economy, factions, weather, quests. None of these
exist in any form — do not assume otherwise.

## Known bugs

None known.

## Known limitations

- `ChecksumSystem` derives a fresh RNG per tick. Fine at current scale
  (~1.2M ticks/s) but real systems should hold one derived stream, not derive
  per tick.
- No persistence layer, so the run checksum is the only determinism evidence.
- No CI wiring; tests are run manually with `bunx vitest run`.

## Test status

PASS — 15/15 (`src/engine/__tests__/engine.test.ts`), `bunx vitest run`.

Covers: RNG determinism, stream independence, bounds, save/restore; event bus
FIFO + unsubscribe; fixed timestep conversion, remainder carry, catch-up clamp,
per-tick system dispatch; headless checksum equality and divergence.

## Benchmark status

Headless empty loop, measured 2026-08-15:

| Ticks | Wall | Rate | tick.ms avg | tick.ms max |
| --- | --- | --- | --- | --- |
| 1,000 | 4.7 ms | 215k/s | 0.0027 | 0.040 |
| 10,000 | 12.0 ms | 836k/s | 0.0009 | 0.002 |
| 100,000 | 82.2 ms | 1.22M/s | 0.0004 | 0.001 |

## Important architectural decisions

- ADR-001 — runtime is TypeScript in the browser, not Java/Gradle.
- ADR-002 — fixed timestep, simulation time separated from render time.
- ADR-003 — deterministic seeded RNG with label-derived streams.

## Next job

JOB 002 — World Coordinate System. Do not start it in the same session that
finished JOB 001.

## Last commit

See repository history; Lovable syncs each change to GitHub.