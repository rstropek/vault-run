// VAULT RUN — Board Game SVG Generator
// Run:    node generate-board.js
// Output: vault-run-board.svg
//
// To tweak the look without regenerating, edit the <defs><style> block in the
// output SVG directly — all colors, fonts, and common styles are defined there.

import fs from 'fs';

// ─── Canvas & geometry ────────────────────────────────────────────────────────

const SVG_SIZE     = 1200;
const BOARD_MARGIN = 60;
const BOARD_SIZE   = SVG_SIZE - BOARD_MARGIN * 2;              // 1080
const CORNER_SIZE  = 180;
const FIELD_COUNT  = 4;                                        // non-corner fields per side
const FIELD_HEIGHT = CORNER_SIZE;                              // depth into the board
const FIELD_WIDTH  = (BOARD_SIZE - CORNER_SIZE * 2) / FIELD_COUNT;  // 180
const BOARD_X      = BOARD_MARGIN;
const BOARD_Y      = BOARD_MARGIN;
const STRIP_H        = 60;                                     // color-indicator height (regular fields)
const CORNER_STRIP_H = STRIP_H;                                // player-area strip height (corners, same as regular fields)
const OUTPUT_FILE  = 'vault-run-board.svg';

// ─── Field data ───────────────────────────────────────────────────────────────
//
// Fields are listed in board order (clockwise, starting from Start).
//   type:        'corner' | 'pickup' | 'deposit' | 'chance'
//   cornerType:  'start' | 'garage' | 'break' | 'truck'   (corners only)
//   amount:      pickup / deposit value  (null for non-location fields)
//   contractPrice: purchase price        (null for non-location fields)

const FIELDS = [
  // ── Bottom row, right → left  (Start → Garage) ───────────────────────────
  { id:  1, name: 'Start',                        type: 'corner',  cornerType: 'start',  amount: null,   contractPrice: null    },
  { id:  2, name: 'Penny Lane Kiosk',              type: 'pickup',  cornerType: null,     amount: 15_000, contractPrice:  80_000 },
  { id:  3, name: 'Union Savings Bank',            type: 'deposit', cornerType: null,     amount: 40_000, contractPrice: 180_000 },
  { id:  4, name: 'Night Owl Supermarket',         type: 'pickup',  cornerType: null,     amount: 25_000, contractPrice: 120_000 },
  { id:  5, name: 'Chance',                        type: 'chance',  cornerType: null,     amount: null,   contractPrice: null    },
  // ── Left column, bottom → top  (Garage → Take a Break) ──────────────────
  { id:  6, name: 'Garage',                        type: 'corner',  cornerType: 'garage', amount: null,   contractPrice: null    },
  { id:  7, name: 'City Mall Cash Desk',           type: 'pickup',  cornerType: null,     amount: 35_000, contractPrice: 160_000 },
  { id:  8, name: 'Lucky Dragon Casino',           type: 'pickup',  cornerType: null,     amount: 60_000, contractPrice: 260_000 },
  { id:  9, name: 'Market Square Bank',            type: 'deposit', cornerType: null,     amount: 50_000, contractPrice: 220_000 },
  { id: 10, name: 'Chance',                        type: 'chance',  cornerType: null,     amount: null,   contractPrice: null    },
  // ── Top row, left → right  (Take a Break → Truck Broke) ─────────────────
  { id: 11, name: 'Take a Break',                  type: 'corner',  cornerType: 'break',  amount: null,   contractPrice: null    },
  { id: 12, name: 'Main Station Ticket Center',    type: 'pickup',  cornerType: null,     amount: 20_000, contractPrice: 100_000 },
  { id: 13, name: 'Golden Goose Jewelry',          type: 'deposit', cornerType: null,     amount: 30_000, contractPrice: 150_000 },
  { id: 14, name: 'Harbor Trade Bank',             type: 'deposit', cornerType: null,     amount: 70_000, contractPrice: 300_000 },
  { id: 15, name: 'Chance',                        type: 'chance',  cornerType: null,     amount: null,   contractPrice: null    },
  // ── Right column, top → bottom  (Truck Broke → Start) ───────────────────
  { id: 16, name: 'Truck Broke\u2014Go to Garage', type: 'corner',  cornerType: 'truck',  amount: null,   contractPrice: null    },
  { id: 17, name: 'Green Garden Pharmacy',         type: 'deposit', cornerType: null,     amount: 15_000, contractPrice:  90_000 },
  { id: 18, name: 'Jackpot Electronics',           type: 'pickup',  cornerType: null,     amount: 45_000, contractPrice: 210_000 },
  { id: 19, name: 'Capital Corner Bank',           type: 'deposit', cornerType: null,     amount: 80_000, contractPrice: 340_000 },
  { id: 20, name: 'Chance',                        type: 'chance',  cornerType: null,     amount: null,   contractPrice: null    },
];

// ─── Player positions ─────────────────────────────────────────────────────────
// Maps field id → array of player indices (0–3) currently on that field.
// Edit this to move players around the board.

const PLAYER_POSITIONS = {
  3: [0, 1, 2, 3],   // demo: all four players on Union Savings Bank
};

// ─── Design tokens ────────────────────────────────────────────────────────────
// These values are written verbatim into the SVG <style> block as CSS custom
// properties.  Edit either here (to regenerate) or in the SVG directly.

const PALETTE = {
  svgBg:        '#06101E',   // page background
  boardBorder:  '#1E3A5F',   // outer board frame
  boardSurface: '#F5F2EA',   // main board surface (cream)
  fieldBg:      '#F5F2EA',   // individual field background
  fieldBorder:  '#B8A88A',   // field cell borders
  cornerBg:     '#0A1628',   // corner square background
  cornerText:   '#D4AF37',   // corner primary text (gold)
  cornerSub:    '#8FB3D4',   // corner secondary text (steel blue)
  pickup:       '#C8941F',   // pickup-type color strip (amber)
  deposit:      '#1A4F8A',   // deposit-type color strip (blue)
  chance:       '#7B1010',   // chance field color (crimson)
  textDark:     '#0A1628',   // field title text
  textAmount:   '#1A4F8A',   // monetary amounts
  textLabel:    '#6B7280',   // small label text (Contract, Pickup…)
  centerBg:     '#0A1628',   // center area background
  centerBorder: '#D4AF37',   // center area border (gold)
  centerTitle:  '#D4AF37',   // VAULT RUN title
  centerSub:    '#8FB3D4',   // center subtitle / hint
  garageInner:  '#091520',   // inner rect of the Garage corner
  cornerStrip:  '#152438',   // player-area strip on corners (slightly lighter than corner bg)
  player1:      '#C0392B',   // player 1 — red
  player2:      '#27AE60',   // player 2 — green
  player3:      '#2471A3',   // player 3 — blue
  player4:      '#7D3C98',   // player 4 — purple
  measureColor: '#5B8DB8',   // engineering dimension annotations
};

const FONT = "'Helvetica Neue', Arial, 'Liberation Sans', sans-serif";

// ─── CSS (embedded into <defs><style> in the SVG output) ─────────────────────

function buildCSS() {
  const p = PALETTE;
  return `
    :root {
      /* ── Color palette ─────────────────────────────────── */
      --c-svg-bg:        ${p.svgBg};
      --c-board-border:  ${p.boardBorder};
      --c-board-surface: ${p.boardSurface};
      --c-field-bg:      ${p.fieldBg};
      --c-field-border:  ${p.fieldBorder};
      --c-corner-bg:     ${p.cornerBg};
      --c-corner-text:   ${p.cornerText};
      --c-corner-sub:    ${p.cornerSub};
      --c-pickup:        ${p.pickup};
      --c-deposit:       ${p.deposit};
      --c-chance:        ${p.chance};
      --c-text-dark:     ${p.textDark};
      --c-text-amount:   ${p.textAmount};
      --c-text-label:    ${p.textLabel};
      --c-center-bg:     ${p.centerBg};
      --c-center-border: ${p.centerBorder};
      --c-center-title:  ${p.centerTitle};
      --c-center-sub:    ${p.centerSub};
      --c-garage-inner:  ${p.garageInner};
      --c-corner-strip:  ${p.cornerStrip};
      --c-player-1:      ${p.player1};
      --c-player-2:      ${p.player2};
      --c-player-3:      ${p.player3};
      --c-player-4:      ${p.player4};
      --c-measure:       ${p.measureColor};
      /* ── Typography ─────────────────────────────────────── */
      --font: ${FONT};
    }

    /* Base */
    text { font-family: var(--font); }

    /* ── Shape classes ──────────────────────────────────────── */
    .svg-bg        { fill: var(--c-svg-bg); }
    .board-frame   { fill: var(--c-board-border); }
    .board-surface { fill: var(--c-board-surface); }
    .field-bg      { fill: var(--c-field-bg); }
    .field-border  { fill: none; stroke: var(--c-field-border); stroke-width: 1; }
    .corner-bg     { fill: var(--c-corner-bg);   stroke: var(--c-board-border);  stroke-width: 1.5; }
    .strip-pickup  { fill: var(--c-pickup); }
    .strip-deposit { fill: var(--c-deposit); }
    .strip-chance  { fill: var(--c-chance); }
    .garage-inner  { fill: var(--c-garage-inner); stroke: var(--c-corner-text); stroke-width: 1.5; }
    .corner-strip  { fill: var(--c-corner-strip); }
    .corner-border { fill: none; stroke: var(--c-board-border); stroke-width: 1.5; }
    .center-area   { fill: var(--c-center-bg); }
    .divider       { fill: none; stroke: var(--c-field-border);  stroke-width: 0.5; }
    .center-border { fill: none; stroke: var(--c-center-border); stroke-width: 1.5; }
    .center-deco   { fill: none; stroke: var(--c-center-border); stroke-width: 0.4; opacity: 0.5; }
    .center-rule   { fill: none; stroke: var(--c-center-border); stroke-width: 0.8; opacity: 0.6; }
    .corner-icon        { fill: var(--c-corner-text); }
    .corner-icon-dimmed { fill: var(--c-corner-text); opacity: 0.4; }

    /* ── Text classes ───────────────────────────────────────── */
    .t-field-name  { font-size: 14.5px; font-weight: 700; fill: var(--c-text-dark); }
    .t-label       { font-size: 7.5px;                    fill: var(--c-text-label); }
    .t-amount      { font-size: 9.5px;  font-weight: 600; fill: var(--c-text-amount); }
    .t-corner-label { font-size: 17px;  font-weight: 700; fill: var(--c-corner-text); }
    .t-corner-sub   { font-size: 10px;                   fill: var(--c-corner-sub);  font-style: italic; }
    .t-chance      { font-size: 13px;   font-weight: 800; fill: var(--c-chance);      letter-spacing: 2px; }
    .t-chance-wm   { font-size: 64px;   font-weight: 900; fill: var(--c-chance);      opacity: 0.15; }
    .t-center-h1   { font-size: 52px;   font-weight: 900; fill: var(--c-center-title); letter-spacing: 6px; }
    .t-center-sub  { font-size: 16px;                     fill: var(--c-center-sub);  letter-spacing: 2px; }
    .t-center-hint { font-size: 11px;                     fill: var(--c-center-sub);  opacity: 0.6; }
    .player-token  { /* glow handled via stroke on circle */ }

    /* ── Measurement annotations (measured SVG only) ────────── */
    .dim-line  { stroke: var(--c-measure); stroke-width: 0.8; fill: none; }
    .dim-ext   { stroke: var(--c-measure); stroke-width: 0.6; fill: none; stroke-dasharray: 4 2; }
    .dim-label { font-size: 10px; font-weight: 600; fill: var(--c-measure); }
    .dim-bg    { fill: #ffffff; opacity: 0.85; }
  `.trim();
}

// ─── Player icon data ─────────────────────────────────────────────────────────
// Truck path (Font Awesome: truck, viewBox 640×640).
// Bounding box approx. x: 32–608 (w≈576), y: 96–576 (h≈480), center ≈ (320, 336).

const TRUCK_PATH = 'M32 160C32 124.7 60.7 96 96 96L384 96C419.3 96 448 124.7 448 160L448 192'
  + ' L498.7 192C515.7 192 532 198.7 544 210.7L589.3 256C601.3 268 608 284.3 608 301.3L608 448'
  + ' C608 483.3 579.3 512 544 512L540.7 512C530.3 548.9 496.3 576 456 576C415.7 576 381.8'
  + ' 548.9 371.3 512L268.7 512C258.3 548.9 224.3 576 184 576C143.7 576 109.8 548.9 99.3 512'
  + ' L96 512C60.7 512 32 483.3 32 448L32 160zM544 352L544 301.3L498.7 256L448 256L448 352'
  + ' L544 352zM224 488C224 465.9 206.1 448 184 448C161.9 448 144 465.9 144 488C144 510.1'
  + ' 161.9 528 184 528C206.1 528 224 510.1 224 488zM456 528C478.1 528 496 510.1 496 488'
  + ' C496 465.9 478.1 448 456 448C433.9 448 416 465.9 416 488C416 510.1 433.9 528 456 528z';

const PLAYER_COLORS = [
  'var(--c-player-1)',
  'var(--c-player-2)',
  'var(--c-player-3)',
  'var(--c-player-4)',
];

const PLAYER_R = 17.5; // circle radius for player tokens (35px diameter)

// Renders a single player token centered on (0, 0).
// Position it on the board by wrapping in a <g transform="translate(x,y)">.
function renderPlayerToken(playerIndex) {
  const s  = (PLAYER_R * 1.5 * 0.75) / 576;
  const tx = (-320 * s).toFixed(2);
  const ty = (-336 * s).toFixed(2);
  return `<circle cx="0" cy="0" r="${PLAYER_R}" style="fill:${PLAYER_COLORS[playerIndex]};stroke:var(--c-field-bg);stroke-width:1.5"/>`
    + `<g transform="translate(${tx},${ty}) scale(${s.toFixed(4)})">`
    +   `<path d="${TRUCK_PATH}" style="fill:var(--c-field-bg)"/>`
    + `</g>`;
}

// Converts a point in a field's local coordinate space to absolute SVG coordinates
// by applying the same rotate(rot, cx, cy) transform used to draw the field.
function fieldToAbsolute(f, localX, localY) {
  const theta = f.rot * Math.PI / 180;
  const dx = localX - f.cx;
  const dy = localY - f.cy;
  return {
    x: f.cx + dx * Math.cos(theta) - dy * Math.sin(theta),
    y: f.cy + dx * Math.sin(theta) + dy * Math.cos(theta),
  };
}

// Emits one top-level <g id="player-N" transform="translate(x,y)"> per player.
// Moving a player later only requires updating the transform attribute.
// Players listed in PLAYER_POSITIONS are placed on their field's color strip;
// unplaced players are rendered off-board at (0,0).
function renderPlayers(layout) {
  const R = PLAYER_R, gap = 6;
  const placement = {};
  for (const [fieldId, players] of Object.entries(PLAYER_POSITIONS)) {
    const fld = layout.find(f => f.id === Number(fieldId));
    if (!fld) continue;
    players.forEach((pi, slot) => {
      placement[pi] = { field: fld, slotIndex: slot, totalSlots: players.length };
    });
  }
  return [0, 1, 2, 3].map(pi => {
    let ax = 0, ay = 0;
    const info = placement[pi];
    if (info) {
      const { field: f, slotIndex, totalSlots } = info;
      const stripH = f.type === 'corner' ? CORNER_STRIP_H : STRIP_H;
      const totalW = totalSlots * 2 * R + (totalSlots - 1) * gap;
      const localX = f.x + (f.w - totalW) / 2 + R + slotIndex * (2 * R + gap);
      const localY = f.y + f.h - stripH / 2;
      ({ x: ax, y: ay } = fieldToAbsolute(f, localX, localY));
    }
    return `<g id="player-${pi + 1}" class="player-token" transform="translate(${ax.toFixed(1)},${ay.toFixed(1)})">`
      + renderPlayerToken(pi)
      + '</g>';
  }).join('');
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function fmt(n) {
  return '\u20AC ' + n.toLocaleString('en-US');
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapText(str, maxLen) {
  const words = str.split(' ');
  const lines = [];
  let current = '';
  for (const w of words) {
    const candidate = current ? current + ' ' + w : w;
    if (candidate.length > maxLen) {
      if (current) lines.push(current);
      current = w;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// ─── SVG primitives ───────────────────────────────────────────────────────────

const r = (x, y, w, h, attrs = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${attrs}/>`;

const t = (x, y, content, attrs = '') =>
  `<text x="${x}" y="${y}" ${attrs}>${content}</text>`;

const l = (x1, y1, x2, y2, attrs = '') =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${attrs}/>`;

const g = (content, attrs = '') =>
  `<g ${attrs}>${content}</g>`;

// ─── Layout engine ────────────────────────────────────────────────────────────

function layoutFields(fields) {
  const out = [];

  const corner = (field, x, y, side) => out.push({
    ...field, x, y, w: CORNER_SIZE, h: CORNER_SIZE,
    cx: x + CORNER_SIZE / 2, cy: y + CORNER_SIZE / 2, side, rot: 0,
  });

  const regular = (field, x, y, w, h, side, rot) => out.push({
    ...field, x, y, w, h,
    cx: x + w / 2, cy: y + h / 2, side, rot,
  });

  // Corners
  corner(fields[0],  BOARD_X + BOARD_SIZE - CORNER_SIZE, BOARD_Y + BOARD_SIZE - CORNER_SIZE, 'bottom-right');
  corner(fields[5],  BOARD_X,                            BOARD_Y + BOARD_SIZE - CORNER_SIZE, 'bottom-left');
  corner(fields[10], BOARD_X,                            BOARD_Y,                            'top-left');
  corner(fields[15], BOARD_X + BOARD_SIZE - CORNER_SIZE, BOARD_Y,                            'top-right');

  // Bottom row (right → left)
  for (let i = 0; i < 4; i++)
    regular(fields[1 + i],
      BOARD_X + BOARD_SIZE - CORNER_SIZE - (i + 1) * FIELD_WIDTH,
      BOARD_Y + BOARD_SIZE - CORNER_SIZE,
      FIELD_WIDTH, FIELD_HEIGHT, 'bottom', 0);

  // Left column (bottom → top)
  for (let i = 0; i < 4; i++)
    regular(fields[6 + i],
      BOARD_X,
      BOARD_Y + BOARD_SIZE - CORNER_SIZE - (i + 1) * FIELD_WIDTH,
      FIELD_WIDTH, FIELD_HEIGHT, 'left', 90);

  // Top row (left → right)
  for (let i = 0; i < 4; i++)
    regular(fields[11 + i],
      BOARD_X + CORNER_SIZE + i * FIELD_WIDTH,
      BOARD_Y,
      FIELD_WIDTH, FIELD_HEIGHT, 'top', 0);

  // Right column (top → bottom)
  for (let i = 0; i < 4; i++)
    regular(fields[16 + i],
      BOARD_X + BOARD_SIZE - CORNER_SIZE,
      BOARD_Y + CORNER_SIZE + i * FIELD_WIDTH,
      FIELD_WIDTH, FIELD_HEIGHT, 'right', 270);

  return out;
}

// ─── Corner renderers ─────────────────────────────────────────────────────────

function renderCornerField(f) {
  const { x, y, w, h, cornerType } = f;
  const cx = x + w / 2;

  // Background + player strip at bottom + border on top
  const bg = r(x, y, w, h, 'class="corner-bg"')
    + r(x, y + h - CORNER_STRIP_H, w, CORNER_STRIP_H, 'class="corner-strip"')
    + r(x, y, w, h, 'class="field-border"');

  // Available vertical area above the strip
  const contentH = h - CORNER_STRIP_H;  // 130px

  // Places Font Awesome icon (viewBox 640×640) scaled to iconPx, centered horizontally.
  const mkIcon = (paths, iconPx, ty) => {
    const s  = iconPx / 640;
    const tx = x + (w - iconPx) / 2;
    return `<g transform="translate(${tx},${ty}) scale(${s})">${paths.join('')}</g>`;
  };

  // Label position — anchored just above the strip
  const labelY1 = y + contentH - 26;

  if (cornerType === 'start') {
    // Font Awesome Free v7.2.0: arrows-left-right
    const d = 'M502.6 438.6L598.6 342.6C611.1 330.1 611.1 309.8 598.6 297.3L502.6 201.3'
      + 'C490.1 188.8 469.8 188.8 457.3 201.3C444.8 213.8 444.8 234.1 457.3 246.6L498.7 288'
      + 'L141.2 288L182.6 246.6C195.1 234.1 195.1 213.8 182.6 201.3C170.1 188.8 149.8 188.8'
      + ' 137.3 201.3L41.3 297.3C35.3 303.3 31.9 311.4 31.9 319.9C31.9 328.4 35.3 336.5 41.3'
      + ' 342.5L137.3 438.5C149.8 451 170.1 451 182.6 438.5C195.1 426 195.1 405.7 182.6 393.2'
      + 'L141.2 351.8L498.7 351.8L457.3 393.2C444.8 405.7 444.8 426 457.3 438.5C469.8 451'
      + ' 490.1 451 502.6 438.5z';
    return bg
      + mkIcon([`<path d="${d}" class="corner-icon"/>`], 62, y + 16)
      + t(cx, labelY1, 'Start', 'class="t-corner-label" text-anchor="middle"');
  }

  if (cornerType === 'garage') {
    // Font Awesome Pro: car-wrench (two paths: body dimmed, wrench solid)
    const dBody   = 'M96.3 416L96.3 544C96.3 561.7 110.6 576 128.3 576L144.3 576C162 576 176.3'
      + ' 561.7 176.3 544L176.3 512L464.3 512L464.3 544C464.3 561.7 478.6 576 496.3 576L512.3'
      + ' 576C530 576 544.3 561.7 544.3 544L544.3 416C544.3 392 531.1 371.1 511.5 360.1L510.2'
      + ' 356.7L473.9 259.8C462.2 228.6 432.3 207.9 399 207.9L241.5 207.9C208.2 207.9 178.3'
      + ' 228.6 166.6 259.8L130.3 356.7L129 360.1C109.6 371.1 96.3 392 96.3 416zM224.3 432'
      + ' C224.3 449.7 210 464 192.3 464C174.6 464 160.3 449.7 160.3 432C160.3 414.3 174.6 400'
      + ' 192.3 400C210 400 224.3 414.3 224.3 432zM200.5 352L226.6 282.4C228.9 276.2 234.9 272'
      + ' 241.6 272L399.1 272C405.8 272 411.7 276.1 414.1 282.4L440.2 352L200.6 352zM480.3 432'
      + ' C480.3 449.7 466 464 448.3 464C430.6 464 416.3 449.7 416.3 432C416.3 414.3 430.6 400'
      + ' 448.3 400C466 400 480.3 414.3 480.3 432z';
    const dWrench = 'M217.7 144C205.4 172.3 177.2 192 144.4 192C108.6 192 78.3 168.5 68.1 136'
      + ' L136.4 136C149.6 136 160.3 125.4 160.4 112.2L160.4 111.8C160.2 98.6 149.5 88 136.3 88'
      + ' L68 88C78.2 55.5 108.5 32 144.3 32C177.1 32 205.3 51.7 217.6 80L423 80C435.3 51.7'
      + ' 463.5 32 496.3 32C532.1 32 562.4 55.5 572.6 88L504.3 88C491.1 88 480.4 98.7 480.3'
      + ' 111.9L480.3 112.1C480.4 125.3 491.1 136 504.3 136L572.6 136C562.4 168.5 532.1 192'
      + ' 496.3 192C463.5 192 435.3 172.3 423 144L217.7 144z';
    return bg
      + mkIcon([
          `<path d="${dBody}"   class="corner-icon-dimmed"/>`,
          `<path d="${dWrench}" class="corner-icon"/>`,
        ], 62, y + 16)
      + t(cx, labelY1, 'Garage', 'class="t-corner-label" text-anchor="middle"');
  }

  if (cornerType === 'break') {
    // Font Awesome Pro: face-sleeping
    const d = 'M532 24C532 13 541 4 552 4L616 4C623.7 4 630.7 8.4 634 15.3C637.3 22.2 636.4 30.5'
      + ' 631.6 36.5L593.6 84L616 84C627 84 636 93 636 104C636 115 627 124 616 124L552 124'
      + ' C544.3 124 537.3 119.6 534 112.7C530.7 105.8 531.6 97.5 536.4 91.5L574.4 44L552 44'
      + ' C541 44 532 35 532 24zM388 120C388 109 397 100 408 100L472 100C479.7 100 486.7 104.4'
      + ' 490 111.3C493.3 118.2 492.4 126.5 487.6 132.5L449.6 180L472 180C483 180 492 189 492'
      + ' 200C492 211 483 220 472 220L408 220C400.3 220 393.3 215.6 390 208.7C386.7 201.8 387.6'
      + ' 193.5 392.4 187.5L430.4 140L408 140C397 140 388 131 388 120zM364.4 67.8C349.5 80.3'
      + ' 340 99 340 120C340 135 344.8 148.8 353 160C338.3 180.2 335.8 206.8 346.7 229.5C358'
      + ' 253.1 381.8 268 408 268L472 268C509.6 268 540 237.6 540 200C540 195.5 539.6 191.2'
      + ' 538.7 186.9C562.3 225.7 576 271.2 576 320C576 461.4 461.4 576 320 576C178.6 576 64'
      + ' 461.4 64 320C64 178.6 178.6 64 320 64C335.1 64 350 65.3 364.4 67.8zM196 344C196 333'
      + ' 187 324 176 324C165 324 156 333 156 344C156 377.1 182.9 404 216 404L232 404C265.1 404'
      + ' 292 377.1 292 344C292 333 283 324 272 324C261 324 252 333 252 344C252 355 243 364 232'
      + ' 364L216 364C205 364 196 355 196 344zM408 364C397 364 388 355 388 344C388 333 379 324'
      + ' 368 324C357 324 348 333 348 344C348 377.1 374.9 404 408 404L424 404C457.1 404 484'
      + ' 377.1 484 344C484 333 475 324 464 324C453 324 444 333 444 344C444 355 435 364 424 364'
      + ' L408 364zM360 480C360 457.9 342.1 440 320 440C297.9 440 280 457.9 280 480C280 502.1'
      + ' 297.9 520 320 520C342.1 520 360 502.1 360 480z';
    return bg
      + mkIcon([`<path d="${d}" class="corner-icon"/>`], 62, y + 16)
      + t(cx, labelY1, 'Take a Break', 'class="t-corner-label" text-anchor="middle"');
  }

  if (cornerType === 'truck') {
    // Font Awesome Free: car-burst
    const d = 'M232 80.1L232 32.1C232 18.8 221.3 8.1 208 8.1C194.7 8.1 184 18.8 184 32.1L184'
      + ' 80.1C184 93.4 194.7 104.1 208 104.1C221.3 104.1 232 93.4 232 80.1zM32 232.1L80 232.1'
      + ' C93.3 232.1 104 221.4 104 208.1C104 194.8 93.3 184.1 80 184.1L32 184.1C18.7 184.1 8'
      + ' 194.8 8 208.1C8 221.4 18.7 232.1 32 232.1zM281.5 134.6C290.9 144 306.1 144 315.4'
      + ' 134.6L349.3 100.7C358.7 91.3 358.7 76.1 349.3 66.8C339.9 57.5 324.7 57.4 315.4 66.8'
      + ' L281.5 100.6C272.1 110 272.1 125.2 281.5 134.5zM100.5 349.6L134.4 315.7C143.8 306.3'
      + ' 143.8 291.1 134.4 281.8C125 272.5 109.8 272.4 100.5 281.8L66.6 315.6C57.2 325 57.2'
      + ' 340.2 66.6 349.5C76 358.8 91.2 358.9 100.5 349.5zM66.6 66.7C57.2 76.1 57.2 91.3 66.6'
      + ' 100.6L100.5 134.5C109.9 143.9 125.1 143.9 134.4 134.5C143.7 125.1 143.8 109.9 134.4'
      + ' 100.6L100.5 66.7C91.1 57.3 76 57.3 66.6 66.7zM352.9 239.4L505 280.2C511.4 281.9'
      + ' 516.1 287.5 516.8 294.1L524 368.1L292.5 306.1L335.7 245.6C339.6 240.2 346.4 237.7'
      + ' 352.9 239.4zM223.6 292.5L221.5 295.4C199.8 300.9 181.6 317.7 175.4 340.9C171.3 356.4'
      + ' 163 387.3 150.6 433.6L142.3 464.5C137.7 481.6 147.9 499.1 164.9 503.7L180.4 507.8'
      + ' C197.5 512.4 215 502.2 219.6 485.2L227.9 454.3L506.1 528.8L497.8 559.7C493.2 576.8'
      + ' 503.4 594.3 520.4 598.9L535.9 603C553 607.6 570.5 597.4 575.1 580.4C579.2 564.9 587.5'
      + ' 534 599.9 487.7L608.2 456.8C614.4 433.6 607.1 410 591 394.3L590.7 390.7L580.7 287.7'
      + ' C577.5 254.5 554 226.8 521.8 218.2L369.5 177.6C337.3 169 303.1 181.2 283.7 208.4'
      + ' L223.5 292.6zM272.3 350.3C283.5 353.1 292.3 361.7 295.4 372.9C298.4 384.1 295.2 396'
      + ' 287 404.1C278.8 412.2 266.8 415.3 255.7 412.1C244.5 409.3 235.7 400.7 232.6 389.5'
      + ' C229.6 378.3 232.8 366.4 241 358.3C249.2 350.2 261.2 347.1 272.3 350.3zM480.4 439.2'
      + ' C483.2 428 491.8 419.2 503 416.1C514.2 413.1 526.1 416.3 534.2 424.5C542.3 432.7'
      + ' 545.4 444.7 542.2 455.8C539.4 467 530.8 475.8 519.6 478.9C508.4 481.9 496.5 478.7'
      + ' 488.4 470.5C480.3 462.3 477.2 450.3 480.4 439.2z';
    return bg
      + mkIcon([`<path d="${d}" class="corner-icon"/>`], 62, y + 16)
      + t(cx, labelY1, 'Truck Broke', 'class="t-corner-label" text-anchor="middle"');
  }

  return bg;
}

// ─── Regular field renderer ───────────────────────────────────────────────────

function renderRegularField(f) {
  const { x, y, w, h, cx, cy, rot, type, name, amount, contractPrice } = f;

  const stripClass = type === 'pickup' ? 'strip-pickup' : 'strip-deposit';
  const tagLabel   = type === 'pickup' ? 'PICKUP' : 'DEPOSIT';

  const pad            = 10;  // gives title area = h − STRIP_H − pad − tableH = 70px
  const textAreaTop    = y + pad;
  const textAreaBottom = y + h - STRIP_H - pad;

  // Table section: fixed height, anchored at bottom of text area
  const tableH  = 40;
  const divY    = textAreaBottom - tableH;
  const rowY    = divY + 6;
  const halfW   = (w - pad * 2) / 2;
  const leftCx  = x + pad + halfW / 2;
  const rightCx = x + pad + halfW + halfW / 2;
  const midX    = x + w / 2;

  // Field name: vertically centered in the upper area
  const lines      = wrapText(name, 13);
  const lineH      = 17;
  const nameMidY   = textAreaTop + (divY - textAreaTop) / 2;
  const nameStartY = nameMidY - ((lines.length - 1) * lineH) / 2;

  let content = r(x, y, w, h, 'class="field-bg"')
    + r(x, y + h - STRIP_H, w, STRIP_H, `class="${stripClass}"`)
    + r(x, y, w, h, 'class="field-border"');

  for (let i = 0; i < lines.length; i++)
    content += t(x + w / 2, nameStartY + i * lineH, esc(lines[i]),
      'class="t-field-name" text-anchor="middle"');

  content += l(x + pad, divY, x + w - pad, divY, 'class="divider"')
    + l(midX, rowY - 2, midX, textAreaBottom, 'class="divider"')
    + t(leftCx,  rowY + 10, esc('Contract'),        'class="t-label"  text-anchor="middle"')
    + t(leftCx,  rowY + 24, esc(fmt(contractPrice)), 'class="t-amount" text-anchor="middle"')
    + t(rightCx, rowY + 10, esc(tagLabel),           'class="t-label"  text-anchor="middle"')
    + t(rightCx, rowY + 24, esc(fmt(amount)),         'class="t-amount" text-anchor="middle"');

  return g(content, `transform="rotate(${rot},${cx},${cy})"`);
}

// ─── Chance field renderer ────────────────────────────────────────────────────

function renderChanceField(f) {
  const { x, y, w, h, cx, cy, rot } = f;
  const content = r(x, y, w, h, 'class="field-bg"')
    + r(x, y + h - STRIP_H, w, STRIP_H, 'class="strip-chance"')
    + r(x, y, w, h, 'class="field-border"')
    + t(x + w / 2, y + h / 2 + 8, '?',      'class="t-chance-wm" text-anchor="middle"')
    + t(x + w / 2, y + 44,         'CHANCE', 'class="t-chance"    text-anchor="middle"');
  return g(content, `transform="rotate(${rot},${cx},${cy})"`);
}

// ─── Board chrome ─────────────────────────────────────────────────────────────

function renderBoardBackground(w = SVG_SIZE, h = SVG_SIZE) {
  return r(0, 0, w, h, 'class="svg-bg"')
    + r(BOARD_X - 6, BOARD_Y - 6, BOARD_SIZE + 12, BOARD_SIZE + 12, 'class="board-frame" rx="8"')
    + r(BOARD_X, BOARD_Y, BOARD_SIZE, BOARD_SIZE, 'class="board-surface" rx="4"');
}

function renderCenterArea() {
  const cx     = BOARD_X + BOARD_SIZE / 2;
  const cy     = BOARD_Y + BOARD_SIZE / 2;
  const innerX = BOARD_X + FIELD_HEIGHT;
  const innerY = BOARD_Y + FIELD_HEIGHT;
  const innerW = BOARD_SIZE - FIELD_HEIGHT * 2;
  const innerH = BOARD_SIZE - FIELD_HEIGHT * 2;
  const pad    = 12;
  const rPad   = pad + 6;
  const ruleW  = 200;

  return r(innerX, innerY, innerW, innerH, 'class="center-area"')
    + r(innerX + pad,  innerY + pad,  innerW - pad  * 2, innerH - pad  * 2, 'class="center-border" rx="4"')
    + r(innerX + rPad, innerY + rPad, innerW - rPad * 2, innerH - rPad * 2, 'class="center-deco"   rx="2"')
    + t(cx, innerY + 170, 'VAULT RUN',                       'class="t-center-h1"  text-anchor="middle"')
    + l(cx - ruleW, innerY + 186, cx + ruleW, innerY + 186, 'class="center-rule"')
    + t(cx, innerY + 208, 'The Cash Logistics Board Game',   'class="t-center-sub" text-anchor="middle"');
}

// ─── SVG formatter ────────────────────────────────────────────────────────────
// Splits the SVG string into tokens (tags and text nodes) and re-indents them.

function formatSVG(svg) {
  const IND = '  ';
  let depth = 0;
  const out = [];

  for (const raw of svg.match(/<[^>]*>|[^<]+/g) ?? []) {
    const tok = raw.trim();
    if (!tok) continue;

    const isClose     = tok.startsWith('</');
    const isSelfClose = tok.endsWith('/>') || tok.startsWith('<?') || tok.startsWith('<!');
    const isOpen      = tok.startsWith('<') && !isClose && !isSelfClose;

    if (isClose) depth = Math.max(0, depth - 1);

    // Text nodes may span multiple lines (e.g. the CSS block inside <style>)
    for (const line of tok.split('\n')) {
      const ln = line.trim();
      if (ln) out.push(IND.repeat(depth) + ln);
    }

    if (isOpen) depth++;
  }

  return out.join('\n');
}

// ─── Measurement annotations ──────────────────────────────────────────────────
// Draws engineering-style dimension lines for the measured SVG variant.
//
// dimV(lineX, y1, y2, label) — vertical dimension line at lineX
// dimH(x1, x2, lineY, label) — horizontal dimension line at lineY
//
// Each annotation: two dashed extension lines + solid dimension line with
// arrowheads at both ends + label on a white background rect.

function renderMeasurements(layout) {
  const EXT  = 10;   // extension line overshoot past the dimension line
  const GAP  = 8;    // gap between element edge and extension line start
  const LBLH = 13;   // label background height
  const LBLW = 34;   // label background width (wide enough for 4-digit values)

  // Vertical dim: dimension line runs at x=lineX between y1 and y2.
  // Extension lines connect the measured element (at elemX) to lineX.
  function dimV(elemX, y1, y2, lineX, label) {
    const x1 = Math.min(elemX + GAP, lineX - GAP);
    const x2 = lineX + EXT;
    const my  = (y1 + y2) / 2;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y1}" class="dim-ext"/>`
      + `<line x1="${x1}" y1="${y2}" x2="${x2}" y2="${y2}" class="dim-ext"/>`
      + `<line x1="${lineX}" y1="${y1}" x2="${lineX}" y2="${y2}"`
      +   ` marker-start="url(#dim-arrow)" marker-end="url(#dim-arrow)" class="dim-line"/>`
      + `<rect x="${lineX - LBLW / 2}" y="${my - LBLH / 2}" width="${LBLW}" height="${LBLH}" class="dim-bg"/>`
      + `<text x="${lineX}" y="${my + 4}" text-anchor="middle" class="dim-label">${label}</text>`;
  }

  // Horizontal dim: dimension line runs at y=lineY between x1 and x2.
  // Extension lines connect the measured element (at elemY) to lineY.
  function dimH(x1, x2, elemY, lineY, label) {
    const y1 = Math.min(elemY + GAP, lineY - GAP);
    const y2 = lineY + EXT;
    const mx  = (x1 + x2) / 2;
    return `<line x1="${x1}" y1="${y1}" x2="${x1}" y2="${y2}" class="dim-ext"/>`
      + `<line x1="${x2}" y1="${y1}" x2="${x2}" y2="${y2}" class="dim-ext"/>`
      + `<line x1="${x1}" y1="${lineY}" x2="${x2}" y2="${lineY}"`
      +   ` marker-start="url(#dim-arrow)" marker-end="url(#dim-arrow)" class="dim-line"/>`
      + `<rect x="${mx - LBLW / 2}" y="${lineY - LBLH / 2}" width="${LBLW}" height="${LBLH}" class="dim-bg"/>`
      + `<text x="${mx}" y="${lineY + 4}" text-anchor="middle" class="dim-label">${label}</text>`;
  }

  // ── Reference field for height/width annotations: id=2 (bottom row, rot=0) ──
  const fRef = layout.find(f => f.id === 2);
  const { x: fx, y: fy, w: fw, h: fh } = fRef;

  // Derived geometry (must match renderRegularField with pad=10, tableH=40)
  const pad    = 10, tableH = 40;
  const stripY = fy + fh - STRIP_H;                           // top of color strip
  const divY   = fy + fh - STRIP_H - pad - tableH;            // title/table divider

  // Vertical dim lines stack to the right of the board
  const boardRight = BOARD_X + BOARD_SIZE;                    // 1140
  const vx1 = boardRight + 25;   // total height
  const vx2 = boardRight + 60;   // title area height
  const vx3 = boardRight + 95;   // strip height

  // ── Reference field for player diameter: id=3 (also bottom row) ───────────
  const fPly = layout.find(f => f.id === 3);
  const R    = PLAYER_R;
  const gap  = 6;
  const totalSlots = PLAYER_POSITIONS[fPly.id]?.length ?? 1;
  const totalW     = totalSlots * 2 * R + (totalSlots - 1) * gap;
  const localX0    = fPly.x + (fPly.w - totalW) / 2 + R;     // cx of slot 0
  const localY0    = fPly.y + fPly.h - STRIP_H / 2;
  const { x: pcx, y: pcy } = fieldToAbsolute(fPly, localX0, localY0);

  // Horizontal dims below board
  const boardBottom = BOARD_Y + BOARD_SIZE;                   // 1140
  const hLineY      = boardBottom + 35;                       // field width
  const hBoardLineY = boardBottom + 65;                       // total board width
  const plyLineY    = pcy + R + 25;                           // player diameter

  // Vertical dim for total board height
  const vx4 = boardRight + 130;                               // total board height

  return [
    // Total field height (180)
    dimV(fx + fw,   fy,          fy + fh,             vx1,       '180'),
    // Title area height (70)
    dimV(fx + fw,   fy,          divY,                 vx2,       '70'),
    // Strip height (60)
    dimV(fx + fw,   stripY,      fy + fh,              vx3,       '60'),
    // Total board height (1080)
    dimV(boardRight, BOARD_Y,    BOARD_Y + BOARD_SIZE, vx4,       '1080'),
    // Total field width (180)
    dimH(fx,        fx + fw,     fy,                   hLineY,    '180'),
    // Total board width (1080)
    dimH(BOARD_X,   BOARD_X + BOARD_SIZE, BOARD_Y,    hBoardLineY, '1080'),
    // Player icon diameter (35)
    dimH(pcx - R,   pcx + R,     pcy,                  plyLineY,  '\u2205 35'),
  ].join('');
}

// ─── Main assembly ────────────────────────────────────────────────────────────

function generateSVG(withMeasurements = false) {
  const layout = layoutFields(FIELDS);

  const arrowMarker = withMeasurements
    ? `<marker id="dim-arrow" markerWidth="6" markerHeight="6"`
      + ` refX="5" refY="3" orient="auto-start-reverse">`
      + `<path d="M0,0 L0,6 L6,3 z" fill="${PALETTE.measureColor}"/>`
      + `</marker>`
    : '';

  const defs = `<defs><style>${buildCSS()}</style>${arrowMarker}</defs>`;

  const fields = layout.map(f => {
    if (f.type === 'corner') return renderCornerField(f);
    if (f.type === 'chance') return renderChanceField(f);
    return renderRegularField(f);
  });

  const svgW = withMeasurements ? SVG_SIZE + 100 : SVG_SIZE;
  const svgH = withMeasurements ? SVG_SIZE + 20  : SVG_SIZE;

  const measurements = withMeasurements ? renderMeasurements(layout) : '';
  const body = [defs, renderBoardBackground(svgW, svgH), ...fields, renderCenterArea(), renderPlayers(layout), measurements].join('');

  const raw = '<?xml version="1.0" encoding="UTF-8"?>'
    + `<svg xmlns="http://www.w3.org/2000/svg"`
    +     ` viewBox="0 0 ${svgW} ${svgH}"`
    +     ` width="${svgW}" height="${svgH}">`
    + `<title>Vault Run \u2014 Board Game</title>`
    + body
    + '</svg>';

  return formatSVG(raw);
}

// ─── Entry point ──────────────────────────────────────────────────────────────

fs.writeFileSync('vault-run-board.svg',          generateSVG(false), 'utf8');
fs.writeFileSync('vault-run-board-measured.svg', generateSVG(true),  'utf8');
console.log('Board written to vault-run-board.svg');
console.log('Measured board written to vault-run-board-measured.svg');
