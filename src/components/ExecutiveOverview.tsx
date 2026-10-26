import React, { useState } from 'react';
import { CITY_METRICS_SUMMARY, SOURCE_PERFORMANCE } from '../data/leadsDataset';
import {
  TrendingUp,
  Target,
  ArrowUpRight,
  Database,
  Building,
  CheckCircle2,
  ChevronRight,
  Filter,
  Calculator,
} from 'lucide-react';

interface ExecutiveOverviewProps {
  onNavigateToPredictor: () => void;
  onNavigateToModels: () => void;
  onNavigateToDefense: () => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  onNavigateToPredictor,
  onNavigateToModels,
  onNavigateToDefense,
}) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const filteredCityData = selectedCity
    ? CITY_METRICS_SUMMARY.filter((c) => c.city === selectedCity)
    : CITY_METRICS_SUMMARY;

  return (
    <div className="space-y-6">
      {/* Formal Institutional Banner */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mb-2">
            <span>MODULE 01</span>
            <span>·</span>
            <span>EXECUTIVE RESEARCH SUMMARY</span>
            <span>·</span>
            <span>B.M.S. COLLEGE OF ENGINEERING · PROJECT WORK-2 [23IS7PWPW2]</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
            Comparative Evaluation of Machine Learning &amp; Neural Networks for Real Estate Lead Conversion
          </h1>
          <p className="mt-2.5 text-sm text-slate-300 leading-relaxed max-w-3xl">
            Empirical classification benchmark across <strong className="text-white">24 model configurations</strong> evaluated on{' '}
            <strong className="text-white">12,000 real estate &amp; construction leads</strong> (84 encoded features, stratified 80:20 train/test split, out-of-fold target encoding, and SHAP attribution analysis).
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToPredictor}
              className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs rounded transition-colors flex items-center gap-2"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Open Prospective Lead Valuation Engine</span>
            </button>
            <button
              onClick={onNavigateToModels}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs rounded border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span>Inspect 24-Model Evaluation Matrix</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={onNavigateToDefense}
              className="px-4 py-2 bg-transparent hover:bg-slate-800/60 text-slate-300 font-medium text-xs rounded border border-slate-800 transition-colors"
            >
              <span>Review Academic Defense Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quantitative KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Sample Size (N)</span>
            <Database className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">12,000</span>
            <span className="text-xs text-slate-400 font-mono">84 Features</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2 font-mono">
            <span>Train: 9,600</span>
            <span>Test: 2,400</span>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Positive Conversion Share</span>
            <Target className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">27.00%</span>
            <span className="text-xs text-slate-400 font-mono">3,240 Leads</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2 font-mono">
            <span>Baseline (y=0): 73.00%</span>
            <span>Ratio: 2.70:1</span>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Selected Production Model</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">77.62%</span>
            <span className="text-xs text-slate-400 font-mono">Test Acc</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2 font-mono">
            <span>XGBoost (Tuned)</span>
            <span>AUC: 0.7807</span>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Empirical Accuracy Ceiling</span>
            <ArrowUpRight className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-sky-400 font-mono tabular-nums">77.92%</span>
            <span className="text-xs text-emerald-400 font-mono">+4.92% Lift</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2 font-mono">
            <span>Soft-Voting Ensemble</span>
            <span>AUC: 0.7823</span>
          </div>
        </div>
      </div>

      {/* Methodological Note */}
      <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white font-mono">
              Methodological Finding · Empirical Ceiling vs. Aspirational Benchmark
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-4xl leading-relaxed">
              Across all 24 evaluated configurations (linear models, support vector machines, bagged/boosted tree ensembles, and deep residual neural networks), test accuracy converges between <strong className="text-slate-200">76.62% and 77.92%</strong> (within the binomial standard error of ±0.85% on 2,400 test rows), delivering a verified ~5.0 percentage point lift over the 73.00% majority-class baseline without test-set leakage.
            </p>
          </div>
        </div>
        <button
          onClick={onNavigateToDefense}
          className="text-xs text-white hover:text-slate-300 font-medium whitespace-nowrap shrink-0 flex items-center gap-1 border border-slate-700 px-3 py-1.5 rounded bg-slate-950"
        >
          <span>Full Statistical Proof</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Analytical Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Regional Performance Table & Bars */}
        <div className="lg:col-span-2 p-6 rounded-lg bg-slate-900 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400" />
                <span>01. Regional Metropolitan Conversion &amp; Mandate Volume</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Stratified across 13 Indian real estate jurisdictions (Click any row to isolate market)
              </p>
            </div>
            {selectedCity && (
              <button
                onClick={() => setSelectedCity(null)}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800"
              >
                <Filter className="w-3 h-3" />
                <span>Clear Filter ({selectedCity})</span>
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {filteredCityData.map((item) => {
              const isSelected = selectedCity === item.city;
              return (
                <div
                  key={item.city}
                  onClick={() => setSelectedCity(isSelected ? null : item.city)}
                  className={`p-3 rounded border transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-white bg-slate-950'
                      : 'border-slate-800/80 bg-slate-950/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white w-28">{item.city}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                        n = {item.totalLeads.toLocaleString()} ({item.converted} converted)
                      </span>
                    </div>
                    <div className="flex items-center gap-4 font-mono tabular-nums">
                      <span className="text-slate-400 text-[11px]">
                        Mean Budget: <strong className="text-slate-200">₹{(item.avgBudget / 10000000).toFixed(2)} Cr</strong>
                      </span>
                      <span className="font-semibold text-white w-12 text-right">
                        {(item.conversionRate * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-slate-300 transition-all duration-300"
                      style={{ width: `${(item.conversionRate / 0.35) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Acquisition Source Yield */}
        <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="pb-4 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white">02. Acquisition Channel Yield</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Empirical conversion rate and mean lead score across 12 channels
              </p>
            </div>

            <div className="divide-y divide-slate-800/60">
              {SOURCE_PERFORMANCE.slice(0, 9).map((src) => (
                <div key={src.source} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-slate-200">{src.source}</span>
                    <span className="text-[11px] text-slate-500 block font-mono tabular-nums">
                      n = {src.leads.toLocaleString()} · Mean Score {src.avgScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-right font-mono tabular-nums">
                    <span
                      className={`font-semibold ${
                        src.conversionRate >= 0.30
                          ? 'text-emerald-400'
                          : src.conversionRate >= 0.25
                          ? 'text-white'
                          : 'text-slate-400'
                      }`}
                    >
                      {(src.conversionRate * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 font-mono space-y-1">
            <div className="flex items-center justify-between">
              <span>Highest Yield Channel:</span>
              <span className="text-emerald-400 font-semibold">Referral (36.2%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Lowest Yield Channel:</span>
              <span className="text-slate-300">Email Campaign (20.1%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Architecture Summary Table */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-white">
              03. Architectural Family Synthesis (Held-Out Test Set · n = 2,400)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Summary of peak performance across the four evaluated paradigm families
            </p>
          </div>
          <button
            onClick={onNavigateToModels}
            className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1"
          >
            <span>Complete 24-Model Table</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">01 · Tree Ensembles</div>
            <div className="text-lg font-bold text-white font-mono tabular-nums mt-1">
              77.92% Acc · 0.7823 AUC
            </div>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Soft-Voting Ensemble &amp; Tuned XGBoost achieve highest test accuracy and 3-fold CV stability.
            </p>
          </div>

          <div className="p-4 rounded bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">02 · Deep Neural Nets</div>
            <div className="text-lg font-bold text-white font-mono tabular-nums mt-1">
              77.00% Acc · 0.7781 AUC
            </div>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Residual MLP (skip connections + BatchNorm) leads deep architectures with early stopping at 16 epochs.
            </p>
          </div>

          <div className="p-4 rounded bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">03 · Linear &amp; Kernel</div>
            <div className="text-lg font-bold text-white font-mono tabular-nums mt-1">
              77.50% Acc · 0.7808 AUC
            </div>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              L2-regularized Logistic Regression &amp; Linear SVM match complex trees within 0.42 percentage points.
            </p>
          </div>

          <div className="p-4 rounded bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">04 · Imbalance-Weighted</div>
            <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums mt-1">
              72.84% Rec · 0.5825 F1
            </div>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Class-weighted &amp; SMOTE pipelines increase positive converter capture from ~39% to over 70%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
