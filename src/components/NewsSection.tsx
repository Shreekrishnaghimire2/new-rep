import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Calendar,
  User,
  Tag,
  ArrowRight,
  Pin,
  X,
  ExternalLink,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import { Language, CompanyNews } from '../types';
import { translations } from '../translations';

interface NewsSectionProps {
  lang: Language;
}

const FALLBACK_NEWS: CompanyNews[] = [
  {
    id: 'NEWS-2026-001',
    title: 'SKG ENTERPRISES Unveils Dedicated AI & Web Systems Hub in Bhainsepati, Lalitpur',
    nepaliTitle: 'एसकेजी इन्टरप्राइजेजद्वारा भैंसेपाटी, ललितपुरमा एआई तथा वेब प्रणाली हबको अनावरण',
    category: 'Company News',
    summary: 'Expanding digital capabilities to provide direct engineering consultancy, production-grade web systems, and intelligent workflow automation for businesses across Nepal and global markets.',
    nepaliSummary: 'नेपाल तथा अन्तर्राष्ट्रिय बजारका व्यवसायहरूका लागि आधुनिक वेब प्रणाली तथा बौद्धिक स्वचालन परामर्श सेवा विस्तार।',
    content: 'SKG ENTERPRISES officially announces the operational expansion of its technology hub located in Bhainsepati, Lalitpur, Bagmati Province. Under the technical leadership of founder Shreekrishna Ghimire, the firm delivers specialized engineering in full-stack cloud applications, high-performance web architecture, and localized AI automation pipelines. Organizations interested in exploratory scoping can submit verified inquiries directly through the portal.',
    author: 'Editorial Desk',
    publishedAt: '2026-10-25T08:00:00.000Z',
    pinned: true,
  },
  {
    id: 'NEWS-2026-002',
    title: 'Launch of Himalayan Logistics & Fleet Telemetry Simulator for Mountain Transport',
    nepaliTitle: 'हिमाली ढुवानी तथा फ्लीट टेलिमेट्री सिम्युलेटर सार्वजनिक',
    category: 'Release',
    summary: 'An interactive operational simulator calculating real-time mountain corridor payload restrictions, elevation gradients, and fuel burn between Kathmandu, Pokhara, and Mustang.',
    nepaliSummary: 'काठमाडौँ, पोखरा र मुस्ताङबीचको हिमाली सडक उचाइ तथा इन्धन खपत मापन गर्ने अन्तरक्रियात्मक सिम्युलेटर।',
    content: 'Transportation in Nepal requires engineering tailored to high-altitude topography. The new SKG Logistics Simulator models mountain transit corridors with verified weight ratings and fuel estimates. The prototype demonstrates SKG\'s commitment to solving real-world regional challenges with software.',
    author: 'Engineering Team',
    publishedAt: '2026-10-20T10:30:00.000Z',
    pinned: true,
  },
  {
    id: 'NEWS-2026-003',
    title: 'Nepal Inland Revenue (IRD) VAT & Tax Withholding Module Enters Pilot Testing',
    nepaliTitle: 'नेपाल आन्तरिक राजस्व १३% भ्याट तथा टीडीएस मोड्युल परीक्षणमा',
    category: 'Announcement',
    summary: 'Automated 13% VAT calculation and tiered TDS deduction engine tailored to commercial billing practices and compliance standards in Nepal.',
    nepaliSummary: 'नेपालको वाणिज्य नियम अनुरूप १३% मूल्य अभिवृद्धि कर तथा टीडीएस गणना गर्ने स्वचालन प्रणाली।',
    content: 'Designed to eliminate manual bookkeeping discrepancies, the SKG Tax Ledger module accurately computes 13% VAT alongside statutory TDS brackets (1.5%, 10%, 15%) for goods, services, and high-bracket contracting.',
    author: 'Solutions Team',
    publishedAt: '2026-10-15T09:15:00.000Z',
    pinned: false,
  },
];

export const NewsSection: React.FC<NewsSectionProps> = ({ lang }) => {
  const t = translations[lang];
  const [news, setNews] = useState<CompanyNews[]>(FALLBACK_NEWS);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<CompanyNews | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.news) && data.news.length > 0) {
          setNews(data.news);
          return;
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['all', 'Company News', 'Release', 'Announcement'];

  const filteredNews = news.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleShare = (article: CompanyNews) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${article.title} - SKG Enterprises: https://skgenterprises.com/news#${article.id}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section id="news" className="py-8 sm:py-14 lg:py-20 bg-[#071426] relative border-t border-slate-800/80 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
            <Newspaper className="w-4 h-4 text-cyan-400" />
            <span>{t.news.kicker}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            {t.news.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.news.subtitle}
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#087BFF] to-[#21D4F4] text-white shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat === 'all' ? t.news.allFilter : cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-sm text-slate-400">
            {t.news.noNews}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredNews.map((item) => {
              const displayTitle = lang === 'ne' && item.nepaliTitle ? item.nepaliTitle : item.title;
              const displaySummary = lang === 'ne' && item.nepaliSummary ? item.nepaliSummary : item.summary;

              return (
                <article
                  key={item.id}
                  className={`rounded-2xl p-5 sm:p-6 bg-[#0B1B32] border transition-all duration-200 flex flex-col justify-between group ${
                    item.pinned
                      ? 'border-cyan-500/40 shadow-lg shadow-cyan-950/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Header Row: Category & Pin */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-mono font-semibold text-cyan-300 px-2.5 py-0.5 rounded-lg bg-cyan-950/60 border border-cyan-800/40">
                        {item.category}
                      </span>
                      {item.pinned && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#FFAA18] bg-[#FFAA18]/10 px-2 py-0.5 rounded border border-[#FFAA18]/30">
                          <Pin className="w-3 h-3 fill-current" />
                          <span>{t.news.pinnedBadge}</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2.5 leading-snug">
                      {displayTitle}
                    </h3>

                    {/* Published Date & Author */}
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-4 pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.author}</span>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 line-clamp-3">
                      {displaySummary}
                    </p>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => setActiveArticle(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
                    >
                      <span>{t.news.readMore}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={() => handleShare(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Share link"
                      aria-label="Share article link"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Read Full Article Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#0B1B32] border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label={t.news.closeArticle}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-semibold text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  {activeArticle.category}
                </span>
                {activeArticle.pinned && (
                  <span className="text-[10px] font-semibold text-[#FFAA18] bg-[#FFAA18]/10 px-2 py-0.5 rounded border border-[#FFAA18]/30">
                    {t.news.pinnedBadge}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug">
                {lang === 'ne' && activeArticle.nepaliTitle ? activeArticle.nepaliTitle : activeArticle.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-6 pb-4 border-b border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{new Date(activeArticle.publishedAt).toLocaleDateString(undefined, { dateStyle: 'full' })}</span>
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeArticle.author}</span>
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="font-mono text-cyan-400 text-[11px]">{activeArticle.id}</span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line mb-6">
                <p className="font-semibold text-cyan-100 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  {lang === 'ne' && activeArticle.nepaliSummary ? activeArticle.nepaliSummary : activeArticle.summary}
                </p>
                <div className="pt-2 text-slate-300 leading-relaxed">
                  {activeArticle.content}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="text-slate-400">
                  SKG ENTERPRISES · Bhainsepati, Lalitpur, Nepal
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
                >
                  {t.news.closeArticle}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
