# Focus: Multiplayer with Security

**For**: Network engineers, backend developers, or anyone interested in distributed systems and security.

## The Idea

Build a multiplayer Vault Run server where players connect from different machines. The server is the single source of truth. It validates every action, prevents cheating, and keeps all clients in sync. Clients are thin: they send intentions, the server decides what happens.

## Why This Focus?

Most coding exercises treat networking as an afterthought. Here, it is the core challenge. You have to solve real distributed systems problems: state synchronization, conflict resolution, disconnection handling, and security. In a competitive game, every client-side decision is an attack surface. Can a player fake a dice roll? Claim a contract they cannot afford? Modify their truck capacity? Your architecture has to make these attacks impossible by design.

## Suggested Sprint Plan

### Sprint 1 — Server with Game State

- Build an HTTP or WebSocket server that holds the canonical game state.
- Implement a lobby: players join by name, the host starts the game when ready.
- Expose endpoints or messages for the basic game loop: `choose-direction`, `roll-dice`, `end-turn`.
- The server generates dice rolls (not the client) — this is your first anti-cheat measure.
- A minimal client (CLI or bare HTML page) connects and displays the current state.

**Working software at this point**: Players can connect and take turns with server-validated movement.

### Sprint 2 — Server-Authoritative Actions

- Implement contract purchasing: client sends `buy-contract` intent, server validates funds and ownership.
- Implement contract fulfillment: server checks truck capacity/cash before allowing pickup/deposit.
- Implement contract failure and fines — server enforces automatically when a player cannot fulfill.
- All money calculations happen server-side. The client never modifies balances.
- Add request validation: reject malformed messages, out-of-turn actions, and impossible moves.

**Working software at this point**: A playable multiplayer game with server-enforced rules.

### Sprint 3 — Sync, Reconnection, and Edge Cases

- Implement state broadcasting: after every action, push the full (or delta) game state to all clients.
- Handle disconnections gracefully: if a player disconnects, pause their timer or skip their turn after a timeout.
- Allow reconnection: a returning player receives the full current state and resumes.
- Implement the 30-second negotiation timer for contract trades — server enforces the deadline.
- Handle race conditions: what if two requests arrive simultaneously? Use a turn lock or action queue.

**Working software at this point**: A robust multiplayer game that handles real-world network conditions.

### Sprint 4 — Security Hardening

- Implement player authentication (simple tokens or session IDs) — prevent one player from sending actions as another.
- Add rate limiting to prevent spam or denial-of-service.
- Audit every endpoint: can a player see another player's Cash Vault balance? Should they? Define what information each client receives.
- Implement server-side chance card deck — clients never see the deck order.
- Add action logging: record every move with timestamps for post-game review or dispute resolution.
- Test with a malicious client: write a script that sends invalid moves, out-of-turn actions, and tampered data. Verify the server rejects all of them.

**Working software at this point**: A hardened multiplayer server resistant to common cheating vectors.

### Sprint 5 — Observability and Scale

- Add a spectator mode: clients can watch a game without participating.
- Implement game persistence: save state to a database so games can survive server restarts.
- Add structured logging and basic metrics (active games, connected players, actions per second).
- Optionally: containerize the server and deploy it so other teams can connect.

## What You Will Practice

- Designing server-authoritative architecture where the client is untrusted.
- Real-time communication with WebSockets (or SSE, or polling — your choice).
- Handling distributed systems concerns: ordering, consistency, reconnection.
- Thinking adversarially: every input is a potential attack vector.
- Building observable systems with logging and metrics.
- Feeding architecture constraints to an AI so it generates secure-by-default code.
