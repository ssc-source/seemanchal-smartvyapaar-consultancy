import { contentAdapter } from "@/lib/contentAdapter";
import { CTA } from "@/components/ui/cta";
import { Globe, GraduationCap, Share2, Briefcase, Palette, TrendingUp, LifeBuoy, CheckCircle2, Coffee, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const iconMap = {
  Globe,
  GraduationCap,
  Share2,
  Briefcase,
  Palette,
  TrendingUp,
  LifeBuoy,
  Coffee,
  Settings,
};

export default async function Home() {
  const pageData = await contentAdapter.resolveHomepage();
  const services = await contentAdapter.resolveServices();
  const projects = await contentAdapter.resolveProjects();
  const testimonials = await contentAdapter.resolveTestimonials();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* ─── Hero Section ─── */}
      <section className="w-full relative bg-linear-to-b from-slate-50 via-white to-white pt-28 pb-20 px-6 lg:px-8 flex flex-col items-center text-center overflow-hidden">
        {/* Subtle decorative gradient */}
        <div className="absolute top-0 inset-x-0 h-[400px] bg-linear-to-b from-brand-accent/5 to-transparent pointer-events-none" />
        
        <div className="max-w-4xl z-10 space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
            {pageData.hero.headline}
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {pageData.hero.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <CTA 
              label={pageData.hero.primaryCTA.label} 
              href={pageData.hero.primaryCTA.href} 
              variant="secondary" 
              size="lg" 
            />
            <CTA 
              label={pageData.hero.secondaryCTA.label} 
              href={pageData.hero.secondaryCTA.href} 
              variant="outline" 
              size="lg" 
            />
          </div>
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section className="w-full max-w-6xl -mt-4 z-20 px-6 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl p-8 shadow-lg border border-slate-200/80">
          {pageData.stats.map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <p className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-brand-accent to-brand-emerald pb-1">{stat.value}</p>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Use Cases Section ─── */}
      <section className="w-full bg-slate-50/60 py-16 md:py-24 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Built for Your Industry</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">We architect digital infrastructure tailored to the operational realities of your specific market.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageData.useCases?.map((useCase, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-bold mb-3 text-slate-900">{useCase.industry}</h3>
                <p className="text-slate-500 leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Services Section ─── */}
      <section className="w-full py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Our Digital Systems</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">We provide end-to-end digital infrastructure and automation systems to scale your business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => {
              const IconComponent = iconMap[service.icon] || Globe;
              return (
                <div key={i} className="group p-10 rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:border-brand-accent/30 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none">
                     <IconComponent className="h-32 w-32 text-brand-accent transform rotate-12" />
                  </div>
                  <div className="h-14 w-14 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-6 group-hover:bg-brand-accent group-hover:text-white transition-colors relative z-10">
                    <IconComponent className="h-7 w-7 text-brand-accent group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{service.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-4">{service.description}</p>
                  {service.modules && service.modules.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <ul className="space-y-2">
                        {service.modules.slice(0, 3).map((mod, j) => (
                          <li key={j} className="text-sm text-slate-500 flex items-start gap-2">
                            <span className="text-brand-emerald mt-0.5">•</span> {mod}
                          </li>
                        ))}
                        {service.modules.length > 3 && (
                          <li className="text-sm text-brand-accent font-medium mt-2">
                            + {service.modules.length - 3} more modules
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <CTA label="View All Systems" href="/services" variant="outline" size="lg" />
          </div>
        </div>
      </section>

      {/* ─── Projects Section ─── */}
      <section className="w-full bg-slate-50/60 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Featured Work</h2>
              <p className="text-slate-500 text-lg">Premium solutions delivered for regional leaders.</p>
            </div>
            <CTA label="View All Case Studies" href="/projects" variant="outline" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.slice(0, 4).map((project, i) => {
              const normalizedProjectHref = project.href?.trim() || '';
              const isExternalLink = /^(https?:\/\/|\/\/|www\.)/i.test(normalizedProjectHref);
              const Wrapper = isExternalLink ? 'a' : Link;

              return (
                <Wrapper
                  key={i}
                  href={normalizedProjectHref || `/projects/${project.slug}`}
                  {...(isExternalLink ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="group block overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden">
                    {project.image ? (
                      <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500">
                        [Project Image: {project.title}]
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-8">
                    <span className="text-xs font-semibold text-brand-emerald tracking-wider uppercase mb-2 block">
                      {project.category} {project.businessType && `• ${project.businessType}`}
                    </span>
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-brand-accent transition-colors">{project.title}</h3>
                    <p className="text-slate-500 mb-4">{project.summary}</p>
                    
                    {project.outcome && (
                      <div className="pt-4 border-t border-slate-100 flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-brand-emerald shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-slate-600">{project.outcome}</p>
                      </div>
                    )}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>
      

      {/* ─── Implementation Process ─── */}
      <section className="w-full bg-slate-50/60 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Our Transformation Process</h2>
            <p className="text-slate-500 text-lg">A clear, reliable path from consultation to operational scale.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-slate-200 -translate-y-1/2 z-0" />
            {pageData.implementationProcess?.map((step, i) => (
              <div key={i} className="relative z-10 bg-white border border-slate-200/80 shadow-sm hover:shadow-lg p-10 rounded-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="h-12 w-12 bg-brand-accent text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto lg:mx-0 shadow-md shadow-brand-accent/20">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold mb-3 text-slate-900 text-center lg:text-left">{step.title.replace(/^\d+\.\s*/, '')}</h3>
                <p className="text-slate-500 leading-relaxed text-center lg:text-left">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials Section ─── */}
      <section className="w-full py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Client Success Stories</h2>
            <p className="text-slate-500 text-lg">Real operational results from regional leaders.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <div key={i} className="p-10 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 relative flex flex-col justify-between">
                <div>
                  <div className="absolute top-6 right-8 text-6xl text-slate-200 font-serif leading-none">&quot;</div>
                  <p className="text-slate-600 italic mb-8 relative z-10 text-lg leading-relaxed">{test.quote}</p>
                  {test.context && (
                    <div className="mb-8 p-4 rounded-xl bg-brand-emerald/5 border border-brand-emerald/15 text-brand-emerald text-sm font-medium">
                      {test.context}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 border-t border-slate-100 pt-6 mt-auto">
                  <div className="h-12 w-12 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold shrink-0">
                    {test.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">{test.author}</p>
                    <p className="text-sm text-brand-accent font-medium">{test.organization}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="w-full bg-slate-50/60 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Common Questions</h2>
            <p className="text-slate-500 text-lg">Clarity on our process, delivery, and support.</p>
          </div>
          <div className="space-y-4">
            {pageData.faqs?.map((faq, i) => (
              <details key={i} className="group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer font-bold text-lg text-slate-900">
                  {faq.question}
                  <span className="transition group-open:rotate-180 text-slate-400">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <p className="mt-4 text-slate-500 leading-relaxed text-lg">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="bg-brand-primary text-white rounded-2xl p-12 md:p-16 space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-brand-accent/15 to-transparent pointer-events-none" />
          <h2 className="text-4xl md:text-5xl font-bold relative z-10">Ready to Transform Your Business?</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto relative z-10">
            Let&apos;s build a digital system that drives growth and establishes your brand as a regional leader.
          </p>
          <div className="flex justify-center pt-4 relative z-10">
            <CTA label="Get a Custom Solution Plan" href="/contact" size="lg" variant="primary-on-dark" />
          </div>
        </div>
      </section>

    </main>
  );
}
