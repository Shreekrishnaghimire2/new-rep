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
  Lock,
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
    { id: 'contact', label: t.nav.contact, icon: <MessageSquare className="w-3.5 h-3.5" /> },
  ];

  const handlePageClick = (pageId: PageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#071426]/95 backdrop-blur-md border-b border-cyan-500/25 shadow-xl shadow-black/40">
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Brand Logo & Monogram */}
          <button
            onClick={() => handlePageClick('home')}
            className="flex items-center gap-3 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1 shrink-0"
            aria-label="SKG Enterprises Home"
          >
            <img
              src="/logo.png"
              alt="SKG Enterprises Badge"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-lg border border-cyan-400/40 group-hover:border-cyan-400 transition-colors shrink-0 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-wider text-white group-hover:text-cyan-300 transition-colors uppercase whitespace-nowrap">
                SKG <span className="text-cyan-400 font-medium text-xs sm:text-sm tracking-widest ml-1">ENTERPRISES</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider hidden sm:block whitespace-nowrap">
                IDEAS <span className="text-[#FFAA18]">→</span> TECH <span className="text-[#FFAA18]">→</span> IMPACT
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1 xl:gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800"
          >
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
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
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Switch */}
            <button
              onClick={() => onLanguageChange(lang === 'en' ? 'ne' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-400/60 text-xs font-semibold text-slate-200 hover:text-cyan-300 bg-slate-900/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              title="Switch Language / भाषा परिवर्तन"
              aria-label={`Switch to ${lang === 'en' ? 'Nepali' : 'English'}`}
            >
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'en' ? 'नेपाली' : 'EN'}</span>
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => handlePageClick('admin')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                currentPage === 'admin'
                  ? 'bg-amber-500/20 border-amber-400/80 text-amber-300'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
              }`}
              title="SKG Admin Portal"
              aria-label="Open Admin Management Portal"
            >
              <Lock className="w-3.5 h-3.5 text-[#FFAA18]" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Project Estimator Quick Trigger */}
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
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#087BFF] to-[#21D4F4] hover:from-[#0066e6] hover:to-[#12c4e4] rounded-lg shadow-sm shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 whitespace-nowrap shrink-0"
            >
              <span>{t.nav.cta}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Page Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Secondary Mobile/Tablet Horizontal Scrolling Navigation Strip */}
        <div className="md:hidden pb-2.5 pt-0.5 overflow-x-auto no-scrollbar border-t border-slate-800/60">
          <div className="flex items-center gap-1.5 min-w-max">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageClick(item.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-semibold'
                      : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expanded Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[110px] bg-[#071426]/98 backdrop-blur-2xl z-50 p-6 overflow-y-auto border-t border-slate-800 shadow-2xl">
          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 pb-2 mb-2 border-b border-slate-800">
              Select Page View
            </div>

            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageClick(item.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#087BFF]/20 to-[#21D4F4]/20 border border-cyan-400/50 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                      Active
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 mt-2 border-t border-slate-800 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEstimator();
                }}
                className="w-full text-center py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 rounded-xl hover:text-white"
              >
                {t.nav.estimator}
              </button>
              <button
                onClick={() => handlePageClick('contact')}
                className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#087BFF] to-[#21D4F4] rounded-xl shadow-md"
              >
                <span>{t.nav.cta}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
