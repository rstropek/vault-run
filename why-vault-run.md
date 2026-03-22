# Why Vault Run?

This document explains why **Vault Run** works well as an exercise for learning and practicing AI-assisted coding. It is written for trainers evaluating whether this example fits their teaching goals.

## A Single Domain, Many Disciplines

Vault Run is a board game, but building it touches nearly every area of software engineering. A single project creates opportunities to practice:

- **UI/UX**: Rendering an interactive board, player positioning, animating dice rolls and token movement, designing responsive layouts, handling drag-and-drop interactions.
- **Game logic**: Turn management, state machines, rule enforcement, contract ownership, truck capacity constraints, bankruptcy detection.
- **Distributed systems**: Real-time multiplayer over WebSockets or peer-to-peer, state synchronization, conflict resolution, reconnection handling.
- **Security**: Anti-cheat logic in multiplayer (server-authoritative state, input validation, preventing state tampering), secure session management.
- **AI/ML**: Computer-controlled players with different strategies, Monte Carlo simulation to evaluate and balance field configurations and chance card distributions.
- **Data persistence**: Saving and resuming games, leaderboards, player statistics, cluster-ready storage with databases like PostgreSQL or Redis.
- **Quality assurance**: Unit testing game logic (deterministic rules engine), integration testing distributed components, end-to-end testing full game flows.
- **DevOps**: CI/CD pipelines, containerization, deployment of multiplayer servers, infrastructure as code.

No single participant is expected to cover all of these. The point is that the domain is rich enough to support deep work in any direction.

## Structured Yet Open

The starter resources provide a solid foundation, complete game rules, board layout data with JSON Schemas, chance card definitions, and visual assets, so participants do not waste time inventing a domain. At the same time, the exercise leaves substantial design space open:

- **Game mechanics**: The rules are defined, but how to implement them (state machine, event sourcing, ECS) is up to the participant.
- **Chance cards**: The card effects range from trivial (receive money) to complex (move to the next contract field matching a filter). Implementing all 15 effect types is a real design challenge. Swift progress requires efficient use of AI tools.
- **Board rendering**: The SVG board is provided as a reference, but participants can render it however they want (e.g. canvas, WebGL, terminal ASCII art, or a completely different visual style).
- **Multiplayer architecture**: Central server? Peer-to-peer? Turn-based polling or real-time push? These are genuine architectural decisions with trade-offs.

This balance of structure and freedom is hard to achieve in a teaching exercise. Too much structure feels like filling in blanks. Too little structure leads to analysis paralysis. Vault Run hits a sweet spot.

## Natural Complexity Gradient

The game has a natural layering that maps well to incremental development:

1. **Trivial**: Display the board and position a player token.
2. **Easy**: Roll a die, move a player, handle direction choice.
3. **Medium**: Implement contract purchasing, fulfillment, and failure with fines.
4. **Hard**: Money management across Cash Vault and truck, capacity constraints, bankruptcy.
5. **Advanced**: Chance cards with 15 different effect types, including recursive field resolution.
6. **Expert**: Multiplayer synchronization, anti-cheat, AI opponents, game balancing via simulation.

Every participant can find the right level of challenge. Beginners get a working game with basic movement in a few hours. Advanced developers can spend an entire day on multiplayer architecture or AI strategy optimization. Nobody runs out of things to do.

## Ideal for AI-Assisted Development

Board games are particularly well-suited for AI code generation because:

- **The rules are unambiguous.** Natural-language game rules translate directly into code logic. AI models excel at this kind of spec-to-code translation.
- **The data is structured.** JSON files with schemas give the AI precise, machine-readable context. No guesswork about data formats.
- **The domain is familiar.** Every AI model has been trained on board game implementations. Concepts like turns, dice, boards, and cards are well-represented in training data.
- **Testing is straightforward.** Game rules produce deterministic outcomes for given inputs. "If a player with 30,000 in their truck lands on a deposit field requiring 50,000, the contract fails and they pay a fine" — this is a natural test case that the AI can generate.
- **The visual output is motivating.** Seeing a board render, tokens move, and dice animate provides immediate, visible feedback. This keeps participants engaged even during long AI-driven coding sessions.

## Flexible for Different Audiences

The exercise works for groups with mixed skill levels and backgrounds:

| Background                     | Natural focus area                                        |
| ------------------------------ | --------------------------------------------------------- |
| Frontend developers            | Board rendering, animations, responsive design            |
| Backend developers             | Game engine, rules logic, CLI interface                   |
| Full-stack developers          | Complete game with frontend and backend                   |
| Systems/network engineers      | Multiplayer architecture, WebSockets, state sync          |
| Security engineers             | Anti-cheat, input validation, server-authoritative design |
| Data scientists / ML engineers | AI players, strategy optimization, game balancing         |
| Mobile developers              | Native or cross-platform mobile game                      |
| DevOps engineers               | CI/CD, containerized deployment, infrastructure           |
| Students / beginners           | Board display, basic movement, learning AI workflows      |

Participants self-select their focus area. Teams of two can split work along natural boundaries (e.g., one person on frontend, one on backend) and practice real collaboration with Git.

## Teaching AI Coding Skills

Beyond the game itself, Vault Run teaches participants how to work effectively with AI coding assistants:

- **Spec-driven development**: Feeding structured rules and schemas to an AI and iterating on its output.
- **Prompt decomposition**: Breaking "build a board game" into manageable pieces the AI can handle one at a time.
- **Context management**: Learning which files to include in context, how much detail to provide, and when to start fresh.
- **Review and verification**: Reading AI-generated code critically, spotting logical errors, and guiding corrections.
- **Agentic workflows**: Setting up tooling so the AI can run, test, and fix its own code autonomously.
- **Parallel agent coordination**: Running multiple AI agents on independent tasks using Git worktrees.

These are the skills that matter in modern software development. Vault Run provides a concrete, engaging context to practice them.
