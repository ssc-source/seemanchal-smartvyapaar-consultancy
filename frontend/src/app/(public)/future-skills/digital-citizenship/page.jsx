import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Digital Citizenship Program for Schools | SSC Future Skills Lab',
  description: 'Develop safe, responsible and ethical digital citizens. Cyber safety, privacy awareness, and responsible technology programs for schools.',
};

export default function DigitalCitizenshipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="py-20 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🛡️</div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Digital Citizenship Program
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Develop safe, responsible and ethical digital citizens who navigate the online world confidently and responsibly.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Why Digital Citizenship Matters</h2>
          <p className="text-lg mb-6 leading-relaxed">
            Students spend hours online. They need practical skills to stay safe, protect their privacy, recognize misinformation, and use technology responsibly.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">Program Sections</h2>
          
          <div className="space-y-8">
            {[
              {
                title: '🔒 Cyber Safety',
                desc: 'Protecting personal information, strong passwords, avoiding scams and threats',
              },
              {
                title: '👣 Digital Footprint',
                desc: 'Understanding online reputation, managing social media presence responsibly',
              },
              {
                title: '🔐 Privacy Awareness',
                desc: 'Data privacy, permissions, what information is safe to share',
              },
              {
                title: '❌ Fake News Detection',
                desc: 'Identifying misinformation, checking sources, critical media literacy',
              },
              {
                title: '💬 Online Responsibility',
                desc: 'Digital etiquette, cyberbullying, respectful online communication',
              },
            ].map((section, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{section.title}</h3>
                <p className="text-slate-600 text-lg">{section.desc}</p>
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
              'Understand cyber threats and protection strategies',
              'Manage digital identity and online reputation',
              'Make informed decisions about online privacy',
              'Identify and report misinformation',
              'Practice respectful and responsible online behavior',
              'Protect personal and financial information',
              'Balance technology use with wellbeing',
            ].map((outcome, idx) => (
              <li key={idx} className="flex items-start text-lg">
                <CheckCircle className="h-6 w-6 text-green-600 mr-4 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-blue-600 text-white rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-6">Empower Your Students as Responsible Digital Citizens</h2>
          <Link
            href="/future-skills/schools"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition"
          >
            Request Digital Citizenship Workshop
          </Link>
        </div>
      </section>
    </div>
  );
}
