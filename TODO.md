TODO LIST
==============
Refactoring:
	-	Convert Most Arrays to Hashes as Hash[ID] = object. (? Is this Faster ?)
		-	This removes indexOf and splicing, two loops that are constantly iterated for.
	- Clean up Classes, add proper inheritance splicing.
		-	Make LW.SpellLists into Classes, so that functions are prototypal vs generated.

Autosizing Canvas
read: http://www.html5rocks.com/en/tutorials/casestudies/gopherwoord-studios-resizing-html5-games/

- sprite refactoring

TOP LEVEL IMPORTANT:
- Node.js

Spell:
- Meteor Shell too Stronk.
- Wave too weak.
- Sword too weak?
- Updraft above.
- NEW SPELLS??

IMPORTANT
- Fix Settings with mouse use.
- FPS Boosts, DO:
	- Change Canvas States Less.
	- Make Pesudo Canvas Elements for Each Important Sprite (ie wizards) for pre-rendering;
	- Possibly: Never redraw boxes.
- level zoom
  - possibly bigger levels
- Refactor Code:
  - Array.every is a function!!
  - Main Menu should have it's own $el
- Load the assests before the game starts (better?)
- Random Spell Select

MEDIUM
- more spells?
- ForcePush with Static Spell interaction.
- speed improvement with collisions / check if they are slow.
- cooldown circles
- hud in general
- on leaving window pauses game
- write readme
- kill cam joke mode?
- Fix splicing and indexing of Spell Removal.

Spells
=========
- fireball
  - splits on solid impact
- smokebomb
  - hides players
- lightning strike
- tentacle monster portal
- sword attack
- teleport (blink)
- ray cannon
  - ~2 second delay
- crystal ball shards
- force push (music?, torrent of blood)
  - maybe add hitting a wall too fast kills you
- werewolf transformation mode? / level of transformations
- sheep tosser
- mines
- growth into death serum
- kiss of alignment
  - you get enemy's kills until wears off or death
