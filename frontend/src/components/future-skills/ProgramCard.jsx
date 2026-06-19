'use client';

export default function ProgramCard({ program }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 hover:border-blue-400 hover:shadow-lg transition duration-300">
      <h3 className="text-2xl font-bold text-slate-900 mb-3">
        {program.title}
      </h3>
      <p className="text-slate-600 mb-6 leading-relaxed">
        {program.description}
      </p>

      {program.features && program.features.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Key Features:</h4>
          <ul className="space-y-2">
            {program.features.map((feature, idx) => (
              <li key={idx} className="text-sm text-slate-600 flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {program.outcomes && program.outcomes.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Learning Outcomes:</h4>
          <ul className="space-y-2">
            {program.outcomes.map((outcome, idx) => (
              <li key={idx} className="text-sm text-slate-600 flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
