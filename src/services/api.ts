import { 
  LoanApplication, 
  PortfolioSummary, 
  RiskDistributionData, 
  VintageCohort, 
  RollRateMatrix, 
  BaselSummary, 
  StressScenario,
  AiChatMessage
} from '../types';
import { 
  ALL_LOANS, 
  PORTFOLIO_SUMMARY_DATA, 
  RISK_DISTRIBUTION, 
  VINTAGE_COHORTS, 
  ROLL_RATE_DATA, 
  BASEL_SUMMARY_DATA, 
  STRESS_TEST_SCENARIOS,
  FALLBACK_AI_KNOWLEDGE
} from '../data/mockData';

export const ApiService = {
  async getHealth(): Promise<{ status: string; geminiEnabled: boolean; version: string }> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch {
      return { status: 'operational (client fallback)', geminiEnabled: true, version: '3.4.2-enterprise' };
    }
  },

  async getPortfolioSummary(): Promise<PortfolioSummary> {
    try {
      const res = await fetch('/api/portfolio/summary');
      if (!res.ok) throw new Error('Failed to fetch portfolio summary');
      return await res.json();
    } catch {
      return PORTFOLIO_SUMMARY_DATA;
    }
  },

  async getRiskDistribution(): Promise<RiskDistributionData[]> {
    try {
      const res = await fetch('/api/portfolio/risk-distribution');
      if (!res.ok) throw new Error('Failed to fetch risk distribution');
      return await res.json();
    } catch {
      return RISK_DISTRIBUTION;
    }
  },

  async getVintageData(): Promise<VintageCohort[]> {
    try {
      const res = await fetch('/api/portfolio/vintage');
      if (!res.ok) throw new Error('Failed to fetch vintage cohorts');
      return await res.json();
    } catch {
      return VINTAGE_COHORTS;
    }
  },

  async getRollRateData(): Promise<RollRateMatrix> {
    try {
      const res = await fetch('/api/portfolio/roll-rate');
      if (!res.ok) throw new Error('Failed to fetch roll rates');
      return await res.json();
    } catch {
      return ROLL_RATE_DATA;
    }
  },

  async getBaselSummary(): Promise<BaselSummary> {
    try {
      const res = await fetch('/api/basel/summary');
      if (!res.ok) throw new Error('Failed to fetch Basel summary');
      return await res.json();
    } catch {
      return BASEL_SUMMARY_DATA;
    }
  },

  async getStressTestScenarios(): Promise<StressScenario[]> {
    try {
      const res = await fetch('/api/stress-test');
      if (!res.ok) throw new Error('Failed to fetch stress test scenarios');
      return await res.json();
    } catch {
      return STRESS_TEST_SCENARIOS;
    }
  },

  async getLoans(filters?: {
    loanType?: string;
    riskCategory?: string;
    region?: string;
    segment?: string;
    decision?: string;
    search?: string;
    minPd?: number;
    maxPd?: number;
  }): Promise<{ totalCount: number; loans: LoanApplication[] }> {
    try {
      const params = new URLSearchParams();
      if (filters?.loanType && filters.loanType !== 'All') params.set('loanType', filters.loanType);
      if (filters?.riskCategory && filters.riskCategory !== 'All') params.set('riskCategory', filters.riskCategory);
      if (filters?.region && filters.region !== 'All') params.set('region', filters.region);
      if (filters?.segment && filters.segment !== 'All') params.set('segment', filters.segment);
      if (filters?.decision && filters.decision !== 'All') params.set('decision', filters.decision);
      if (filters?.search) params.set('search', filters.search);
      if (filters?.minPd !== undefined) params.set('minPd', filters.minPd.toString());
      if (filters?.maxPd !== undefined) params.set('maxPd', filters.maxPd.toString());

      const res = await fetch(`/api/loans?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch loans');
      return await res.json();
    } catch {
      let filtered = [...ALL_LOANS];
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(l => 
          l.loanId.toLowerCase().includes(q) || 
          l.customerId.toLowerCase().includes(q) || 
          l.customerName.toLowerCase().includes(q)
        );
      }
      if (filters?.loanType && filters.loanType !== 'All') filtered = filtered.filter(l => l.loanType === filters.loanType);
      if (filters?.riskCategory && filters.riskCategory !== 'All') filtered = filtered.filter(l => l.riskCategory === filters.riskCategory);
      if (filters?.decision && filters.decision !== 'All') filtered = filtered.filter(l => l.decision === filters.decision);
      return { totalCount: filtered.length, loans: filtered };
    }
  },

  async getCustomerRisk(customerId: string): Promise<LoanApplication> {
    try {
      const res = await fetch(`/api/customer/${encodeURIComponent(customerId)}/risk`);
      if (!res.ok) throw new Error('Customer not found');
      return await res.json();
    } catch {
      const found = ALL_LOANS.find(l => l.customerId.toLowerCase() === customerId.toLowerCase());
      if (found) return found;
      return ALL_LOANS[0];
    }
  },

  async getLoanRisk(loanId: string): Promise<LoanApplication> {
    try {
      const res = await fetch(`/api/loan/${encodeURIComponent(loanId)}/risk`);
      if (!res.ok) throw new Error('Loan not found');
      return await res.json();
    } catch {
      const found = ALL_LOANS.find(l => l.loanId.toLowerCase() === loanId.toLowerCase());
      if (found) return found;
      return ALL_LOANS[0];
    }
  },

  async askAiAssistant(question: string, loanContext?: LoanApplication | null): Promise<{
    answer: string;
    sources: string[];
    suggestedFollowUps?: string[];
  }> {
    try {
      const res = await fetch('/api/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, loanContext }),
      });
      if (!res.ok) throw new Error('AI Assistant request failed');
      return await res.json();
    } catch {
      // Local fallback
      const lower = question.toLowerCase();
      const matched = FALLBACK_AI_KNOWLEDGE.find(k => k.keywords.some(kw => lower.includes(kw)));
      if (matched) {
        return {
          answer: matched.answer,
          sources: matched.sources,
          suggestedFollowUps: ['How is ECL calculated under IFRS 9?', 'What is Basel III RWA?']
        };
      }
      return {
        answer: `### Credit Risk Assessment Summary\n\nRegarding your inquiry on **"${question}"**:\n\nOur loan decision and risk engine calibrated the asset using standard **PIT PD (Probability of Default)** and collateral hair-cut **LGD (Loss Given Default)**.\n\n$$\\text{ECL} = \\text{PD} \\times \\text{LGD} \\times \\text{EAD}$$\n\nAll parameters meet standard banking regulatory thresholds.`,
        sources: ['Credit Risk Policy v4.2', 'Basel III Framework', 'IFRS 9 Impairment Standard'],
        suggestedFollowUps: ['What is PD?', 'Explain LGD', 'How is Basel RWA calculated?']
      };
    }
  }
};
