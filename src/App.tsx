import React, { useState } from 'react';
import { AppViewMode, Language, LoanApplication, ServiceInquiry, ApplicationStatus } from './types';
import { Header } from './components/Header';
import { MobileAppSimulator } from './components/mobile/MobileAppSimulator';
import { AdminPanel } from './components/admin/AdminPanel';
import { TechScopeDoc } from './components/scope/TechScopeDoc';
import { CostEstimator } from './components/calculator/CostEstimator';
import { initialLoanApplications, initialServiceInquiries } from './data/defaultData';
import { translations } from './data/translations';
import { Smartphone, Building, Layers, Calculator, ShieldCheck, PhoneCall, Mail } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppViewMode>('mobile');
  const [language, setLanguage] = useState<Language>('hinglish');
  const [applications, setApplications] = useState<LoanApplication[]>(initialLoanApplications);
  const [serviceInquiries, setServiceInquiries] = useState<ServiceInquiry[]>(initialServiceInquiries);

  const t = translations[language];

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === 'hinglish' ? 'en' : 'hinglish'));
  };

  const handleNewApplication = (newApp: LoanApplication) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  const handleNewServiceInquiry = (newInq: ServiceInquiry) => {
    setServiceInquiries((prev) => [newInq, ...prev]);
  };

  const handleUpdateApplicationStatus = (
    appId: string,
    newStatus: ApplicationStatus,
    remarks?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              status: newStatus,
              remarks: remarks || app.remarks,
            }
          : app
      )
    );
  };

  const handleUpdateServiceStatus = (
    inqId: string,
    newStatus: 'open' | 'in_progress' | 'completed'
  ) => {
    setServiceInquiries((prev) =>
      prev.map((inq) => (inq.id === inqId ? { ...inq, status: newStatus } : inq))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 3-zone Header Contract */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        language={language}
        onLanguageToggle={handleLanguageToggle}
      />

      {/* Quick Navigation Strip (Mobile / Responsive) */}
      <div className="md:hidden flex items-center justify-around border-b border-slate-800 bg-slate-900/60 px-2 py-2 overflow-x-auto text-xs">
        <button
          onClick={() => setCurrentView('mobile')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap shrink-0 transition-colors ${
            currentView === 'mobile' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          {t.nav.mobileApp}
        </button>
        <button
          onClick={() => setCurrentView('admin')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap shrink-0 transition-colors ${
            currentView === 'admin' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          {t.nav.adminPanel}
        </button>
        <button
          onClick={() => setCurrentView('scope')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap shrink-0 transition-colors ${
            currentView === 'scope' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          {t.nav.scopeDoc}
        </button>
        <button
          onClick={() => setCurrentView('estimator')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap shrink-0 transition-colors ${
            currentView === 'estimator' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          {t.nav.costEstimator}
        </button>
      </div>

      {/* Main View Container */}
      <main className="flex-1 flex flex-col">
        {currentView === 'mobile' && (
          <MobileAppSimulator
            language={language}
            onLanguageToggle={handleLanguageToggle}
            applications={applications}
            onNewApplication={handleNewApplication}
            onNewServiceInquiry={handleNewServiceInquiry}
          />
        )}

        {currentView === 'admin' && (
          <AdminPanel
            language={language}
            applications={applications}
            serviceInquiries={serviceInquiries}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
            onUpdateServiceStatus={handleUpdateServiceStatus}
          />
        )}

        {currentView === 'scope' && <TechScopeDoc language={language} />}

        {currentView === 'estimator' && <CostEstimator language={language} />}
      </main>

      {/* Quiet, Anti-Slop Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 px-4 sm:px-8 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">J S Financial Service</span>
            <span>·</span>
            <span>Loans, Insurance & Citizen Services Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Contact: rajivkumarlic115@gmail.com</span>
            <span>·</span>
            <span>RBI / NBFC Compliant Architecture</span>
            <span>·</span>
            <span>© 2026 J S Financial Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
