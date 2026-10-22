import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import { Language } from '../types';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
  lang: Language;
}

export const LegalModals: React.FC<LegalModalProps> = ({ type, onClose, lang }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0B1B32] border border-cyan-500/30 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'privacy' ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>SKG Enterprises · Transparency Notice</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {lang === 'ne' ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
            </h3>
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                <strong>Information We Collect:</strong> When you submit a project inquiry through our website, we collect your name, email address, project requirements, and optional scheduling parameters. We collect only what is strictly necessary to evaluate and respond to your inquiry.
              </p>
              <p>
                <strong>Zero Selling or Third-Party Sharing:</strong> SKG ENTERPRISES does not sell, rent, or trade your contact information with external marketing brokers or advertisers.
              </p>
              <p>
                <strong>Storage & Security:</strong> Inquiries are safely processed through our verified server endpoints with TLS encryption in transit. Content is sanitized against script injection and access is restricted solely to authorized project reviewers.
              </p>
              <p>
                <strong>Your Rights:</strong> You may request deletion or inspection of your submitted inquiry data at any time by emailing us at{' '}
                <a href="mailto:hello@skgenterprises.com" className="text-cyan-400 underline">
                  hello@skgenterprises.com
                </a>.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FFAA18] uppercase tracking-wider mb-2">
              <FileText className="w-4 h-4 text-[#FFAA18]" />
              <span>SKG Enterprises · Working Terms</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {lang === 'ne' ? 'सेवाका सर्तहरू (Terms of Service)' : 'Terms of Service'}
            </h3>
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                <strong>General Scope:</strong> This website serves as the official digital introduction and inquiry portal for SKG ENTERPRISES. All exploratory services and concepts described represent technical capabilities and are subject to formal mutual agreement.
              </p>
              <p>
                <strong>Project Agreements:</strong> Any commissioned software development, website build, or consulting engagement is governed by an explicit project specification statement of work (SOW) defining clear deliverables, milestones, and costs.
              </p>
              <p>
                <strong>Intellectual Property:</strong> Demonstrations, architectural designs, and proprietary concept prototypes published on this domain remain the intellectual property of SKG ENTERPRISES unless explicitly commissioned and transferred to a client.
              </p>
              <p>
                <strong>Jurisdiction:</strong> SKG ENTERPRISES operates out of Lalitpur, Nepal, and adheres to relevant trade and digital laws under the jurisdiction of Nepal, while accommodating international client contracting standards.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-6 border-t border-slate-800 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
