'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function PillarCard({ pillar }) {
  return (
    <Link href={`/future-skills/${pillar.slug}`}>
      <div className="group cursor-pointer h-full">
        <div className="bg-white border border-slate-200 rounded-xl p-8 h-full hover:border-blue-400 hover:shadow-lg transition duration-300">
          <div className="text-5xl mb-4">{pillar.icon}</div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition">
            {pillar.title}
          </h3>
          <p className="text-slate-600 mb-6 leading-relaxed">
            {pillar.description}
          </p>
          
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Key Topics:</h4>
            <ul className="space-y-2">
              {pillar.features.map((feature, idx) => (
                <li key={idx} className="text-sm text-slate-600 flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 transition">
            Learn More
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>
    </Link>
  );
}
