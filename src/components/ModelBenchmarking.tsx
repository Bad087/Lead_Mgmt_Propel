import React, { useState, useMemo } from 'react';
import { ALL_MODELS_BENCHMARK } from '../data/modelsData';
import { ModelBenchmark } from '../types';
import {
  TrendingUp,
  ArrowUpDown,
  Search,
  Scale,
} from 'lucide-react';

interface ModelBenchmarkingProps {
  onSelectModelForRoc?: (modelId: string) => void;
}

export const ModelBenchmarking: React.FC<ModelBenchmarkingProps> = () => {
  const [selectedFamily, setSelectedFamily] = useState<string>('All');
  const [sortKey, setSortKey] = useState<keyof ModelBenchmark>('accuracy');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const [compModelAId, setCompModelAId] = useState<string>('xgboost_tuned_selected');
  const [compModelBId, setCompModelBId] = useState<string>('residual_mlp_dl');

  const [chartMetric, setChartMetric] = useState<'accuracy' | 'f1' | 'recall' | 'roc_auc' | 'precision'>('accuracy');

  const filteredModels = useMemo(() => {
    return [...ALL_MODELS_BENCHMARK]
      .filter((m) => {
        const matchFamily = selectedFamily === 'All' || m.family === selectedFamily;
        const matchSearch =
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchFamily && matchSearch;
      })
      .sort((a, b) => {
        const valA = Number(a[sortKey]) || 0;
        const valB = Number(b[sortKey]) || 0;
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
  }, [selectedFamily, searchQuery, sortKey, sortOrder]);

  const sortedForChart = useMemo(() => {
    return [...ALL_MODELS_BENCHMARK].sort((a, b) => b[chartMetric] - a[chartMetric]);
  }, [chartMetric]);

  const modelA = useMemo(
    () => ALL_MODELS_BENCHMARK.find((m) => m.id === compModelAId) || ALL_MODELS_BENCHMARK[6],
    [compModelAId]
  );
  const modelB = useMemo(
    () => ALL_MODELS_BENCHMARK.find((m) => m.id === compModelBId) || ALL_MODELS_BENCHMARK[14],
    [compModelBId]
  );

  const handleSort = (key: keyof ModelBenchmark) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const getBarColor = (family: ModelBenchmark['family']) => {
    switch (family) {
      case 'Tree Ensemble':
        return 'bg-sky-400';
      case 'Neural Network':
        return 'bg-purple-400';
      case 'Linear/Instance':
        return 'bg-amber-400';
      case 'Imbalance-Aware':
        return 'bg-emerald-400';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Formal Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>MODULE 03</span>
            <span>·</span>
            <span>EMPIRICAL MODEL EVALUATION MATRIX</span>
            <span>·</span>
            <span>N = 24 CONFIGURATIONS</span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight mt-1">
            Machine Learning vs. Neural Network Benchmark
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Held-out test set evaluation (2,400 observations) across Accuracy, Precision, Recall, F1-Score, ROC-AUC, and 3-fold stratified training CV selection scores.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Majority Baseline: <strong className="text-white">73.00%</strong> · Aspirational Target: <strong className="text-slate-300">92.00%</strong>
        </div>
      </div>

      {/* Head-to-Head Comparison Arena */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-slate-400" />
            <span>01. Pairwise Model Architecture Comparison</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Direct Metric Differential (A − B)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Model A */}
          <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-sky-400 font-semibold">ESTIMATOR A</span>
              <span className="text-slate-400">{modelA.type} · {modelA.family}</span>
            </div>
            <select
              value={compModelAId}
              onChange={(e) => setCompModelAId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs font-medium text-white focus:outline-none focus:border-slate-500"
            >
              {ALL_MODELS_BENCHMARK.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.family})
                </option>
              ))}
            </select>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs font-mono tabular-nums">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans">Accuracy</span>
                <span className="font-bold text-white mt-0.5 block">{(modelA.accuracy * 100).toFixed(2)}%</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans">ROC-AUC</span>
                <span className="font-bold text-sky-400 mt-0.5 block">{modelA.roc_auc.toFixed(4)}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans">F1-Score</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">{modelA.f1.toFixed(4)}</span>
              </div>
            </div>

            <div className="flex justify-between text-xs text-slate-400 pt-1 font-mono tabular-nums">
              <span>Precision: {(modelA.precision * 100).toFixed(2)}%</span>
              <span>Recall: {(modelA.recall * 100).toFixed(2)}%</span>
              <span>CV: {modelA.selection_score.toFixed(4)}</span>
            </div>
          </div>

          {/* Model B */}
          <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-purple-400 font-semibold">ESTIMATOR B</span>
              <span className="text-slate-400">{modelB.type} · {modelB.family}</span>
            </div>
            <select
              value={compModelBId}
              onChange={(e) => setCompModelBId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs font-medium text-white focus:outline-none focus:border-slate-500"
            >
              {ALL_MODELS_BENCHMARK.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.family})
                </option>
              ))}
            </select>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs font-mono tabular-nums">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans">Accuracy</span>
                <span className="font-bold text-white mt-0.5 block">{(modelB.accuracy * 100).toFixed(2)}%</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans">ROC-AUC</span>
                <span className="font-bold text-purple-400 mt-0.5 block">{modelB.roc_auc.toFixed(4)}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans">F1-Score</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">{modelB.f1.toFixed(4)}</span>
              </div>
            </div>

            <div className="flex justify-between text-xs text-slate-400 pt-1 font-mono tabular-nums">
              <span>Precision: {(modelB.precision * 100).toFixed(2)}%</span>
              <span>Recall: {(modelB.recall * 100).toFixed(2)}%</span>
              <span>CV: {modelB.selection_score.toFixed(4)}</span>
            </div>
          </div>
        </div>

        {/* Differential Bar */}
        <div className="mt-4 p-3 rounded bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between text-xs gap-3 font-mono tabular-nums">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-400 font-sans font-medium">Differential (A − B):</span>
            <span className="text-white font-semibold">
              ΔAcc: {((modelA.accuracy - modelB.accuracy) * 100).toFixed(2)}%
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">
              ΔAUC: {(modelA.roc_auc - modelB.roc_auc).toFixed(4)}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">
              ΔRecall: {((modelA.recall - modelB.recall) * 100).toFixed(2)}%
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">
              ΔF1: {(modelA.f1 - modelB.f1).toFixed(4)}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-sans">
            Standard Error on n=2,400 is ±0.85 percentage points
          </span>
        </div>
      </div>

      {/* Comparative Spectrum Chart */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <span>02. Held-Out Test Performance Distribution</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked comparison across all 24 evaluated configurations (Figures 7.3 &amp; 7.4)
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded bg-slate-950 border border-slate-800 self-start sm:self-auto">
            {(['accuracy', 'f1', 'recall', 'roc_auc', 'precision'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setChartMetric(metric)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors uppercase font-mono ${
                  chartMetric === metric
                    ? 'bg-white text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {metric.replace('_', '-')}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-5 text-xs text-slate-400 mb-4 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-sky-400 inline-block" />
            <span>Tree Ensemble</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-purple-400 inline-block" />
            <span>Neural Network (DL)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-amber-400 inline-block" />
            <span>Linear / Instance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-400 inline-block" />
            <span>Imbalance-Aware</span>
          </div>
        </div>

        <div className="space-y-2 max-h-[440px] overflow-y-auto pr-2">
          {sortedForChart.map((m) => {
            const val = m[chartMetric];
            return (
              <div key={m.id} className="py-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2 truncate max-w-[300px] sm:max-w-[440px]">
                    <span className="font-medium text-slate-200 truncate">{m.name}</span>
                    {m.id === 'xgboost_tuned_selected' && (
                      <span className="text-[10px] font-mono text-amber-400 shrink-0">
                        [SELECTED]
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0 font-mono tabular-nums">
                    <span className="text-[11px] text-slate-500">{m.family}</span>
                    <span className="font-semibold text-white w-14 text-right">
                      {(val * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-slate-950 rounded-sm overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getBarColor(m.family)}`}
                    style={{
                      width: `${
                        chartMetric === 'accuracy'
                          ? Math.max(10, ((val - 0.65) / 0.20) * 100)
                          : val * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['All', 'Tree Ensemble', 'Neural Network', 'Linear/Instance', 'Imbalance-Aware'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFamily(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                selectedFamily === f
                  ? 'bg-white text-slate-950 font-semibold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by algorithm or parameter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-600"
          />
        </div>
      </div>

      {/* Table 7.1 */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
        <h2 className="text-sm font-semibold text-white mb-4">
          03. Complete Comparison of Evaluated Model Configurations (Report Table 7.1)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-2.5 px-3">No.</th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-2.5 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Model Configuration</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Paradigm Family</th>
                <th
                  onClick={() => handleSort('accuracy')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Accuracy</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('precision')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Precision</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('recall')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Recall</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('f1')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>F1</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('roc_auc')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>ROC-AUC</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('selection_score')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Selection</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-right">Designation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
              {filteredModels.map((m, idx) => (
                <tr
                  key={m.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    m.id === 'xgboost_tuned_selected' ? 'bg-slate-800/50' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 text-slate-500">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <div className="font-semibold text-white">{m.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{m.best_params}</div>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-400">
                    {m.family}
                  </td>
                  <td className="py-2.5 px-3 text-right text-white font-semibold">
                    {m.accuracy.toFixed(4)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">
                    {m.precision.toFixed(4)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">
                    {m.recall.toFixed(4)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{m.f1.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-right text-sky-400 font-medium">{m.roc_auc.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{m.selection_score.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-[11px]">
                    <span
                      className={
                        m.status === 'Selected Production'
                          ? 'text-amber-400 font-semibold'
                          : m.status === 'Top Performer'
                          ? 'text-sky-400'
                          : m.status === 'High Recall Variant'
                          ? 'text-emerald-400'
                          : 'text-slate-500'
                      }
                    >
                      {m.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
