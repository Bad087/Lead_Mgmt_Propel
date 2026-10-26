import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { X, ShieldCheck, Briefcase, GraduationCap, Building2, Check, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginAs, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'persona' | 'custom'>('persona');
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customRole, setCustomRole] = useState<UserRole>('panel_reviewer');
  const [customOrg, setCustomOrg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;
    loginAs(customRole);
  };

  const personaList: {
    role: UserRole;
    title: string;
    name: string;
    desc: string;
    icon: React.ReactNode;
    code: string;
  }[] = [
    {
      role: 'panel_reviewer',
      title: 'Senior Capstone Evaluation Panel',
      name: 'Prof. Manjula S & Dr. Bheemsha Arya',
      desc: 'B.M.S. College of Engineering evaluation workflow with methodological audit, statistical verification, and defense dossier.',
      icon: <GraduationCap className="w-4 h-4 text-slate-300" />,
      code: 'ROLE-01 · ACADEMIC PANEL',
    },
    {
      role: 'lead_analyst',
      title: 'Lead ML / Data Science Researcher',
      name: 'Hritik H & Capstone Engineering Team',
      desc: 'Complete access to 24-model benchmarks, out-of-fold target encoding diagnostics, SHAP attributions, and hyperparameter configs.',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      code: 'ROLE-02 · RESEARCH ENG.',
    },
    {
      role: 'sales_director',
      title: 'Vice President of Real Estate Sales',
      name: 'Rajesh Malhotra',
      desc: 'High-value customer underwriting, conversion velocity, risk-adjusted commission projections, and site walkthrough SLAs.',
      icon: <Building2 className="w-4 h-4 text-sky-400" />,
      code: 'ROLE-03 · EXECUTIVE OPS',
    },
    {
      role: 'broker',
      title: 'Senior Residential & Commercial Advisor',
      name: 'Priya Narayanan',
      desc: 'Lead prioritization ledger, buyer intent telemetry, TF-IDF property sequence matching, and rapid follow-up protocols.',
      icon: <Briefcase className="w-4 h-4 text-amber-400" />,
      code: 'ROLE-04 · FIELD ADVISORY',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 uppercase">
              <span>INSTITUTIONAL ACCESS CONTROL</span>
              <span>·</span>
              <span>SESSION AUTHENTICATION</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">Select Workspace Role or Sign In</h2>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/60">
          <button
            onClick={() => setActiveTab('persona')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'persona'
                ? 'border-white text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Institutional Role Profiles
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'custom'
                ? 'border-white text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Custom Credential Sign In
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'persona' ? (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-400 mb-3">
                Select an authorized institutional profile to configure workspace permissions and analytical views:
              </p>
              {personaList.map((item) => {
                const isSelected = user?.role === item.role;
                return (
                  <button
                    key={item.role}
                    onClick={() => loginAs(item.role)}
                    className={`w-full text-left p-4 rounded border transition-colors flex items-start gap-4 ${
                      isSelected
                        ? 'border-white bg-slate-950'
                        : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold text-white text-xs flex items-center gap-2">
                          <span>{item.title}</span>
                          {isSelected && (
                            <span className="text-[10px] font-mono text-emerald-400 uppercase">
                              [ACTIVE]
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">{item.code}</span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium mt-0.5">{item.name}</div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="shrink-0 self-center">
                      <div
                        className={`w-7 h-7 rounded flex items-center justify-center ${
                          isSelected
                            ? 'bg-white text-slate-950'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name / Evaluator Identity
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. M. K. Nalini"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Institutional Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. evaluator@bmsce.ac.in"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Department / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dept. of Information Science & Engineering, BMSCE"
                  value={customOrg}
                  onChange={(e) => setCustomOrg(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Assigned Access Role
                </label>
                <select
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-slate-600"
                >
                  <option value="panel_reviewer">Senior Capstone Evaluation Panel</option>
                  <option value="lead_analyst">Lead ML / Data Science Researcher</option>
                  <option value="sales_director">Vice President of Real Estate Sales</option>
                  <option value="broker">Senior Property Specialist</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-200 text-slate-950 font-semibold rounded text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>ACTIVE USER: {user?.name || 'GUEST'}</span>
          <span>ROLE: {user?.role?.toUpperCase() || 'UNASSIGNED'}</span>
        </div>
      </div>
    </div>
  );
};
