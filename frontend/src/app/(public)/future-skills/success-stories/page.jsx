import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Success Stories | SSC Future Skills Lab',
  description: 'Read success stories from schools that partnered with SSC Future Skills Lab for AI literacy, innovation, entrepreneurship, and career discovery.',
};

const stories = [
  {
    title: 'Innovation Club Launch at St. Xavier School',
    summary: 'Students built real-world solutions for campus sustainability and presented at an inter-school showcase.',
  },
  {
    title: 'AI Awareness Week at Sunshine Academy',
    summary: 'Students completed AI projects, learned ethical AI use, and shared their ideas with parents.',
  },
  {
    title: 'Career Discovery Week at Greenfields School',
    summary: 'Students explored emerging careers, engaged with industry leaders, and built career roadmaps.',
  },
];

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="py-20 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🏆</div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Success Stories
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            See how schools are driving future readiness with SSC Future Skills Lab.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid gap-8">
          {stories.map((story, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">{idx + 1}</div>
                <h2 className="text-2xl font-bold text-slate-900">{story.title}</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">{story.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-4">Share Your School Success Story</h2>
          <p className="text-lg mb-8 text-blue-100">
            Become a showcase school and inspire others with your future skills journey.
          </p>
          <Link
            href="/future-skills/schools"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition"
          >
            Request Partnership
          </Link>
        </div>
      </section>
    </div>
  );
}
