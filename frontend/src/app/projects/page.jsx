import { contentAdapter } from "@/lib/contentAdapter";
import { CTA } from "@/components/ui/cta";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Our Work | Seemanchal SmartVyapaar Consultancy",
  description: "Explore our portfolio of premium websites, school ERPs, and digital systems built for Seemanchal businesses.",
};

export default async function ProjectsPage() {
  const projects = await contentAdapter.resolveProjects();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-24">
      {/* Header */}
      <section className="w-full bg-linear-to-b from-slate-50 to-white py-24 px-6 text-center border-b border-slate-200/60">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900">Our Work</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Take a look at the digital solutions and business systems we&apos;ve built.
        </p>
      </section>

      {/* Projects Case Study List */}
      <section className="w-full max-w-6xl mx-auto px-6 py-24 space-y-32">
        {projects.map((project, i) => (
          <div key={i} className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Image Side */}
            <div className={`w-full lg:w-1/2 rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-100 ${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
              {project.image ? (
                <div className="relative aspect-video w-full">
                  <Image 
                    src={project.image} 
                    alt={`${project.title} Preview`} 
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full flex items-center justify-center text-slate-400 font-medium bg-slate-100">
                  [Screenshot: {project.title}]
                </div>
              )}
            </div>

            {/* Content Side */}
            <div className={`w-full lg:w-1/2 space-y-6 ${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
              <div>
                <span className="text-xs font-semibold text-brand-emerald tracking-wider uppercase mb-2 block">
                  {project.category} &bull; {project.businessType}
                </span>
                <h3 className="text-3xl font-bold mb-4 text-slate-900">{project.title}</h3>
                <p className="text-lg text-slate-500 mb-6">{project.summary}</p>
              </div>

              <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
                {project.problem && (
                  <div>
                    <h5 className="font-semibold text-sm text-slate-800 mb-1">The Problem:</h5>
                    <p className="text-sm text-slate-500">{project.problem}</p>
                  </div>
                )}
                {project.solution && (
                  <div>
                    <h5 className="font-semibold text-sm text-slate-800 mb-1">The Solution:</h5>
                    <p className="text-sm text-slate-500">{project.solution}</p>
                  </div>
                )}
                {project.outcome && (
                  <div className="pt-2 border-t border-slate-200">
                    <h5 className="font-bold text-sm text-brand-emerald mb-1 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Business Outcome:
                    </h5>
                    <p className="text-sm text-slate-700 font-medium">{project.outcome}</p>
                  </div>
                )}
              </div>

              {project.tools && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tools.map((tool, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-100 text-xs font-medium rounded-full text-slate-500 border border-slate-200/60">
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="w-full max-w-4xl mx-auto px-6 text-center">
        <div className="bg-slate-50 rounded-2xl p-12 border border-slate-200/80">
          <h3 className="text-2xl font-bold mb-4 text-slate-900">Ready to automate your operations?</h3>
          <p className="text-slate-500 mb-8">Partner with us to create your digital success story.</p>
          <CTA label="Get a Custom Solution Plan" href="/contact" />
        </div>
      </section>
    </main>
  );
}
