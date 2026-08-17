/**
 * World coordinate system (ASHFALL JOB 002).
 *
 * Hierarchy: World > Region > Chunk > Cell. Nothing here hard-codes a size;
 * every conversion reads chunkSize / regionSize from EngineConfig so that a
 * 4x4 test world and the shipping world share one code path.
 */
import type { EngineConfig } from "../core/config";

export interface Vec2 {
  x: number;
  y: number;
}

/** Absolute cell coordinate — the finest addressable unit of the world. */
export type CellCoord = Vec2;
/** Chunk coordinate — a chunkSize x chunkSize block of cells. */
export type ChunkCoord = Vec2;
/** Region coordinate — a regionSize x regionSize block of chunks. */
export type RegionCoord = Vec2;

function floorDiv(value: number, divisor: number): number {
  return Math.floor(value / divisor);
}

function mod(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

export function cellToChunk(cell: CellCoord, config: EngineConfig): ChunkCoord {
  return { x: floorDiv(cell.x, config.chunkSize), y: floorDiv(cell.y, config.chunkSize) };
}

export function chunkToRegion(chunk: ChunkCoord, config: EngineConfig): RegionCoord {
  return { x: floorDiv(chunk.x, config.regionSize), y: floorDiv(chunk.y, config.regionSize) };
}

export function cellToRegion(cell: CellCoord, config: EngineConfig): RegionCoord {
  return chunkToRegion(cellToChunk(cell, config), config);
}

/** Cell position within its chunk, always in [0, chunkSize). */
export function cellLocal(cell: CellCoord, config: EngineConfig): Vec2 {
  return { x: mod(cell.x, config.chunkSize), y: mod(cell.y, config.chunkSize) };
}

/** Origin cell of a chunk. */
export function chunkOrigin(chunk: ChunkCoord, config: EngineConfig): CellCoord {
  return { x: chunk.x * config.chunkSize, y: chunk.y * config.chunkSize };
}

/** Origin chunk of a region. */
export function regionOrigin(region: RegionCoord, config: EngineConfig): ChunkCoord {
  return { x: region.x * config.regionSize, y: region.y * config.regionSize };
}

/** Cells per region edge. */
export function regionCellSpan(config: EngineConfig): number {
  return config.chunkSize * config.regionSize;
}

/** Stable string key for maps/sets. */
export function key(coord: Vec2): string {
  return `${coord.x},${coord.y}`;
}

export function chebyshev(a: Vec2, b: Vec2): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

/** Simulation LOD by chunk distance from the observer. */
export function lodForDistance(distanceInChunks: number, config: EngineConfig): 0 | 1 | 2 | 3 {
  if (distanceInChunks <= config.simRadius) return 0;
  if (distanceInChunks <= config.simRadius * 3) return 1;
  if (distanceInChunks <= config.simRadius * 8) return 2;
  return 3;
}