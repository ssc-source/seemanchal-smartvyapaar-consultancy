import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Future Skills Workshops | SSC Future Skills Lab',
  description: 'Interactive workshops for schools focused on AI literacy, digital citizenship, innovation, entrepreneurship and career discovery.',
};

export default function WorkshopsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="py-20 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🎓</div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Future Skills Workshops
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Hands-on workshops designed for schools to accelerate student learning in AI, innovation, digital citizenship and career readiness.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">Workshop Themes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              'AI Literacy Workshops',
              'Digital Safety and Ethics',
              'Innovation Labs',
              'Entrepreneurship Sessions',
              'Career Pathway Clinics',
              'Project-Based Learning',
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{item}</h3>
                <p className="text-slate-600 leading-relaxed">Practical sessions tailored for school students and educators.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Flexible Delivery Options</h2>
          <p className="text-lg text-slate-700 mb-8">
            Workshops can be delivered online, in-person or as hybrid sessions to fit your school schedule.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              'Online sessions for city and rural schools',
              'In-person workshops for stronger engagement',
              'Hybrid programs for flexible learning',
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 text-left">
                <p className="text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-blue-600 text-white rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-6">Bring Workshop Learning to Your School</h2>
          <Link
            href="/future-skills/schools"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition"
          >
            Request Workshop Proposal
          </Link>
        </div>
      </section>
    </div>
  );
}
