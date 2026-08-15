# ASHFALL

A single-character open-world RPG built around the feeling of living inside a
persistent simulated world. The player is one person inside a world that keeps
running without them.

**This repository is the permanent source of truth.** Read the documentation
before changing anything.

## Start here

| File | What it is |
| --- | --- |
| [`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md) | Where the project is RIGHT NOW. Read first. |
| [`docs/ASHFALL_MASTER_DESIGN.md`](docs/ASHFALL_MASTER_DESIGN.md) | What the game IS. |
| [`docs/DEVELOPMENT_ROADMAP.md`](docs/DEVELOPMENT_ROADMAP.md) | What gets built next. |
| [`docs/JOB_PROTOCOL.md`](docs/JOB_PROTOCOL.md) | How work is scoped and completed. |
| [`docs/AI_DEVELOPMENT_WORKFLOW.md`](docs/AI_DEVELOPMENT_WORKFLOW.md) | Rules for any fresh AI session. |
| [`docs/VERTICAL_SLICE.md`](docs/VERTICAL_SLICE.md) | The playable-game target. |

Reference material: `ENGINE_BIBLE`, `WORLD_BIBLE`, `GAMEPLAY_BIBLE`,
`SIMULATION_BIBLE`, `PERFORMANCE_BIBLE`, `CONTENT_BIBLE`, `ART_DIRECTION`.
Decisions live in `docs/decisions/`, job records in `docs/jobs/`.

## Current status

Phase 1 — Engine Foundation. JOB 001 complete (tested and benchmarked). No
gameplay exists yet, by design. Next: JOB 002 — World Coordinate System.

## Stack

TypeScript, React, TanStack Start, Vite. The engine layer under `src/engine/`
has no DOM dependencies and runs headless for tests and benchmarks. See
[ADR-001](docs/decisions/ADR-001-runtime.md) for why this is not Java/Gradle.

## Commands

```bash
bun install
bun run dev        # dev server
bunx vitest run    # tests
```

## Layout

```text
docs/            design, bibles, roadmap, jobs, decisions, current state
src/engine/      engine core (no DOM, headless-capable)
src/routes/      app shell and diagnostics UI
```

## Working rules

- Implement one job at a time. Do not start the next job in the same session.
- A job is not done until it is tested, documented and committed.
- Never claim something is implemented unless it exists and has been tested.
- Never silently change architecture — write an ADR.
- Build the vertical slice early; deepen the simulation underneath it.