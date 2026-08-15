# ADR-003 — Deterministic RNG with label-derived streams

**Status:** Accepted (2026-08-15)

## Decision

All randomness comes from `Rng` (mulberry32, 32-bit state). The engine owns a
root stream seeded from `config.seed`. Every system, chunk, creature or loot
roll takes its own stream via `rng.derive(label)`, which XORs the parent seed
with an FNV-1a hash of the label. `Math.random()` is forbidden in engine and
simulation code.

## Reason

Derived streams are order-independent: adding a new system, or generating chunk
B before chunk A, cannot shift another consumer's sequence. That property is
what makes a seeded world genuinely reproducible, and it lets world generation
be lazy and out-of-order without changing results.

## Alternatives considered

- **One shared global stream.** Trivial, but any change in call order changes
  every downstream result. Rejected.
- **A cryptographic PRNG.** Unnecessary cost; we need reproducibility, not
  unpredictability.
- **PCG / xoshiro.** Better statistical quality. Reconsider if generation
  artifacts appear; mulberry32 is adequate and cheap for now.

## Consequences

- Stream labels are effectively part of the save format — renaming a label
  changes generated content for existing seeds. Treat labels as stable IDs.
- 32-bit state limits period; acceptable per-stream because streams are many
  and short-lived.
- `Rng.save()`/`restore()` must be included wherever a long-lived stream is
  persisted.