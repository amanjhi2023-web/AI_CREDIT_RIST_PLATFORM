import React, { useState } from 'react';
import { ApplicationScorecardInput, ApplicationScorecardResult } from '../../types';
import { evaluateApplicationScorecard } from '../../services/creditRiskEngine';
import { SAMPLE_APPLICATION_PROFILES } from '../../data/mockData';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  RotateCcw, 
  ShieldCheck, 
  Info,
  HelpCircle,
  Percent,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ApplicationScorecardPage: React.FC = () => {
  // Active Form Input State
  const [formData, setFormData] = useState<ApplicationScorecardInput>(
    SAMPLE_APPLICATION_PROFILES[0].input
  );

  // Evaluation Result State
  const [result, setResult] = useState<ApplicationScorecardResult | null>(() =>
    evaluateApplicationScorecard(SAMPLE_APPLICATION_PROFILES[0].input)
  );

  const [isEvaluating, setIsEvaluating] = useState(false);

  // Handle Preset Profile Load
  const handleLoadPreset = (index: number) => {
    const selected = SAMPLE_APPLICATION_PROFILES[index].input;
    setFormData(selected);
    setResult(evaluateApplicationScorecard(selected));
  };

  // Run Scorecard Evaluation
  const handleCheckRisk = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEvaluating(true);
    setTimeout(() => {
      const res = evaluateApplicationScorecard(formData);
      setResult(res);
      setIsEvaluating(false);
    }, 250);
  };

  // Helper for currency format
  const formatINR = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // LTV auto-calculation
  const calculatedLtv = formData.propertyValue > 0 
    ? Number(((formData.loanAmount / formData.propertyValue) * 100).toFixed(1))
    : formData.ltv;

  return (
    <div id="application-scorecard-page" className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Module Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
              Module A • Origination Stage
            </span>
            <span className="text-xs text-slate-400 font-mono">Dataset: Application_Scorecard_v2.4</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            <span>Application Scorecard (New Customer)</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            Evaluate credit risk for a new loan applicant with no running account history. Computes Application Score, Probability of Default (PD), Risk Rating, and Underwriting Decision (Approve / Reject / Manual Review).
          </p>
        </div>

        {/* Preset Case Loader */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight pl-1">Load Preset Case:</span>
          <select
            id="select-application-preset"
            onChange={(e) => handleLoadPreset(Number(e.target.value))}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500"
          >
            {SAMPLE_APPLICATION_PROFILES.map((p, idx) => (
              <option key={idx} value={idx}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Application Input Form (5 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleCheckRisk} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span>Application Input Parameters</span>
              </h2>
              <button
                type="button"
                onClick={() => {
                  setFormData(SAMPLE_APPLICATION_PROFILES[0].input);
                  setResult(evaluateApplicationScorecard(SAMPLE_APPLICATION_PROFILES[0].input));
                }}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* SECTION A: LOAN INFORMATION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>A. Loan Information</span>
                </span>
                <span className="text-[11px] text-slate-400">Facility Terms</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Loan Amount */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Loan Amount (₹)</label>
                  <input
                    id="input-loan-amount"
                    type="number"
                    value={formData.loanAmount}
                    onChange={(e) => setFormData({ ...formData, loanAmount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500">{formatINR(formData.loanAmount)}</span>
                </div>

                {/* Property Value */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Property Value (₹)</label>
                  <input
                    id="input-property-value"
                    type="number"
                    value={formData.propertyValue}
                    onChange={(e) => setFormData({ ...formData, propertyValue: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500">{formatINR(formData.propertyValue)}</span>
                </div>

                {/* Computed LTV */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Derived LTV Ratio (%)</span>
                    <span className={`text-[10px] font-bold ${calculatedLtv > 80 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {calculatedLtv > 80 ? 'High LTV' : 'Adequate Cushion'}
                    </span>
                  </label>
                  <input
                    id="input-ltv"
                    type="number"
                    step="0.1"
                    value={calculatedLtv}
                    readOnly
                    className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-bold cursor-not-allowed"
                  />
                </div>

                {/* Loan Tenure */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Loan Tenure (Years)</label>
                  <select
                    id="select-loan-tenure"
                    value={formData.loanTenureYears}
                    onChange={(e) => setFormData({ ...formData, loanTenureYears: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value={5}>5 Years (60 Months)</option>
                    <option value={10}>10 Years (120 Months)</option>
                    <option value={15}>15 Years (180 Months)</option>
                    <option value={20}>20 Years (240 Months)</option>
                    <option value={25}>25 Years (300 Months)</option>
                    <option value={30}>30 Years (360 Months)</option>
                  </select>
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Interest Rate (% p.a.)</label>
                  <input
                    id="input-interest-rate"
                    type="number"
                    step="0.05"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Loan Purpose */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Loan Purpose</label>
                  <select
                    id="select-loan-purpose"
                    value={formData.loanPurpose}
                    onChange={(e) => setFormData({ ...formData, loanPurpose: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Home Purchase">Home Purchase</option>
                    <option value="Refinancing">Refinancing</option>
                    <option value="Home Improvement">Home Improvement</option>
                    <option value="Business Expansion">Business Expansion</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION B: CREDIT & APPLICANT INFORMATION */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>B. Credit & Financial Information</span>
                </span>
                <span className="text-[11px] text-slate-400">Bureau & Income Data</span>
              </div>

              {/* SPECIAL CASE: Thin File / No Credit History Toggle */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-600" />
                    <span>Thin File / No Credit History / No Hit</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    If enabled, FICO is not treated as 0. Alternative demographic stability rules are evaluated.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    id="toggle-thin-file"
                    type="checkbox"
                    checked={formData.isThinFile}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData({
                        ...formData,
                        isThinFile: checked,
                        creditScore: checked ? null : (formData.creditScore || 720),
                        creditHistoryMonths: checked ? 0 : 36,
                        existingActiveLoansCount: checked ? 0 : 1,
                        delinquency30PlusPast24m: 0,
                      });
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Applicant Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Applicant Name</label>
                  <input
                    id="input-applicant-name"
                    type="text"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Monthly Income */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Net Monthly Income (₹)</label>
                  <input
                    id="input-monthly-income"
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500">{formatINR(formData.monthlyIncome)}/mo</span>
                </div>

                {/* Credit Score / FICO (Disabled if Thin File) */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Credit Score / CIBIL</span>
                    {formData.isThinFile && (
                      <span className="text-[10px] text-amber-700 font-bold">No Hit / N/A</span>
                    )}
                  </label>
                  <input
                    id="input-credit-score"
                    type="number"
                    min={300}
                    max={900}
                    disabled={formData.isThinFile}
                    value={formData.isThinFile ? '' : (formData.creditScore || '')}
                    onChange={(e) => setFormData({ ...formData, creditScore: Number(e.target.value) })}
                    placeholder={formData.isThinFile ? 'Thin File (No Score)' : 'e.g. 750'}
                    className={`w-full border rounded-lg px-3 py-2 font-bold ${
                      formData.isThinFile 
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'bg-slate-50 text-slate-900 border-slate-300 focus:bg-white focus:border-blue-500'
                    }`}
                    required={!formData.isThinFile}
                  />
                </div>

                {/* Existing Monthly Obligations */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Existing Monthly Obligations (₹)</label>
                  <input
                    id="input-existing-obligations"
                    type="number"
                    value={formData.existingMonthlyObligations}
                    onChange={(e) => setFormData({ ...formData, existingMonthlyObligations: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Past Delinquencies (30+ DPD) */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">30+ DPD Events in Past 24M</label>
                  <input
                    id="input-delinquency-count"
                    type="number"
                    min={0}
                    disabled={formData.isThinFile}
                    value={formData.isThinFile ? 0 : formData.delinquency30PlusPast24m}
                    onChange={(e) => setFormData({ ...formData, delinquency30PlusPast24m: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500 disabled:bg-slate-100"
                  />
                </div>

                {/* Employment Tenure */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employment Tenure (Years)</label>
                  <input
                    id="input-employment-tenure"
                    type="number"
                    value={formData.employmentTenureYears}
                    onChange={(e) => setFormData({ ...formData, employmentTenureYears: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Check Risk Action Button */}
            <button
              id="btn-check-application-risk"
              type="submit"
              disabled={isEvaluating}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {isEvaluating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>{isEvaluating ? 'PREPROCESSING & SCORING...' : 'CHECK APPLICATION RISK'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Application Result Card (7 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div id="application-result-card" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6 animate-in fade-in">
              {/* Header Title */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scorecard Output</div>
                  <h2 className="text-base font-bold text-slate-900">APPLICATION RISK RESULT</h2>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">Model: {result.modelVersion}</div>
              </div>

              {/* Primary Decision Banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                result.decision === 'APPROVE' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' :
                result.decision === 'REJECT' ? 'bg-rose-50 border-rose-300 text-rose-900' :
                'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    result.decision === 'APPROVE' ? 'bg-emerald-600 text-white' :
                    result.decision === 'REJECT' ? 'bg-rose-600 text-white' :
                    'bg-amber-600 text-white'
                  }`}>
                    {result.decision === 'APPROVE' ? <CheckCircle2 className="w-6 h-6" /> :
                     result.decision === 'REJECT' ? <XCircle className="w-6 h-6" /> :
                     <AlertTriangle className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">Underwriting Decision</div>
                    <div className="text-lg font-extrabold">{result.decision}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    result.riskLevel === 'Low Risk' ? 'bg-emerald-200 text-emerald-900' :
                    result.riskLevel === 'Medium Risk' ? 'bg-amber-200 text-amber-900' :
                    'bg-rose-200 text-rose-900'
                  }`}>
                    {result.riskLevel}
                  </span>
                </div>
              </div>

              {/* Core Output Metrics Grid */}
              <div className="grid grid-cols-3 gap-3">
                {/* Application Score */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Application Score</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">{result.applicationScore}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Range 300 - 900</div>
                </div>

                {/* Probability of Default */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Model PD</div>
                  <div className={`text-2xl font-extrabold mt-1 ${
                    result.pd <= 0.035 ? 'text-emerald-600' :
                    result.pd <= 0.08 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {(result.pd * 100).toFixed(2)}%
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">12M Default Hazard</div>
                </div>

                {/* Risk Rating */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Risk Rating</div>
                  <div className="text-2xl font-extrabold text-blue-600 mt-1">{result.riskRating}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Master Scale</div>
                </div>
              </div>

              {/* Explanation of Decision */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">Decision Rationale</div>
                <p className="text-xs text-slate-600 leading-relaxed">{result.decisionRationale}</p>
              </div>

              {/* Key Contributing Factors */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">Key Contributing Factors</div>
                <div className="space-y-1.5">
                  {result.keyDrivers.map((driver, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {driver.isPositive ? (
                          <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-slate-800">{driver.factor}</span>
                          <p className="text-[11px] text-slate-500">{driver.impact}</p>
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                        driver.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {driver.isPositive ? '+' : '-'}{driver.weight} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy Checks Table */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">Underwriting Policy Checks</div>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2">Policy Rule</th>
                        <th className="px-3 py-2">Criteria</th>
                        <th className="px-3 py-2">Actual Value</th>
                        <th className="px-3 py-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.policyChecks.map((check, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="px-3 py-2 font-medium text-slate-800">{check.rule}</td>
                          <td className="px-3 py-2 text-slate-500 text-[11px]">{check.criteria}</td>
                          <td className="px-3 py-2 font-bold text-slate-700">{check.actual}</td>
                          <td className="px-3 py-2 text-right">
                            {check.passed ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-[11px]">
                                <XCircle className="w-3.5 h-3.5" /> Fail
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Input Summary Footer */}
              <div className="p-3 rounded-lg bg-slate-100 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
                <span>Applicant: <strong>{formData.applicantName}</strong></span>
                <span>Amount: <strong>{formatINR(formData.loanAmount)}</strong></span>
                <span>LTV: <strong>{calculatedLtv}%</strong></span>
                <span>DTI: <strong>{result.dti}%</strong></span>
                <span>Tenure: <strong>{formData.loanTenureYears} Years</strong></span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
              <FileText className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs">Fill in application parameters and click <strong>[ CHECK APPLICATION RISK ]</strong>.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
