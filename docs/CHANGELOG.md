# ASHFALL — Changelog

## 2026-08-15 — Phase 0 + Job 001

### Added

- Documentation architecture under `docs/`: master design, engine/world/
  gameplay/simulation/performance/content bibles, art direction, AI workflow,
  roadmap, job protocol, vertical slice target, current state, changelog.
- `docs/jobs/JOB-001-engine-foundation.md`.
- ADR-001 (runtime), ADR-002 (fixed timestep), ADR-003 (deterministic RNG).
- Engine core: `Engine`, `EngineConfig`, `EventBus`, `Logger`, `PerfRegistry`,
  `Rng`, headless harness.
- 15 unit/integration tests, all passing.
- Diagnostics page at `/` showing the live loop, counters and headless report.

### Notes

- Runtime is TypeScript, not Java/Gradle — see ADR-001.
- No gameplay exists yet, by design.