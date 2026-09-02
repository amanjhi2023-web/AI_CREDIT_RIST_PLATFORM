import React, { useState, useMemo } from 'react';
import { LoanApplication, PortfolioSummary } from '../../types';
import { KpiCard } from '../common/KpiCard';
import { RiskBadge, DecisionBadge } from '../common/RiskBadge';
import { formatINR, formatPercent, formatNumber } from '../../utils/formatting';
import { 
  Filter, 
  Search, 
  Download, 
  Columns, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  TrendingUp, 
  ShieldAlert, 
  Coins, 
  Building2, 
  Percent, 
  CheckSquare, 
  Square, 
  X, 
  Check, 
  SlidersHorizontal,
  ExternalLink,
  GitCompare,
  BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ScatterChart, 
  Scatter, 
  ZAxis, 
  Cell 
} from 'recharts';

interface MultipleLoansPageProps {
  allLoans: LoanApplication[];
  onSelectLoan: (loan: LoanApplication) => void;
  onNavigateToIndividual: (loan: LoanApplication) => void;
}

export const MultipleLoansPage: React.FC<MultipleLoansPageProps> = ({
  allLoans,
  onSelectLoan,
  onNavigateToIndividual,
}) => {
  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLoanType, setSelectedLoanType] = useState('All');
  const [selectedRiskCategory, setSelectedRiskCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedSegment, setSelectedSegment] = useState('All');
  const [selectedDecision, setSelectedDecision] = useState('All');
  const [maxPdFilter, setMaxPdFilter] = useState<number>(20);

  // Table Sorting & Pagination
  const [sortField, setSortField] = useState<keyof LoanApplication>('loanAmount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Comparison Tool (Side-by-Side) State
  const [comparedLoanIds, setComparedLoanIds] = useState<string[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  // Unique Filter Options
  const loanTypes = ['All', 'Home Loan', 'Personal Loan', 'Auto Loan', 'MSME Loan', 'Credit Card'];
  const riskCategories = ['All', 'Low Risk', 'Medium Risk', 'High Risk'];
  const regions = ['All', 'North', 'South', 'West', 'East', 'Central'];
  const segments = ['All', 'Salaried', 'Self-Employed', 'Business Owner', 'Professional'];
  const decisions = ['All', 'APPROVED', 'MANUAL REVIEW', 'REJECTED'];

  // Filtered Loans Memo
  const filteredLoans = useMemo(() => {
    return allLoans.filter((l) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match = l.loanId.toLowerCase().includes(q) ||
          l.customerId.toLowerCase().includes(q) ||
          l.customerName.toLowerCase().includes(q) ||
          l.branch.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedLoanType !== 'All' && l.loanType !== selectedLoanType) return false;
      if (selectedRiskCategory !== 'All' && l.riskCategory !== selectedRiskCategory) return false;
      if (selectedRegion !== 'All' && l.region !== selectedRegion) return false;
      if (selectedSegment !== 'All' && l.employmentType !== selectedSegment) return false;
      if (selectedDecision !== 'All' && l.decision !== selectedDecision) return false;
      if (l.pd > maxPdFilter / 100) return false;
      return true;
    });
  }, [allLoans, searchQuery, selectedLoanType, selectedRiskCategory, selectedRegion, selectedSegment, selectedDecision, maxPdFilter]);

  // Dynamic Metrics for Filtered Subset
  const filteredMetrics = useMemo(() => {
    const count = filteredLoans.length;
    if (count === 0) {
      return {
        totalLoans: 0,
        totalExposure: 0,
        totalEcl: 0,
        avgPd: 0,
        avgLgd: 0,
        highRiskCount: 0,
        approvalRate: 0,
        totalRwa: 0
      };
    }
    const totalExposure = filteredLoans.reduce((acc, l) => acc + l.loanAmount, 0);
    const totalEcl = filteredLoans.reduce((acc, l) => acc + l.ecl, 0);
    const avgPd = filteredLoans.reduce((acc, l) => acc + l.pd, 0) / count;
    const avgLgd = filteredLoans.reduce((acc, l) => acc + l.lgd, 0) / count;
    const highRiskCount = filteredLoans.filter(l => l.riskCategory === 'High Risk').length;
    const approvedCount = filteredLoans.filter(l => l.decision === 'APPROVED').length;
    const approvalRate = (approvedCount / count) * 100;
    const totalRwa = totalExposure * 0.742;

    return {
      totalLoans: count,
      totalExposure,
      totalEcl,
      avgPd,
      avgLgd,
      highRiskCount,
      approvalRate,
      totalRwa
    };
  }, [filteredLoans]);

  // Sorted Loans
  const sortedLoans = useMemo(() => {
    return [...filteredLoans].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filteredLoans, sortField, sortDirection]);

  // Paginated Loans
  const paginatedLoans = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedLoans.slice(start, start + pageSize);
  }, [sortedLoans, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedLoans.length / pageSize) || 1;

  // Toggle Sorting
  const handleSort = (field: keyof LoanApplication) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Toggle Comparison Checkbox
  const toggleCompare = (loanId: string) => {
    if (comparedLoanIds.includes(loanId)) {
      setComparedLoanIds(comparedLoanIds.filter(id => id !== loanId));
    } else {
      if (comparedLoanIds.length >= 3) {
        alert('You can compare a maximum of 3 loans side-by-side.');
        return;
      }
      setComparedLoanIds([...comparedLoanIds, loanId]);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Loan ID', 'Customer ID', 'Customer Name', 'Type', 'Amount (INR)', 'Credit Score', 'PD (%)', 'LGD (%)', 'ECL (INR)', 'Risk Category', 'Decision', 'Branch'];
    const rows = filteredLoans.map(l => [
      l.loanId,
      l.customerId,
      `"${l.customerName}"`,
      l.loanType,
      l.loanAmount,
      l.creditScore,
      (l.pd * 100).toFixed(2),
      (l.lgd * 100).toFixed(2),
      l.ecl.toFixed(2),
      l.riskCategory,
      l.decision,
      `"${l.branch}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `credit_risk_portfolio_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Charts: Stacked Loan Type vs Risk Category
  const loanTypeChartData = useMemo(() => {
    const types = ['Home Loan', 'Personal Loan', 'Auto Loan', 'MSME Loan', 'Credit Card'];
    return types.map(t => {
      const subset = filteredLoans.filter(l => l.loanType === t);
      const low = subset.filter(l => l.riskCategory === 'Low Risk').length;
      const med = subset.filter(l => l.riskCategory === 'Medium Risk').length;
      const high = subset.filter(l => l.riskCategory === 'High Risk').length;
      return {
        name: t,
        'Low Risk': low,
        'Medium Risk': med,
        'High Risk': high,
      };
    });
  }, [filteredLoans]);

  // Scatter Chart: PD vs Loan Amount
  const scatterData = useMemo(() => {
    return filteredLoans.map(l => ({
      x: l.loanAmount / 100000, // Lakhs
      y: parseFloat((l.pd * 100).toFixed(2)),
      name: l.customerName,
      risk: l.riskCategory,
      id: l.loanId,
    }));
  }, [filteredLoans]);

  return (
    <div id="multiple-loans-page" className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111C35] p-5 rounded-xl border border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>Multiple Loans / Portfolio Risk Analysis</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Filter, segment, compare, and stress-screen multi-loan cohorts across branch networks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {comparedLoanIds.length > 0 && (
            <button
              type="button"
              id="btn-open-compare"
              onClick={() => setShowComparisonModal(true)}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs shadow-indigo-600/30"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare Selected ({comparedLoanIds.length})</span>
            </button>
          )}

          <button
            type="button"
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* Filter & Segmentation Controls (Requirement #12) */}
      <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Multi-Factor Portfolio Filters</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedLoanType('All');
              setSelectedRiskCategory('All');
              setSelectedRegion('All');
              setSelectedSegment('All');
              setSelectedDecision('All');
              setMaxPdFilter(20);
            }}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
          >
            Reset All Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Search Query */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Search Keyword</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Loan ID, Customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          {/* Loan Type */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Loan Type</label>
            <select
              value={selectedLoanType}
              onChange={(e) => setSelectedLoanType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {loanTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Risk Category */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Risk Tier</label>
            <select
              value={selectedRiskCategory}
              onChange={(e) => setSelectedRiskCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {riskCategories.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Region */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Region / Zone</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {regions.map(reg => <option key={reg} value={reg}>{reg}</option>)}
            </select>
          </div>

          {/* Employment Segment */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Borrower Segment</label>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {segments.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Decision */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Underwriting Decision</label>
            <select
              value={selectedDecision}
              onChange={(e) => setSelectedDecision(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {decisions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Max PD Slider */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-300">Max PD Filter:</span>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={maxPdFilter}
              onChange={(e) => setMaxPdFilter(parseFloat(e.target.value))}
              className="w-44 accent-blue-500 cursor-pointer"
            />
            <span className="font-bold font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/80">
              ≤ {maxPdFilter.toFixed(1)}%
            </span>
          </div>

          <div className="text-slate-400 font-medium">
            Displaying <span className="font-bold text-white">{filteredLoans.length}</span> of {allLoans.length} portfolio applications
          </div>
        </div>
      </div>

      {/* Filtered Subset KPI Summary Cards (Requirement #13) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-[#111C35] p-3.5 rounded-xl border border-slate-800 shadow-2xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Filtered Loans</div>
          <div className="text-lg font-bold text-white mt-0.5">{formatNumber(filteredMetrics.totalLoans)}</div>
        </div>
        <div className="bg-[#111C35] p-3.5 rounded-xl border border-slate-800 shadow-2xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Filtered Exposure</div>
          <div className="text-lg font-bold text-white mt-0.5">{formatINR(filteredMetrics.totalExposure, true)}</div>
        </div>
        <div className="bg-[#111C35] p-3.5 rounded-xl border border-slate-800 shadow-2xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Filtered ECL</div>
          <div className="text-lg font-bold text-white mt-0.5">{formatINR(filteredMetrics.totalEcl, true)}</div>
        </div>
        <div className="bg-[#111C35] p-3.5 rounded-xl border border-slate-800 shadow-2xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Weighted Avg PD</div>
          <div className="text-lg font-bold text-white mt-0.5">{formatPercent(filteredMetrics.avgPd)}</div>
        </div>
        <div className="bg-[#111C35] p-3.5 rounded-xl border border-slate-800 shadow-2xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Weighted Avg LGD</div>
          <div className="text-lg font-bold text-white mt-0.5">{formatPercent(filteredMetrics.avgLgd)}</div>
        </div>
        <div className="bg-[#111C35] p-3.5 rounded-xl border border-slate-800 shadow-2xs">
          <div className="text-[10px] font-bold text-rose-400 uppercase">High Risk Count</div>
          <div className="text-lg font-bold text-rose-400 mt-0.5">{filteredMetrics.highRiskCount}</div>
        </div>
        <div className="bg-[#111C35] p-3.5 rounded-xl border border-slate-800 shadow-2xs">
          <div className="text-[10px] font-bold text-emerald-400 uppercase">Approval Rate</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">{filteredMetrics.approvalRate.toFixed(1)}%</div>
        </div>
        <div className="bg-[#111C35] p-3.5 rounded-xl border border-slate-800 shadow-2xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Basel RWA</div>
          <div className="text-lg font-bold text-white mt-0.5">{formatINR(filteredMetrics.totalRwa, true)}</div>
        </div>
      </div>

      {/* Portfolio Visualizations (Requirement #14) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan Type vs Risk Category Stacked Bar */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-400" />
              <span>Loan Type vs Risk Category</span>
            </h3>
            <span className="text-xs text-slate-400">Distribution count</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loanTypeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', color: '#cbd5e1' }} />
                <Bar dataKey="Low Risk" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Medium Risk" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="High Risk" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PD vs Loan Amount Scatter */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">PD vs Loan Exposure Scatter</h3>
              <p className="text-[11px] text-slate-400">X-axis: Exposure in ₹ Lakhs | Y-axis: Probability of Default %</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" dataKey="x" name="Amount (Lakhs)" unit="L" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis type="number" dataKey="y" name="PD (%)" unit="%" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any, name: string) => [
                    name === 'Amount (Lakhs)' ? `₹${value} Lakhs` : `${value}%`,
                    name
                  ]}
                />
                <Scatter name="Loans" data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell 
                      key={`scatter-cell-${index}`} 
                      fill={entry.risk === 'Low Risk' ? '#10b981' : entry.risk === 'Medium Risk' ? '#f59e0b' : '#ef4444'} 
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comprehensive Loan Table (Requirement #16) */}
      <div className="bg-[#111C35] rounded-xl border border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white">Underwritten Loans Database</h3>
            <p className="text-xs text-slate-400">Click column headers to sort. Select checkboxes to compare 2-3 loans.</p>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-300 font-semibold border-b border-slate-800 select-none">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <span className="sr-only">Select</span>
                </th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('loanId')}
                >
                  <div className="flex items-center gap-1">
                    <span>Loan ID / Customer</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white"
                  onClick={() => handleSort('loanType')}
                >
                  <div className="flex items-center gap-1">
                    <span>Type</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white"
                  onClick={() => handleSort('loanAmount')}
                >
                  <div className="flex items-center gap-1">
                    <span>Amount</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white"
                  onClick={() => handleSort('creditScore')}
                >
                  <div className="flex items-center gap-1">
                    <span>Score</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white"
                  onClick={() => handleSort('pd')}
                >
                  <div className="flex items-center gap-1">
                    <span>PD</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white"
                  onClick={() => handleSort('lgd')}
                >
                  <div className="flex items-center gap-1">
                    <span>LGD</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:text-white"
                  onClick={() => handleSort('ecl')}
                >
                  <div className="flex items-center gap-1">
                    <span>ECL</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Risk Tier</th>
                <th className="py-3 px-3">Decision</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {paginatedLoans.map((loan) => {
                const isCompared = comparedLoanIds.includes(loan.loanId);
                return (
                  <tr 
                    key={loan.loanId} 
                    className={`hover:bg-slate-800/50 transition-colors ${isCompared ? 'bg-indigo-950/40' : ''}`}
                  >
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleCompare(loan.loanId)}
                        className="text-slate-400 hover:text-indigo-400 transition-colors focus:outline-none"
                        title={isCompared ? 'Remove from comparison' : 'Add to side-by-side comparison'}
                      >
                        {isCompared ? (
                          <CheckSquare className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{loan.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <span>{loan.loanId}</span>
                        <span>•</span>
                        <span>{loan.branch}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-300">{loan.loanType}</td>

                    <td className="py-3 px-3 font-bold text-white">{formatINR(loan.loanAmount)}</td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-white">{loan.creditScore}</span>
                      <span className="text-[10px] text-slate-400 block">{loan.dti}% DTI</span>
                    </td>

                    <td className="py-3 px-3 font-bold text-white">{formatPercent(loan.pd)}</td>

                    <td className="py-3 px-3 text-slate-300">{formatPercent(loan.lgd)}</td>

                    <td className="py-3 px-3 font-bold text-white">{formatINR(loan.ecl)}</td>

                    <td className="py-3 px-3">
                      <RiskBadge category={loan.riskCategory} size="sm" showIcon={false} />
                    </td>

                    <td className="py-3 px-3">
                      <DecisionBadge decision={loan.decision} size="sm" />
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectLoan(loan);
                          onNavigateToIndividual(loan);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 font-semibold transition-colors inline-flex items-center gap-1 border border-slate-700 hover:border-blue-500"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {paginatedLoans.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400 text-xs">
                    No loan applications match your active filter criteria. Try resetting the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 font-medium">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedLoans.length)} of {sortedLoans.length} entries
          </div>

          <div className="flex items-center gap-1.5 self-center">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-1.5 rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                  currentPage === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-1.5 rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loan Comparison Modal (Requirement #15) */}
      {showComparisonModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#111C35] rounded-2xl max-w-5xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <GitCompare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Side-by-Side Loan Comparison</h3>
                  <p className="text-xs text-slate-400">Evaluating multi-parameter risk differences across selected borrowers</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowComparisonModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparedLoanIds.map(id => {
                const loan = allLoans.find(l => l.loanId === id);
                if (!loan) return null;
                return (
                  <div key={loan.loanId} className="border border-slate-800 rounded-xl p-4 bg-slate-900/80 space-y-3">
                    <div className="flex items-start justify-between pb-2 border-b border-slate-800">
                      <div>
                        <div className="font-bold text-white text-sm">{loan.customerName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{loan.loanId}</div>
                      </div>
                      <RiskBadge category={loan.riskCategory} size="sm" />
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">Facility Type:</span>
                        <span className="font-semibold text-slate-200">{loan.loanType}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">Loan Amount:</span>
                        <span className="font-bold text-white">{formatINR(loan.loanAmount)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">Credit Score:</span>
                        <span className="font-bold text-white">{loan.creditScore}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">PD (Prob. of Default):</span>
                        <span className="font-bold text-white">{formatPercent(loan.pd)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">LGD:</span>
                        <span className="font-bold text-white">{formatPercent(loan.lgd)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">ECL (Expected Loss):</span>
                        <span className="font-bold text-white">{formatINR(loan.ecl)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">DTI Ratio:</span>
                        <span className="font-bold text-white">{loan.dti}%</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">Decision:</span>
                        <DecisionBadge decision={loan.decision} size="sm" />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectLoan(loan);
                        onNavigateToIndividual(loan);
                        setShowComparisonModal(false);
                      }}
                      className="w-full mt-2 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-xs shadow-blue-600/30"
                    >
                      Open Individual View
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Comparing {comparedLoanIds.length} loans side-by-side</span>
              <button
                type="button"
                onClick={() => setComparedLoanIds([])}
                className="text-rose-400 hover:text-rose-300 font-semibold"
              >
                Clear Comparison Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
