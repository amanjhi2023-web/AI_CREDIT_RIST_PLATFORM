export type RiskCategory = 'Low Risk' | 'Medium Risk' | 'High Risk';
export type LoanDecision = 'APPROVED' | 'REJECTED' | 'MANUAL REVIEW';
export type LoanType = 'Home Loan' | 'Personal Loan' | 'Auto Loan' | 'MSME Business' | 'Loan Against Property' | 'Education Loan' | 'Credit Card' | 'MSME Loan' | string;
export type CustomerSegment = 'Salaried' | 'Self-employed' | 'Self-Employed' | 'Business' | 'Business Owner' | 'Corporate' | 'Professional' | string;
export type LoanStatus = 'Active' | 'Delinquent' | 'Default' | 'Closed' | 'Under Review' | string;
export type DelinquencyBucket = 'Current' | '30 DPD' | '60 DPD' | '90+ DPD' | string;
export type UserRole = 'Risk Manager' | 'Loan Officer' | 'Compliance Officer' | 'Admin';

export interface Customer {
  id: string;
  name: string;
  age: number;
  employmentType: CustomerSegment;
  monthlyIncome: number;
  creditScore: number;
  region: string;
  branch: string;
  city: string;
  dti: number; // Debt to Income %
  lti: number; // Loan to Income multiple
  creditUtilization: number; // %
  activeLoansCount: number;
  previousDefaults: number;
  delinquencyHistory36m: number; // count of 30+ DPD in last 36 months
  avgRepaymentDelayDays: number;
  tenureYearsAtJob: number;
}

export interface LoanApplication {
  loanId: string;
  customerId: string;
  customerName: string;
  customerAge: number;
  employmentType: CustomerSegment;
  monthlyIncome: number;
  loanAmount: number;
  loanType: LoanType;
  loanTenureMonths: number;
  interestRate: number;
  applicationDate: string;
  originationCohort: string; // e.g. "2024-Q3"
  region: string;
  branch: string;
  
  // Risk Metrics
  creditScore: number;
  riskCategory: RiskCategory;
  pd: number; // Probability of Default % (e.g. 0.062)
  lgd: number; // Loss Given Default % (e.g. 0.28)
  ead: number; // Exposure at Default in ₹
  ecl: number; // Expected Credit Loss = PD * LGD * EAD
  
  // Decision Engine
  decision: LoanDecision;
  decisionRule: string;
  pdThreshold: number;
  eclThreshold: number;
  decisionReason: string;
  
  // Explainability & Risk Drivers
  positiveFactors: string[];
  negativeFactors: string[];
  shapValues: { feature: string; impact: number; isRiskIncreasing: boolean }[];
  scorecardReasonCodes: { code: string; description: string; scoreImpact: number }[];
  
  // Timeline
  lifecycleTimeline: {
    stage: string;
    status: 'completed' | 'in-progress' | 'pending' | 'flagged';
    timestamp: string;
    details: string;
  }[];
  
  // Financial Profile
  existingLoansExposure: number;
  monthlyObligations: number;
  dti: number;
  lti: number;
  creditUtilization: number;
  activeLoansCount: number;
  previousDefaults: number;
  delinquencyHistory36m: number;
  avgRepaymentDelayDays: number;
  
  // Basel Contribution
  baselRiskWeight: number; // e.g. 75%
  rwa: number; // Risk Weighted Assets
  capitalRequirement: number; // RWA * 8% or 10.5%
  
  // Audit Trail
  modelVersion: string;
  predictionTimestamp: string;
  decisionTimestamp: string;
  evaluatedBy: string;
  auditTrailId: string;
  status: LoanStatus;
}

export interface PortfolioSummary {
  totalLoans: number;
  totalCustomers: number;
  totalExposure: number;
  totalEcl: number;
  avgPd: number;
  avgLgd: number;
  totalEad: number;
  defaultRate: number;
  highRiskLoansCount: number;
  manualReviewLoansCount: number;
  approvedLoansCount: number;
  rejectedLoansCount: number;
  totalRwa: number;
  capitalRequirement: number;
  capitalAdequacyRatio: number;
  
  // Comparisons vs previous period
  exposureChangePct: number;
  eclChangePct: number;
  pdChangePct: number;
  defaultRateChangePct: number;
  rwaChangePct: number;
}

export interface RiskDistributionData {
  category: RiskCategory;
  count: number;
  percentage: number;
  exposure: number;
  ecl: number;
  avgPd: number;
}

export interface VintageCohort {
  cohort: string; // e.g. "2024-Q1"
  originationAmount: number;
  originationBalance?: number;
  totalLoans: number;
  activeLoans?: number;
  mobDefaultRates: Record<number, number>; // mob -> default rate (0.012)
  monthsOnBookData?: {
    mob: number; // 1 to 24
    cumulativeDefaultRate: number; // %
    ecl: number;
  }[];
}

export interface RollRateMatrix {
  observationPeriod: string;
  totalAccountsObserved: number;
  buckets: string[];
  transitions: Record<string, Record<string, number>>;
  matrix?: {
    fromBucket: DelinquencyBucket;
    toCurrent: number; // %
    to30Dpd: number;
    to60Dpd: number;
    to90Plus: number;
  }[];
}

export interface BaselSummary {
  totalExposure: number;
  totalRwa: number;
  creditRiskRwa: number;
  operationalRiskRwa: number;
  marketRiskRwa: number;
  tier1Capital: number;
  tier2Capital: number;
  tier1Ratio: number;
  tier2Ratio: number;
  crar: number;
  regulatoryMinimum: number;
  capitalBuffer: number;
  capitalRequirement: number;
  capitalRatio?: number; // Tier 1 + 2 CRAR
  regulatoryMinimumRatio?: number; // 10.5% Basel III
  incrementalRwa?: number;
  rwaByLoanType?: { loanType: LoanType; exposure: number; rwa: number; riskWeightAvg: number }[];
  rwaByRiskCategory?: { category: RiskCategory; exposure: number; rwa: number; capitalReq: number }[];
  capitalBySegment?: { segment: CustomerSegment; rwa: number; capitalReq: number }[];
}

export interface StressScenario {
  id: string;
  name: string;
  scenarioName?: 'Base' | 'Moderate' | 'Severe' | string;
  description: string;
  stressedPd: number;
  stressedLgd: number;
  stressedEcl: number;
  stressedCrar: number;
  stressedNpa: number;
  eclDelta: number;
  capitalShortfallOrSurplus: number;
  macroShocks?: {
    gdpGrowth: string;
    unemploymentRate: string;
    interestRateHike: string;
    propertyPriceShock: string;
    defaultRateMultiplier: string;
  };
  metrics?: {
    pd: number;
    lgd: number;
    ecl: number;
    rwa: number;
    capitalRequirement: number;
    crarRatio: number;
  };
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  content?: string;
  sources?: string[];
  suggestedFollowUps?: string[];
}
