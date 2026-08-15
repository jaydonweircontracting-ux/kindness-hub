# ASHFALL — Engine Bible

How the engine works. Authoritative for architecture questions.

## Runtime

TypeScript, running in the browser (and headless under Node/Bun for tests and
benchmarks). See `docs/decisions/ADR-001-runtime.md` for why this differs from
the original Java/Gradle proposal.

## Layers

```text
CORE         timing, configuration, logging, RNG, events, lifecycle
WORLD        coordinates, chunks, regions, terrain, generation, streaming
SIMULATION   time, entities, AI, needs, schedules, economy, factions
GAMEPLAY     player, movement, combat, inventory, equipment, skills, quests
RENDERING    camera, terrain, entities, visibility, lighting, UI
TOOLS        debug, profiling, world inspection, simulation controls
PERSISTENCE  saves, world state, player state
```

Only CORE exists today (JOB 001). Layers are created when a job needs them —
never as empty scaffolding.

## Fixed timestep

Simulation correctness must not depend on frame rate.

- `Engine.dt` is fixed: `1 / config.ticksPerSecond` seconds.
- `Engine.step()` advances exactly one tick. Deterministic.
- `Engine.advance(realDeltaMs)` converts wall-clock time into whole ticks and
  keeps the remainder in an accumulator.
- `maxStepsPerFrame` bounds catch-up so a stalled tab cannot spiral.
- `Engine.alpha` is the interpolation factor renderers use between two ticks.
- `Engine.simTime` is accumulated from `dt` only, never from the wall clock.

## Determinism

Same seed + same starting state + same inputs + same sequence => same result.

- All randomness comes from `Rng` (mulberry32). No `Math.random()` anywhere in
  simulation code.
- Systems derive their own stream: `engine.rng.derive("terrain")`. Derivation is
  order-independent, so adding a system does not shift another system's rolls.
- `Rng.save()` / `Rng.restore()` exist for save games.

## Events

Systems talk through `EventBus`, not direct calls. Events are queued during a
tick and drained once at the end of that tick, so listener registration order
cannot change outcomes. Events emitted during a drain run on the next drain.

## Systems

A `System` has a name, an optional `init`/`dispose`, and a `tick(engine, dt)`.
Systems are ticked in registration order and each is timed into its own
performance counter (`system:<name>`).

## Headless mode

`runHeadless(ticks, config)` runs the engine with no renderer and returns a
report including a run checksum. Used for determinism tests, benchmarks and CI.

## Performance counters

`PerfRegistry` holds rolling counters (`last`/`avg`/`max`, 120-sample window).
Never state a performance number that was not measured through it.

## Entity identity

Entities will use stable integer/string IDs suitable for save/load and
cross-references. Object references must never be persistent identity.