import { CheckCircle, Users, Zap } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'AI Literacy Program for Schools | SSC Future Skills Lab',
  description: 'Help students understand AI concepts, responsible usage, and practical applications. AI education program for schools aligned with future career needs.',
};

export default function AILiteracyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🤖</div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            AI Literacy Program
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Artificial Intelligence is transforming education, business and careers. Our AI Literacy Program helps students understand AI concepts, responsible usage and practical applications.
          </p>
        </div>
      </section>

      {/* Why AI Matters */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Why AI Matters</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-lg leading-relaxed">
                AI is reshaping every industry. Students who understand AI will have competitive advantages in education and careers.
              </p>
            </div>
            <div>
              <p className="text-lg leading-relaxed">
                Beyond coding, students need AI awareness, ethical thinking, and practical problem-solving using AI tools.
              </p>
            </div>
            <div>
              <p className="text-lg leading-relaxed">
                Early exposure builds confidence, curiosity, and prepares students for future careers in an AI-driven world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Students Learn */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">What Students Learn</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Core Concepts</h3>
              <ul className="space-y-4">
                {[
                  'What is AI and Machine Learning',
                  'AI in everyday applications',
                  'How AI learns and improves',
                  'Data basics and privacy',
                  'AI limitations and challenges',
                  'Future AI trends',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Practical Skills</h3>
              <ul className="space-y-4">
                {[
                  'Using AI tools responsibly',
                  'Prompt engineering basics',
                  'AI for creativity and writing',
                  'Problem solving with AI',
                  'Critical thinking about AI',
                  'AI ethics and responsibility',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Outcomes */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Learning Outcomes</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'AI Awareness', desc: 'Understand AI fundamentals' },
              { num: '2', title: 'Critical Thinking', desc: 'Evaluate AI responsibly' },
              { num: '3', title: 'Practical Skills', desc: 'Use AI tools effectively' },
              { num: '4', title: 'Future Ready', desc: 'Prepared for AI careers' },
            ].map((outcome, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                  {outcome.num}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{outcome.title}</h3>
                <p className="text-slate-600 text-sm">{outcome.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-blue-600 text-white rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-6">Ready to Bring AI Education to Your School?</h2>
          <p className="text-lg mb-8 opacity-90">
            Request an AI Literacy workshop for your students.
          </p>
          <Link
            href="/future-skills/schools"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition"
          >
            Request AI Workshop
          </Link>
        </div>
      </section>
    </div>
  );
}
