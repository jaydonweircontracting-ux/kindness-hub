/**
 * World map generation (ASHFALL JOB 002).
 *
 * Produces a region-resolution overview of the whole world: elevation,
 * moisture, temperature and biome per region, plus named settlements and
 * landmarks. Deterministic for a given seed; no gameplay state lives here.
 */
import { Rng } from "../core/rng";
import { classifyBiome, SEA_LEVEL, type BiomeId } from "./biome";
import { fbm2D, noiseSeed } from "./noise";

export interface WorldMapOptions {
  seed: number | string;
  /** Regions across. */
  width: number;
  /** Regions down. */
  height: number;
}

export interface RegionSample {
  x: number;
  y: number;
  elevation: number;
  moisture: number;
  temperature: number;
  biome: BiomeId;
}

export type SiteKind = "settlement" | "ruin" | "landmark";

export interface Site {
  id: string;
  name: string;
  kind: SiteKind;
  x: number;
  y: number;
  biome: BiomeId;
}

export interface WorldMap {
  seed: number;
  width: number;
  height: number;
  regions: RegionSample[];
  sites: Site[];
  landFraction: number;
  generatedInMs: number;
  at(x: number, y: number): RegionSample | undefined;
}

const SETTLEMENT_PREFIX = [
  "Ash",
  "Ember",
  "Grey",
  "Cinder",
  "Hollow",
  "Salt",
  "Iron",
  "Bleak",
  "Coal",
  "Rime",
];
const SETTLEMENT_SUFFIX = ["fall", "reach", "hold", "watch", "mere", "gate", "rest", "moor", "burn"];
const RUIN_NAMES = ["Old Kiln", "Sunken Span", "Broken Aqueduct", "Pale Chapel", "Buried Foundry"];
const LANDMARK_NAMES = ["The Smoking Ridge", "Widow's Step", "The Long Scar", "Glass Basin"];

/** Distance-to-edge falloff so the world is a landmass, not a wrapped plane. */
function edgeFalloff(x: number, y: number, width: number, height: number): number {
  const nx = (x / (width - 1)) * 2 - 1;
  const ny = (y / (height - 1)) * 2 - 1;
  const d = Math.min(1, Math.sqrt(nx * nx + ny * ny) / 1.15);
  return 1 - d * d;
}

export function generateWorldMap(options: WorldMapOptions): WorldMap {
  const started =
    typeof performance !== "undefined" ? performance.now() : Date.now();
  const { width, height } = options;
  const rng = new Rng(options.seed);
  const seed = rng.seed;

  const elevSeed = noiseSeed(seed, "elevation");
  const moistSeed = noiseSeed(seed, "moisture");
  const tempSeed = noiseSeed(seed, "temperature");
  const scale = 6 / Math.max(width, height);

  const regions: RegionSample[] = [];
  let land = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = x * scale;
      const ny = y * scale;
      const raw = fbm2D(elevSeed, nx, ny, { octaves: 5, frequency: 1, gain: 0.52 });
      const elevation = Math.max(0, Math.min(1, raw * 0.72 + edgeFalloff(x, y, width, height) * 0.5));
      const moisture = fbm2D(moistSeed, nx * 1.4 + 11, ny * 1.4 - 7, { octaves: 3 });
      // Cooler toward the north edge, hotter in the volcanic south.
      const latitude = y / (height - 1);
      const temperature = Math.max(
        0,
        Math.min(1, latitude * 0.75 + fbm2D(tempSeed, nx + 31, ny + 5, { octaves: 2 }) * 0.4 - elevation * 0.35),
      );
      const biome = classifyBiome(elevation, moisture, temperature);
      if (elevation >= SEA_LEVEL) land++;
      regions.push({ x, y, elevation, moisture, temperature, biome });
    }
  }

  const sites = placeSites(rng.derive("sites"), regions, width, height);
  const generatedInMs =
    (typeof performance !== "undefined" ? performance.now() : Date.now()) - started;

  return {
    seed,
    width,
    height,
    regions,
    sites,
    landFraction: land / regions.length,
    generatedInMs,
    at(x, y) {
      if (x < 0 || y < 0 || x >= width || y >= height) return undefined;
      return regions[y * width + x];
    },
  };
}

function placeSites(rng: Rng, regions: RegionSample[], width: number, height: number): Site[] {
  const habitable = regions.filter(
    (r) => r.biome !== "deep_ocean" && r.biome !== "ocean" && r.biome !== "peak",
  );
  if (habitable.length === 0) return [];

  const target = Math.max(6, Math.round((width * height) / 26));
  const sites: Site[] = [];
  const minSpacing = Math.max(2, Math.round(Math.min(width, height) / 7));
  const shuffled = rng.shuffle([...habitable]);

  for (const region of shuffled) {
    if (sites.length >= target) break;
    const tooClose = sites.some(
      (s) => Math.max(Math.abs(s.x - region.x), Math.abs(s.y - region.y)) < minSpacing,
    );
    if (tooClose) continue;

    const roll = rng.next();
    const kind: SiteKind = roll < 0.5 ? "settlement" : roll < 0.8 ? "ruin" : "landmark";
    sites.push({
      id: `${kind}-${region.x}-${region.y}`,
      name: nameFor(kind, rng),
      kind,
      x: region.x,
      y: region.y,
      biome: region.biome,
    });
  }

  return sites;
}

function nameFor(kind: SiteKind, rng: Rng): string {
  if (kind === "settlement") return `${rng.pick(SETTLEMENT_PREFIX)}${rng.pick(SETTLEMENT_SUFFIX)}`;
  if (kind === "ruin") return rng.pick(RUIN_NAMES);
  return rng.pick(LANDMARK_NAMES);
}