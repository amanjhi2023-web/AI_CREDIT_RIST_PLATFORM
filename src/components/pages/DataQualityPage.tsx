import React, { useState } from 'react';
import { DATA_QUALITY_REPORT } from '../../data/mockData';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Database, 
  Filter, 
  FileCheck, 
  Sparkles, 
  Layers, 
  ArrowRight,
  Info
} from 'lucide-react';

export const DataQualityPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PASSED' | 'FAILED' | 'WARNING'>('ALL');
  const [isFixing, setIsFixing] = useState(false);
  const [fixedNotice, setFixedNotice] = useState(false);

  const handleAutoRemediate = () => {
    setIsFixing(true);
    setTimeout(() => {
      setIsFixing(false);
      setFixedNotice(true);
      setTimeout(() => setFixedNotice(false), 4000);
    }, 800);
  };

  const filteredChecks = DATA_QUALITY_REPORT.reconciliationChecks.filter(c => {
    if (activeFilter === 'ALL') return true;
    return c.status === activeFilter;
  });

  return (
    <div id="data-quality-page" className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
              Data Integrity & Preprocessing Pipeline
            </span>
            <span className="text-xs text-slate-400 font-mono">Panel Audit: Q3-2024</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span>Data Quality & Reconciliation Engine</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            Automated integrity verification for Behavioral Scorecard and Portfolio panels. Enforces reconciliation checks RC-01 through RC-05, outlier detection, and data sanitization.
          </p>
        </div>

        {/* Automated Remediation Action */}
        <button
          type="button"
          onClick={handleAutoRemediate}
          disabled={isFixing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all"
        >
          {isFixing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{isFixing ? 'SANITIZING RECORDS...' : 'Auto-Remediate Anomalies'}</span>
        </button>
      </div>

      {/* Auto-remediation notification */}
      {fixedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Automated pipeline executed: Imputed 42 missing macro variables, winsorized 18 extreme LTV outliers, and quarantined 12 duplicate accounts.</span>
        </div>
      )}

      {/* Top Level Data Quality Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Total Records */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Rows</div>
          <div className="text-lg font-extrabold text-slate-900 mt-1">{DATA_QUALITY_REPORT.totalRecords.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Raw ingest</div>
        </div>

        {/* 2. Unique Accounts */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Unique Accounts</div>
          <div className="text-lg font-extrabold text-blue-600 mt-1">{DATA_QUALITY_REPORT.uniqueAccounts.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Distinct IDs</div>
        </div>

        {/* 3. Valid Clean Records */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Clean & Valid</div>
          <div className="text-lg font-extrabold text-emerald-600 mt-1">{DATA_QUALITY_REPORT.validRecordsCount.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-emerald-700 mt-0.5 font-bold">{DATA_QUALITY_REPORT.dataHealthScore}% Health</div>
        </div>

        {/* 4. Missing Values */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Missing Values</div>
          <div className="text-lg font-extrabold text-amber-600 mt-1">{DATA_QUALITY_REPORT.missingValuesCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">0.08% of fields</div>
        </div>

        {/* 5. Duplicate Records */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Duplicates</div>
          <div className="text-lg font-extrabold text-rose-600 mt-1">{DATA_QUALITY_REPORT.duplicateRecordsCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Quarantined</div>
        </div>

        {/* 6. Invalid Records */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Invalid Rules</div>
          <div className="text-lg font-extrabold text-rose-600 mt-1">{DATA_QUALITY_REPORT.invalidRecordsCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Schema mismatch</div>
        </div>

        {/* 7. Outliers Detected */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Outliers (3σ)</div>
          <div className="text-lg font-extrabold text-purple-600 mt-1">{DATA_QUALITY_REPORT.outliersCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Winsorized</div>
        </div>

        {/* 8. Removed Records */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Dropped Rows</div>
          <div className="text-lg font-extrabold text-slate-700 mt-1">{DATA_QUALITY_REPORT.removedRecordsCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">0.26% Pruned</div>
        </div>
      </div>

      {/* Reconciliation Rules (RC-01 to RC-05) Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Reconciliation Checks (RC-01 to RC-05)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Regulatory compliance validation rules for behavioral datasets & capital engines.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Filter Status:</span>
            <div className="inline-flex p-1 rounded-lg bg-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setActiveFilter('ALL')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  activeFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                All ({DATA_QUALITY_REPORT.reconciliationChecks.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('PASSED')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  activeFilter === 'PASSED' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                Passed
              </button>
            </div>
          </div>
        </div>

        {/* Checks Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Rule ID</th>
                <th className="px-4 py-3">Rule Name & Description</th>
                <th className="px-4 py-3">Passed Rows</th>
                <th className="px-4 py-3">Failed</th>
                <th className="px-4 py-3">Remediation Action</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChecks.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">{rule.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{rule.name}</div>
                    <div className="text-[11px] text-slate-500">{rule.description}</div>
                  </td>
                  <td className="px-4 py-3 text-emerald-600 font-bold">{rule.passedCount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-amber-600 font-bold">{rule.failedCount}</td>
                  <td className="px-4 py-3 text-slate-600 text-[11px]">{rule.action}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{rule.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Row-Level Inspection Sample */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Sample Audited Record Stream
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Live inspection of incoming panel observations against chronological validation rules.</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Showing {DATA_QUALITY_REPORT.sampleReconciliationRecords.length} Sample Records</span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2.5">Account ID</th>
                <th className="px-3 py-2.5">Snapshot Time (T)</th>
                <th className="px-3 py-2.5">First Time (T_first)</th>
                <th className="px-3 py-2.5">Origination Time (T_orig)</th>
                <th className="px-3 py-2.5">Maturity Time (T_mat)</th>
                <th className="px-3 py-2.5">Failed Checks</th>
                <th className="px-3 py-2.5 text-right">Remediation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DATA_QUALITY_REPORT.sampleReconciliationRecords.map((row) => (
                <tr key={row.accountId} className="hover:bg-slate-50/60">
                  <td className="px-3 py-2.5 font-mono font-bold text-slate-800">{row.accountId}</td>
                  <td className="px-3 py-2.5 font-mono">{row.snapshotTime}</td>
                  <td className="px-3 py-2.5 font-mono">{row.firstTime}</td>
                  <td className="px-3 py-2.5 font-mono">{row.originationTime}</td>
                  <td className="px-3 py-2.5 font-mono">{row.maturityTime}</td>
                  <td className="px-3 py-2.5">
                    {row.failedChecks.length === 0 ? (
                      <span className="text-emerald-600 font-medium">None (All Passed)</span>
                    ) : (
                      <span className="text-rose-600 font-medium">{row.failedChecks.join(', ')}</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      row.remediation === 'Keep' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {row.remediation === 'Keep' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{row.remediation}</span>
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
