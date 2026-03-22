# Vault Run - AI Coding Hackathon

![Vault Run Board](vault-run-board-measured.svg)

## The Challenge

Stop fixing bugs. Stop maintaining legacy code. Today, you build something from scratch - and you let a frontier AI model do the heavy lifting.

**Vault Run** is a board game about running a cash transport company. Players move around a board, buy contracts, pick up and deliver cash, and try to outsmart their rivals. Your job today: turn this game concept into a working piece of software, driven almost entirely by AI-generated code.

This is your chance to experience what spec-driven development with modern AI really feels like. Give the AI a spec, guide it when it gets stuck, and watch a complete project come to life.

## How It Works

1. **Explore the starter resources** (see below) — understand the game rules, board layout, and data formats
2. **Define your personal challenge** — pick a scope that excites you (see ideas below)
3. **Build it with AI** — use spec-driven development: describe what you want, let the AI write the code
4. **Hands off the keyboard (mostly)** — fixing small bugs or nudging the AI when it is stuck is fine, but try to avoid hand-writing code yourself

## Teamwork

Work in **teams of two**. Start the day with **pair programming** — sit together, share a screen, explore the starter resources, and align on your approach. Once you have a solid plan and initial structure, switch to **independent work**. This naturally forces you to use GitHub for real: create branches, push code, handle merges, resolve conflicts. That is a valuable part of the exercise.

## Set Up Your Agentic Loop

Before you start coding, invest time in setting up a proper agentic development workflow. This is not a nice-to-have. It is the single most important factor for your productivity today.

A well-configured agentic loop means the AI can write code, run it, see errors, fix them, and iterate — all without you copying and pasting between windows. Make sure your AI tool can execute commands, read terminal output, and access your project files directly. Set up linting, formatting, and test commands so the agent can validate its own work. Write an `AGENTS.md` and create AI skills with project context, conventions, and instructions so the agent stays on track.

**Don't just watch one agent work.** Run multiple agents in parallel on independent tasks. If you are unfamiliar with **Git Worktrees**, now is a great time to learn: they let multiple agents work on the same repo simultaneously without stepping on each other's toes.

> **The teams that invest in their setup early will ship dramatically more by the end of the day.**

## Why This Exercise?

Curious why Vault Run works well for practicing AI-assisted development? Read **[Why Vault Run?](why-vault-run.md)** — a breakdown of what makes this project effective for teaching and learning.

## Sample Focus Areas

Not sure where to start? These guides describe three different focus areas with concrete sprint plans:

| Guide | Who it is for |
|---|---|
| [Game Logic + CLI](sample-focus-1.md) | Backend developers who prefer clean logic over pixels |
| [Multiplayer with Security](sample-focus-2.md) | Network engineers and distributed systems enthusiasts |
| [Interactive Board UI](sample-focus-3.md) | Frontend developers who want to build something visual |

## Starter Resources

| File                                                           | Description                                                          |
| -------------------------------------------------------------- | -------------------------------------------------------------------- |
| [`rules.md`](rules.md)                                         | Complete game rules — the single source of truth for game logic      |
| [`fields.json`](fields.json)                                   | Board layout: 20 fields in order (start, contracts, chance, corners) |
| [`fields-schema.json`](fields-schema.json)                     | JSON Schema for the board data                                       |
| [`chance-card.json`](chance-card.json)                         | All 30 chance cards with their effects and parameters                |
| [`chance-card-schema.json`](chance-card-schema.json)           | JSON Schema for the chance card data                                 |
| [`vault-run-board.svg`](vault-run-board.svg)                   | Visual board layout (SVG for browsers)                               |
| [`vault-run-board-inkscape.svg`](vault-run-board-inkscape.svg) | Visual board layout (portable SVG for Inkscape/GIMP)                 |
| [`vault-run-board-inkscape.png`](vault-run-board-inkscape.png) | Visual board layout (PNG)                                            |
| [`vault-run-board-measured.svg`](vault-run-board-measured.svg) | Board with dimension annotations (SVG for browsers)                  |
| [`vault-run-board-measured-inkscape.svg`](vault-run-board-measured-inkscape.svg) | Board with dimension annotations (portable SVG)    |
| [`vault-run-board-measured-inkscape.png`](vault-run-board-measured-inkscape.png) | Board with dimension annotations (PNG)             |
| [`player.svg`](player.svg)                                     | Player token (35px diameter)                                         |
| [`generate-board.js`](generate-board.js)                       | Node.js script that generates the SVG files                          |

## Make It Your Own

There is no single "correct" project. Pick a challenge that matches your skills and interests:

* **Full-stack dev?** Build the complete game with a backend (game state, rules engine, turn management) and a polished frontend (animated board, drag-and-drop, turn UI).
* **Backend-focused?** Implement the full game logic with a simplified CLI interface. Players type commands, the terminal shows the board state. No graphics needed, correctness is king.
* **Into networking?** Create a multiplayer version where players connect from different machines. Use a central server, or go peer-to-peer. Handle synchronization, disconnects, and cheating prevention.
* **Frontend enthusiast?** Take the SVG board and bring it to life. Animate dice rolls, token movement, contract purchases. Wire it up to a mock backend or local game state.
* **AI/ML curious?** Build a bot that plays Vault Run. Implement different strategies (aggressive buyer, cautious saver, route optimizer) and pit them against each other.
* **Mobile dev?** Build a native or cross-platform mobile version of the game.

The only rule: **start by understanding the starter resources, then define your own scope.**

## Build Step by Step

> **Don't try to build the entire game in one go.**

Work in **mini-sprints**: aim for working software roughly every hour. Each sprint should add one layer of functionality on top of the last. This way you always have something that runs. If time runs out, you still have a working subset of the game instead of a half-finished whole.

## Tech Stack

Use whatever you want:

- **Language** - your call
- **UI** - Web, terminal, desktop, mobile
- **Testing** - pick your favorite testing framework
- **Editor** - VS Code, VS, vim — whatever gives you the best AI-assisted workflow

Picking a tech stack you are not perfectly familiar with is absolutely fine — even encouraged. You are not the one writing the code today, the AI is. Always wanted to try Rust, Go, or Svelte? This is the perfect low-risk opportunity. The AI knows these technologies well, and you will learn by reviewing and guiding its output. The worst that happens is you learn something new.

## Rules of Engagement

- **Let the AI write the code.** Describe what you want in natural language. Paste specs, rules, and data files into context. Iterate on the output.
- **Fixing bugs is fair game.** If the AI generates something broken and a quick manual fix is faster than re-prompting, go for it.
- **Guiding the AI is encouraged.** Refine prompts, break tasks into smaller pieces, provide examples — that is the skill you are practicing today.
- **Hand-writing large chunks of code defeats the purpose.** The goal is to experience how far AI-driven development can take you in a single session.

Good luck, have fun, and let the AI do the work.
