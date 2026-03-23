# Focus: Game Logic + CLI

**For**: Backend developers, systems programmers, or anyone who prefers logic over pixels.

## The Idea

Build the complete Vault Run game engine with a terminal-based interface. No browser, no graphics, just clean game logic and a CLI that lets players type commands and see the board state as text. Correctness is the priority.

## Why This Focus?

You get to concentrate on the hard part of any game: getting the rules exactly right. Vault Run has surprisingly deep logic: truck capacity, bidirectional movement, contract ownership with fines, 15 different chance card effects, and bankruptcy detection. Implementing all of this correctly is a serious engineering challenge, and the terminal interface keeps the scope manageable.

## Suggested Sprint Plan

### Sprint 1 — Board and Movement

- Load `fields.json` and represent the circular board in memory.
- Implement a game loop: player chooses direction (clockwise/counter-clockwise), rolls a 6-sided die, moves that many spaces.
- Print the board state after each move: show field names, which player is where, and contract ownership.
- Handle passing or landing on Start (rebalancing prompt).

**Working software at this point**: A player can move around the board and see where they are.

### Sprint 2 — Contracts

- When a player lands on an unowned contract field, prompt to buy it (pay contract price to Bank).
- When landing on an owned contract, implement fulfillment logic.
- Implement contract failure: player cannot or chooses not to fulfill — lose the contract, pay 10% fine.
- Track Cash Vault and truck balances separately.

**Working software at this point**: A single player can buy and fulfill contracts.

### Sprint 3 — Multiplayer and Money

- Add support for 2-4 players taking turns.
- Implement contract negotiation between players.
- Implement bankruptcy detection: if total money (Cash Vault + truck) is less than a required payment, the player is out.
- Add both game modes: Limited Turns and Last One Standing.

**Working software at this point**: Multiple players can play a full game with contracts.

### Sprint 4 — Chance Cards

- Load `chance-card.json` and implement a shuffled deck.
- Implement all 15 effect types.
- Handle recursive field resolution: when a card moves a player to a new field, resolve that field immediately.
- Reinsert used cards at a random position in the deck.

**Working software at this point**: A complete, rules-accurate game.

### Sprint 5 — Polish and Testing

- Write unit tests for core game logic.
- Improve the CLI display: colored output, clearer board visualization, game summary at end.
- Add input validation and error handling for player commands.
- Optionally: add a simple AI player that makes random valid moves, so you can test a full game without needing human input for every player.

## What You Will Practice

- Translating natural-language rules into deterministic code.
- Designing a state machine for game flow.
- Managing complex state (multiple players, contracts, chance card effects).
- Writing testable code — pure functions for game logic, separated from I/O.
- Feeding structured specs (`rules.md`, `fields.json`, `chance-card.json`) to an AI and iterating on its output.
