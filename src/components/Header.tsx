import React from 'react';
import { AppViewMode, Language } from '../types';
import { translations } from '../data/translations';
import { Languages, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentView: AppViewMode;
  onViewChange: (view: AppViewMode) => void;
  language: Language;
  onLanguageToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  language,
  onLanguageToggle,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onViewChange('mobile');
        }}
        className="text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-emerald-400 transition-colors flex items-center gap-2"
      >
        <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-sm">
          JS
        </span>
        {t.brand}
      </a>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => onViewChange('mobile')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'mobile' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5' : ''
          }`}
        >
          {t.nav.mobileApp}
        </button>
        <button
          onClick={() => onViewChange('admin')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'admin' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5' : ''
          }`}
        >
          {t.nav.adminPanel}
        </button>
        <button
          onClick={() => onViewChange('scope')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'scope' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5' : ''
          }`}
        >
          {t.nav.scopeDoc}
        </button>
        <button
          onClick={() => onViewChange('estimator')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'estimator' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5' : ''
          }`}
        >
          {t.nav.costEstimator}
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onLanguageToggle}
          aria-label="Toggle language between English and Hinglish"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          <Languages className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.nav.switchLanguage}</span>
        </button>
      </div>
    </header>
  );
};
