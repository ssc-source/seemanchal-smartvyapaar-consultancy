'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQAccordion({ faqs }) {
  const [openId, setOpenId] = useState(null);

  if (!faqs || faqs.length === 0) {
    return (
      <div className="text-center py-12 text-slate-600">
        <p>No FAQs available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq) => (
        <div
          key={faq.id}
          className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-blue-400 transition"
        >
          <button
            onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
            className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition text-left"
          >
            <h3 className="font-semibold text-slate-900">{faq.question}</h3>
            <ChevronDown
              className={`h-5 w-5 text-slate-600 transition ${
                openId === faq.id ? 'transform rotate-180' : ''
              }`}
            />
          </button>

          {openId === faq.id && (
            <div className="px-6 py-4 bg-white border-t border-slate-200">
              <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
