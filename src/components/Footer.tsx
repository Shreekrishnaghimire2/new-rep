import React from 'react';
import { ArrowUp, Mail, MapPin, Globe, ShieldCheck, Lock } from 'lucide-react';
import { Language, PageId } from '../types';
import { translations } from '../translations';

interface FooterProps {
  lang: Language;
  onNavigate: (page: PageId) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onNavigate,
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const t = translations[lang];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050D1A] text-slate-400 text-xs border-t border-slate-800/90 py-8 relative mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tier 1: Horizontal Brand & Inline Page Navigation Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-800/80">
          {/* Brand Lockup */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg group shrink-0"
          >
            <img
              src="/logo.png"
              alt="SKG Enterprises"
              className="w-9 h-9 object-contain rounded-lg border border-cyan-400/30 group-hover:border-cyan-400 transition-colors"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
              <span className="text-sm sm:text-base font-bold text-white tracking-wider block">
                SKG <span className="text-cyan-400 font-medium text-xs tracking-widest ml-1">ENTERPRISES</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider">
                IDEAS <span className="text-[#FFAA18]">→</span> TECH <span className="text-[#FFAA18]">→</span> IMPACT
              </span>
            </div>
          </button>

          {/* Horizontal Navigation Links */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-300">
            <button
              onClick={() => handleNav('home')}
              className="hover:text-cyan-400 transition-colors py-1"
            >
              {t.nav.home}
            </button>
            <span aria-hidden="true" className="text-slate-700 hidden sm:inline">·</span>
            <button
              onClick={() => handleNav('services')}
              className="hover:text-cyan-400 transition-colors py-1"
            >
              {t.nav.services}
            </button>
            <span aria-hidden="true" className="text-slate-700 hidden sm:inline">·</span>
            <button
              onClick={() => handleNav('products')}
              className="hover:text-cyan-400 transition-colors py-1"
            >
              {t.nav.products}
            </button>
            <span aria-hidden="true" className="text-slate-700 hidden sm:inline">·</span>
            <button
              onClick={() => handleNav('projects')}
              className="hover:text-cyan-400 transition-colors py-1"
            >
              {t.nav.projects}
            </button>
            <span aria-hidden="true" className="text-slate-700 hidden sm:inline">·</span>
            <button
              onClick={() => handleNav('process')}
              className="hover:text-cyan-400 transition-colors py-1"
            >
              {t.nav.process}
            </button>
            <span aria-hidden="true" className="text-slate-700 hidden sm:inline">·</span>
            <button
              onClick={() => handleNav('about')}
              className="hover:text-cyan-400 transition-colors py-1"
            >
              {t.nav.about}
            </button>
            <span aria-hidden="true" className="text-slate-700 hidden sm:inline">·</span>
            <button
              onClick={() => handleNav('news')}
              className="hover:text-cyan-400 transition-colors py-1"
            >
              {t.nav.news}
            </button>
            <span aria-hidden="true" className="text-slate-700 hidden sm:inline">·</span>
            <button
              onClick={() => handleNav('contact')}
              className="hover:text-cyan-400 transition-colors py-1"
            >
              {t.nav.contact}
            </button>
          </nav>
        </div>

        {/* Tier 2: Horizontal Geo, Location & Verified Contact Bar */}
        <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-6 py-4 border-b border-slate-800/60 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Bhainsepati, Lalitpur, Bagmati, Nepal (27.6588° N, 85.3082° E)</span>
            </div>
            <span aria-hidden="true" className="text-slate-700 hidden md:inline">|</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <a href="mailto:hello@skgenterprises.com" className="hover:text-white transition-colors">
                hello@skgenterprises.com
              </a>
            </div>
            <span aria-hidden="true" className="text-slate-700 hidden md:inline">|</span>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#FFAA18] shrink-0" />
              <span>Nepal & International Client Services</span>
            </div>
          </div>

          <div className="text-slate-400 italic text-[11px]">
            {t.footer.tagline}
          </div>
        </div>

        {/* Tier 3: Horizontal Copyright, Legal Policies & Back to Top */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} SKG ENTERPRISES. {t.footer.rights}</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={onOpenPrivacy}
              className="hover:text-white transition-colors underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
            >
              {t.footer.privacy}
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={onOpenTerms}
              className="hover:text-white transition-colors underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
            >
              {t.footer.terms}
            </button>
            <span className="text-slate-400">{t.footer.builtWith}</span>
            <button
              onClick={() => handleNav('admin')}
              className="text-slate-700 hover:text-slate-500 transition-colors p-1 rounded inline-flex items-center ml-1"
              title="Staff Portal (type 'admin' anywhere to open)"
              aria-label="Staff Portal"
            >
              <Lock className="w-2.5 h-2.5" />
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 shrink-0"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
