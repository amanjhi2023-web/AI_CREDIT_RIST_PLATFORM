import React from 'react';
import { UserRole } from '../../types';
import { 
  LayoutDashboard, 
  UserCheck, 
  Layers, 
  PieChart, 
  TrendingUp, 
  GitCommit, 
  Landmark, 
  Activity, 
  Bot, 
  Settings, 
  LogOut, 
  Shield, 
  ChevronRight,
  Database
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  onChangeRole,
}) => {
  const navItems = [
    { id: 'home', label: 'Home Hub', icon: LayoutDashboard, category: 'Executive' },
    { id: 'individual_risk', label: 'Individual Risk', icon: UserCheck, category: 'Loan Analysis' },
    { id: 'multiple', label: 'Multiple Loans', icon: Layers, category: 'Loan Analysis' },
    { id: 'overview', label: 'Portfolio Overview', icon: PieChart, category: 'Risk Analytics' },
    { id: 'vintage', label: 'Vintage Analysis', icon: TrendingUp, category: 'Risk Analytics' },
    { id: 'roll_rate', label: 'Roll Rate', icon: GitCommit, category: 'Risk Analytics' },
    { id: 'basel', label: 'Basel & Capital', icon: Landmark, category: 'Regulatory' },
    { id: 'stress_testing', label: 'Stress Testing', icon: Activity, category: 'Regulatory' },
    { id: 'ai_assistant', label: 'AI Assistant', icon: Bot, category: 'Intelligence', badge: 'AI' },
    { id: 'settings', label: 'Settings', icon: Settings, category: 'System' },
  ];

  // RBAC permission tags for visual indicator
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'Risk Manager':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Loan Officer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Compliance Officer':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Admin':
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <aside 
      id="main-sidebar"
      className="w-64 bg-[#0D1527] text-slate-200 flex flex-col h-screen sticky top-0 border-r border-slate-800/90 z-30 shrink-0 select-none"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
              <span>AI CREDIT RISK</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Enterprise Platform</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Risk Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {item.badge}
                </span>
              )}
              {isActive && !item.badge && (
                <ChevronRight className="w-3.5 h-3.5 text-blue-200" />
              )}
            </button>
          );
        })}
      </div>

      {/* User Profile & Role Selector Bottom Box */}
      <div className="p-3.5 border-t border-slate-800 bg-[#090E1B]">
        <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center border border-slate-600">
              RS
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">Rajesh Sharma</div>
              <div className="text-[10px] text-slate-400 truncate">rajesh.sharma@fintech.bank</div>
            </div>
          </div>

          {/* Role Dropdown */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-medium">
              <span>ACTIVE ROLE (RBAC)</span>
              <span className={`px-1.5 py-0.2 rounded border text-[9px] font-bold ${getRoleBadge(userRole)}`}>
                {userRole}
              </span>
            </div>
            <select
              id="select-user-role"
              value={userRole}
              onChange={(e) => onChangeRole(e.target.value as UserRole)}
              className="w-full bg-[#0B132B] border border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="Risk Manager">Risk Manager (Full Access)</option>
              <option value="Loan Officer">Loan Officer (Underwriting)</option>
              <option value="Compliance Officer">Compliance (Audit/Basel)</option>
              <option value="Admin">Admin (Configuration)</option>
            </select>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-400">
              <Database className="w-3 h-3 text-emerald-500" />
              <span>FastAPI Connected</span>
            </span>
            <button 
              type="button" 
              onClick={() => alert('Session active. Enterprise SSO authenticated via Active Directory.')}
              className="hover:text-rose-400 text-slate-400 transition-colors p-1"
              title="Logout session"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
