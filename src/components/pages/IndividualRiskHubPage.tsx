import React from 'react';
import { 
  FileText, 
  Activity, 
  ArrowRight, 
  UserPlus, 
  History, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Calendar,
  Layers
} from 'lucide-react';

interface IndividualRiskHubProps {
  onSelectSubModule: (module: 'application_scorecard' | 'behavioral_scorecard') => void;
}

export const IndividualRiskHubPage: React.FC<IndividualRiskHubProps> = ({ onSelectSubModule }) => {
  return (
    <div id="individual-risk-hub-page" className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wide">
            Single Account Assessment
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">
          Individual Risk Evaluation
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Evaluate creditworthiness for an individual applicant or borrower. Select the appropriate scorecard module below based on whether the customer is a <strong>New Customer (Application Stage)</strong> or an <strong>Existing Seasoned Borrower (Behavioral Stage)</strong>.
        </p>
      </div>

      {/* Important Methodological Separation Notice */}
      <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-slate-800 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-blue-950">Methodological Rule of Separation:</span>
          <p className="text-slate-600 leading-relaxed">
            Application Risk and Behavioral Risk solve two fundamentally different credit problems and utilize separate datasets, mathematical models, and feature spaces. <strong>Do not mix application variables with longitudinal behavioral performance.</strong>
          </p>
        </div>
      </div>

      {/* Two Large Distinct Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option A: Application Scorecard */}
        <div 
          id="btn-launch-application-scorecard"
          onClick={() => onSelectSubModule('application_scorecard')}
          className="group bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Option A: New Customer
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Application Scorecard
              </h2>
              <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                Origination Stage Risk Assessment
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Designed for <strong>New Customers</strong> applying for a new loan facility. Assesses collateral, debt affordability (DTI), bureau history, and supports <strong>Thin File / No Credit History</strong> non-traditional heuristic evaluation.
            </p>

            {/* Workflow steps */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs">
              <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Evaluation Workflow:</div>
              <div className="text-[11px] text-slate-600 font-medium space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>Loan Information (Amount, LTV, Tenure, Purpose)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Credit Information & Thin-File Detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 text-[10px] flex items-center justify-center font-bold">3</span>
                  <span>Application Score → Model PD → Risk Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 text-[10px] flex items-center justify-center font-bold">4</span>
                  <span>Decision: <strong>APPROVE / REJECT / MANUAL REVIEW</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
            <span>Launch Application Scorecard Form</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Option B: Behavioral Scorecard */}
        <div 
          id="btn-launch-behavioral-scorecard"
          onClick={() => onSelectSubModule('behavioral_scorecard')}
          className="group bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                Option B: Existing Loan
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                Behavioral Scorecard
              </h2>
              <div className="text-xs font-semibold text-blue-700 mt-0.5">
                Running Loan & 12M Default Prediction (MOB ≥ 6)
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Designed for <strong>Existing / Seasoned Loans</strong> with observed repayment history. Uses Months on Book (MOB), MOB², Borrower Equity, Cumulative Excess Payments (CEP), and Macroeconomic variables (HPI & GDP) to compute 12M PD, LGD, EAD, ECL & Basel Capital.
            </p>

            {/* Workflow steps */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs">
              <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Evaluation Workflow:</div>
              <div className="text-[11px] text-slate-600 font-medium space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>Seasoning Gate: Verify Months On Book (MOB ≥ 6)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Time, Balance & Macro Variables (HPI & GDP)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 text-[10px] flex items-center justify-center font-bold">3</span>
                  <span>Behavioral Score → 12M PIT PD → TTC Calibrated PD</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 text-[10px] flex items-center justify-center font-bold">4</span>
                  <span>Credit Risk Layer: LGD → EAD → ECL → Basel III Capital</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
            <span>Launch Behavioral Scorecard & ECL Engine</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
