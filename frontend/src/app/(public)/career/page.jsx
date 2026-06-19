"use client";
import InternshipApplication from "@/components/career/internshipapplication";

import { useEffect, useState } from "react";
import Link from "next/link";
import { contentAdapter } from "@/lib/contentAdapter";
import {
  ArrowRight,
  Briefcase,
  Clock3,
  Code2,
  GraduationCap,
  Laptop2,
  MapPin,
  Rocket,
  Sparkles,
  Users2,
  Building2,
  BrainCircuit,
  Layers3,
  ChevronRight,
  Palette,
} from "lucide-react";



/* -------------------------------------------------------------------------- */
/*                                OPENINGS                                    */
/* -------------------------------------------------------------------------- */

const baseOpenings = [
  {
    title: "Frontend Developer Intern",
    department: "Engineering",
    type: "Internship",
    location: "Remote / Hybrid",
    experience: "Student / Fresher",
    icon: <Code2 className="h-6 w-6" />,
    description:
      "Learn and build modern, responsive, and production-ready web interfaces using industry-standard frontend technologies under professional mentorship and real-world project training.",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React.js",
      "Next.js",
      "TailwindCSS",
      "Responsive Design",
    ],
  },

  {
    title: "Backend Developer Intern",
    department: "Backend Engineering",
    type: "Internship",
    location: "Remote",
    experience: "Student / Fresher",
    icon: <Layers3 className="h-6 w-6" />,
    description:
      "Work on APIs, authentication systems, databases, and scalable backend architectures while gaining practical exposure to professional software development workflows.",
    skills: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "MySQL",
      "REST API",
      "Authentication",
      "Cloud Basics",
    ],
  },

  {
    title: "Full Stack Developer Intern",
    department: "Full Stack Engineering",
    type: "Internship",
    location: "Remote / Hybrid",
    experience: "Student / Fresher",
    icon: <Laptop2 className="h-6 w-6" />,
    description:
      "Gain hands-on experience in both frontend and backend development by building complete full stack applications, dashboards, and real-world industry projects.",
    skills: [
      "React.js",
      "Next.js",
      "Node.js",
      "MongoDB",
      "Express.js",
      "REST APIs",
      "Git & GitHub",
    ],
  },

  {
    title: "UI/UX Design Intern",
    department: "Design",
    type: "Internship",
    location: "Remote",
    experience: "Student / Fresher",
    icon: <Palette className="h-6 w-6" />,
    description:
      "Learn professional UI/UX design principles, wireframing, prototyping, and modern design systems while contributing to real client and product interfaces.",
    skills: [
      "Figma",
      "Wireframing",
      "Prototyping",
      "Design Systems",
      "User Research",
      "Responsive UI",
      "Creative Thinking",
    ],
  },
];

const openingIconMap = {
  'Frontend Developer Intern': <Code2 className="h-6 w-6" />,
  'Backend Developer Intern': <Layers3 className="h-6 w-6" />,
  'Full Stack Developer Intern': <Laptop2 className="h-6 w-6" />,
  'UI/UX Design Intern': <Palette className="h-6 w-6" />,
};

/* -------------------------------------------------------------------------- */
/*                                 MAIN PAGE                                  */
/* -------------------------------------------------------------------------- */

export default function CareersPage() {
  const [openings, setOpenings] = useState(baseOpenings);

  useEffect(() => {
    const loadOpenings = async () => {
      try {
        const liveOpenings = await contentAdapter.resolveCareerOpenings(baseOpenings);
        const merged = liveOpenings.map((job) => ({
          ...job,
          icon: openingIconMap[job.title] || openingIconMap[job.department] || <Code2 className="h-6 w-6" />,
        }));
        setOpenings(merged);
      } catch (error) {
        console.error('[Career Page] Failed to load CMS openings:', error);
      }
    };

    loadOpenings();
  }, []);

  return (
    <main className="min-h-screen bg-white pb-24">

      {/* ------------------------------------------------------------------ */}
      {/* HERO */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative overflow-hidden border-b border-slate-200/70 bg-linear-to-b from-slate-50 via-white to-white">

        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-brand-accent blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-28">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-brand-accent/20 bg-brand-accent/10 px-5 py-2 text-sm font-semibold text-brand-accent mb-8">
              <Rocket className="h-4 w-4" />
              Careers at SSC
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-slate-900">
              Build The Future
              <span className="block text-brand-accent">
                Of Digital Bharat
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-xl leading-relaxed text-slate-500">
              We are building scalable SaaS systems, AI infrastructure,
              ERP platforms, automation ecosystems, and digital products
              designed for businesses, startups, schools, and institutions
              across India.
            </p>

            <div className="mt-12 flex flex-wrap gap-5">

              <a
                href="#openings"
                className="inline-flex items-center gap-2 rounded-2xl bg-brand-accent px-8 py-4 text-white font-semibold shadow-lg hover:scale-[1.02] transition-all"
              >
                Explore Openings
                <ArrowRight className="h-5 w-5" />
              </a>

              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-8 py-4 font-semibold text-slate-700 hover:border-brand-accent hover:text-brand-accent transition-all"
              >
                Apply Now
              </Link>

              <Link
                href="/career/assessment"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-8 py-4 font-semibold bg-green-500 text-white hover:bg-green-600 hover:text-white transition-all"
              >
                Final Assessment & Certificate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* WHY JOIN SSC */}
      {/* ------------------------------------------------------------------ */}

      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Why Join SSC?
          </h2>

          <p className="text-xl text-slate-500 leading-relaxed">
            Work on meaningful systems, solve real operational problems,
            and gain experience building production-grade platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

          {[
            {
              title: "Real Production Work",
              icon: <Laptop2 className="h-7 w-7" />,
              desc: "Build real SaaS products and enterprise systems.",
            },
            {
              title: "Startup Ecosystem",
              icon: <Rocket className="h-7 w-7" />,
              desc: "Work closely with founders and growing teams.",
            },
            {
              title: "Modern Tech Stack",
              icon: <Code2 className="h-7 w-7" />,
              desc: "Next.js, Node.js, AI systems, cloud workflows.",
            },
            {
              title: "Growth Driven Culture",
              icon: <Users2 className="h-7 w-7" />,
              desc: "Fast learning environment with practical exposure.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="group rounded-3xl border border-slate-200 bg-white p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >

              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                {item.icon}
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {item.title}
              </h3>

              <p className="text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* OPEN POSITIONS */}
      {/* ------------------------------------------------------------------ */}

      <section
        id="openings"
        className="bg-slate-50/70 border-y border-slate-200/70 py-24 px-6"
      >

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">

            <div>
              <h2 className="text-5xl font-bold text-slate-900 mb-5">
                Open Positions
              </h2>

              <p className="text-xl text-slate-500 max-w-3xl">
                Explore opportunities to contribute to scalable
                digital infrastructure and next-generation platforms.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 px-6 py-5 shadow-sm">
              <p className="text-sm text-slate-500 mb-1">
                Currently Hiring
              </p>

              <h3 className="text-3xl font-bold text-brand-accent">
                {openings.length}+ Roles
              </h3>
            </div>
          </div>

          <div className="space-y-8">

            {openings.map((job, index) => (
              <div
                key={index}
                className="group rounded-3xl border border-slate-200 bg-white p-8 hover:shadow-2xl transition-all duration-300"
              >

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

                  {/* LEFT */}
                  <div className="flex gap-6">

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                      {job.icon}
                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-3 mb-4">

                        <span className="rounded-full bg-brand-accent/10 px-4 py-2 text-xs font-semibold text-brand-accent">
                          {job.department}
                        </span>

                        <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">
                          {job.type}
                        </span>
                      </div>

                      <h3 className="text-3xl font-bold text-slate-900 mb-4">
                        {job.title}
                      </h3>

                      <p className="text-slate-500 text-lg leading-relaxed mb-6 max-w-3xl">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-6 text-sm text-slate-500">

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>

                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          {job.experience}
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4" />
                          Flexible Duration
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="xl:w-[320px]">

                    <div className="mb-6 flex flex-wrap gap-3">

                      {job.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <Link
                      href="/auth/login"
                      className="group/button inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 font-semibold text-white hover:bg-brand-accent transition-all"
                    >
                      Apply Position
                      <ChevronRight className="h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* INTERNSHIP PROGRAM */}
      {/* ------------------------------------------------------------------ */}

      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>

            <div className="inline-flex items-center gap-2 rounded-full bg-brand-accent/10 px-5 py-2 text-sm font-semibold text-brand-accent mb-6">
              <GraduationCap className="h-4 w-4" />
              Internship Program
            </div>

            <h2 className="text-5xl font-bold text-slate-900 leading-tight mb-8">
              Learn Modern Development Through Real Projects
            </h2>

            <p className="text-xl text-slate-500 leading-relaxed mb-10">
              SSC internships are designed for ambitious students,
              developers, designers, and startup enthusiasts who want
              practical industry exposure beyond traditional training.
            </p>

            <div className="space-y-5">

              {[
                "Work on real SaaS & ERP systems",
                "Learn production deployment workflows",
                "Build scalable frontend & backend architecture",
                "Collaborate with founders & engineers",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
                    <Sparkles className="h-4 w-4" />
                  </div>

                  <p className="text-lg text-slate-700 font-medium">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-4xl border border-slate-200 bg-linear-to-br from-slate-900 to-slate-800 p-10 text-white shadow-2xl">

            <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10">
              <Building2 className="h-10 w-10" />
            </div>

            <h3 className="text-4xl font-bold mb-6">
              Domains We Work In
            </h3>

            <div className="grid grid-cols-2 gap-4">

              {[
                "SaaS Platforms",
                "ERP Systems",
                "AI Automation",
                "Cloud Systems",
                "UI/UX Design",
                "DevOps",
                "Business Systems",
                "Full Stack Apps",
              ].map((domain, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium backdrop-blur-sm"
                >
                  {domain}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>






      {/* CTA */}

      <section className="max-w-6xl mx-auto px-6 pt-24">

        <div className="overflow-hidden rounded-[36px] bg-linear-to-r from-brand-accent to-blue-700 p-14 md:p-20 text-white shadow-2xl relative">

          <div className="absolute right-0 top-0 h-full w-96 bg-white/5 blur-3xl" />

          <div className="relative z-10 max-w-3xl">

            <h2 className="text-5xl font-bold leading-tight mb-6">
              Ready To Build Something Meaningful?
            </h2>

            <p className="text-xl text-blue-100 leading-relaxed mb-10">
              Become part of a fast-growing regional technology ecosystem
              building digital infrastructure for the future.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-5 font-semibold text-brand-accent hover:scale-[1.02] transition-all"
            >
              Contact SSC
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}