/**
 * Biome classification (ASHFALL JOB 002).
 *
 * Biomes are a pure function of elevation, moisture and temperature so the
 * same coordinates always yield the same biome for a given world seed.
 * Palette entries live here, not in components, so the renderer and any
 * future minimap agree by construction.
 */
export type BiomeId =
  | "deep_ocean"
  | "ocean"
  | "shore"
  | "ashflats"
  | "scrub"
  | "grassland"
  | "forest"
  | "marsh"
  | "highland"
  | "mountain"
  | "peak"
  | "cinder";

export interface Biome {
  id: BiomeId;
  name: string;
  /** Base map colour, ash-and-ember palette. */
  color: string;
  /** Rough traversal cost multiplier, used later by movement and AI. */
  travelCost: number;
  /** Baseline danger 0..1, used later by encounter tables. */
  danger: number;
}

export const BIOMES: Record<BiomeId, Biome> = {
  deep_ocean: { id: "deep_ocean", name: "Deep water", color: "#0b1219", travelCost: 6, danger: 0.5 },
  ocean: { id: "ocean", name: "Shallows", color: "#12202b", travelCost: 4, danger: 0.35 },
  shore: { id: "shore", name: "Grey shore", color: "#3b3a35", travelCost: 1.2, danger: 0.15 },
  ashflats: { id: "ashflats", name: "Ash flats", color: "#4a463f", travelCost: 1.4, danger: 0.4 },
  scrub: { id: "scrub", name: "Dust scrub", color: "#55513f", travelCost: 1.2, danger: 0.3 },
  grassland: { id: "grassland", name: "Pale grassland", color: "#5c6046", travelCost: 1, danger: 0.2 },
  forest: { id: "forest", name: "Cinderwood", color: "#3a4736", travelCost: 1.8, danger: 0.45 },
  marsh: { id: "marsh", name: "Sour marsh", color: "#2f3b34", travelCost: 2.4, danger: 0.55 },
  highland: { id: "highland", name: "Highland", color: "#6a6559", travelCost: 1.9, danger: 0.4 },
  mountain: { id: "mountain", name: "Mountains", color: "#807a6e", travelCost: 3.2, danger: 0.6 },
  peak: { id: "peak", name: "Frozen peak", color: "#b9b4aa", travelCost: 4.5, danger: 0.7 },
  cinder: { id: "cinder", name: "Cinder waste", color: "#7a3a22", travelCost: 2.6, danger: 0.85 },
};

export const SEA_LEVEL = 0.42;

/** Classify a sample. All thresholds are constants — no randomness here. */
export function classifyBiome(
  elevation: number,
  moisture: number,
  temperature: number,
): BiomeId {
  if (elevation < SEA_LEVEL - 0.12) return "deep_ocean";
  if (elevation < SEA_LEVEL) return "ocean";
  if (elevation < SEA_LEVEL + 0.02) return "shore";

  if (elevation > 0.86) return "peak";
  if (elevation > 0.74) return "mountain";
  if (elevation > 0.63) return "highland";

  if (temperature > 0.78 && moisture < 0.32) return "cinder";
  if (moisture > 0.72) return elevation < SEA_LEVEL + 0.08 ? "marsh" : "forest";
  if (moisture > 0.5) return "forest";
  if (moisture > 0.34) return "grassland";
  if (temperature > 0.55) return "ashflats";
  return "scrub";
}