/**
 * proposal/components.js
 *
 * All reusable drawing functions for the proposal PDF.
 *
 * Every function receives a drawing context object (ctx) as its first argument:
 *   ctx = { page, fontReg, fontBold, LAYOUT, FONT, COLOR, SPACE }
 *
 * This keeps functions pure — they never close over any external state.
 *
 * Rules:
 *  - No hardcoded numbers — use ctx.LAYOUT, ctx.FONT, ctx.SPACE, ctx.COLOR
 *  - All Y values pass through safeY() before drawing
 *  - No special Unicode characters — WinAnsi-safe ASCII only
 *  - Functions that draw text blocks return the next available Y position
 *  - drawCTA() is anchored to contentBottom and does NOT return Y
 */

"use strict";

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Clamp Y to the content safe zone.
 * Logs a warning whenever content would breach the footer guard.
 *
 * @param {number} y
 * @param {object} LAYOUT
 * @returns {number} safe Y coordinate
 */
function safeY(y, LAYOUT) {
  if (y < LAYOUT.contentBottom) {
    console.warn(
      `[proposalGenerator] Overflow: Y=${y.toFixed(1)} breaches footer ` +
      `guard (${LAYOUT.contentBottom}pt). Clamping.`
    );
    return LAYOUT.contentBottom;
  }
  return y;
}

/**
 * Return the rendered width of a text string in points.
 * Single source of truth for all width measurements.
 */
function tw(text, font, size) {
  return font.widthOfTextAtSize(text, size);
}

/**
 * Split text into an array of lines that fit within maxW.
 * Uses font metrics — never splits by character count.
 *
 * @param {string} text
 * @param {number} maxW - available column width in pt
 * @param {object} font - pdf-lib embedded font
 * @param {number} size - font size in pt
 * @returns {string[]} array of line strings
 */
function wrapText(text, maxW, font, size) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (tw(candidate, font, size) > maxW && line !== "") {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Measure the rendered height of a wrapped text block in points.
 * Used by the content overflow guard in proposalGenerator.js.
 *
 * @param {string} text
 * @param {number} maxW
 * @param {object} font
 * @param {number} size
 * @param {number} [leading] - line height (defaults to size + 3)
 * @returns {number} total block height in pt
 */
function measureTextBlock(text, maxW, font, size, leading) {
  const ld    = leading || size + 3;
  const lines = wrapText(text, maxW, font, size);
  return lines.length * ld;
}

// =============================================================================
// PRIMITIVE DRAWING HELPERS
// =============================================================================

/**
 * Draw horizontally centred text on the page.
 *
 * @param {object} ctx
 * @param {string} text
 * @param {number} y
 * @param {number} size
 * @param {object} font
 * @param {object} color
 */
function drawCentered(ctx, text, y, size, font, color) {
  const { page, LAYOUT } = ctx;
  const x = (LAYOUT.page.width - tw(text, font, size)) / 2;
  page.drawText(text, { x, y: safeY(y, LAYOUT), size, font, color });
}

/**
 * Draw word-wrapped text. All lines are left-aligned at x.
 * Returns the next available Y (below the last line).
 *
 * @param {object} ctx
 * @param {string} text
 * @param {number} x
 * @param {number} startY
 * @param {number} maxW
 * @param {number} size
 * @param {object} font
 * @param {object} color
 * @param {number} [leading]
 * @returns {number} next Y
 */
function drawWrapped(ctx, text, x, startY, maxW, size, font, color, leading) {
  const { page, LAYOUT } = ctx;
  const ld    = leading || size + 3;
  const lines = wrapText(text, maxW, font, size);
  let y       = startY;
  for (const line of lines) {
    page.drawText(line, { x, y: safeY(y, LAYOUT), size, font, color });
    y -= ld;
  }
  return y;
}

/**
 * Draw a thin horizontal teal rule.
 *
 * @param {object} ctx
 * @param {number} x     - start X
 * @param {number} y     - Y coordinate of the line
 * @param {number} width - line length in pt
 */
function drawDivider(ctx, x, y, width) {
  const { page, COLOR } = ctx;
  page.drawLine({
    start:     { x,           y },
    end:       { x: x + width, y },
    thickness: 0.5,
    color:     COLOR.teal,
    opacity:   0.45,
  });
}

/**
 * Draw a section heading with a teal underline divider.
 * Returns the next Y below the heading.
 *
 * @param {object} ctx
 * @param {string} text
 * @param {number} x
 * @param {number} y
 * @param {number} colW
 * @returns {number} next Y
 */
function drawHeading(ctx, text, x, y, colW) {
  const { page, FONT, COLOR, SPACE, fontBold, LAYOUT } = ctx;
  const sy = safeY(y, LAYOUT);
  page.drawText(text, { x, y: sy, size: FONT.heading, font: fontBold, color: COLOR.navy });
  // drawDivider(ctx, x, sy - 2, colW);
  return sy - FONT.heading - SPACE.sm;
}

/**
 * Draw a bullet item  "-  text"  with a teal marker dash.
 * Returns next Y.
 *
 * @param {object} ctx
 * @param {string} text
 * @param {number} x
 * @param {number} y
 * @param {number} colW
 * @param {number} [size]
 * @param {object} [font]
 * @returns {number} next Y
 */
function drawBullet(ctx, text, x, y, colW, size, font) {
  const { page, COLOR, LAYOUT } = ctx;
  const sz   = size || ctx.FONT.body;
  const fn   = font || ctx.fontReg;
  const mark="• ";
  const mw   = tw(mark, fn, sz);
  page.drawText(mark, { x, y: safeY(y, LAYOUT), size: sz, font: fn, color: COLOR.gray });
  return drawWrapped(ctx, text, x + mw, y, colW - mw, sz, fn, COLOR.navy, sz + 3);
}

/**
 * Draw a check item  ">  text"  with a teal marker.
 * Returns next Y.
 *
 * @param {object} ctx
 * @param {string} text
 * @param {number} x
 * @param {number} y
 * @param {number} colW
 * @param {number} [size]
 * @param {object} [font]
 * @returns {number} next Y
 */
function drawCheck(ctx, text, x, y, colW, size, font) {
  const { page, COLOR, LAYOUT } = ctx;
  const sz   = size || ctx.FONT.body;
  const fn   = font || ctx.fontReg;
  const mark="• ";
  const mw   = tw(mark, fn, sz);
  page.drawText(mark, { x, y: safeY(y, LAYOUT), size: sz, font: fn, color: COLOR.teal });
  return drawWrapped(ctx, text, x + mw, y, colW - mw, sz, fn, COLOR.gray, sz + 3);
}

// =============================================================================
// BLOCK RENDERERS
// =============================================================================

/**
 * Draw the hero title block: main title, tagline, subtitle.
 * Returns next Y below the block.
 *
 * @param {object} ctx
 * @param {object} hero - { title, tagline, subtitle }
 * @param {number} startY
 * @returns {number} next Y
 */
function drawHero(ctx, hero, startY) {
  const { FONT, COLOR, SPACE, fontReg, fontBold } = ctx;
  let y = startY;

  drawCentered(ctx, hero.title, y, FONT.hero, fontBold, COLOR.navy);
  y -= FONT.hero + SPACE.md;

  // Tagline at FONT.body so it reads clearly between the title and subtitle
  drawCentered(ctx, hero.tagline, y, FONT.body, fontReg, COLOR.gray);
  y -= FONT.body + SPACE.sm;

  drawCentered(ctx, hero.subtitle, y, FONT.title, fontBold, COLOR.teal);
  // SPACE.sm keeps the card close — SPACE.lg was wasting 20pt of vertical space
  y -= FONT.title + SPACE.lg;

  return y;
}

/**
 * Draw the "Prepared For" recipient card.
 * Card height is computed dynamically from font metrics.
 * Returns next Y below the card.
 *
 * @param {object} ctx
 * @param {object} recipient - { principalName, schoolName, schoolAddress }
 * @param {number} startY
 * @returns {number} next Y
 */
// function drawPreparedForCard(ctx, recipient, startY) {
//   const { page, LAYOUT, FONT, COLOR, SPACE, fontReg, fontBold } = ctx;
//   const { principalName, schoolName, schoolAddress } = recipient;

//   const pad     = SPACE.sm;                    // top & bottom padding (12pt each)
//   const lineH   = FONT.body + 4;        // row height: 9.5 + 8 = 17.5pt
//   const labelH  = FONT.small + SPACE.xs;       // "PREPARED FOR" label: 8 + 4 = 12pt
//   const innerH  = labelH + lineH * 3;
//   const cardH   = innerH + pad * 2;
//   const cardX   = LAYOUT.margin.left;
//   const cardW   = LAYOUT.contentWidth;
//   const cardY   = startY - cardH;             // bottom-left of rectangle (pdf-lib)

//   // Card background and border
//   page.drawRectangle({
//     x: cardX, y: cardY,
//     width: cardW, height: cardH,
//     color: COLOR.lightGray,
//     borderColor: COLOR.cardBorder,
//     borderWidth: 1,
//   });

//   // "PREPARED FOR" label
//   let rowY = startY - pad - FONT.small;
//   page.drawText("PREPARED FOR", {
//     x: cardX + pad, y: rowY,
//     size: FONT.small, font: fontBold, color: COLOR.teal,
//   });
//   rowY -= labelH;

//   // Label → value rows.
//   // Labels are RIGHT-aligned within a fixed column so all colons sit at
//   // the same X coordinate, giving a clean left-edge for the values.
//   const labelColW  = 75;                           // fixed label column width
//   const valueStartX = cardX + pad;  // value baseline X
//   const rows = [
//     { label: "Principal:", value: principalName || "-", bold: true  },
//     { label: "School:",    value: schoolName    || "-", bold: true  },
//     { label: "Address:",   value: schoolAddress || "-", bold: false },
//   ];

//   for (const row of rows) {
//     // Right-align label text so colons all sit at the same column edge
//     const lw = fontReg.widthOfTextAtSize(row.label, FONT.body);
//     page.drawText(row.label, {
//       x: cardX + pad + labelColW - lw, y: rowY,
//       size: FONT.body, font: fontReg, color: COLOR.gray,
//     });
//     page.drawText(row.value, {
//       x: valueStartX, y: rowY,
//       size: FONT.body, font: row.bold ? fontBold : fontReg, color: COLOR.navy,
//     });
//     rowY = drawWrapped(
//     ctx,
//     row.value,
//     valueStartX,
//     rowY,
//     cardW - valueStartX - SPACE.md,
//     FONT.body,
//     row.bold ? fontBold : fontReg,
//     COLOR.navy
//     );
//   }

//   return cardY - SPACE.sm;
// }
function drawPreparedForCard(ctx, recipient, startY) {
  const { page, LAYOUT, FONT, COLOR, SPACE, fontReg, fontBold } = ctx;
  const { principalName, schoolName, schoolAddress } = recipient;

  // Card layout
  const pad = 12;
  const labelGap = 8;
  const rowGap = 8;

  const cardX = LAYOUT.margin.left;
  const cardW = LAYOUT.contentWidth;

  const labelX = cardX + pad;
  const labelWidth = 70;

  const valueX = labelX + labelWidth + labelGap;
  const valueWidth = cardW - (valueX - cardX) - pad;

  // Fixed card height
  const cardH = 92;
  const cardY = startY - cardH;

  // Background
  page.drawRectangle({
    x: cardX,
    y: cardY,
    width: cardW,
    height: cardH,
    color: COLOR.lightGray,
    borderColor: COLOR.cardBorder,
    borderWidth: 1,
  });

  // Header
  let y = startY - pad - FONT.small;

  page.drawText("PREPARED FOR", {
    x: labelX,
    y,
    size: FONT.small,
    font: fontBold,
    color: COLOR.teal,
  });

  // space below heading
  y -= FONT.small + 10;

  const rows = [
    {
      label: "Principal",
      value: principalName || "-"
    },
    {
      label: "School",
      value: schoolName || "-"
    },
    {
      label: "Address",
      value: schoolAddress || "-"
    }
  ];

  for (const row of rows) {

    // Label
    page.drawText(row.label, {
      x: labelX,
      y,
      size: FONT.body,
      font: fontBold,
      color: COLOR.navy,
    });

    // Value (wrapped automatically)
    const nextY = drawWrapped(
      ctx,
      row.value,
      valueX,
      y,
      valueWidth,
      FONT.body,
      fontReg,
      COLOR.gray
    );

    // Move to next row
    y = nextY - rowGap;
  }

  return cardY - SPACE.lg;
}

/**
 * Draw a generic section: heading + divider + list of items.
 *
 * @param {object} ctx
 * @param {object} opts
 * @param {string}   opts.title
 * @param {number}   opts.x
 * @param {number}   opts.y
 * @param {number}   opts.width
 * @param {string[]} opts.items
 * @param {string}   [opts.itemStyle]  "bullet" | "check" | "flow"
 * @returns {number} next Y
 */
function drawSection(ctx, { title, x, y, width, items, itemStyle = "bullet" }) {
  y = drawHeading(ctx, title, x, y, width);

  if (!items || items.length === 0) return y;

  if (itemStyle === "flow") {
    return drawFlowItems(ctx, items, x, y, width);
  }

  for (const item of items) {
    y = itemStyle === "check"
      ? drawCheck(ctx, item, x, y, width)
      : drawBullet(ctx, item, x, y, width);
    y -= 1;
  }
  return y;
}

/**
 * Draw delivery model items as a vertical flow with "|" connectors.
 * Returns next Y.
 *
 * @param {object}   ctx
 * @param {string[]} items
 * @param {number}   x
 * @param {number}   startY
 * @param {number}   colW
 * @returns {number} next Y
 */
function drawFlowItems(ctx, items, x, startY, colW) {
  const { page, FONT, COLOR, SPACE, fontBold, fontReg, LAYOUT } = ctx;
  const indent = 12;
  const itemH  = FONT.body + SPACE.xs;  // 9.5 + 4 = 13.5pt per item row
  const connH  = 6;                     // compact 6pt gap for "|" connector
  let y = startY;

      for (const item of items) {

        page.drawText(item, {
            x: x + indent,
            y: safeY(y, LAYOUT),
            size: FONT.body,
            font: fontBold,
            color: COLOR.navy,
        });

        y -= FONT.body + SPACE.sm;
    }
  return y;
}

/**
 * Draw a single pillar: bold title + indented sub-bullet points + optional divider.
 * Returns next Y.
 *
 * @param {object} ctx
 * @param {object} opts
 * @param {string}   opts.title
 * @param {string[]} opts.points
 * @param {number}   opts.x
 * @param {number}   opts.y
 * @param {number}   opts.colW
 * @param {boolean}  [opts.addDivider]
 * @returns {number} next Y
 */
function drawPillar(ctx, { title, points, x, y, colW, addDivider = false }) {
  const { page, FONT, COLOR, SPACE, fontReg, fontBold, LAYOUT } = ctx;
  const indent = SPACE.sm;

  // Pillar title line
  page.drawText(title, {
    x, y: safeY(y, LAYOUT),
    size: FONT.body, font: fontBold, color: COLOR.navy,
  });
  y -= FONT.body + SPACE.xs;

  // Sub-points
  for (const point of points) {
    y = drawBullet(ctx, point, x + indent, y, colW - indent, FONT.small, fontReg);
    y -= 1;
  }

  // Thin divider between pillars
  // if (addDivider) {
  //   y -= SPACE.xs;
  //   drawDivider(ctx, x, y, colW);
  //   y -= SPACE.sm;
  // } else {
  //   y -= SPACE.sm;
  // }
  y -= SPACE.md;

  return y;
}

/**
 * Draw the CTA box anchored just above the footer guard.
 * Always fixed to LAYOUT.contentBottom — does not accept or return a Y.
 *
 * @param {object} ctx
 * @param {object} cta - { title, subtitle, phone, email, web }
 */
function drawCTA(ctx, cta) {
  const { page, LAYOUT, FONT, COLOR, SPACE, fontReg, fontBold } = ctx;
  const pad     = SPACE.md;   // top & bottom inner padding (20pt each)
  const lineGap = SPACE.sm;   // gap between text lines (8pt)

  const innerH = FONT.title + lineGap + FONT.body + lineGap + FONT.small;
  const ctaH   = innerH + pad * 2;
  const ctaX   = LAYOUT.margin.left;
  const ctaW   = LAYOUT.contentWidth;
  const ctaY   = LAYOUT.contentBottom + SPACE.xs; // bottom of rectangle

  page.drawRectangle({
    x: ctaX, y: ctaY,
    width: ctaW, height: ctaH,
    color: COLOR.lightGray,
    borderColor: COLOR.teal,
    borderWidth: 1,
  });

  let y = ctaY + ctaH - pad - FONT.title;
  drawCentered(ctx, cta.title, y, FONT.title, fontBold, COLOR.navy);
  y -= FONT.title + lineGap;

  drawCentered(ctx, cta.subtitle, y, FONT.body, fontReg, COLOR.teal);
  y -= FONT.body + lineGap;

  const contact = `${cta.phone}  |  ${cta.email}  |  ${cta.web}`;
  drawCentered(ctx, contact, y, FONT.small, fontReg, COLOR.gray);
}

/**
 * Draw version metadata (right-aligned, above CTA).
 * Returns next Y.
 *
 * @param {object} ctx
 * @param {string} version  e.g. "v1.0"
 * @param {Date}   date
 * @param {number} y
 * @returns {number} next Y
 */
function drawVersionMeta(ctx, version, date, y) {
  const { page, LAYOUT, FONT, COLOR, SPACE, fontReg } = ctx;
  const months  = ["Jan","Feb","Mar","Apr","May","Jun",
                   "Jul","Aug","Sep","Oct","Nov","Dec"];
  const dateStr = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  const text    = `${version}  |  Generated ${dateStr}`;
  const textW   = fontReg.widthOfTextAtSize(text, FONT.tiny);
  const x       = LAYOUT.margin.left + LAYOUT.contentWidth - textW;
  page.drawText(text, {
    x, y: safeY(y, LAYOUT),
    size: FONT.tiny, font: fontReg, color: COLOR.gray,
  });
  return y - FONT.tiny - SPACE.xs;
}

// =============================================================================
// EXPORTS
// =============================================================================
module.exports = {
  // Utilities
  safeY,
  tw,
  measureTextBlock,
  // Primitives
  drawCentered,
  drawWrapped,
  // drawDivider,
  drawHeading,
  drawBullet,
  drawCheck,
  // Block renderers
  drawHero,
  drawPreparedForCard,
  drawSection,
  drawFlowItems,
  drawPillar,
  drawCTA,
  drawVersionMeta,
};
