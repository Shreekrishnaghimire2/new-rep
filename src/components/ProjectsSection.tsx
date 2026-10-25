import React, { useState } from 'react';
import {
  ExternalLink,
  Layers,
  Sparkles,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  Truck,
  Calculator,
  LayoutTemplate,
  Send,
} from 'lucide-react';
import { Language, ProjectItem } from '../types';
import { translations, projectItemsData } from '../translations';

interface ProjectsSectionProps {
  lang: Language;
  onInquireProject: (projectName: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  lang,
  onInquireProject,
}) => {
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);
  const t = translations[lang];

  // State for Interactive Demo 1: Himalaya Logistics Dispatcher
  const [route, setRoute] = useState<'ktm-pokhara' | 'ktm-mustang' | 'narayangadh-butwal'>('ktm-mustang');
  const [cargoWeight, setCargoWeight] = useState<number>(3200); // in kg
  const [vehicleType, setVehicleType] = useState<'truck' | 'heavy_tipper'>('truck');
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  // State for Interactive Demo 2: Invoice & VAT Ledger
  const [invoiceItemName, setInvoiceItemName] = useState('Hardware Server Node');
  const [invoiceAmount, setInvoiceAmount] = useState<number>(85000); // in NPR
  const [includeVat, setIncludeVat] = useState(true);
  const [tdsRate, setTdsRate] = useState<number>(1.5); // %
  const [invoiceGenerated, setInvoiceGenerated] = useState(true);

  // Logistics calculations
  const routeDetails = {
    'ktm-pokhara': { distance: '200 km', avgElevation: '1,400m', riskLevel: 'Moderate', fuelEst: '52 L' },
    'ktm-mustang': { distance: '380 km', avgElevation: '3,800m', riskLevel: 'High Terrain', fuelEst: '115 L' },
    'narayangadh-butwal': { distance: '115 km', avgElevation: '300m', riskLevel: 'Low / Flat', fuelEst: '32 L' },
  }[route];

  // Invoice calculations
  const vatAmount = includeVat ? invoiceAmount * 0.13 : 0;
  const subtotalWithVat = invoiceAmount + vatAmount;
  const tdsDeduction = (invoiceAmount * tdsRate) / 100;
  const netPayable = subtotalWithVat - tdsDeduction;

  const handleSimulateDispatch = () => {
    setDispatchStatus('Dispatching driver & sending route telemetry...');
    setTimeout(() => {
      setDispatchStatus('Route Dispatched! Driver assigned with verified mountain weight clearance.');
    }, 600);
  };

  return (
    <section id="projects" className="py-8 sm:py-14 lg:py-20 bg-[#071426] relative border-t border-slate-800/80 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
            {t.projects.kicker}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {t.projects.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            {t.projects.subtitle}
          </p>
        </div>

        {/* Honest Notice */}
        <div className="mb-10 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[#FFAA18] shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            {t.projects.notice}
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projectItemsData.map((project) => {
            const title = lang === 'ne' ? project.nepaliTitle : project.title;
            const category = lang === 'ne' ? project.nepaliCategory : project.category;
            const badge = lang === 'ne' ? project.nepaliBadge : project.badge;
            const problem = lang === 'ne' ? project.nepaliProblem : project.problem;
            const solution = lang === 'ne' ? project.nepaliSolution : project.solution;
            const outcomes = lang === 'ne' ? project.nepaliOutcomes : project.outcomes;

            return (
              <div
                key={project.id}
                className="rounded-2xl bg-[#0B1B32] border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all duration-200 group"
              >
                <div>
                  {/* Category & Badge */}
                  <div className="flex flex-col gap-1.5 mb-4">
                    <span className="text-xs font-medium text-cyan-400">
                      {category}
                    </span>
                    <span className="text-[11px] font-mono text-[#FFAA18] bg-[#FFAA18]/10 px-2 py-0.5 rounded w-fit border border-[#FFAA18]/20">
                      {badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {title}
                  </h3>

                  {/* Problem & Solution */}
                  <div className="space-y-3 mb-6 text-xs text-slate-300 leading-relaxed">
                    <div>
                      <span className="font-semibold text-slate-400 block mb-1">
                        {t.projects.problemLabel}
                      </span>
                      <p>{problem}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-cyan-400 block mb-1">
                        {t.projects.solutionLabel}
                      </span>
                      <p>{solution}</p>
                    </div>
                  </div>

                  {/* Key Outcomes */}
                  <div className="mb-6 pt-4 border-t border-slate-800">
                    <div className="text-[11px] font-semibold text-white uppercase tracking-wider mb-2">
                      {t.projects.outcomesLabel}
                    </div>
                    <ul className="space-y-1.5">
                      {outcomes.map((out, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Demo Launcher */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveProjectModal(project)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 py-1.5 px-3 rounded-lg bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-500/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{t.projects.viewDemo}</span>
                  </button>

                  <button
                    onClick={() => onInquireProject(project.title)}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Discuss Similar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Project Demonstration Modal */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#0B1B32] border border-cyan-500/30 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setActiveProjectModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label={t.projects.closeDemo}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <span className="text-[11px] font-mono text-[#FFAA18] px-2 py-0.5 rounded bg-[#FFAA18]/10 border border-[#FFAA18]/20">
                {lang === 'ne' ? activeProjectModal.nepaliBadge : activeProjectModal.badge}
              </span>
              <h3 className="text-2xl font-bold text-white mt-2">
                {lang === 'ne' ? activeProjectModal.nepaliTitle : activeProjectModal.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'ne' ? activeProjectModal.nepaliCategory : activeProjectModal.category}
              </p>
            </div>

            {/* DEMO 1: Himalaya Logistics Dispatcher Simulator */}
            {activeProjectModal.interactiveDemoId === 'logistics' && (
              <div className="p-5 rounded-xl bg-slate-900 border border-cyan-500/20 mb-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-4 pb-2 border-b border-slate-800">
                  <Truck className="w-4 h-4" />
                  <span>Interactive Route & Dispatch Console</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Select Mountain Corridor Route:
                    </label>
                    <select
                      value={route}
                      onChange={(e) => {
                        setRoute(e.target.value as any);
                        setDispatchStatus(null);
                      }}
                      className="w-full bg-[#071426] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="ktm-mustang">Kathmandu ⇄ Jomsom/Mustang (High Elevation)</option>
                      <option value="ktm-pokhara">Kathmandu ⇄ Pokhara (Prithvi Highway)</option>
                      <option value="narayangadh-butwal">Narayangadh ⇄ Butwal (East-West Highway)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Cargo Payload: {cargoWeight.toLocaleString()} kg
                    </label>
                    <input
                      type="range"
                      min={500}
                      max={8000}
                      step={100}
                      value={cargoWeight}
                      onChange={(e) => {
                        setCargoWeight(Number(e.target.value));
                        setDispatchStatus(null);
                      }}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Computed Telemetry */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-[#071426] border border-slate-800 mb-4">
                  <div>
                    <div className="text-[10px] text-slate-400">Total Distance</div>
                    <div className="text-sm font-mono font-bold text-white">{routeDetails.distance}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Max Elevation</div>
                    <div className="text-sm font-mono font-bold text-cyan-300">{routeDetails.avgElevation}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Terrain Risk</div>
                    <div className="text-sm font-mono font-bold text-[#FFAA18]">{routeDetails.riskLevel}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Est. Fuel Burn</div>
                    <div className="text-sm font-mono font-bold text-emerald-400">{routeDetails.fuelEst}</div>
                  </div>
                </div>

                {/* Dispatch Button & Status */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleSimulateDispatch}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Simulate Real-Time Dispatch</span>
                  </button>
                  {dispatchStatus && (
                    <span className="text-xs text-emerald-400 font-medium">
                      ✓ {dispatchStatus}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* DEMO 2: Invoice & VAT Ledger Tool */}
            {activeProjectModal.interactiveDemoId === 'invoice' && (
              <div className="p-5 rounded-xl bg-slate-900 border border-cyan-500/20 mb-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-4 pb-2 border-b border-slate-800">
                  <Calculator className="w-4 h-4" />
                  <span>Interactive Nepal VAT & TDS Ledger Calculator</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Item Description:
                    </label>
                    <input
                      type="text"
                      value={invoiceItemName}
                      onChange={(e) => setInvoiceItemName(e.target.value)}
                      className="w-full bg-[#071426] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Base Amount (NPR):
                    </label>
                    <input
                      type="number"
                      value={invoiceAmount}
                      onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                      className="w-full bg-[#071426] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      TDS Withholding (%):
                    </label>
                    <select
                      value={tdsRate}
                      onChange={(e) => setTdsRate(Number(e.target.value))}
                      className="w-full bg-[#071426] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value={1.5}>1.5% (Goods / Services Standard)</option>
                      <option value={10}>10% (Consulting / Professional)</option>
                      <option value={15}>15% (Contractor High Bracket)</option>
                      <option value={0}>0% (Tax Exempt)</option>
                    </select>
                  </div>
                </div>

                {/* Nepal 13% VAT toggle */}
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="vat-check"
                    checked={includeVat}
                    onChange={(e) => setIncludeVat(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-slate-800 border-slate-700"
                  />
                  <label htmlFor="vat-check" className="text-xs text-slate-300">
                    Apply Standard 13% Nepal Government VAT
                  </label>
                </div>

                {/* Audit Ledger Result Table */}
                <div className="p-3 rounded-lg bg-[#071426] border border-slate-800 text-xs">
                  <div className="font-semibold text-white mb-2 pb-1 border-b border-slate-800 flex justify-between">
                    <span>Ledger Summary Breakdown</span>
                    <span className="text-[11px] font-mono text-cyan-400">IRDN-COMPLIANT</span>
                  </div>
                  <div className="space-y-1.5 font-mono">
                    <div className="flex justify-between text-slate-300">
                      <span>Base Line Item Subtotal:</span>
                      <span>Rs. {invoiceAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Nepal VAT (13%):</span>
                      <span className="text-cyan-400">+ Rs. {vatAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Gross Invoice Total:</span>
                      <span>Rs. {subtotalWithVat.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-amber-400">
                      <span>Less TDS Withholding ({tdsRate}%):</span>
                      <span>- Rs. {tdsDeduction.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold pt-1 border-t border-slate-800 text-sm">
                      <span>Net Cash Payable to Vendor:</span>
                      <span className="text-emerald-400">Rs. {netPayable.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DEMO 3: Enterprise Web Architecture Demo */}
            {activeProjectModal.interactiveDemoId === 'corporate' && (
              <div className="p-5 rounded-xl bg-slate-900 border border-cyan-500/20 mb-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-4 pb-2 border-b border-slate-800">
                  <LayoutTemplate className="w-4 h-4" />
                  <span>Real-Time Performance & Core Web Vitals Benchmark</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-[#071426] border border-slate-800">
                    <div className="text-[10px] text-slate-400">LCP (Largest Paint)</div>
                    <div className="text-lg font-mono font-bold text-emerald-400">0.72s</div>
                    <div className="text-[10px] text-slate-500">Target: &le; 2.5s</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#071426] border border-slate-800">
                    <div className="text-[10px] text-slate-400">INP (Interaction)</div>
                    <div className="text-lg font-mono font-bold text-emerald-400">42ms</div>
                    <div className="text-[10px] text-slate-500">Target: &le; 200ms</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#071426] border border-slate-800">
                    <div className="text-[10px] text-slate-400">CLS (Layout Shift)</div>
                    <div className="text-lg font-mono font-bold text-emerald-400">0.00</div>
                    <div className="text-[10px] text-slate-500">Target: &le; 0.1</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#071426] border border-slate-800">
                    <div className="text-[10px] text-slate-400">Accessibility Score</div>
                    <div className="text-lg font-mono font-bold text-cyan-400">100 / 100</div>
                    <div className="text-[10px] text-slate-500">WCAG 2.2 AA</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  This architecture is currently active on the site you are browsing. Built without heavy legacy plugins, rendering zero-layout-shift typography, and backed by a lightweight full-stack TypeScript Express pipeline.
                </p>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Verified SKG Enterprises Architecture
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveProjectModal(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  {t.projects.closeDemo}
                </button>
                <button
                  onClick={() => {
                    const projectName = activeProjectModal.title;
                    setActiveProjectModal(null);
                    onInquireProject(projectName);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#087BFF] to-[#21D4F4] rounded-lg hover:from-[#0066e6] hover:to-[#12c4e4] transition-all shadow-sm"
                >
                  Inquire for Your Business
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
