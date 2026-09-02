import React, { useState } from 'react';
import { BehavioralScorecardInput, BehavioralScorecardResult } from '../../types';
import { evaluateBehavioralScorecard } from '../../services/creditRiskEngine';
import { SAMPLE_BEHAVIORAL_PROFILES } from '../../data/mockData';
import { 
  Activity, 
  ShieldCheck, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Calendar,
  Landmark,
  Layers,
  BarChart2,
  Sliders,
  DollarSign
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line, 
  ReferenceLine 
} from 'recharts';

export const BehavioralScorecardPage: React.FC = () => {
  // Active Form Input State
  const [formData, setFormData] = useState<BehavioralScorecardInput>(
    SAMPLE_BEHAVIORAL_PROFILES[0].input
  );

  // Result State
  const [result, setResult] = useState<BehavioralScorecardResult | null>(() =>
    evaluateBehavioralScorecard(SAMPLE_BEHAVIORAL_PROFILES[0].input)
  );

  const [isEvaluating, setIsEvaluating] = useState(false);

  // Helper for preset loader
  const handleLoadPreset = (index: number) => {
    const selected = SAMPLE_BEHAVIORAL_PROFILES[index].input;
    setFormData(selected);
    setResult(evaluateBehavioralScorecard(selected));
  };

  // Run Behavioral Scorecard Evaluation
  const handleCheckRisk = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEvaluating(true);
    setTimeout(() => {
      const res = evaluateBehavioralScorecard(formData);
      setResult(res);
      setIsEvaluating(false);
    }, 250);
  };

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakhs`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Derived MOB & Seasoning Check
  const derivedMob = Math.max(1, formData.snapshotTimeMonths - formData.originationTimeMonths);
  const isSeasoned = derivedMob >= 6;
  const derivedEquity = Math.max(0, (1 - (formData.currentLtv / 100)) * 100);

  return (
    <div id="behavioral-scorecard-page" className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wide">
              Module B • Running Loan & 12M PD Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">Dataset: Mortgage_Behavioral_Panel_v3.1</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            <span>Behavioral Scorecard (Existing Seasoned Loan)</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            Predicts the probability of default over the next 12 months for active seasoned accounts (MOB ≥ 6). Computes Behavioral Score, TTC Calibrated PD, LGD, EAD, Expected Loss (ECL), and Basel III Capital Requirement.
          </p>
        </div>

        {/* Preset Account Loader */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight pl-1">Preset Account:</span>
          <select
            id="select-behavioral-preset"
            onChange={(e) => handleLoadPreset(Number(e.target.value))}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500"
          >
            {SAMPLE_BEHAVIORAL_PROFILES.map((p, idx) => (
              <option key={idx} value={idx}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Seasoning Gate Status Alert */}
      <div className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
        isSeasoned ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-center gap-2.5">
          {isSeasoned ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-amber-600" />}
          <div>
            <span className="font-bold">
              Account Seasoning Check: Months On Book (MOB) = {derivedMob} Months
            </span>
            <p className="text-[11px] opacity-90 mt-0.5">
              {isSeasoned
                ? `Account has seasoned sufficiently (MOB ≥ 6). Behavioral Scorecard model is fully applicable.`
                : `Account is unseasoned (MOB < 6). Behavioral model requires at least 6 months of observed repayment history.`}
            </p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
          isSeasoned ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
        }`}>
          {isSeasoned ? 'Seasoned Account (Valid)' : 'Unseasoned (< 6 Months)'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Behavioral Input Parameters Form (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleCheckRisk} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span>Behavioral Model Inputs</span>
              </h2>
              <button
                type="button"
                onClick={() => {
                  setFormData(SAMPLE_BEHAVIORAL_PROFILES[0].input);
                  setResult(evaluateBehavioralScorecard(SAMPLE_BEHAVIORAL_PROFILES[0].input));
                }}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* SECTION A: CUSTOMER & CREDIT INFORMATION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>A. Customer & Credit Information</span>
                </span>
                <span className="text-[11px] text-slate-400">Account Identity</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Account ID */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account / Loan ID</label>
                  <input
                    type="text"
                    value={formData.accountId}
                    onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Customer Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Borrower Name</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Updated FICO / Bureau Score */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Updated Bureau Score (FICO)</label>
                  <input
                    type="number"
                    min={300}
                    max={900}
                    value={formData.creditScore}
                    onChange={(e) => setFormData({ ...formData, creditScore: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Credit Inquiries in past 12M */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bureau Inquiries Past 12M</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.creditInquiriesPast12m}
                    onChange={(e) => setFormData({ ...formData, creditInquiriesPast12m: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION B: LOAN INFORMATION */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>B. Loan Balances & Exposure</span>
                </span>
                <span className="text-[11px] text-slate-400">Position Data</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Current Loan Balance */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Loan Balance (₹)</label>
                  <input
                    type="number"
                    value={formData.currentBalance}
                    onChange={(e) => setFormData({ ...formData, currentBalance: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500">{formatINR(formData.currentBalance)}</span>
                </div>

                {/* Original Loan Balance */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Original Loan Balance (₹)</label>
                  <input
                    type="number"
                    value={formData.originalBalance}
                    onChange={(e) => setFormData({ ...formData, originalBalance: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500">{formatINR(formData.originalBalance)}</span>
                </div>

                {/* Current LTV */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current LTV Ratio (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.currentLtv}
                    onChange={(e) => setFormData({ ...formData, currentLtv: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* SECTION C & D: TIME, BEHAVIOR & DERIVED VARIABLES */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>C & D. Time, Seasoning & Derived Variables</span>
                </span>
                <span className="text-[11px] text-slate-400">MOB = Snapshot - Origination</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Snapshot Time Month Index */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Snapshot Time (Month Index)</label>
                  <input
                    type="number"
                    value={formData.snapshotTimeMonths}
                    onChange={(e) => setFormData({ ...formData, snapshotTimeMonths: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Origination Time Month Index */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Origination Time (Month Index)</label>
                  <input
                    type="number"
                    value={formData.originationTimeMonths}
                    onChange={(e) => setFormData({ ...formData, originationTimeMonths: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Delinquency Status */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Delinquency Status</label>
                  <select
                    value={formData.delinquencyStatus}
                    onChange={(e) => setFormData({ ...formData, delinquencyStatus: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Current">Current (No DPD)</option>
                    <option value="1-30 DPD">1-30 DPD (Early Arrears)</option>
                    <option value="31-60 DPD">31-60 DPD (Moderate Arrears)</option>
                    <option value="61-90 DPD">61-90 DPD (Severe Arrears)</option>
                    <option value="90+ DPD">90+ DPD (Default / NPA)</option>
                  </select>
                </div>

                {/* Max DPD in past 12M */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Peak DPD in Past 12M</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.dpdMaxPast12m}
                    onChange={(e) => setFormData({ ...formData, dpdMaxPast12m: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* CEP (Cumulative Excess Payment / Liquidity) */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Cumulative Excess Payment (CEP / Liquidity) (₹)</span>
                    <span className="text-[10px] text-slate-500">Accelerated amortization reduces hazard</span>
                  </label>
                  <input
                    type="number"
                    value={formData.cepCumulativeExcessPayment}
                    onChange={(e) => setFormData({ ...formData, cepCumulativeExcessPayment: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Derived variables summary strip */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Derived MOB</div>
                  <div className="font-bold text-slate-900 mt-0.5">{derivedMob} Months</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Derived MOB²</div>
                  <div className="font-bold text-slate-900 mt-0.5">{derivedMob * derivedMob}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Borrower Equity</div>
                  <div className="font-bold text-slate-900 mt-0.5">{derivedEquity.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            {/* SECTION E: MACROECONOMIC VARIABLES */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span>E. Macroeconomic Environment</span>
                </span>
                <span className="text-[11px] text-slate-400">Quarterly Macro State</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* HPI */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">House Price Index (HPI)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.hpiIndex}
                    onChange={(e) => setFormData({ ...formData, hpiIndex: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* GDP */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GDP Growth Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.gdpGrowthRate}
                    onChange={(e) => setFormData({ ...formData, gdpGrowthRate: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Benchmark Repo Rate */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Benchmark Rate (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={formData.benchmarkInterestRate}
                    onChange={(e) => setFormData({ ...formData, benchmarkInterestRate: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Check Behavioral Risk Button */}
            <button
              id="btn-check-behavioral-risk"
              type="submit"
              disabled={isEvaluating}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {isEvaluating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>{isEvaluating ? 'COMPUTING 12M PD & BASEL CAPITAL...' : 'CHECK BEHAVIORAL RISK'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Behavioral Result Page & Full Credit Risk Calculation Layer (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div id="behavioral-result-card" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6 animate-in fade-in">
              {/* Header Title */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Behavioral Scorecard Output</div>
                  <h2 className="text-base font-bold text-slate-900">BEHAVIORAL RISK RESULT</h2>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">Account: {result.accountId}</div>
              </div>

              {/* Primary Score, PD & Rating Indicator Strip */}
              <div className="grid grid-cols-3 gap-3">
                {/* Behavioral Score */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Behavioral Score</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">{result.behavioralScore}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Range 300 - 900</div>
                </div>

                {/* 12M Probability of Default */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Next 12M PIT PD</div>
                  <div className={`text-2xl font-extrabold mt-1 ${
                    result.pitPd <= 0.035 ? 'text-emerald-600' :
                    result.pitPd <= 0.08 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {(result.pitPd * 100).toFixed(2)}%
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">TTC PD: {(result.ttcPd * 100).toFixed(2)}%</div>
                </div>

                {/* Risk Rating */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Risk Rating</div>
                  <div className="text-2xl font-extrabold text-blue-600 mt-1">{result.riskRating}</div>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                    result.riskLevel === 'Low Risk' ? 'bg-emerald-100 text-emerald-800' :
                    result.riskLevel === 'Medium Risk' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {result.riskLevel}
                  </span>
                </div>
              </div>

              {/* Complete Credit Risk Calculation Layer (LGD -> EAD -> Expected Loss -> Basel Capital) */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-4 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-blue-400" />
                    <span>Credit Risk Calculation Layer (IFRS 9 & Basel III)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Pillar 1 Solvency</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  {/* LGD */}
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Loss Given Default</div>
                    <div className="text-base font-bold text-amber-400 mt-1">{(result.lgd * 100).toFixed(1)}%</div>
                    <div className="text-[9px] text-slate-400">LTV & Recovery Model</div>
                  </div>

                  {/* EAD */}
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Exposure at Default</div>
                    <div className="text-base font-bold text-blue-300 mt-1">{formatINR(result.ead)}</div>
                    <div className="text-[9px] text-slate-400">CCF = {result.ccf * 100}%</div>
                  </div>

                  {/* Expected Credit Loss */}
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Expected Loss (ECL)</div>
                    <div className="text-base font-bold text-rose-400 mt-1">{formatINR(result.expectedLoss)}</div>
                    <div className="text-[9px] text-slate-400">PD × LGD × EAD</div>
                  </div>

                  {/* Basel Capital Requirement */}
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Basel III Capital</div>
                    <div className="text-base font-bold text-emerald-400 mt-1">{formatINR(result.baselCapitalRequirement)}</div>
                    <div className="text-[9px] text-slate-400">RWA × 10.5%</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between border-t border-slate-800/80">
                  <span>Risk Weighted Asset (RWA): <strong>{formatINR(result.rwa)}</strong> ({result.baselRiskWeight}% Weight)</span>
                  <span>ECL / Exposure: <strong>{result.expectedLossPct}%</strong></span>
                </div>
              </div>

              {/* Weight of Evidence (WOE) & Risk Factor Contributions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wide">
                    WOE / Feature Contributions (Logistic Scorecard)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Information Value (IV)</span>
                </div>

                <div className="space-y-2">
                  {result.woeContributions.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800 flex items-center gap-2">
                          <span>{item.variable}</span>
                          <span className="text-[10px] text-slate-500 font-normal">({item.rawVal})</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          WOE: {item.woe > 0 ? `+${item.woe}` : item.woe} • IV: {item.iv} • Coeff: {item.coefficient}
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        item.pointsContribution >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.pointsContribution >= 0 ? `+${item.pointsContribution}` : item.pointsContribution} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical MOB Seasoning Trajectory Chart */}
              {result.historicalMobTrend && result.historicalMobTrend.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 uppercase tracking-wide">
                      MOB Seasoning Hazard Curve (Historical Trajectory)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Current MOB: {result.mob}</span>
                  </div>
                  <div className="h-44 bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={result.historicalMobTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="mob" tick={{ fontSize: 10 }} label={{ value: 'Months On Book (MOB)', position: 'insideBottom', offset: -2, fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 10 }} unit="%" />
                        <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                        <ReferenceLine x={result.mob} stroke="#2563eb" strokeDasharray="4 4" label={{ value: 'Current MOB', fill: '#2563eb', fontSize: 10 }} />
                        <Line type="monotone" dataKey="pd" name="Model PD %" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
              <Activity className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs">Fill in behavioral parameters and click <strong>[ CHECK BEHAVIORAL RISK ]</strong>.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
