# ADR-001 — Runtime: TypeScript in the browser

**Status:** Accepted (2026-08-15)

## Decision

ASHFALL is implemented in TypeScript, running in the browser, with a headless
mode that also runs under Node/Bun for tests and benchmarks. Build tooling is
Vite; the app shell is TanStack Start.

## Reason

The master design proposed Java + Gradle "unless the existing repository has a
compelling technical reason that requires another arrangement". The repository
this project builds into is a Lovable/TanStack web project: the hosting platform
executes browser and edge JavaScript only. There is no JVM and no Gradle
runner available, so Java is not implementable here.

The engine requirements — fixed timestep, deterministic RNG, event bus, chunked
world, simulation LOD, headless testing — are all runtime-agnostic and translate
directly.

## Alternatives considered

- **Java + Gradle desktop client.** Matches the original document but cannot run
  or be tested on this platform.
- **Rust/WASM core with a TS shell.** Better raw performance ceiling; rejected
  for now as premature — measure first (see `PERFORMANCE_BIBLE.md`). WASM can be
  introduced later behind the existing `System` interface if profiling justifies
  it.

## Consequences

- Zero-install distribution; the game is a URL.
- Determinism relies on our own RNG, never `Math.random()`.
- Numeric behaviour is IEEE-754 doubles everywhere, which is consistent across
  browsers — acceptable for determinism.
- Memory ceilings are lower than a JVM desktop app, which reinforces the
  simulation-LOD requirement rather than contradicting it.
- If the project later needs a native client, the engine layer is deliberately
  free of DOM dependencies so it can be ported.