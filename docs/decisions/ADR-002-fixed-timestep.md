# ADR-002 — Fixed timestep, separated from render time

**Status:** Accepted (2026-08-15)

## Decision

The simulation advances in fixed steps of `1 / ticksPerSecond` seconds
(default 30). Rendering runs on `requestAnimationFrame` and never dictates
simulation correctness. `Engine.advance(realDeltaMs)` converts wall-clock time
into whole ticks, keeps the remainder in an accumulator, and clamps catch-up to
`maxStepsPerFrame`. Renderers interpolate using `Engine.alpha`.

## Reason

Determinism is a hard requirement (`ENGINE_BIBLE.md`). Variable `dt` makes a run
depend on frame pacing, which is machine- and tab-dependent, and would make save
reproduction and simulation tests impossible.

## Alternatives considered

- **Variable delta time.** Simplest; breaks determinism. Rejected.
- **Unclamped catch-up.** A stalled tab returns and tries to run thousands of
  ticks in one frame, stalling further — the classic spiral of death. Rejected.

## Consequences

- Simulation code may never read the wall clock.
- After a long stall the world does not fully catch up; discarded time is logged
  as a warning. Long absences are the job of the abstract-LOD simulation, not the
  frame loop.
- Renderers must interpolate to look smooth at frame rates above the tick rate.