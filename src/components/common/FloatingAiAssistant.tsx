import React, { useState } from 'react';
import { Bot, X, Sparkles, Send, Zap, ChevronRight, MessageSquare } from 'lucide-react';
import { LoanApplication } from '../../types';
import { formatINR, formatPercent } from '../../utils/formatting';

interface FloatingAiAssistantProps {
  activeLoan?: LoanApplication | null;
  onOpenFullAssistant: () => void;
}

export const FloatingAiAssistant: React.FC<FloatingAiAssistantProps> = ({
  activeLoan,
  onOpenFullAssistant,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; timestamp: string }>>([
    {
      sender: 'assistant',
      text: 'Namaste! I am your AI Credit Risk Copilot. Ask me about loan underwriting, PD/LGD sensitivity, ECL calculation, or why a loan was Approved/Rejected.',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const samplePrompts = [
    activeLoan ? `Why was ${activeLoan.loanId} ${activeLoan.decision}?` : 'Explain PD & LGD in behavioral risk',
    'What causes a loan rejection in Application Scorecard?',
    'How is ECL calculated from PD, LGD, and EAD?',
    'Show Basel III CRAR capital formula',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      const lower = query.toLowerCase();

      if (lower.includes('reject') || lower.includes('approval') || lower.includes('decision')) {
        botResponse = `Underwriting decisions are governed by Credit Score (cutoff ≥680), Debt-to-Income DTI (≤45%), and Model PD (≤6.0% for Retail, ≤8.5% for MSME). When PD exceeds the risk threshold or negative factors like recent 60+ DPD delinquencies occur, the decision engine routes the application to REJECTED.`;
      } else if (lower.includes('ecl') || lower.includes('formula') || lower.includes('calculate')) {
        botResponse = `Expected Credit Loss (ECL) is calculated as:\n\n**ECL = PD × LGD × EAD**\n\n• **PD (Probability of Default)**: Likelihood borrower defaults within 12 months.\n• **LGD (Loss Given Default)**: Net economic loss post collateral recovery.\n• **EAD (Exposure at Default)**: Outstanding balance + credit conversion factor.`;
      } else if (lower.includes('pd') || lower.includes('lgd') || lower.includes('behavioral')) {
        botResponse = `In Behavioral Risk monitoring, we track real-time repayment delays, credit line utilization, and Point-in-Time (PIT) PD migrations. If behavioral PD deteriorates above the baseline, ECL provisioning increases and RWA capital requirements rise.`;
      } else if (activeLoan && lower.includes(activeLoan.loanId.toLowerCase())) {
        botResponse = `Loan **${activeLoan.loanId}** for **${activeLoan.customerName}** has Credit Score: ${activeLoan.creditScore}, PD: ${formatPercent(activeLoan.pd)}, LGD: ${formatPercent(activeLoan.lgd)}, EAD: ${formatINR(activeLoan.ead)}, and ECL: ${formatINR(activeLoan.ecl)}. Decision is **${activeLoan.decision}** based on ${activeLoan.decisionReason || 'standard risk rules'}.`;
      } else {
        botResponse = `I have analyzed the credit risk parameters. For ${activeLoan ? `active loan ${activeLoan.loanId}` : 'portfolio underwriting'}, all calculations adhere to Basel III Standardised Approach and IFRS 9 ECL provisioning standards.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* Drawer / Popover Window */}
      {isOpen && (
        <div className="mb-3 w-[360px] sm:w-[420px] h-[520px] bg-[#111C35] border border-blue-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-b border-slate-700/80 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center border border-blue-400/40">
                <Bot className="w-4 h-4 text-blue-300" />
              </div>
              <div>
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <span>AI Risk Copilot</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] border border-emerald-400/30">
                    Online
                  </span>
                </div>
                <div className="text-[10px] text-slate-300">
                  {activeLoan ? `Context: ${activeLoan.loanId} (${activeLoan.customerName})` : 'Banking Risk Intelligence'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullAssistant();
                }}
                className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 text-[10px] font-semibold flex items-center gap-0.5"
                title="Expand to Full Page"
              >
                <span>Full Page</span>
                <ChevronRight className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-2.5 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800/60 text-slate-400 text-[11px] w-fit border border-slate-700">
                <Sparkles className="w-3 h-3 text-blue-400 animate-spin" />
                <span>AI evaluating risk parameters...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-[#0D1527] border-t border-slate-800 overflow-x-auto flex gap-1.5 no-scrollbar">
            {samplePrompts.slice(0, 2).map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(p)}
                className="text-[10px] whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md border border-slate-700 transition-colors shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-2.5 bg-[#0D1527] border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about PD, LGD, ECL, decision..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              className="flex-1 bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Launcher Button on Side */}
      <button
        type="button"
        id="floating-ai-assistant-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 transition-all duration-200 border border-blue-400/40 cursor-pointer"
        title="Open AI Risk Assistant"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-blue-900 animate-pulse" />
        </div>
        <span className="font-bold text-xs tracking-wide">AI Assistant</span>
        <Sparkles className="w-3.5 h-3.5 text-yellow-300 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};
