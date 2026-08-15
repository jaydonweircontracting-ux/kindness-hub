/**
 * Engine event bus. Systems communicate through events rather than reaching
 * into each other: CombatSystem emits EntityDied, ReputationSystem listens.
 *
 * Events are queued and drained once per simulation tick so that ordering is
 * deterministic and independent of listener registration order.
 */
export interface EngineEvent<T = unknown> {
  type: string;
  payload: T;
  tick: number;
}

type Listener = (event: EngineEvent<never>) => void;

export class EventBus {
  private listeners = new Map<string, Set<Listener>>();
  private queue: EngineEvent[] = [];
  private processed = 0;

  on<T>(type: string, listener: (event: EngineEvent<T>) => void): () => void {
    let set = this.listeners.get(type);
    if (!set) {
      set = new Set();
      this.listeners.set(type, set);
    }
    set.add(listener as Listener);
    return () => set.delete(listener as Listener);
  }

  /** Queue an event for the current tick's drain. */
  emit<T>(type: string, payload: T, tick: number): void {
    this.queue.push({ type, payload, tick });
  }

  /** Drain in FIFO order. Events emitted during a drain run on the next drain. */
  drain(): number {
    if (this.queue.length === 0) return 0;
    const batch = this.queue;
    this.queue = [];
    for (const event of batch) {
      const set = this.listeners.get(event.type);
      if (!set) continue;
      for (const listener of set) listener(event as EngineEvent<never>);
    }
    this.processed += batch.length;
    return batch.length;
  }

  get pending(): number {
    return this.queue.length;
  }

  get totalProcessed(): number {
    return this.processed;
  }

  clear(): void {
    this.queue = [];
    this.listeners.clear();
    this.processed = 0;
  }
}