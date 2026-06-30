'use client';

import { useState } from 'react';
import ProposalDownloadModal from './ProposalDownloadModal';
import { Download } from 'lucide-react';

export default function ProposalButtonWrapper({ variant = 'hero', className = '' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonClasses =
    variant === 'hero'
      ? 'px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 text-base'
      : variant === 'outline'
      ? 'px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2'
      : 'px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-slate-100 hover:shadow-md transition flex items-center justify-center gap-2 text-sm';

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`${buttonClasses} ${className}`}
      >
        <Download className="h-4 w-4 shrink-0" />
        <span>Download Proposal</span>
      </button>

      <ProposalDownloadModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
