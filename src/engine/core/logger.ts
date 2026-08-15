/** Levelled logger with a ring buffer so debug panels can read recent output. */
export type LogLevel = "trace" | "debug" | "info" | "warn" | "error";

const ORDER: Record<LogLevel, number> = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
};

export interface LogRecord {
  level: LogLevel;
  scope: string;
  message: string;
  time: number;
}

export class Logger {
  private records: LogRecord[] = [];
  private capacity = 256;

  constructor(
    public level: LogLevel = "info",
    private readonly scope = "ashfall",
    private readonly echo = false,
  ) {}

  child(scope: string): Logger {
    const l = new Logger(this.level, `${this.scope}:${scope}`, this.echo);
    return l;
  }

  log(level: LogLevel, message: string): void {
    if (ORDER[level] < ORDER[this.level]) return;
    const record: LogRecord = { level, scope: this.scope, message, time: Date.now() };
    this.records.push(record);
    if (this.records.length > this.capacity) this.records.shift();
    if (this.echo) console.log(`[${record.scope}] ${level}: ${message}`);
  }

  trace(m: string) { this.log("trace", m); }
  debug(m: string) { this.log("debug", m); }
  info(m: string) { this.log("info", m); }
  warn(m: string) { this.log("warn", m); }
  error(m: string) { this.log("error", m); }

  recent(count = 32): LogRecord[] {
    return this.records.slice(-count);
  }

  clear(): void {
    this.records = [];
  }
}