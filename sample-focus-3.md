# Focus: Interactive Board UI

**For**: Frontend developers, designers, or anyone who wants to build something visually impressive.

## The Idea

Take the provided SVG board and turn it into a fully interactive, animated game interface in the browser. Dice roll with physics, tokens glide along the board, contracts light up when purchased, chance cards flip with style. The game logic can run entirely in the browser, no server needed.

## Why This Focus?

Frontend work is where AI coding assistants shine the most visibly. You describe an animation, the AI writes the CSS or Canvas code, and you see the result instantly. This focus area produces the most impressive demos in the shortest time. It also forces you to solve real frontend challenges: SVG manipulation, coordinate transformations, responsive layouts, state-driven rendering, and smooth animations.

## Suggested Sprint Plan

### Sprint 1 — Board Rendering and Player Tokens

- Load `fields.json` and render the board. You can embed the provided SVG, redraw it with Canvas/WebGL, or generate it from the field data.
- Place player tokens on the Start field. Support 2-4 players with distinct colors.
- Make the board responsive — it should look good on different screen sizes.
- Add a basic HUD showing each player's name, Cash Vault balance, truck balance, and truck capacity.

**Working software at this point**: A rendered board with player tokens and a status display.

### Sprint 2 — Movement and Animation

- Implement dice rolling with a visual animation (bouncing die, spinning numbers, or a 3D CSS cube).
- Animate token movement: when a player moves, their token should glide along the board field by field, not teleport.
- Add a direction picker UI (clockwise / counter-clockwise) before each roll.
- Highlight the destination field when the token arrives.
- Handle passing Start — show a rebalancing dialog where the player can move money between Cash Vault and truck.

**Working software at this point**: Players can roll, choose direction, and watch their token move around the board.

### Sprint 3 — Contracts and Interactions

- When landing on an unowned field, show a purchase dialog with the contract price and field details.
- Visually mark owned contracts on the board (player color border, owner indicator, or glow effect).
- When landing on an owned field, show a fulfillment dialog — display whether the player can fulfill (truck space/cash) and the consequences of refusing.
- Animate money transfers: show numbers flowing between truck and Cash Vault.
- Display contract failure with a visual penalty effect (red flash, shake animation).

**Working software at this point**: A visually rich game where players can buy and fulfill contracts.

### Sprint 4 — Chance Cards and Special Fields

- Implement chance card drawing with a card-flip animation.
- Display the card's title, description, and effect with appropriate visual treatment.
- Animate card effects: token movement for move cards, money animations for pay/receive cards, a garage animation for send-to-garage.
- Implement the Garage corner: show a repair animation when a player is sent there.
- Implement the "Truck Broke" field with a breakdown animation leading to the Garage.

**Working software at this point**: A complete, animated single-player or hot-seat multiplayer game.

### Sprint 5 — Polish and Delight

- Add sound effects: dice roll, coin clink for payments, engine sounds for movement.
- Implement a game log panel showing recent actions in plain text.
- Implement both game modes (Limited Turns with a turn counter, Last One Standing with elimination effects).
- Dark mode / theme switching.
- Responsive design polish: test on mobile and tablet sizes.

## What You Will Practice

- SVG manipulation and coordinate math (the board is a rotated grid with fields at specific positions).
- Building state-driven UIs where game state determines what is rendered.
- Creating smooth, meaningful animations that communicate game events.
- Designing intuitive dialogs and interactions for complex game mechanics.
- Rapid prototyping with AI — describing visual effects in natural language and iterating on the generated code.
- Working with structured data (`fields.json`, `chance-card.json`) to drive dynamic rendering.
