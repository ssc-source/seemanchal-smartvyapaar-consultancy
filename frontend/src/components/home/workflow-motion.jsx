"use client";

import { motion } from "framer-motion";

import {
  ClipboardCheck,
  LayoutDashboard,
  Code2,
  Rocket,
  LineChart,
} from "lucide-react";

const workflow = [
  {
    icon: ClipboardCheck,
    title: "Business Analysis",
    desc: "Understanding workflows, operations, and business scalability.",
  },
  {
    icon: LayoutDashboard,
    title: "System Planning",
    desc: "Architecting ERP, automation, cloud infrastructure, and UI systems.",
  },
  {
    icon: Code2,
    title: "Development",
    desc: "Building scalable SaaS and AI-powered infrastructure.",
  },
  {
    icon: Rocket,
    title: "Deployment",
    desc: "Launching cloud-native production-ready systems.",
  },
  {
    icon: LineChart,
    title: "Growth",
    desc: "Continuous upgrades, optimization, and scaling.",
  },
];

export default function WorkflowMotion() {
  return (
    <section className="relative overflow-hidden w-full bg-slate-50/60 py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-20">
          <p className="text-blue-600 uppercase tracking-[0.25em] font-semibold mb-4">
            Our Agile Workflow
          </p>

          <h2 className="text-4xl md:text-5xl font-black text-slate-900">
            From Idea To Deployment
          </h2>

          <p className="max-w-3xl mx-auto mt-6 text-lg text-slate-500 leading-relaxed">
            Our streamlined engineering workflow ensures high-quality delivery,
            scalability, and long-term business growth.
          </p>
        </div>

        {/* WORKFLOW */}
        <div className="relative">
          {/* CENTER LINE */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-200 via-blue-300 to-indigo-300 -translate-y-1/2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
            {workflow.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 60,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -12,
                  }}
                  className="relative rounded-[36px] border border-slate-200 bg-white p-10 shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  {/* NUMBER */}
                  <div className="absolute -top-5 left-8 h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-xl">
                    0{index + 1}
                  </div>

                  <div className="pt-8">
                    <div className="h-20 w-20 rounded-3xl bg-blue-50 flex items-center justify-center mb-8">
                      <Icon className="h-10 w-10 text-blue-600" />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      {item.title}
                    </h3>

                    <p className="text-slate-500 leading-relaxed text-lg">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}