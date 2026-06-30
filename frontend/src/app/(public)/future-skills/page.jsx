import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import DemoRequestForm from '@/components/future-skills/DemoRequestForm';
import ProposalButtonWrapper from '@/components/future-skills/ProposalButtonWrapper';
import PillarCard from '@/components/future-skills/PillarCard';
import BenefitCard from '@/components/future-skills/BenefitCard';
import FAQAccordion from '@/components/future-skills/FAQAccordion';
import ProgramCard from '@/components/future-skills/ProgramCard';
import { ArrowRight, Zap, Users, Award, TrendingUp, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'SSC Future Skills Lab | Future Readiness Program for Schools',
  description: 'Industry-led future skills program helping schools prepare students for AI, innovation, entrepreneurship, digital citizenship and future careers.',
  keywords: [
    'Future Skills Program for Schools',
    'AI Literacy Program',
    'Digital Citizenship Program',
    'Career Discovery Program',
    'Innovation Program for Students',
    'School Partnership Program',
  ],
  openGraph: {
    title: 'SSC Future Skills Lab | Future Readiness Program for Schools',
    description: 'Helping schools prepare students for AI, innovation, entrepreneurship, career readiness and responsible digital citizenship.',
    type: 'website',
    url: 'https://www.seemanchalsmartvyapaar.com/future-skills',
  },
};

const pillars = [
  {
    id: 'ai-literacy',
    title: 'AI Literacy',
    slug: 'ai-literacy',
    description: 'Help students understand and use AI responsibly for learning, creativity and problem solving.',
    features: [
      'AI Basics',
      'Prompt Engineering',
      'AI Ethics',
      'AI Projects',
      'Future AI Careers',
    ],
    icon: '🤖',
  },
  {
    id: 'digital-citizenship',
    title: 'Digital Citizenship',
    slug: 'digital-citizenship',
    description: 'Develop safe, responsible and ethical digital citizens.',
    features: [
      'Cyber Safety',
      'Digital Footprint',
      'Privacy Awareness',
      'Fake News Detection',
      'Online Responsibility',
    ],
    icon: '🛡️',
  },
  {
    id: 'innovation-entrepreneurship',
    title: 'Innovation & Entrepreneurship',
    slug: 'innovation-entrepreneurship',
    description: 'Encourage students to solve real-world problems and think creatively.',
    features: [
      'Design Thinking',
      'Problem Solving',
      'Business Basics',
      'Innovation Challenges',
      'Startup Thinking',
    ],
    icon: '💡',
  },
  {
    id: 'career-discovery',
    title: 'Career Discovery',
    slug: 'career-discovery',
    description: 'Expose students to future careers and industry opportunities.',
    features: [
      'Career Awareness',
      'Industry Sessions',
      'Career Planning',
      'Emerging Technologies',
      'Future Jobs',
    ],
    icon: '🎯',
  },
];

const benefits = [
  {
    title: 'Future-Ready Students',
    description: 'Equip students with skills for tomorrow\'s job market',
    icon: 'TrendingUp',
  },
  {
    title: 'Enhanced School Reputation',
    description: 'Stand out as an innovator in education',
    icon: 'Award',
  },
  {
    title: 'Industry Collaboration',
    description: 'Connect students with real-world professionals',
    icon: 'Users',
  },
  {
    title: 'NEP-Oriented',
    description: 'Aligned with National Education Policy goals',
    icon: 'CheckCircle',
  },
  {
    title: 'Student Engagement',
    description: 'Interactive and practical learning experiences',
    icon: 'Zap',
  },
  {
    title: 'Annual Impact Reports',
    description: 'Measurable outcomes and school recognition',
    icon: 'TrendingUp',
  },
];

export default async function FutureSkillsPage() {
  let faqs = [];
  let programs = [];
  
  try {
    const [faqsData, programsData] = await Promise.all([
      api.getFutureSkillsFAQs(),
      api.getFutureSkillsPrograms(),
    ]);
    faqs = faqsData.data || [];
    programs = programsData.data || [];
  } catch (error) {
    console.error('Error loading page data:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* HERO SECTION */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            SSC Future Skills Lab
          </h1>
          <p className="text-2xl text-slate-600 mb-8 font-semibold">
            Preparing Students for AI, Innovation, Careers and Responsible Digital Citizenship
          </p>
          <p className="text-lg text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto">
            An industry-led future readiness program designed to help schools develop future-ready students through practical learning, industry exposure, innovation activities and career awareness initiatives.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/future-skills/schools"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Request School Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/future-skills/schools"
              className="inline-flex items-center justify-center px-8 py-4 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition"
            >
              Become Partner School
            </Link>
            <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-300 text-slate-900 rounded-lg font-semibold hover:border-slate-400 transition">
              Watch Program Overview
            </button>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">The Future Skills Gap</h2>
          <p className="text-lg leading-relaxed mb-6">
            Today's students will enter a world shaped by artificial intelligence, digital transformation and rapidly evolving careers.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            While academic knowledge remains essential, schools increasingly need structured programs that help students develop practical skills, innovation mindsets, digital responsibility and career awareness.
          </p>
          <p className="text-xl font-semibold text-blue-300">
            SSC Future Skills Lab bridges this gap.
          </p>
        </div>
      </section>

      {/* FOUR PILLARS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">The Four Pillars</h2>
            <p className="text-xl text-slate-600">Comprehensive framework for student development</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {pillars.map((pillar) => (
              <PillarCard key={pillar.id} pillar={pillar} />
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Benefits for Schools</h2>
            <p className="text-xl text-slate-600">Transform your school with future-ready programs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <BenefitCard key={idx} benefit={benefit} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">How the Program Works</h2>

          <div className="grid md:grid-cols-6 gap-4 mb-12">
            {[
              { num: '1', title: 'School Partnership' },
              { num: '2', title: 'Program Planning' },
              { num: '3', title: 'Interactive Workshops' },
              { num: '4', title: 'Projects & Activities' },
              { num: '5', title: 'Assessment & Reports' },
              { num: '6', title: 'Certificates & Recognition' },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl mb-3">
                  {step.num}
                </div>
                <p className="text-center text-sm font-semibold text-slate-700">{step.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENT OUTCOMES SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">For Students</h3>
              <ul className="space-y-4">
                {[
                  'Future Skills Development',
                  'AI Awareness & Literacy',
                  'Innovation Mindset',
                  'Career Discovery',
                  'Confidence Building',
                  'Leadership Development',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center text-lg text-slate-700">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">For Parents</h3>
              <ul className="space-y-4">
                {[
                  'Future Career Readiness',
                  'Safe Technology Usage',
                  'Skill Development',
                  'Exposure Beyond Academics',
                  'Confidence & Communication Growth',
                  'Digital Responsibility',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center text-lg text-slate-700">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Bring Future Skills Education to Your School</h2>
          <p className="text-xl mb-8 opacity-90">
            Request a customized proposal for your school.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/future-skills/schools" className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-slate-100 transition">
              Request School Demo
            </Link>
            <ProposalButtonWrapper variant="outline" />
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      {faqs.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>
      )}
    </div>
  );
}
