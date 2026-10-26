import React from 'react';
import { TabType } from '../types';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Calculator } from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenQuickSim: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenQuickSim }) => {
  const { user, setIsAuthModalOpen } = useAuth();

  const navLinks: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Executive Summary' },
    { id: 'predictor', label: 'Lead Valuation' },
    { id: 'models', label: 'Model Matrix (24)' },
    { id: 'confusion-roc', label: 'Threshold & ROC' },
    { id: 'shap', label: 'SHAP & Audit' },
    { id: 'leads', label: 'Lead Repository' },
    { id: 'defense', label: 'Academic Defense' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element, whitespace-nowrap shrink-0) */}
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('overview');
          }}
          className="text-sm font-bold tracking-wider uppercase text-white hover:text-slate-300 transition-colors whitespace-nowrap shrink-0 font-mono"
        >
          PROPEL·IQ · INSTITUTIONAL ANALYTICS
        </a>

        {/* Zone 2: Navigation Links (Single-line whitespace-nowrap shrink-0) */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-medium text-slate-400">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-4 border-b-2 ${
                  isActive
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Authentication Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenQuickSim}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-white hover:bg-slate-200 rounded transition-colors whitespace-nowrap shrink-0"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Run Valuation</span>
          </button>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors text-xs whitespace-nowrap shrink-0"
            title="Switch Institutional Role / Authenticate"
          >
            <span className="font-mono text-[11px] font-bold text-slate-300">
              [{user?.avatarInitials || 'GU'}]
            </span>
            <span className="hidden sm:inline text-xs font-medium text-white truncate max-w-[130px]">
              {user?.name.split('&')[0].trim() || 'Guest Session'}
            </span>
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
