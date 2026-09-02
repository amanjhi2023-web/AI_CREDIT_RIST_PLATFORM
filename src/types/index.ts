export type RiskCategory = 'Low Risk' | 'Medium Risk' | 'High Risk';
export type RatingGrade = 'Grade A' | 'Grade B' | 'Grade C' | 'Grade D' | 'Grade E';
export type LoanDecision = 'APPROVE' | 'REJECT' | 'MANUAL REVIEW' | 'APPROVED' | 'REJECTED';
export type LoanType = 'Home Loan' | 'Personal Loan' | 'Auto Loan' | 'MSME Business' | 'Loan Against Property' | 'Credit Card' | string;
export type UserRole = 'Risk Manager' | 'Loan Officer' | 'Model Validator' | 'Compliance Officer' | 'Admin';

// ==========================================
// 1. APPLICATION SCORECARD TYPES (NEW CUSTOMER)
// ==========================================
export interface ApplicationScorecardInput {
  // Loan Information
  loanAmount: number;
  propertyValue: number;
  ltv: number; // Loan to Value %
  loanTenureYears: number;
  interestRate: number;
  loanPurpose: 'Home Purchase' | 'Refinancing' | 'Home Improvement' | 'Business Expansion' | 'Personal';
  
  // Applicant Information
  applicantName: string;
  applicantAge: number;
  monthlyIncome: number;
  employmentType: 'Salaried - Public' | 'Salaried - MNC' | 'Salaried - Private' | 'Self-Employed Professional' | 'Self-Employed Business';
  employmentTenureYears: number;
  existingMonthlyObligations: number;

  // Credit Information
  isThinFile: boolean; // "No Credit History / Thin File / No Hit"
  creditScore: number | null; // Null if thin file
  creditHistoryMonths: number;
  existingActiveLoansCount: number;
  totalOutstandingDebt: number;
  delinquency30PlusPast24m: number;
  creditInquiriesPast6m: number;
}

export interface ApplicationScorecardResult {
  applicationScore: number; // 300 - 900
  pd: number; // Probability of Default % (e.g. 0.028 = 2.8%)
  riskRating: RatingGrade;
  decision: 'APPROVE' | 'REJECT' | 'MANUAL REVIEW';
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  dti: number; // Debt to Income %
  keyDrivers: {
    factor: string;
    impact: string;
    isPositive: boolean;
    weight: number;
  }[];
  scorecardDetails: {
    baseScore: number;
    scoreAdjustments: { variable: string; value: string; points: number }[];
  };
  modelConfidence: number; // e.g. 94.5%
  decisionRationale: string;
  policyChecks: {
    rule: string;
    criteria: string;
    actual: string;
    passed: boolean;
  }[];
  timestamp: string;
  modelVersion: string;
}

// ==========================================
// 2. BEHAVIORAL SCORECARD TYPES (EXISTING LOAN)
// ==========================================
export interface BehavioralScorecardInput {
  // Account identifiers
  accountId: string;
  customerId: string;
  customerName: string;

  // Credit Information
  creditScore: number;
  creditInquiriesPast12m: number;

  // Loan Information
  currentBalance: number;
  originalBalance: number;
  originalLtv: number;
  currentLtv: number;
  interestRate: number;
  originalTenureMonths: number;

  // Time / Behavior Information
  originationDate: string; // e.g. "2023-01-15"
  snapshotDate: string; // e.g. "2024-09-01"
  snapshotTimeMonths: number; // Snapshot index
  originationTimeMonths: number; // Origination index
  maturityTimeMonths: number;
  delinquencyStatus: 'Current' | '1-30 DPD' | '31-60 DPD' | '61-90 DPD' | '90+ DPD';
  dpdMaxPast12m: number;
  paymentDelayAvgDays: number;
  cepCumulativeExcessPayment: number; // CEP / Liquidity metric

  // Macroeconomic Variables
  hpiIndex: number; // House Price Index (Base 100)
  gdpGrowthRate: number; // e.g. 6.8%
  benchmarkInterestRate: number; // e.g. 6.50%
  unemploymentRate: number; // e.g. 4.2%
}

export interface BehavioralScorecardResult {
  accountId: string;
  customerName: string;
  mob: number; // Months On Book = Snapshot - Origination
  isSeasoned: boolean; // MOB >= 6 months
  mobSquared: number;
  equity: number; // Equity = 1 - (Current LTV / 100)
  vintageCohort: string; // e.g. "2023-Q1"
  cepLiquidityRatio: number;

  // Risk Scores & Probabilities
  behavioralScore: number; // e.g. 585 (Range 300 - 900)
  pitPd: number; // Point-In-Time 12M PD (e.g. 8.4%)
  ttcPd: number; // Through-The-Cycle calibrated PD (e.g. 7.1%)
  riskRating: RatingGrade;
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';

  // Credit Risk Calculation Layer
  lgd: number; // Loss Given Default % (e.g. 35.0%)
  ead: number; // Exposure at Default in ₹
  ccf: number; // Credit Conversion Factor (1.0 for term loans)
  expectedLoss: number; // ECL = PD * LGD * EAD
  expectedLossPct: number; // ECL / EAD %
  rwa: number; // Risk Weighted Asset
  baselRiskWeight: number; // e.g. 65%
  baselCapitalRequirement: number; // RWA * 10.5% (Basel III Pillar 1 + Capital Conservation Buffer)

  // Diagnostics & Factor Contributions
  woeContributions: {
    variable: string;
    rawVal: string;
    woe: number;
    iv: number;
    coefficient: number;
    pointsContribution: number;
  }[];
  historicalMobTrend?: { mob: number; pd: number; balance: number }[];
  timestamp: string;
  modelVersion: string;
}

// ==========================================
// 3. PORTFOLIO RISK TYPES
// ==========================================
export interface PortfolioLoanRecord {
  loanId: string;
  customerId: string;
  customerName: string;
  loanType: LoanType;
  originationDate: string;
  vintage: string; // "2023-Q1"
  mob: number;
  originalBalance: number;
  currentBalance: number;
  originalLtv: number;
  currentLtv: number;
  interestRate: number;
  creditScore: number;
  delinquencyStatus: string;
  dpd: number;
  
  // Model Calculated Risk Layer
  pd: number;
  ttcPd: number;
  rating: RatingGrade;
  lgd: number;
  ead: number;
  ecl: number;
  rwa: number;
  capitalRequirement: number;
  region: string;
  isDefaulted: boolean;
}

export interface PortfolioSummaryStats {
  totalLoans: number;
  totalExposure: number;
  averagePd: number;
  averageTtcPd: number;
  averageLgd: number;
  totalEad: number;
  totalExpectedLoss: number;
  totalCapitalRequirement: number;
  defaultRate: number;
  npaCount: number;
  averageCreditScore: number;
  averageMob: number;
  hhiConcentrationIndex: number; // Herfindahl-Hirschman Index
}

export interface RatingDistributionItem {
  grade: RatingGrade;
  count: number;
  percentage: number;
  exposure: number;
  ecl: number;
  avgPd: number;
  color: string;
}

export interface VintageAnalysisItem {
  vintage: string;
  totalOrigination: number;
  activeBalance: number;
  loanCount: number;
  defaultRate: number;
  cumulativeDefaultRate: number;
  avgPd: number;
  ecl: number;
}

export interface MobAnalysisItem {
  mob: number; // Month on Book (1, 6, 12, 18, 24, 36, 48, 60)
  defaultRate: number;
  marginalDefaultRate: number;
  activeAccounts: number;
  averageBalance: number;
}

// ==========================================
// 4. STRESS TESTING TYPES
// ==========================================
export interface StressScenarioConfig {
  id: 'base' | 'mild' | 'severe';
  name: string;
  description: string;
  macroAssumptions: {
    gdpGrowth: number; // %
    hpiShock: number; // % change
    unemploymentRate: number; // %
    interestRateHikeBps: number; // basis points
    pdMultiplier: number;
    lgdHaircut: number;
  };
  results: {
    portfolioPd: number;
    portfolioLgd: number;
    totalEad: number;
    expectedLoss: number;
    expectedLossDelta: number;
    capitalRequirement: number;
    capitalDelta: number;
    crarSolvencyRatio: number;
  };
}

// ==========================================
// 5. MODEL PERFORMANCE TYPES
// ==========================================
export interface ModelValidationMetrics {
  modelName: string;
  targetType: 'Application Scorecard' | 'Behavioral Scorecard 12M PD';
  version: string;
  lastTrained: string;
  
  // Discrimination Metrics
  aucRoc: number; // e.g. 0.864
  gini: number; // 2 * AUC - 1 (e.g. 0.728)
  ksStatistic: number; // Kolmogorov-Smirnov (e.g. 48.2%)
  ksDecile: number; // Typically Decile 3 or 4
  brierScore: number; // Calibration accuracy
  psi: number; // Population Stability Index (e.g. 0.042 = Stable)

  // Segment Validation
  inSample: { auc: number; gini: number; ks: number; brier: number; records: number };
  outOfSample: { auc: number; gini: number; ks: number; brier: number; records: number };
  outOfTime: { auc: number; gini: number; ks: number; brier: number; records: number };

  // Curves Data
  rocCurve: { fpr: number; tpr: number }[];
  ksCurve: { decile: number; scoreThreshold: number; cumGoodPct: number; cumBadPct: number; ksDiff: number }[];
  calibrationPlot: { decile: number; predictedPd: number; observedDefaultRate: number; count: number }[];
  scoreDistribution: { scoreBin: string; goodCount: number; badCount: number; badRate: number }[];
}

// ==========================================
// 6. DATA QUALITY & RECONCILIATION TYPES
// ==========================================
export interface DataQualityAudit {
  datasetName: string;
  totalRecords: number;
  uniqueAccounts: number;
  missingValuesCount: number;
  duplicateRecordsCount: number;
  invalidRecordsCount: number;
  outliersCount: number;
  validRecordsCount: number;
  removedRecordsCount: number;
  dataHealthScore: number; // 0 - 100%

  // Behavioral Specific Reconciliation Checks
  reconciliationChecks: {
    id: string;
    name: string;
    description: string;
    passedCount: number;
    failedCount: number;
    status: 'PASSED' | 'FAILED' | 'WARNING';
    action: string;
  }[];

  sampleReconciliationRecords: {
    accountId: string;
    snapshotTime: number;
    firstTime: number;
    originationTime: number;
    maturityTime: number;
    balanceTime: number;
    origBalanceTime: number;
    failedChecks: string[];
    remediation: 'Keep' | 'Discard Account';
  }[];
}

// ==========================================
// 7. EDA & APC TYPES
// ==========================================
export interface EdaVariableSummary {
  variable: string;
  type: 'Loan' | 'Credit' | 'Macro' | 'Target';
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  p25: number;
  p75: number;
  missingPct: number;
}

export interface ApcAnalysisData {
  ageAnalysis: { mobBracket: string; mobValue: number; defaultRate: number; count: number }[];
  periodAnalysis: { periodYear: string; macroState: string; defaultRate: number; hpiChange: number }[];
  cohortAnalysis: { cohortVintage: string; initialVolume: number; defaultRateCumulative: number }[];
}
