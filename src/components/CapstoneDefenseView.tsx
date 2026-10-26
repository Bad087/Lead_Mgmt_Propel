import React from 'react';
import { AUDIT_SCENARIOS } from '../data/featureImportanceData';
import {
  BookOpen,
  CheckCircle2,
  Target,
  GitBranch,
} from 'lucide-react';

export const CapstoneDefenseView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Institutional Academic Header */}
      <div className="p-6 sm:p-8 rounded-lg bg-slate-900 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
              <span>MODULE 07</span>
              <span>·</span>
              <span>ACADEMIC DEFENSE DOSSIER</span>
              <span>·</span>
              <span>PROJECT WORK-2 [23IS7PWPW2] · AY 2026–2027</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              Comparative Evaluation of Machine Learning and Neural Networks for Lead Conversion Prediction in Real-Estate and Construction Leads
            </h1>
            <p className="text-xs text-slate-300 font-medium">
              Department of Information Science and Engineering · B.M.S. College of Engineering (Autonomous Institute, Affiliated to VTU), Bull Temple Road, Bengaluru – 560019
            </p>
          </div>

          <div className="p-4 rounded bg-slate-950 border border-slate-800 shrink-0 text-xs space-y-1.5 font-mono">
            <div className="text-slate-400 uppercase text-[10px]">Faculty Supervision &amp; Leadership</div>
            <div className="text-white font-semibold">Ms. Manjula S · Project Guide</div>
            <div className="text-slate-400">Dr. M. K. Nalini · Professor &amp; HOD</div>
            <div className="text-slate-400">Dr. Bheemsha Arya · Principal</div>
          </div>
        </div>

        {/* Research Team */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-3">
            Candidate Engineering Team
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { name: 'Hritik H', usn: '1BM23IS305', role: 'Lead ML Architecture & Analytics UI' },
              { name: 'Anant Ganapati Bhat', usn: '1BM24IS400', role: 'Feature Engineering & Encoding Pipeline' },
              { name: 'Bandi Venkata Sai Vishal', usn: '1BM23IS052', role: 'Deep Neural Network Architectures' },
              { name: 'Bharath U', usn: '1BM23IS053', role: 'Hyperparameter Tuning & Evaluation' },
            ].map((student) => (
              <div key={student.usn} className="p-3.5 rounded bg-slate-950 border border-slate-800">
                <div className="font-semibold text-white text-xs">{student.name}</div>
                <div className="text-slate-300 font-mono text-[11px] mt-0.5">{student.usn}</div>
                <div className="text-slate-500 text-[11px] mt-1">{student.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 1: 92% Target Defense */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold text-sm border-b border-slate-800 pb-3">
          <Target className="w-4 h-4 text-slate-400" />
          <span>01. Methodological Defense: The 92.00% Target vs. 77.92% Empirical Ceiling (Section 7.11)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono tabular-nums">
          <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
            <span className="text-slate-400 block font-sans">Majority-Class Baseline (y = 0)</span>
            <div className="text-2xl font-bold text-white">73.00%</div>
            <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
              Predicting non-conversion for all 2,400 test records yields 73.00% accuracy but 0.00% recall on actual buyers.
            </p>
          </div>

          <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
            <span className="text-slate-400 block font-sans">Empirical Feature Ceiling</span>
            <div className="text-2xl font-bold text-sky-400">77.92%</div>
            <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
              Reached by Soft-Voting Ensemble (77.92%) and XGBoost Tuned (77.62%). Top 10 models span only 0.42 percentage points.
            </p>
          </div>

          <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
            <span className="text-slate-400 block font-sans">Aspirational Proposal Benchmark</span>
            <div className="text-2xl font-bold text-slate-300">92.00%</div>
            <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
              Documented as an aspirational target. When 20 ML and 4 DL models plateau at ~78%, the ceiling is epistemic (feature information limit).
            </p>
          </div>
        </div>

        <div className="p-4 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1.5">
          <span className="font-mono text-[11px] uppercase text-slate-400 block">
            Report Section 7.11 · Formal Defense Statement
          </span>
          <p>
            &quot;The experiment shows a modest absolute improvement over the baseline (+4.92 percentage points) but does not meet the stated 92% target. A 92% target should not be pursued by repeatedly tuning against the test set or by using information unavailable at prediction time; instead, this outcome is reported honestly as empirical evidence of the intrinsic noise ceiling in pre-conversion web and inquiry attributes.&quot;
          </p>
        </div>
      </div>

      {/* Section 2: Class Imbalance Study */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold text-sm border-b border-slate-800 pb-3">
          <GitBranch className="w-4 h-4 text-slate-400" />
          <span>02. Class Imbalance Study: Accuracy vs. Minority Recall Trade-Off (Section 7.8)</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          With a 2.70 : 1 class imbalance (7,008 negative vs. 2,592 positive training rows), unadjusted estimators maximize overall accuracy by favoring precision (~64%–67%) over recall (~37%–40%). Applying inverse class weights or fold-isolated SMOTE shifts the operating boundary to prioritize buyer capture:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono tabular-nums">
          <div className="p-4 rounded bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[11px] font-sans">XGBoost (Unadjusted)</span>
            <div className="text-base font-bold text-white mt-1">Acc: 77.62%</div>
            <div className="text-[11px] text-slate-400 mt-1">Recall: 38.89% · F1: 0.4841</div>
          </div>
          <div className="p-4 rounded bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[11px] font-sans">XGBoost + SMOTE</span>
            <div className="text-base font-bold text-white mt-1">Acc: 75.75%</div>
            <div className="text-[11px] text-emerald-400 mt-1">Recall: 61.11% · F1: 0.5764</div>
          </div>
          <div className="p-4 rounded bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[11px] font-sans">XGBoost + Class Weights</span>
            <div className="text-base font-bold text-white mt-1">Acc: 72.58%</div>
            <div className="text-[11px] text-emerald-400 mt-1">Recall: 70.83% · F1: 0.5825</div>
          </div>
          <div className="p-4 rounded bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[11px] font-sans">MLP + Class Weights (DL)</span>
            <div className="text-base font-bold text-white mt-1">Acc: 71.17%</div>
            <div className="text-[11px] text-emerald-400 mt-1">Recall: 72.84% · F1: 0.5770</div>
          </div>
        </div>
      </div>

      {/* Section 3: Verification Matrix */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold text-sm border-b border-slate-800 pb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>03. Experimental Verification &amp; Testing Matrix (Table 8.1)</span>
        </div>

        <div className="divide-y divide-slate-800">
          {AUDIT_SCENARIOS.map((s) => (
            <div key={s.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">{s.id}</span>
                  <span className="text-slate-600">·</span>
                  <span className="font-semibold text-white">{s.scenario}</span>
                </div>
                <p className="text-slate-400 text-[11px]">{s.procedure}</p>
              </div>
              <div className="text-right font-mono shrink-0">
                <div className="text-emerald-400 font-semibold text-[11px] uppercase">[{s.status}]</div>
                <div className="text-slate-500 text-[10px] mt-0.5">{s.expected}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Future Work */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-3 text-xs">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-400" />
          <span>04. Production Recommendations &amp; Future Scope (Section 9.2)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-3.5 rounded bg-slate-950 border border-slate-800">
            <div className="font-semibold text-white mb-1">Temporal Holdout Validation</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Evaluate model calibration on prospective leads collected in subsequent quarters to account for seasonal real estate demand shifts.
            </p>
          </div>
          <div className="p-3.5 rounded bg-slate-950 border border-slate-800">
            <div className="font-semibold text-white mb-1">CRM Cost-Utility Calibration</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Calibrate probability cutoffs directly against sales agent hourly capacity and net commission value per converted property tier.
            </p>
          </div>
          <div className="p-3.5 rounded bg-slate-950 border border-slate-800">
            <div className="font-semibold text-white mb-1">Richer Post-Inquiry Signals</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Integrate call transcript sentiment, mortgage pre-approval status, and brochure dwell telemetry to raise the predictive ceiling above 80%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
