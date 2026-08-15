# ASHFALL — World Bible

## Hierarchy

```text
WORLD -> REGIONS -> AREAS -> CHUNKS -> CELLS
```

All dimensions are configuration values (`EngineConfig.chunkSize`,
`regionSize`, ...). Nothing hard-codes the final world size. Early development
uses small test worlds; the architecture must be capable of very large ones.

## Chunks

Chunks exist to support streaming, memory management, generation, persistence,
simulation LOD, rendering and spatial queries. The whole world is never loaded.
Nearby chunks are detailed; distant chunks are compact simulation data.

## Simulation LOD

- **Level 0 — player bubble.** Full simulation: player, nearby NPCs, creatures,
  combat, movement, interactions, detailed weather and environment.
- **Level 1 — nearby.** NPC schedules, wildlife, local economy, weather,
  population, local events.
- **Level 2 — distant.** Abstract: population, production, food, resources,
  trade, faction activity, conflicts.
- **Level 3 — very distant.** Statistical/event only ("Settlement A gained 12
  population", "Faction C captured Region D").

Promotion from abstract to detailed state must stay consistent with the abstract
state it replaces.

## Generation layers

```text
SEED -> CONTINENTS -> ELEVATION -> CLIMATE -> BIOMES -> WATER -> RESOURCES
     -> ROADS -> LOCATIONS -> SETTLEMENTS -> POPULATION -> ECONOMY
```

Layers are implemented one job at a time, never all at once.

## Causality

Generation must respect relationships, not scatter noise:

```text
Mountain -> water source -> river -> fertile land -> settlement -> road -> trade
```

## Persistence

The world remembers meaningful change: destroyed objects, collected resources,
opened containers, discovered locations, deaths, faction and settlement change,
player actions, quests, events. Save format is versioned and migratable.

## Interiors

Prefer one unified coordinate model: entering a building is the same world with
different visibility and interior geometry, not a disconnected level. Interiors
must stay compatible with NPC schedules and world state.