import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import DemoRequestForm from '@/components/future-skills/DemoRequestForm';

export const metadata = {
  title: 'School Partnership Program | SSC Future Skills Lab',
  description: 'Become a Future Skills Lab partner school. Industry-led learning, workshops, projects, career awareness, and student engagement programs.',
};

export default function SchoolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            School Partnership Program
          </h1>
          <p className="text-xl text-slate-600">
            Transform your school with industry-led future skills education
          </p>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Challenges Schools Face</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">📚 Student Needs</h3>
              <p className="text-slate-300 leading-relaxed">
                Today's students need future skills beyond traditional academics. They need AI literacy, digital citizenship, innovation thinking, and career awareness to thrive in tomorrow's world.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">👨‍👩‍👧 Parent Expectations</h3>
              <p className="text-slate-300 leading-relaxed">
                Parents expect schools to prepare their children for future careers. They want to see practical skills, industry exposure, and career readiness.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">⚡ Rapid Change</h3>
              <p className="text-slate-300 leading-relaxed">
                Technology is changing rapidly. Schools need structured support to keep up with AI, digital transformation, and emerging careers.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">🎯 Structured Support</h3>
              <p className="text-slate-300 leading-relaxed">
                Implementing new programs requires planning, resources, and expertise. Schools need partners to make it work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How SSC Helps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">How SSC Helps</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                icon: '🏭',
                title: 'Industry-Led Learning',
                description: 'Content designed by industry professionals, not just academics',
              },
              {
                icon: '🎓',
                title: 'Expert Workshops',
                description: 'Delivered by professionals with real-world experience',
              },
              {
                icon: '💼',
                title: 'Practical Projects',
                description: 'Real-world problem solving and innovation challenges',
              },
              {
                icon: '🎯',
                title: 'Career Awareness',
                description: 'Industry sessions and future job exploration',
              },
              {
                icon: '📈',
                title: 'Student Engagement',
                description: 'Interactive, hands-on learning experiences',
              },
              {
                icon: '📊',
                title: 'Impact Reports',
                description: 'Measurable outcomes and school recognition',
              },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Framework */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Program Frameworks</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">12 Session Model</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Perfect for schools looking to introduce future skills. One session per month across one academic year.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start text-slate-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Monthly workshops</span>
                </li>
                <li className="flex items-start text-slate-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>All 4 pillars covered</span>
                </li>
                <li className="flex items-start text-slate-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Flexible scheduling</span>
                </li>
                <li className="flex items-start text-slate-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Student certificates</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-blue-400 rounded-xl p-8 relative">
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">24 Session Model</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Comprehensive program with deeper engagement. 2-3 sessions per month for maximum impact.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start text-slate-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Bi-weekly sessions</span>
                </li>
                <li className="flex items-start text-slate-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Deep skill building</span>
                </li>
                <li className="flex items-start text-slate-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Project-based learning</span>
                </li>
                <li className="flex items-start text-slate-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Impact assessment</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Annual Club Model</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Year-round engagement through student clubs. Weekly meetings and sustained learning.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start text-slate-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Weekly club meetings</span>
                </li>
                <li className="flex items-start text-slate-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Student leadership</span>
                </li>
                <li className="flex items-start text-slate-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Innovation projects</span>
                </li>
                <li className="flex items-start text-slate-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Community impact</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Expected Outcomes */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Expected Outcomes</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">For Students</h3>
              <ul className="space-y-4">
                {[
                  'Understanding of AI and its applications',
                  'Digital responsibility and cyber safety',
                  'Innovation and problem-solving mindset',
                  'Career awareness and planning skills',
                  'Increased confidence and leadership',
                  'Industry network connections',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-900">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-green-900 mb-6">For School</h3>
              <ul className="space-y-4">
                {[
                  'Enhanced school reputation',
                  'Differentiation in market',
                  'Industry partnership opportunities',
                  'Higher student engagement',
                  'NEP-aligned curriculum',
                  'Annual impact recognition',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-green-900">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA for Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Become a Partner School?</h2>
          <p className="text-lg mb-8 opacity-90">
            Fill out the form below and our team will contact you within 24 hours with a customized proposal.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Request a Demo</h2>
          <DemoRequestForm />
        </div>
      </section>

      {/* Contact Footer */}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Have Questions?</h3>
          <p className="text-slate-600 mb-6">
            Reach out to our team directly
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div>
              <p className="text-sm text-slate-600">Phone</p>
              <p className="text-lg font-semibold text-slate-900">+91 6453356884</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Email</p>
              <p className="text-lg font-semibold text-slate-900">info@seemanchalsmartvyapaar.com</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Location</p>
              <p className="text-lg font-semibold text-slate-900">Araria, Bihar 854311</p>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
