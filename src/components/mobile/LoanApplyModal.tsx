import React, { useState } from 'react';
import { LoanType, LoanApplication, Language } from '../../types';
import { translations } from '../../data/translations';
import { X, CheckCircle, Upload, ShieldCheck, ArrowRight, ArrowLeft, Phone, User, Building, FileText } from 'lucide-react';

interface LoanApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialLoanType?: LoanType;
  initialAmount?: number;
  initialTenure?: number;
  onSubmitSuccess: (application: LoanApplication) => void;
}

export const LoanApplyModal: React.FC<LoanApplyModalProps> = ({
  isOpen,
  onClose,
  language,
  initialLoanType = 'home',
  initialAmount = 2500000,
  initialTenure = 15,
  onSubmitSuccess,
}) => {
  const t = translations[language];

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loanType, setLoanType] = useState<LoanType>(initialLoanType);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [employmentType, setEmploymentType] = useState<'salaried' | 'self_employed' | 'business_owner'>('salaried');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(65000);
  const [amount, setAmount] = useState<number>(initialAmount);
  const [tenureYears, setTenureYears] = useState<number>(initialTenure);

  const [uploadedDocs, setUploadedDocs] = useState({
    panCard: false,
    aadhaarCard: false,
    salarySlipsOrITR: false,
    bankStatement: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<LoanApplication | null>(null);

  if (!isOpen) return null;

  const toggleDoc = (key: keyof typeof uploadedDocs) => {
    setUploadedDocs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAllDocsSimulate = () => {
    setUploadedDocs({
      panCard: true,
      aadhaarCard: true,
      salarySlipsOrITR: true,
      bankStatement: true,
    });
  };

  // EMI calculation helper
  const annualRate = loanType === 'home' ? 8.4 : loanType === 'personal' ? 10.5 : 12.0;
  const monthlyRate = annualRate / (12 * 100);
  const totalMonths = tenureYears * 12;
  const calculatedEMI = Math.round(
    (amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const prefix = loanType === 'home' ? 'HL' : loanType === 'personal' ? 'PL' : loanType === 'business' ? 'BL' : 'LAP';
    const appNo = `JS-${prefix}-2026-${randomSuffix}`;

    const newApp: LoanApplication = {
      id: `app-${Date.now()}`,
      applicationNo: appNo,
      applicantName: fullName.trim() || 'Rajiv Kumar',
      phone: phone.trim() || '+91 98765 43210',
      email: email.trim() || 'rajivkumarlic115@gmail.com',
      city: city.trim() || 'Patna, Bihar',
      loanType,
      amount,
      tenureYears,
      monthlyIncome,
      employmentType,
      cibilScore: 750 + Math.floor(Math.random() * 45),
      status: 'submitted',
      appliedDate: new Date().toISOString().split('T')[0],
      remarks: 'Application submitted via customer mobile app with digital KYC checklist.',
      uploadedDocs,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedApp(newApp);
      onSubmitSuccess(newApp);
    }, 600);
  };

  const resetForm = () => {
    setStep(1);
    setSubmittedApp(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 my-8 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              {language === 'hinglish' ? 'Loan Application Form' : 'Loan Application Form'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'hinglish'
                ? 'J S Financial Service - 3 aasan steps me loan apply karein'
                : 'J S Financial Service - Apply in 3 simple steps'}
            </p>
          </div>
          <button
            onClick={resetForm}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen */}
        {submittedApp ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">{t.applyModal.successTitle}</h4>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              {language === 'hinglish'
                ? `Namaste ${submittedApp.applicantName}! Aapka ${submittedApp.loanType.toUpperCase()} Loan aavedan jama ho chuka hai.`
                : `Thank you ${submittedApp.applicantName}! Your ${submittedApp.loanType.toUpperCase()} Loan application has been received.`}
            </p>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 text-left max-w-md mx-auto space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">{t.applyModal.refNumber}:</span>
                <span className="font-mono font-bold text-emerald-400">{submittedApp.applicationNo}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">{t.calculator.amount}:</span>
                <span className="font-bold text-white">₹{submittedApp.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">{t.calculator.monthlyEMI}:</span>
                <span className="font-bold text-emerald-400">₹{calculatedEMI.toLocaleString('en-IN')}/mo</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Status:</span>
                <span className="text-amber-400 font-medium">Under Review / Jaanch me</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-xs text-emerald-200 text-left flex items-start gap-2">
              <span className="text-base">📲</span>
              <div>
                <p className="font-semibold">{t.applyModal.smsNotice}</p>
                <p className="text-emerald-300/80 mt-0.5">
                  {language === 'hinglish'
                    ? 'J S Financial Service ka loan officer aapse agle 2 se 4 ghante me sampark karega.'
                    : 'Our dedicated loan manager will contact you within 2 to 4 hours for sanction processing.'}
                </p>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
            >
              {language === 'hinglish' ? 'Ho Gaya / Done' : 'Close & View Application'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Step Indicators */}
            <div className="flex items-center justify-between text-xs font-medium pb-2 border-b border-slate-800">
              <span className={`flex items-center gap-1.5 ${step === 1 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>1</span>
                {t.applyModal.step1}
              </span>
              <span className={`flex items-center gap-1.5 ${step === 2 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>2</span>
                {t.applyModal.step2}
              </span>
              <span className={`flex items-center gap-1.5 ${step === 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>3</span>
                {t.applyModal.step3}
              </span>
            </div>

            {/* Step 1: Personal & Employment details */}
            {step === 1 && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {language === 'hinglish' ? 'Loan ka Prakar / Loan Category' : 'Select Loan Type'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['home', 'personal', 'business'] as LoanType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setLoanType(type)}
                        className={`py-2 px-3 text-xs rounded-xl font-medium border text-center transition-all ${
                          loanType === type
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-semibold'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {type === 'home'
                          ? language === 'hinglish' ? 'Home Loan (Ghar)' : 'Home Loan'
                          : type === 'personal'
                          ? 'Personal Loan'
                          : language === 'hinglish' ? 'Business Loan' : 'Business Loan'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {t.applyModal.fullName} *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rajiv Kumar"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {t.applyModal.mobile} *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {t.applyModal.city}
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Patna / Ranchi / Delhi"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {t.applyModal.email}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rajiv@gmail.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.applyModal.employment}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setEmploymentType('salaried')}
                      className={`py-2 px-2 text-xs rounded-xl border text-center transition-all ${
                        employmentType === 'salaried'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-semibold'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {t.applyModal.salaried}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmploymentType('self_employed')}
                      className={`py-2 px-2 text-xs rounded-xl border text-center transition-all ${
                        employmentType === 'self_employed'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-semibold'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {t.applyModal.selfEmployed}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmploymentType('business_owner')}
                      className={`py-2 px-2 text-xs rounded-xl border text-center transition-all ${
                        employmentType === 'business_owner'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-semibold'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {t.applyModal.business}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.applyModal.monthlyIncome}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      step={5000}
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    <span className="text-xs text-slate-400 shrink-0">
                      ₹{(monthlyIncome / 1000).toFixed(0)}k / month
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!fullName) setFullName('Rajiv Kumar');
                      if (!phone) setPhone('+91 98350 44129');
                      setStep(2);
                    }}
                    className="flex items-center gap-1.5 py-2 px-5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-xs transition-colors"
                  >
                    <span>{language === 'hinglish' ? 'Aage Badhein' : 'Next: Loan Amount'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Loan Amount & Tenure */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-slate-300">{t.calculator.amount}</label>
                    <span className="text-base font-bold text-emerald-400 font-mono">
                      ₹{amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={10000000}
                    step={50000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>₹1 Lakh</span>
                    <span>₹50 Lakh</span>
                    <span>₹1 Crore</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-slate-300">{t.calculator.tenure}</label>
                    <span className="text-base font-bold text-white font-mono">
                      {tenureYears} {language === 'hinglish' ? 'Saal' : 'Years'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>1 Year</span>
                    <span>15 Years</span>
                    <span>30 Years</span>
                  </div>
                </div>

                {/* Live Estimated Card */}
                <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700/80 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">{t.calculator.monthlyEMI}:</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">
                      ₹{calculatedEMI.toLocaleString('en-IN')} / mo
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>{language === 'hinglish' ? 'Estimated Byaaj Dar' : 'Benchmark Interest Rate'}:</span>
                    <span className="text-white font-medium">{annualRate}% p.a.</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>{language === 'hinglish' ? 'Partner Banks' : 'Lender Network'}:</span>
                    <span className="text-slate-300">SBI, HDFC, ICICI, Bajaj Finserv</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 py-2 px-3 text-slate-400 hover:text-white text-xs font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{language === 'hinglish' ? 'Peeche' : 'Back'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex items-center gap-1.5 py-2 px-5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-xs transition-colors"
                  >
                    <span>{language === 'hinglish' ? 'Kagazat Upload Karein' : 'Next: Upload Documents'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Document Checklist & Upload */}
            {step === 3 && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    {language === 'hinglish'
                      ? 'Neeche diye gaye zaroori kagazat select ya upload karein:'
                      : 'Please check or simulate uploading the mandatory KYC documents:'}
                  </p>
                  <button
                    type="button"
                    onClick={handleAllDocsSimulate}
                    className="text-[11px] text-emerald-400 hover:underline font-semibold"
                  >
                    {language === 'hinglish' ? 'Sabhi Select Karein' : 'Select All Ready'}
                  </button>
                </div>

                <div className="space-y-2">
                  <div
                    onClick={() => toggleDoc('panCard')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      uploadedDocs.panCard
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center ${uploadedDocs.panCard ? 'bg-emerald-500 text-slate-950' : 'border border-slate-600'}`}>
                        {uploadedDocs.panCard && <CheckCircle className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold">{t.applyModal.panDoc}</p>
                        <p className="text-[10px] text-slate-400">Identity verification & CIBIL check</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">
                      {uploadedDocs.panCard ? 'Uploaded ✓' : 'Attach File'}
                    </span>
                  </div>

                  <div
                    onClick={() => toggleDoc('aadhaarCard')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      uploadedDocs.aadhaarCard
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center ${uploadedDocs.aadhaarCard ? 'bg-emerald-500 text-slate-950' : 'border border-slate-600'}`}>
                        {uploadedDocs.aadhaarCard && <CheckCircle className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold">{t.applyModal.aadhaarDoc}</p>
                        <p className="text-[10px] text-slate-400">Address proof & OTP e-KYC</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">
                      {uploadedDocs.aadhaarCard ? 'Uploaded ✓' : 'Attach File'}
                    </span>
                  </div>

                  <div
                    onClick={() => toggleDoc('salarySlipsOrITR')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      uploadedDocs.salarySlipsOrITR
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center ${uploadedDocs.salarySlipsOrITR ? 'bg-emerald-500 text-slate-950' : 'border border-slate-600'}`}>
                        {uploadedDocs.salarySlipsOrITR && <CheckCircle className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold">{t.applyModal.incomeDoc}</p>
                        <p className="text-[10px] text-slate-400">Income eligibility proof</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">
                      {uploadedDocs.salarySlipsOrITR ? 'Uploaded ✓' : 'Attach File'}
                    </span>
                  </div>

                  <div
                    onClick={() => toggleDoc('bankStatement')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      uploadedDocs.bankStatement
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center ${uploadedDocs.bankStatement ? 'bg-emerald-500 text-slate-950' : 'border border-slate-600'}`}>
                        {uploadedDocs.bankStatement && <CheckCircle className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold">{t.applyModal.bankDoc}</p>
                        <p className="text-[10px] text-slate-400">Banking history & cashflow check</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">
                      {uploadedDocs.bankStatement ? 'Uploaded ✓' : 'Attach File'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1 py-2 px-3 text-slate-400 hover:text-white text-xs font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{language === 'hinglish' ? 'Peeche' : 'Back'}</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 py-2.5 px-6 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>{t.applyModal.submitApp}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
