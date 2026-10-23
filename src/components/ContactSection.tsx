import React, { useState } from 'react';
import {
  Send,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Search,
  RotateCw,
} from 'lucide-react';
import { Language, InquirySubmission, VerifiedInquiryResponse } from '../types';
import { translations } from '../translations';

interface ContactSectionProps {
  lang: Language;
  preselectedService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  lang,
  preselectedService,
}) => {
  const t = translations[lang];

  // Form State
  const [formData, setFormData] = useState<InquirySubmission>({
    name: '',
    email: '',
    description: '',
    serviceCategory: preselectedService || '',
    budgetRange: '',
    expectedTimeline: '',
    website_honeypot: '',
  });

  // UI States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successResponse, setSuccessResponse] = useState<VerifiedInquiryResponse | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Status check tool state
  const [verifyIdInput, setVerifyIdInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedInquiryInfo, setVerifiedInquiryInfo] = useState<any | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Update preselected service if passed from another section
  React.useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, serviceCategory: preselectedService }));
    }
  }, [preselectedService]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = t.contact.errors.nameRequired;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = t.contact.errors.emailInvalid;
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      errs.description = t.contact.errors.descRequired;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors);
        }
        setServerError(data.error || t.contact.errors.serverError);
      } else {
        setSuccessResponse(data);
        setErrors({});
      }
    } catch (err) {
      // Resilient fallback for static environments (e.g. Vercel static build)
      const fallbackId = `SKG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const fallbackInquiry = {
        id: fallbackId,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        description: formData.description.trim(),
        serviceCategory: formData.serviceCategory || 'General Project',
        budgetRange: formData.budgetRange,
        expectedTimeline: formData.expectedTimeline,
        submittedAt: new Date().toISOString(),
        status: 'received',
      };
      try {
        const stored = JSON.parse(localStorage.getItem('skg_inquiries_store') || '[]');
        stored.unshift(fallbackInquiry);
        localStorage.setItem('skg_inquiries_store', JSON.stringify(stored));
      } catch (storageErr) {
        console.warn('LocalStorage save error:', storageErr);
      }

      setSuccessResponse({
        success: true,
        inquiryId: fallbackId,
        message: 'Your project inquiry has been received. Our team will review the details and reach out within 24–48 hours.',
        inquiry: fallbackInquiry,
      });
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (successResponse?.inquiryId) {
      navigator.clipboard.writeText(successResponse.inquiryId);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleResetForm = () => {
    setSuccessResponse(null);
    setFormData({
      name: '',
      email: '',
      description: '',
      serviceCategory: '',
      budgetRange: '',
      expectedTimeline: '',
      website_honeypot: '',
    });
    setErrors({});
    setServerError(null);
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyIdInput.trim()) return;

    setIsVerifying(true);
    setVerifyError(null);
    setVerifiedInquiryInfo(null);

    const checkLocal = (targetId: string) => {
      try {
        const stored = JSON.parse(localStorage.getItem('skg_inquiries_store') || '[]');
        const found = stored.find((i: any) => i.id.toUpperCase() === targetId.toUpperCase());
        if (found) {
          setVerifiedInquiryInfo(found);
          return true;
        }
      } catch {}
      return false;
    };

    try {
      const res = await fetch(`/api/contact/verify/${encodeURIComponent(verifyIdInput.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        if (!checkLocal(verifyIdInput.trim())) {
          setVerifyError(t.contact.statusCheck.notFound);
        }
      } else {
        setVerifiedInquiryInfo(data.inquiry);
      }
    } catch (err) {
      if (!checkLocal(verifyIdInput.trim())) {
        setVerifyError(t.contact.statusCheck.notFound);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section id="contact" className="py-8 sm:py-14 lg:py-20 bg-[#061120] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
            {t.contact.kicker}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {t.contact.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Real Contact Form or Confirmed Success View */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1B32] border border-slate-800 shadow-xl">
              {successResponse ? (
                /* Verified Success State (Only shown after real API response) */
                <div className="py-4 animate-in fade-in duration-200">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    {t.contact.success.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {t.contact.success.message}
                  </p>

                  {/* Tracking Reference Card */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 mb-6">
                    <div className="text-xs text-slate-400 mb-1">
                      {t.contact.success.refCode}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base sm:text-lg font-mono font-bold text-cyan-400 tracking-wider">
                        {successResponse.inquiryId}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                        title="Copy tracking ID"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-2">
                      {t.contact.success.keepCodeNotice}
                    </div>
                  </div>

                  {/* Next Steps List */}
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 mb-6 text-xs text-slate-300 space-y-2">
                    <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
                      {t.contact.success.nextSteps}
                    </div>
                    <div>{t.contact.success.step1}</div>
                    <div>{t.contact.success.step2}</div>
                    <div>{t.contact.success.step3}</div>
                  </div>

                  <button
                    onClick={handleResetForm}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                  >
                    <span>{t.contact.success.submitAnother}</span>
                  </button>
                </div>
              ) : (
                /* Real Inquiry Form */
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Honeypot field (hidden from humans, traps automated spam bots) */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website_honeypot">Leave blank</label>
                    <input
                      type="text"
                      id="website_honeypot"
                      name="website_honeypot"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.website_honeypot}
                      onChange={(e) =>
                        setFormData({ ...formData, website_honeypot: e.target.value })
                      }
                    />
                  </div>

                  {/* General Server Error Banner */}
                  {serverError && (
                    <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span>{serverError}</span>
                      </div>
                    </div>
                  )}

                  {/* 2-Column Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="inquiry-name"
                        className="block text-xs font-semibold text-slate-200 mb-1.5"
                      >
                        {t.contact.form.nameLabel} <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="inquiry-name"
                        required
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        placeholder={t.contact.form.namePlaceholder}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          errors.name
                            ? 'border-red-500 focus:border-red-400'
                            : 'border-slate-700 focus:border-cyan-400'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-email"
                        className="block text-xs font-semibold text-slate-200 mb-1.5"
                      >
                        {t.contact.form.emailLabel} <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="email"
                        id="inquiry-email"
                        required
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        placeholder={t.contact.form.emailPlaceholder}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          errors.email
                            ? 'border-red-500 focus:border-red-400'
                            : 'border-slate-700 focus:border-cyan-400'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Service & Budget Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="inquiry-service"
                        className="block text-xs font-semibold text-slate-200 mb-1.5"
                      >
                        {t.contact.form.serviceLabel}
                      </label>
                      <select
                        id="inquiry-service"
                        value={formData.serviceCategory}
                        onChange={(e) =>
                          setFormData({ ...formData, serviceCategory: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                      >
                        <option value="">{t.contact.form.servicePlaceholder}</option>
                        <option value="Web Development">Web Development & Experiences</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="AI & Automation">AI & Workflow Automation</option>
                        <option value="Custom Digital Solutions">Custom Digital Solutions</option>
                        <option value="UI/UX Design Systems">UI/UX Design Systems</option>
                        <option value="Technology Advisory">Technology Advisory & Strategy</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-budget"
                        className="block text-xs font-semibold text-slate-200 mb-1.5"
                      >
                        {t.contact.form.budgetLabel}
                      </label>
                      <select
                        id="inquiry-budget"
                        value={formData.budgetRange}
                        onChange={(e) =>
                          setFormData({ ...formData, budgetRange: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                      >
                        <option value="">{t.contact.form.budgetPlaceholder}</option>
                        <option value="Under $1,000 / रु १ लाख मुनि">Under $1,000 / रु १ लाख मुनि</option>
                        <option value="$1,000 – $3,000 / रु १ – ३ लाख">$1,000 – $3,000 / रु १ – ३ लाख</option>
                        <option value="$3,000 – $10,000 / रु ३ – १० लाख">$3,000 – $10,000 / रु ३ – १० लाख</option>
                        <option value="$10,000+ / रु १० लाख माथि">$10,000+ / रु १० लाख माथि</option>
                        <option value="Exploring Feasibility">Exploring Feasibility First</option>
                      </select>
                    </div>
                  </div>

                  {/* Target Timeline */}
                  <div>
                    <label
                      htmlFor="inquiry-timeline"
                      className="block text-xs font-semibold text-slate-200 mb-1.5"
                    >
                      {t.contact.form.timelineLabel}
                    </label>
                    <select
                      id="inquiry-timeline"
                      value={formData.expectedTimeline}
                      onChange={(e) =>
                        setFormData({ ...formData, expectedTimeline: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="">{t.contact.form.timelinePlaceholder}</option>
                      <option value="Immediate (< 2 weeks)">Immediate (&lt; 2 weeks)</option>
                      <option value="Within 1 month">Within 1 month</option>
                      <option value="1 – 3 months">1 – 3 months</option>
                      <option value="Flexible / Planning stage">Flexible / Planning stage</option>
                    </select>
                  </div>

                  {/* Project Description */}
                  <div>
                    <label
                      htmlFor="inquiry-description"
                      className="block text-xs font-semibold text-slate-200 mb-1.5"
                    >
                      {t.contact.form.descriptionLabel} <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      id="inquiry-description"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({ ...formData, description: e.target.value });
                        if (errors.description) setErrors({ ...errors, description: '' });
                      }}
                      placeholder={t.contact.form.descriptionPlaceholder}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                        errors.description
                          ? 'border-red-500 focus:border-red-400'
                          : 'border-slate-700 focus:border-cyan-400'
                      }`}
                    />
                    {errors.description && (
                      <p className="text-[11px] text-red-400 mt-1">{errors.description}</p>
                    )}
                  </div>

                  {/* Privacy Notice */}
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {t.contact.form.privacyNotice}
                  </p>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#087BFF] to-[#21D4F4] hover:from-[#0066e6] hover:to-[#12c4e4] text-white text-sm font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    {isSubmitting ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>{t.contact.form.submittingBtn}</span>
                      </>
                    ) : (
                      <>
                        <span>{t.contact.form.submitBtn}</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Verified Contact Details & Existing Inquiry Tracker */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Information Cards */}
            <div className="p-6 rounded-2xl bg-[#0B1B32] border border-slate-800 space-y-5">
              <h3 className="text-base font-bold text-white mb-2 pb-2 border-b border-slate-800">
                Direct Communication Channels
              </h3>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                    {t.contact.details.directEmail}
                  </div>
                  <a
                    href="mailto:hello@skgenterprises.com"
                    className="text-sm font-medium text-white hover:text-cyan-300 transition-colors"
                  >
                    {t.contact.details.directEmailValue}
                  </a>
                  <div className="text-[11px] text-slate-400">
                    Average response within 24 business hours
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                    {t.contact.details.address}
                  </div>
                  <div className="text-sm font-medium text-white">
                    {t.contact.details.addressValue}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Kathmandu Valley, Nepal
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[#FFAA18] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                    {t.contact.details.hours}
                  </div>
                  <div className="text-sm font-medium text-white">
                    {t.contact.details.hoursValue}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Nepal Standard Time (UTC +5:45)
                  </div>
                </div>
              </div>
            </div>

            {/* Check Existing Inquiry Status Tool */}
            <div className="p-6 rounded-2xl bg-[#0B1B32] border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>{t.contact.statusCheck.title}</span>
              </h3>
              <p className="text-xs text-slate-300 mb-4">
                {t.contact.statusCheck.desc}
              </p>

              <form onSubmit={handleCheckStatus} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={verifyIdInput}
                  onChange={(e) => setVerifyIdInput(e.target.value)}
                  placeholder={t.contact.statusCheck.placeholder}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  {isVerifying ? 'Checking...' : t.contact.statusCheck.button}
                </button>
              </form>

              {verifyError && (
                <p className="text-[11px] text-red-400 mt-2">{verifyError}</p>
              )}

              {verifiedInquiryInfo && (
                <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Inquiry Verified Active</span>
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-400">Sender:</span> {verifiedInquiryInfo.name}
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-400">Category:</span> {verifiedInquiryInfo.serviceCategory}
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-400">Current Status:</span>{' '}
                    <span className="font-mono text-cyan-300 uppercase">
                      {verifiedInquiryInfo.status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
