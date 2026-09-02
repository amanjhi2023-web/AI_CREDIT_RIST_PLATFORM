import React, { useState, useRef, useEffect } from 'react';
import { LoanApplication, AiChatMessage } from '../../types';
import { ApiService } from '../../services/api';
import { formatINR, formatPercent } from '../../utils/formatting';
import ReactMarkdown from 'react-markdown';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  FileText, 
  CornerDownLeft, 
  ShieldCheck, 
  RefreshCw, 
  X, 
  BookOpen, 
  HelpCircle,
  Zap,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface AiAssistantPageProps {
  activeLoanContext: LoanApplication | null;
  onClearContext: () => void;
  onSelectLoanContext: (loan: LoanApplication) => void;
  allLoans: LoanApplication[];
}

export const AiAssistantPage: React.FC<AiAssistantPageProps> = ({
  activeLoanContext,
  onClearContext,
  onSelectLoanContext,
  allLoans,
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `### Welcome to the Enterprise Credit Risk & Policy AI Assistant

I am your calibrated banking risk & underwriting intelligence copilot. I can assist you with:

- **Credit Risk Fundamentals**: Mathematical formulations for **PD**, **LGD**, **EAD**, and **ECL** under IFRS 9 / Ind AS 109.
- **Underwriting Decision Explainability**: Deep dive into rejection or approval drivers, SHAP feature importance, and scorecard reason codes.
- **Regulatory Capital & Basel III**: Pillar 1 & 2 RWA, Minimum Capital floor, and CRAR solvency requirements.
- **Delinquency Analytics**: Vintage cohort seasoning and Roll-rate cure dynamics.

You can ask any general credit risk question below or audit an active loan file.`,
      timestamp: 'Just now',
      sources: [
        'Internal Credit Risk Policy Manual v4.2',
        'Basel III Framework - Capital Adequacy Master Direction',
        'IFRS 9 Expected Credit Loss Guidelines'
      ],
      suggestedFollowUps: [
        'What is PD?',
        'How is ECL calculated?',
        'Explain Basel RWA capital requirements',
        'Why was loan LN-2026-00489 rejected?'
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: AiChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await ApiService.askAiAssistant(textToSend, activeLoanContext);
      
      const assistantMessage: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources,
        suggestedFollowUps: response.suggestedFollowUps
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: AiChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: 'An error occurred while generating credit risk analysis. Please verify system connectivity.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'What is PD?',
    'How is ECL calculated?',
    'Why was loan LN-2026-00489 rejected?',
    'What is Basel RWA?',
    'Explain LGD difference between secured and unsecured loans',
    'What are the IFRS 9 Stage 1, 2, and 3 criteria?'
  ];

  return (
    <div id="ai-assistant-page" className="p-6 space-y-4 max-w-6xl mx-auto h-[calc(100vh-70px)] flex flex-col animate-in fade-in duration-200">
      {/* Active Loan Context Banner */}
      {activeLoanContext ? (
        <div className="bg-blue-950/40 border border-blue-900/60 rounded-xl p-3 px-4 flex items-center justify-between text-xs text-blue-200 shadow-2xs shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-slate-400">Active Loan Context: </span>
              <span className="font-bold text-white">{activeLoanContext.customerName}</span>
              <span className="font-mono text-blue-400 ml-1.5">({activeLoanContext.loanId} • {activeLoanContext.loanType} • {formatINR(activeLoanContext.loanAmount)})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              activeLoanContext.decision === 'APPROVED' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80' :
              activeLoanContext.decision === 'REJECTED' ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80' : 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
            }`}>
              {activeLoanContext.decision} (PD: {formatPercent(activeLoanContext.pd)})
            </span>
            <button
              type="button"
              onClick={onClearContext}
              className="p-1 hover:bg-blue-900/60 rounded text-slate-400 hover:text-slate-100"
              title="Clear active loan context"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#111C35] border border-slate-800 rounded-xl p-2.5 px-4 flex items-center justify-between text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Operating in Portfolio-Wide Risk & Regulatory Mode</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Attach Loan Context:</span>
            <select
              onChange={(e) => {
                const found = allLoans.find(l => l.loanId === e.target.value);
                if (found) onSelectLoanContext(found);
              }}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500"
              defaultValue=""
            >
              <option value="" disabled>Select a loan...</option>
              {allLoans.map(l => (
                <option key={l.loanId} value={l.loanId}>
                  {l.loanId} - {l.customerName} ({l.loanType})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Main Chat Message Container */}
      <div className="flex-1 bg-[#111C35] rounded-2xl border border-slate-800 shadow-xs p-5 overflow-y-auto space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white font-medium rounded-tr-xs'
                : 'bg-slate-800/90 border border-slate-700/70 text-slate-200 rounded-tl-xs shadow-2xs'
            }`}>
              {msg.sender === 'user' ? (
                <div className="text-sm font-medium">{msg.text}</div>
              ) : (
                <div className="prose prose-invert prose-xs max-w-none text-slate-200">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              )}

              {/* Citations & Grounded Sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-slate-700/60 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span>Regulatory & Internal Policy Citations:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {msg.sources.map((src, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 font-mono text-[10px]">
                        <span>•</span> {src}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Follow-Ups */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-slate-400 font-semibold w-full">Suggested Follow-ups:</span>
                  {msg.suggestedFollowUps.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(q)}
                      className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:bg-blue-600 hover:border-blue-500 hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <span>{q}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}

              <div className={`text-[9px] mt-2 text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3.5 justify-start animate-in fade-in">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-800/90 border border-slate-700/70 rounded-2xl p-4 text-xs text-slate-300 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
              <span className="font-semibold text-slate-200">Evaluating credit risk models, SHAP weights, and Basel policies...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 shrink-0 text-xs no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-blue-400" /> Quick Inquiries:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(p)}
            className="px-2.5 py-1 rounded-lg bg-[#111C35] border border-slate-700 text-slate-300 hover:border-blue-400 hover:text-blue-300 hover:bg-slate-800 text-xs font-medium whitespace-nowrap shadow-2xs transition-colors shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-[#111C35] rounded-xl border border-slate-700 p-2 shadow-sm flex items-center gap-2 shrink-0">
        <input
          id="ai-assistant-input"
          type="text"
          placeholder={activeLoanContext ? `Ask about ${activeLoanContext.customerName} (${activeLoanContext.loanId}) or general risk policies...` : 'Ask anything regarding PD, LGD, ECL, Basel III RWA, or underwriting decisions...'}
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isLoading}
          className="flex-1 px-3 py-2 text-xs text-white bg-transparent focus:outline-none placeholder:text-slate-500 font-medium"
        />

        <button
          id="btn-send-ai-message"
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!inputQuery.trim() || isLoading}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
