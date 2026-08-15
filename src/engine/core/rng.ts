/**
 * Deterministic seeded RNG (ASHFALL JOB 001).
 *
 * No hidden global random state is permitted anywhere in the engine.
 * Every stochastic system must own an explicit Rng stream derived from the
 * world seed via `Rng.derive(label)` so that streams stay independent and
 * reproducible regardless of evaluation order.
 */

/** FNV-1a 32-bit string hash — used to turn stream labels into seeds. */
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32: small, fast, good enough distribution, fully deterministic. */
export class Rng {
  private state: number;
  readonly seed: number;

  constructor(seed: number | string) {
    this.seed = typeof seed === "string" ? hashString(seed) : seed >>> 0;
    this.state = this.seed;
  }

  /** Float in [0, 1). */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Integer in [min, max] inclusive. */
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  /** Float in [min, max). */
  float(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  chance(probability: number): boolean {
    return this.next() < probability;
  }

  pick<T>(items: readonly T[]): T {
    return items[this.int(0, items.length - 1)] as T;
  }

  /** Fisher-Yates, in place, deterministic. */
  shuffle<T>(items: T[]): T[] {
    for (let i = items.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      const tmp = items[i] as T;
      items[i] = items[j] as T;
      items[j] = tmp;
    }
    return items;
  }

  /** A new independent stream keyed by label. Order-independent. */
  derive(label: string): Rng {
    return new Rng((this.seed ^ hashString(label)) >>> 0);
  }

  /** Snapshot for save games. */
  save(): { seed: number; state: number } {
    return { seed: this.seed, state: this.state };
  }

  restore(snapshot: { seed: number; state: number }): void {
    this.state = snapshot.state >>> 0;
  }
}