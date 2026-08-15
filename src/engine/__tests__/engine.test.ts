import { describe, expect, it } from "vitest";
import { Engine } from "../core/engine";
import { EventBus } from "../core/events";
import { Rng, hashString } from "../core/rng";
import { runHeadless } from "../headless";

describe("Rng — determinism", () => {
  it("same seed produces the same sequence", () => {
    const a = new Rng("ashfall");
    const b = new Rng("ashfall");
    const seqA = Array.from({ length: 64 }, () => a.next());
    const seqB = Array.from({ length: 64 }, () => b.next());
    expect(seqA).toEqual(seqB);
  });

  it("different seeds diverge", () => {
    const a = new Rng("ashfall");
    const b = new Rng("ashfall-2");
    expect(a.next()).not.toEqual(b.next());
  });

  it("derived streams are independent and order-independent", () => {
    const root = new Rng(1234);
    const terrain = root.derive("terrain");
    const loot = root.derive("loot");
    expect(terrain.seed).not.toEqual(loot.seed);

    const rootAgain = new Rng(1234);
    rootAgain.derive("loot").next();
    expect(rootAgain.derive("terrain").seed).toEqual(terrain.seed);
  });

  it("stays inside declared bounds", () => {
    const rng = new Rng("bounds");
    for (let i = 0; i < 500; i++) {
      const n = rng.int(3, 7);
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(7);
      const f = rng.float(-1, 1);
      expect(f).toBeGreaterThanOrEqual(-1);
      expect(f).toBeLessThan(1);
    }
  });

  it("save/restore round-trips the stream", () => {
    const rng = new Rng("save");
    for (let i = 0; i < 10; i++) rng.next();
    const snap = rng.save();
    const expected = Array.from({ length: 5 }, () => rng.next());
    rng.restore(snap);
    expect(Array.from({ length: 5 }, () => rng.next())).toEqual(expected);
  });

  it("hashString is stable", () => {
    expect(hashString("ashfall")).toEqual(hashString("ashfall"));
  });
});

describe("EventBus", () => {
  it("delivers queued events in FIFO order on drain", () => {
    const bus = new EventBus();
    const seen: number[] = [];
    bus.on<{ n: number }>("test", (e) => seen.push(e.payload.n));
    bus.emit("test", { n: 1 }, 0);
    bus.emit("test", { n: 2 }, 0);
    expect(seen).toEqual([]);
    expect(bus.drain()).toBe(2);
    expect(seen).toEqual([1, 2]);
  });

  it("unsubscribes cleanly", () => {
    const bus = new EventBus();
    let count = 0;
    const off = bus.on("x", () => count++);
    bus.emit("x", null, 0);
    bus.drain();
    off();
    bus.emit("x", null, 0);
    bus.drain();
    expect(count).toBe(1);
  });
});

describe("Engine — fixed timestep", () => {
  it("separates simulation time from wall time", () => {
    const engine = new Engine({ ticksPerSecond: 20, headless: true });
    const steps = engine.advance(100); // 100ms at 20tps = 2 ticks
    expect(steps).toBe(2);
    expect(engine.tickCount).toBe(2);
    expect(engine.simTime).toBeCloseTo(0.1, 6);
  });

  it("carries the remainder into the next advance", () => {
    const engine = new Engine({ ticksPerSecond: 20, headless: true });
    engine.advance(30);
    expect(engine.tickCount).toBe(0);
    engine.advance(30);
    expect(engine.tickCount).toBe(1);
  });

  it("clamps catch-up steps to avoid a death spiral", () => {
    const engine = new Engine({ ticksPerSecond: 60, maxStepsPerFrame: 3, headless: true });
    expect(engine.advance(10_000)).toBe(3);
  });

  it("runs registered systems once per tick", () => {
    const engine = new Engine({ headless: true });
    let ticks = 0;
    engine.add({ name: "counter", tick: () => ticks++ });
    engine.runTicks(10);
    expect(ticks).toBe(10);
  });
});

describe("Headless harness", () => {
  it("produces an identical checksum for an identical seed", () => {
    const a = runHeadless(200, { seed: "ashfall" });
    const b = runHeadless(200, { seed: "ashfall" });
    expect(a.checksum).toBe(b.checksum);
    expect(a.ticks).toBe(200);
  });

  it("produces a different checksum for a different seed", () => {
    const a = runHeadless(200, { seed: "ashfall" });
    const c = runHeadless(200, { seed: "emberfall" });
    expect(a.checksum).not.toBe(c.checksum);
  });

  it("records performance counters", () => {
    const report = runHeadless(50);
    expect(report.counters["tick.ms"]).toBeDefined();
    expect(report.simTime).toBeGreaterThan(0);
  });
});