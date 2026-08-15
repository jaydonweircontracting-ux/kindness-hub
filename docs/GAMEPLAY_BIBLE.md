# ASHFALL — Gameplay Bible

How the game should feel and play.

## Pillars

1. **Exploration** — the player finds things naturally. Not every discovery is a
   quest marker.
2. **Risk** — danger is real and escapable. Running is a valid decision.
3. **Reward** — loot, knowledge, access, reputation.
4. **Consequence** — actions change the world and the world remembers.

## Combat

Readable, responsive, dangerous, understandable, skill-based, expandable.
Combat eventually interacts with equipment, skills, status effects, NPCs,
factions, reputation, crime, quests and world events. Do not build a huge combat
system before basic exploration is fun.

## Equipment

Weapons, armor, shields, tools, accessories, consumables, magical and rare gear.
Differences must be meaningful. Quality over quantity — do not add 1,000 items
when 50 matter.

## Scroll / upgrade system

A later system for improving equipment with risk of failure and rarity gain.
DO NOT IMPLEMENT until the basic equipment loop works.

## Dungeons

Exploration, combat, traps, loot, secrets, environmental storytelling, multiple
routes, risk/reward, procedural generation where appropriate.

## NPCs

Identity, location, needs, schedule, job, relationships, inventory, wealth,
faction, reputation, goals, knowledge. Simulated at LOD, not every frame.

Schedule shape: WAKE -> WORK -> EAT -> SOCIALIZE -> WORK -> RETURN HOME -> SLEEP,
influenced by job, location, weather, danger, faction, needs and world events.

## Reputation and crime

Reputation exists at NPC, local, settlement, faction and regional levels. Crime
(theft, assault, murder, trespass) involves witnesses, law enforcement and
consequence. Do not build a legal system before the basic game works.

## Quests

Prefer emergent quests generated from NPC problems, faction conflict, shortages,
crimes, exploration, world events and politics. Handcrafted quests are allowed.

## UI

The player must always understand health, resources, equipment, location,
important effects, nearby threats, inventory and progression. Do not dump raw
simulation data on the player.