import React, { useState } from 'react';
import { 
  PORTFOLIO_STATS, 
  PORTFOLIO_RATING_DISTRIBUTION, 
  PORTFOLIO_VINTAGE_DATA, 
  PORTFOLIO_MOB_DATA, 
  STRESS_SCENARIOS, 
  PORTFOLIO_SAMPLE_RECORDS 
} from '../../data/mockData';
import { 
  PieChart, 
  Upload, 
  FileSpreadsheet, 
  Filter, 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Landmark, 
  Info, 
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
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';

export const PortfolioRiskPage: React.FC = () => {
  // State for dataset & upload
  const [activeDatasetName, setActiveDatasetName] = useState('Retail_Mortgage_Portfolio_Master_2024.csv');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Filters State
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<string>('ALL');
  const [selectedVintageFilter, setSelectedVintageFilter] = useState<string>('ALL');
  const [selectedLoanTypeFilter, setSelectedLoanTypeFilter] = useState<string>('ALL');

  // Stress Scenario State
  const [activeStressScenarioId, setActiveStressScenarioId] = useState<'base' | 'mild' | 'severe'>('base');

  const activeStress = STRESS_SCENARIOS.find(s => s.id === activeStressScenarioId) || STRESS_SCENARIOS[0];

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakhs`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Mock Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        setActiveDatasetName(file.name);
        setIsUploading(false);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 4000);
      }, 700);
    }
  };

  // Filtered Records
  const filteredRecords = PORTFOLIO_SAMPLE_RECORDS.filter(r => {
    if (selectedRatingFilter !== 'ALL' && r.rating !== selectedRatingFilter) return false;
    if (selectedVintageFilter !== 'ALL' && r.vintage !== selectedVintageFilter) return false;
    if (selectedLoanTypeFilter !== 'ALL' && r.loanType !== selectedLoanTypeFilter) return false;
    return true;
  });

  // Data for Exposure Distribution
  const exposureDistData = [
    { bracket: '< ₹25L', count: 3200, exposure: 6400000000 },
    { bracket: '₹25L - ₹50L', count: 6850, exposure: 25687500000 },
    { bracket: '₹50L - ₹75L', count: 3100, exposure: 18600000000 },
    { bracket: '₹75L - ₹1Cr', count: 1200, exposure: 10200000000 },
    { bracket: '> ₹1Cr', count: 500, exposure: 5562500000 },
  ];

  // Data for PD Distribution Deciles
  const pdDistData = [
    { bin: '0.0 - 1.0%', count: 4200, label: 'Prime' },
    { bin: '1.0 - 2.5%', count: 4800, label: 'Standard' },
    { bin: '2.5 - 5.0%', count: 2900, label: 'Acceptable' },
    { bin: '5.0 - 10.0%', count: 1750, label: 'Watchlist' },
    { bin: '10.0 - 20.0%', count: 850, label: 'Vulnerable' },
    { bin: '> 20.0%', count: 350, label: 'High Risk' },
  ];

  // Data for LGD Distribution
  const lgdDistData = [
    { lgdRange: '10-20%', count: 4500, label: 'Low LGD (Low LTV)' },
    { lgdRange: '20-30%', count: 6200, label: 'Standard LGD' },
    { lgdRange: '30-40%', count: 2800, label: 'Moderate LGD' },
    { lgdRange: '40-50%', count: 950, label: 'High LGD' },
    { lgdRange: '> 50%', count: 400, label: 'Distressed' },
  ];

  return (
    <div id="portfolio-risk-page" className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Upload Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 uppercase tracking-wide">
              Portfolio Level Analytics & Capital
            </span>
            <span className="text-xs text-slate-400 font-mono">Book Size: {PORTFOLIO_STATS.totalLoans.toLocaleString('en-IN')} Loans</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-purple-600" />
            <span>Portfolio Risk & Solvency Dashboard</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            Aggregate portfolio credit risk analysis. Evaluate rating migrations, PD/LGD distributions, vintage decay, seasoning hazard curves, and macroeconomic stress tests.
          </p>
        </div>

        {/* Upload Dataset Button & File Input */}
        <div className="flex items-center gap-3">
          <label 
            id="btn-upload-portfolio-dataset"
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm shadow-purple-500/20 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'PARSING DATASET...' : 'Upload Portfolio Dataset'}</span>
            <input 
              type="file" 
              accept=".csv, .xlsx, .parquet" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>
        </div>
      </div>

      {/* Upload Notification Banner if applicable */}
      {uploadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Successfully validated and loaded <strong>{activeDatasetName}</strong>. 14,850 loan records mapped and preprocessed.</span>
        </div>
      )}

      {/* Top Level KPI Cards (Total Loans, Total Exposure, Average PD, Average LGD, Total EAD, Expected Loss, Capital Requirement, Default Rate) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Total Loans */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Loans</div>
          <div className="text-lg font-extrabold text-slate-900 mt-1">{PORTFOLIO_STATS.totalLoans.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Active accounts</div>
        </div>

        {/* 2. Total Exposure */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Exposure</div>
          <div className="text-lg font-extrabold text-slate-900 mt-1">{formatCurrency(PORTFOLIO_STATS.totalExposure)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Principal Balance</div>
        </div>

        {/* 3. Average PD */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Average PD</div>
          <div className="text-lg font-extrabold text-blue-600 mt-1">{(PORTFOLIO_STATS.averagePd * 100).toFixed(2)}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">TTC: {(PORTFOLIO_STATS.averageTtcPd * 100).toFixed(2)}%</div>
        </div>

        {/* 4. Average LGD */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Average LGD</div>
          <div className="text-lg font-extrabold text-amber-600 mt-1">{(PORTFOLIO_STATS.averageLgd * 100).toFixed(1)}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Collateral Haircut</div>
        </div>

        {/* 5. Total EAD */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total EAD</div>
          <div className="text-lg font-extrabold text-slate-900 mt-1">{formatCurrency(PORTFOLIO_STATS.totalEad)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">CCF: 100%</div>
        </div>

        {/* 6. Expected Loss */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Expected Loss</div>
          <div className="text-lg font-extrabold text-rose-600 mt-1">{formatCurrency(PORTFOLIO_STATS.totalExpectedLoss)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">0.98% of Book</div>
        </div>

        {/* 7. Capital Requirement */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Basel Capital</div>
          <div className="text-lg font-extrabold text-purple-600 mt-1">{formatCurrency(PORTFOLIO_STATS.totalCapitalRequirement)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">10.5% CRAR</div>
        </div>

        {/* 8. Default Rate */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Default Rate</div>
          <div className="text-lg font-extrabold text-emerald-600 mt-1">{(PORTFOLIO_STATS.defaultRate * 100).toFixed(2)}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">GNPA Ratio</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Portfolio Slicing Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Rating Filter */}
          <div>
            <select
              id="filter-rating"
              value={selectedRatingFilter}
              onChange={(e) => setSelectedRatingFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Rating Grades (A - E)</option>
              <option value="Grade A">Grade A (Prime)</option>
              <option value="Grade B">Grade B (Standard)</option>
              <option value="Grade C">Grade C (Moderate)</option>
              <option value="Grade D">Grade D (Subprime)</option>
              <option value="Grade E">Grade E (Distressed)</option>
            </select>
          </div>

          {/* Vintage Filter */}
          <div>
            <select
              id="filter-vintage"
              value={selectedVintageFilter}
              onChange={(e) => setSelectedVintageFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Origination Vintages</option>
              <option value="2021-Q1">2021-Q1</option>
              <option value="2021-Q3">2021-Q3</option>
              <option value="2022-Q1">2022-Q1</option>
              <option value="2022-Q3">2022-Q3</option>
              <option value="2023-Q1">2023-Q1</option>
              <option value="2023-Q3">2023-Q3</option>
              <option value="2024-Q1">2024-Q1</option>
            </select>
          </div>

          {/* Loan Purpose / Type */}
          <div>
            <select
              id="filter-loan-type"
              value={selectedLoanTypeFilter}
              onChange={(e) => setSelectedLoanTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Loan Types</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Loan Against Property">Loan Against Property</option>
              <option value="MSME Business">MSME Business</option>
              <option value="Auto Loan">Auto Loan</option>
            </select>
          </div>
        </div>
      </div>

      {/* 10 PORTFOLIO CHARTS SECTION */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Portfolio Analytics & Visualization Suite (10 Charts)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Chart 1: Rating Distribution */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">1. Rating Distribution</span>
              <span className="text-[10px] text-slate-400 font-mono">Grade A - E</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PORTFOLIO_RATING_DISTRIBUTION}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="grade" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar dataKey="percentage" name="Share %" fill="#2563eb" radius={[4, 4, 0, 0]}>
                    {PORTFOLIO_RATING_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-500 text-center">Grade A Prime accounts constitute 37.0% of portfolio.</div>
          </div>

          {/* Chart 2: PD Distribution */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">2. PD Distribution (Deciles)</span>
              <span className="text-[10px] text-slate-400 font-mono">Default Hazard Bins</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pdDistData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="bin" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar dataKey="count" name="Accounts" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-500 text-center">Majority (60.6%) concentrated in sub-2.5% PD brackets.</div>
          </div>

          {/* Chart 3: Default Rate by Segment */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">3. Default Rate by Product</span>
              <span className="text-[10px] text-slate-400 font-mono">GNPA %</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { type: 'Home Loan', rate: 1.45 },
                  { type: 'LAP', rate: 2.30 },
                  { type: 'MSME Business', rate: 4.80 },
                  { type: 'Auto Loan', rate: 2.85 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="type" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} unit="%" />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar dataKey="rate" name="NPA Rate %" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-500 text-center">Home loans maintain lowest delinquency (1.45%).</div>
          </div>

          {/* Chart 4: Vintage vs Default Rate */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">4. Vintage vs Default Rate</span>
              <span className="text-[10px] text-slate-400 font-mono">Cohort Analysis</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PORTFOLIO_VINTAGE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="vintage" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} unit="%" />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="cumulativeDefaultRate" name="Cumul Default %" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="defaultRate" name="Current Default %" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-500 text-center">2022 vintages stabilized after initial interest shock.</div>
          </div>

          {/* Chart 5: MOB Analysis (Age Effect) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">5. MOB vs Default Rate</span>
              <span className="text-[10px] text-slate-400 font-mono">Seasoning Curve</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PORTFOLIO_MOB_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mob" tick={{ fontSize: 10 }} label={{ value: 'MOB', position: 'insideBottom', offset: -2, fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} unit="%" />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="defaultRate" name="Cumulative Default %" stroke="#8b5cf6" fill="#ede9fe" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-500 text-center">Hazard slope peaks between MOB 18 and 24.</div>
          </div>

          {/* Chart 6: LGD Distribution */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">6. LGD Distribution</span>
              <span className="text-[10px] text-slate-400 font-mono">Loss Severity</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lgdDistData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="lgdRange" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar dataKey="count" name="Accounts" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-500 text-center">Mean LGD of 28.5% driven by robust residential collateral.</div>
          </div>

          {/* Chart 7: Exposure Distribution */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">7. Exposure Distribution</span>
              <span className="text-[10px] text-slate-400 font-mono">Ticket Size Brackets</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exposureDistData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="bracket" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar dataKey="count" name="Count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-500 text-center">Core volume in the ₹25L–₹50L affordable housing range.</div>
          </div>

          {/* Chart 8: Expected Loss by Rating Grade */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">8. Expected Loss (ECL) Share</span>
              <span className="text-[10px] text-slate-400 font-mono">IFRS 9 Provisioning</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PORTFOLIO_RATING_DISTRIBUTION}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="grade" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    formatter={(val: any) => formatCurrency(Number(val))}
                    contentStyle={{ fontSize: '11px', borderRadius: '8px' }} 
                  />
                  <Bar dataKey="ecl" name="ECL (₹)" fill="#e11d48" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-500 text-center">High risk Grades D & E account for 87.5% of provisions.</div>
          </div>

          {/* Chart 9: Capital Requirement Allocation */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">9. Basel Capital Allocation</span>
              <span className="text-[10px] text-slate-400 font-mono">Pillar 1 RWA</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { segment: 'Home Loans', capital: 2240000000 },
                  { segment: 'LAP', capital: 650000000 },
                  { segment: 'MSME Business', capital: 480000000 },
                  { segment: 'Auto Loans', capital: 174037500 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="segment" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    formatter={(val: any) => formatCurrency(Number(val))}
                    contentStyle={{ fontSize: '11px', borderRadius: '8px' }} 
                  />
                  <Bar dataKey="capital" name="Required Capital" fill="#9333ea" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-500 text-center">Total capital buffer: ₹354.4 Cr supporting ₹6,245 Cr book.</div>
          </div>
        </div>
      </div>

      {/* SECTION 9: STRESS TESTING */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pillar 2 Supervisory Stress Testing</div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Macroeconomic Stress Testing & Solvency Analysis</span>
            </h2>
          </div>

          {/* Scenario Selector Buttons */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
            {STRESS_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => setActiveStressScenarioId(sc.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeStressScenarioId === sc.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sc.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Active Scenario Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-xs uppercase tracking-wide">
              {activeStress.name}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">{activeStress.description}</span>
          </div>

          {/* Macro Assumptions Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">GDP Growth Assumption</div>
              <div className="font-bold text-slate-900 mt-0.5">{activeStress.macroAssumptions.gdpGrowth}%</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">HPI Shock</div>
              <div className="font-bold text-slate-900 mt-0.5">{activeStress.macroAssumptions.hpiShock}%</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Unemployment Rate</div>
              <div className="font-bold text-slate-900 mt-0.5">{activeStress.macroAssumptions.unemploymentRate}%</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Rate Hike Shock</div>
              <div className="font-bold text-slate-900 mt-0.5">+{activeStress.macroAssumptions.interestRateHikeBps} bps</div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Impact Matrix (Base Case vs Stressed Case) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stressed PD */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold uppercase">Stressed Portfolio PD</div>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">{(activeStress.results.portfolioPd * 100).toFixed(2)}%</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Base Case: 3.45% (Δ +{((activeStress.results.portfolioPd - 0.0345) * 100).toFixed(2)}%)</div>
          </div>

          {/* Stressed Expected Loss */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold uppercase">Stressed Expected Loss (ECL)</div>
            <div className="text-2xl font-extrabold text-rose-600 mt-1">{formatCurrency(activeStress.results.expectedLoss)}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">ECL Delta: +{formatCurrency(activeStress.results.expectedLossDelta)}</div>
          </div>

          {/* Stressed Capital Requirement */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold uppercase">Stressed Required Capital</div>
            <div className="text-2xl font-extrabold text-purple-600 mt-1">{formatCurrency(activeStress.results.capitalRequirement)}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Capital Shortfall/Delta: +{formatCurrency(activeStress.results.capitalDelta)}</div>
          </div>

          {/* CRAR Solvency Ratio */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold uppercase">Stressed CRAR Solvency Ratio</div>
            <div className={`text-2xl font-extrabold mt-1 ${
              activeStress.results.crarSolvencyRatio >= 14.0 ? 'text-emerald-600' :
              activeStress.results.crarSolvencyRatio >= 11.5 ? 'text-amber-600' : 'text-rose-600'
            }`}>
              {activeStress.results.crarSolvencyRatio.toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Regulatory Floor: 10.5% (Adequate)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
