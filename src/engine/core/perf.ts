/** Rolling performance counters. Never claim a number that wasn't measured. */
export class Counter {
  private samples: number[] = [];
  constructor(
    readonly name: string,
    private readonly window = 120,
  ) {}

  sample(value: number): void {
    this.samples.push(value);
    if (this.samples.length > this.window) this.samples.shift();
  }

  get last(): number {
    return this.samples.length ? (this.samples[this.samples.length - 1] as number) : 0;
  }

  get avg(): number {
    if (!this.samples.length) return 0;
    let sum = 0;
    for (const s of this.samples) sum += s;
    return sum / this.samples.length;
  }

  get max(): number {
    let m = 0;
    for (const s of this.samples) if (s > m) m = s;
    return m;
  }

  reset(): void {
    this.samples = [];
  }
}

export class PerfRegistry {
  private counters = new Map<string, Counter>();

  counter(name: string): Counter {
    let c = this.counters.get(name);
    if (!c) {
      c = new Counter(name);
      this.counters.set(name, c);
    }
    return c;
  }

  /** Time a synchronous block into a named counter (milliseconds). */
  measure<T>(name: string, fn: () => T): T {
    const start = now();
    const result = fn();
    this.counter(name).sample(now() - start);
    return result;
  }

  snapshot(): Record<string, { last: number; avg: number; max: number }> {
    const out: Record<string, { last: number; avg: number; max: number }> = {};
    for (const [name, c] of this.counters) {
      out[name] = { last: c.last, avg: c.avg, max: c.max };
    }
    return out;
  }
}

/** High-resolution clock source, safe in browser, worker and node. */
export function now(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}