import React, { useState, useMemo } from 'react';
import { ALL_MODELS_BENCHMARK, THRESHOLD_POINTS } from '../data/modelsData';
import { Sliders, TrendingUp, Info } from 'lucide-react';

export const ConfusionRocStudio: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>('xgboost_tuned_selected');
  const [sliderThreshold, setSliderThreshold] = useState<number>(0.50);

  const model = useMemo(
    () => ALL_MODELS_BENCHMARK.find((m) => m.id === selectedModelId) || ALL_MODELS_BENCHMARK[6],
    [selectedModelId]
  );

  const thresholdMetrics = useMemo(() => {
    const closest = THRESHOLD_POINTS.reduce((prev, curr) =>
      Math.abs(curr.threshold - sliderThreshold) < Math.abs(prev.threshold - sliderThreshold) ? curr : prev
    );
    return closest;
  }, [sliderThreshold]);

  const tnRate = ((model.tn / (model.tn + model.fp)) * 100).toFixed(1);
  const fpRate = ((model.fp / (model.tn + model.fp)) * 100).toFixed(1);
  const fnRate = ((model.fn / (model.fn + model.tp)) * 100).toFixed(1);
  const tpRate = ((model.tp / (model.fn + model.tp)) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Formal Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>MODULE 04</span>
            <span>·</span>
            <span>THRESHOLD &amp; ROC DIAGNOSTICS</span>
            <span>·</span>
            <span>HELD-OUT TEST PARTITION (N = 2,400)</span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight mt-1">
            Confusion Matrix, ROC Trajectory &amp; Operating Threshold Analysis
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Evaluate classification error trade-offs (False Positives vs. False Negatives) and simulate decision thresholds aligned with sales follow-up capacity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 whitespace-nowrap font-mono">Estimator:</label>
          <select
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs font-medium text-white focus:outline-none focus:border-slate-500"
          >
            {ALL_MODELS_BENCHMARK.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.family})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Operating Threshold Simulator */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-white">
              01. Operating Decision Threshold Simulator (P(y = 1 | x) ≥ τ)
            </h2>
          </div>
          <div className="text-xs font-mono text-slate-300">
            Selected Cutoff τ = <strong className="text-sm text-white">{sliderThreshold.toFixed(2)}</strong>
          </div>
        </div>

        <p className="text-xs text-slate-400 max-w-4xl leading-relaxed">
          Selecting an operating threshold depends on the relative business cost of missed conversions versus sales outreach capacity. Lowering τ from <strong className="text-white">0.50</strong> to <strong className="text-white">0.30</strong> increases positive converter recall from <strong className="text-white">38.9%</strong> to <strong className="text-emerald-400">74.8%</strong> while still filtering out <strong className="text-sky-400">60.1%</strong> of non-converting inquiries.
        </p>

        <div className="space-y-1.5 pt-1">
          <input
            type="range"
            min="0.10"
            max="0.90"
            step="0.05"
            value={sliderThreshold}
            onChange={(e) => setSliderThreshold(Number(e.target.value))}
            className="w-full accent-white cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>τ = 0.10 (Aggressive Recall · 98.0% Capture)</span>
            <span>τ = 0.50 (Default Classification Cutoff)</span>
            <span>τ = 0.90 (Conservative Precision · 85.7% Precision)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 font-mono tabular-nums">
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block font-sans">Flagged for Outreach</span>
            <span className="text-sm font-bold text-white mt-0.5 block">{thresholdMetrics.salesOutreachLeads} / 2,400</span>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block font-sans">Detected Buyers (TP)</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{thresholdMetrics.tp} / 648</span>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block font-sans">Missed Buyers (FN)</span>
            <span className="text-sm font-bold text-rose-400 mt-0.5 block">{thresholdMetrics.missedConversions}</span>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block font-sans">Precision</span>
            <span className="text-sm font-bold text-white mt-0.5 block">{(thresholdMetrics.precision * 100).toFixed(1)}%</span>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block font-sans">Recall (Sensitivity)</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{(thresholdMetrics.recall * 100).toFixed(1)}%</span>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block font-sans">Outreach Reduction</span>
            <span className="text-sm font-bold text-sky-400 mt-0.5 block">{thresholdMetrics.workloadSavingsPercent.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* 2-Column Matrix + ROC */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Confusion Matrix */}
        <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-white">02. Confusion Matrix (τ = 0.50)</h2>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              {model.name} · Test Partition (n = 2,400)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs font-mono tabular-nums">
            <div className="p-4 rounded bg-slate-950 border border-slate-800 flex flex-col justify-between h-28">
              <span className="text-[10px] text-slate-400 uppercase">True Negative (TN)</span>
              <div>
                <span className="text-2xl font-bold text-white">{model.tn}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{tnRate}% specificity</span>
              </div>
              <span className="text-[10px] text-slate-500 font-sans">Actual 0 · Predicted 0</span>
            </div>

            <div className="p-4 rounded bg-slate-950 border border-slate-800 flex flex-col justify-between h-28">
              <span className="text-[10px] text-rose-400 uppercase">False Positive (FP)</span>
              <div>
                <span className="text-2xl font-bold text-rose-400">{model.fp}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{fpRate}% Type I error</span>
              </div>
              <span className="text-[10px] text-slate-500 font-sans">Actual 0 · Predicted 1</span>
            </div>

            <div className="p-4 rounded bg-slate-950 border border-slate-800 flex flex-col justify-between h-28">
              <span className="text-[10px] text-rose-400 uppercase">False Negative (FN)</span>
              <div>
                <span className="text-2xl font-bold text-rose-400">{model.fn}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{fnRate}% Type II error</span>
              </div>
              <span className="text-[10px] text-slate-500 font-sans">Actual 1 · Predicted 0</span>
            </div>

            <div className="p-4 rounded bg-slate-950 border border-slate-800 flex flex-col justify-between h-28">
              <span className="text-[10px] text-emerald-400 uppercase">True Positive (TP)</span>
              <div>
                <span className="text-2xl font-bold text-emerald-400">{model.tp}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{tpRate}% sensitivity</span>
              </div>
              <span className="text-[10px] text-slate-500 font-sans">Actual 1 · Predicted 1</span>
            </div>
          </div>

          <div className="p-3.5 rounded bg-slate-950 border border-slate-800 text-xs space-y-2 font-mono tabular-nums">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Actual Non-Converted (y=0):</span>
              <span className="text-white font-semibold">{model.tn + model.fp} (73.00%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Actual Converted (y=1):</span>
              <span className="text-emerald-400 font-semibold">{model.fn + model.tp} (27.00%)</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-2">
              <span className="text-slate-400 font-sans">F1 Harmonic Mean:</span>
              <span className="text-white font-semibold">{model.f1.toFixed(4)}</span>
            </div>
          </div>
        </div>

        {/* ROC Curve */}
        <div className="lg:col-span-2 p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <span>03. Receiver Operating Characteristic (ROC) Curve (Figure 7.5)</span>
              </h2>
              <span className="text-[11px] text-slate-400">
                True Positive Rate (Sensitivity) vs. False Positive Rate (1 − Specificity)
              </span>
            </div>
            <div className="text-xs font-mono">
              <span className="text-slate-400">Area Under Curve (AUC): </span>
              <span className="text-sky-400 font-bold">{model.roc_auc.toFixed(4)}</span>
            </div>
          </div>

          <div className="relative w-full h-64 bg-slate-950 rounded border border-slate-800 p-4 flex flex-col justify-between">
            <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
              <line x1="40" y1="20" x2="380" y2="20" stroke="#1e293b" strokeDasharray="2,2" />
              <line x1="40" y1="60" x2="380" y2="60" stroke="#1e293b" strokeDasharray="2,2" />
              <line x1="40" y1="100" x2="380" y2="100" stroke="#1e293b" strokeDasharray="2,2" />
              <line x1="40" y1="140" x2="380" y2="140" stroke="#1e293b" strokeDasharray="2,2" />
              <line x1="40" y1="180" x2="380" y2="180" stroke="#334155" />
              <line x1="40" y1="20" x2="40" y2="180" stroke="#334155" />

              <line x1="40" y1="180" x2="380" y2="20" stroke="#475569" strokeDasharray="4,4" strokeWidth="1.2" />

              <path
                d="M 40,180 C 70,110 110,65 190,45 C 270,30 340,22 380,20"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
              />

              <circle
                cx={40 + (thresholdMetrics.fp / 1752) * 340}
                cy={180 - (thresholdMetrics.tp / 648) * 160}
                r="4.5"
                fill="#ffffff"
                stroke="#0284c7"
                strokeWidth="2"
              />

              <text x="35" y="25" fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">1.0</text>
              <text x="35" y="105" fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">0.5</text>
              <text x="35" y="180" fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">0.0</text>
              <text x="40" y="195" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">0.0 (FPR)</text>
              <text x="210" y="195" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">0.5</text>
              <text x="380" y="195" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">1.0</text>
            </svg>
          </div>

          <div className="p-4 rounded bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-white">Diagnostic Interpretation (Chapter 7.6):</span>
              <p className="text-slate-400 leading-relaxed">
                With <strong className="text-white">ROC-AUC = 0.7807</strong>, the model ranks a randomly chosen converting lead higher than a non-converting lead 78.1% of the time. The white marker on the curve tracks the active operating point τ = {sliderThreshold.toFixed(2)}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
