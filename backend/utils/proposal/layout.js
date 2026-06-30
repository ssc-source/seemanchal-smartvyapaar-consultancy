/**
 * proposal/layout.js
 *
 * Single source of truth for all layout, typography, spacing, and color
 * constants used by the proposal PDF generator.
 *
 * To change any visual property of the proposal, edit ONLY this file.
 * No hardcoded numbers should appear anywhere else in the generator.
 */

"use strict";

const { rgb } = require("pdf-lib");

// ─── Page & Safe Content Area ─────────────────────────────────────────────────
//
// PDF page is A4 at 72 dpi (pdf-lib uses points, origin = bottom-left, Y↑).
// The template PNG already contains: header, footer, watermark, stamps, MSME logo.
// Content MUST stay inside the safe area below.
//
const LAYOUT = {
  page: {
    width:  595,
    height: 842,
  },
  margin: {
    left:  45,
    right: 45,
  },
  headerHeight:     125,  // pt — do not draw above contentTop
  footerHeight:     105,  // pt — do not draw below contentBottom
  contentTop:       720,  // Y where body content begins (just below teal separator)
  contentBottom:    140,  // Y footer guard — nothing may be drawn below this
  contentWidth:     515,  // page.width - margin.left - margin.right
  leftColumnWidth:  305,  // 60 % of contentWidth
  rightColumnWidth: 190,  // 40 % of contentWidth
  columnGap:         32,  // gap between the two columns
};

// ─── Spacing Scale ────────────────────────────────────────────────────────────
//
// Use SPACE constants instead of raw numbers everywhere.
//
const SPACE = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  20,
  xl:  30,
};

// ─── Typography ───────────────────────────────────────────────────────────────
const FONT = {
  hero:    22,   // proposal title
  title:   15,   // hero subtitle / CTA heading
  heading: 12,   // section headings
  body:     10, // body text / bullet items
  small:    8.5,   // sub-bullets / labels / small text
  tiny:     7,   // version metadata
};

// ─── Color Palette ────────────────────────────────────────────────────────────
//
// All rgb() calls are confined to this file.
// Use COLOR.xxx everywhere else.
//
const COLOR = {
  navy:      rgb(0.08, 0.19, 0.36),  // primary dark navy
  teal:      rgb(0.02, 0.55, 0.63),  // teal accent (matches template header)
  gray:      rgb(0.35, 0.35, 0.35),  // body text / muted labels
  lightGray:rgb(0.98,0.98,0.99),  // card / CTA background fill
  cardBorder: rgb(0.75, 0.87, 0.93), // card border
};

module.exports = { LAYOUT, SPACE, FONT, COLOR };
