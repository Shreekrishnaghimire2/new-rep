import React, { useState } from 'react';
import {
  Globe,
  Smartphone,
  Cpu,
  Code2,
  Layers,
  Compass,
  ArrowRight,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { Language, ServiceCategory, ServiceItem } from '../types';
import { translations, serviceItemsData } from '../translations';

interface ServicesSectionProps {
  lang: Language;
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  lang,
  onSelectService,
}) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);
  const t = translations[lang];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-6 h-6 text-cyan-400" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-blue-400" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-emerald-400" />;
      case 'Code2':
        return <Code2 className="w-6 h-6 text-[#FFAA18]" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-purple-400" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-sky-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-cyan-400" />;
    }
  };

  const filteredServices = serviceItemsData.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <section id="services" className="py-8 sm:py-14 lg:py-20 bg-[#071426] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
            {t.services.kicker}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {t.services.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            {t.services.subtitle}
          </p>
        </div>

        {/* Category Filter Buttons (Functional Segmented Control) */}
        <div className="flex flex-wrap items-center gap-2 mb-10 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 w-fit">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-[#087BFF] to-[#21D4F4] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.services.tabs.all}
          </button>
          <button
            onClick={() => setActiveCategory('web')}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              activeCategory === 'web'
                ? 'bg-gradient-to-r from-[#087BFF] to-[#21D4F4] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.services.tabs.web}
          </button>
          <button
            onClick={() => setActiveCategory('ai')}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              activeCategory === 'ai'
                ? 'bg-gradient-to-r from-[#087BFF] to-[#21D4F4] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.services.tabs.ai}
          </button>
          <button
            onClick={() => setActiveCategory('custom')}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              activeCategory === 'custom'
                ? 'bg-gradient-to-r from-[#087BFF] to-[#21D4F4] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.services.tabs.custom}
          </button>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const title = lang === 'ne' ? service.nepaliTitle : service.title;
            const desc = lang === 'ne' ? service.nepaliDescription : service.description;
            const benefit = lang === 'ne' ? service.nepaliBusinessBenefit : service.businessBenefit;
            const deliverables = lang === 'ne' ? service.nepaliDeliverables : service.deliverables;

            return (
              <div
                key={service.id}
                className="group p-6 rounded-2xl bg-[#0B1B32] border border-slate-800 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/20 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Icon & Readiness */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-slate-700 transition-colors">
                      {getIcon(service.icon)}
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">
                      {service.readiness === 'available'
                        ? t.services.readinessAvailable
                        : t.services.readinessCustom}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {desc}
                  </p>

                  {/* Business Benefit Callout */}
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/90 mb-4">
                    <div className="text-[11px] font-semibold text-[#FFAA18] uppercase tracking-wider mb-1">
                      {t.services.keyBenefits}
                    </div>
                    <p className="text-xs text-slate-300 leading-normal">
                      {benefit}
                    </p>
                  </div>

                  {/* Deliverables Checklist Preview */}
                  <ul className="space-y-1.5 mb-6">
                    {deliverables.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveModalService(service)}
                    className="text-xs font-medium text-slate-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded py-1"
                  >
                    {t.services.viewDetails}
                  </button>

                  <button
                    onClick={() => onSelectService(service.title)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <span>{t.services.inquireService}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Details Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0B1B32] border border-cyan-500/30 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label={t.services.closeModal}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                {getIcon(activeModalService.icon)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {lang === 'ne' ? activeModalService.nepaliTitle : activeModalService.title}
                </h3>
                <span className="text-xs text-cyan-400 font-medium">
                  {activeModalService.readiness === 'available'
                    ? t.services.readinessAvailable
                    : t.services.readinessCustom}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {lang === 'ne' ? activeModalService.nepaliDescription : activeModalService.description}
            </p>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 mb-6">
              <h4 className="text-xs font-semibold text-[#FFAA18] uppercase tracking-wider mb-2">
                {t.services.keyBenefits}
              </h4>
              <p className="text-sm text-slate-200">
                {lang === 'ne' ? activeModalService.nepaliBusinessBenefit : activeModalService.businessBenefit}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {t.services.deliverablesTitle}
              </h4>
              <ul className="space-y-2.5">
                {(lang === 'ne'
                  ? activeModalService.nepaliDeliverables
                  : activeModalService.deliverables
                ).map((del, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveModalService(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                {t.services.closeModal}
              </button>
              <button
                onClick={() => {
                  const serviceName = activeModalService.title;
                  setActiveModalService(null);
                  onSelectService(serviceName);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#087BFF] to-[#21D4F4] rounded-lg hover:from-[#0066e6] hover:to-[#12c4e4] transition-all shadow-sm"
              >
                {t.services.inquireService}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
