// import { contentAdapter } from "@/lib/contentAdapter";
// import { CTA } from "@/components/ui/cta";
// import Image from "next/image";
// import { Target, ShieldCheck } from "lucide-react";

// export const metadata = {
//   title: "About Us | Seemanchal SmartVyapaar Consultancy",
//   description: "Learn about Seemanchal SmartVyapaar Consultancy's mission to bridge the digital divide for regional businesses and institutions.",
// };

// export default async function AboutPage() {
//   const aboutData = await contentAdapter.resolveAbout();

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between pb-24">
//       {/* Header */}
//       <section className="w-full bg-linear-to-b from-slate-50 to-white py-24 px-6 text-center border-b border-slate-200/60">
//         <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900">About Us</h1>
//         <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
//           {aboutData.about.story}
//         </p>
//       </section>

//       {/* Mission & Vision */}
//       <section className="w-full max-w-7xl mx-auto px-6 py-24">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//           <div className="bg-white border border-slate-200/80 p-10 lg:p-12 rounded-2xl shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
//             <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none">
//                <Target className="h-48 w-48 text-brand-accent transform rotate-12" />
//             </div>
//             <div className="h-16 w-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mb-8 relative z-10">
//               <Target className="h-8 w-8 text-brand-accent" />
//             </div>
//             <h2 className="text-3xl font-bold mb-4 text-slate-900 relative z-10">Our Mission</h2>
//             <p className="text-lg text-slate-500 leading-relaxed relative z-10">
//               {aboutData.about.mission}
//             </p>
//           </div>
//           <div className="bg-white border border-slate-200/80 p-10 lg:p-12 rounded-2xl shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
//             <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none">
//                <ShieldCheck className="h-48 w-48 text-brand-emerald transform rotate-12" />
//             </div>
//             <div className="h-16 w-16 bg-brand-emerald/10 rounded-2xl flex items-center justify-center mb-8 relative z-10">
//               <ShieldCheck className="h-8 w-8 text-brand-emerald" />
//             </div>
//             <h2 className="text-3xl font-bold mb-4 text-slate-900 relative z-10">Our Vision</h2>
//             <p className="text-lg text-slate-500 leading-relaxed relative z-10">
//               {aboutData.about.vision}
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Why Seemanchal — converted from dark to light */}
//       <section className="w-full bg-slate-50/60 py-24 px-6">
//         <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
//           <div className="w-full md:w-1/2">
//             <div className="aspect-square bg-white border border-slate-200/80 rounded-full flex items-center justify-center relative shadow-md">
//               <div className="h-60 w-60 rounded-full bg-brand-accent/10 flex items-center justify-center md:h-89 md:w-89">
//                 <Image
//                   src="/assets/logo.png"
//                   alt="Seemanchal SmartVyapaar Consultancy"
//                   width={428}
//                   height={428}
//                   className="rounded-4xl object-cover"  
//                 />
//                </div>
//               <div className="absolute -bottom-6 -right-6 bg-brand-accent p-6 rounded-2xl border-4 border-slate-50 shadow-lg">
//                 <p className="text-2xl font-bold text-white">100%</p>
//                 <p className="text-xs font-medium uppercase tracking-wider text-blue-100">Local Focus</p>
//               </div>
//             </div>
//           </div>
//           <div className="w-full md:w-1/2 space-y-6">
//             <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Empowering Multi-Industry Growth</h2>
//             <p className="text-slate-500 text-lg leading-relaxed">
//               We believe that geographical location shouldn&apos;t dictate the quality of your digital infrastructure. 
//               By bringing Silicon Valley-standard SaaS architectures, scalable software, and premium digital systems to our region, 
//               we are leveling the playing field for local enterprises, educational institutions, hospitality brands, and startups.
//             </p>
//             <ul className="space-y-4 pt-4">
//               {aboutData.whyChooseUs.map((item, i) => (
//                 <li key={i} className="flex gap-4">
//                   <div className="h-6 w-6 mt-1 rounded-full bg-brand-accent/10 flex items-center justify-center shrink-0">
//                     <div className="h-2 w-2 rounded-full bg-brand-accent" />
//                   </div>
//                   <div>
//                     <h4 className="font-bold text-slate-900">{item.title}</h4>
//                     <p className="text-slate-500 text-sm">{item.description}</p>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="w-full max-w-4xl mx-auto px-6 mt-24 text-center">
//         <h3 className="text-3xl font-bold mb-6 text-slate-900">Ready to scale your operations?</h3>
//         <p className="text-slate-500 mb-8 max-w-xl mx-auto text-lg">Reach out to us and let&apos;s discuss how we can build your premium digital infrastructure.</p>
//         <CTA label="Book Consultation Today" href="/contact" size="lg" />
//       </section>
//     </main>
//   );
// }

import { contentAdapter } from "@/lib/contentAdapter";
import { CTA } from "@/components/ui/cta";
import Image from "next/image";
import {
  Target,
  ShieldCheck,
  Users,
  Rocket,
  Briefcase,
  ArrowRight,
} from "lucide-react";

const fallbackMetadata = {
  title: "About Us | Seemanchal SmartVyapaar Consultancy",
  description:
    "Learn about Seemanchal SmartVyapaar Consultancy's mission to bridge the digital divide for regional businesses and institutions.",
};

import { generatePageMetadata } from "@/lib/seo";
export async function generateMetadata() {
  try {
    return await Promise.race([
      generatePageMetadata('about', fallbackMetadata),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Metadata generation timeout')), 3000)
      )
    ]);
  } catch (error) {
    console.warn('About metadata generation failed:', error.message);
    return fallbackMetadata;
  }
}

export default async function AboutPage () {
  const aboutData = await contentAdapter.resolveAbout().catch(() => ({
    about: {
      story: 'Loading...',
      mission: 'Loading...',
      vision: 'Loading...',
    },
    stats: [],
    whyChooseUs: [],
  }));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-24">

      {/* HERO */}
      <section className="w-full bg-linear-to-b from-slate-50 to-white py-24 px-6 text-center border-b border-slate-200/60">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900">
          Building Digital Infrastructure for Bharat
        </h1>

        <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
          {aboutData.about.story}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <CTA label="Start Your Project" href="/contact" />
          <CTA
            label="Join Community"
            href="/community"
            variant="outline"
          />
        </div>
      </section>

      {/* FOUNDER SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white">
              <Image
                src="/founder/founder.png"
                alt="Founder"
                width={700}
                height={700}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -right-6 bg-brand-accent text-white p-6 rounded-2xl shadow-xl">
              <p className="text-3xl font-bold">SSC</p>
              <p className="text-sm text-blue-100">
                Vision Driven Innovation
              </p>
            </div>
          </div>

          {/* Right */}
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-accent/10 text-brand-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Rocket className="h-4 w-4" />
              Founder’s Vision
            </div>

            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Empowering Regional Businesses Through Technology
            </h2>

            <p className="text-lg text-slate-500 leading-relaxed mb-6">
              Seemanchal SmartVyapaar Consultancy was founded with a single
              vision — to make premium digital infrastructure accessible to
              businesses, schools, startups, hospitals, restaurants, and
              institutions across Tier-2 and Tier-3 India.
            </p>

            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              We believe innovation should not remain limited to metro cities.
              Our mission is to create scalable SaaS ecosystems, ERP systems,
              AI-powered platforms, and automation infrastructures that help
              local organizations compete at a national level.
            </p>

            <div className="grid grid-cols-2 gap-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h4 className="text-2xl font-bold text-brand-accent">
                  100%
                </h4>
                <p className="text-slate-500 text-sm mt-1">
                  Regional Business Focus
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h4 className="text-2xl font-bold text-brand-accent">
                  SaaS
                </h4>
                <p className="text-slate-500 text-sm mt-1">
                  Modern Scalable Architecture
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="w-full max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Mission */}
          <div className="bg-white border border-slate-200/80 p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500">
              <Target className="h-48 w-48 text-brand-accent rotate-12" />
            </div>

            <div className="h-16 w-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mb-8">
              <Target className="h-8 w-8 text-brand-accent" />
            </div>

            <h2 className="text-3xl font-bold mb-4 text-slate-900">
              Our Mission
            </h2>

            <p className="text-lg text-slate-500 leading-relaxed">
              {aboutData.about.mission}
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white border border-slate-200/80 p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500">
              <ShieldCheck className="h-48 w-48 text-brand-emerald rotate-12" />
            </div>

            <div className="h-16 w-16 bg-brand-emerald/10 rounded-2xl flex items-center justify-center mb-8">
              <ShieldCheck className="h-8 w-8 text-brand-emerald" />
            </div>

            <h2 className="text-3xl font-bold mb-4 text-slate-900">
              Our Vision
            </h2>

            <p className="text-lg text-slate-500 leading-relaxed">
              {aboutData.about.vision}
            </p>
          </div>
        </div>
      </section>

      {/* WHY SSC */}
      <section className="w-full bg-slate-50/70 py-24 px-6 mt-20">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-5">
              Why Organizations Choose SSC
            </h2>

            <p className="text-lg text-slate-500 max-w-3xl mx-auto">
              We combine modern full-stack engineering, enterprise thinking,
              scalable architecture, and regional understanding to build
              impactful digital ecosystems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aboutData.whyChooseUs.map((item, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center shrink-0">
                    <div className="h-3 w-3 rounded-full bg-brand-accent" />
                  </div>

                  <div>
                    <h4 className="font-bold text-xl text-slate-900 mb-2">
                      {item.title}
                    </h4>

                    <p className="text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY + CAREERS */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Community */}
          <div className="bg-linear-to-br from-brand-accent to-blue-700 text-white rounded-3xl p-10 shadow-xl">
            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <Users className="h-8 w-8" />
            </div>

            <h3 className="text-3xl font-bold mb-4">
              Join Our Community
            </h3>

            <p className="text-blue-100 leading-relaxed mb-8">
              Connect with founders, developers, students, creators, and
              innovators who are building the digital future of our region.
            </p>

            <a
              href="/community"
              className="inline-flex items-center gap-2 font-semibold"
            >
              Explore Community
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Careers */}
          <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all">
            <div className="h-16 w-16 bg-brand-emerald/10 rounded-2xl flex items-center justify-center mb-6">
              <Briefcase className="h-8 w-8 text-brand-emerald" />
            </div>

            <h3 className="text-3xl font-bold mb-4 text-slate-900">
              Build With Us
            </h3>

            <p className="text-slate-500 leading-relaxed mb-8">
              We are building a high-performance regional technology company.
              Join us through internships, collaborations, or full-time roles.
            </p>

            <a
              href="/career"
              className="inline-flex items-center gap-2 font-semibold text-brand-accent"
            >
              View Careers
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="w-full max-w-4xl mx-auto px-6 mt-10 text-center">
        <h3 className="text-4xl font-bold mb-6 text-slate-900">
          Ready to Scale Your Organization?
        </h3>

        <p className="text-slate-500 mb-8 max-w-2xl mx-auto text-lg">
          Let’s build powerful digital systems, automation workflows,
          enterprise software, and modern business infrastructure together.
        </p>

        <CTA
          label="Book Consultation Today"
          href="/contact"
          size="lg"
        />
      </section>
    </main>
  );
}