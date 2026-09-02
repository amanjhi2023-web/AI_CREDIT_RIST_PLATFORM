import React, { useState, useEffect } from 'react';
import { PortfolioLoanRecord, UserRole } from '../../types';
import { 
  Search, 
  Bell, 
  Calendar, 
  CheckCircle2, 
  Landmark,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  pageTitle: string;
  pageSubtitle?: string;
  activeMode: 'individual' | 'multiple';
  onModeChange: (mode: 'individual' | 'multiple') => void;
  allLoans?: PortfolioLoanRecord[];
  onSelectLoan?: (loan: PortfolioLoanRecord) => void;
  userRole: UserRole;
  apiStatus?: string;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle,
  pageSubtitle,
  activeMode,
  onModeChange,
  allLoans,
  onSelectLoan,
  userRole,
  apiStatus = 'Operational',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const loansList = allLoans || [];
  const searchResults = searchQuery.trim() === '' ? [] : loansList.filter(l => 
    l.loanId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const notifications = [
    {
      id: 1,
      title: 'High PD Warning Triggered',
      desc: 'MSME Loan LN-2026-00489 breached 12.0% cutoff ceiling (PD: 14.8%).',
      time: '12m ago',
      type: 'danger',
    },
    {
      id: 2,
      title: 'Basel III Capital Buffer Update',
      desc: 'CRAR at 14.85% (+4.35% surplus over 10.5% statutory floor).',
      time: '1h ago',
      type: 'info',
    },
    {
      id: 3,
      title: 'Roll Rate Cure Rate Surge',
      desc: '30 DPD to Current bucket recoveries improved to 42.5% this cycle.',
      time: '3h ago',
      type: 'success',
    }
  ];

  return (
    <header id="top-header" className="sticky top-0 z-20 bg-[#0D1527]/95 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Title & Loan Mode Switch */}
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">{pageTitle}</h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              v3.4.2
            </span>
          </div>
          {pageSubtitle && (
            <p className="text-xs text-slate-400 font-normal hidden lg:block">{pageSubtitle}</p>
          )}
        </div>

        {/* Prominent Loan Category Switch (Individual vs Multiple Loans) */}
        <div id="loan-mode-switch" className="inline-flex p-1 rounded-lg bg-slate-800/90 border border-slate-700 shadow-2xs">
          <button
            type="button"
            id="btn-mode-individual"
            onClick={() => onModeChange('individual')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeMode === 'individual'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Individual Loan
          </button>
          <button
            type="button"
            id="btn-mode-multiple"
            onClick={() => onModeChange('multiple')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeMode === 'multiple'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Multiple Loans
          </button>
        </div>
      </div>

      {/* Center/Right controls: Search, System Status, Notifications, Date */}
      <div className="flex items-center gap-3 self-end md:self-auto flex-wrap">
        {/* Search Customer / Loan ID */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              id="global-search-input"
              type="text"
              placeholder="Search Customer / Loan ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-52 lg:w-64 pl-8.5 pr-3 py-1.5 text-xs bg-slate-800/80 hover:bg-slate-800 focus:bg-[#0B132B] border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-100 placeholder:text-slate-400"
            />
          </div>

          {/* Search Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-1.5 left-0 right-0 bg-[#111C35] border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs animate-in fade-in">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                Found {searchResults.length} loan applications
              </div>
              {searchResults.map((l) => (
                <button
                  key={l.loanId}
                  type="button"
                  onClick={() => {
                    onSelectLoan(l);
                    onModeChange('individual');
                    setShowSearchResults(false);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800/80 transition-colors flex items-center justify-between border-b border-slate-800/60 last:border-0"
                >
                  <div>
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <span>{l.customerName}</span>
                      <span className="font-mono text-[11px] text-blue-400 bg-blue-950/60 px-1 py-0.2 rounded font-normal border border-blue-800/50">{l.loanId}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{l.loanType} • CUST: {l.customerId}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    l.rating === 'Grade A' || l.rating === 'Grade B' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                    l.rating === 'Grade C' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}>
                    {l.rating}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Date Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/80 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentTime || 'Tuesday, Sep 1, 2026'}</span>
        </div>

        {/* API System Status */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px] tracking-tight">{apiStatus}</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="btn-notifications"
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 relative transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#111C35] rounded-xl shadow-xl border border-slate-700 p-3 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold text-slate-200">Risk & Policy Alerts</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold px-1.5 py-0.5 rounded-full">3 New</span>
              </div>
              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-100">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>
              <button 
                type="button" 
                onClick={() => setShowNotifications(false)}
                className="w-full mt-2 pt-2 border-t border-slate-800 text-center text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                Dismiss All Alerts
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
