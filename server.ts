import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { 
  ALL_LOANS, 
  PORTFOLIO_SUMMARY_DATA, 
  RISK_DISTRIBUTION, 
  VINTAGE_COHORTS, 
  ROLL_RATE_DATA, 
  BASEL_SUMMARY_DATA, 
  STRESS_TEST_SCENARIOS, 
  FALLBACK_AI_KNOWLEDGE 
} from './src/data/mockData';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// ---------------- API ENDPOINTS ----------------

// System Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'operational',
    service: 'AI Credit Risk Gateway',
    version: '3.4.2-enterprise',
    decisionEngine: 'Active',
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Portfolio Summary
app.get('/api/portfolio/summary', (req, res) => {
  res.json(PORTFOLIO_SUMMARY_DATA);
});

// Risk Distribution
app.get('/api/portfolio/risk-distribution', (req, res) => {
  res.json(RISK_DISTRIBUTION);
});

// Vintage Analysis
app.get('/api/portfolio/vintage', (req, res) => {
  res.json(VINTAGE_COHORTS);
});

// Roll Rate Analysis
app.get('/api/portfolio/roll-rate', (req, res) => {
  res.json(ROLL_RATE_DATA);
});

// Basel III Summary
app.get('/api/basel/summary', (req, res) => {
  res.json(BASEL_SUMMARY_DATA);
});

// Stress Test Scenarios
app.get('/api/stress-test', (req, res) => {
  res.json(STRESS_TEST_SCENARIOS);
});

// All Loans & Search / Filter
app.get('/api/loans', (req, res) => {
  let filtered = [...ALL_LOANS];
  const { 
    loanType, 
    riskCategory, 
    region, 
    segment, 
    decision, 
    search, 
    status,
    minPd,
    maxPd,
    minAmount,
    maxAmount
  } = req.query;

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(l => 
      l.loanId.toLowerCase().includes(q) || 
      l.customerId.toLowerCase().includes(q) || 
      l.customerName.toLowerCase().includes(q) ||
      l.branch.toLowerCase().includes(q)
    );
  }

  if (loanType && loanType !== 'All') {
    filtered = filtered.filter(l => l.loanType === loanType);
  }

  if (riskCategory && riskCategory !== 'All') {
    filtered = filtered.filter(l => l.riskCategory === riskCategory);
  }

  if (region && region !== 'All') {
    filtered = filtered.filter(l => l.region === region);
  }

  if (segment && segment !== 'All') {
    filtered = filtered.filter(l => l.employmentType === segment);
  }

  if (decision && decision !== 'All') {
    filtered = filtered.filter(l => l.decision === decision);
  }

  if (status && status !== 'All') {
    filtered = filtered.filter(l => l.status === status);
  }

  if (minPd) {
    filtered = filtered.filter(l => l.pd >= parseFloat(String(minPd)));
  }
  if (maxPd) {
    filtered = filtered.filter(l => l.pd <= parseFloat(String(maxPd)));
  }

  if (minAmount) {
    filtered = filtered.filter(l => l.loanAmount >= parseFloat(String(minAmount)));
  }
  if (maxAmount) {
    filtered = filtered.filter(l => l.loanAmount <= parseFloat(String(maxAmount)));
  }

  res.json({
    totalCount: filtered.length,
    loans: filtered
  });
});

// Single Customer Risk Profile
app.get('/api/customer/:customer_id/risk', (req, res) => {
  const customerId = req.params.customer_id;
  const loan = ALL_LOANS.find(l => l.customerId.toLowerCase() === customerId.toLowerCase());
  
  if (!loan) {
    return res.status(404).json({ error: `Customer with ID ${customerId} not found` });
  }
  res.json(loan);
});

// Single Loan Risk Profile
app.get('/api/loan/:loan_id/risk', (req, res) => {
  const loanId = req.params.loan_id;
  const loan = ALL_LOANS.find(l => l.loanId.toLowerCase() === loanId.toLowerCase());
  
  if (!loan) {
    return res.status(404).json({ error: `Loan with ID ${loanId} not found` });
  }
  res.json(loan);
});

// AI Risk Assistant Ask Endpoint
app.post('/api/assistant/ask', async (req, res) => {
  try {
    const { question, loanContext } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const ai = getGeminiClient();
    
    if (ai) {
      try {
        const systemPrompt = `You are an executive Senior Credit Risk & Underwriting AI Specialist for a tier-1 banking institution.
Your duty is to provide authoritative, rigorous, mathematically sound, and explainable insights regarding credit risk, loan underwriting decisions, probability of default (PD), Loss Given Default (LGD), Exposure at Default (EAD), Expected Credit Loss (ECL), Basel III Capital Adequacy (RWA, CRAR), Vintage cohorts, Roll-rate delinquency transition, and Macro Stress Testing.

Formatting requirements:
1. Use professional, clear, crisp banking terminology.
2. Structure answers with headings, key takeaways, and mathematical equations ($$\\text{ECL} = \\text{PD} \\times \\text{LGD} \\times \\text{EAD}$$) where relevant.
3. If referencing specific loan parameters, quote exact numbers with Indian Rupee formatting (e.g., ₹10,00,000, ₹6.82 Cr, 6.20%).
4. At the very end of your answer, include a "### Sources" section with 2-4 formal banking/regulatory policy citations (e.g., "Credit Risk Policy v4.2 - Section 4", "Basel III Pillar 1 & 2 Guidelines", "IFRS 9 Impairment Standard").

Context about the active loan (if provided):
${loanContext ? JSON.stringify(loanContext, null, 2) : 'No specific single loan is currently highlighted; answer from portfolio-wide risk policies.'}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: question,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.2,
          }
        });

        const rawText = response.text || '';
        
        // Extract sources from response or supply default banking sources
        const sourcesMatch = rawText.match(/### Sources\s*([\s\S]*)$/i);
        let sources: string[] = [];
        let cleanText = rawText;

        if (sourcesMatch && sourcesMatch[1]) {
          sources = sourcesMatch[1]
            .split('\n')
            .map(s => s.replace(/^[-*•\d.]+\s*/, '').trim())
            .filter(s => s.length > 0);
        } else {
          sources = [
            'Internal Credit Risk Policy Manual v4.2 (2026)',
            'Basel III Master Direction - Capital Adequacy Standards',
            'IFRS 9 / Ind AS 109 Expected Credit Loss Framework'
          ];
        }

        return res.json({
          answer: cleanText,
          sources: sources.slice(0, 4),
          suggestedFollowUps: [
            'What mitigation actions are recommended for this risk level?',
            'How would a 200 bps interest rate hike impact this customer?',
            'Explain the Basel RWA contribution of this loan type'
          ]
        });
      } catch (geminiError) {
        console.error('Gemini API query failed, falling back to local banking knowledge base:', geminiError);
      }
    }

    // Fallback rule-based matching if Gemini is unconfigured or encounters an error
    const lowerQ = question.toLowerCase();
    const matched = FALLBACK_AI_KNOWLEDGE.find(k => 
      k.keywords.some(kw => lowerQ.includes(kw))
    );

    if (matched) {
      return res.json({
        answer: matched.answer,
        sources: matched.sources,
        suggestedFollowUps: [
          'How does LGD differ between secured and unsecured loans?',
          'What is the minimum regulatory CRAR under Basel III?',
          'Explain the 60 DPD to 90+ DPD roll rate impact on ECL'
        ]
      });
    }

    // Default institutional response
    return res.json({
      answer: `### Enterprise Credit Risk Analysis\n\nRegarding **"${question}"**:\n\nOur risk management governance models credit exposures using a multi-factor framework incorporating **Point-in-Time (PIT) PD**, collateral-discounted **LGD**, and calibrated **EAD** under **IFRS 9 Stage 1, 2, and 3** provisioning rules.\n\n- **Approval Ceiling**: Retail PD $\\le 7.50\\%$, MSME PD $\\le 12.00\\%$\n- **Capital Adequacy Ratio**: Currently **14.85%** (Basel III target: $\\ge 10.50\\%$)\n- **Decision Routing**: Automated for prime scores $\\ge 700$; Senior Review required for borderline PD ranges ($7.5\\% - 9.0\\%$).\n\nPlease ask for specific customer IDs (e.g., \`CUST-10245\`, \`LN-2026-00452\`) or specific regulatory topics for deeper drill-down.`,
      sources: [
        'Credit Risk Governance & Underwriting Policy 2026',
        'Model Validation & SHAP Explainability Report v3.4',
        'Regulatory Capital & Basel III Accord'
      ],
      suggestedFollowUps: [
        'What is PD?',
        'How is ECL calculated?',
        'Why was loan LN-2026-00489 rejected?',
        'Explain Basel RWA capital requirements'
      ]
    });
  } catch (error: any) {
    console.error('Error in /api/assistant/ask:', error);
    res.status(500).json({ error: 'Failed to process AI risk inquiry', details: error.message });
  }
});

// ---------------- VITE & STATIC SERVING ----------------

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏦 AI Credit Risk Management Platform running on port ${PORT}`);
  });
}

start();
