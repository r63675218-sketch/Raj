import React, { useState } from 'react';
import { Language, LoanType, LoanApplication, ServiceInquiry } from '../../types';
import { translations } from '../../data/translations';
import {
  Home,
  CreditCard,
  Shield,
  FileCheck2,
  Search,
  Calculator,
  PhoneCall,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Percent,
  Calendar,
  IndianRupee,
  Smartphone,
  Maximize2,
  Minimize2,
  HelpCircle,
} from 'lucide-react';
import { LoanApplyModal } from './LoanApplyModal';

interface MobileAppSimulatorProps {
  language: Language;
  onLanguageToggle: () => void;
  applications: LoanApplication[];
  onNewApplication: (app: LoanApplication) => void;
  onNewServiceInquiry: (inq: ServiceInquiry) => void;
}

type MobileTab = 'home' | 'loans' | 'insurance' | 'govt' | 'track';

export const MobileAppSimulator: React.FC<MobileAppSimulatorProps> = ({
  language,
  onLanguageToggle,
  applications,
  onNewApplication,
  onNewServiceInquiry,
}) => {
  const t = translations[language];

  // Mobile state
  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState<LoanType>('home');
  const [viewMode, setViewMode] = useState<'device' | 'expanded'>('device');

  // EMI state
  const [emiAmount, setEmiAmount] = useState<number>(3000000);
  const [emiRate, setEmiRate] = useState<number>(8.5);
  const [emiTenureYears, setEmiTenureYears] = useState<number>(20);

  // Tracking query state
  const [trackQuery, setTrackQuery] = useState('');
  const [selectedAppForTrack, setSelectedAppForTrack] = useState<LoanApplication | null>(
    applications[0] || null
  );

  // Insurance quote state
  const [insCategory, setInsCategory] = useState<'life' | 'health' | 'motor'>('life');
  const [insCoverAmount, setInsCoverAmount] = useState<string>('1_crore');
  const [insAge, setInsAge] = useState<number>(32);
  const [insCallbackSuccess, setInsCallbackSuccess] = useState(false);

  // Govt seva state
  const [govtType, setGovtType] = useState<'pan' | 'epf'>('pan');
  const [govtCustomerName, setGovtCustomerName] = useState('');
  const [govtPhone, setGovtPhone] = useState('');
  const [govtSubService, setGovtSubService] = useState('New PAN Card Application');
  const [govtSuccessTicket, setGovtSuccessTicket] = useState<string | null>(null);

  // EMI math
  const monthlyRate = emiRate / (12 * 100);
  const totalMonths = emiTenureYears * 12;
  const calculatedEMI = Math.round(
    (emiAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
  const totalPayment = calculatedEMI * totalMonths;
  const totalInterest = totalPayment - emiAmount;

  // Open apply with preset
  const openApply = (type: LoanType) => {
    setSelectedLoanType(type);
    setIsApplyModalOpen(true);
  };

  const handleInsuranceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inq: ServiceInquiry = {
      id: `inq-${Date.now()}`,
      ticketNo: `JS-INS-${Math.floor(100 + Math.random() * 900)}`,
      customerName: 'Rajiv Kumar',
      phone: '+91 98350 44129',
      category: 'insurance',
      subType: `${insCategory.toUpperCase()} Plan (Cover: ${insCoverAmount})`,
      details: `Quote requested for age ${insAge}. Preferred callback requested.`,
      status: 'open',
      date: new Date().toISOString().split('T')[0],
    };
    onNewServiceInquiry(inq);
    setInsCallbackSuccess(true);
    setTimeout(() => setInsCallbackSuccess(false), 5000);
  };

  const handleGovtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketNo = `JS-${govtType === 'pan' ? 'PAN' : 'EPF'}-${Math.floor(100 + Math.random() * 900)}`;
    const inq: ServiceInquiry = {
      id: `inq-${Date.now()}`,
      ticketNo,
      customerName: govtCustomerName.trim() || 'Rajiv Kumar',
      phone: govtPhone.trim() || '+91 98350 44129',
      category: govtType === 'pan' ? 'govt_pan' : 'govt_epf',
      subType: govtSubService,
      details: `Citizen service request for ${govtSubService}.`,
      status: 'open',
      date: new Date().toISOString().split('T')[0],
    };
    onNewServiceInquiry(inq);
    setGovtSuccessTicket(ticketNo);
    setGovtCustomerName('');
    setGovtPhone('');
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = trackQuery.trim().toLowerCase();
    const found = applications.find(
      (a) =>
        a.applicationNo.toLowerCase().includes(clean) ||
        a.phone.replace(/\D/g, '').includes(clean.replace(/\D/g, ''))
    );
    if (found) {
      setSelectedAppForTrack(found);
    } else if (applications.length > 0) {
      setSelectedAppForTrack(applications[0]);
    }
  };

  return (
    <div className="w-full py-6 px-3 sm:px-6 max-w-7xl mx-auto">
      {/* Top Banner / Simulator Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
            <Smartphone className="w-4 h-4" />
            <span>Interactive Mobile App Prototype</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">iOS & Android Hybrid Ready</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {language === 'hinglish'
              ? 'J S Financial Service Grahak Mobile App'
              : 'J S Financial Service Customer Mobile Experience'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {language === 'hinglish'
              ? 'Home, Personal & Business Loan apply karein, Bima aur Sarkari Seva ki suvidha ek jagah.'
              : 'Complete mobile journey for loans, insurance, PAN card and EPF services.'}
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('device')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                viewMode === 'device'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Phone Frame</span>
            </button>
            <button
              onClick={() => setViewMode('expanded')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                viewMode === 'expanded'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expanded View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container - either centered mobile frame or expanded */}
      <div className="flex justify-center items-start">
        <div
          className={`transition-all duration-300 w-full ${
            viewMode === 'device'
              ? 'max-w-[420px] rounded-[42px] border-[10px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden relative'
              : 'max-w-5xl rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl'
          }`}
        >
          {/* Simulated Mobile Status Bar (Visible in Device Mode) */}
          {viewMode === 'device' && (
            <div className="bg-slate-950 px-6 pt-3 pb-2 flex items-center justify-between text-[11px] text-slate-400 font-mono select-none">
              <span>9:41</span>
              {/* Dynamic Island / Notch */}
              <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto border border-slate-800 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-2" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <span className="w-4 h-2 border border-slate-400 rounded-sm inline-block p-0.5">
                  <span className="w-full h-full bg-emerald-400 block rounded-2xs" />
                </span>
              </div>
            </div>
          )}

          {/* Mobile Top App Bar */}
          <div className="bg-slate-900/90 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                JS
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-tight">J S Financial Service</h1>
                <p className="text-[10px] text-emerald-400 font-medium">
                  {language === 'hinglish' ? 'Aapka Financial Dost' : 'Financial Partner'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onLanguageToggle}
                className="px-2 py-1 text-[11px] font-semibold rounded-md bg-slate-800 text-slate-300 border border-slate-700 hover:text-white"
              >
                {language === 'hinglish' ? 'EN' : 'हिं'}
              </button>
            </div>
          </div>

          {/* Scrollable Content View Area */}
          <div className="overflow-y-auto max-h-[640px] text-slate-200 p-4 space-y-4">
            {/* TAB 1: HOME */}
            {activeTab === 'home' && (
              <div className="space-y-4">
                {/* Greeting Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-medium text-emerald-400">
                        {language === 'hinglish' ? 'Namaste Rajiv Kumar ji! 🙏' : 'Welcome, Rajiv Kumar'}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                        {language === 'hinglish'
                          ? 'Aapko kitne loan ki zaroorat hai?'
                          : 'How much loan do you need today?'}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">
                        {language === 'hinglish'
                          ? 'Ghar, Personal ya Business Loan - Turant approval 24 ghante me.'
                          : 'Instant pre-approval assistance with 30+ leading partner banks.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => openApply('home')}
                      className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors text-center"
                    >
                      {t.hero.applyNow}
                    </button>
                    <button
                      onClick={() => setActiveTab('track')}
                      className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
                    >
                      {t.hero.trackStatus}
                    </button>
                  </div>
                </div>

                {/* Quick Service Categories Grid */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-300 tracking-wide">
                      {language === 'hinglish' ? 'Hamari Sevaayein' : 'Our Key Services'}
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-medium">Bilingual Support</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Home Loan */}
                    <div
                      onClick={() => openApply('home')}
                      className="p-3 bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-xl cursor-pointer transition-all hover:bg-slate-800/80 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
                        <Home className="w-4 h-4" />
                      </div>
                      <h5 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {language === 'hinglish' ? 'Home Loan (Ghar)' : 'Home Loan'}
                      </h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">8.35% p.a. se shuru</p>
                    </div>

                    {/* Business Loan */}
                    <div
                      onClick={() => openApply('business')}
                      className="p-3 bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-xl cursor-pointer transition-all hover:bg-slate-800/80 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <h5 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {language === 'hinglish' ? 'Business Loan' : 'Business Loan'}
                      </h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">₹1 Cr tak bina security</p>
                    </div>

                    {/* Personal Loan */}
                    <div
                      onClick={() => openApply('personal')}
                      className="p-3 bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-xl cursor-pointer transition-all hover:bg-slate-800/80 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <h5 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                        Personal Loan
                      </h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">₹40 Lakh tak turant</p>
                    </div>

                    {/* Insurance & Govt */}
                    <div
                      onClick={() => setActiveTab('govt')}
                      className="p-3 bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-xl cursor-pointer transition-all hover:bg-slate-800/80 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-2">
                        <FileCheck2 className="w-4 h-4" />
                      </div>
                      <h5 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {language === 'hinglish' ? 'Sarkari Seva (PAN/PF)' : 'Govt PAN & EPF'}
                      </h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">Online Form & Help</p>
                    </div>
                  </div>
                </div>

                {/* Interactive EMI Calculator Widget */}
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Calculator className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold text-white">{t.calculator.title}</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Live Simulation</span>
                  </div>

                  {/* Amount slider */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">{t.calculator.amount}</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        ₹{emiAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={100000}
                      max={10000000}
                      step={50000}
                      value={emiAmount}
                      onChange={(e) => setEmiAmount(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Interest rate slider */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">{t.calculator.interest}</span>
                      <span className="font-bold text-white font-mono">{emiRate}% p.a.</span>
                    </div>
                    <input
                      type="range"
                      min={8.0}
                      max={18.0}
                      step={0.1}
                      value={emiRate}
                      onChange={(e) => setEmiRate(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Tenure slider */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">{t.calculator.tenure}</span>
                      <span className="font-bold text-white font-mono">{emiTenureYears} Years</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={30}
                      step={1}
                      value={emiTenureYears}
                      onChange={(e) => setEmiTenureYears(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Output Card */}
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{t.calculator.monthlyEMI}</span>
                      <span className="text-lg font-bold text-emerald-400 font-mono">
                        ₹{calculatedEMI.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-500 block">per month</span>
                    </div>
                    <div className="text-right text-[10px] text-slate-400 space-y-0.5">
                      <div>
                        Interest: <span className="font-mono text-slate-200">₹{(totalInterest / 100000).toFixed(2)}L</span>
                      </div>
                      <div>
                        Total: <span className="font-mono text-slate-200">₹{(totalPayment / 100000).toFixed(2)}L</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedLoanType('home');
                      setIsApplyModalOpen(true);
                    }}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    {t.calculator.applyWithDetails}
                  </button>
                </div>

                {/* Free CIBIL & Trust Card */}
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">
                      780
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">
                        {language === 'hinglish' ? 'CIBIL Score Check' : 'Credit Score Eligibility'}
                      </h5>
                      <p className="text-[10px] text-slate-400">
                        {language === 'hinglish'
                          ? 'Bina kisi charge ke apni loan eligibility dekhein'
                          : 'Soft credit pre-check with zero impact on score'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            )}

            {/* TAB 2: LOANS CATALOG */}
            {activeTab === 'loans' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{t.loans.title}</h3>
                  <span className="text-[11px] text-emerald-400 font-medium">30+ Partner Banks</span>
                </div>

                {/* Home Loan Card */}
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{t.loans.homeLoan}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t.loans.homeLoanDesc}</p>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-mono">
                      8.35% p.a.
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block">Max Tenure:</span>
                      <span className="font-semibold text-slate-200">Up to 30 Years</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Min Income:</span>
                      <span className="font-semibold text-slate-200">₹25,000 / month</span>
                    </div>
                  </div>
                  <button
                    onClick={() => openApply('home')}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                  >
                    {t.loans.quickApply}
                  </button>
                </div>

                {/* Personal Loan Card */}
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{t.loans.personalLoan}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t.loans.personalLoanDesc}</p>
                    </div>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-md font-mono">
                      10.50% p.a.
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block">Max Amount:</span>
                      <span className="font-semibold text-slate-200">₹40 Lakhs</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Disbursal Time:</span>
                      <span className="font-semibold text-slate-200">24-48 Hours</span>
                    </div>
                  </div>
                  <button
                    onClick={() => openApply('personal')}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                  >
                    {t.loans.quickApply}
                  </button>
                </div>

                {/* Business Loan Card */}
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{t.loans.businessLoan}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t.loans.businessLoanDesc}</p>
                    </div>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md font-mono">
                      12.0% p.a.
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block">Collateral:</span>
                      <span className="font-semibold text-slate-200">Unsecured / No Security</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Eligibility:</span>
                      <span className="font-semibold text-slate-200">1 Yr GST / ITR</span>
                    </div>
                  </div>
                  <button
                    onClick={() => openApply('business')}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                  >
                    {t.loans.quickApply}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: INSURANCE */}
            {activeTab === 'insurance' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{t.insurance.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t.insurance.subtitle}</p>
                </div>

                {/* Category Switcher */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setInsCategory('life')}
                    className={`py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      insCategory === 'life'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Life / LIC
                  </button>
                  <button
                    onClick={() => setInsCategory('health')}
                    className={`py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      insCategory === 'health'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Health Bima
                  </button>
                  <button
                    onClick={() => setInsCategory('motor')}
                    className={`py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      insCategory === 'motor'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Motor (Car/2W)
                  </button>
                </div>

                {/* Instant Quote Form */}
                <form onSubmit={handleInsuranceSubmit} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>
                      {insCategory === 'life'
                        ? 'Life & Term Insurance Quote'
                        : insCategory === 'health'
                        ? 'Cashless Health Insurance Quote'
                        : 'Motor Comprehensive Insurance Quote'}
                    </span>
                  </h4>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      {insCategory === 'life' ? 'Sum Assured / Life Cover' : 'Coverage Limit'}
                    </label>
                    <select
                      value={insCoverAmount}
                      onChange={(e) => setInsCoverAmount(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="50_lakh">₹50 Lakhs Cover</option>
                      <option value="1_crore">₹1 Crore Cover (Most Popular)</option>
                      <option value="2_crore">₹2 Crore Cover</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Your Age</label>
                    <input
                      type="number"
                      min={18}
                      max={65}
                      value={insAge}
                      onChange={(e) => setInsAge(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  {/* Calculated estimate badge */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Starting Premium Estimate:</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono">
                        {insCategory === 'life' ? '₹680 / month' : insCategory === 'health' ? '₹890 / month' : '₹1,999 / year'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">Includes 80C/80D benefits</span>
                  </div>

                  {insCallbackSuccess && (
                    <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Request received! Advisor will call with custom LIC / private plan.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-sm"
                  >
                    {t.insurance.getQuote}
                  </button>
                </form>

                {/* Partner Insurers Strip */}
                <div className="text-[10px] text-slate-400 text-center space-y-1">
                  <p>Insurers represented:</p>
                  <p className="font-semibold text-slate-300">LIC of India · HDFC Life · Star Health · ICICI Lombard · Care Health</p>
                </div>
              </div>
            )}

            {/* TAB 4: GOVT CITIZEN SERVICES (PAN & EPF) */}
            {activeTab === 'govt' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{t.govtServices.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t.govtServices.subtitle}</p>
                </div>

                {/* Switch between PAN and EPF */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
                  <button
                    onClick={() => {
                      setGovtType('pan');
                      setGovtSubService('New PAN Card Application');
                    }}
                    className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                      govtType === 'pan'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    PAN Card Seva
                  </button>
                  <button
                    onClick={() => {
                      setGovtType('epf');
                      setGovtSubService('PF Passbook & Balance Check');
                    }}
                    className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                      govtType === 'epf'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    EPF / PF Fund Seva
                  </button>
                </div>

                <form onSubmit={handleGovtSubmit} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                    <span>
                      {govtType === 'pan'
                        ? language === 'hinglish' ? 'PAN Card Sahayata Form' : 'PAN Card Assistance'
                        : language === 'hinglish' ? 'EPF / PF Service Request' : 'EPF Passbook & Claim Request'}
                    </span>
                  </h4>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Select Service</label>
                    <select
                      value={govtSubService}
                      onChange={(e) => setGovtSubService(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      {govtType === 'pan' ? (
                        <>
                          <option value="New PAN Card Application">New Physical & e-PAN Card Application</option>
                          <option value="PAN Card Correction (Name/DOB/Photo)">PAN Card Correction (Name / DOB / Photo)</option>
                          <option value="Aadhaar - PAN Card Linking">Aadhaar - PAN Linking Assistance</option>
                          <option value="Lost / Damaged PAN Reprint">Lost / Damaged PAN Reprint</option>
                        </>
                      ) : (
                        <>
                          <option value="PF Passbook & Balance Check">PF Balance Check & Passbook Download</option>
                          <option value="UAN Activation & Password Reset">UAN Activation & Password Reset</option>
                          <option value="PF Withdrawal (Form 19 & 10C Claim)">PF Withdrawal / Advance Claim Guidance</option>
                          <option value="Member Transfer (Old Company to New)">EPF Transfer from Previous Employer</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{t.applyModal.fullName}</label>
                    <input
                      type="text"
                      required
                      value={govtCustomerName}
                      onChange={(e) => setGovtCustomerName(e.target.value)}
                      placeholder="e.g. Rajiv Kumar"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{t.applyModal.mobile}</label>
                    <input
                      type="tel"
                      required
                      value={govtPhone}
                      onChange={(e) => setGovtPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {govtSuccessTicket && (
                    <div className="p-3 bg-emerald-950/70 border border-emerald-800 text-emerald-200 rounded-xl text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Ticket Generated: {govtSuccessTicket}</span>
                      </div>
                      <p className="text-[11px] text-emerald-300">
                        {language === 'hinglish'
                          ? 'Aapka request J S Financial Service executive ko assign ho gaya hai. Aapko WhatsApp par guidelines milengi.'
                          : 'Our executive will assist you with government portal filing via WhatsApp.'}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-sm"
                  >
                    {t.govtServices.requestService}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 5: TRACK STATUS */}
            {activeTab === 'track' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{t.tracking.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {language === 'hinglish'
                      ? 'Apne loan aavedan ka live status dekhein'
                      : 'Real-time loan sanction and disbursal tracking'}
                  </p>
                </div>

                <form onSubmit={handleTrackSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder="e.g. JS-HL-2026-8921 or Mobile"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700"
                  >
                    {t.tracking.search}
                  </button>
                </form>

                {/* Sample quick select */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                  <span className="text-slate-500 shrink-0">Sample:</span>
                  {applications.slice(0, 3).map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedAppForTrack(app)}
                      className={`px-2 py-0.5 rounded font-mono shrink-0 border ${
                        selectedAppForTrack?.id === app.id
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {app.applicationNo}
                    </button>
                  ))}
                </div>

                {selectedAppForTrack && (
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3.5">
                    <div className="flex items-start justify-between border-b border-slate-800 pb-2.5">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {selectedAppForTrack.applicationNo}
                        </span>
                        <h4 className="text-xs font-bold text-white mt-0.5">
                          {selectedAppForTrack.applicantName}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          {selectedAppForTrack.loanType.toUpperCase()} LOAN · ₹{selectedAppForTrack.amount.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {selectedAppForTrack.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Step Timeline */}
                    <div className="space-y-3 pl-2 border-l border-slate-800 ml-2">
                      {t.tracking.statusSteps.map((stepName, idx) => {
                        const statusMapping: Record<string, number> = {
                          submitted: 1,
                          under_review: 2,
                          docs_required: 2,
                          approved: 4,
                          disbursed: 5,
                          rejected: 1,
                        };
                        const currentRank = statusMapping[selectedAppForTrack.status] || 1;
                        const isDone = idx + 1 <= currentRank;
                        const isCurrent = idx + 1 === currentRank;

                        return (
                          <div key={idx} className="relative flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-full -ml-[23px] flex items-center justify-center text-[10px] ${
                                isDone
                                  ? 'bg-emerald-500 text-slate-950 font-bold'
                                  : 'bg-slate-800 text-slate-500'
                              }`}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span
                              className={`text-xs ${
                                isCurrent
                                  ? 'font-bold text-emerald-400'
                                  : isDone
                                  ? 'text-white'
                                  : 'text-slate-500'
                              }`}
                            >
                              {stepName}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Notification simulator */}
                    <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
                        <span>📲 WhatsApp Notification Triggered</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-mono">
                        "Dear {selectedAppForTrack.applicantName}, your {selectedAppForTrack.loanType} loan file #{selectedAppForTrack.applicationNo} is currently [{selectedAppForTrack.status.toUpperCase()}]. J S Financial Service team is coordinating with partner underwriters."
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Fixed Mobile Bottom Tab Bar (Pattern 1 from Mobile Design Reference) */}
          <div className="sticky bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 grid grid-cols-5 items-center h-16 px-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                activeTab === 'home' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-tight mt-1">
                {language === 'hinglish' ? 'Home' : 'Home'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('loans')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                activeTab === 'loans' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-tight mt-1">
                {language === 'hinglish' ? 'Loans' : 'Loans'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('insurance')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                activeTab === 'insurance' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-tight mt-1">
                {language === 'hinglish' ? 'Bima' : 'Insurance'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('govt')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                activeTab === 'govt' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck2 className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-tight mt-1">
                {language === 'hinglish' ? 'Seva' : 'Govt'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                activeTab === 'track' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Search className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-tight mt-1">
                {language === 'hinglish' ? 'Track' : 'Track'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal for 3-step digital application */}
      <LoanApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        language={language}
        initialLoanType={selectedLoanType}
        initialAmount={emiAmount}
        initialTenure={emiTenureYears}
        onSubmitSuccess={(newApp) => {
          onNewApplication(newApp);
          setSelectedAppForTrack(newApp);
          setActiveTab('track');
        }}
      />
    </div>
  );
};
