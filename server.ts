import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { 
  PORTFOLIO_SAMPLE_RECORDS,
  PORTFOLIO_STATS,
  PORTFOLIO_RATING_DISTRIBUTION,
  PORTFOLIO_VINTAGE_DATA,
  PORTFOLIO_MOB_DATA,
  STRESS_SCENARIOS,
  MODEL_PERFORMANCE_DATA,
  DATA_QUALITY_REPORT,
  EDA_VARIABLE_SUMMARIES,
  APC_DATA
} from './src/data/mockData';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
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
    version: '3.1.2-enterprise',
    decisionEngine: 'Active',
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Portfolio Summary & Stats
app.get('/api/portfolio/summary', (req, res) => {
  res.json(PORTFOLIO_STATS);
});

// Rating Distribution
app.get('/api/portfolio/rating-distribution', (req, res) => {
  res.json(PORTFOLIO_RATING_DISTRIBUTION);
});

// Vintage Data
app.get('/api/portfolio/vintage', (req, res) => {
  res.json(PORTFOLIO_VINTAGE_DATA);
});

// MOB Seasoning Data
app.get('/api/portfolio/mob', (req, res) => {
  res.json(PORTFOLIO_MOB_DATA);
});

// Stress Test Scenarios
app.get('/api/stress-test', (req, res) => {
  res.json(STRESS_SCENARIOS);
});

// Model Performance Validation Metrics
app.get('/api/model-performance', (req, res) => {
  res.json(MODEL_PERFORMANCE_DATA);
});

// Data Quality & Reconciliation
app.get('/api/data-quality', (req, res) => {
  res.json(DATA_QUALITY_REPORT);
});

// EDA & APC Data
app.get('/api/eda-apc', (req, res) => {
  res.json({
    variables: EDA_VARIABLE_SUMMARIES,
    apc: APC_DATA
  });
});

// All Loans & Search / Filter
app.get('/api/loans', (req, res) => {
  let filtered = [...PORTFOLIO_SAMPLE_RECORDS];
  const { 
    loanType, 
    rating, 
    region, 
    search, 
    minPd,
    maxPd
  } = req.query;

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(l => 
      l.loanId.toLowerCase().includes(q) || 
      l.customerId.toLowerCase().includes(q) || 
      l.customerName.toLowerCase().includes(q)
    );
  }

  if (loanType && loanType !== 'All') {
    filtered = filtered.filter(l => l.loanType === loanType);
  }

  if (rating && rating !== 'All') {
    filtered = filtered.filter(l => l.rating === rating);
  }

  if (region && region !== 'All') {
    filtered = filtered.filter(l => l.region === region);
  }

  if (minPd) {
    filtered = filtered.filter(l => l.pd >= parseFloat(String(minPd)));
  }
  if (maxPd) {
    filtered = filtered.filter(l => l.pd <= parseFloat(String(maxPd)));
  }

  res.json({
    totalCount: filtered.length,
    loans: filtered
  });
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
        const systemPrompt = `You are a Senior Quantitative Credit Risk Specialist for an enterprise banking platform.
Your objective is to provide rigorous, mathematically sound, explainable answers regarding credit risk, loan underwriting decisions, probability of default (PD), Loss Given Default (LGD), Exposure at Default (EAD), Expected Credit Loss (ECL), Basel III Capital Adequacy (RWA, CRAR), Vintage cohorts, Roll-rate delinquency transition, and Macro Stress Testing.

Formatting requirements:
1. Use professional, clear, crisp banking terminology.
2. Structure answers with headings, key takeaways, and mathematical equations ($$\\text{ECL} = \\text{PD} \\times \\text{LGD} \\times \\text{EAD}$$) where relevant.
3. If referencing specific loan parameters, quote exact numbers with Indian Rupee formatting (e.g., ₹10,00,000, ₹6.82 Cr, 6.20%).
4. At the very end of your answer, include a "### Sources" section with 2-4 formal banking/regulatory policy citations (e.g., "Credit Risk Policy v3.1", "Basel III Pillar 1 & 2 Guidelines", "IFRS 9 Impairment Standard").

Context about the active loan (if provided):
${loanContext ? JSON.stringify(loanContext, null, 2) : 'No specific single loan is currently highlighted; answer from portfolio-wide risk policies.'}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: question,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.2,
          }
        });

        const rawText = response.text || '';
        
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
            'Internal Credit Risk Policy Manual v3.1 (2024)',
            'Basel III Master Direction - Capital Adequacy Standards',
            'IFRS 9 / Ind AS 109 Expected Credit Loss Framework'
          ];
        }

        return res.json({
          answer: cleanText,
          sources: sources.slice(0, 4),
          suggestedFollowUps: [
            'What mitigation actions are recommended for this risk level?',
            'How would a 150 bps interest rate hike impact this portfolio?',
            'Explain the Basel RWA contribution of this loan type'
          ]
        });
      } catch (geminiError) {
        console.error('Gemini API query failed, falling back to local institutional response:', geminiError);
      }
    }

    // Default institutional response
    return res.json({
      answer: `### Enterprise Credit Risk Policy\n\nRegarding **"${question}"**:\n\nOur risk management governance models credit exposures using a dual-scorecard framework:\n\n1. **Application Scorecard**: Underwrites new loan origination across DTI, LTV, collateral coverage, and bureau credit score (with thin-file support).\n2. **Behavioral Scorecard (MOB ≥ 6)**: Longitudinal 12M default hazard incorporating Months On Book (quadratic curve), equity build-up, excess payments (CEP), and macroeconomic shocks (HPI, GDP).\n\n- **ECL Formula**: $$\\text{ECL} = \\text{PD} \\times \\text{LGD} \\times \\text{EAD}$$\n- **Current Capital Adequacy (CRAR)**: **16.4%** vs 10.5% statutory floor.`,
      sources: [
        'Credit Risk Governance & Underwriting Policy 2024',
        'Model Validation & WOE Scorecard Documentation v3.1',
        'Regulatory Capital & Basel III Accord'
      ],
      suggestedFollowUps: [
        'Why is MOB ≥ 6 months required for behavioral scoring?',
        'How is ECL calculated?',
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
    console.log(`🏦 AI Credit Risk Platform running on port ${PORT}`);
  });
}

start();
