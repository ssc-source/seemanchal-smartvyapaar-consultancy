import { contentAdapter } from "@/lib/contentAdapter";
import { CTA } from "@/components/ui/cta";
import Image from "next/image";
import { Target, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "About Us | Seemanchal SmartVyapaar Consultancy",
  description: "Learn about Seemanchal SmartVyapaar Consultancy's mission to bridge the digital divide for regional businesses and institutions.",
};

export default async function AboutPage() {
  const aboutData = await contentAdapter.resolveAbout();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-24">
      {/* Header */}
      <section className="w-full bg-linear-to-b from-slate-50 to-white py-24 px-6 text-center border-b border-slate-200/60">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900">About Us</h1>
        <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
          {aboutData.about.story}
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white border border-slate-200/80 p-10 lg:p-12 rounded-2xl shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none">
               <Target className="h-48 w-48 text-brand-accent transform rotate-12" />
            </div>
            <div className="h-16 w-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mb-8 relative z-10">
              <Target className="h-8 w-8 text-brand-accent" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-900 relative z-10">Our Mission</h2>
            <p className="text-lg text-slate-500 leading-relaxed relative z-10">
              {aboutData.about.mission}
            </p>
          </div>
          <div className="bg-white border border-slate-200/80 p-10 lg:p-12 rounded-2xl shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none">
               <ShieldCheck className="h-48 w-48 text-brand-emerald transform rotate-12" />
            </div>
            <div className="h-16 w-16 bg-brand-emerald/10 rounded-2xl flex items-center justify-center mb-8 relative z-10">
              <ShieldCheck className="h-8 w-8 text-brand-emerald" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-900 relative z-10">Our Vision</h2>
            <p className="text-lg text-slate-500 leading-relaxed relative z-10">
              {aboutData.about.vision}
            </p>
          </div>
        </div>
      </section>

      {/* Why Seemanchal — converted from dark to light */}
      <section className="w-full bg-slate-50/60 py-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <div className="aspect-square bg-white border border-slate-200/80 rounded-full flex items-center justify-center relative shadow-md">
              <div className="h-60 w-60 rounded-full bg-brand-accent/10 flex items-center justify-center md:h-89 md:w-89">
                <Image
                  src="/assets/logo.png"
                  alt="Seemanchal SmartVyapaar Consultancy"
                  width={428}
                  height={428}
                  className="rounded-4xl object-cover"  
                />
               </div>
              <div className="absolute -bottom-6 -right-6 bg-brand-accent p-6 rounded-2xl border-4 border-slate-50 shadow-lg">
                <p className="text-2xl font-bold text-white">100%</p>
                <p className="text-xs font-medium uppercase tracking-wider text-blue-100">Local Focus</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Empowering Multi-Industry Growth</h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              We believe that geographical location shouldn&apos;t dictate the quality of your digital infrastructure. 
              By bringing Silicon Valley-standard SaaS architectures, scalable software, and premium digital systems to our region, 
              we are leveling the playing field for local enterprises, educational institutions, hospitality brands, and startups.
            </p>
            <ul className="space-y-4 pt-4">
              {aboutData.whyChooseUs.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="h-6 w-6 mt-1 rounded-full bg-brand-accent/10 flex items-center justify-center shrink-0">
                    <div className="h-2 w-2 rounded-full bg-brand-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full max-w-4xl mx-auto px-6 mt-24 text-center">
        <h3 className="text-3xl font-bold mb-6 text-slate-900">Ready to scale your operations?</h3>
        <p className="text-slate-500 mb-8 max-w-xl mx-auto text-lg">Reach out to us and let&apos;s discuss how we can build your premium digital infrastructure.</p>
        <CTA label="Book Consultation Today" href="/contact" size="lg" />
      </section>
    </main>
  );
}
