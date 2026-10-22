import React, { useState } from 'react';
import { ArrowRight, Sparkles, X, Check, FlaskConical } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface FutureProductsSectionProps {
  lang: Language;
  onExpressInterest: (productName: string) => void;
}

export const FutureProductsSection: React.FC<FutureProductsSectionProps> = ({
  lang,
  onExpressInterest,
}) => {
  const [labModalOpen, setLabModalOpen] = useState(false);
  const t = translations[lang];

  return (
    <section id="products" className="py-20 bg-[#061120] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0B1B32] to-[#071426] border border-cyan-500/20 relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Copy & Value Proposition */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-xs font-semibold text-cyan-300 mb-4">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>{t.products.badge}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                {t.products.title}
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
                {t.products.subtitle}
              </p>

              {/* R&D Notice */}
              <p className="text-xs text-slate-400 mb-8 border-l-2 border-[#FFAA18] pl-3 py-0.5">
                {t.products.honestNote}
              </p>

              {/* Action */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setLabModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#087BFF] to-[#21D4F4] hover:from-[#0066e6] hover:to-[#12c4e4] rounded-xl shadow-md shadow-blue-900/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <span>{t.products.exploreBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Holographic Cube Visual */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md rounded-2xl overflow-hidden border border-cyan-400/20 shadow-2xl bg-[#071426] group">
                <img
                  src="/assets/images/skg_future_products_cube_1792650949239.jpg"
                  alt="Futuristic glowing holographic SKG tech cube on pedestal"
                  className="w-full h-72 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white tracking-wide">
                    SKG Concept Lab
                  </span>
                  <span className="text-cyan-400 font-mono text-[11px]">
                    IN ACTIVE R&D
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Concept Lab Modal */}
      {labModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0B1B32] border border-cyan-500/30 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setLabModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>SKG Research & Concept Lab</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              {t.products.title}
            </h3>

            <p className="text-sm text-slate-300 mb-6">
              {t.products.honestNote}
            </p>

            <div className="space-y-4 mb-6">
              {t.products.activeConcepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="text-base font-bold text-white">
                      {concept.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#FFAA18] px-2 py-0.5 rounded bg-[#FFAA18]/10 border border-[#FFAA18]/20">
                      {concept.status}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-cyan-300 mb-2">
                    {concept.tagline}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {concept.description}
                  </p>
                  <button
                    onClick={() => {
                      setLabModalOpen(false);
                      onExpressInterest(concept.name);
                    }}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded py-0.5"
                  >
                    <span>Express Early Interest or Collaborate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                onClick={() => setLabModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
