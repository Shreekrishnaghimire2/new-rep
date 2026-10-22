import React from 'react';
import { ArrowUp, Mail, MapPin } from 'lucide-react';
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
    <footer className="bg-[#050D1A] text-slate-400 text-xs border-t border-slate-800/80 pt-16 pb-12 relative mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
            >
              <img
                src="/logo.png"
                alt="SKG Enterprises"
                className="w-10 h-10 object-contain rounded-lg border border-cyan-400/30"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-base font-bold text-white tracking-wider block">
                  SKG <span className="text-cyan-400 font-medium text-xs tracking-widest ml-1">ENTERPRISES</span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-wider">
                  IDEAS <span className="text-[#FFAA18]">→</span> TECH <span className="text-[#FFAA18]">→</span> IMPACT
                </span>
              </div>
            </button>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>

            <div className="text-xs text-slate-400 space-y-1 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Bhainsepati, Lalitpur, Nepal</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <a
                  href="mailto:hello@skgenterprises.com"
                  className="hover:text-white transition-colors"
                >
                  hello@skgenterprises.com
                </a>
              </div>
            </div>
          </div>

          {/* Dedicated Page Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  {t.nav.services}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('products')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  {t.nav.products}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('projects')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  {t.nav.projects}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('process')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  {t.nav.process}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  {t.nav.contact}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('admin')}
                  className="hover:text-amber-400 transition-colors text-left text-amber-400/90 font-medium"
                >
                  {lang === 'ne' ? 'प्रशासक पोर्टल' : 'Admin Portal'}
                </button>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              {t.footer.servicesLinks}
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Web Development & Experiences
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  AI & Workflow Automation
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Mobile App Engineering
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Custom Digital Software & Portals
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  UI/UX Design & Usability Systems
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Technology Advisory & Strategy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span>© {new Date().getFullYear()} SKG ENTERPRISES. {t.footer.rights}</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenPrivacy}
              className="hover:text-white transition-colors underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
            >
              {t.footer.privacy}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenTerms}
              className="hover:text-white transition-colors underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
            >
              {t.footer.terms}
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
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
