import Link from 'next/link';

export const metadata = {
  title: 'Become Partner School | SSC Future Skills Lab',
  description: 'Join SSC Future Skills Lab as a partner school and bring future-ready education to your students through industry-aligned programs.',
};

export default function BecomePartnerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="py-20 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🤝</div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Become a Partner School
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Partner with SSC Future Skills Lab to bring industry-led future skills education to your school community.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white text-slate-900 rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-4">Why Partner with SSC?</h2>
              <ul className="space-y-4">
                <li>Industry-aligned future skills learning</li>
                <li>Custom program frameworks</li>
                <li>Workshops, projects, career sessions</li>
                <li>Impact measurement and reporting</li>
              </ul>
            </div>
            <div className="bg-blue-700 rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-4 text-white">What you get</h2>
              <ul className="space-y-4 text-slate-200">
                <li>Customized school implementation plan</li>
                <li>Dedicated program support</li>
                <li>Teacher enablement sessions</li>
                <li>Future skills certification for students</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Partner Benefits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              'Future-ready school brand',
              'Stronger student outcomes',
              'Parental trust and satisfaction',
              'Industry collaboration',
              'Teacher enablement',
              'Outcome-based reporting',
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-left">
                <p className="text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center bg-white border border-slate-200 rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-4">Start Your Partnership Journey</h2>
          <p className="text-slate-600 mb-8">
            Share your school details and our team will connect with you to design a tailored program.
          </p>
          <Link
            href="/future-skills/schools"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Request School Demo
          </Link>
        </div>
      </section>
    </div>
  );
}
