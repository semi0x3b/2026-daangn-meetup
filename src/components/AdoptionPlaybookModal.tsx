import React, { useState } from 'react';
import { AI_ENABLED, IS_STATIC_SITE } from '../utils/urlHelper.ts';
import {
  X,
  Copy,
  Check,
  Download,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { ADOPTION_TRACKS } from '../data/adoptionPlaybookData.ts';
import { downloadStandaloneHtmlReport } from '../utils/exportHtmlHelper.ts';

interface AdoptionPlaybookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChatWithTopic: (topic: string) => void;
}

export const AdoptionPlaybookModal: React.FC<AdoptionPlaybookModalProps> = ({
  isOpen,
  onClose,
  onOpenChatWithTopic,
}) => {
  const [activeTrack, setActiveTrack] = useState<string>('track-1');
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  if (!isOpen) return null;

  const tracks = ADOPTION_TRACKS;
  const currentTrack = tracks.find((t) => t.id === activeTrack) || tracks[0];

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedStep(id);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">당근 SRE 인사이트 실무 도입 플레이북</h3>
              <p className="text-xs text-slate-400">우리 회사 인프라에 바로 따라 해보는 단계별 실전 액션 플랜</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!IS_STATIC_SITE && (
              <button
                onClick={downloadStandaloneHtmlReport}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md shadow-orange-600/20 cursor-pointer"
                title="플레이북이 포함된 전체 단일 HTML 파일 다운로드"
              >
                <Download className="w-3.5 h-3.5" />
                <span>플레이북 HTML 저장</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Track Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-950 border-b border-slate-800 divide-x divide-slate-800/80 text-sm font-semibold">
          {tracks.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTrack(t.id)}
              className={`p-3.5 sm:p-4 text-left transition-colors cursor-pointer flex flex-col gap-1.5 ${
                activeTrack === t.id
                  ? 'bg-slate-900 text-orange-400 border-b-2 border-orange-500 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <span className="leading-snug break-keep text-sm font-bold text-white">{t.title.split('. ')[1]}</span>
              <span className="text-xs text-slate-400 font-mono">{t.difficulty}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-slate-950/30">
          {/* Track Summary Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <span className={`text-sm font-bold px-3 py-1 rounded-xl border ${currentTrack.color || 'text-orange-400 bg-orange-500/10 border-orange-500/30'}`}>
                  {currentTrack.title}
                </span>
                <span className="text-sm text-slate-300">난이도: <strong className="text-white font-bold">{currentTrack.difficulty}</strong></span>
              </div>
              <span className="text-xs sm:text-sm text-slate-400">{currentTrack.sessions}</span>
            </div>
            <p className="text-base font-semibold text-white leading-relaxed">
              {currentTrack.summary}
            </p>
          </div>

          {/* Section: What Daangn SRE Did */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>당근 SRE 팀이 현장에서 실제로 구축한 것들 (What They Did)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentTrack.whatDaangnDid.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 leading-relaxed flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-orange-400 mt-2 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Step-by-Step How We Can Adopt */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-orange-400" />
              <span>우리가 따라할 수 있는 단계별 실행 가이드 (How We Can Adopt)</span>
            </h4>

            {currentTrack.howToAdopt.map((step, idx) => (
              <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5">
                <div className="flex items-center gap-2.5 text-base font-bold text-white">
                  <span className="w-7 h-7 rounded-full bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span>{step.phase}</span>
                </div>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed pl-9">
                  {step.action}
                </p>

                {step.code && (
                  <div className="ml-9 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 text-xs text-slate-300 font-semibold border-b border-slate-800">
                      <span>적용 설정 스니펫</span>
                      <button
                        onClick={() => handleCopyCode(`${activeTrack}-${idx}`, step.code!)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer text-xs"
                      >
                        {copiedStep === `${activeTrack}-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedStep === `${activeTrack}-${idx}` ? '복사됨' : '복사'}</span>
                      </button>
                    </div>
                    <pre className="p-4 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed">
                      <code>{step.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Ask AI button for this track */}
          {AI_ENABLED && (
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-orange-400">우리 회사 환경 맞춤 컨설팅이 필요한가요?</div>
                <div className="text-[11px] text-slate-400">"{currentTrack.title}" 도입 시 주의해야 할 사전 제약 사항 질문하기</div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenChatWithTopic(`우리 회사 인프라에 ${currentTrack.title}을 도입하려고 해. 현재 우리가 사전 점검해야 할 필수 전제 조건과 점진적 마이그레이션 팁을 알려줘.`);
                }}
                className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI에게 도입 질의하기</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
