import React, { useState } from 'react';
import { X, Check, ArrowRight, Compass, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface ProjectEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onApplyEstimate: (scopeData: {
    serviceCategory: string;
    timeline: string;
    budgetRange: string;
    descriptionSnippet: string;
  }) => void;
}

export const ProjectEstimatorModal: React.FC<ProjectEstimatorModalProps> = ({
  isOpen,
  onClose,
  lang,
  onApplyEstimate,
}) => {
  const [solutionType, setSolutionType] = useState('web');
  const [priority, setPriority] = useState('speed');
  const [timeline, setTimeline] = useState('1m');

  if (!isOpen) return null;

  const t = translations[lang];

  // Deterministic calculation logic
  const solutionNames: Record<string, string> = {
    web: 'Web Development & Presence',
    ai: 'AI & Workflow Automation',
    app: 'Mobile App / Custom Portal',
    consulting: 'Technology Advisory & Strategy',
  };

  const calculateEstimate = () => {
    let estWeeks = '3 – 5 weeks';
    let budgetBand = '$1,000 – $3,000 / रु १ – ३ लाख';
    let architecture = 'Modular React/Node.js architecture with clean SEO and sub-second loading.';

    if (solutionType === 'web') {
      if (priority === 'speed') {
        estWeeks = '2 – 3 weeks';
        budgetBand = 'Under $1,000 / रु १ लाख मुनि';
        architecture = 'High-speed static frontend architecture optimized for conversion and local search.';
      } else {
        estWeeks = '4 – 6 weeks';
        budgetBand = '$1,000 – $3,000 / रु १ – ३ लाख';
        architecture = 'Bilingual interactive corporate portal with dynamic content structure and analytics.';
      }
    } else if (solutionType === 'ai') {
      estWeeks = '3 – 6 weeks';
      budgetBand = '$1,000 – $3,000 / रु १ – ३ लाख';
      architecture = 'Direct tool integration pipeline connecting internal chat/CRM to structured automation triggers.';
    } else if (solutionType === 'app') {
      estWeeks = '6 – 10 weeks';
      budgetBand = '$3,000 – $10,000 / रु ३ – १० लाख';
      architecture = 'Cross-platform mobile and web backend architecture with secure role-based access.';
    } else if (solutionType === 'consulting') {
      estWeeks = '1 – 2 weeks';
      budgetBand = 'Under $1,000 / रु १ लाख मुनि';
      architecture = 'In-depth architecture audit, stack recommendations, and milestone scoping brief.';
    }

    return { estWeeks, budgetBand, architecture };
  };

  const estimate = calculateEstimate();

  const handleApply = () => {
    const category = solutionNames[solutionType];
    const snippet = `[Project Brief Generated via Estimator]\nSolution Type: ${category}\nPriority: ${priority}\nEstimated Timeline: ${estimate.estWeeks}\nRecommended Strategy: ${estimate.architecture}`;

    onApplyEstimate({
      serviceCategory: category,
      timeline: estimate.estWeeks,
      budgetRange: estimate.budgetBand,
      descriptionSnippet: snippet,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#0B1B32] border border-cyan-500/30 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label={t.estimator.close}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4 text-[#FFAA18]" />
          <span>Interactive Scope Assistant</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          {t.estimator.modalTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mb-6">
          {t.estimator.modalSubtitle}
        </p>

        {/* Question 1: Solution Type */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-slate-200 block mb-2">
            {t.estimator.q1}
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { id: 'web', label: 'Website / Web App' },
              { id: 'ai', label: 'AI & Automation' },
              { id: 'app', label: 'Mobile / Custom Portal' },
              { id: 'consulting', label: 'Strategy / Consulting' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSolutionType(opt.id)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  solutionType === opt.id
                    ? 'bg-cyan-950/60 border-cyan-400 text-white font-semibold'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Priority */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-slate-200 block mb-2">
            {t.estimator.q2}
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { id: 'speed', label: 'Speed & Quick Delivery' },
              { id: 'quality', label: 'Custom Architecture' },
              { id: 'scalability', label: 'High Scalability' },
              { id: 'budget', label: 'Budget Efficiency' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPriority(opt.id)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  priority === opt.id
                    ? 'bg-cyan-950/60 border-cyan-400 text-white font-semibold'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 mb-6">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
            {t.estimator.summaryTitle}
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">{t.estimator.estDuration}</span>
              <span className="font-mono font-bold text-white">{estimate.estWeeks}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Estimated Budget Range:</span>
              <span className="font-mono font-bold text-[#FFAA18]">{estimate.budgetBand}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 text-slate-300">
              <span className="text-slate-400 block mb-0.5">{t.estimator.estApproach}</span>
              <p className="leading-relaxed">{estimate.architecture}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            {t.estimator.close}
          </button>
          <button
            onClick={handleApply}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#087BFF] to-[#21D4F4] hover:from-[#0066e6] hover:to-[#12c4e4] text-white text-xs font-semibold shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <span>{t.estimator.applyToForm}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
