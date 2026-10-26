import React, { useState, useMemo, useEffect } from 'react';
import { SimulationInput } from '../types';
import { predictLeadConversion } from '../utils/predictionEngine';
import {
  Sliders,
  RotateCcw,
  Clock,
  Check,
  FilePlus,
  Calculator,
  BarChart2,
} from 'lucide-react';

interface RealTimePredictorProps {
  onAddLeadToPipeline?: (leadData: any) => void;
  initialLead?: SimulationInput | null;
}

const PRESET_SIMULATION_PROFILES: { code: string; label: string; desc: string; input: SimulationInput }[] = [
  {
    code: 'CASE-01',
    label: 'Corporate Director · Bengaluru',
    desc: 'Score 88 · 3 site walkthroughs · ₹4.50 Cr budget · Grade-A office & commercial plot.',
    input: {
      age: 44,
      location: 'Bengaluru',
      job_role: 'Company Director',
      lead_source: 'Referral',
      item_checked: 'Office space -> Commercial plot -> Luxury apartment',
      website_visits: 26,
      pages_viewed: 68,
      time_on_website: 135,
      demo_requested_count: 3,
      email_response: 'Fast',
      days_since_last_interaction: 2,
      avg_response_time: 1.8,
      previous_purchases: 2,
      budget: 45000000,
      lead_score: 88,
      annual_cost_of_living: 820000,
    },
  },
  {
    code: 'CASE-02',
    label: 'Institutional Investor · Gurgaon',
    desc: 'Score 94 · ₹24.00 Cr budget · 3 walkthroughs · Commercial retail & villa portfolio.',
    input: {
      age: 52,
      location: 'Gurgaon',
      job_role: 'Investor',
      lead_source: 'Existing Customer',
      item_checked: 'Commercial plot -> Retail space -> Villa',
      website_visits: 22,
      pages_viewed: 58,
      time_on_website: 120,
      demo_requested_count: 3,
      email_response: 'Fast',
      days_since_last_interaction: 3,
      avg_response_time: 1.2,
      previous_purchases: 3,
      budget: 240000000,
      lead_score: 94,
      annual_cost_of_living: 1150000,
    },
  },
  {
    code: 'CASE-03',
    label: 'Medical Specialist · Mumbai',
    desc: 'Score 62 · ₹8.50 Cr budget · 1 site visit · Luxury 4 BHK residential inquiry.',
    input: {
      age: 48,
      location: 'Mumbai',
      job_role: 'Doctor',
      lead_source: 'Direct Inquiry',
      item_checked: 'Luxury apartment -> 4 BHK apartment',
      website_visits: 14,
      pages_viewed: 36,
      time_on_website: 65,
      demo_requested_count: 1,
      email_response: 'Moderate',
      days_since_last_interaction: 12,
      avg_response_time: 14.5,
      previous_purchases: 1,
      budget: 85000000,
      lead_score: 62,
      annual_cost_of_living: 950000,
    },
  },
  {
    code: 'CASE-04',
    label: 'Unqualified Inquiry · Kochi',
    desc: 'Score 14 · ₹35.0 Lakhs budget · 0 walkthroughs · 75h response latency.',
    input: {
      age: 26,
      location: 'Kochi',
      job_role: 'Government Employee',
      lead_source: 'Email Campaign',
      item_checked: '1 BHK apartment',
      website_visits: 3,
      pages_viewed: 7,
      time_on_website: 12,
      demo_requested_count: 0,
      email_response: 'No Response',
      days_since_last_interaction: 48,
      avg_response_time: 75.0,
      previous_purchases: 0,
      budget: 3500000,
      lead_score: 14,
      annual_cost_of_living: 410000,
    },
  },
];

export const RealTimePredictor: React.FC<RealTimePredictorProps> = ({
  onAddLeadToPipeline,
  initialLead,
}) => {
  const [formInput, setFormInput] = useState<SimulationInput>(
    initialLead || PRESET_SIMULATION_PROFILES[0].input
  );
  const [decisionThreshold, setDecisionThreshold] = useState<number>(0.5);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (initialLead) {
      setFormInput(initialLead);
      setAddedSuccess(false);
    }
  }, [initialLead]);

  const prediction = useMemo(
    () => predictLeadConversion(formInput, decisionThreshold),
    [formInput, decisionThreshold]
  );

  const handleApplyPreset = (profile: (typeof PRESET_SIMULATION_PROFILES)[0]) => {
    setFormInput(profile.input);
    setAddedSuccess(false);
  };

  const handleReset = () => {
    setFormInput(PRESET_SIMULATION_PROFILES[0].input);
    setDecisionThreshold(0.5);
    setAddedSuccess(false);
  };

  const handleAddToPipeline = () => {
    if (onAddLeadToPipeline) {
      onAddLeadToPipeline({
        lead_id: `LD${Math.floor(10000 + Math.random() * 89999)}`,
        ...formInput,
        demo_requested_flag: formInput.demo_requested_count > 0 ? 1 : 0,
        preferred_location: `${formInput.location} Prime District`,
        conversion_status: prediction.predictedClass,
        predicted_prob: prediction.probability,
        is_high_value: prediction.isHighValue,
      });
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3000);
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(1)} Lakhs`;
  };

  return (
    <div className="space-y-6">
      {/* Formal Institutional Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>MODULE 02</span>
            <span>·</span>
            <span>PROSPECTIVE LEAD VALUATION &amp; SCORING</span>
            <span>·</span>
            <span>XGBOOST (TUNED) ESTIMATOR</span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight mt-1">
            Real-Time Conversion Probability &amp; High-Value Underwriting
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Configure behavioral, engagement, and financial parameters to compute conversion probability P(y = 1 | x), institutional tier classification, and local SHAP log-odds attributions.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Parameters</span>
        </button>
      </div>

      {/* Reference Benchmark Profiles */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium text-slate-300">Standardized Reference Test Profiles</span>
          <span className="font-mono text-[11px]">Select a profile to load empirical parameters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_SIMULATION_PROFILES.map((p) => (
            <button
              key={p.code}
              onClick={() => handleApplyPreset(p)}
              className="text-left p-3.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>{p.code}</span>
                <span>{p.input.location}</span>
              </div>
              <div className="font-semibold text-white text-xs truncate">{p.label}</div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Analytical Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Parameter Specification */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg divide-y divide-slate-800">
          {/* Subheader */}
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-white">01. Quantitative Engagement &amp; Financial Inputs</h2>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <label htmlFor="threshold-input" className="text-slate-400">
                Classification Cutoff τ:
              </label>
              <input
                id="threshold-input"
                type="number"
                min="0.10"
                max="0.90"
                step="0.05"
                value={decisionThreshold}
                onChange={(e) =>
                  setDecisionThreshold(Math.min(0.9, Math.max(0.1, Number(e.target.value) || 0.5)))
                }
                className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white text-right"
              />
            </div>
          </div>

          {/* Continuous Sliders */}
          <div className="p-6 space-y-5">
            {/* Lead Propensity Score */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="slider-lead-score" className="text-slate-200 font-medium">
                  Pre-Conversion Lead Score (lead_score)
                </label>
                <span className="font-mono font-semibold text-white tabular-nums">
                  {formInput.lead_score} / 100
                </span>
              </div>
              <input
                id="slider-lead-score"
                type="range"
                min="0"
                max="100"
                step="1"
                value={formInput.lead_score}
                onChange={(e) => setFormInput({ ...formInput, lead_score: Number(e.target.value) })}
                className="w-full accent-slate-200 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Min: 0.0</span>
                <span>Training Mean: 36.8</span>
                <span>Max: 100.0</span>
              </div>
            </div>

            {/* Budget Capacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="slider-budget" className="text-slate-200 font-medium">
                  Capital Budget Allocation (budget · log1p scaled)
                </label>
                <span className="font-mono font-semibold text-white tabular-nums">
                  {formatCurrency(formInput.budget)}
                </span>
              </div>
              <input
                id="slider-budget"
                type="range"
                min="2000000"
                max="300000000"
                step="1000000"
                value={formInput.budget}
                onChange={(e) => setFormInput({ ...formInput, budget: Number(e.target.value) })}
                className="w-full accent-slate-200 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>₹20.0 Lakhs</span>
                <span>Institutional Gate: ₹1.50 Cr</span>
                <span>₹30.00 Cr</span>
              </div>
            </div>

            {/* Site Walkthroughs */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="slider-demos" className="text-slate-200 font-medium">
                  Site Walkthroughs &amp; Project Demos (demo_requested_count)
                </label>
                <span className="font-mono font-semibold text-white tabular-nums">
                  {formInput.demo_requested_count} {formInput.demo_requested_count === 1 ? 'session' : 'sessions'}
                </span>
              </div>
              <input
                id="slider-demos"
                type="range"
                min="0"
                max="4"
                step="1"
                value={formInput.demo_requested_count}
                onChange={(e) => setFormInput({ ...formInput, demo_requested_count: Number(e.target.value) })}
                className="w-full accent-slate-200 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>0 (Flag = 0)</span>
                <span>1 (Flag = 1)</span>
                <span>2</span>
                <span>3</span>
                <span>4 (Max Observed)</span>
              </div>
            </div>

            {/* 2x2 Grid of Secondary Telemetry Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label htmlFor="slider-visits" className="text-slate-300">
                    Portal Sessions (website_visits)
                  </label>
                  <span className="font-mono font-semibold text-white tabular-nums">{formInput.website_visits}</span>
                </div>
                <input
                  id="slider-visits"
                  type="range"
                  min="1"
                  max="40"
                  value={formInput.website_visits}
                  onChange={(e) => setFormInput({ ...formInput, website_visits: Number(e.target.value) })}
                  className="w-full accent-slate-300 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label htmlFor="slider-pages" className="text-slate-300">
                    Pages Viewed (pages_viewed)
                  </label>
                  <span className="font-mono font-semibold text-white tabular-nums">{formInput.pages_viewed}</span>
                </div>
                <input
                  id="slider-pages"
                  type="range"
                  min="1"
                  max="100"
                  value={formInput.pages_viewed}
                  onChange={(e) => setFormInput({ ...formInput, pages_viewed: Number(e.target.value) })}
                  className="w-full accent-slate-300 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label htmlFor="slider-time" className="text-slate-300">
                    Time on Portal (time_on_website)
                  </label>
                  <span className="font-mono font-semibold text-white tabular-nums">{formInput.time_on_website} min</span>
                </div>
                <input
                  id="slider-time"
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={formInput.time_on_website}
                  onChange={(e) => setFormInput({ ...formInput, time_on_website: Number(e.target.value) })}
                  className="w-full accent-slate-300 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label htmlFor="slider-latency" className="text-slate-300">
                    Response Latency (avg_response_time)
                  </label>
                  <span className="font-mono font-semibold text-white tabular-nums">{formInput.avg_response_time} hrs</span>
                </div>
                <input
                  id="slider-latency"
                  type="range"
                  min="0.5"
                  max="100"
                  step="0.5"
                  value={formInput.avg_response_time}
                  onChange={(e) => setFormInput({ ...formInput, avg_response_time: Number(e.target.value) })}
                  className="w-full accent-slate-300 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Categorical Encodings */}
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">
              02. Demographic, Channel &amp; TF-IDF Property Encodings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Metropolitan Market (One-Hot)</label>
                <select
                  value={formInput.location}
                  onChange={(e) => setFormInput({ ...formInput, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-slate-600"
                >
                  {[
                    'Mumbai',
                    'Bengaluru',
                    'Hyderabad',
                    'Gurgaon',
                    'Delhi',
                    'Pune',
                    'Chennai',
                    'Noida',
                    'Ahmedabad',
                    'Kochi',
                    'Kolkata',
                    'Vijayawada',
                    'Visakhapatnam',
                  ].map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Occupational Classification (One-Hot)</label>
                <select
                  value={formInput.job_role}
                  onChange={(e) => setFormInput({ ...formInput, job_role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-slate-600"
                >
                  {[
                    'Company Director',
                    'Investor',
                    'Business Owner',
                    'Doctor',
                    'Entrepreneur',
                    'Architect',
                    'Software Engineer',
                    'Real Estate Developer',
                    'Project Manager',
                    'Consultant',
                    'Civil Engineer',
                    'Government Employee',
                    'Manager',
                    'Sales Manager',
                    'Contractor',
                  ].map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Acquisition Source (One-Hot)</label>
                <select
                  value={formInput.lead_source}
                  onChange={(e) => setFormInput({ ...formInput, lead_source: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-slate-600"
                >
                  {[
                    'Referral',
                    'Existing Customer',
                    'Google Ads',
                    'Property Portal',
                    'LinkedIn',
                    'Direct Inquiry',
                    'Website',
                    'Broker',
                    'Facebook Ads',
                    'Instagram',
                    'Exhibition',
                    'Email Campaign',
                  ].map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Email Engagement (Ordinal 0–3)</label>
                <select
                  value={formInput.email_response}
                  onChange={(e) =>
                    setFormInput({
                      ...formInput,
                      email_response: e.target.value as SimulationInput['email_response'],
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-slate-600"
                >
                  <option value="Fast">3 — Fast (&lt; 2 hours)</option>
                  <option value="Moderate">2 — Moderate (2–24 hours)</option>
                  <option value="Slow">1 — Slow (&gt; 24 hours)</option>
                  <option value="No Response">0 — No Response</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1.5">
                  Property Sequence Tokenization (item_checked · TF-IDF)
                </label>
                <select
                  value={formInput.item_checked}
                  onChange={(e) => setFormInput({ ...formInput, item_checked: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-slate-600 font-mono"
                >
                  <option value="Office space -> Commercial plot -> Luxury apartment">
                    Office space -&gt; Commercial plot -&gt; Luxury apartment
                  </option>
                  <option value="3 BHK apartment -> Gated community">
                    3 BHK apartment -&gt; Gated community
                  </option>
                  <option value="Commercial plot -> Retail space -> Villa">
                    Commercial plot -&gt; Retail space -&gt; Villa
                  </option>
                  <option value="Luxury apartment -> Villa">
                    Luxury apartment -&gt; Villa
                  </option>
                  <option value="2 BHK apartment -> 3 BHK apartment">
                    2 BHK apartment -&gt; 3 BHK apartment
                  </option>
                  <option value="Infrastructure project -> Construction project management">
                    Infrastructure project -&gt; Construction project management
                  </option>
                  <option value="1 BHK apartment">1 BHK apartment</option>
                  <option value="Land for construction">Land for construction</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Formal Valuation Output & SHAP Attribution */}
        <div className="space-y-4">
          {/* Primary Valuation Output Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-slate-400" />
                <span>03. Model Inference Output</span>
              </span>
              <span className="font-mono text-slate-400">
                τ = {decisionThreshold.toFixed(2)}
              </span>
            </div>

            {/* Probability Readout */}
            <div className="py-2">
              <div className="text-xs text-slate-400">Estimated Conversion Probability P(y = 1 | x)</div>
              <div className="flex items-baseline justify-between mt-1">
                <div className="text-4xl font-bold text-white font-mono tabular-nums tracking-tight">
                  {(prediction.probability * 100).toFixed(1)}%
                </div>
                <div
                  className={`text-xs font-mono font-semibold ${
                    prediction.predictedClass === 1 ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {prediction.predictedClass === 1
                    ? 'Predicted Class: ŷ = 1 (Convert)'
                    : 'Predicted Class: ŷ = 0 (Non-Convert)'}
                </div>
              </div>

              {/* Clean Linear Meter */}
              <div className="w-full h-2 bg-slate-950 rounded overflow-hidden mt-3 border border-slate-800">
                <div
                  className={`h-full transition-all duration-300 ${
                    prediction.predictedClass === 1 ? 'bg-emerald-500' : 'bg-slate-600'
                  }`}
                  style={{ width: `${Math.round(prediction.probability * 100)}%` }}
                />
              </div>
            </div>

            {/* Structured Underwriting Table */}
            <div className="border-t border-b border-slate-800 py-3 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Underwriting Classification</span>
                <span className="font-semibold text-white">{prediction.tier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">High-Value Account Status</span>
                <span className={`font-mono ${prediction.isHighValue ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}>
                  {prediction.isHighValue ? 'QUALIFIED (Tier I/II)' : 'STANDARD'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gross Asset Mandate</span>
                <span className="font-mono text-white tabular-nums">
                  {formatCurrency(prediction.estimatedDealValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Risk-Adjusted Expected Fee (2%)</span>
                <span className="font-mono text-emerald-400 font-semibold tabular-nums">
                  ₹{(prediction.expectedRevenue / 100000).toFixed(2)} Lakhs
                </span>
              </div>
            </div>

            {/* Operational Protocol */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Recommended Sales Protocol</span>
                <span className="font-mono text-white flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>SLA: {prediction.urgency}</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded border border-slate-800">
                {prediction.recommendedAction}
              </p>
            </div>

            <button
              onClick={handleAddToPipeline}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-200 text-slate-950 font-semibold rounded text-xs transition-colors flex items-center justify-center gap-2"
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Record Committed to Repository</span>
                </>
              ) : (
                <>
                  <FilePlus className="w-4 h-4" />
                  <span>Append Prospect to Repository</span>
                </>
              )}
            </button>
          </div>

          {/* Local SHAP Feature Contributions */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-slate-400" />
                <span>04. Local SHAP Log-Odds Attribution</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">Δf(x)</span>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-medium text-slate-400">Positive Log-Odds Drivers</div>
              {prediction.topPositiveDrivers.slice(0, 3).map((driver, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 px-2.5 bg-slate-950 border border-slate-800 rounded"
                >
                  <div className="truncate pr-2">
                    <span className="text-slate-200 font-medium">{driver.name}</span>
                    <span className="text-slate-500 ml-2 font-mono text-[11px]">({driver.value})</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-semibold tabular-nums shrink-0">
                    +{driver.contribution.toFixed(3)}
                  </span>
                </div>
              ))}

              {prediction.topNegativeDrivers.length > 0 && (
                <>
                  <div className="text-[11px] font-medium text-slate-400 pt-2">Negative Log-Odds Penalties</div>
                  {prediction.topNegativeDrivers.slice(0, 2).map((driver, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1.5 px-2.5 bg-slate-950 border border-slate-800 rounded"
                    >
                      <div className="truncate pr-2">
                        <span className="text-slate-200 font-medium">{driver.name}</span>
                        <span className="text-slate-500 ml-2 font-mono text-[11px]">({driver.value})</span>
                      </div>
                      <span className="font-mono text-rose-400 font-semibold tabular-nums shrink-0">
                        {driver.contribution.toFixed(3)}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
