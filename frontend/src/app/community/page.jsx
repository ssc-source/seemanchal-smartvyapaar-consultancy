"use client";
import CommunityApplication from "@/components/community/communityapplication";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Users2,
  Rocket,
  Globe2,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  Sparkles,
  Code2,
  BrainCircuit,
  Building2,
  CalendarDays,
  Send,
  MessageSquare,
  Lightbulb,
  Network,
  ChevronRight,
} from "lucide-react";



/* -------------------------------------------------------------------------- */
/*                              COMMUNITY DATA                                */
/* -------------------------------------------------------------------------- */

const communities = [
  {
    title: "Developers Community",
    icon: <Code2 className="h-7 w-7" />,
    description:
      "Collaborate on full-stack projects, SaaS systems, ERP platforms, AI tools, and production-grade applications.",
    tags: ["React", "Next.js", "Node.js", "AI"],
  },
  {
    title: "Startup Ecosystem",
    icon: <Rocket className="h-7 w-7" />,
    description:
      "Connect with founders, builders, and entrepreneurs working on scalable startup ideas and digital infrastructure.",
    tags: ["Startups", "SaaS", "Growth", "Innovation"],
  },
  {
    title: "Student Network",
    icon: <GraduationCap className="h-7 w-7" />,
    description:
      "Learn modern development, participate in internships, hackathons, workshops, and real-world projects.",
    tags: ["Learning", "Internships", "Hackathons"],
  },
  {
    title: "Business Community",
    icon: <Building2 className="h-7 w-7" />,
    description:
      "Help businesses adopt digital systems, ERP solutions, automation workflows, and scalable technology.",
    tags: ["ERP", "Automation", "Digital Growth"],
  },
];

/* -------------------------------------------------------------------------- */
/*                               EVENTS DATA                                  */
/* -------------------------------------------------------------------------- */

const events = [
  {
    title: "Full Stack Development Bootcamp",
    date: "June 2026",
    type: "Workshop",
  },
  {
    title: "Regional Startup Networking Meetup",
    date: "July 2026",
    type: "Community Event",
  },
  {
    title: "AI & Automation Session",
    date: "July 2026",
    type: "Tech Talk",
  },
];

/* -------------------------------------------------------------------------- */
/*                                MAIN PAGE                                   */
/* -------------------------------------------------------------------------- */

export default function CommunityPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
              <Users2 className="h-4 w-4" />
              SSC Community
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-slate-900">
              Building A
              <span className="block text-brand-accent">
                Digital Community
              </span>
              For Bharat
            </h1>

            <p className="mt-8 max-w-3xl text-xl leading-relaxed text-slate-500">
              SSC Community connects developers, founders, startups,
              students, creators, and innovators who are passionate
              about building scalable digital ecosystems and modern
              technology infrastructure.
            </p>

            <div className="mt-12 flex flex-wrap gap-5">

              <a
                href="#join-community"
                className="inline-flex items-center gap-2 rounded-2xl bg-brand-accent px-8 py-4 text-white font-semibold shadow-lg hover:scale-[1.02] transition-all"
              >
                Join Community
                <ArrowRight className="h-5 w-5" />
              </a>

              <a
                href="#events"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-8 py-4 font-semibold text-slate-700 hover:border-brand-accent hover:text-brand-accent transition-all"
              >
                Explore Events
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* COMMUNITY VALUES */}
      {/* ------------------------------------------------------------------ */}

      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            What We’re Building
          </h2>

          <p className="text-xl text-slate-500 leading-relaxed">
            A collaborative ecosystem where technology, innovation,
            startups, and learning grow together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

          {[
            {
              title: "Innovation",
              icon: <Lightbulb className="h-7 w-7" />,
              desc: "Encouraging modern ideas and scalable solutions.",
            },
            {
              title: "Collaboration",
              icon: <HeartHandshake className="h-7 w-7" />,
              desc: "Connecting builders, learners, and founders.",
            },
            {
              title: "Technology",
              icon: <BrainCircuit className="h-7 w-7" />,
              desc: "Building systems powered by modern technologies.",
            },
            {
              title: "Growth",
              icon: <Rocket className="h-7 w-7" />,
              desc: "Helping individuals and businesses scale digitally.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-white p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
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
      {/* COMMUNITY GROUPS */}
      {/* ------------------------------------------------------------------ */}

      <section className="bg-slate-50/70 border-y border-slate-200/70 py-24 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="mb-16">

            <h2 className="text-5xl font-bold text-slate-900 mb-5">
              Community Networks
            </h2>

            <p className="text-xl text-slate-500 max-w-3xl">
              Explore specialized communities designed for builders,
              innovators, creators, and future leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {communities.map((community, index) => (
              <div
                key={index}
                className="rounded-3xl border border-slate-200 bg-white p-8 hover:shadow-2xl transition-all duration-300"
              >

                <div className="flex items-start justify-between gap-6 mb-6">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                    {community.icon}
                  </div>

                  <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                    Active
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-slate-900 mb-5">
                  {community.title}
                </h3>

                <p className="text-slate-500 text-lg leading-relaxed mb-8">
                  {community.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  {community.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="inline-flex items-center gap-2 font-semibold text-brand-accent">
                  Explore Community
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* EVENTS */}
      {/* ------------------------------------------------------------------ */}

      <section
        id="events"
        className="max-w-7xl mx-auto px-6 py-24"
      >

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">

          <div>
            <h2 className="text-5xl font-bold text-slate-900 mb-5">
              Upcoming Events
            </h2>

            <p className="text-xl text-slate-500 max-w-3xl">
              Participate in workshops, networking sessions,
              hackathons, startup discussions, and technology events.
            </p>
          </div>

          <div className="rounded-2xl bg-brand-accent text-white px-8 py-6 shadow-lg">
            <p className="text-sm text-blue-100 mb-1">
              Upcoming Activities
            </p>

            <h3 className="text-3xl font-bold">
              {events.length}+ Events
            </h3>
          </div>
        </div>

        <div className="space-y-8">

          {events.map((event, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-white p-8 hover:shadow-xl transition-all"
            >

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                <div className="flex items-start gap-6">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                    <CalendarDays className="h-8 w-8" />
                  </div>

                  <div>

                    <div className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 mb-4">
                      {event.type}
                    </div>

                    <h3 className="text-3xl font-bold text-slate-900 mb-3">
                      {event.title}
                    </h3>

                    <p className="text-lg text-slate-500">
                      Scheduled for {event.date}
                    </p>
                  </div>
                </div>

                <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-white font-semibold hover:bg-brand-accent transition-all">
                  Register Interest
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* JOIN FORM */}
      {/* ------------------------------------------------------------------ */}

      <section id="join-community" className="py-24 px-6">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">

            <h2 className="text-5xl font-bold text-slate-900 mb-6">
              Become Part Of SSC
            </h2>

            <p className="text-xl text-slate-500 max-w-3xl mx-auto">
              Collaborate, network, learn, and build with ambitious people.
            </p>

          </div>

          <CommunityApplication />

        </div>

      </section>
      {/* ------------------------------------------------------------------ */}
      {/* FINAL CTA */}
      {/* ------------------------------------------------------------------ */}

      <section className="max-w-6xl mx-auto px-6 pt-24">

        <div className="overflow-hidden rounded-[36px] bg-linear-to-r from-brand-accent to-blue-700 p-14 md:p-20 text-white shadow-2xl relative">

          <div className="absolute right-0 top-0 h-full w-96 bg-white/5 blur-3xl" />

          <div className="relative z-10 max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold mb-6">
              <Network className="h-4 w-4" />
              Build Together
            </div>

            <h2 className="text-5xl font-bold leading-tight mb-6">
              Let’s Create A Strong Digital Ecosystem
            </h2>

            <p className="text-xl text-blue-100 leading-relaxed mb-10">
              Connect, collaborate, innovate, and grow with a
              technology-driven regional community focused on impact.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-5 font-semibold text-brand-accent hover:scale-[1.02] transition-all"
            >
              Connect With SSC
              <MessageSquare className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}