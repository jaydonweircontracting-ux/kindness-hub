# ASHFALL — Simulation Bible

How the living world works.

## Rule zero

Never simulate the entire world at maximum detail. See Simulation LOD in
`WORLD_BIBLE.md`.

## Systems and their eventual couplings

| System | Reads | Writes |
| --- | --- | --- |
| Time | — | season, hour, tick |
| Weather | season, biome, elevation | visibility, travel, schedules, crops |
| Wildlife | biome, food, danger | population, encounters, resources |
| NPC needs | food, safety, wealth | schedule, movement, trade |
| Production | resources, population, season | goods, food |
| Economy | production, consumption, transport | prices, wealth, scarcity |
| Settlement | food, economy, safety | population, buildings, services |
| Faction | territory, resources, relations | conflicts, patrols, road danger |
| Reputation | player actions, witnesses | NPC attitude, prices, access |
| Quests | shortages, crime, conflict, discovery | player-facing objectives |

## Deterministic ticking

Every simulation system runs on the fixed tick and pulls randomness from its own
derived RNG stream. No system may read wall-clock time.

## Emergence over authorship

A merchant dies. His goods remain. Another NPC finds them. The road becomes
dangerous. Prices change. The player investigates. A faction gets involved. A
quest emerges. The world remembers.

That chain must be produced by systems, not written by hand.

## Abstraction promotion

When the player approaches a region, abstract state must expand into detailed
state without contradicting itself. A settlement that abstractly lost 12 people
to famine must present as a settlement that lost 12 people to famine.