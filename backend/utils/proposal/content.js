/**
 * proposal/content.js
 *
 * All static proposal text lives here. The rendering code never contains
 * hardcoded strings — it reads from this object.
 *
 * Company contact details are loaded from process.env so that a single
 * environment variable update applies to all generated documents.
 * Fallback values are provided for local development.
 *
 * Future: replace the static arrays below with a DB / CMS query and the
 * rendering layer (proposalGenerator.js) will not need any changes.
 */

"use strict";

// ─── Company Details (env-driven) ─────────────────────────────────────────────
const company = {
  name:    process.env.COMPANY_NAME    || "Seemanchal SmartVyapaar Consultancy",
  phone:   process.env.COMPANY_PHONE   || "6453356884",
  email:   process.env.COMPANY_EMAIL   || "info@seemanchalsmartvyapaar.com",
  web:     process.env.COMPANY_WEB     || "www.seemanchalsmartvyapaar.com",
  address: process.env.COMPANY_ADDRESS || "Araria, Bihar - 854311",
  msme:    process.env.COMPANY_MSME    || "UDYAM-BR-01-0049142",
};

// ─── Proposal Content ─────────────────────────────────────────────────────────
const proposalContent = {

  // Hero title block
  hero: {
    title: "SSC FUTURE SKILLS LAB",
    tagline: "Building Future-Ready Schools Through AI, Innovation & Career Readiness",
    subtitle: "School Partnership Proposal",
  },

  // Left Column — About SSC
  about: [
    "MSME Registered Education & Technology Company",
    "Industry-led Future Skills Programs for Schools",
    "Hands-on Workshops with Real-World Learning",
    "Committed to Preparing Students for Tomorrow's Careers",
  ],

  // Left Column — Why Future Skills
  why: [
    "Introduce students to Artificial Intelligence responsibly and practically.",
    "Develop creativity, problem-solving and innovation mindset.",
    "Promote safe, ethical and responsible digital citizenship.",
    "Bridge the gap between classroom learning and industry expectations.",
    "Prepare students for emerging careers and future opportunities.",
  ],

  // Left Column — Delivery Model
  delivery: [
    "Interactive Orientation Session",
    "Activity-Based Workshops",
    "Hands-on Projects & Challenges",
    "Assessment, Feedback & Certification",
  ],

  // Right Column — Four Pillars
  pillars: [
    {
      title: "AI Literacy",
      points: [
        "Understanding AI & Generative AI",
        "Responsible Use of AI Tools",
      ],
    },
    {
      title: "Digital Citizenship",
      points: [
        "Cyber Safety & Online Ethics",
        "Digital Responsibility & Privacy",
      ],
    },
    {
      title: "Innovation & Entrepreneurship",
      points: [
        "Design Thinking & Creativity",
        "Problem Solving & Entrepreneurial Mindset",
      ],
    },
    {
      title: "Career Discovery",
      points: [
        "Future Careers & Industry Exposure",
        "Career Awareness & Goal Setting",
      ],
    },
  ],

  // Right Column — Benefits
  benefits: [
    "NEP 2020 Aligned Future Skills Program",
    "Industry Exposure for School Students",
    "Engaging Workshops Beyond Traditional Classrooms",
    // "Enhanced School Brand & Student Readiness",
  ],

  // CTA
  cta: {
    title: "Let's Build a Future-Ready School Together",
    subtitle:
      "Book a Complimentary Future Skills Orientation Session for Your Students & Educators.",
    phone: company.phone,
    email: company.email,
    web: company.web,
  },

  company,
};

module.exports = proposalContent;
