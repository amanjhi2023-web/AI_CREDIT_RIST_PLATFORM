import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Layers, 
  Activity, 
  PieChart, 
  FlaskConical, 
  Landmark,
  UserCheck
} from 'lucide-react';
import { PORTFOLIO_STATS, MODEL_PERFORMANCE_DATA } from '../../data/mockData';

export const ReportsPage: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<
    'application' | 'behavioral' | 'portfolio' | 'model_audit' | 'data_quality'
  >('portfolio');

  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportNotice(true);
      setTimeout(() => setExportNotice(false), 4000);
    }, 600);
  };

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakhs`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div id="reports-page" className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 uppercase tracking-wide">
              Regulatory Audit & Executive Reporting
            </span>
            <span className="text-xs text-slate-400 font-mono">Standard: Basel III & IFRS 9</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <FileText className="w-6 h-6 text-rose-600" />
            <span>Credit Risk Reports & Disclosures</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            Generate audit-ready underwriting dossiers, portfolio solvency disclosures, ECL provisioning schedules, and Model Risk Management (MRM) validation certifications.
          </p>
        </div>

        {/* Export / Download Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isExporting ? 'GENERATING PDF...' : 'Download Report (PDF/Excel)'}</span>
          </button>
        </div>
      </div>

      {/* Export notification */}
      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Report package compiled and downloaded successfully with digital cryptographic signature.</span>
        </div>
      )}

      {/* Report Type Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* 1. Portfolio Solvency Memo */}
        <div
          onClick={() => setSelectedReportType('portfolio')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedReportType === 'portfolio'
              ? 'bg-purple-50 border-purple-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <PieChart className={`w-5 h-5 mb-2 ${selectedReportType === 'portfolio' ? 'text-purple-600' : 'text-slate-400'}`} />
          <div className="text-xs font-bold text-slate-900">Portfolio Solvency Report</div>
          <div className="text-[10px] text-slate-500 mt-0.5">IFRS 9 ECL & Basel III Capital</div>
        </div>

        {/* 2. Application Risk Dossier */}
        <div
          onClick={() => setSelectedReportType('application')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedReportType === 'application'
              ? 'bg-emerald-50 border-emerald-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <UserCheck className={`w-5 h-5 mb-2 ${selectedReportType === 'application' ? 'text-emerald-600' : 'text-slate-400'}`} />
          <div className="text-xs font-bold text-slate-900">Application Underwriting</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Origination Scorecard Memo</div>
        </div>

        {/* 3. Behavioral Risk & ECL */}
        <div
          onClick={() => setSelectedReportType('behavioral')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedReportType === 'behavioral'
              ? 'bg-blue-50 border-blue-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <Activity className={`w-5 h-5 mb-2 ${selectedReportType === 'behavioral' ? 'text-blue-600' : 'text-slate-400'}`} />
          <div className="text-xs font-bold text-slate-900">Behavioral Account Dossier</div>
          <div className="text-[10px] text-slate-500 mt-0.5">12M PD & Account Solvency</div>
        </div>

        {/* 4. Model Audit & MRM */}
        <div
          onClick={() => setSelectedReportType('model_audit')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedReportType === 'model_audit'
              ? 'bg-amber-50 border-amber-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <FlaskConical className={`w-5 h-5 mb-2 ${selectedReportType === 'model_audit' ? 'text-amber-600' : 'text-slate-400'}`} />
          <div className="text-xs font-bold text-slate-900">Model Validation Audit</div>
          <div className="text-[10px] text-slate-500 mt-0.5">AUC, KS, Gini & PSI Diagnostics</div>
        </div>

        {/* 5. Data Quality Certificate */}
        <div
          onClick={() => setSelectedReportType('data_quality')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedReportType === 'data_quality'
              ? 'bg-cyan-50 border-cyan-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <CheckCircle2 className={`w-5 h-5 mb-2 ${selectedReportType === 'data_quality' ? 'text-cyan-600' : 'text-slate-400'}`} />
          <div className="text-xs font-bold text-slate-900">Data Quality Certificate</div>
          <div className="text-[10px] text-slate-500 mt-0.5">RC-01 to RC-05 Reconciliation</div>
        </div>
      </div>

      {/* Interactive Report Preview Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        {/* Document Header */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-200">
          <div>
            <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              CONFIDENTIAL • REGULATORY DISCLOSURE
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              {selectedReportType === 'portfolio' && 'PORTFOLIO CREDIT RISK & SOLVENCY DISCLOSURE (Q3-2024)'}
              {selectedReportType === 'application' && 'APPLICATION CREDIT UNDERWRITING MEMORANDUM'}
              {selectedReportType === 'behavioral' && 'BEHAVIORAL RISK & IFRS 9 PROVISIONING SCHEDULE'}
              {selectedReportType === 'model_audit' && 'INDEPENDENT MODEL RISK MANAGEMENT (MRM) VALIDATION REPORT'}
              {selectedReportType === 'data_quality' && 'DATA GOVERNANCE & RECONCILIATION COMPLIANCE CERTIFICATE'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              AI Credit Risk Platform Engine v3.1 • Basel Committee on Banking Supervision (BCBS) Framework
            </p>
          </div>

          <div className="text-right text-xs">
            <span className="font-bold text-slate-900 block">Report Ref: CR-2024-Q3-0941</span>
            <span className="text-slate-500 text-[11px]">Generated: {new Date().toLocaleDateString('en-IN')}</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">1. Executive Summary</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {selectedReportType === 'portfolio' && (
              `As of Q3-2024, the enterprise mortgage portfolio comprises 14,850 active loan facilities representing a total outstanding exposure of ${formatCurrency(PORTFOLIO_STATS.totalExposure)}. The portfolio exhibits an average 12-month Probability of Default (PD) of ${(PORTFOLIO_STATS.averagePd * 100).toFixed(2)}% (Through-The-Cycle calibrated: ${(PORTFOLIO_STATS.averageTtcPd * 100).toFixed(2)}%) and a non-performing asset (NPA) default rate of ${(PORTFOLIO_STATS.defaultRate * 100).toFixed(2)}%. Total IFRS 9 Stage 1, 2, and 3 Expected Credit Loss (ECL) provisioning is established at ${formatCurrency(PORTFOLIO_STATS.totalExpectedLoss)}, supported by ${formatCurrency(PORTFOLIO_STATS.totalCapitalRequirement)} in regulatory Tier 1 + CCB capital.`
            )}
            {selectedReportType === 'application' && (
              'This memorandum documents the automated credit evaluation for a new loan origination facility. The applicant was scored across debt affordability (DTI), loan-to-value (LTV), collateral coverage, and bureau delinquency history. Thin-file non-traditional scoring logic was applied if bureau depth was under 6 months.'
            )}
            {selectedReportType === 'behavioral' && (
              'This dossier provides longitudinal behavioral credit assessment for seasoned accounts (MOB ≥ 6). Incorporating observed repayment track record, borrower equity, liquidity excess (CEP), and quarterly macroeconomic factors (HPI & GDP), the model calculates point-in-time and TTC default probabilities alongside Basel capital requirements.'
            )}
            {selectedReportType === 'model_audit' && (
              `The Model Risk Management (MRM) function has completed the annual statistical validation for the Logistic Regression WOE Scorecard (v3.1). The model achieves an AUC-ROC of ${MODEL_PERFORMANCE_DATA.aucRoc.toFixed(3)}, Gini coefficient of ${MODEL_PERFORMANCE_DATA.gini.toFixed(3)}, and a maximum KS statistic of ${MODEL_PERFORMANCE_DATA.ksStatistic.toFixed(1)}%. Population Stability Index (PSI) is measured at ${MODEL_PERFORMANCE_DATA.psi.toFixed(3)}, confirming strict stability.`
            )}
            {selectedReportType === 'data_quality' && (
              'Data integrity audit confirmed 98.9% data cleanliness across 14,850 observations. Reconciliation checks RC-01 through RC-05 verify total loan balances, seasoning gate criteria (MOB ≥ 6), non-negative balance conditions, and macroeconomic index alignment.'
            )}
          </p>
        </div>

        {/* Key Metrics Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">2. Certified Parameter Schedule</h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Parameter / Dimension</th>
                  <th className="px-4 py-2.5">Regulatory Standard</th>
                  <th className="px-4 py-2.5">Reported Value</th>
                  <th className="px-4 py-2.5 text-right">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-2.5 font-medium text-slate-800">Minimum Capital Adequacy (CRAR)</td>
                  <td className="px-4 py-2.5 text-slate-500">Basel III ≥ 10.5%</td>
                  <td className="px-4 py-2.5 font-bold text-slate-900">14.8%</td>
                  <td className="px-4 py-2.5 text-right text-emerald-600 font-bold">Compliant</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-slate-800">Model AUC-ROC Threshold</td>
                  <td className="px-4 py-2.5 text-slate-500">MRM Floor ≥ 0.750</td>
                  <td className="px-4 py-2.5 font-bold text-slate-900">0.864</td>
                  <td className="px-4 py-2.5 text-right text-emerald-600 font-bold">Compliant</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-slate-800">Population Stability Index (PSI)</td>
                  <td className="px-4 py-2.5 text-slate-500">Stability Limit &lt; 0.100</td>
                  <td className="px-4 py-2.5 font-bold text-slate-900">0.038</td>
                  <td className="px-4 py-2.5 text-right text-emerald-600 font-bold">Compliant</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-slate-800">Seasoning Gate Rule</td>
                  <td className="px-4 py-2.5 text-slate-500">MOB ≥ 6 Months</td>
                  <td className="px-4 py-2.5 font-bold text-slate-900">Enforced</td>
                  <td className="px-4 py-2.5 text-right text-emerald-600 font-bold">Compliant</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Regulatory Sign-off Footer */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Chief Risk Officer (CRO)</span>
            <div className="font-bold text-slate-800">S. R. Venkatesh, FRM</div>
            <div className="text-[10px] text-slate-500">Enterprise Risk Management</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Head of Model Validation</span>
            <div className="font-bold text-slate-800">Dr. Elena Rostova, PhD</div>
            <div className="text-[10px] text-slate-500">Quantitative Risk Analytics</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Regulatory Audit Status</span>
            <div className="text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Unqualified Audit Clean
            </div>
            <div className="text-[10px] text-slate-500">Certificate ID: MRM-2024-884</div>
          </div>
        </div>
      </div>
    </div>
  );
};
