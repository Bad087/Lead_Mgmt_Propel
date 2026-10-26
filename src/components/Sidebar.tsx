import React from 'react';
import { TabType } from '../types';
import {
  LayoutDashboard,
  Calculator,
  GitCompare,
  Sliders,
  HelpCircle,
  Database,
  Award,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
}) => {
  const menuItems: { id: TabType; index: string; label: string; icon: React.ReactNode; meta?: string }[] = [
    {
      id: 'overview',
      index: '01',
      label: 'Executive Summary',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'predictor',
      index: '02',
      label: 'Lead Valuation Engine',
      icon: <Calculator className="w-4 h-4" />,
      meta: 'Live',
    },
    {
      id: 'models',
      index: '03',
      label: 'Model Matrix (24)',
      icon: <GitCompare className="w-4 h-4" />,
      meta: 'n=24',
    },
    {
      id: 'confusion-roc',
      index: '04',
      label: 'Threshold & ROC Studio',
      icon: <Sliders className="w-4 h-4" />,
    },
    {
      id: 'shap',
      index: '05',
      label: 'SHAP & Leakage Audit',
      icon: <HelpCircle className="w-4 h-4" />,
    },
    {
      id: 'leads',
      index: '06',
      label: 'Lead Repository',
      icon: <Database className="w-4 h-4" />,
      meta: '12,000',
    },
    {
      id: 'defense',
      index: '07',
      label: 'Academic Defense Dossier',
      icon: <Award className="w-4 h-4" />,
      meta: 'VTU',
    },
  ];

  return (
    <aside
      className={`shrink-0 bg-slate-950 border-r border-slate-800 transition-all duration-200 flex flex-col justify-between ${
        collapsed ? 'w-14' : 'w-64'
      }`}
    >
      <div className="p-2.5">
        {/* Collapse Header */}
        <div className="flex items-center justify-between px-2 py-2 mb-2 border-b border-slate-900">
          {!collapsed && (
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
              Analytical Modules
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-900 transition-colors ml-auto"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded text-xs transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                }`}
                title={collapsed ? `${item.index}. ${item.label}` : undefined}
              >
                <div className={isActive ? 'text-white' : 'text-slate-500'}>{item.icon}</div>
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between text-left truncate">
                    <span className="truncate">
                      <span className="font-mono text-[10px] text-slate-500 mr-1.5">{item.index}.</span>
                      {item.label}
                    </span>
                    {item.meta && (
                      <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-1">
                        {item.meta}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Institutional Reference Footer */}
      {!collapsed ? (
        <div className="p-4 m-2.5 rounded bg-slate-900/70 border border-slate-800 text-xs space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Selected Estimator
          </div>
          <div className="text-white font-semibold text-xs">XGBoost (Tuned)</div>
          <div className="text-[11px] text-slate-400 font-mono flex justify-between pt-1 border-t border-slate-800">
            <span>CV: 0.7833</span>
            <span>Test: 0.7762</span>
          </div>
          <div className="text-[10px] text-slate-500 pt-1">
            B.M.S. College of Engineering · Dept. of ISE
          </div>
        </div>
      ) : (
        <div className="p-2 text-center text-[10px] text-slate-400 font-mono border-t border-slate-800">
          77.6%
        </div>
      )}
    </aside>
  );
};
