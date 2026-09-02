import React, { useState, useEffect } from 'react';
import { 
  LoanApplication, 
  PortfolioSummary, 
  RiskDistributionData, 
  VintageCohort, 
  RollRateMatrix, 
  BaselSummary, 
  StressScenario, 
  UserRole 
} from './types';
import { ApiService } from './services/api';
import { 
  ALL_LOANS, 
  PORTFOLIO_SUMMARY_DATA, 
  RISK_DISTRIBUTION, 
  VINTAGE_COHORTS, 
  ROLL_RATE_DATA, 
  BASEL_SUMMARY_DATA, 
  STRESS_TEST_SCENARIOS 
} from './data/mockData';

// Layout Components
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { FloatingAiAssistant } from './components/common/FloatingAiAssistant';

// Page Components
import { HomePage } from './components/pages/HomePage';
import { IndividualRiskPage } from './components/pages/IndividualRiskPage';
import { OverviewPage } from './components/pages/OverviewPage';
import { IndividualLoanPage } from './components/pages/IndividualLoanPage';
import { MultipleLoansPage } from './components/pages/MultipleLoansPage';
import { PortfolioRiskPage } from './components/pages/PortfolioRiskPage';
import { VintagePage } from './components/pages/VintagePage';
import { RollRatePage } from './components/pages/RollRatePage';
import { BaselPage } from './components/pages/BaselPage';
import { StressTestingPage } from './components/pages/StressTestingPage';
import { AiAssistantPage } from './components/pages/AiAssistantPage';
import { SettingsPage } from './components/pages/SettingsPage';

export function App() {
  // Navigation & Mode state
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [individualSubTab, setIndividualSubTab] = useState<'application' | 'behavioral'>('application');
  const [loanMode, setLoanMode] = useState<'individual' | 'multiple'>('individual');
  const [userRole, setUserRole] = useState<UserRole>('Risk Manager');

  // Data state
  const [allLoans, setAllLoans] = useState<LoanApplication[]>(ALL_LOANS);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication>(ALL_LOANS[0]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary>(PORTFOLIO_SUMMARY_DATA);
  const [riskDistribution, setRiskDistribution] = useState<RiskDistributionData[]>(RISK_DISTRIBUTION);
  const [vintageCohorts, setVintageCohorts] = useState<VintageCohort[]>(VINTAGE_COHORTS);
  const [rollRateData, setRollRateData] = useState<RollRateMatrix>(ROLL_RATE_DATA);
  const [baselSummary, setBaselSummary] = useState<BaselSummary>(BASEL_SUMMARY_DATA);
  const [stressScenarios, setStressScenarios] = useState<StressScenario[]>(STRESS_TEST_SCENARIOS);

  // AI Assistant Context
  const [aiLoanContext, setAiLoanContext] = useState<LoanApplication | null>(null);

  // API Status
  const [apiStatus, setApiStatus] = useState('Connected');

  // Initial Data Fetch
  useEffect(() => {
    async function loadData() {
      try {
        const [
          health,
          summaryRes,
          riskDistRes,
          vintageRes,
          rollRateRes,
          baselRes,
          stressRes,
          loansRes
        ] = await Promise.all([
          ApiService.getHealth(),
          ApiService.getPortfolioSummary(),
          ApiService.getRiskDistribution(),
          ApiService.getVintageData(),
          ApiService.getRollRateData(),
          ApiService.getBaselSummary(),
          ApiService.getStressTestScenarios(),
          ApiService.getLoans()
        ]);

        if (summaryRes) setPortfolioSummary(summaryRes);
        if (riskDistRes) setRiskDistribution(riskDistRes);
        if (vintageRes) setVintageCohorts(vintageRes);
        if (rollRateRes) setRollRateData(rollRateRes);
        if (baselRes) setBaselSummary(baselRes);
        if (stressRes) setStressScenarios(stressRes);
        if (loansRes && loansRes.loans.length > 0) {
          setAllLoans(loansRes.loans);
          setSelectedLoan(loansRes.loans[0]);
        }
        setApiStatus('Operational | ML Gateway');
      } catch (err) {
        console.warn('Using client memory store:', err);
        setApiStatus('Operational');
      }
    }
    loadData();
  }, []);

  // Handle top header mode change (Individual vs Multiple Loans)
  const handleModeChange = (mode: 'individual' | 'multiple') => {
    setLoanMode(mode);
    if (mode === 'individual') {
      setCurrentTab('individual_risk');
    } else {
      setCurrentTab('multiple');
    }
  };

  // Handle cross-navigation
  const handleNavigate = (tab: string, loan?: LoanApplication, subTab?: 'application' | 'behavioral') => {
    if (loan) {
      setSelectedLoan(loan);
    }
    if (subTab) {
      setIndividualSubTab(subTab);
    }
    setCurrentTab(tab);
    if (tab === 'individual_risk' || tab === 'individual') {
      setLoanMode('individual');
    } else if (tab === 'multiple') {
      setLoanMode('multiple');
    }
  };

  // Ask AI about active loan
  const handleAskAiWithLoan = (loan: LoanApplication) => {
    setAiLoanContext(loan);
    setCurrentTab('ai_assistant');
  };

  // Page titles mapping
  const getPageInfo = () => {
    switch (currentTab) {
      case 'home':
        return {
          title: 'Credit Risk Command Center',
          subtitle: 'Choose between Portfolio Risk Solvency or Individual Loan Risk (Application & Behavioral).'
        };
      case 'individual_risk':
      case 'individual':
        return {
          title: 'Individual Risk & Underwriting',
          subtitle: `Application Scorecards (Approved/Rejected) and Behavioral Monitoring (PD, LGD, EAD, ECL, Capital).`
        };
      case 'overview':
        return {
          title: 'Portfolio Risk Overview',
          subtitle: 'Executive view of portfolio exposure, expected loss, capital adequacy, and default trends.'
        };
      case 'multiple':
        return {
          title: 'Multiple Loans / Portfolio Risk',
          subtitle: 'Multi-factor filtering, cohort comparison, and loan-level data grid.'
        };
      case 'portfolio':
        return {
          title: 'Portfolio Risk Analytics',
          subtitle: 'Exposure concentration, single-obligor limits, and regional risk distribution.'
        };
      case 'vintage':
        return {
          title: 'Vintage Analysis',
          subtitle: 'Cumulative default rate curves across Months on Books (MOB) cohorts.'
        };
      case 'roll_rate':
        return {
          title: 'Roll-Rate Analysis',
          subtitle: 'Delinquency transition probabilities and stage cure dynamics.'
        };
      case 'basel':
        return {
          title: 'Basel & Regulatory Capital',
          subtitle: 'Pillar 1 RWA calculations, CRAR solvency ratio, and capital buffers.'
        };
      case 'stress_testing':
        return {
          title: 'Stress Testing',
          subtitle: 'Macroeconomic adverse shocks, reverse stress tests, and solvency simulation.'
        };
      case 'ai_assistant':
        return {
          title: 'AI Risk Assistant',
          subtitle: 'Interactive credit risk explanations, policy citations, and loan audit agent.'
        };
      case 'settings':
        return {
          title: 'Governance & Settings',
          subtitle: 'Underwriting threshold cutoffs, risk models registry, and system controls.'
        };
      default:
        return {
          title: 'AI Credit Risk Platform',
          subtitle: 'Enterprise loan underwriting and risk management system.'
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="flex h-screen w-full bg-[#0B132B] text-slate-100 antialiased overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'individual_risk' || tab === 'individual') setLoanMode('individual');
          if (tab === 'multiple') setLoanMode('multiple');
        }}
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
          allLoans={allLoans}
          onSelectLoan={(loan) => {
            setSelectedLoan(loan);
            setCurrentTab('individual_risk');
            setLoanMode('individual');
          }}
          userRole={userRole}
          apiStatus={apiStatus}
        />

        {/* Dynamic Page Views Container */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#0B132B]/90 pb-16">
          {currentTab === 'home' && (
            <HomePage
              summary={portfolioSummary}
              riskDist={riskDistribution}
              recentLoans={allLoans}
              onNavigate={handleNavigate}
              onOpenAiAssistant={() => setCurrentTab('ai_assistant')}
            />
          )}

          {currentTab === 'overview' && (
            <OverviewPage
              summary={portfolioSummary}
              riskDist={riskDistribution}
              recentLoans={allLoans}
              onNavigate={handleNavigate}
            />
          )}

          {(currentTab === 'individual_risk' || currentTab === 'individual') && (
            <IndividualRiskPage
              selectedLoan={selectedLoan}
              allLoans={allLoans}
              onSelectLoan={setSelectedLoan}
              userRole={userRole}
              initialSubTab={individualSubTab}
              onOpenAiAssistant={() => setCurrentTab('ai_assistant')}
            />
          )}

          {currentTab === 'multiple' && (
            <MultipleLoansPage
              allLoans={allLoans}
              onSelectLoan={setSelectedLoan}
              onNavigateToIndividual={(loan) => {
                setSelectedLoan(loan);
                setCurrentTab('individual_risk');
                setLoanMode('individual');
              }}
            />
          )}

          {currentTab === 'portfolio' && (
            <PortfolioRiskPage
              summary={portfolioSummary}
              riskDist={riskDistribution}
              allLoans={allLoans}
            />
          )}

          {currentTab === 'vintage' && (
            <VintagePage vintageCohorts={vintageCohorts} />
          )}

          {currentTab === 'roll_rate' && (
            <RollRatePage rollRateData={rollRateData} />
          )}

          {currentTab === 'basel' && (
            <BaselPage baselData={baselSummary} />
          )}

          {currentTab === 'stress_testing' && (
            <StressTestingPage scenarios={stressScenarios} />
          )}

          {currentTab === 'ai_assistant' && (
            <AiAssistantPage
              activeLoanContext={aiLoanContext}
              onClearContext={() => setAiLoanContext(null)}
              onSelectLoanContext={(l) => setAiLoanContext(l)}
              allLoans={allLoans}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage userRole={userRole} />
          )}
        </main>

        {/* Global Floating AI Risk Copilot Assistant on the Side */}
        <FloatingAiAssistant
          activeLoan={selectedLoan}
          onOpenFullAssistant={() => setCurrentTab('ai_assistant')}
        />
      </div>
    </div>
  );
}

export default App;
