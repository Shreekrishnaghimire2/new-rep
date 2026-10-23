import React, { useState, useEffect } from 'react';
import { Language, PageId } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { FutureProductsSection } from './components/FutureProductsSection';
import { ProcessSection } from './components/ProcessSection';
import { ProjectsSection } from './components/ProjectsSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectEstimatorModal } from './components/ProjectEstimatorModal';
import { LegalModals } from './components/LegalModals';
import { AdminPanel } from './components/AdminPanel';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('skg_lang');
      return saved === 'ne' ? 'ne' : 'en';
    } catch {
      return 'en';
    }
  });

  // Current active page state (Multi-page view switching + direct /admin pathname support)
  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    try {
      const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
      if (pathname === 'admin' || pathname.startsWith('admin/')) {
        return 'admin';
      }
      const hash = window.location.hash.replace('#', '') as PageId;
      const validPages: PageId[] = [
        'home',
        'services',
        'products',
        'projects',
        'process',
        'about',
        'contact',
        'admin',
      ];
      if (validPages.includes(pathname as PageId)) {
        return pathname as PageId;
      }
      return validPages.includes(hash) ? hash : 'home';
    } catch {
      return 'home';
    }
  });

  const [estimatorOpen, setEstimatorOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);
  const [preselectedService, setPreselectedService] = useState<string>('');

  // Sync document language attribute and local storage
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('skg_lang', lang);
    } catch (err) {
      console.warn('LocalStorage unavailable for language persistence:', err);
    }
  }, [lang]);

  // Handle URL pathname, hash changes, and browser back/forward navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
      if (pathname === 'admin' || pathname.startsWith('admin/')) {
        setCurrentPage('admin');
        return;
      }
      const hash = window.location.hash.replace('#', '') as PageId;
      const validPages: PageId[] = [
        'home',
        'services',
        'products',
        'projects',
        'process',
        'about',
        'contact',
        'admin',
      ];
      if (validPages.includes(pathname as PageId)) {
        setCurrentPage(pathname as PageId);
      } else if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateToPage = (page: PageId) => {
    setCurrentPage(page);
    const targetPath = page === 'home' ? '/' : `/${page}`;
    try {
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ page }, '', targetPath);
      }
    } catch (e) {
      console.debug('History pushState fallback:', e);
    }
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectService = (serviceName: string) => {
    setPreselectedService(serviceName);
    navigateToPage('contact');
  };

  const handleExpressInterest = (productName: string) => {
    setPreselectedService(`Concept Lab Interest: ${productName}`);
    navigateToPage('contact');
  };

  const handleApplyEstimate = (data: {
    serviceCategory: string;
    timeline: string;
    budgetRange: string;
    descriptionSnippet: string;
  }) => {
    setPreselectedService(data.serviceCategory);
    navigateToPage('contact');
  };

  // Helper page labels for breadcrumbs
  const pageTitles: Record<PageId, { en: string; ne: string }> = {
    home: { en: 'Home', ne: 'गृहपृष्ठ' },
    services: { en: 'Our Services', ne: 'हाम्रा सेवाहरू' },
    products: { en: 'Future Products & Concept Lab', ne: 'भविष्यका उत्पादन र अनुसन्धान' },
    projects: { en: 'Projects & Interactive Prototypes', ne: 'परियोजना तथा प्रोटोटाइप' },
    process: { en: 'Working Methodology', ne: 'हाम्रो कार्यप्रक्रिया' },
    about: { en: 'About SKG Enterprises', ne: 'हाम्रो परिचय' },
    contact: { en: 'Project Inquiry & Contact', ne: 'सम्पर्क तथा परियोजना सोधपुछ' },
    admin: { en: 'Admin Management Portal', ne: 'प्रशासक व्यवस्थापन पोर्टल' },
  };

  return (
    <div className="min-h-screen bg-[#071426] text-slate-100 flex flex-col font-sans selection:bg-[#087BFF]/30 selection:text-white">
      {/* Top Navigation Bar with active page tabs */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateToPage}
        lang={lang}
        onLanguageChange={setLang}
        onOpenEstimator={() => setEstimatorOpen(true)}
      />

      {/* Breadcrumb banner on sub-pages */}
      {currentPage !== 'home' && (
        <div className="bg-[#050E1B] border-b border-slate-800/80 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <button
                onClick={() => navigateToPage('home')}
                className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-slate-300"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{lang === 'ne' ? 'गृहपृष्ठ' : 'Home'}</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-cyan-400 font-semibold">
                {pageTitles[currentPage][lang]}
              </span>
            </div>

            <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
              SKG ENTERPRISES · BILINGUAL PORTAL
            </div>
          </div>
        </div>
      )}

      {/* Main Container - Displays ONLY the content for the selected page */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <Hero
            lang={lang}
            onNavigate={navigateToPage}
            onOpenEstimator={() => setEstimatorOpen(true)}
          />
        )}

        {currentPage === 'services' && (
          <ServicesSection
            lang={lang}
            onSelectService={handleSelectService}
          />
        )}

        {currentPage === 'products' && (
          <FutureProductsSection
            lang={lang}
            onExpressInterest={handleExpressInterest}
          />
        )}

        {currentPage === 'projects' && (
          <ProjectsSection
            lang={lang}
            onInquireProject={handleSelectService}
          />
        )}

        {currentPage === 'process' && (
          <ProcessSection lang={lang} />
        )}

        {currentPage === 'about' && (
          <AboutSection lang={lang} />
        )}

        {currentPage === 'contact' && (
          <ContactSection
            lang={lang}
            preselectedService={preselectedService}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPanel
            lang={lang}
            onNavigateHome={() => navigateToPage('home')}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        lang={lang}
        onNavigate={navigateToPage}
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
      />

      {/* Interactive Scope Estimator Modal */}
      <ProjectEstimatorModal
        isOpen={estimatorOpen}
        onClose={() => setEstimatorOpen(false)}
        lang={lang}
        onApplyEstimate={handleApplyEstimate}
      />

      {/* Legal Dialogs (Privacy & Terms) */}
      <LegalModals
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
        lang={lang}
      />
    </div>
  );
}
