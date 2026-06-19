'use client';

import { TrendingUp, Award, Users, CheckCircle, Zap } from 'lucide-react';

const iconMap = {
  TrendingUp,
  Award,
  Users,
  CheckCircle,
  Zap,
};

export default function BenefitCard({ benefit }) {
  const Icon = iconMap[benefit.icon];
  
  if (!Icon) {
    return null;
  }
  
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 hover:border-blue-400 hover:shadow-lg transition duration-300">
      <div className="mb-4">
        <Icon className="h-12 w-12 text-blue-600" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">
        {benefit.title}
      </h3>
      <p className="text-slate-600 leading-relaxed">
        {benefit.description}
      </p>
    </div>
  );
}
