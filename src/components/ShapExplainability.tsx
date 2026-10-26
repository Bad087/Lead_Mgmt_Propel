import React, { useState } from 'react';
import { FEATURE_IMPORTANCE_LIST, SHAP_SUMMARY_FEATURES, AUDIT_SCENARIOS } from '../data/featureImportanceData';
import { HelpCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ShapExplainability: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'shap' | 'importance' | 'audit'>('shap');
  const [activeFeature, setActiveFeature] = useState<string>('lead_score');

  const activeFeatureDetail =
    SHAP_SUMMARY_FEATURES.find((f) => f.name === activeFeature) || SHAP_SUMMARY_FEATURES[0];

  return (
    <div className="space-y-6">
      {/* Formal Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>MODULE 05</span>
            <span>·</span>
            <span>MODEL INTERPRETABILITY &amp; PROVENANCE AUDIT</span>
            <span>·</span>
            <span>CHAPTERS 7.9, 7.10 &amp; 8.2</span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight mt-1">
            SHAP Global Feature Attributions &amp; Cross-Validation Audit
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Empirical impurity-based importances across four tree ensembles, TreeExplainer SHAP values (n = 500 test samples), and out-of-fold leakage verification.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setSelectedView('shap')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedView === 'shap' ? 'bg-white text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            SHAP Attributions
          </button>
          <button
            onClick={() => setSelectedView('importance')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedView === 'importance' ? 'bg-white text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            4-Tree Consensus
          </button>
          <button
            onClick={() => setSelectedView('audit')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedView === 'audit' ? 'bg-white text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Leakage Audit
          </button>
        </div>
      </div>

      {selectedView === 'shap' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left 2 Columns */}
          <div className="lg:col-span-2 p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  01. Global Mean |SHAP Value| Ranking (Figures 7.8 &amp; 7.9)
                </h2>
                <span className="text-[11px] text-slate-400">
                  Average absolute impact on model log-odds magnitude across 500 held-out test rows
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">XGBoost (Tuned)</span>
            </div>

            <div className="space-y-2.5">
              {SHAP_SUMMARY_FEATURES.map((feat) => {
                const isSelected = activeFeature === feat.name;
                return (
                  <div
                    key={feat.name}
                    onClick={() => setActiveFeature(feat.name)}
                    className={`p-3 rounded border transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-white bg-slate-950'
                        : 'border-slate-800/80 bg-slate-950/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{feat.displayName}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-[11px] text-slate-400 font-mono">{feat.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono tabular-nums">
                        <span className="text-slate-500 text-[11px]">mean(|SHAP|):</span>
                        <span className="font-semibold text-white w-12 text-right">
                          {feat.meanShap.toFixed(3)}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-1.5 bg-slate-900 rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-sky-400 transition-all duration-300"
                        style={{ width: `${(feat.meanShap / 0.55) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column */}
          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-white font-semibold text-sm border-b border-slate-800 pb-3">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>02. Variable Specification</span>
            </div>

            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase block">
                Predictor Identifier: {activeFeatureDetail.name}
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">{activeFeatureDetail.displayName}</h3>
              <div className="mt-1 text-xs text-slate-400 font-mono">
                Domain Category: {activeFeatureDetail.category} · |SHAP| = {activeFeatureDetail.meanShap.toFixed(3)}
              </div>
            </div>

            <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono tabular-nums">
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Attribution Direction:</span>
                <span
                  className={`font-semibold uppercase ${
                    activeFeatureDetail.direction === 'positive'
                      ? 'text-emerald-400'
                      : activeFeatureDetail.direction === 'negative'
                      ? 'text-rose-400'
                      : 'text-white'
                  }`}
                >
                  {activeFeatureDetail.direction}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">XGBoost Gain Share:</span>
                <span className="text-white font-bold">
                  {(activeFeatureDetail.importance * 100).toFixed(2)}%
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-1.5">
                Empirical Attribution Mechanics
              </span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded border border-slate-800">
                {activeFeatureDetail.impactDescription}
              </p>
            </div>

            <div className="p-3.5 rounded bg-slate-950 border border-slate-800 text-xs space-y-1">
              <span className="font-semibold text-slate-200 block">Methodological Note (Section 7.10)</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Correlated predictors can share or redistribute SHAP attribution. Values describe the fitted estimator behavior on this dataset rather than causal treatment effects.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'importance' && (
        <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Consensus Feature Importance Across Four Tree Ensembles (Figure 7.7)
              </h2>
              <span className="text-[11px] text-slate-400">
                Normalized feature importances comparing XGBoost (Tuned), CatBoost (Tuned), Random Forest (Tuned), and Extra Trees
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">Top 15 Predictors</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Predictor Variable</th>
                  <th className="py-2.5 px-3">Domain</th>
                  <th className="py-2.5 px-3 text-right">Consensus Mean</th>
                  <th className="py-2.5 px-3 text-right">XGBoost (Tuned)</th>
                  <th className="py-2.5 px-3 text-right">CatBoost (Tuned)</th>
                  <th className="py-2.5 px-3 text-right">Random Forest</th>
                  <th className="py-2.5 px-3 text-right">Extra Trees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
                {FEATURE_IMPORTANCE_LIST.map((f, idx) => (
                  <tr key={f.feature} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-slate-500">#{idx + 1}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="font-semibold text-white">{f.displayName}</span>
                      <span className="text-[10px] text-slate-500 font-mono block">{f.feature}</span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-400">{f.category}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-white">
                      {(f.meanImportance * 100).toFixed(2)}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-sky-400">
                      {(f.xgboost * 100).toFixed(2)}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-300">
                      {(f.catboost * 100).toFixed(2)}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-300">
                      {(f.randomForest * 100).toFixed(2)}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400">
                      {(f.extraTrees * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedView === 'audit' && (
        <div className="space-y-6">
          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Methodological Leakage Safeguards (Report Section 8.2)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>8.2.1 Out-of-Fold Smoothed Target Encoding</span>
                </span>
                <p className="text-slate-400 leading-relaxed">
                  For the 86-category <code className="text-slate-200 font-mono">preferred_location</code> attribute, smoothed target encoding (m = 20) was computed strictly out-of-fold on the training split. Naive in-sample encoding artificially inflates training AUC to 0.5587, whereas out-of-fold encoding yields 0.4993 (matching the honest test AUC of 0.5130).
                </p>
              </div>

              <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>8.2.2 Provenance Audit of lead_score</span>
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Because <code className="text-slate-200 font-mono">lead_score</code> contributes ~19.1% mean importance, its provenance was audited to confirm it represents pre-conversion behavioral scoring. Even with <code className="text-slate-200 font-mono">lead_score</code> included, the empirical ceiling remains ~77.9%, ruling out deterministic target leakage.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-white mb-4">
              Verification &amp; Testing Protocol Matrix (Report Table 8.1)
            </h3>
            <div className="space-y-2.5">
              {AUDIT_SCENARIOS.map((scenario) => (
                <div
                  key={scenario.id}
                  className="p-3.5 rounded bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{scenario.id}</span>
                      <span className="text-slate-600">·</span>
                      <span className="font-semibold text-white">{scenario.scenario}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{scenario.procedure}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 font-mono">
                    <span className="text-slate-400 text-[11px]">{scenario.expected}</span>
                    <span className="text-emerald-400 text-[11px] font-semibold uppercase">
                      [{scenario.status}]
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
