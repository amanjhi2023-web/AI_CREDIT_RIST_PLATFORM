import React, { useState } from 'react';
import { UserRole } from '../../types';
import { 
  LayoutDashboard, 
  UserCheck, 
  FileText, 
  Activity, 
  PieChart, 
  FlaskConical, 
  CheckCircle2, 
  BarChart3, 
  FileSpreadsheet, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  ShieldAlert,
  Landmark,
  Database
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  onChangeRole,
}) => {
  const [individualMenuOpen, setIndividualMenuOpen] = useState(true);

  const isIndividualActive =
    currentTab === 'individual_risk' ||
    currentTab === 'application_scorecard' ||
    currentTab === 'behavioral_scorecard';

  return (
    <aside 
      id="main-sidebar"
      className="w-64 bg-[#0F172A] text-slate-200 flex flex-col h-screen sticky top-0 border-r border-slate-800 z-30 shrink-0 select-none shadow-xl"
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 bg-[#0B132B]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-white tracking-wider uppercase flex items-center gap-1.5">
              <span>AI CREDIT RISK</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Banking Platform</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar text-xs font-medium">
        {/* Main Dashboard */}
        <button
          id="nav-dashboard"
          onClick={() => onSelectTab('dashboard')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
            currentTab === 'dashboard'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </div>
        </button>

        {/* Individual Risk Section */}
        <div className="pt-2">
          <div className="flex items-center justify-between">
            <button
              id="nav-individual-risk-parent"
              onClick={() => {
                setIndividualMenuOpen(!individualMenuOpen);
                if (currentTab !== 'individual_risk' && currentTab !== 'application_scorecard' && currentTab !== 'behavioral_scorecard') {
                  onSelectTab('individual_risk');
                }
              }}
              className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left ${
                isIndividualActive
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-blue-400" />
                <span>Individual Risk</span>
              </div>
              {individualMenuOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          </div>

          {/* Sub-menu items for Individual Risk */}
          {individualMenuOpen && (
            <div className="ml-4 pl-2 my-1 border-l border-slate-700 space-y-1">
              <button
                id="nav-application-scorecard"
                onClick={() => onSelectTab('application_scorecard')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                  currentTab === 'application_scorecard'
                    ? 'bg-blue-600/90 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Application Scorecard</span>
                </div>
                <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">NEW</span>
              </button>

              <button
                id="nav-behavioral-scorecard"
                onClick={() => onSelectTab('behavioral_scorecard')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                  currentTab === 'behavioral_scorecard'
                    ? 'bg-blue-600/90 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  <span>Behavioral Scorecard</span>
                </div>
                <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">12M PD</span>
              </button>
            </div>
          )}
        </div>

        {/* Portfolio Risk */}
        <button
          id="nav-portfolio-risk"
          onClick={() => onSelectTab('portfolio_risk')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
            currentTab === 'portfolio_risk'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <PieChart className="w-4 h-4 text-purple-400" />
            <span>Portfolio Risk</span>
          </div>
        </button>

        {/* Model Performance */}
        <button
          id="nav-model-performance"
          onClick={() => onSelectTab('model_performance')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
            currentTab === 'model_performance'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FlaskConical className="w-4 h-4 text-amber-400" />
            <span>Model Performance</span>
          </div>
        </button>

        {/* Data Quality */}
        <button
          id="nav-data-quality"
          onClick={() => onSelectTab('data_quality')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
            currentTab === 'data_quality'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Data Quality</span>
          </div>
        </button>

        {/* EDA / APC Analysis */}
        <button
          id="nav-eda-apc"
          onClick={() => onSelectTab('eda_apc')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
            currentTab === 'eda_apc'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>EDA / APC Analysis</span>
          </div>
        </button>

        {/* Reports */}
        <button
          id="nav-reports"
          onClick={() => onSelectTab('reports')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
            currentTab === 'reports'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-4 h-4 text-rose-400" />
            <span>Reports</span>
          </div>
        </button>

        {/* Settings */}
        <button
          id="nav-settings"
          onClick={() => onSelectTab('settings')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
            currentTab === 'settings'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </div>
        </button>
      </div>

      {/* Role & System Health Footer */}
      <div className="p-3 border-t border-slate-800 bg-[#090E1B] space-y-2">
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-400 font-semibold uppercase text-[9px]">Active User Role</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {userRole}
            </span>
          </div>
          <select
            id="select-user-role"
            value={userRole}
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            className="w-full bg-[#0F172A] border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500 text-[11px]"
          >
            <option value="Risk Manager">Risk Manager (Full Access)</option>
            <option value="Loan Officer">Loan Officer (Underwriting)</option>
            <option value="Model Validator">Model Validator</option>
            <option value="Compliance Officer">Compliance Officer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-400" />
            <span>Model Engine v3.1</span>
          </span>
          <span className="text-slate-500 font-mono">BASEL III / IFRS 9</span>
        </div>
      </div>
    </aside>
  );
};
