import React from 'react';
import { Search, PenTool, Code, Rocket, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface ProcessSectionProps {
  lang: Language;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ lang }) => {
  const t = translations[lang];

  const steps = [
    {
      number: '01',
      title: t.process.step1.title,
      desc: t.process.step1.desc,
      deliverable: t.process.step1.deliverable,
      icon: <Search className="w-6 h-6 text-cyan-400" />,
    },
    {
      number: '02',
      title: t.process.step2.title,
      desc: t.process.step2.desc,
      deliverable: t.process.step2.deliverable,
      icon: <PenTool className="w-6 h-6 text-blue-400" />,
    },
    {
      number: '03',
      title: t.process.step3.title,
      desc: t.process.step3.desc,
      deliverable: t.process.step3.deliverable,
      icon: <Code className="w-6 h-6 text-emerald-400" />,
    },
    {
      number: '04',
      title: t.process.step4.title,
      desc: t.process.step4.desc,
      deliverable: t.process.step4.deliverable,
      icon: <Rocket className="w-6 h-6 text-[#FFAA18]" />,
    },
  ];

  return (
    <section id="process" className="py-20 bg-[#061120] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
            {t.process.kicker}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {t.process.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            {t.process.subtitle}
          </p>
        </div>

        {/* 4 Process Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-[#0B1B32] border border-slate-800 hover:border-cyan-500/30 transition-all duration-200 flex flex-col justify-between group relative"
            >
              <div>
                {/* Step Number & Icon Header */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-3xl font-mono font-extrabold text-slate-600 group-hover:text-cyan-400 transition-colors">
                    {step.number}
                  </span>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-slate-700 transition-colors">
                    {step.icon}
                  </div>
                </div>

                {/* Step Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {step.desc}
                </p>
              </div>

              {/* Step Key Deliverable */}
              <div className="pt-4 border-t border-slate-800/80">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Deliverable:
                </div>
                <div className="text-xs font-medium text-slate-200">
                  {step.deliverable}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Commitment note */}
        <div className="mt-12 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center max-w-2xl mx-auto">
          <p className="text-xs text-slate-400">
            <span className="text-cyan-400 font-semibold">Honest Delivery Guarantee:</span> We never quote rigid deadlines before analyzing your technical specifications, ensuring no surprise compromises.
          </p>
        </div>
      </div>
    </section>
  );
};
