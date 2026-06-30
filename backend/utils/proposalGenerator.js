/**
 * proposalGenerator.js
 *
 * Thin orchestrator for proposal PDF generation.
 * Renders the page by dispatching through a declarative page layout descriptor.
 *
 * RULES (DO NOT BREAK):
 *  - proposal-template.png already contains: header, logo, watermark, footer,
 *    MSME logo, stamp area, and contact strip. Never redraw those.
 *  - All content stays inside the safe area defined in proposal/layout.js.
 *  - Do NOT hardcode colours, sizes, or strings here — use layout.js / content.js.
 *
 * To add a new proposal block: add one object to pageLayout + one case in
 * renderBlock(). No existing code needs to change.
 */

"use strict";

const fs   = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts } = require("pdf-lib");

const { LAYOUT, FONT, COLOR, SPACE } = require("./proposal/layout");
const content                        = require("./proposal/content");
const {
  drawHero,
  drawPreparedForCard,
  drawSection,
  drawPillar,
  drawHeading,
  drawCTA,
  drawVersionMeta,
  measureTextBlock,
} = require("./proposal/components");

// ─── Declarative page layout descriptor ───────────────────────────────────────
//
// The page is built by iterating this array. Each entry maps to one renderer.
// Adding a new section = one object here + one case in renderBlock().
//
const pageLayout = [
  { type: "hero"        },
  { type: "preparedFor" },
  { type: "twoColumn"   },
  { type: "versionMeta" },
  { type: "cta"         },
];

// ─── Main export (public API — unchanged) ──────────────────────────────────────
async function generateProposalPDF({ principalName, schoolName, schoolAddress }) {

  // Load the letterhead template (PNG)
  const templatePath = path.join(__dirname, "..", "assets", "proposal-template.png");
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Proposal template not found: ${templatePath}`);
  }

  const pdfDoc      = await PDFDocument.create();
  const templateImg = await pdfDoc.embedPng(fs.readFileSync(templatePath));
  const page        = pdfDoc.addPage([LAYOUT.page.width, LAYOUT.page.height]);

  // Draw the template as a full-page background.
  // The template handles header / footer / watermark / stamps.
  page.drawImage(templateImg, {
    x: 0, y: 0,
    width:  LAYOUT.page.width,
    height: LAYOUT.page.height,
  });

  const fontReg  = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Drawing context — passed to every component function
  const ctx = { page, fontReg, fontBold, LAYOUT, FONT, COLOR, SPACE };

  // Recipient data from caller
  const recipient = { principalName, schoolName, schoolAddress };

  // ── Content overflow guard ──────────────────────────────────────────────────
  const available = LAYOUT.contentTop - LAYOUT.contentBottom;
  const estimated = estimateContentHeight(ctx);
  if (estimated > available) {
    console.warn(
      `[proposalGenerator] Estimated content height (${estimated.toFixed(0)}pt) ` +
      `exceeds available (${available}pt). Content may be clipped at footer guard.`
    );
  }

  // ── Dispatch loop ───────────────────────────────────────────────────────────
  let curY = LAYOUT.contentTop-SPACE.md;
  for (const block of pageLayout) {
    curY = renderBlock(block, ctx, curY, recipient);
  }

  return await pdfDoc.save();
}

// ─── Block dispatcher ──────────────────────────────────────────────────────────
function renderBlock(block, ctx, curY, recipient) {
  switch (block.type) {
    case "hero":
      return drawHero(ctx, content.hero, curY);

    case "preparedFor":
      return drawPreparedForCard(ctx, recipient, curY + 18);

    case "twoColumn":
      return drawTwoColumns(ctx, curY);

    case "versionMeta":
      return drawVersionMeta(ctx, "v1.0", new Date(), curY - ctx.SPACE.xs);

    case "cta":
      drawCTA(ctx, content.cta);   // anchored — does not advance curY
      return curY;

    default:
      console.warn(`[proposalGenerator] Unknown block type: "${block.type}"`);
      return curY;
  }
}

// ─── Two-column layout (60 % left / 40 % right) ───────────────────────────────
function drawTwoColumns(ctx, startY) {
  const { LAYOUT, SPACE } = ctx;
  const leftX  = LAYOUT.margin.left;
  const rightX = LAYOUT.margin.left + LAYOUT.leftColumnWidth + LAYOUT.columnGap;
  const lW     = LAYOUT.leftColumnWidth;
  const rW     = LAYOUT.rightColumnWidth;

  let leftY  = startY;
  let rightY = startY;

  // ── Left Column ─────────────────────────────────────────────────────────────
  leftY = drawSection(ctx, {
    title: "About SSC",
    x: leftX, y: leftY, width: lW,
    items: content.about, itemStyle: "bullet",
  });
  leftY -= SPACE.md;

  leftY = drawSection(ctx, {
    title: "Why Future Skills Matter",
    x: leftX, y: leftY, width: lW,
    items: content.why, itemStyle: "check",
  });
  leftY -= SPACE.md;

  leftY = drawSection(ctx, {
    title: "Delivery Model",
    x: leftX, y: leftY, width: lW,
    items: content.delivery, itemStyle: "flow",
  });

  // ── Right Column ─────────────────────────────────────────────────────────────
  rightY = drawHeading(ctx, "Our Four Pillars", rightX, rightY, rW);
  content.pillars.forEach((pillar, i) => {
    rightY = drawPillar(ctx, {
      ...pillar,
      x: rightX, y: rightY, colW: rW,
      addDivider: i < content.pillars.length - 1,
    });
  });
  rightY -= SPACE.md;

  rightY = drawSection(ctx, {
    title: "Benefits For Your School",
    x: rightX, y: rightY, width: rW,
    items: content.benefits, itemStyle: "check",
  });

  // Return the lower of the two column bottoms as the next curY
  return Math.min(leftY, rightY) - SPACE.sm;
}

// ─── Content height estimator (overflow pre-flight) ───────────────────────────
function estimateContentHeight(ctx) {
  const { FONT, SPACE } = ctx;

  const heroH   = FONT.hero + FONT.small + FONT.title + SPACE.xs * 2 + SPACE.lg;
  const cardH   = (FONT.small + SPACE.xs) + (FONT.body + SPACE.sm) * 3 + SPACE.md * 2 + SPACE.md;
  const itemH   = FONT.body + 3;

  const aboutH  = FONT.heading + SPACE.sm + content.about.length    * (itemH + 1) + SPACE.sm;
  const whyH    = FONT.heading + SPACE.sm + content.why.length      * (itemH + 1) + SPACE.sm;
  const delivH  = FONT.heading + SPACE.sm
    + content.delivery.length * (FONT.body + SPACE.xs)
    + (content.delivery.length - 1) * (FONT.small + SPACE.xs);

  const colH    = aboutH + whyH + delivH;
  const ctaH    = FONT.title + FONT.body + FONT.small + SPACE.lg * 2 + SPACE.sm * 2;
  const metaH   = FONT.tiny + SPACE.xs + SPACE.sm;

  return heroH + cardH + colH + metaH + ctaH;
}

module.exports = generateProposalPDF;

