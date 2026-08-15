# ASHFALL — Performance Bible

## Goal

Not "make everything insanely optimized". The goal is an architecture capable of
scaling.

## Loop

PROFILE -> FIND HOTSPOT -> UNDERSTAND IT -> CHANGE IT -> BENCHMARK -> COMPARE ->
KEEP OR REVERT

No premature micro-optimization. No performance claim without a measurement.

## Data orientation

Use compact data structures where justified (terrain, resources, vegetation,
particles, entity state, environmental state). Do NOT blindly build an ECS and
do NOT blindly use typed arrays everywhere. Choose based on access patterns,
memory, cache locality, maintainability and profiling.

## Budgets (targets, revisited each phase)

| Concern | Target |
| --- | --- |
| Simulation tick (LOD 0) | < 4 ms at 30 tps |
| Frame time | < 16.6 ms (60 fps) |
| Chunk generation | < 8 ms per chunk |
| Save round-trip (test world) | < 250 ms |

## Measurement

`PerfRegistry` counters are the only sanctioned source of numbers. Headless
benchmarks live in `benchmarks/` and are re-run whenever a core system changes.

## Measured baselines

| Date | What | Result |
| --- | --- | --- |
| 2026-08-15 | Empty engine loop, headless, 100k ticks | 82 ms wall, ~1.2M ticks/s, tick.ms avg 0.0004, max 0.001 |

## Device awareness

Stay conscious of eventual mobile targets. Avoid assuming unlimited desktop
resources, but do not cripple the engine pre-emptively.