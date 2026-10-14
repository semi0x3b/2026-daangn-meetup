import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, Copy, Check, RefreshCw, ChevronDown } from 'lucide-react';
import { SessionData, SESSIONS_DATA } from '../data/playlistData.ts';

interface AiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSession: SessionData | null;
  initialQuestion?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sessionId?: string;
  timestamp: string;
}

export const AiChatDrawer: React.FC<AiChatDrawerProps> = ({
  isOpen,
  onClose,
  selectedSession,
  initialQuestion,
}) => {
  const [currentSessionId, setCurrentSessionId] = useState<string>(selectedSession ? selectedSession.id : '');
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `안녕하세요! **2026 당근 SRE Day AI 어시스턴트**입니다.\n\n플레이리스트(PLVJW6xP-wT5Q)의 9개 세션에 대해 **화면(아키텍처·코드·지표)**과 **음성(발표 맥락·트러블슈팅·정량 성과)**을 바탕으로 질문에 답변해 드립니다.\n\n궁금한 세션을 선택하거나 아래 추천 질문을 눌러보세요!`,
      timestamp: '방금 전',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedSession) {
      setCurrentSessionId(selectedSession.id);
    }
  }, [selectedSession]);

  useEffect(() => {
    if (initialQuestion && isOpen) {
      handleSend(initialQuestion);
    }
  }, [initialQuestion, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (questionToSend?: string) => {
    const text = (questionToSend || inputQuestion).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      sessionId: currentSessionId || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          sessionId: currentSessionId || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || '답변을 생성하지 못했습니다.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          text: `답변 생성 중 오류가 발생했습니다: ${err.message || '네트워크 오류'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const presetQuestions = [
    'Grafana를 걷어내고 에이전트 얼럿으로 전환한 핵심 아키텍처는?',
    'Karpenter 도입 후 EKS 비용이 28% 절감된 구체적 이유',
    'CI 캐시 히트율을 99.4%로 올린 계층형 캐시 키 설계법',
    'eBPF로 해결한 간헐적 504 네트워크 장애 사례 요약',
    'Redis에서 Valkey로 무중단 전환한 마이그레이션 전략',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">당근 SRE Day AI 아키텍트 Q&A</h3>
              <p className="text-[11px] text-slate-400">화면·음성 내용 기반 질의응답</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Session Filter Select */}
        <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2">
          <span className="text-xs text-slate-400 shrink-0 font-medium">대상 범위:</span>
          <select
            value={currentSessionId}
            onChange={(e) => setCurrentSessionId(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
          >
            <option value="">전체 9개 세션 대상 질문</option>
            {SESSIONS_DATA.map((s) => (
              <option key={s.id} value={s.id}>
                세션 {s.index}. {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Chat Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`relative max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-orange-600 text-white rounded-br-xs'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-xs'
                }`}
              >
                {/* Formatted Text */}
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                <div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === msg.id ? '복사됨' : '복사'}</span>
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-orange-400 animate-spin" />
                <span className="text-xs text-slate-400">답변을 작성하는 중...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Presets */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-400 mb-2">추천 질문:</div>
          <div className="flex flex-wrap gap-1.5">
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-900 hover:bg-orange-600/20 text-slate-300 hover:text-orange-300 border border-slate-800 hover:border-orange-500/40 transition-colors cursor-pointer text-left break-keep"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="세션의 화면이나 발표 내용에 대해 질문하세요..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isLoading}
              className="p-2.5 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
