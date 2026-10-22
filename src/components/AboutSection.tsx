import React from 'react';
import { MapPin, Clock, ShieldCheck, HeartHandshake, Award, Target } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface AboutSectionProps {
  lang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <section id="about" className="py-20 bg-[#071426] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Authentic Brand Narrative */}
          <div className="lg:col-span-7">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
              {t.about.kicker}
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
              {t.about.title}
            </h2>

            <div className="space-y-4 text-base text-slate-300 leading-relaxed">
              <p className="text-lg text-white font-medium">
                {t.about.leadParagraph}
              </p>
              <p>{t.about.bodyParagraph1}</p>
              <p>{t.about.bodyParagraph2}</p>
            </div>

            {/* Core Values / Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-800">
              {t.about.pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#0B1B32] border border-slate-800/90"
                >
                  <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFAA18]" />
                    <span>{pillar.title}</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Physical & Operational Reality */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1B32] border border-slate-800 shadow-xl">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
                <img
                  src="/logo.png"
                  alt="SKG Enterprises Badge"
                  className="w-14 h-14 object-contain rounded-xl border border-cyan-400/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-lg font-bold text-white tracking-wide">
                    SKG ENTERPRISES
                  </div>
                  <div className="text-xs text-cyan-400 font-mono">
                    IDEAS → TECHNOLOGY → IMPACT
                  </div>
                </div>
              </div>

              {/* Verified Office Details */}
              <div className="space-y-5">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                      {t.about.locationTitle}
                    </div>
                    <div className="text-sm text-white font-medium">
                      {t.about.locationAddress}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Kathmandu Valley Digital Hub
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                      {t.about.workingHoursTitle}
                    </div>
                    <div className="text-sm text-white font-medium">
                      {t.about.workingHours}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Asynchronous international client support available
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[#FFAA18] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                      Ethics & IP Ownership
                    </div>
                    <div className="text-sm text-white font-medium">
                      100% Client Code Ownership
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      No proprietary locks, full repository handoff upon completion.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
