import React, { useState } from 'react';
import { ModuleEstimate, Language } from '../../types';
import { defaultModuleEstimates } from '../../data/defaultData';
import {
  Calculator,
  IndianRupee,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  Layers,
  Sparkles,
  Download,
  Printer,
  ChevronRight,
  TrendingUp,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface CostEstimatorProps {
  language: Language;
}

export const CostEstimator: React.FC<CostEstimatorProps> = ({ language }) => {
  const [modules, setModules] = useState<ModuleEstimate[]>(defaultModuleEstimates);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [agencyTier, setAgencyTier] = useState<'tier2' | 'freelance' | 'tier1'>('tier2');
  const [maintenanceMonths, setMaintenanceMonths] = useState<number>(3);

  // Agency tier multipliers for Indian market
  const tierMultiplier = agencyTier === 'freelance' ? 0.8 : agencyTier === 'tier2' ? 1.0 : 1.6;

  // Toggle module selection
  const toggleModule = (id: string) => {
    setModules((prev) =>
      prev.map((mod) => (mod.id === id ? { ...mod, selected: !mod.selected } : mod))
    );
  };

  // Preset switchers
  const applyPreset = (preset: 'mvp' | 'recommended' | 'enterprise') => {
    if (preset === 'mvp') {
      setModules((prev) =>
        prev.map((mod) => ({
          ...mod,
          selected: ['mod-1', 'mod-2', 'mod-5', 'mod-6', 'mod-7', 'mod-8', 'mod-10'].includes(mod.id),
        }))
      );
    } else if (preset === 'recommended') {
      setModules((prev) =>
        prev.map((mod) => ({
          ...mod,
          selected: true,
        }))
      );
    } else if (preset === 'enterprise') {
      setModules((prev) =>
        prev.map((mod) => ({
          ...mod,
          selected: true,
        }))
      );
    }
  };

  // Calculations
  const selectedModules = modules.filter((m) => m.selected);
  const totalHours = selectedModules.reduce((sum, m) => sum + m.hours, 0);

  const rawBaseCostINR = selectedModules.reduce((sum, m) => sum + m.costINR, 0);
  const totalCostINR = Math.round(rawBaseCostINR * tierMultiplier);
  const totalCostUSD = Math.round(totalCostINR / 83);

  // Estimated weeks based on team of 3 developers (Frontend + Backend + QA/DevOps)
  const estimatedWeeks = Math.max(6, Math.ceil(totalHours / 45));

  // Monthly AMC / Cloud Server Cost
  const cloudHostingMonthlyINR = 12000;
  const maintenanceMonthlyINR = Math.round(totalCostINR * 0.08 / 12);

  const handlePrintProposal = () => {
    window.print();
  };

  return (
    <div className="w-full py-6 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
            <Calculator className="w-4 h-4" />
            <span>Indian Market Benchmark · 2026 Rates</span>
            <span className="text-slate-500">·</span>
            <span>J S Financial Service Project</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {language === 'hinglish'
              ? 'App Development Kharcha & Timeline Estimator'
              : 'App Development Cost & Timeline Estimator'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {language === 'hinglish'
              ? 'Mobile app, Admin CRM aur server architecture ka transparent budget aur hafton ka hisab.'
              : 'Detailed commercial proposal based on standard Indian fintech development rates.'}
          </p>
        </div>

        {/* Currency & Print Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                currency === 'INR' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                currency === 'USD' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>

          <button
            onClick={handlePrintProposal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print Scope PDF</span>
          </button>
        </div>
      </div>

      {/* Preset Selector & Cost Highlight Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Preset Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Choose Project Scope Preset
            </span>
            <span className="text-xs text-slate-500">Click to auto-configure modules</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => applyPreset('mvp')}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-all hover:bg-slate-800/80 group"
            >
              <span className="text-[10px] font-bold text-blue-400 block mb-1">PHASE 1</span>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400">Lean MVP</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Core Loans + Documents + Basic Admin Panel + WhatsApp alert.
              </p>
              <div className="mt-3 text-xs font-mono text-slate-300 font-bold">
                ~6 to 8 Weeks
              </div>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('recommended')}
              className="p-4 rounded-2xl bg-slate-900 border-2 border-emerald-500/80 text-left transition-all relative shadow-lg shadow-emerald-500/5 group"
            >
              <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500 text-slate-950 uppercase tracking-wide">
                RECOMMENDED
              </span>
              <span className="text-[10px] font-bold text-emerald-400 block mb-1">FULL SCOPE</span>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400">Production App</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Loans + Insurance + PAN/EPF + CRM + DigiLocker KYC + App Stores.
              </p>
              <div className="mt-3 text-xs font-mono text-emerald-400 font-bold">
                ~10 to 12 Weeks
              </div>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('enterprise')}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-all hover:bg-slate-800/80 group"
            >
              <span className="text-[10px] font-bold text-purple-400 block mb-1">SCALE</span>
              <h4 className="text-sm font-bold text-white group-hover:text-purple-400">Enterprise Scale</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Full modules + automated NBFC API underwriting + Dedicated SLA.
              </p>
              <div className="mt-3 text-xs font-mono text-slate-300 font-bold">
                ~14 to 16 Weeks
              </div>
            </button>
          </div>

          {/* Agency Team Tier Selector */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                Development Team & Delivery Partner
              </span>
              <span className="text-xs text-slate-500">Hourly Rate & SLA profile</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAgencyTier('freelance')}
                className={`p-2.5 rounded-xl border text-left transition-colors ${
                  agencyTier === 'freelance'
                    ? 'bg-slate-800 border-emerald-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <p className="text-xs font-bold">Freelance Squad</p>
                <p className="text-[10px] text-slate-400">₹1,100/hr (Lower Cost, Less SLA)</p>
              </button>
              <button
                type="button"
                onClick={() => setAgencyTier('tier2')}
                className={`p-2.5 rounded-xl border text-left transition-colors ${
                  agencyTier === 'tier2'
                    ? 'bg-slate-800 border-emerald-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <p className="text-xs font-bold text-emerald-400">Mid-Market Agency (Rec.)</p>
                <p className="text-[10px] text-slate-400">₹1,500/hr (Fintech Experts, Dedicated PM)</p>
              </button>
              <button
                type="button"
                onClick={() => setAgencyTier('tier1')}
                className={`p-2.5 rounded-xl border text-left transition-colors ${
                  agencyTier === 'tier1'
                    ? 'bg-slate-800 border-emerald-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <p className="text-xs font-bold">Top Tier-1 Agency</p>
                <p className="text-[10px] text-slate-400">₹2,800/hr (Large IT firms)</p>
              </button>
            </div>
          </div>
        </div>

        {/* Live Total Quotation Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/60 shadow-xl flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Total Estimated Cost
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {selectedModules.length} Modules Selected
              </span>
            </div>

            <div className="mt-3">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                {currency === 'INR' ? (
                  <span>₹{(totalCostINR / 100000).toFixed(2)} Lakhs</span>
                ) : (
                  <span>${totalCostUSD.toLocaleString('en-US')}</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {currency === 'INR'
                  ? `(Exact: ₹${totalCostINR.toLocaleString('en-IN')})`
                  : `(INR Equivalent: ₹${totalCostINR.toLocaleString('en-IN')})`}
              </p>
            </div>

            <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Total Engineering Effort:
                </span>
                <span className="font-mono font-bold text-white">{totalHours} Hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Delivery Timeline:
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {estimatedWeeks} Weeks (~{Math.ceil(estimatedWeeks / 4.3)} Months)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Warranty & Free Support:
                </span>
                <span className="font-semibold text-white">90 Days Post-Launch</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between text-slate-300 font-medium">
              <span>Cloud Server (AWS Mumbai):</span>
              <span className="font-mono">~₹{cloudHostingMonthlyINR.toLocaleString('en-IN')}/mo</span>
            </div>
            <div className="flex justify-between text-slate-300 font-medium">
              <span>Google Play ($25) & Apple ($99/yr):</span>
              <span className="font-mono">One-time / Annual</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module-by-Module Selection Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            2. Detailed Module Breakdown & Line-Item Budget
          </h3>
          <span className="text-xs text-slate-400">Click checkboxes to customize scope</span>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Include</th>
                  <th className="py-3 px-4">Feature / Engineering Deliverable</th>
                  <th className="py-3 px-4">Scope Description</th>
                  <th className="py-3 px-4 text-center">Dev Hours</th>
                  <th className="py-3 px-4 text-right">Estimated Cost ({currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {modules.map((mod) => {
                  const modCost = Math.round(
                    (currency === 'INR' ? mod.costINR : mod.costUSD) * tierMultiplier
                  );
                  return (
                    <tr
                      key={mod.id}
                      onClick={() => toggleModule(mod.id)}
                      className={`cursor-pointer transition-colors ${
                        mod.selected ? 'bg-slate-900 hover:bg-slate-800/80' : 'bg-slate-950/60 opacity-60'
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={mod.selected}
                          onChange={() => {}} // handled by tr click
                          className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-bold text-white">{mod.name}</p>
                        <p className="text-[11px] text-emerald-400/90 font-medium">{mod.nameHinglish}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-md">
                        {mod.description}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-medium text-slate-300">
                        {mod.hours}h
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-white whitespace-nowrap">
                        {currency === 'INR' ? `₹${modCost.toLocaleString('en-IN')}` : `$${modCost.toLocaleString('en-US')}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sprints & Delivery Timeline Gantt */}
      <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span>Sprint Roadmap & Phase Milestones ({estimatedWeeks} Weeks)</span>
          </h3>
          <span className="text-xs text-slate-400">Agile 2-week Sprint Cycles</span>
        </div>

        <div className="space-y-3 text-xs">
          {/* Phase 1 */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                P1
              </span>
              <div>
                <h4 className="font-bold text-white">Weeks 1 - 2: UI/UX Design & Bilingual Wireframes</h4>
                <p className="text-[11px] text-slate-400">
                  Figma prototypes in English & Hinglish, client approval, database schema (PostgreSQL), and project setup.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold text-blue-400 shrink-0">Milestone: 30% Advance</span>
          </div>

          {/* Phase 2 */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                P2
              </span>
              <div>
                <h4 className="font-bold text-white">Weeks 3 - 6: Flutter Mobile App Core & Loan Engine</h4>
                <p className="text-[11px] text-slate-400">
                  Home/Personal/Business loan forms, interactive EMI calculator, KYC camera document upload, and Node.js REST API.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-400 shrink-0">Milestone: 30% Alpha Build</span>
          </div>

          {/* Phase 3 */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                P3
              </span>
              <div>
                <h4 className="font-bold text-white">Weeks 7 - 9: Insurance, Govt Seva & Admin CRM</h4>
                <p className="text-[11px] text-slate-400">
                  Life/Health/Motor quotes, PAN/EPF citizen service request flow, and Admin web dashboard for lead underwriting.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold text-purple-400 shrink-0">Milestone: 20% Beta Release</span>
          </div>

          {/* Phase 4 */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                P4
              </span>
              <div>
                <h4 className="font-bold text-white">Weeks 10 - 12: Security Testing, Store Publishing & Launch</h4>
                <p className="text-[11px] text-slate-400">
                  Penetration testing, RBI guidelines audit, Google Play & Apple App Store submission, and production deployment.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold text-amber-400 shrink-0">Milestone: 20% Final Signoff</span>
          </div>
        </div>
      </div>
    </div>
  );
};
