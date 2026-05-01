import { contentAdapter } from "@/lib/contentAdapter";
import { CTA } from "@/components/ui/cta";
import { Globe, GraduationCap, Share2, Briefcase, Palette, TrendingUp, LifeBuoy, Coffee, Settings } from "lucide-react";

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

export const metadata = {
  title: "Our Services | SSC Consultancy",
  description: "Premium digital services including Website Development, School ERP, Social Media Management, and Branding in Seemanchal.",
};

export default async function ServicesPage() {
  const services = await contentAdapter.resolveServices();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-24">
      {/* Header */}
      <section className="w-full bg-linear-to-b from-slate-50 to-white py-20 px-6 text-center border-b border-slate-200/60">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900">Our Services</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Comprehensive digital solutions to modernize your business operations and establish a powerful brand presence.
        </p>
      </section>

      {/* Services List */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 space-y-16">
        {services.map((service, i) => {
          const IconComponent = iconMap[service.icon] || Globe;
          return (
            <div key={i} id={service.id} className="flex flex-col md:flex-row gap-10 items-start p-10 lg:p-12 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-accent/30 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none">
                 <IconComponent className="h-48 w-48 text-brand-accent transform rotate-12" />
              </div>
              <div className="shrink-0 h-20 w-20 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent relative z-10 group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300">
                <IconComponent className="h-10 w-10" />
              </div>
              <div className="flex-1 space-y-4 relative z-10">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">{service.title}</h2>
                <p className="text-lg text-slate-500 leading-relaxed">{service.description}</p>
                <div className="pt-6">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">System Architecture</h4>
                  <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
                    <p className="text-slate-600 mb-6 pb-6 border-b border-slate-200 leading-relaxed text-lg">
                      {service.details}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 pb-6 border-b border-slate-200">
                      {service.idealFor && service.idealFor.length > 0 && (
                        <div>
                          <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Ideal For</h5>
                          <ul className="space-y-2">
                            {service.idealFor.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {service.outcomes && service.outcomes.length > 0 && (
                        <div>
                          <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Business Outcomes</h5>
                          <ul className="space-y-2">
                            {service.outcomes.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-brand-emerald"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {service.modules && service.modules.length > 0 && (
                      <div>
                        <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Included Modules</h5>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {service.modules.map((mod, j) => (
                            <li key={j} className="flex items-start gap-3 text-base text-slate-600">
                              <span className="text-brand-emerald mt-1 font-bold">✓</span>
                              <span className="leading-snug">{mod}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-8 md:mt-0 md:ml-auto relative z-10">
                <CTA label="Inquire Now" href={`/contact?service=${service.id}`} variant="outline" size="lg" />
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="w-full max-w-4xl mx-auto px-6 text-center">
        <h3 className="text-2xl font-bold mb-6 text-slate-900">Not sure what you need?</h3>
        <p className="text-slate-500 mb-8 max-w-xl mx-auto">Our consultants can help evaluate your business and recommend the best digital strategy.</p>
        <CTA label="Book a Free Consultation" href="/contact" />
      </section>
    </main>
  );
}
