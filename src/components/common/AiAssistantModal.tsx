import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  Activity, 
  PieChart, 
  Landmark,
  ChevronRight
} from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: 'Hello! I am your AI Credit Risk Copilot. You can ask me questions regarding Application Underwriting criteria, Behavioral Scorecards (MOB ≥ 6 rules), Basel III RWA calculations, or Macro Stress Testing scenarios.',
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const quickQuestions = [
    'Why is MOB ≥ 6 months required for behavioral scoring?',
    'How is Basel III Capital calculated from ECL & RWA?',
    'What happens to thin-file applicants with no credit history?',
    'Explain the Severe Downturn stress testing scenario.'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      let botResponse = '';
      const lower = query.toLowerCase();

      if (lower.includes('mob') || lower.includes('seasoned') || lower.includes('behavioral')) {
        botResponse = 'Months On Book (MOB) measures loan age. Accounts with MOB < 6 months lack sufficient longitudinal payment history to calculate reliable rolling default hazard rates. For accounts with MOB ≥ 6, our logistic behavioral model incorporates quadratic seasoning (MOB + MOB²), equity build-up, and Cumulative Excess Payment (CEP).';
      } else if (lower.includes('capital') || lower.includes('basel') || lower.includes('rwa') || lower.includes('ecl')) {
        botResponse = 'Under the Basel III Advanced Internal Ratings-Based (A-IRB) framework: 1. Expected Loss is computed as ECL = PD × LGD × EAD. 2. Risk-Weighted Assets (RWA) are derived from the Vasicek asymptotic single risk factor formula using TTC PD and LGD. 3. Total regulatory capital requirement equals RWA × 10.5% (8.0% Pillar 1 + 2.5% Capital Conservation Buffer).';
      } else if (lower.includes('thin') || lower.includes('no hit') || lower.includes('no credit')) {
        botResponse = 'For Thin File / No-Hit applicants, traditional bureau scorecards are replaced by alternative non-traditional rules: 1. Employment tenure stability (≥ 2 years preferred), 2. Low LTV cushion (≤ 70%), 3. Strict Debt-to-Income (DTI ≤ 35%), and 4. Rental/utility cashflow verification.';
      } else if (lower.includes('stress') || lower.includes('severe') || lower.includes('downturn')) {
        botResponse = 'The Severe Downturn stress scenario applies a compound macroeconomic shock: -1.5% GDP contraction, -15% House Price Index (HPI) decline, 9.5% Unemployment spike, and +250 bps interest rate hike. This increases portfolio PD from 3.45% to 7.85% and requires an additional ₹289.4 Cr in solvency capital.';
      } else {
        botResponse = `Under standard credit policy: Application scorecards assess origination risk (collateral & bureau), whereas Behavioral scorecards track ongoing performance. Your portfolio exhibits a healthy 14.8% CRAR solvency ratio with 98.9% data integrity compliance.`;
      }

      const assistantMsg: ChatMessage = {
        sender: 'assistant',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsThinking(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-end p-4 animate-in fade-in">
      <div 
        id="ai-assistant-drawer"
        className="w-full max-w-md h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>AI Credit Risk Copilot</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <div className="text-[10px] text-slate-400">Regulatory & Policy Assistant</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Stream Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl rounded-bl-none text-slate-500 text-xs w-fit">
              <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing credit policy & regulatory models...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="p-3 bg-white border-t border-slate-100 space-y-1.5">
          <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Suggested Queries:</div>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="text-[11px] text-left px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors line-clamp-1"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask anything about risk scorecards or Basel capital..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isThinking}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
