// "use client";

// import { motion } from "framer-motion";

// import {
//   Code2,
//   Database,
//   Cloud,
//   Cpu,
//   Layers3,
//   ShieldCheck,
//   Rocket,
//   Workflow,
// } from "lucide-react";

// const technologies = [
//   { icon: Code2, name: "Next.js" },
//   { icon: Database, name: "MongoDB" },
//   { icon: Cloud, name: "AWS" },
//   { icon: Cpu, name: "AI Systems" },
//   { icon: Workflow, name: "ERP Systems" },
//   { icon: Layers3, name: "Redis" },
//   { icon: ShieldCheck, name: "Security" },
//   { icon: Rocket, name: "Cloud Infra" },
// ];

// const repeated = [...technologies, ...technologies];

// export default function TechStackMotion() {
//   return (
//     <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-16 sm:py-20 lg:py-28">
      
//       {/* HEADER */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6">
//         <div className="text-center mb-10 sm:mb-14 lg:mb-16">
          
//           <p className="text-blue-600 uppercase tracking-[0.18em] sm:tracking-[0.25em] font-semibold text-[11px] sm:text-sm mb-3 sm:mb-4">
//             Technologies We Work With
//           </p>

//           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight px-2">
//             Engineering Modern
//             <br className="sm:hidden" />
//             Digital Systems
//           </h2>

//           <p className="max-w-3xl mx-auto mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-500 leading-relaxed px-2">
//             We architect scalable software platforms using modern cloud-native
//             technologies, ERP systems, AI infrastructure, and enterprise-grade
//             engineering workflows.
//           </p>
//         </div>
//       </div>

//       {/* LEFT FADE */}
//       <div className="absolute left-0 top-0 z-10 h-full w-10 sm:w-16 lg:w-24 bg-gradient-to-r from-white to-transparent pointer-events-none" />

//       {/* RIGHT FADE */}
//       <div className="absolute right-0 top-0 z-10 h-full w-10 sm:w-16 lg:w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />

//       {/* MARQUEE */}
//       <div className="overflow-hidden">
//         <motion.div
//           className="flex gap-4 sm:gap-6 lg:gap-8 w-max px-4 sm:px-6"
//           animate={{
//             x: [0, -1800],
//           }}
//           transition={{
//             repeat: Infinity,
//             repeatType: "loop",
//             duration: 32,
//             ease: "linear",
//           }}
//         >
//           {repeated.map((tech, index) => {
//             const Icon = tech.icon;

//             return (
//               <div
//                 key={index}
//                 className="
//                   w-[160px]
//                   sm:w-[200px]
//                   lg:w-[240px]
//                   flex-shrink-0
//                   rounded-[24px]
//                   lg:rounded-[32px]
//                   border border-slate-200
//                   bg-white
//                   p-5 sm:p-7 lg:p-10
//                   shadow-sm
//                   hover:shadow-2xl
//                   transition-all duration-500
//                 "
//               >
//                 <div className="flex flex-col items-center text-center">
                  
//                   <div className="
//                     h-14 w-14
//                     sm:h-16 sm:w-16
//                     lg:h-20 lg:w-20
//                     rounded-2xl lg:rounded-3xl
//                     bg-blue-50
//                     flex items-center justify-center
//                     mb-4 sm:mb-5 lg:mb-6
//                   ">
//                     <Icon className="
//                       h-7 w-7
//                       sm:h-8 sm:w-8
//                       lg:h-10 lg:w-10
//                       text-blue-600
//                     " />
//                   </div>

//                   <h3 className="
//                     text-lg
//                     sm:text-xl
//                     lg:text-2xl
//                     font-bold
//                     text-slate-900
//                   ">
//                     {tech.name}
//                   </h3>
//                 </div>
//               </div>
//             );
//           })}
//         </motion.div>
//       </div>
//     </section>
//   );
// }

"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Cloud,
  Cpu,
  Layers3,
  ShieldCheck,
  Rocket,
  Workflow,
} from "lucide-react";

const technologies = [
  { icon: Code2, name: "Next.js" },
  { icon: Database, name: "MongoDB" },
  { icon: Cloud, name: "AWS" },
  { icon: Cpu, name: "AI Systems" },
  { icon: Workflow, name: "ERP Systems" },
  { icon: Layers3, name: "React" },
  { icon: ShieldCheck, name: "Security" },
  { icon: Rocket, name: "Node.js" },
  { icon: Rocket, name: "Express.js" },
  { icon: Rocket, name: "Tailwind CSS" },
  { icon: Rocket, name: "Sequalize" },
];

const repeated = [...technologies, ...technologies];

export default function TechStackMotion() {
  return (
    <section className="relative overflow-hidden bg-[#f8fbff] py-16 sm:py-20 lg:py-28">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-120px] left-[-120px] h-[260px] w-[260px] rounded-full bg-blue-100 blur-3xl opacity-60" />
        <div className="absolute bottom-[-120px] right-[-120px] h-[260px] w-[260px] rounded-full bg-cyan-100 blur-3xl opacity-60" />
      </div>

      {/* HEADER */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-14 lg:mb-16">
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className= "inline-flex items-center rounded-full border border-blue-200 bg-white/80 backdrop-blur-md px-4 py-2 text-[11px] sm:text-sm font-semibold tracking-[0.2em] uppercase text-blue-700 shadow-sm"
          >
            Technologies We Work With
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-5 text-3xl sm:text-4xl lg:text-6xl font-black leading-[1.1] tracking-tight text-slate-900"
          >
            Engineering
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Modern Digital Systems
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
           className="max-w-3xl mx-auto mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 px-2"
          >
            We architect scalable software platforms using modern cloud-native
            technologies, ERP systems, AI infrastructure, and enterprise-grade
            engineering workflows.
          </motion.p>
        </div>
      </div>

      {/* EDGE FADE */}
      <div className="absolute left-0 top-0 z-10 h-full w-16 sm:w-24 bg-gradient-to-r from-[#f8fbff] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 z-10 h-full w-16 sm:w-24 bg-gradient-to-l from-[#f8fbff] to-transparent pointer-events-none" />

     {/* MOBILE GRID */}
<div className="relative z-20 block md:hidden px-3">
  <div className="grid grid-cols-3 gap-3">
    {technologies.map((tech, index) => {
      const Icon = tech.icon;

      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          viewport={{ once: true }}
          whileTap={{ scale: 0.95 }}
          className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl p-3 shadow-[0_6px_24px_rgba(0,0,0,0.05)]"
        >
          {/* CARD GLOW */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative z-10 flex flex-col items-center text-center">
            
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-md shadow-blue-100"
            >
              <Icon className="h-5 w-5 text-white" />
            </div>

            <h3
              className="mt-3 text-[11px] font-semibold leading-tight text-slate-900"
            >
              {tech.name}
            </h3>
          </div>
        </motion.div>
      );
    })}
  </div>
</div>

      {/* DESKTOP MARQUEE */}
      <div className="relative z-20 hidden md:block overflow-hidden mt-4">
        <motion.div
          className="flex gap-6 lg:gap-8 w-max px-6"
          animate={{ x: [0, -1800] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 28,
            ease: "linear",
          }}
        >
          {repeated.map((tech, index) => {
            const Icon = tech.icon;

            return (
              <motion.div
                whileHover={{
                  y: -10,
                  scale: 1.03,
                }}
                key={index}
                className="group relative w-[220px] lg:w-[260px] flex-shrink-0 overflow-hidden rounded-[32px] border border-white/50 bg-white/80 backdrop-blur-xl p-8 lg:p-10 shadow-[0_10px_50px_rgba(0,0,0,0.08)] transition-all duration-500"
              >
                {/* HOVER GRADIENT */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-xl shadow-blue-200 transition-transform duration-500 group-hover:scale-110"
                  >
                    <Icon className="h-10 w-10 text-white" />
                  </div>

                  <h3
                    className="mt-6 text-2xl font-bold tracking-tight text-slate-900"
                  >
                    {tech.name}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}