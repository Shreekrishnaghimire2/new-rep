import React from 'react';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Compass,
  Briefcase,
  Layers,
  FlaskConical,
  GitPullRequest,
  Info,
  MessageSquare,
} from 'lucide-react';
import { Language, PageId } from '../types';
import { translations } from '../translations';

interface HeroProps {
  lang: Language;
  onNavigate: (page: PageId) => void;
  onOpenEstimator: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onNavigate,
  onOpenEstimator,
}) => {
  const t = translations[lang];

  return (
    <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-20 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#087BFF]/15 via-[#21D4F4]/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#FFAA18]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-column Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center mb-16">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Clean unboxed kicker with dot separator */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-cyan-400 mb-4">
              <span>SKG ENTERPRISES</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400 font-medium">NEPAL & GLOBAL</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-white tracking-tight leading-[1.12] mb-6 text-balance">
              {lang === 'en' ? (
                <>
                  Turning Ideas into{' '}
                  <span className="bg-gradient-to-r from-[#21D4F4] via-[#087BFF] to-[#FFAA18] bg-clip-text text-transparent">
                    Technology
                  </span>{' '}
                  for a Better Tomorrow
                </>
              ) : (
                <>
                  विचारहरूलाई{' '}
                  <span className="bg-gradient-to-r from-[#21D4F4] via-[#087BFF] to-[#FFAA18] bg-clip-text text-transparent">
                    प्रविधिमा
                  </span>{' '}
                  बदल्दै, उन्नत भविष्यको लागि
                </>
              )}
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mb-8">
              {t.hero.subheadline}
            </p>

            {/* CTA Action Cluster */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {/* Primary CTA -> Goes to Contact Page */}
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[#087BFF] to-[#21D4F4] hover:from-[#0066e6] hover:to-[#12c4e4] rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-cyan-400/35 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400 whitespace-nowrap"
              >
                <span>{t.hero.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary CTA -> Goes to Projects Page */}
              <button
                onClick={() => onNavigate('projects')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-500 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 whitespace-nowrap"
              >
                <span>{t.hero.secondaryCta}</span>
              </button>

              {/* Estimator Trigger */}
              <button
                onClick={onOpenEstimator}
                className="inline-flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-medium text-cyan-300 hover:text-cyan-200 hover:bg-cyan-950/30 rounded-xl transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <Compass className="w-4 h-4 text-[#FFAA18]" />
                <span>{t.hero.estimatorCta}</span>
              </button>
            </div>

            {/* Trust statement */}
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span className="text-emerald-400 font-medium">✓ Transparent Scope</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>No Vendor Lock-in</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Production-Grade Quality</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-blue-950/40 bg-[#0B1B32] group">
              {/* Fallback & Image */}
              <img
                src="/assets/images/skg_himalayan_hero_horizon_1792650952403.jpg"
                alt="Visionary horizon facing the majestic Himalayas at golden hour"
                className="w-full h-[360px] sm:h-[440px] lg:h-[460px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Contrast Scrims */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-[#071426]/30 to-transparent opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#071426]/40 via-transparent to-[#071426]/20" />

              {/* Overlay Graphical Callouts */}
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-400/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFAA18]" />
                <span className="text-[11px] font-semibold text-slate-200 tracking-wider">
                  IDEAS <span className="text-cyan-400">→</span> IMPACT
                </span>
              </div>

              {/* Bottom Card Content on Hero Graphic */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white tracking-wide">
                    SKG ENTERPRISES
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Lalitpur, Nepal · Digital Engineering
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-[#FFAA18] font-mono font-semibold">
                    HIGH PERFORMANCE
                  </div>
                  <div className="text-[10px] text-slate-400">
                    WCAG 2.2 AA Compliant
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Proof & Highlights Strip */}
        <div className="pt-8 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 transition-colors">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                {t.hero.badge1}
              </div>
              <div className="text-xs text-slate-400">
                Modern tools & clean architecture
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 transition-colors">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                {t.hero.badge2}
              </div>
              <div className="text-xs text-slate-400">
                Measurable business outcomes
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 transition-colors">
            <div className="p-2.5 rounded-lg bg-[#FFAA18]/10 text-[#FFAA18] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                {t.hero.badge3}
              </div>
              <div className="text-xs text-slate-400">
                Grounded in practical reality
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 transition-colors">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                {t.hero.badge4}
              </div>
              <div className="text-xs text-slate-400">
                Smart automation & AI capabilities
              </div>
            </div>
          </div>
        </div>

        {/* Quick Page Explorer Hub on Home */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-[#0B1B32] to-[#071426] border border-cyan-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white">
                {lang === 'en' ? 'Explore Specific Pages' : 'विशेष पृष्ठहरू अन्वेषण गर्नुहोस्'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en'
                  ? 'Click any page below or use the top navigation bar to view dedicated content.'
                  : 'तलको कुनै पनि पृष्ठ छान्नुहोस् वा माथिको नेभिगेसन बार प्रयोग गर्नुहोस्।'}
              </p>
            </div>
            <div className="text-xs text-cyan-400 font-mono font-semibold">
              7 DEDICATED VIEWS
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: 'services' as PageId,
                title: t.nav.services,
                desc: '6 core capabilities: Web, Mobile, AI Automation, Custom Portals, UI/UX, and Advisory.',
                icon: <Briefcase className="w-5 h-5 text-cyan-400" />,
                badge: 'Capabilities',
              },
              {
                id: 'products' as PageId,
                title: t.nav.products,
                desc: 'Explore the SKG Concept Lab and upcoming R&D digital tools (FlowEngine, DocuLex AI).',
                icon: <FlaskConical className="w-5 h-5 text-purple-400" />,
                badge: 'Concept Lab',
              },
              {
                id: 'projects' as PageId,
                title: t.nav.projects,
                desc: '3 interactive simulators: Mountain Logistics, Nepal VAT Ledger, and Web Architecture.',
                icon: <Layers className="w-5 h-5 text-blue-400" />,
                badge: 'Live Demos',
              },
              {
                id: 'process' as PageId,
                title: t.nav.process,
                desc: 'Our 4-stage delivery process: Discover, Plan, Build, and Launch & Improve.',
                icon: <GitPullRequest className="w-5 h-5 text-emerald-400" />,
                badge: 'Methodology',
              },
              {
                id: 'about' as PageId,
                title: t.nav.about,
                desc: 'Our authentic story, core engineering pillars, and Lalitpur headquarters details.',
                icon: <Info className="w-5 h-5 text-[#FFAA18]" />,
                badge: 'Authentic Story',
              },
              {
                id: 'contact' as PageId,
                title: t.nav.contact,
                desc: 'Submit a verified project inquiry or check status using your tracking reference ID.',
                icon: <MessageSquare className="w-5 h-5 text-cyan-400" />,
                badge: 'Real Inquiry',
              },
            ].map((card) => (
              <button
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left transition-all duration-200 group flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 group-hover:border-slate-600 transition-colors">
                      {card.icon}
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                  <span>Open {card.title} Page</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
