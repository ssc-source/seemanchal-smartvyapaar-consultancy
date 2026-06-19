import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Career Discovery Program for Schools | SSC Future Skills Lab',
  description: 'Expose students to future careers, industry opportunities, career planning, and the future of work through interactive learning.',
};

export default function CareerDiscoveryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="py-20 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Career Discovery Program
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Expose students to future careers, industry awareness, career planning, and the future of work.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Program Focus Areas</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Future Careers',
                desc: 'Explore emerging career paths driven by AI, digital economies, and sustainability.',
              },
              {
                title: 'Industry Awareness',
                desc: 'Understand how industries operate and the skills they seek in young talent.',
              },
              {
                title: 'Career Planning',
                desc: 'Help students identify strengths, interests, and pathways forward.',
              },
              {
                title: 'Career Roadmaps',
                desc: 'Visualize learning journeys from school to future work.',
              },
              {
                title: 'Expert Sessions',
                desc: 'Live industry interactions to inspire students and broaden horizons.',
              },
              {
                title: 'Future of Work',
                desc: 'Prepare students for evolving workplaces and hybrid career models.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Learning Outcomes</h2>
          <ul className="space-y-4">
            {[
              'Understand tomorrow’s career options',
              'Connect strengths with career pathways',
              'Experience real industry thinking',
              'Plan learning journeys',
              'Build future-ready mindset',
              'Engage with experts and mentors',
            ].map((item, idx) => (
              <li key={idx} className="flex items-start text-lg">
                <CheckCircle className="h-6 w-6 text-green-600 mr-4 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-blue-600 text-white rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-6">Open the Door to Future Careers</h2>
          <Link
            href="/future-skills/schools"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition"
          >
            Request Career Discovery Workshop
          </Link>
        </div>
      </section>
    </div>
  );
}
