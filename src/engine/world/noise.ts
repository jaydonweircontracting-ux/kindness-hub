/**
 * Deterministic value noise (ASHFALL JOB 002).
 *
 * Gradient-free value noise with fractal octaves. Every sample is a pure
 * function of (seed, x, y): no internal state, so map generation can be
 * resumed, streamed per-region or recomputed on any machine identically.
 */
import { hashString } from "../core/rng";

/** Hash a lattice point to a float in [0,1). Pure, order-independent. */
function latticeValue(seed: number, x: number, y: number): number {
  let h = (seed ^ Math.imul(x | 0, 0x27d4eb2d) ^ Math.imul(y | 0, 0x165667b1)) >>> 0;
  h = Math.imul(h ^ (h >>> 15), h | 1) >>> 0;
  h ^= (h + Math.imul(h ^ (h >>> 7), h | 61)) >>> 0;
  return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
}

/** Quintic smoothstep — continuous first and second derivatives. */
function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Single-octave value noise in [0,1). */
export function valueNoise2D(seed: number, x: number, y: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = fade(x - x0);
  const fy = fade(y - y0);
  const v00 = latticeValue(seed, x0, y0);
  const v10 = latticeValue(seed, x0 + 1, y0);
  const v01 = latticeValue(seed, x0, y0 + 1);
  const v11 = latticeValue(seed, x0 + 1, y0 + 1);
  return lerp(lerp(v00, v10, fx), lerp(v01, v11, fx), fy);
}

export interface FbmOptions {
  octaves?: number;
  frequency?: number;
  lacunarity?: number;
  gain?: number;
}

/** Fractal brownian motion, normalised to [0,1). */
export function fbm2D(seed: number, x: number, y: number, options: FbmOptions = {}): number {
  const { octaves = 4, frequency = 1, lacunarity = 2, gain = 0.5 } = options;
  let amplitude = 1;
  let freq = frequency;
  let sum = 0;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amplitude * valueNoise2D((seed + o * 0x9e3779b9) >>> 0, x * freq, y * freq);
    norm += amplitude;
    amplitude *= gain;
    freq *= lacunarity;
  }
  return norm > 0 ? sum / norm : 0;
}

/** Convenience: derive a noise seed from the world seed plus a channel label. */
export function noiseSeed(worldSeed: number, label: string): number {
  return (worldSeed ^ hashString(label)) >>> 0;
}