import React, { useState } from 'react';
import { TechStackOption, Language } from '../../types';
import { techStackOptions } from '../../data/defaultData';
import {
  Layers,
  Smartphone,
  Server,
  Database,
  Cloud,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  FileText,
  Key,
  Cpu,
  Lock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface TechScopeDocProps {
  language: Language;
}

export const TechScopeDoc: React.FC<TechScopeDocProps> = ({ language }) => {
  const [selectedTechTab, setSelectedTechTab] = useState<'frontend' | 'backend' | 'database' | 'cloud'>('frontend');

  const filteredTech = techStackOptions.filter((t) => t.category === selectedTechTab);

  return (
    <div className="w-full py-6 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
          <Layers className="w-4 h-4" />
          <span>Technical Architecture & Scope Specification</span>
          <span className="text-slate-500">·</span>
          <span>Version 1.2 (Production Blueprint)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {language === 'hinglish'
            ? 'J S Financial Service - App Scope & Takneek Blueprint'
            : 'J S Financial Service - Comprehensive App Scope & Technical Architecture'}
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Detailed technical evaluation for developing a scalable, secure, and compliant mobile & web platform for J S Financial Service covering digital lending, insurance, and citizen services.
        </p>
      </div>

      {/* Section 1: Executive Scope Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
            01
          </div>
          <h3 className="text-base font-bold text-white">Digital Lending Engine</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            End-to-end digital journey for Home Loans, Personal Loans, and Business Loans. Includes interactive EMI calculator, income eligibility scoring, instant document upload, and automated bank sanction pipeline.
          </p>
          <div className="text-[11px] text-emerald-400 pt-1 font-mono">
            Partnered with 30+ Banks & NBFCs
          </div>
        </div>

        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">
            02
          </div>
          <h3 className="text-base font-bold text-white">Insurance & Sarkari Seva</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Multi-insurer aggregation for Life/LIC Term, Health, and Motor insurance. Doorstep & digital assistance for PAN Card applications/corrections and EPFO PF passbook balance checks and withdrawal claims.
          </p>
          <div className="text-[11px] text-blue-400 pt-1 font-mono">
            Bilingual Hinglish / English Interface
          </div>
        </div>

        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm">
            03
          </div>
          <h3 className="text-base font-bold text-white">Admin CRM & Automation</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Web-based operations console for loan file underwriters and DSA agents. Real-time status changes, automated WhatsApp notification triggers, document KYC verification, and exportable loan reports.
          </p>
          <div className="text-[11px] text-purple-400 pt-1 font-mono">
            RBI & NBFC Digital Lending Guidelines
          </div>
        </div>
      </div>

      {/* Section 2: Technical Stack Evaluation Matrix */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>Technology Stack Decision Matrix</span>
            </h3>
            <p className="text-xs text-slate-400">
              Evaluating tradeoffs for Indian fintech development, performance, and operational cost
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedTechTab('frontend')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedTechTab === 'frontend'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Frontend (Mobile)
            </button>
            <button
              onClick={() => setSelectedTechTab('backend')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedTechTab === 'backend'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Backend API
            </button>
            <button
              onClick={() => setSelectedTechTab('database')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedTechTab === 'database'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Database
            </button>
            <button
              onClick={() => setSelectedTechTab('cloud')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedTechTab === 'cloud'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cloud & Security
            </button>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTech.map((tech) => (
            <div
              key={tech.name}
              className={`p-5 rounded-2xl border transition-all ${
                tech.recommended
                  ? 'bg-slate-900/95 border-emerald-500/60 shadow-lg shadow-emerald-500/5'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">{tech.name}</h4>
                    {tech.recommended && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950">
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">Cost Profile: {tech.estimatedCostFactor}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold font-mono text-emerald-400">{tech.rating}</span>
                  <span className="text-xs text-slate-500"> / 5.0</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 block mb-1">Key Advantages:</span>
                  <ul className="space-y-1">
                    {tech.pros.map((pro, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-amber-400 block mb-1">Tradeoffs / Limitations:</span>
                  <ul className="space-y-1">
                    {tech.cons.map((con, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                  <span className="text-slate-500 font-medium">Best Fit: </span>
                  {tech.bestFor}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Architecture Diagram & Integration Flow */}
      <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-emerald-400" />
          <span>System Architecture & Integration Pipeline</span>
        </h3>
        <p className="text-xs text-slate-400">
          How customer mobile apps, admin CRM, government portals, and lending partner systems communicate securely:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-emerald-400 font-bold block">1. Client Layer</span>
            <p className="text-slate-300 font-semibold">Flutter Hybrid Mobile App</p>
            <p className="text-slate-400 text-[11px]">
              Single codebase for iOS & Android with bilingual English & Hinglish localization, offline document caching, and biometric app lock.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-blue-400 font-bold block">2. API Gateway</span>
            <p className="text-slate-300 font-semibold">Node.js (NestJS) + Redis</p>
            <p className="text-slate-400 text-[11px]">
              REST & WebSockets with JWT token authentication, rate limiting, and Redis cache for lightning-fast OTP verifications.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-purple-400 font-bold block">3. Data & Storage</span>
            <p className="text-slate-300 font-semibold">PostgreSQL + AWS S3 Encrypted</p>
            <p className="text-slate-400 text-[11px]">
              ACID transactional consistency for loan disbursement records, encrypted KYC document repository with 256-bit AES encryption.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-amber-400 font-bold block">4. Fintech Gateways</span>
            <p className="text-slate-300 font-semibold">DigiLocker, NSDL & WhatsApp</p>
            <p className="text-slate-400 text-[11px]">
              Instant PAN verification, Aadhaar e-KYC XML retrieval, EPFO Member portal assistance, and automated WhatsApp alert templates.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Security, Compliance & RBI Guidelines */}
      <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Security, Encryption & Regulatory Compliance (RBI & DPDP Act)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Data Protection & Encryption Standards</span>
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">·</span>
                <span><strong>256-bit AES Encryption:</strong> All sensitive customer KYC files (Aadhaar cards, PAN cards, bank statements) encrypted at rest in S3.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">·</span>
                <span><strong>TLS 1.3 in Transit:</strong> Strict HTTPS with SSL certificate pinning to prevent Man-in-the-Middle (MITM) attacks.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">·</span>
                <span><strong>Aadhaar Masking:</strong> Automatic masking of first 8 digits of Aadhaar number as mandated by UIDAI guidelines.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>RBI Digital Lending & NBFC Partnership Rules</span>
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">·</span>
                <span><strong>Data Localization:</strong> All user and transaction data resides strictly within India (AWS ap-south-1 Mumbai region).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">·</span>
                <span><strong>Key Fact Statement (KFS):</strong> Explicit disclosure of all APR, processing fees, and partner bank names before loan sanction.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">·</span>
                <span><strong>Direct Disbursal Model:</strong> Funds disburse directly from the regulated partner bank/NBFC to customer bank accounts.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
