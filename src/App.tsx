import React, { useState } from 'react';
import { UserRole } from './types';

// Layout Components
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { FloatingAiAssistant } from './components/common/FloatingAiAssistant';
import { AiAssistantModal } from './components/common/AiAssistantModal';

// Dedicated Page Components
import { HomePage } from './components/pages/HomePage';
import { IndividualRiskHubPage } from './components/pages/IndividualRiskHubPage';
import { ApplicationScorecardPage } from './components/pages/ApplicationScorecardPage';
import { BehavioralScorecardPage } from './components/pages/BehavioralScorecardPage';
import { PortfolioRiskPage } from './components/pages/PortfolioRiskPage';
import { ModelPerformancePage } from './components/pages/ModelPerformancePage';
import { DataQualityPage } from './components/pages/DataQualityPage';
import { EdaApcPage } from './components/pages/EdaApcPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { SettingsPage } from './components/pages/SettingsPage';

export function App() {
  // Navigation & Mode state
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [loanMode, setLoanMode] = useState<'individual' | 'multiple'>('individual');
  const [userRole, setUserRole] = useState<UserRole>('Risk Manager');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Handle header mode change
  const handleModeChange = (mode: 'individual' | 'multiple') => {
    setLoanMode(mode);
    if (mode === 'individual') {
      setCurrentTab('individual_risk');
    } else {
      setCurrentTab('portfolio_risk');
    }
  };

  // Cross-navigation dispatcher
  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    if (tab === 'individual_risk' || tab === 'application_scorecard' || tab === 'behavioral_scorecard') {
      setLoanMode('individual');
    } else if (tab === 'portfolio_risk') {
      setLoanMode('multiple');
    }
  };

  // Page titles and subtitles
  const getPageInfo = () => {
    switch (currentTab) {
      case 'dashboard':
      case 'home':
        return {
          title: 'AI Credit Risk Platform',
          subtitle: 'Enterprise credit risk assessment & portfolio solvency management.'
        };
      case 'individual_risk':
        return {
          title: 'Individual Risk Evaluation',
          subtitle: 'Choose between Application Scorecard (New Customers) or Behavioral Scorecard (Existing Loans).'
        };
      case 'application_scorecard':
        return {
          title: 'Application Scorecard',
          subtitle: 'Origination underwriting for new loan applicants with thin-file support.'
        };
      case 'behavioral_scorecard':
        return {
          title: 'Behavioral Scorecard',
          subtitle: 'Longitudinal 12M PD hazard, LGD, EAD, ECL and Basel III Capital (MOB ≥ 6).'
        };
      case 'portfolio_risk':
      case 'portfolio':
        return {
          title: 'Portfolio Risk & Solvency',
          subtitle: '14,850 loan portfolio aggregation, vintage decay, and macroeconomic stress testing.'
        };
      case 'model_performance':
        return {
          title: 'Model Performance & Validation',
          subtitle: 'Statistical discrimination (AUC 0.864, KS 48.2%), calibration curves, and PSI stability.'
        };
      case 'data_quality':
        return {
          title: 'Data Quality & Reconciliation',
          subtitle: 'Reconciliation rules RC-01 to RC-05, outlier detection, and data sanitization.'
        };
      case 'eda_apc':
        return {
          title: 'EDA & APC Analysis',
          subtitle: 'Age-Period-Cohort decomposition separating seasoning (MOB), macro shocks, and vintages.'
        };
      case 'reports':
        return {
          title: 'Regulatory Reports & Disclosures',
          subtitle: 'Audit-ready underwriting memos, IFRS 9 ECL schedules, and Basel capital reports.'
        };
      case 'settings':
        return {
          title: 'Risk Appetite & Master Scale',
          subtitle: 'Underwriting threshold cutoffs, Basel III parameters, and Master Rating Scale.'
        };
      default:
        return {
          title: 'AI Credit Risk Platform',
          subtitle: 'Enterprise credit risk management and regulatory capital engine.'
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 antialiased overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        userRole={userRole}
        onChangeRole={setUserRole}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <Header
          pageTitle={pageInfo.title}
          pageSubtitle={pageInfo.subtitle}
          activeMode={loanMode}
          onModeChange={handleModeChange}
          allLoans={[]}
          onSelectLoan={() => {
            setCurrentTab('individual_risk');
            setLoanMode('individual');
          }}
          userRole={userRole}
          apiStatus="Operational | ML Engine"
        />

        {/* Dynamic Page Views Container */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 pb-16">
          {(currentTab === 'dashboard' || currentTab === 'home') && (
            <HomePage onNavigate={handleNavigate} />
          )}

          {currentTab === 'individual_risk' && (
            <IndividualRiskHubPage onSelectSubModule={(mod) => setCurrentTab(mod)} />
          )}

          {currentTab === 'application_scorecard' && (
            <ApplicationScorecardPage />
          )}

          {currentTab === 'behavioral_scorecard' && (
            <BehavioralScorecardPage />
          )}

          {(currentTab === 'portfolio_risk' || currentTab === 'portfolio' || currentTab === 'multiple') && (
            <PortfolioRiskPage />
          )}

          {currentTab === 'model_performance' && (
            <ModelPerformancePage />
          )}

          {currentTab === 'data_quality' && (
            <DataQualityPage />
          )}

          {currentTab === 'eda_apc' && (
            <EdaApcPage />
          )}

          {currentTab === 'reports' && (
            <ReportsPage />
          )}

          {currentTab === 'settings' && (
            <SettingsPage />
          )}
        </main>

        {/* Floating Action Button for AI Risk Assistant */}
        <FloatingAiAssistant
          onOpenFullAssistant={() => setIsAiModalOpen(true)}
        />

        {/* AI Assistant Modal / Drawer */}
        <AiAssistantModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;
