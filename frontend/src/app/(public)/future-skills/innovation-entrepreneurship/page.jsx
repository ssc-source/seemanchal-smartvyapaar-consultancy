import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Innovation & Entrepreneurship Program | SSC Future Skills Lab',
  description: 'Encourage students to solve real-world problems, think creatively, and develop entrepreneurial mindsets through innovation challenges.',
};

export default function InnovationEntrepreneurshipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="py-20 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">💡</div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Innovation & Entrepreneurship Program
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Encourage students to solve real-world problems, think creatively, and develop entrepreneurial mindsets through practical challenges.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">Program Highlights</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Problem Solving',
                desc: 'Teach students how to identify problems, research causes, and design effective solutions.',
              },
              {
                title: 'Design Thinking',
                desc: 'Build habit of empathy, ideation, prototyping, and feedback-driven learning.',
              },
              {
                title: 'Innovation Challenges',
                desc: 'Hands-on challenges that encourage creativity, teamwork, and real-world thinking.',
              },
              {
                title: 'Business Basics',
                desc: 'Introduce students to entrepreneurship fundamentals, market fit, and value creation.',
              },
              {
                title: 'Pitching Ideas',
                desc: 'Help students present solutions with confidence, clarity, and purpose.',
              },
              {
                title: 'Startup Awareness',
                desc: 'Explore how businesses grow and how innovation becomes impact.',
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
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">What Students Gain</h2>
          <ul className="space-y-4">
            {[
              'Creative problem-solving skills',
              'Confidence in pitching ideas',
              'Entrepreneurial mindset',
              'Team collaboration experience',
              'Understanding of business basics',
              'Project execution discipline',
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
          <h2 className="text-3xl font-bold mb-6">Build Future Innovators and Young Entrepreneurs</h2>
          <Link
            href="/future-skills/schools"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition"
          >
            Request Innovation Workshop
          </Link>
        </div>
      </section>
    </div>
  );
}
