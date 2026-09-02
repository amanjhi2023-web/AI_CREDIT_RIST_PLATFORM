import React, { useState } from 'react';
import { MASTER_RATING_SCALE } from '../../services/creditRiskEngine';
import { 
  Settings, 
  ShieldCheck, 
  Sliders, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Landmark, 
  FileText, 
  Layers,
  Percent,
  SlidersHorizontal
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [approvalScoreCutoff, setApprovalScoreCutoff] = useState(700);
  const [rejectScoreCutoff, setRejectScoreCutoff] = useState(580);
  const [maxLtvThreshold, setMaxLtvThreshold] = useState(85);
  const [maxDtiThreshold, setMaxDtiThreshold] = useState(50);
  const [baselCrarRatio, setBaselCrarRatio] = useState(10.5);
  const [capitalBuffer, setCapitalBuffer] = useState(2.5);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div id="settings-page" className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800 uppercase tracking-wide">
              Risk Appetite & Policy Configuration
            </span>
            <span className="text-xs text-slate-400 font-mono">Engine Version: 3.1.4</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            <span>Risk Appetite, Policy Cutoffs & Master Scale</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            Configure automated underwriting score cutoffs, loan-to-value limits, Basel III capital ratios, and Master Rating Scale calibrations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Policy Parameters</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Risk appetite thresholds and Basel III capital parameters successfully updated and synced across modules.</span>
        </div>
      )}

      {/* Grid: Policy Cutoffs & Basel Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Automated Underwriting Policy Cutoffs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Underwriting Score Cutoffs & Caps</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Application Scorecard</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Auto-Approval Score Cutoff</span>
                <span className="font-bold text-emerald-700">{approvalScoreCutoff} Points</span>
              </label>
              <input
                type="range"
                min={650}
                max={800}
                step={5}
                value={approvalScoreCutoff}
                onChange={(e) => setApprovalScoreCutoff(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[10px] text-slate-500">Scores ≥ {approvalScoreCutoff} receive immediate green auto-approval (if policy rules pass).</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Auto-Rejection Score Cutoff</span>
                <span className="font-bold text-rose-700">{rejectScoreCutoff} Points</span>
              </label>
              <input
                type="range"
                min={450}
                max={640}
                step={5}
                value={rejectScoreCutoff}
                onChange={(e) => setRejectScoreCutoff(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
              <span className="text-[10px] text-slate-500">Scores &lt; {rejectScoreCutoff} are automatically declined. Intermediate scores go to Manual Review.</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Max Regulatory LTV (%)</label>
                <input
                  type="number"
                  value={maxLtvThreshold}
                  onChange={(e) => setMaxLtvThreshold(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Max Allowable DTI (%)</label>
                <input
                  type="number"
                  value={maxDtiThreshold}
                  onChange={(e) => setMaxDtiThreshold(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Basel III & Capital Solvency Parameters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Landmark className="w-4 h-4 text-purple-600" />
              <span>Basel III Regulatory Capital Parameters</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Pillar 1 Solvency</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Minimum CRAR Ratio (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={baselCrarRatio}
                  onChange={(e) => setBaselCrarRatio(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
                />
                <span className="text-[10px] text-slate-500">RBI / Basel minimum: 10.5%</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Capital Conservation Buffer (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={capitalBuffer}
                  onChange={(e) => setCapitalBuffer(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
                />
                <span className="text-[10px] text-slate-500">Pillar 1 CCB: 2.50%</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">Credit Conversion Factor (CCF):</div>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Mortgages (Term Loans):</span>
                  <span className="font-mono font-bold">100%</span>
                </div>
                <div className="flex justify-between">
                  <span>Undrawn Credit Line Commitments:</span>
                  <span className="font-mono font-bold">50%</span>
                </div>
                <div className="flex justify-between">
                  <span>Unconditionally Cancellable Limits:</span>
                  <span className="font-mono font-bold">20%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Master Rating Scale Calibration Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Master Rating Scale Calibration (Source of Truth)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Unified rating master scale mapping score intervals to PD, Basel risk weights, and decision rules.</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Master Scale v3.1</span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Rating Descriptor</th>
                <th className="px-4 py-3">Score Interval</th>
                <th className="px-4 py-3">PD Range (12M)</th>
                <th className="px-4 py-3">TTC Calibrated PD</th>
                <th className="px-4 py-3">Basel Risk Weight</th>
                <th className="px-4 py-3 text-right">Default Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MASTER_RATING_SCALE.map((grade) => (
                <tr key={grade.grade} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-bold text-blue-600 font-mono">{grade.grade}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{grade.label}</td>
                  <td className="px-4 py-3 text-slate-600 font-mono">{grade.minScore} - {grade.maxScore}</td>
                  <td className="px-4 py-3 text-slate-700 font-mono">{(grade.minPd * 100).toFixed(2)}% - {(grade.maxPd * 100).toFixed(2)}%</td>
                  <td className="px-4 py-3 text-slate-700 font-mono">{(grade.ttcPd * 100).toFixed(2)}%</td>
                  <td className="px-4 py-3 text-slate-700 font-mono font-bold">{(grade.standardRiskWeight * 100).toFixed(0)}%</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      grade.grade === 'Grade A' || grade.grade === 'Grade B' ? 'bg-emerald-100 text-emerald-800' :
                      grade.grade === 'Grade C' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {grade.grade === 'Grade A' || grade.grade === 'Grade B' ? 'APPROVE' :
                       grade.grade === 'Grade C' ? 'MANUAL REVIEW' : 'REJECT'}
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
