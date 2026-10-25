import React, { useState } from 'react';
import {
  Globe2,
  ArrowUpRight,
  Menu,
  X,
  Compass,
  Home,
  Briefcase,
  Layers,
  FlaskConical,
  GitPullRequest,
  Info,
  MessageSquare,
  Newspaper,
} from 'lucide-react';
import { Language, PageId } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenEstimator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  lang,
  onLanguageChange,
  onOpenEstimator,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t.nav.home, icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'services', label: t.nav.services, icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'products', label: t.nav.products, icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: 'projects', label: t.nav.projects, icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'process', label: t.nav.process, icon: <GitPullRequest className="w-3.5 h-3.5" /> },
    { id: 'about', label: t.nav.about, icon: <Info className="w-3.5 h-3.5" /> },
    { id: 'news', label: t.nav.news, icon: <Newspaper className="w-3.5 h-3.5" /> },
    { id: 'contact', label: t.nav.contact, icon: <MessageSquare className="w-3.5 h-3.5" /> },
  ];

  const handlePageClick = (pageId: PageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#071426]/95 backdrop-blur-md border-b border-cyan-500/25 shadow-xl shadow-black/40 w-full max-w-full overflow-x-hidden">
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between gap-2 sm:gap-4 py-2.5 sm:py-3 w-full">
          {/* Brand Logo & Monogram */}
          <button
            onClick={() => handlePageClick('home')}
            className="flex items-center gap-2 sm:gap-3 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-0.5 sm:p-1 shrink-0"
            aria-label="SKG Enterprises Home"
          >
            <img
              src="/logo.png"
              alt="SKG Enterprises Badge"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-lg border border-cyan-400/40 group-hover:border-cyan-400 transition-colors shrink-0 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-sm sm:text-base lg:text-lg font-bold tracking-wider text-white group-hover:text-cyan-300 transition-colors uppercase whitespace-nowrap">
                SKG <span className="text-cyan-400 font-medium text-[11px] sm:text-sm tracking-widest ml-0.5 sm:ml-1">ENTERPRISES</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 tracking-wider hidden sm:block whitespace-nowrap">
                IDEAS <span className="text-[#FFAA18]">→</span> TECH <span className="text-[#FFAA18]">→</span> IMPACT
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-0.5 xl:gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800"
          >
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageClick(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#087BFF] to-[#21D4F4] text-white shadow-sm shadow-cyan-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Language, Estimator & Primary CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Language Switch */}
            <button
              onClick={() => onLanguageChange(lang === 'en' ? 'ne' : 'en')}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-700 hover:border-cyan-400/60 text-[11px] sm:text-xs font-semibold text-slate-200 hover:text-cyan-300 bg-slate-900/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 shrink-0"
              title="Switch Language / भाषा परिवर्तन"
              aria-label={`Switch to ${lang === 'en' ? 'Nepali' : 'English'}`}
            >
              <Globe2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-mono">{lang === 'en' ? 'नेपाली' : 'EN'}</span>
            </button>

            {/* Project Estimator Quick Trigger (Desktop only) */}
            <button
              onClick={onOpenEstimator}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-500 rounded-lg bg-slate-800/40 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Compass className="w-3.5 h-3.5 text-[#FFAA18]" />
              <span>{t.nav.estimator}</span>
            </button>

            {/* Primary Action Button -> Navigates to Contact page */}
            <button
              onClick={() => handlePageClick('contact')}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#087BFF] to-[#21D4F4] hover:from-[#0066e6] hover:to-[#12c4e4] rounded-lg shadow-sm shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 whitespace-nowrap shrink-0"
            >
              <span className="hidden sm:inline">{t.nav.cta}</span>
              <span className="sm:hidden">{lang === 'ne' ? 'सम्पर्क' : 'Quote'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 shrink-0"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Page Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[53px] sm:top-[60px] bottom-0 bg-[#071426]/98 backdrop-blur-2xl z-50 p-4 sm:p-5 overflow-y-auto border-t border-slate-800 shadow-2xl flex flex-col justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 pb-2 mb-1 border-b border-slate-800 flex items-center justify-between">
              <span>Navigation Directory</span>
              <span className="text-cyan-400 font-mono">SKG ENTERPRISES</span>
            </div>

            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageClick(item.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#087BFF]/25 to-[#21D4F4]/20 border border-cyan-400/50 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700/50">
                      Current
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEstimator();
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 rounded-xl hover:text-white"
            >
              <Compass className="w-3.5 h-3.5 text-[#FFAA18]" />
              <span>{t.nav.estimator}</span>
            </button>
            <button
              onClick={() => handlePageClick('contact')}
              className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#087BFF] to-[#21D4F4] rounded-xl shadow-md"
            >
              <span>{t.nav.cta}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <div className="text-center text-[10px] text-slate-500 pt-1">
              Bhainsepati, Lalitpur, Nepal · hello@skgenterprises.com
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

