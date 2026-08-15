# ASHFALL — Content Bible

## Principle

Quality before quantity. Do not add 1,000 items if only 50 matter. Do not add
500 NPC templates if they behave identically.

## Data-driven

Content definitions (items, creatures, NPC archetypes, biomes, recipes, loot
tables) are externalized as data, not hardcoded into gameplay code. Format is
JSON until a measured reason justifies otherwise.

Each definition carries a stable string ID (`iron_shortsword`, `ash_wolf`) used
by saves and references. IDs are never renamed; deprecate instead.

## Loot

Loot tables are data. Rolls come from a derived RNG stream keyed by the source
(container ID, creature ID, tick), so loot is reproducible for a given seed.

## Crafting

Resources, recipes, skills, tools, stations, time and quality. Crafting must
interact with the economy rather than manufacture value from nothing.

## Naming and tone

Grounded, weathered, plain. Avoid high-fantasy pastiche and avoid names that
resemble any inspiration title's trademarks.

## Legal

No copyrighted assets, characters, code, maps, art, audio, text or trademarks
from any inspiration. ASHFALL is its own game.