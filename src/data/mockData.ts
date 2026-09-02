import { 
  LoanApplication, 
  PortfolioSummary, 
  RiskDistributionData, 
  VintageCohort, 
  RollRateMatrix, 
  BaselSummary, 
  StressScenario,
  LoanType,
  CustomerSegment
} from '../types';

export const INITIAL_LOANS: LoanApplication[] = [
  {
    loanId: 'LN-2026-00452',
    customerId: 'CUST-10245',
    customerName: 'Aarav Singhania',
    customerAge: 38,
    employmentType: 'Salaried',
    monthlyIncome: 185000,
    loanAmount: 1000000,
    loanType: 'Home Loan',
    loanTenureMonths: 240,
    interestRate: 8.45,
    applicationDate: '2026-08-24',
    originationCohort: '2026-Q3',
    region: 'North',
    branch: 'Connaught Place, New Delhi',
    creditScore: 712,
    riskCategory: 'Medium Risk',
    pd: 0.062, // 6.2%
    lgd: 0.28, // 28%
    ead: 1000000,
    ecl: 17360, // 0.062 * 0.28 * 1000000 = ₹17,360
    decision: 'APPROVED',
    decisionRule: 'Standard Retail Prime - Score >= 700 & PD <= 7.5% & DTI <= 45%',
    pdThreshold: 0.075,
    eclThreshold: 25000,
    decisionReason: 'Customer falls within the acceptable PD range and estimated ECL is below the configured risk threshold.',
    positiveFactors: [
      'Zero defaults or written-off accounts in last 5 years',
      'Stable 8+ year employment with Tier-1 MNC',
      'High primary collateral coverage (LTV 68%)',
      'Clean repayment track record on previous auto loan'
    ],
    negativeFactors: [
      'DTI ratio is slightly elevated at 42.5%',
      'Single recent credit card inquiry within past 45 days',
      'Moderate existing personal loan liability of ₹2.4 Lakh'
    ],
    shapValues: [
      { feature: 'Credit Bureau Score (712)', impact: -0.038, isRiskIncreasing: false },
      { feature: 'Debt-to-Income (42.5%)', impact: 0.024, isRiskIncreasing: true },
      { feature: 'Employment Tenure (8.2 yrs)', impact: -0.019, isRiskIncreasing: false },
      { feature: 'LTV Ratio (68%)', impact: -0.015, isRiskIncreasing: false },
      { feature: 'Recent Inquiries (1 count)', impact: 0.008, isRiskIncreasing: true },
      { feature: 'Existing Obligations', impact: 0.012, isRiskIncreasing: true }
    ],
    scorecardReasonCodes: [
      { code: 'R04', description: 'Debt obligations relative to net monthly income', scoreImpact: -18 },
      { code: 'P01', description: 'Satisfactory depth of credit history', scoreImpact: 35 },
      { code: 'P03', description: 'Zero 30+ DPD instances over 36 months', scoreImpact: 28 },
      { code: 'R12', description: 'Unsecured debt exposure proportion', scoreImpact: -11 }
    ],
    lifecycleTimeline: [
      { stage: 'Application Ingestion', status: 'completed', timestamp: '2026-08-24 10:14:02', details: 'Form received via Digital Portal; KYC verified via Aadhaar OTP' },
      { stage: 'Data Validation & Bureau Pull', status: 'completed', timestamp: '2026-08-24 10:14:38', details: 'CIBIL/Experian pull successful. Bureau Score: 712' },
      { stage: 'Risk Assessment Engine', status: 'completed', timestamp: '2026-08-24 10:15:10', details: 'Financial ratios normalized: DTI 42.5%, LTI 5.4x' },
      { stage: 'PD Prediction (XGBoost v3.4)', status: 'completed', timestamp: '2026-08-24 10:15:22', details: 'PD calibrated at 6.20% (Confidence 94.2%)' },
      { stage: 'LGD Prediction & Haircut', status: 'completed', timestamp: '2026-08-24 10:15:29', details: 'Residential collateral haircut applied. LGD: 28.00%' },
      { stage: 'EAD Calculation', status: 'completed', timestamp: '2026-08-24 10:15:35', details: 'CCF 100% applied. EAD: ₹10,00,000' },
      { stage: 'ECL Estimation (IFRS 9 Stage 1)', status: 'completed', timestamp: '2026-08-24 10:15:40', details: 'ECL = 6.2% × 28% × ₹10,00,000 = ₹17,360' },
      { stage: 'Decision Engine Output', status: 'completed', timestamp: '2026-08-24 10:15:52', details: 'Rule R-701 MATCHED -> APPROVED (Sanction Letter Generated)' }
    ],
    existingLoansExposure: 240000,
    monthlyObligations: 78600,
    dti: 42.5,
    lti: 5.4,
    creditUtilization: 24.8,
    activeLoansCount: 2,
    previousDefaults: 0,
    delinquencyHistory36m: 0,
    avgRepaymentDelayDays: 1.2,
    baselRiskWeight: 50, // 50% for standard residential mortgage
    rwa: 500000,
    capitalRequirement: 52500, // 10.5% Basel III
    modelVersion: 'v3.4.2_xgb_prod',
    predictionTimestamp: '2026-08-24T10:15:40.210Z',
    decisionTimestamp: '2026-08-24T10:15:52.880Z',
    evaluatedBy: 'Automated Decision Gateway #4',
    auditTrailId: 'AUD-2026-884210',
    status: 'Active'
  },
  {
    loanId: 'LN-2026-00489',
    customerId: 'CUST-10312',
    customerName: 'Pooja Venkatesh',
    customerAge: 45,
    employmentType: 'Business',
    monthlyIncome: 340000,
    loanAmount: 4500000,
    loanType: 'MSME Business',
    loanTenureMonths: 60,
    interestRate: 11.25,
    applicationDate: '2026-08-28',
    originationCohort: '2026-Q3',
    region: 'South',
    branch: 'Indiranagar, Bengaluru',
    creditScore: 618,
    riskCategory: 'High Risk',
    pd: 0.148, // 14.8%
    lgd: 0.45, // 45%
    ead: 4500000,
    ecl: 299700, // 0.148 * 0.45 * 4500000 = ₹2,99,700
    decision: 'REJECTED',
    decisionRule: 'MSME Unsecured Ceiling - PD > 12.0% or Delinquencies >= 2',
    pdThreshold: 0.12,
    eclThreshold: 180000,
    decisionReason: 'PD exceeds the configured approval ceiling (14.8% vs max 12.0%) and high recent delinquency triggers risk policy cutoff.',
    positiveFactors: [
      'Strong declared gross business turnover (₹3.8 Cr/yr)',
      'Operational banking relationship with current account for 4 years'
    ],
    negativeFactors: [
      'Multiple 60+ DPD delinquencies reported in last 12 months',
      'High DTI at 68.4% and elevated working capital strain',
      'Credit card utilization maxed at 89.2%',
      'GST filing discrepancy noted in Q1 FY27'
    ],
    shapValues: [
      { feature: 'Recent Delinquency (60+ DPD)', impact: 0.068, isRiskIncreasing: true },
      { feature: 'Credit Card Utilization (89.2%)', impact: 0.038, isRiskIncreasing: true },
      { feature: 'DTI Ratio (68.4%)', impact: 0.032, isRiskIncreasing: true },
      { feature: 'GST Discrepancy Flag', impact: 0.019, isRiskIncreasing: true },
      { feature: 'Business Vintage (6 yrs)', impact: -0.015, isRiskIncreasing: false }
    ],
    scorecardReasonCodes: [
      { code: 'R01', description: 'Delinquency on active revolving trade lines', scoreImpact: -45 },
      { code: 'R08', description: 'High utilization of unsecured credit limits', scoreImpact: -32 },
      { code: 'R14', description: 'Working capital debt service coverage < 1.1x', scoreImpact: -25 }
    ],
    lifecycleTimeline: [
      { stage: 'Application Ingestion', status: 'completed', timestamp: '2026-08-28 14:02:11', details: 'MSME FastTrack portal upload' },
      { stage: 'Data Validation & Bureau Pull', status: 'completed', timestamp: '2026-08-28 14:03:05', details: 'Commercial & Consumer CIBIL fetched: 618' },
      { stage: 'Risk Assessment Engine', status: 'completed', timestamp: '2026-08-28 14:04:12', details: 'DTI computed at 68.4%, 2 prior delinquency marks' },
      { stage: 'PD Prediction (XGBoost v3.4)', status: 'completed', timestamp: '2026-08-28 14:04:30', details: 'PD calibrated at 14.80% (High Risk Band)' },
      { stage: 'LGD Prediction & Haircut', status: 'completed', timestamp: '2026-08-28 14:04:40', details: 'Unsecured cash credit component. LGD: 45.00%' },
      { stage: 'EAD Calculation', status: 'completed', timestamp: '2026-08-28 14:04:45', details: 'EAD: ₹45,00,000' },
      { stage: 'ECL Estimation (IFRS 9 Stage 2)', status: 'completed', timestamp: '2026-08-28 14:04:50', details: 'ECL = 14.8% × 45% × ₹45,00,000 = ₹2,99,700' },
      { stage: 'Decision Engine Output', status: 'completed', timestamp: '2026-08-28 14:05:00', details: 'RULE REJECT: PD > 12.0% ceiling violated' }
    ],
    existingLoansExposure: 3200000,
    monthlyObligations: 232560,
    dti: 68.4,
    lti: 13.2,
    creditUtilization: 89.2,
    activeLoansCount: 5,
    previousDefaults: 1,
    delinquencyHistory36m: 3,
    avgRepaymentDelayDays: 18.5,
    baselRiskWeight: 100,
    rwa: 4500000,
    capitalRequirement: 472500,
    modelVersion: 'v3.4.2_xgb_prod',
    predictionTimestamp: '2026-08-28T14:04:50.110Z',
    decisionTimestamp: '2026-08-28T14:05:00.320Z',
    evaluatedBy: 'Automated Decision Gateway #2',
    auditTrailId: 'AUD-2026-885912',
    status: 'Under Review'
  },
  {
    loanId: 'LN-2026-00511',
    customerId: 'CUST-10488',
    customerName: 'Devendra Mehra',
    customerAge: 32,
    employmentType: 'Self-employed',
    monthlyIncome: 145000,
    loanAmount: 1800000,
    loanType: 'Auto Loan',
    loanTenureMonths: 84,
    interestRate: 9.15,
    applicationDate: '2026-08-29',
    originationCohort: '2026-Q3',
    region: 'West',
    branch: 'Bandra West, Mumbai',
    creditScore: 682,
    riskCategory: 'Medium Risk',
    pd: 0.081, // 8.1%
    lgd: 0.35, // 35%
    ead: 1800000,
    ecl: 51030, // 0.081 * 0.35 * 1800000 = ₹51,030
    decision: 'MANUAL REVIEW',
    decisionRule: 'Borderline PD Band (7.5% - 9.0%) - Requires Senior Underwriter Review',
    pdThreshold: 0.075,
    eclThreshold: 40000,
    decisionReason: 'Customer falls into a borderline risk category requiring additional underwriter review and verification of second income stream.',
    positiveFactors: [
      'Commercial vehicle asset backing with hypothecation',
      'No write-offs or settlements on past credit records',
      'Adequate bank average monthly balance (₹1.8 Lakh)'
    ],
    negativeFactors: [
      'Self-employed income exhibits seasonal variance (±25%)',
      'PD of 8.10% sits in the conditional referral buffer zone',
      'Recent credit line addition 3 months ago'
    ],
    shapValues: [
      { feature: 'Income Volatility Coefficient', impact: 0.028, isRiskIncreasing: true },
      { feature: 'Credit Score (682)', impact: 0.019, isRiskIncreasing: true },
      { feature: 'Asset Hypothecation (Auto)', impact: -0.022, isRiskIncreasing: false },
      { feature: 'Down Payment Ratio (25%)', impact: -0.016, isRiskIncreasing: false }
    ],
    scorecardReasonCodes: [
      { code: 'R05', description: 'Score in borderline underwriting bracket', scoreImpact: -15 },
      { code: 'P04', description: 'Acceptable loan-to-value structure', scoreImpact: 20 }
    ],
    lifecycleTimeline: [
      { stage: 'Application Ingestion', status: 'completed', timestamp: '2026-08-29 09:30:10', details: 'Auto Dealership API Integration' },
      { stage: 'Data Validation & Bureau Pull', status: 'completed', timestamp: '2026-08-29 09:31:00', details: 'Score: 682, Active lines verified' },
      { stage: 'Risk Assessment Engine', status: 'completed', timestamp: '2026-08-29 09:31:45', details: 'Income stability flagged for self-employed profiling' },
      { stage: 'PD Prediction (XGBoost v3.4)', status: 'completed', timestamp: '2026-08-29 09:32:00', details: 'PD: 8.10% (Borderline range)' },
      { stage: 'LGD Prediction & Haircut', status: 'completed', timestamp: '2026-08-29 09:32:15', details: 'Vehicle collateral depreciation applied. LGD: 35.00%' },
      { stage: 'EAD Calculation', status: 'completed', timestamp: '2026-08-29 09:32:20', details: 'EAD: ₹18,00,000' },
      { stage: 'ECL Estimation', status: 'completed', timestamp: '2026-08-29 09:32:25', details: 'ECL: ₹51,030' },
      { stage: 'Decision Engine Output', status: 'in-progress', timestamp: '2026-08-29 09:32:40', details: 'Routed to Senior Risk Manager Queue (Queue #SR-409)' }
    ],
    existingLoansExposure: 620000,
    monthlyObligations: 48500,
    dti: 33.4,
    lti: 12.4,
    creditUtilization: 41.5,
    activeLoansCount: 2,
    previousDefaults: 0,
    delinquencyHistory36m: 1,
    avgRepaymentDelayDays: 4.5,
    baselRiskWeight: 75,
    rwa: 1350000,
    capitalRequirement: 141750,
    modelVersion: 'v3.4.2_xgb_prod',
    predictionTimestamp: '2026-08-29T09:32:25.800Z',
    decisionTimestamp: '2026-08-29T09:32:40.100Z',
    evaluatedBy: 'Automated Routing Engine -> Officer Verma',
    auditTrailId: 'AUD-2026-886104',
    status: 'Under Review'
  },
  {
    loanId: 'LN-2026-00620',
    customerId: 'CUST-10781',
    customerName: 'Kavita Ranganathan',
    customerAge: 41,
    employmentType: 'Corporate',
    monthlyIncome: 420000,
    loanAmount: 8500000,
    loanType: 'Loan Against Property',
    loanTenureMonths: 180,
    interestRate: 8.95,
    applicationDate: '2026-08-30',
    originationCohort: '2026-Q3',
    region: 'South',
    branch: 'Anna Nagar, Chennai',
    creditScore: 785,
    riskCategory: 'Low Risk',
    pd: 0.021, // 2.1%
    lgd: 0.18, // 18%
    ead: 8500000,
    ecl: 32130, // 0.021 * 0.18 * 8500000 = ₹32,130
    decision: 'APPROVED',
    decisionRule: 'Super Prime Mortgage / LAP - Score >= 750 & PD < 3.0%',
    pdThreshold: 0.04,
    eclThreshold: 100000,
    decisionReason: 'Customer falls within the acceptable PD range and estimated ECL is below the configured risk threshold.',
    positiveFactors: [
      'Exceptional credit bureau score (785)',
      'Substantial commercial property collateral with 45% LTV',
      'Very low DTI of 18.2%',
      '12-year unbroken spotless credit bureau history'
    ],
    negativeFactors: [
      'Large single-ticket exposure requiring delegated authority sign-off'
    ],
    shapValues: [
      { feature: 'Bureau Score (785)', impact: -0.062, isRiskIncreasing: false },
      { feature: 'Conservative LTV (45%)', impact: -0.045, isRiskIncreasing: false },
      { feature: 'High Net Income', impact: -0.031, isRiskIncreasing: false },
      { feature: 'Ticket Size Exposure', impact: 0.009, isRiskIncreasing: true }
    ],
    scorecardReasonCodes: [
      { code: 'P01', description: 'Pristine bureau repayment track', scoreImpact: 50 },
      { code: 'P02', description: 'Superior liquidity buffer', scoreImpact: 40 }
    ],
    lifecycleTimeline: [
      { stage: 'Application Ingestion', status: 'completed', timestamp: '2026-08-30 11:00:00', details: 'Wealth Banking Branch Origination' },
      { stage: 'Data Validation & Bureau Pull', status: 'completed', timestamp: '2026-08-30 11:01:20', details: 'Score: 785 Super Prime' },
      { stage: 'Risk Assessment Engine', status: 'completed', timestamp: '2026-08-30 11:02:10', details: 'Collateral valuation verified: ₹1.9 Cr property' },
      { stage: 'PD Prediction (XGBoost v3.4)', status: 'completed', timestamp: '2026-08-30 11:02:30', details: 'PD: 2.10% (Low Risk Tier 1)' },
      { stage: 'LGD Prediction & Haircut', status: 'completed', timestamp: '2026-08-30 11:02:45', details: 'High collateral cushion. LGD: 18.00%' },
      { stage: 'EAD Calculation', status: 'completed', timestamp: '2026-08-30 11:02:50', details: 'EAD: ₹85,00,000' },
      { stage: 'ECL Estimation', status: 'completed', timestamp: '2026-08-30 11:02:55', details: 'ECL: ₹32,130' },
      { stage: 'Decision Engine Output', status: 'completed', timestamp: '2026-08-30 11:03:00', details: 'APPROVED: Fast-tracked under Prime Wealth Policy' }
    ],
    existingLoansExposure: 1100000,
    monthlyObligations: 76440,
    dti: 18.2,
    lti: 20.2,
    creditUtilization: 12.0,
    activeLoansCount: 1,
    previousDefaults: 0,
    delinquencyHistory36m: 0,
    avgRepaymentDelayDays: 0,
    baselRiskWeight: 35,
    rwa: 2975000,
    capitalRequirement: 312375,
    modelVersion: 'v3.4.2_xgb_prod',
    predictionTimestamp: '2026-08-30T11:02:55.100Z',
    decisionTimestamp: '2026-08-30T11:03:00.400Z',
    evaluatedBy: 'Automated Decision Gateway #1',
    auditTrailId: 'AUD-2026-887301',
    status: 'Active'
  },
  {
    loanId: 'LN-2026-00674',
    customerId: 'CUST-10903',
    customerName: 'Rohan Deshmukh',
    customerAge: 27,
    employmentType: 'Salaried',
    monthlyIncome: 65000,
    loanAmount: 400000,
    loanType: 'Personal Loan',
    loanTenureMonths: 36,
    interestRate: 13.5,
    applicationDate: '2026-08-31',
    originationCohort: '2026-Q3',
    region: 'West',
    branch: 'FC Road, Pune',
    creditScore: 645,
    riskCategory: 'Medium Risk',
    pd: 0.089, // 8.9%
    lgd: 0.65, // 65% for unsecured PL
    ead: 400000,
    ecl: 23140, // 0.089 * 0.65 * 400000 = ₹23,140
    decision: 'APPROVED',
    decisionRule: 'Standard Unsecured Personal Loan - Score >= 640 & PD <= 9.0%',
    pdThreshold: 0.09,
    eclThreshold: 25000,
    decisionReason: 'Customer falls within the acceptable PD range and estimated ECL is below the configured risk threshold.',
    positiveFactors: [
      'Consistent monthly salary credit via automated e-NACH',
      'Continuous job tenure of 3.5 years at IT services firm',
      'Zero 60+ DPD incidents'
    ],
    negativeFactors: [
      'Unsecured credit card utilization is 62.4%',
      'Elevated LTI for personal loan category (6.1x monthly income)',
      'Short credit history length (4.2 years)'
    ],
    shapValues: [
      { feature: 'Credit Utilization (62.4%)', impact: 0.032, isRiskIncreasing: true },
      { feature: 'Short Bureau History', impact: 0.021, isRiskIncreasing: true },
      { feature: 'Direct Salary Mandate', impact: -0.019, isRiskIncreasing: false },
      { feature: 'Employer Category A', impact: -0.014, isRiskIncreasing: false }
    ],
    scorecardReasonCodes: [
      { code: 'R09', description: 'Proportion of balances to credit limits too high', scoreImpact: -22 },
      { code: 'P07', description: 'Established payroll employer categorization', scoreImpact: 24 }
    ],
    lifecycleTimeline: [
      { stage: 'Application Ingestion', status: 'completed', timestamp: '2026-08-31 16:10:00', details: 'Mobile App Instant Apply' },
      { stage: 'Data Validation & Bureau Pull', status: 'completed', timestamp: '2026-08-31 16:10:45', details: 'Score: 645 fetched' },
      { stage: 'Risk Assessment Engine', status: 'completed', timestamp: '2026-08-31 16:11:15', details: 'Salary slips parsed via Account Aggregator' },
      { stage: 'PD Prediction (XGBoost v3.4)', status: 'completed', timestamp: '2026-08-31 16:11:30', details: 'PD: 8.90%' },
      { stage: 'LGD Prediction & Haircut', status: 'completed', timestamp: '2026-08-31 16:11:40', details: 'Unsecured retail credit. LGD: 65.00%' },
      { stage: 'EAD Calculation', status: 'completed', timestamp: '2026-08-31 16:11:45', details: 'EAD: ₹4,00,000' },
      { stage: 'ECL Estimation', status: 'completed', timestamp: '2026-08-31 16:11:50', details: 'ECL: ₹23,140' },
      { stage: 'Decision Engine Output', status: 'completed', timestamp: '2026-08-31 16:12:00', details: 'APPROVED: Standard pricing applied' }
    ],
    existingLoansExposure: 150000,
    monthlyObligations: 27300,
    dti: 42.0,
    lti: 6.1,
    creditUtilization: 62.4,
    activeLoansCount: 2,
    previousDefaults: 0,
    delinquencyHistory36m: 1,
    avgRepaymentDelayDays: 3.1,
    baselRiskWeight: 100,
    rwa: 400000,
    capitalRequirement: 42000,
    modelVersion: 'v3.4.2_xgb_prod',
    predictionTimestamp: '2026-08-31T16:11:50.000Z',
    decisionTimestamp: '2026-08-31T16:12:00.200Z',
    evaluatedBy: 'Automated Decision Gateway #3',
    auditTrailId: 'AUD-2026-888902',
    status: 'Active'
  },
  {
    loanId: 'LN-2026-00705',
    customerId: 'CUST-11029',
    customerName: 'Meenakshi Sundaram',
    customerAge: 51,
    employmentType: 'Business',
    monthlyIncome: 520000,
    loanAmount: 12000000,
    loanType: 'MSME Business',
    loanTenureMonths: 120,
    interestRate: 10.75,
    applicationDate: '2026-09-01',
    originationCohort: '2026-Q3',
    region: 'South',
    branch: 'T Nagar, Chennai',
    creditScore: 590,
    riskCategory: 'High Risk',
    pd: 0.185, // 18.5%
    lgd: 0.42, // 42%
    ead: 12000000,
    ecl: 932400, // 0.185 * 0.42 * 12000000 = ₹9,32,400
    decision: 'REJECTED',
    decisionRule: 'MSME High Exposure Guardrail - Score < 600 & PD > 15.0%',
    pdThreshold: 0.12,
    eclThreshold: 450000,
    decisionReason: 'PD exceeds the configured approval ceiling (18.5% vs max 12.0%) and high expected loss of ₹9.32 Lakh violates portfolio risk caps.',
    positiveFactors: [
      'Extensive business vintage of 14 years in textile manufacturing'
    ],
    negativeFactors: [
      'Low credit bureau score (590)',
      'Multiple 90+ DPD non-performing assets recorded on trade credit',
      'Severe leverage: DTI exceeds 74.2%',
      'Pending tax demand litigation noted in statutory filings'
    ],
    shapValues: [
      { feature: 'Historical 90+ DPD Delinquencies', impact: 0.092, isRiskIncreasing: true },
      { feature: 'Bureau Score (590)', impact: 0.051, isRiskIncreasing: true },
      { feature: 'Excessive Leverage (DTI 74.2%)', impact: 0.043, isRiskIncreasing: true },
      { feature: 'Statutory Dispute Flag', impact: 0.024, isRiskIncreasing: true }
    ],
    scorecardReasonCodes: [
      { code: 'R01', description: 'Serious delinquency / default on active credit lines', scoreImpact: -60 },
      { code: 'R03', description: 'Debt burden exceeds sustainable operating cash flows', scoreImpact: -40 }
    ],
    lifecycleTimeline: [
      { stage: 'Application Ingestion', status: 'completed', timestamp: '2026-09-01 09:15:00', details: 'SME Corporate Portal' },
      { stage: 'Data Validation & Bureau Pull', status: 'completed', timestamp: '2026-09-01 09:16:10', details: 'Commercial Bureau Score: 590, 2 NPA accounts' },
      { stage: 'Risk Assessment Engine', status: 'completed', timestamp: '2026-09-01 09:17:00', details: 'EBITDA interest coverage < 0.9x' },
      { stage: 'PD Prediction (XGBoost v3.4)', status: 'completed', timestamp: '2026-09-01 09:17:20', details: 'PD calibrated at 18.50% (High Risk Default Zone)' },
      { stage: 'LGD Prediction & Haircut', status: 'completed', timestamp: '2026-09-01 09:17:35', details: 'Plant & machinery haircut. LGD: 42.00%' },
      { stage: 'EAD Calculation', status: 'completed', timestamp: '2026-09-01 09:17:40', details: 'EAD: ₹1,20,00,000' },
      { stage: 'ECL Estimation (IFRS 9 Stage 3)', status: 'completed', timestamp: '2026-09-01 09:17:45', details: 'ECL: ₹9,32,400' },
      { stage: 'Decision Engine Output', status: 'completed', timestamp: '2026-09-01 09:18:00', details: 'REJECTED: Sub-prime risk ceiling breached' }
    ],
    existingLoansExposure: 18500000,
    monthlyObligations: 385840,
    dti: 74.2,
    lti: 23.0,
    creditUtilization: 94.1,
    activeLoansCount: 6,
    previousDefaults: 2,
    delinquencyHistory36m: 5,
    avgRepaymentDelayDays: 34.0,
    baselRiskWeight: 150,
    rwa: 18000000,
    capitalRequirement: 1890000,
    modelVersion: 'v3.4.2_xgb_prod',
    predictionTimestamp: '2026-09-01T09:17:45.000Z',
    decisionTimestamp: '2026-09-01T09:18:00.000Z',
    evaluatedBy: 'Automated Decision Gateway #1',
    auditTrailId: 'AUD-2026-889140',
    status: 'Default'
  },
  {
    loanId: 'LN-2026-00732',
    customerId: 'CUST-11150',
    customerName: 'Ananya Roy',
    customerAge: 29,
    employmentType: 'Salaried',
    monthlyIncome: 120000,
    loanAmount: 2500000,
    loanType: 'Education Loan',
    loanTenureMonths: 120,
    interestRate: 9.85,
    applicationDate: '2026-09-01',
    originationCohort: '2026-Q3',
    region: 'East',
    branch: 'Salt Lake, Kolkata',
    creditScore: 735,
    riskCategory: 'Low Risk',
    pd: 0.038, // 3.8%
    lgd: 0.32, // 32%
    ead: 2500000,
    ecl: 30400, // 0.038 * 0.32 * 2500000 = ₹30,400
    decision: 'APPROVED',
    decisionRule: 'Premier Global University Education Policy - Co-applicant CIBIL >= 720',
    pdThreshold: 0.06,
    eclThreshold: 50000,
    decisionReason: 'Customer falls within the acceptable PD range and estimated ECL is below the configured risk threshold.',
    positiveFactors: [
      'Admitted to top-ranked Global STEM Masters program with high employability',
      'Solid parental co-applicant backing with established pension & property',
      'Pristine credit score of 735 with zero delinquencies'
    ],
    negativeFactors: [
      'Moratorium period risk during study tenure'
    ],
    shapValues: [
      { feature: 'University Employability Rank', impact: -0.041, isRiskIncreasing: false },
      { feature: 'Co-applicant Income Stability', impact: -0.029, isRiskIncreasing: false },
      { feature: 'Bureau Score (735)', impact: -0.025, isRiskIncreasing: false },
      { feature: 'Course Moratorium Duration', impact: 0.012, isRiskIncreasing: true }
    ],
    scorecardReasonCodes: [
      { code: 'P01', description: 'High tier institution employability index', scoreImpact: 45 },
      { code: 'P05', description: 'Solvent co-obligor guarantee', scoreImpact: 30 }
    ],
    lifecycleTimeline: [
      { stage: 'Application Ingestion', status: 'completed', timestamp: '2026-09-01 11:20:00', details: 'Direct Overseas Education Portal' },
      { stage: 'Data Validation & Bureau Pull', status: 'completed', timestamp: '2026-09-01 11:21:00', details: 'Applicant + Co-applicant Bureau Score: 735' },
      { stage: 'Risk Assessment Engine', status: 'completed', timestamp: '2026-09-01 11:22:00', details: 'Course ranking Tier 1 verified' },
      { stage: 'PD Prediction (XGBoost v3.4)', status: 'completed', timestamp: '2026-09-01 11:22:15', details: 'PD: 3.80%' },
      { stage: 'LGD Prediction & Haircut', status: 'completed', timestamp: '2026-09-01 11:22:25', details: 'Co-applicant guarantee LGD: 32.00%' },
      { stage: 'EAD Calculation', status: 'completed', timestamp: '2026-09-01 11:22:30', details: 'EAD: ₹25,00,000' },
      { stage: 'ECL Estimation', status: 'completed', timestamp: '2026-09-01 11:22:35', details: 'ECL: ₹30,400' },
      { stage: 'Decision Engine Output', status: 'completed', timestamp: '2026-09-01 11:22:45', details: 'APPROVED: Sanction issued with standard terms' }
    ],
    existingLoansExposure: 0,
    monthlyObligations: 12000,
    dti: 10.0,
    lti: 20.8,
    creditUtilization: 15.0,
    activeLoansCount: 1,
    previousDefaults: 0,
    delinquencyHistory36m: 0,
    avgRepaymentDelayDays: 0,
    baselRiskWeight: 75,
    rwa: 1875000,
    capitalRequirement: 196875,
    modelVersion: 'v3.4.2_xgb_prod',
    predictionTimestamp: '2026-09-01T11:22:35.000Z',
    decisionTimestamp: '2026-09-01T11:22:45.000Z',
    evaluatedBy: 'Automated Decision Gateway #4',
    auditTrailId: 'AUD-2026-889421',
    status: 'Active'
  },
  {
    loanId: 'LN-2026-00789',
    customerId: 'CUST-11280',
    customerName: 'Harish Chandra Verma',
    customerAge: 47,
    employmentType: 'Business',
    monthlyIncome: 290000,
    loanAmount: 3500000,
    loanType: 'Home Loan',
    loanTenureMonths: 180,
    interestRate: 8.65,
    applicationDate: '2026-09-01',
    originationCohort: '2026-Q3',
    region: 'North',
    branch: 'Sector 18, Noida',
    creditScore: 695,
    riskCategory: 'Medium Risk',
    pd: 0.058, // 5.8%
    lgd: 0.25, // 25%
    ead: 3500000,
    ecl: 50750, // 0.058 * 0.25 * 3500000 = ₹50,750
    decision: 'APPROVED',
    decisionRule: 'Secured Home Mortgage Tier 2 - Score >= 680 & PD <= 6.5%',
    pdThreshold: 0.065,
    eclThreshold: 60000,
    decisionReason: 'Customer falls within the acceptable PD range and estimated ECL is below the configured risk threshold.',
    positiveFactors: [
      'Ready possession residential property with approved municipal plan',
      'Adequate income tax returns past 3 years',
      'Zero 30+ DPD instances in previous 24 months'
    ],
    negativeFactors: [
      'Credit score 695 is near the minimum threshold for prime pricing',
      'Moderate existing auto loan liability of ₹5.2 Lakh'
    ],
    shapValues: [
      { feature: 'Property Title Clearance', impact: -0.035, isRiskIncreasing: false },
      { feature: 'ITR Consistency (3 yrs)', impact: -0.022, isRiskIncreasing: false },
      { feature: 'Existing Car Loan EMI', impact: 0.015, isRiskIncreasing: true }
    ],
    scorecardReasonCodes: [
      { code: 'P03', description: 'Zero recent delinquencies on credit lines', scoreImpact: 30 },
      { code: 'R07', description: 'Average score on bureau vintage', scoreImpact: -10 }
    ],
    lifecycleTimeline: [
      { stage: 'Application Ingestion', status: 'completed', timestamp: '2026-09-01 15:00:00', details: 'Retail Housing Loan Branch Desk' },
      { stage: 'Data Validation & Bureau Pull', status: 'completed', timestamp: '2026-09-01 15:01:10', details: 'Score: 695' },
      { stage: 'Risk Assessment Engine', status: 'completed', timestamp: '2026-09-01 15:02:00', details: 'LTV 62% on ₹56 Lakh property valuation' },
      { stage: 'PD Prediction (XGBoost v3.4)', status: 'completed', timestamp: '2026-09-01 15:02:15', details: 'PD: 5.80%' },
      { stage: 'LGD Prediction & Haircut', status: 'completed', timestamp: '2026-09-01 15:02:25', details: 'LGD: 25.00%' },
      { stage: 'EAD Calculation', status: 'completed', timestamp: '2026-09-01 15:02:30', details: 'EAD: ₹35,00,000' },
      { stage: 'ECL Estimation', status: 'completed', timestamp: '2026-09-01 15:02:35', details: 'ECL: ₹50,750' },
      { stage: 'Decision Engine Output', status: 'completed', timestamp: '2026-09-01 15:02:45', details: 'APPROVED: Standard sanction' }
    ],
    existingLoansExposure: 520000,
    monthlyObligations: 82000,
    dti: 28.3,
    lti: 12.0,
    creditUtilization: 35.0,
    activeLoansCount: 2,
    previousDefaults: 0,
    delinquencyHistory36m: 0,
    avgRepaymentDelayDays: 1.0,
    baselRiskWeight: 50,
    rwa: 1750000,
    capitalRequirement: 183750,
    modelVersion: 'v3.4.2_xgb_prod',
    predictionTimestamp: '2026-09-01T15:02:35.000Z',
    decisionTimestamp: '2026-09-01T15:02:45.000Z',
    evaluatedBy: 'Automated Decision Gateway #2',
    auditTrailId: 'AUD-2026-889812',
    status: 'Active'
  },
  {
    loanId: 'LN-2026-00812',
    customerId: 'CUST-11342',
    customerName: 'Sunita Krishnan',
    customerAge: 36,
    employmentType: 'Salaried',
    monthlyIncome: 95000,
    loanAmount: 600000,
    loanType: 'Personal Loan',
    loanTenureMonths: 48,
    interestRate: 14.2,
    applicationDate: '2026-09-01',
    originationCohort: '2026-Q3',
    region: 'South',
    branch: 'MG Road, Kochi',
    creditScore: 668,
    riskCategory: 'Medium Risk',
    pd: 0.078, // 7.8%
    lgd: 0.60,
    ead: 600000,
    ecl: 28080,
    decision: 'MANUAL REVIEW',
    decisionRule: 'Unsecured Personal Loan Referral - High aggregate unsecured debt to net monthly salary',
    pdThreshold: 0.075,
    eclThreshold: 25000,
    decisionReason: 'Customer falls into a borderline risk category requiring additional review of monthly obligations & debt consolidation proposal.',
    positiveFactors: [
      '7 years uninterrupted employment in public healthcare sector',
      'No past write-offs or settlements recorded'
    ],
    negativeFactors: [
      'DTI reaches 48.6% when combined with new requested EMI',
      '3 credit inquiries in previous 60 days',
      'Total ECL (₹28,080) exceeds automated auto-sanction limit of ₹25,000'
    ],
    shapValues: [
      { feature: 'High Inquiry Velocity (3)', impact: 0.026, isRiskIncreasing: true },
      { feature: 'Projected DTI (48.6%)', impact: 0.031, isRiskIncreasing: true },
      { feature: 'Stable Healthcare Sector', impact: -0.021, isRiskIncreasing: false }
    ],
    scorecardReasonCodes: [
      { code: 'R04', description: 'Debt-to-income exceeds auto-pass cap', scoreImpact: -20 },
      { code: 'R11', description: 'Multiple recent inquiries', scoreImpact: -14 }
    ],
    lifecycleTimeline: [
      { stage: 'Application Ingestion', status: 'completed', timestamp: '2026-09-01 17:00:00', details: 'Digital Web Channel' },
      { stage: 'Data Validation & Bureau Pull', status: 'completed', timestamp: '2026-09-01 17:00:40', details: 'Score: 668' },
      { stage: 'Risk Assessment Engine', status: 'completed', timestamp: '2026-09-01 17:01:10', details: 'DTI 48.6% flagged' },
      { stage: 'PD Prediction (XGBoost v3.4)', status: 'completed', timestamp: '2026-09-01 17:01:20', details: 'PD: 7.80%' },
      { stage: 'LGD Prediction & Haircut', status: 'completed', timestamp: '2026-09-01 17:01:25', details: 'LGD: 60.00%' },
      { stage: 'EAD Calculation', status: 'completed', timestamp: '2026-09-01 17:01:30', details: 'EAD: ₹6,00,000' },
      { stage: 'ECL Estimation', status: 'completed', timestamp: '2026-09-01 17:01:35', details: 'ECL: ₹28,080' },
      { stage: 'Decision Engine Output', status: 'in-progress', timestamp: '2026-09-01 17:01:45', details: 'MANUAL REVIEW: Assigned to Underwriter Deepa Menon' }
    ],
    existingLoansExposure: 320000,
    monthlyObligations: 46170,
    dti: 48.6,
    lti: 6.3,
    creditUtilization: 58.0,
    activeLoansCount: 3,
    previousDefaults: 0,
    delinquencyHistory36m: 1,
    avgRepaymentDelayDays: 2.5,
    baselRiskWeight: 100,
    rwa: 600000,
    capitalRequirement: 63000,
    modelVersion: 'v3.4.2_xgb_prod',
    predictionTimestamp: '2026-09-01T17:01:35.000Z',
    decisionTimestamp: '2026-09-01T17:01:45.000Z',
    evaluatedBy: 'Automated Routing Engine',
    auditTrailId: 'AUD-2026-890114',
    status: 'Under Review'
  }
];

// Additional synthetic loans to create rich portfolio analysis (total 24 loans)
export const ADDITIONAL_PORTFOLIO_LOANS: LoanApplication[] = [
  {
    loanId: 'LN-2026-00101',
    customerId: 'CUST-09101',
    customerName: 'Aditya Birla',
    customerAge: 44,
    employmentType: 'Corporate',
    monthlyIncome: 650000,
    loanAmount: 15000000,
    loanType: 'Home Loan',
    loanTenureMonths: 240,
    interestRate: 8.35,
    applicationDate: '2026-07-12',
    originationCohort: '2026-Q3',
    region: 'West',
    branch: 'Nariman Point, Mumbai',
    creditScore: 820,
    riskCategory: 'Low Risk',
    pd: 0.012,
    lgd: 0.15,
    ead: 15000000,
    ecl: 27000,
    decision: 'APPROVED',
    decisionRule: 'Super Prime Home Loan',
    pdThreshold: 0.05,
    eclThreshold: 100000,
    decisionReason: 'Customer falls within the acceptable PD range and estimated ECL is below the configured risk threshold.',
    positiveFactors: ['Score 820', 'Low DTI 15%', 'High net worth'],
    negativeFactors: [],
    shapValues: [{ feature: 'Bureau Score', impact: -0.08, isRiskIncreasing: false }],
    scorecardReasonCodes: [{ code: 'P01', description: 'Excellent credit track', scoreImpact: 60 }],
    lifecycleTimeline: [],
    existingLoansExposure: 2000000,
    monthlyObligations: 97500,
    dti: 15.0,
    lti: 23.0,
    creditUtilization: 8.0,
    activeLoansCount: 1,
    previousDefaults: 0,
    delinquencyHistory36m: 0,
    avgRepaymentDelayDays: 0,
    baselRiskWeight: 35,
    rwa: 5250000,
    capitalRequirement: 551250,
    modelVersion: 'v3.4.2_xgb_prod',
    predictionTimestamp: '2026-07-12T10:00:00Z',
    decisionTimestamp: '2026-07-12T10:05:00Z',
    evaluatedBy: 'Automated Gateway #1',
    auditTrailId: 'AUD-2026-771021',
    status: 'Active'
  },
  {
    loanId: 'LN-2026-00102',
    customerId: 'CUST-09102',
    customerName: 'Farhan Akhtar',
    customerAge: 39,
    employmentType: 'Self-employed',
    monthlyIncome: 210000,
    loanAmount: 2800000,
    loanType: 'Auto Loan',
    loanTenureMonths: 60,
    interestRate: 9.45,
    applicationDate: '2026-07-15',
    originationCohort: '2026-Q3',
    region: 'North',
    branch: 'Sector 29, Gurugram',
    creditScore: 672,
    riskCategory: 'Medium Risk',
    pd: 0.069,
    lgd: 0.38,
    ead: 2800000,
    ecl: 73416,
    decision: 'APPROVED',
    decisionRule: 'Standard Auto Loan Policy',
    pdThreshold: 0.075,
    eclThreshold: 80000,
    decisionReason: 'Customer falls within the acceptable PD range and estimated ECL is below the configured risk threshold.',
    positiveFactors: ['Strong business vintage', 'Asset backed hypothecation'],
    negativeFactors: ['Slight income fluctuation'],
    shapValues: [{ feature: 'Collateral Cushion', impact: -0.02, isRiskIncreasing: false }],
    scorecardReasonCodes: [{ code: 'P04', description: 'Adequate asset coverage', scoreImpact: 20 }],
    lifecycleTimeline: [],
    existingLoansExposure: 400000,
    monthlyObligations: 63000,
    dti: 30.0,
    lti: 13.3,
    creditUtilization: 44.0,
    activeLoansCount: 2,
    previousDefaults: 0,
    delinquencyHistory36m: 0,
    avgRepaymentDelayDays: 2.0,
    baselRiskWeight: 75,
    rwa: 2100000,
    capitalRequirement: 220500,
    modelVersion: 'v3.4.2_xgb_prod',
    predictionTimestamp: '2026-07-15T12:00:00Z',
    decisionTimestamp: '2026-07-15T12:02:00Z',
    evaluatedBy: 'Automated Gateway #3',
    auditTrailId: 'AUD-2026-771022',
    status: 'Active'
  },
  {
    loanId: 'LN-2026-00103',
    customerId: 'CUST-09103',
    customerName: 'Sanjay Dutt Gupta',
    customerAge: 53,
    employmentType: 'Business',
    monthlyIncome: 450000,
    loanAmount: 8000000,
    loanType: 'MSME Business',
    loanTenureMonths: 84,
    interestRate: 12.0,
    applicationDate: '2026-07-18',
    originationCohort: '2026-Q3',
    region: 'West',
    branch: 'Ring Road, Surat',
    creditScore: 575,
    riskCategory: 'High Risk',
    pd: 0.172,
    lgd: 0.48,
    ead: 8000000,
    ecl: 660480,
    decision: 'REJECTED',
    decisionRule: 'MSME High PD Cutoff',
    pdThreshold: 0.12,
    eclThreshold: 350000,
    decisionReason: 'PD exceeds the configured approval ceiling.',
    positiveFactors: ['Surat diamond trading vintage 15 yrs'],
    negativeFactors: ['Repeated 60+ DPD delays', 'Subprime bureau score 575'],
    shapValues: [{ feature: 'Delinquency History', impact: 0.08, isRiskIncreasing: true }],
    scorecardReasonCodes: [{ code: 'R01', description: 'Severe late payment records', scoreImpact: -50 }],
    lifecycleTimeline: [],
    existingLoansExposure: 11000000,
    monthlyObligations: 315000,
    dti: 70.0,
    lti: 17.7,
    creditUtilization: 92.0,
    activeLoansCount: 5,
    previousDefaults: 1,
    delinquencyHistory36m: 4,
    avgRepaymentDelayDays: 28.0,
    baselRiskWeight: 150,
    rwa: 12000000,
    capitalRequirement: 1260000,
    modelVersion: 'v3.4.2_xgb_prod',
    predictionTimestamp: '2026-07-18T14:00:00Z',
    decisionTimestamp: '2026-07-18T14:03:00Z',
    evaluatedBy: 'Automated Gateway #2',
    auditTrailId: 'AUD-2026-771023',
    status: 'Default'
  },
  {
    loanId: 'LN-2026-00104',
    customerId: 'CUST-09104',
    customerName: 'Deepak Chhabra',
    customerAge: 34,
    employmentType: 'Salaried',
    monthlyIncome: 115000,
    loanAmount: 500000,
    loanType: 'Personal Loan',
    loanTenureMonths: 36,
    interestRate: 13.8,
    applicationDate: '2026-07-20',
    originationCohort: '2026-Q3',
    region: 'North',
    branch: 'Mall Road, Ludhiana',
    creditScore: 685,
    riskCategory: 'Medium Risk',
    pd: 0.065,
    lgd: 0.62,
    ead: 500000,
    ecl: 20150,
    decision: 'APPROVED',
    decisionRule: 'Standard Unsecured Personal Loan',
    pdThreshold: 0.075,
    eclThreshold: 25000,
    decisionReason: 'Customer falls within the acceptable PD range and estimated ECL is below the configured risk threshold.',
    positiveFactors: ['Stable public sector banking employee', 'Clean 36 month history'],
    negativeFactors: ['Credit card utilization 54%'],
    shapValues: [{ feature: 'Employer Stability', impact: -0.02, isRiskIncreasing: false }],
    scorecardReasonCodes: [{ code: 'P07', description: 'Verified employer profile', scoreImpact: 25 }],
    lifecycleTimeline: [],
    existingLoansExposure: 180000,
    monthlyObligations: 41000,
    dti: 35.6,
    lti: 4.3,
    creditUtilization: 54.0,
    activeLoansCount: 2,
    previousDefaults: 0,
    delinquencyHistory36m: 0,
    avgRepaymentDelayDays: 1.5,
    baselRiskWeight: 100,
    rwa: 500000,
    capitalRequirement: 52500,
    modelVersion: 'v3.4.2_xgb_prod',
    predictionTimestamp: '2026-07-20T16:00:00Z',
    decisionTimestamp: '2026-07-20T16:02:00Z',
    evaluatedBy: 'Automated Gateway #4',
    auditTrailId: 'AUD-2026-771024',
    status: 'Active'
  },
  {
    loanId: 'LN-2026-00105',
    customerId: 'CUST-09105',
    customerName: 'Lakshmi Narayanan',
    customerAge: 48,
    employmentType: 'Corporate',
    monthlyIncome: 380000,
    loanAmount: 6500000,
    loanType: 'Loan Against Property',
    loanTenureMonths: 180,
    interestRate: 9.1,
    applicationDate: '2026-07-25',
    originationCohort: '2026-Q3',
    region: 'South',
    branch: 'Banjara Hills, Hyderabad',
    creditScore: 760,
    riskCategory: 'Low Risk',
    pd: 0.028,
    lgd: 0.22,
    ead: 6500000,
    ecl: 40040,
    decision: 'APPROVED',
    decisionRule: 'Prime Secured Property LAP',
    pdThreshold: 0.05,
    eclThreshold: 80000,
    decisionReason: 'Customer falls within the acceptable PD range and estimated ECL is below the configured risk threshold.',
    positiveFactors: ['Strong collateral (LTV 48%)', 'High salary & senior executive'],
    negativeFactors: [],
    shapValues: [{ feature: 'LTV Ratio', impact: -0.04, isRiskIncreasing: false }],
    scorecardReasonCodes: [{ code: 'P01', description: 'Strong repayment track', scoreImpact: 45 }],
    lifecycleTimeline: [],
    existingLoansExposure: 800000,
    monthlyObligations: 68000,
    dti: 17.9,
    lti: 17.1,
    creditUtilization: 18.0,
    activeLoansCount: 1,
    previousDefaults: 0,
    delinquencyHistory36m: 0,
    avgRepaymentDelayDays: 0,
    baselRiskWeight: 35,
    rwa: 2275000,
    capitalRequirement: 238875,
    modelVersion: 'v3.4.2_xgb_prod',
    predictionTimestamp: '2026-07-25T11:00:00Z',
    decisionTimestamp: '2026-07-25T11:04:00Z',
    evaluatedBy: 'Automated Gateway #1',
    auditTrailId: 'AUD-2026-771025',
    status: 'Active'
  },
  {
    loanId: 'LN-2026-00106',
    customerId: 'CUST-09106',
    customerName: 'Manish Tiwari',
    customerAge: 31,
    employmentType: 'Salaried',
    monthlyIncome: 88000,
    loanAmount: 1200000,
    loanType: 'Auto Loan',
    loanTenureMonths: 60,
    interestRate: 9.35,
    applicationDate: '2026-07-28',
    originationCohort: '2026-Q3',
    region: 'North',
    branch: 'Hazratganj, Lucknow',
    creditScore: 660,
    riskCategory: 'Medium Risk',
    pd: 0.076,
    lgd: 0.36,
    ead: 1200000,
    ecl: 32832,
    decision: 'MANUAL REVIEW',
    decisionRule: 'Auto Loan Borderline Review',
    pdThreshold: 0.075,
    eclThreshold: 30000,
    decisionReason: 'Customer falls into a borderline risk category requiring additional review.',
    positiveFactors: ['Clean salary account record', 'Down payment 20%'],
    negativeFactors: ['PD slightly exceeds 7.5% threshold'],
    shapValues: [{ feature: 'PD Margin', impact: 0.015, isRiskIncreasing: true }],
    scorecardReasonCodes: [{ code: 'R05', description: 'Borderline score tier', scoreImpact: -12 }],
    lifecycleTimeline: [],
    existingLoansExposure: 350000,
    monthlyObligations: 34000,
    dti: 38.6,
    lti: 13.6,
    creditUtilization: 48.0,
    activeLoansCount: 2,
    previousDefaults: 0,
    delinquencyHistory36m: 1,
    avgRepaymentDelayDays: 3.0,
    baselRiskWeight: 75,
    rwa: 900000,
    capitalRequirement: 94500,
    modelVersion: 'v3.4.2_xgb_prod',
    predictionTimestamp: '2026-07-28T14:00:00Z',
    decisionTimestamp: '2026-07-28T14:03:00Z',
    evaluatedBy: 'Automated Routing Engine',
    auditTrailId: 'AUD-2026-771026',
    status: 'Under Review'
  }
];

export const ALL_LOANS: LoanApplication[] = [...INITIAL_LOANS, ...ADDITIONAL_PORTFOLIO_LOANS];

export const PORTFOLIO_SUMMARY_DATA: PortfolioSummary = {
  totalLoans: 14820,
  totalCustomers: 12450,
  totalExposure: 2458000000, // ₹245.8 Cr
  totalEcl: 68200000, // ₹6.82 Cr
  avgPd: 0.054, // 5.40%
  avgLgd: 0.312, // 31.20%
  totalEad: 2380000000, // ₹238.0 Cr
  defaultRate: 0.0245, // 2.45%
  highRiskLoansCount: 1926, // 13%
  manualReviewLoansCount: 2074, // 14%
  approvedLoansCount: 10818, // 73%
  rejectedLoansCount: 1928, // 13%
  totalRwa: 1824000000, // ₹182.4 Cr
  capitalRequirement: 191520000, // ₹19.15 Cr (10.5% Basel III)
  capitalAdequacyRatio: 0.1485, // 14.85% (Target > 11.5%)
  
  // KPI changes
  exposureChangePct: 8.4,
  eclChangePct: -2.1,
  pdChangePct: -0.35,
  defaultRateChangePct: -0.15,
  rwaChangePct: 6.2
};

export const RISK_DISTRIBUTION: RiskDistributionData[] = [
  {
    category: 'Low Risk',
    count: 8595,
    percentage: 58.0,
    exposure: 1548540000, // ₹154.8 Cr
    ecl: 14322000, // ₹1.43 Cr
    avgPd: 0.022
  },
  {
    category: 'Medium Risk',
    count: 4298,
    percentage: 29.0,
    exposure: 663660000, // ₹66.3 Cr
    ecl: 23870000, // ₹2.38 Cr
    avgPd: 0.068
  },
  {
    category: 'High Risk',
    count: 1927,
    percentage: 13.0,
    exposure: 245800000, // ₹24.5 Cr
    ecl: 30008000, // ₹3.00 Cr
    avgPd: 0.165
  }
];

export const VINTAGE_COHORTS: VintageCohort[] = [
  {
    cohort: '2024-Q1',
    originationAmount: 185000000,
    originationBalance: 185000000,
    totalLoans: 1240,
    activeLoans: 1240,
    mobDefaultRates: {
      3: 0.0022,
      6: 0.0065,
      9: 0.0115,
      12: 0.0175,
      18: 0.0238,
      24: 0.0260,
      30: 0.0275,
      36: 0.0282,
    },
    monthsOnBookData: [
      { mob: 1, cumulativeDefaultRate: 0.05, ecl: 120000 },
      { mob: 3, cumulativeDefaultRate: 0.22, ecl: 380000 },
      { mob: 6, cumulativeDefaultRate: 0.65, ecl: 1100000 },
      { mob: 9, cumulativeDefaultRate: 1.15, ecl: 1950000 },
      { mob: 12, cumulativeDefaultRate: 1.75, ecl: 2800000 },
      { mob: 15, cumulativeDefaultRate: 2.10, ecl: 3350000 },
      { mob: 18, cumulativeDefaultRate: 2.38, ecl: 3800000 },
      { mob: 21, cumulativeDefaultRate: 2.52, ecl: 4050000 },
      { mob: 24, cumulativeDefaultRate: 2.60, ecl: 4200000 }
    ]
  },
  {
    cohort: '2024-Q2',
    originationAmount: 210000000,
    originationBalance: 210000000,
    totalLoans: 1420,
    activeLoans: 1420,
    mobDefaultRates: {
      3: 0.0019,
      6: 0.0058,
      9: 0.0102,
      12: 0.0155,
      18: 0.0218,
      24: 0.0235,
      30: 0.0245,
    },
    monthsOnBookData: [
      { mob: 1, cumulativeDefaultRate: 0.04, ecl: 110000 },
      { mob: 3, cumulativeDefaultRate: 0.19, ecl: 340000 },
      { mob: 6, cumulativeDefaultRate: 0.58, ecl: 980000 },
      { mob: 9, cumulativeDefaultRate: 1.02, ecl: 1720000 },
      { mob: 12, cumulativeDefaultRate: 1.55, ecl: 2550000 },
      { mob: 15, cumulativeDefaultRate: 1.92, ecl: 3100000 },
      { mob: 18, cumulativeDefaultRate: 2.18, ecl: 3500000 },
      { mob: 21, cumulativeDefaultRate: 2.30, ecl: 3700000 }
    ]
  },
  {
    cohort: '2024-Q3',
    originationAmount: 245000000,
    originationBalance: 245000000,
    totalLoans: 1680,
    activeLoans: 1680,
    mobDefaultRates: {
      3: 0.0024,
      6: 0.0072,
      9: 0.0128,
      12: 0.0188,
      18: 0.0245,
      24: 0.0260,
    },
    monthsOnBookData: [
      { mob: 1, cumulativeDefaultRate: 0.06, ecl: 160000 },
      { mob: 3, cumulativeDefaultRate: 0.24, ecl: 450000 },
      { mob: 6, cumulativeDefaultRate: 0.72, ecl: 1300000 },
      { mob: 9, cumulativeDefaultRate: 1.28, ecl: 2200000 },
      { mob: 12, cumulativeDefaultRate: 1.88, ecl: 3200000 },
      { mob: 15, cumulativeDefaultRate: 2.25, ecl: 3850000 },
      { mob: 18, cumulativeDefaultRate: 2.45, ecl: 4150000 }
    ]
  },
  {
    cohort: '2024-Q4',
    originationAmount: 290000000,
    originationBalance: 290000000,
    totalLoans: 1950,
    activeLoans: 1950,
    mobDefaultRates: {
      3: 0.0016,
      6: 0.0052,
      9: 0.0095,
      12: 0.0142,
      18: 0.0185,
    },
    monthsOnBookData: [
      { mob: 1, cumulativeDefaultRate: 0.03, ecl: 95000 },
      { mob: 3, cumulativeDefaultRate: 0.16, ecl: 310000 },
      { mob: 6, cumulativeDefaultRate: 0.52, ecl: 920000 },
      { mob: 9, cumulativeDefaultRate: 0.95, ecl: 1650000 },
      { mob: 12, cumulativeDefaultRate: 1.42, ecl: 2400000 },
      { mob: 15, cumulativeDefaultRate: 1.76, ecl: 2980000 }
    ]
  },
  {
    cohort: '2025-Q1',
    originationAmount: 320000000,
    originationBalance: 320000000,
    totalLoans: 2150,
    activeLoans: 2150,
    mobDefaultRates: {
      3: 0.0018,
      6: 0.0055,
      9: 0.0098,
      12: 0.0148,
    },
    monthsOnBookData: [
      { mob: 1, cumulativeDefaultRate: 0.04, ecl: 135000 },
      { mob: 3, cumulativeDefaultRate: 0.18, ecl: 390000 },
      { mob: 6, cumulativeDefaultRate: 0.55, ecl: 1120000 },
      { mob: 9, cumulativeDefaultRate: 0.98, ecl: 1980000 },
      { mob: 12, cumulativeDefaultRate: 1.48, ecl: 2950000 }
    ]
  },
  {
    cohort: '2025-Q2',
    originationAmount: 360000000,
    originationBalance: 360000000,
    totalLoans: 2420,
    activeLoans: 2420,
    mobDefaultRates: {
      3: 0.0015,
      6: 0.0048,
      9: 0.0088,
    },
    monthsOnBookData: [
      { mob: 1, cumulativeDefaultRate: 0.03, ecl: 120000 },
      { mob: 3, cumulativeDefaultRate: 0.15, ecl: 360000 },
      { mob: 6, cumulativeDefaultRate: 0.48, ecl: 1050000 },
      { mob: 9, cumulativeDefaultRate: 0.88, ecl: 1850000 }
    ]
  },
  {
    cohort: '2025-Q3',
    originationAmount: 395000000,
    originationBalance: 395000000,
    totalLoans: 2680,
    activeLoans: 2680,
    mobDefaultRates: {
      3: 0.0014,
      6: 0.0045,
    },
    monthsOnBookData: [
      { mob: 1, cumulativeDefaultRate: 0.03, ecl: 130000 },
      { mob: 3, cumulativeDefaultRate: 0.14, ecl: 370000 },
      { mob: 6, cumulativeDefaultRate: 0.45, ecl: 1100000 }
    ]
  },
  {
    cohort: '2025-Q4',
    originationAmount: 440000000,
    originationBalance: 440000000,
    totalLoans: 3010,
    activeLoans: 3010,
    mobDefaultRates: {
      3: 0.0012,
    },
    monthsOnBookData: [
      { mob: 1, cumulativeDefaultRate: 0.02, ecl: 110000 },
      { mob: 3, cumulativeDefaultRate: 0.12, ecl: 340000 }
    ]
  }
];

export const ROLL_RATE_DATA: RollRateMatrix = {
  observationPeriod: 'Last 12 Months Rolling Average (M-o-M)',
  totalAccountsObserved: 14820,
  buckets: ['Current', '30 DPD', '60 DPD', '90+ DPD'],
  transitions: {
    'Current': { 'Current': 0.946, '30 DPD': 0.048, '60 DPD': 0.005, '90+ DPD': 0.001 },
    '30 DPD': { 'Current': 0.425, '30 DPD': 0.332, '60 DPD': 0.218, '90+ DPD': 0.025 },
    '60 DPD': { 'Current': 0.142, '30 DPD': 0.185, '60 DPD': 0.281, '90+ DPD': 0.392 },
    '90+ DPD': { 'Current': 0.031, '30 DPD': 0.042, '60 DPD': 0.094, '90+ DPD': 0.833 }
  },
  matrix: [
    {
      fromBucket: 'Current',
      toCurrent: 94.6,
      to30Dpd: 4.8,
      to60Dpd: 0.5,
      to90Plus: 0.1
    },
    {
      fromBucket: '30 DPD',
      toCurrent: 42.5,
      to30Dpd: 33.2,
      to60Dpd: 21.8,
      to90Plus: 2.5
    },
    {
      fromBucket: '60 DPD',
      toCurrent: 14.2,
      to30Dpd: 18.5,
      to60Dpd: 28.1,
      to90Plus: 39.2
    },
    {
      fromBucket: '90+ DPD',
      toCurrent: 3.1,
      to30Dpd: 4.2,
      to60Dpd: 9.4,
      to90Plus: 83.3
    }
  ]
};

export const BASEL_SUMMARY_DATA: BaselSummary = {
  totalExposure: 2458000000, // ₹245.8 Cr
  totalRwa: 1824000000, // ₹182.4 Cr
  creditRiskRwa: 1492000000, // ₹149.2 Cr
  operationalRiskRwa: 224000000, // ₹22.4 Cr
  marketRiskRwa: 108000000, // ₹10.8 Cr
  tier1Capital: 226200000, // ₹22.62 Cr
  tier2Capital: 44700000, // ₹4.47 Cr
  tier1Ratio: 12.40, // 12.40%
  tier2Ratio: 2.45, // 2.45%
  crar: 14.85, // 14.85%
  regulatoryMinimum: 10.5, // 10.5%
  capitalBuffer: 79400000, // +₹7.94 Cr
  capitalRequirement: 191520000, // ₹19.15 Cr
  capitalRatio: 14.85,
  regulatoryMinimumRatio: 10.5,
  incrementalRwa: 106500000,
  rwaByLoanType: [
    { loanType: 'Home Loan', exposure: 1106100000, rwa: 497745000, riskWeightAvg: 45 },
    { loanType: 'Loan Against Property', exposure: 491600000, rwa: 221220000, riskWeightAvg: 45 },
    { loanType: 'Auto Loan', exposure: 368700000, rwa: 276525000, riskWeightAvg: 75 },
    { loanType: 'MSME Business', exposure: 294960000, rwa: 368700000, riskWeightAvg: 125 },
    { loanType: 'Personal Loan', exposure: 147480000, rwa: 147480000, riskWeightAvg: 100 },
    { loanType: 'Education Loan', exposure: 49160000, rwa: 36870000, riskWeightAvg: 75 }
  ],
  rwaByRiskCategory: [
    { category: 'Low Risk', exposure: 1548540000, rwa: 696843000, capitalReq: 73168515 },
    { category: 'Medium Risk', exposure: 663660000, rwa: 630477000, capitalReq: 66200085 },
    { category: 'High Risk', exposure: 245800000, rwa: 496680000, capitalReq: 52151400 }
  ],
  capitalBySegment: [
    { segment: 'Salaried', rwa: 785000000, capitalReq: 82425000 },
    { segment: 'Corporate', rwa: 420000000, capitalReq: 44100000 },
    { segment: 'Professional', rwa: 280000000, capitalReq: 29400000 },
    { segment: 'Self-employed', rwa: 215000000, capitalReq: 22575000 },
    { segment: 'Business', rwa: 124000000, capitalReq: 13020000 }
  ]
};

export const STRESS_TEST_SCENARIOS: StressScenario[] = [
  {
    id: 'baseline',
    name: 'Baseline Scenario',
    scenarioName: 'Base',
    description: 'Current baseline macroeconomic conditions with steady GDP growth and normal credit cycle.',
    stressedPd: 0.054,
    stressedLgd: 0.312,
    stressedEcl: 68200000,
    stressedCrar: 0.1485,
    stressedNpa: 0.0245,
    eclDelta: 0,
    capitalShortfallOrSurplus: 79400000,
    macroShocks: {
      gdpGrowth: '+6.5% YoY',
      unemploymentRate: '4.8% (Stable)',
      interestRateHike: '0 bps (Unchanged)',
      propertyPriceShock: '0% (Stable)',
      defaultRateMultiplier: '1.0x (Normal)'
    },
    metrics: {
      pd: 5.4,
      lgd: 31.2,
      ecl: 68200000,
      rwa: 1824000000,
      capitalRequirement: 191520000,
      crarRatio: 14.85
    }
  },
  {
    id: 'mild_recession',
    name: 'Mild Recession',
    scenarioName: 'Moderate',
    description: 'Stagflationary headwind: rising policy interest rates (+150 bps), moderate corporate margin squeeze, and slowing consumption.',
    stressedPd: 0.078,
    stressedLgd: 0.385,
    stressedEcl: 104500000,
    stressedCrar: 0.1270,
    stressedNpa: 0.0380,
    eclDelta: 36300000,
    capitalShortfallOrSurplus: 46200000,
    macroShocks: {
      gdpGrowth: '+4.1% YoY (-2.4%)',
      unemploymentRate: '6.5% (+1.7%)',
      interestRateHike: '+150 bps hike',
      propertyPriceShock: '-6.5% correction',
      defaultRateMultiplier: '1.45x'
    },
    metrics: {
      pd: 7.8,
      lgd: 38.5,
      ecl: 104500000,
      rwa: 2140000000,
      capitalRequirement: 224700000,
      crarRatio: 12.7
    }
  },
  {
    id: 'severe_crisis',
    name: 'Severe Crisis (Stagflation)',
    scenarioName: 'Severe',
    description: 'Severe macro recession: global geopolitical shock, sharp inflation shock (+300 bps hike), property market crash, high retail unemployment.',
    stressedPd: 0.132,
    stressedLgd: 0.490,
    stressedEcl: 192800000,
    stressedCrar: 0.1082,
    stressedNpa: 0.0680,
    eclDelta: 124600000,
    capitalShortfallOrSurplus: 9800000,
    macroShocks: {
      gdpGrowth: '-1.5% YoY (Recession)',
      unemploymentRate: '9.2% (+4.4%)',
      interestRateHike: '+300 bps spike',
      propertyPriceShock: '-22.0% slump',
      defaultRateMultiplier: '2.40x'
    },
    metrics: {
      pd: 13.2,
      lgd: 49.0,
      ecl: 192800000,
      rwa: 2680000000,
      capitalRequirement: 281400000,
      crarRatio: 10.82
    }
  },
  {
    id: 'real_estate_crash',
    name: 'Real Estate Crash (-30%)',
    scenarioName: 'Severe',
    description: 'Property market crash: collateral values drop 30%, mortgage LGD surges, construction sector stress.',
    stressedPd: 0.096,
    stressedLgd: 0.520,
    stressedEcl: 148000000,
    stressedCrar: 0.1190,
    stressedNpa: 0.0490,
    eclDelta: 79800000,
    capitalShortfallOrSurplus: 28600000,
    macroShocks: {
      gdpGrowth: '+1.0% YoY',
      unemploymentRate: '7.0%',
      interestRateHike: '+200 bps',
      propertyPriceShock: '-30.0% crash',
      defaultRateMultiplier: '1.9x'
    },
    metrics: {
      pd: 9.6,
      lgd: 52.0,
      ecl: 148000000,
      rwa: 2350000000,
      capitalRequirement: 246750000,
      crarRatio: 11.90
    }
  },
  {
    id: 'rate_shock',
    name: 'Interest Rate Shock (+350 bps)',
    scenarioName: 'Moderate',
    description: 'Aggressive central bank monetary tightening: floating retail borrower EMIs spike +25%, DTI breaches threshold.',
    stressedPd: 0.089,
    stressedLgd: 0.340,
    stressedEcl: 118500000,
    stressedCrar: 0.1230,
    stressedNpa: 0.0420,
    eclDelta: 50300000,
    capitalShortfallOrSurplus: 37400000,
    macroShocks: {
      gdpGrowth: '+3.5% YoY',
      unemploymentRate: '5.8%',
      interestRateHike: '+350 bps surge',
      propertyPriceShock: '-10.0%',
      defaultRateMultiplier: '1.65x'
    },
    metrics: {
      pd: 8.9,
      lgd: 34.0,
      ecl: 118500000,
      rwa: 2210000000,
      capitalRequirement: 232050000,
      crarRatio: 12.30
    }
  }
];

export const FALLBACK_AI_KNOWLEDGE = [
  {
    keywords: ['pd', 'probability of default', 'what is pd'],
    answer: `**Probability of Default (PD)** is the likelihood that a borrower will fail to meet their scheduled debt repayment obligations over a specified time horizon (typically 12 months for IFRS 9 Stage 1, or lifetime for Stage 2/3).\n\n### Key Components:\n- **Point-in-Time (PIT) PD**: Reflects current macroeconomic and forward-looking economic conditions (used for IFRS 9 ECL calculations).\n- **Through-the-Cycle (TTC) PD**: A smoothed, cycle-neutral rating over a full economic cycle (used for Basel regulatory capital requirements).\n- **Key Inputs**: Bureau credit score (CIBIL/Experian), Debt-to-Income (DTI), debt service history, employment stability, inquiry velocity, and banking transaction volatility.`,
    sources: ['Credit Risk Policy v4.2 - Chapter 3: PD Calibration', 'Basel Committee on Banking Supervision (BCBS) Standards']
  },
  {
    keywords: ['lgd', 'loss given default', 'explain lgd'],
    answer: `**Loss Given Default (LGD)** represents the economic percentage of exposure that the bank will lose if a borrower defaults, after accounting for collateral recovery, liquidation haircuts, and legal workout expenses.\n\n$$\\text{LGD} = 1 - \\text{Recovery Rate}$$\n\n### Haircut & Collateral Standards:\n- **Residential Mortgages**: Typically 15% – 30% LGD (high recovery due to legal mortgage foreclosure).\n- **Auto Loans**: 30% – 40% LGD (asset depreciation + repossession costs).\n- **MSME Secured**: 35% – 50% LGD depending on plant/machinery liquidity.\n- **Unsecured Personal Loans / Credit Cards**: 60% – 85% LGD (limited recovery avenues).`,
    sources: ['Collateral Haircut Policy Manual 2026', 'IFRS 9 Impairment & Recovery Methodology']
  },
  {
    keywords: ['ecl', 'expected credit loss', 'calculate ecl', 'formula'],
    answer: `**Expected Credit Loss (ECL)** is the core quantitative metric under **IFRS 9** and **Ind AS 109** for estimating credit risk provisions.\n\n### Fundamental Formula:\n$$\\text{ECL} = \\text{PD} \\times \\text{LGD} \\times \\text{EAD}$$\n\nWhere:\n- **PD (Probability of Default)**: Likelihood of delinquency/default within the horizon.\n- **LGD (Loss Given Default)**: Net percentage loss after collateral liquidation.\n- **EAD (Exposure at Default)**: Total gross loan balance plus committed but undrawn lines multiplied by Credit Conversion Factor (CCF).\n\n### Example Calculation:\nFor loan **LN-2026-00452** (Home Loan):\n- $\\text{PD} = 6.2\\%$\n- $\\text{LGD} = 28.0\\%$\n- $\\text{EAD} = ₹10,00,000$\n- $\\text{ECL} = 0.062 \\times 0.28 \\times 10,00,000 = \\mathbf{₹17,360}$`,
    sources: ['IFRS 9 Financial Instruments Standard', 'Internal Risk Modeling Whitepaper v3.4']
  },
  {
    keywords: ['basel', 'rwa', 'risk weighted assets', 'capital'],
    answer: `**Risk-Weighted Assets (RWA)** are a bank's assets or off-balance-sheet exposures, weighted according to their underlying credit, market, and operational risk.\n\n### Basel III Capital Adequacy:\n- **Minimum Total Capital Ratio (CRAR)**: 8.0% Pillar 1 + 2.5% Capital Conservation Buffer (CCB) = **10.5% Minimum**.\n- **Capital Requirement** $= \\text{Total RWA} \\times 10.5\\%$\n\n### Asset Risk Weights in our Portfolio:\n- Residential Mortgages (LTV $\\le 80\\%$): **35% - 50%**\n- Auto Loans: **75%**\n- Unsecured Personal Loans: **100%**\n- High-Risk MSME / Subprime: **125% - 150%**\n\nOur current portfolio CRAR is **14.85%**, providing a safe **₹79.8 Cr buffer** above the regulatory mandate.`,
    sources: ['Basel III Capital Accord: Regulatory Framework', 'RBI Master Circular on Capital Adequacy']
  },
  {
    keywords: ['stress test', 'macro shock', 'severe'],
    answer: `**Stress Testing** assesses the balance sheet resilience of the credit portfolio under adverse macroeconomic shocks without relying on historical averages.\n\n### Scenario Overview:\n1. **Base Case**: Normal growth, ECL at ₹6.82 Cr, CRAR at 14.85%.\n2. **Moderate Shock** (+150 bps rate hike, -6.5% property values): ECL rises +53% to ₹10.45 Cr, CRAR drops to 12.70%.\n3. **Severe Shock** (GDP -1.5%, Unemployment 9.2%, Property -22%): ECL surges to ₹19.28 Cr (+182%), RWA reaches ₹268.0 Cr, CRAR remains safe at **10.82%** (above the 10.5% statutory floor).\n\n**Conclusion**: The bank maintains capital sufficiency across all tested macro stress horizons.`,
    sources: ['Enterprise Stress Testing Policy 2026', 'ICAAP Annual Submission Document']
  }
];
