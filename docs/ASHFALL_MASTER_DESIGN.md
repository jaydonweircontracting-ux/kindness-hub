# ASHFALL — Master Design

Status: living document. This file defines what the game IS.

## Vision

ASHFALL is a single-character open-world RPG built around the feeling of living
inside a persistent simulated world. The player controls ONE character and never
commands armies, settlements, governments, factions, populations, workers or
economies. Those systems exist independently and continue without the player.

The world should feel larger than the player.

## Core loop

EXPLORE -> DISCOVER -> ENCOUNTER DANGER -> FIGHT OR ESCAPE -> LOOT -> RETURN ->
EQUIP / TRADE -> EXPLORE FARTHER

## Core design principle

Every important system must be capable of affecting other systems.

```text
Combat -> NPC death -> settlement population -> economy -> faction reaction
       -> reputation -> quest -> player investigates -> world changes again
```

Stories are produced by interacting systems, not by hand-authored scripts.

## Gameplay philosophy

Simulation exists to improve gameplay; it is not the product by itself. Prefer a
SIMPLE PLAYER INTERFACE over a DEEP UNDERLYING SYSTEM. A system must justify
itself through player experience, believability, meaningful decisions,
exploration, consequence, replayability or emergence.

## What the player can eventually do

Explore, fight, flee, loot, trade, craft, learn skills, improve equipment,
discover secrets, enter dungeons, interact with NPCs, build reputation, commit
crimes, help or oppose factions, discover world events, influence settlements.

No RTS army control. No population management. No god mode.

## Progression

Attributes + skills + equipment + perks + knowledge + reputation. Use-based
progression where appropriate. No rigid class lock-in. Not every skill must use
identical progression rules.

## Inspirations (feel and principles only — never assets or code)

Dwarf Fortress, Dungeon Crawl Stone Soup, Minecraft, Endless Online, classic
MapleStory, Oblivion, RollerCoaster Tycoon, Age of Empires, Cossacks, classic
dungeon crawlers, simulation sandboxes.

## Master principle

ASHFALL is not a pile of features. It is a continuous loop:

PLAYER -> WORLD -> SIMULATION -> CONSEQUENCES -> GAMEPLAY -> PLAYER