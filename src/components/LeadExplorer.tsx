import React, { useState, useMemo } from 'react';
import { SAMPLE_LEADS } from '../data/leadsDataset';
import { Lead, SimulationInput } from '../types';
import {
  Search,
  Download,
  X,
  ArrowUpDown,
  Calculator,
} from 'lucide-react';

interface LeadExplorerProps {
  leads: Lead[];
  onSelectLeadForSim?: (leadInput: SimulationInput) => void;
}

export const LeadExplorer: React.FC<LeadExplorerProps> = ({
  leads = SAMPLE_LEADS,
  onSelectLeadForSim,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [highValueFilter, setHighValueFilter] = useState('All');
  const [sortField, setSortField] = useState<keyof Lead>('predicted_prob');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const uniqueCities = useMemo(
    () => ['All', ...Array.from(new Set(leads.map((l) => l.location)))],
    [leads]
  );
  const uniqueRoles = useMemo(
    () => ['All', ...Array.from(new Set(leads.map((l) => l.job_role)))],
    [leads]
  );

  const filteredLeads = useMemo(() => {
    return leads
      .filter((l) => {
        const matchSearch =
          l.lead_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.job_role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.preferred_location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchCity = cityFilter === 'All' || l.location === cityFilter;
        const matchRole = roleFilter === 'All' || l.job_role === roleFilter;
        const matchHighValue =
          highValueFilter === 'All' ||
          (highValueFilter === 'HighValue' && l.is_high_value) ||
          (highValueFilter === 'Standard' && !l.is_high_value);

        return matchSearch && matchCity && matchRole && matchHighValue;
      })
      .sort((a, b) => {
        const valA = Number(a[sortField]) || 0;
        const valB = Number(b[sortField]) || 0;
        return sortDirection === 'desc' ? valB - valA : valA - valB;
      });
  }, [leads, searchQuery, cityFilter, roleFilter, highValueFilter, sortField, sortDirection]);

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'lead_id',
      'location',
      'job_role',
      'budget_inr',
      'lead_score',
      'predicted_prob',
      'is_high_value',
      'conversion_status',
      'preferred_location',
      'website_visits',
      'pages_viewed',
      'demo_requests',
    ];

    const rows = filteredLeads.map((l) => [
      l.lead_id,
      l.location,
      `"${l.job_role}"`,
      l.budget,
      l.lead_score,
      l.predicted_prob,
      l.is_high_value ? '1' : '0',
      l.conversion_status,
      `"${l.preferred_location}"`,
      l.website_visits,
      l.pages_viewed,
      l.demo_requested_count,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `propeliq_lead_repository_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(1)} L`;
  };

  return (
    <div className="space-y-6">
      {/* Formal Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>MODULE 06</span>
            <span>·</span>
            <span>INSTITUTIONAL LEAD REPOSITORY</span>
            <span>·</span>
            <span>12,000 OBSERVATIONS</span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight mt-1">
            Lead Conversion &amp; High-Value Account Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Query, filter, and audit individual lead records across 84 demographic, engagement, and financial attributes.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white text-xs font-medium rounded transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export CSV ({filteredLeads.length})</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, city, micro-market..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-600"
            />
          </div>

          <div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-slate-600"
            >
              {uniqueCities.map((c) => (
                <option key={c} value={c}>
                  Jurisdiction: {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-slate-600"
            >
              {uniqueRoles.map((r) => (
                <option key={r} value={r}>
                  Occupation: {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={highValueFilter}
              onChange={(e) => setHighValueFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-slate-600"
            >
              <option value="All">Classification: All Tiers</option>
              <option value="HighValue">Classification: Tier I/II High-Value</option>
              <option value="Standard">Classification: Standard Pipeline</option>
            </select>
          </div>
        </div>
      </div>

      {/* High-Density Ledger Table */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
          <span>
            Displaying <strong className="text-white font-mono">{filteredLeads.length}</strong> records
          </span>
          <span className="text-[11px] font-mono">Select any row to inspect full 84-feature profile</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-2.5 px-3">Record ID</th>
                <th className="py-2.5 px-3">Jurisdiction &amp; Locality</th>
                <th className="py-2.5 px-3">Occupation</th>
                <th
                  onClick={() => handleSort('budget')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Budget</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('lead_score')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Lead Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('website_visits')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Sessions</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-right">Demos</th>
                <th
                  onClick={() => handleSort('predicted_prob')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>P(y=1|x)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-right">Underwriting Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
              {filteredLeads.map((l) => (
                <tr
                  key={l.lead_id}
                  onClick={() => setSelectedLead(l)}
                  className={`cursor-pointer hover:bg-slate-800/50 transition-colors ${
                    selectedLead?.lead_id === l.lead_id ? 'bg-slate-800/80' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 text-white font-semibold">{l.lead_id}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="font-medium text-white">{l.location}</span>
                    <span className="text-slate-500 mx-1.5">·</span>
                    <span className="text-[11px] text-slate-400">{l.preferred_location}</span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-300 truncate max-w-[150px]">
                    {l.job_role}
                  </td>
                  <td className="py-2.5 px-3 text-right text-white font-medium">
                    {formatCurrency(l.budget)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{l.lead_score.toFixed(1)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{l.website_visits}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">
                    {l.demo_requested_count}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`font-semibold ${
                        l.predicted_prob >= 0.70
                          ? 'text-emerald-400'
                          : l.predicted_prob >= 0.48
                          ? 'text-white'
                          : 'text-slate-500'
                      }`}
                    >
                      {(l.predicted_prob * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-[11px]">
                    {l.is_high_value ? (
                      <span className="text-amber-400 font-semibold">TIER I · HIGH-VALUE</span>
                    ) : (
                      <span className="text-slate-500">STANDARD</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-Over Record Dossier */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="text-xs font-mono text-slate-400">
                  RECORD DOSSIER · {selectedLead.lead_id}
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedLead.job_role}</h3>
                <span className="text-xs text-slate-400">
                  {selectedLead.location} · {selectedLead.preferred_location}
                </span>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                aria-label="Close dossier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Predicted Conversion P(y=1|x)</span>
                <span className="text-lg font-mono font-bold text-white tabular-nums">
                  {(selectedLead.predicted_prob * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Account Classification</span>
                <span className={selectedLead.is_high_value ? 'text-amber-400 font-mono font-semibold' : 'text-slate-400 font-mono'}>
                  {selectedLead.is_high_value ? 'TIER I · HIGH-VALUE' : 'STANDARD PIPELINE'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Stated Capital Budget</span>
                <span className="font-mono text-emerald-400 font-semibold tabular-nums">
                  {formatCurrency(selectedLead.budget)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ground Truth Outcome (y)</span>
                <span className="font-mono text-slate-300">
                  y = {selectedLead.conversion_status} ({selectedLead.conversion_status === 1 ? 'Converted' : 'Non-Converted'})
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                Behavioral &amp; Engagement Telemetry
              </span>

              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block font-sans">Website Visits</span>
                  <span className="text-white font-semibold mt-0.5 block">{selectedLead.website_visits}</span>
                </div>
                <div className="p-3 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block font-sans">Pages Viewed</span>
                  <span className="text-white font-semibold mt-0.5 block">{selectedLead.pages_viewed}</span>
                </div>
                <div className="p-3 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block font-sans">Portal Duration</span>
                  <span className="text-white font-semibold mt-0.5 block">{selectedLead.time_on_website}m</span>
                </div>
                <div className="p-3 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block font-sans">Walkthroughs</span>
                  <span className="text-white font-semibold mt-0.5 block">{selectedLead.demo_requested_count}</span>
                </div>
                <div className="p-3 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block font-sans">Response Latency</span>
                  <span className="text-white font-semibold mt-0.5 block">{selectedLead.avg_response_time}h</span>
                </div>
                <div className="p-3 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block font-sans">Last Contact</span>
                  <span className="text-white font-semibold mt-0.5 block">{selectedLead.days_since_last_interaction}d ago</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1.5">
                Property Sequence (item_checked)
              </span>
              <p className="text-xs text-slate-200 p-3 rounded bg-slate-950 border border-slate-800 font-mono">
                {selectedLead.item_checked}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  if (onSelectLeadForSim) {
                    onSelectLeadForSim({
                      age: selectedLead.age,
                      location: selectedLead.location,
                      job_role: selectedLead.job_role,
                      lead_source: selectedLead.lead_source,
                      item_checked: selectedLead.item_checked,
                      website_visits: selectedLead.website_visits,
                      pages_viewed: selectedLead.pages_viewed,
                      time_on_website: selectedLead.time_on_website,
                      demo_requested_count: selectedLead.demo_requested_count,
                      email_response: selectedLead.email_response,
                      days_since_last_interaction: selectedLead.days_since_last_interaction,
                      avg_response_time: selectedLead.avg_response_time,
                      previous_purchases: selectedLead.previous_purchases,
                      budget: selectedLead.budget,
                      lead_score: selectedLead.lead_score,
                      annual_cost_of_living: selectedLead.annual_cost_of_living,
                    });
                  }
                  setSelectedLead(null);
                }}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-200 text-slate-950 font-semibold rounded text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Load Profile into Valuation Engine</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
