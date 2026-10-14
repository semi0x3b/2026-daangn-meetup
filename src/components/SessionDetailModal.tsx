import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Monitor,
  Mic,
  Clock,
  Eye,
  Sparkles,
  Copy,
  Check,
  Code2,
  AlertTriangle,
  Award,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  ListOrdered,
  FileText,
  Layers
} from 'lucide-react';
import { SessionData, VideoTimestamp } from '../data/playlistData.ts';
import { SessionArchitectureDiagram } from './SessionArchitectureDiagram.tsx';
import { AI_ENABLED } from '../utils/urlHelper.ts';

interface SessionDetailModalProps {
  session: SessionData | null;
  initialTab?: 'architecture' | 'screen' | 'audio' | 'transcript' | 'takeaways';
  onClose: () => void;
  onAskQuestion: (session: SessionData, question: string) => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  session,
  initialTab,
  onClose,
  onAskQuestion,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'screen' | 'audio' | 'transcript' | 'takeaways'>(
    initialTab || 'architecture'
  );
  const [currentSeconds, setCurrentSeconds] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, session]);

  if (!session) return null;

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyTranscript = () => {
    if (!session.fullTranscript) return;
    const text = session.fullTranscript.map(t => `[${t.time}] ${t.speaker}\n${t.text}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  const handleSeek = (seconds: number) => {
    setCurrentSeconds(seconds);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3 pr-4">
            <span className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold">
              세션 {session.index}
            </span>
            <span className="text-xs text-slate-400">{session.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://www.youtube.com/watch?v=${session.videoId}&list=PLVJW6xP-wT5Q`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs"
              title="YouTube에서 열기"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">YouTube</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Title & Metadata */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
              {session.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="text-slate-300 font-medium">{session.speaker}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {session.duration}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                {session.views}
              </span>
              <span>•</span>
              <span>{session.date}</span>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg border border-slate-800">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${session.videoId}?start=${currentSeconds}&autoplay=0&rel=0`}
              title={session.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Quick Timestamp Jump Bar */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400">
              <ListOrdered className="w-3.5 h-3.5 text-orange-400" />
              <span>타임스탬프 바로가기 (클릭 시 해당 구간 이동)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {session.timestamps.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSeek(t.seconds)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer border ${
                    currentSeconds === t.seconds
                      ? 'bg-orange-600 text-white border-orange-500'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-orange-400">[{t.time}]</span>
                  <span className="truncate max-w-[150px] sm:max-w-none font-sans">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Multimodal Analysis Tabs */}
          <div className="border-b border-slate-800">
            <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('architecture')}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'architecture'
                    ? 'border-orange-500 text-orange-400 bg-orange-950/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4 text-orange-400" />
                <span>📐 아키텍처 & 플로우 도식화</span>
              </button>

              <button
                onClick={() => setActiveTab('screen')}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'screen'
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-950/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>🖥️ 화면(Visual) 요약</span>
              </button>

              <button
                onClick={() => setActiveTab('audio')}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'audio'
                    ? 'border-amber-400 text-amber-400 bg-amber-950/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>🎙️ 음성(Audio) 요약</span>
              </button>

              <button
                onClick={() => setActiveTab('transcript')}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'transcript'
                    ? 'border-emerald-400 text-emerald-400 bg-emerald-950/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>📜 전체 음성 녹취 스크립트</span>
              </button>

              <button
                onClick={() => setActiveTab('takeaways')}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'takeaways'
                    ? 'border-orange-500 text-orange-400 bg-orange-950/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span>🎯 실전 교훈 & 체크리스트</span>
              </button>
            </nav>
          </div>

          {/* Tab 0: Architecture & Flow Diagram */}
          {activeTab === 'architecture' && (
            <SessionArchitectureDiagram
              session={session}
              onOpenTranscript={() => setActiveTab('transcript')}
            />
          )}

          {/* Tab 1: Screen (Visual) Analysis */}
          {activeTab === 'screen' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-cyan-950/20 border border-cyan-800/40 rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm mb-2">
                  <Monitor className="w-4 h-4" />
                  <span>슬라이드 핵심 화면 및 시각 구조</span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  {session.screenAnalysis.headline}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {session.screenAnalysis.diagramDescription}
                </p>
              </div>

              {/* Code Snippet if present */}
              {session.screenAnalysis.codeSnippet && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                      <Code2 className="w-4 h-4 text-orange-400" />
                      <span>{session.screenAnalysis.codeSnippet.title}</span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(session.screenAnalysis.codeSnippet!.code)}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? '복사됨' : '코드 복사'}</span>
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                    <code>{session.screenAnalysis.codeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {/* Visual Highlights */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  화면에서 주목해야 할 주요 시각 지표
                </h4>
                <ul className="space-y-2">
                  {session.screenAnalysis.visualHighlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Audio (Spoken Speech) Analysis */}
          {activeTab === 'audio' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Spoken Context */}
              <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-2">
                  <Mic className="w-4 h-4" />
                  <span>발표자 육성 핵심 메시지</span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  {session.audioAnalysis.headline}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {session.audioAnalysis.spokenContext}
                </p>
              </div>

              {/* Troubleshooting Story */}
              <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-sm mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>현장 트러블슈팅 & 실패 경험담</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {session.audioAnalysis.troubleshootingStory}
                </p>
              </div>

              {/* Quantitative Results */}
              <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm mb-3">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>정량적 도입 성과 (수치 지표)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {session.audioAnalysis.quantitativeResults.map((res, idx) => (
                    <div key={idx} className="bg-slate-900/80 border border-emerald-800/30 rounded-lg p-3">
                      <div className="text-xs text-emerald-400 font-semibold mb-1">성과 {idx + 1}</div>
                      <div className="text-sm font-bold text-white">{res}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speaker Advice */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>발표자가 다른 팀에 전하는 실전 조언</span>
                </div>
                <p className="text-sm text-slate-200 italic font-medium">
                  "{session.audioAnalysis.speakerAdvice}"
                </p>
              </div>
            </div>
          )}

          {/* Tab: Full Spoken Transcript */}
          {activeTab === 'transcript' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>발표자의 타임라인별 구두 발화 전체 녹취록 스크립트 ({session.fullTranscript?.length || 0}개 구간)</span>
                </div>
                <button
                  onClick={handleCopyTranscript}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                >
                  {copiedTranscript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTranscript ? '스크립트 복사됨' : '전체 스크립트 복사'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {session.fullTranscript && session.fullTranscript.length > 0 ? (
                  session.fullTranscript.map((segment, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => handleSeek(segment.seconds)}
                          className="flex items-center gap-1.5 text-xs font-mono font-bold text-orange-400 hover:text-orange-300 bg-orange-950/30 px-2 py-0.5 rounded border border-orange-800/40 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>[{segment.time}]</span>
                        </button>
                        <span className="text-[11px] text-slate-400 font-semibold">{segment.speaker}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                        {segment.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-slate-500">
                    녹취 스크립트를 불러올 수 없습니다.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Key Takeaways */}
          {activeTab === 'takeaways' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>이 세션에서 반드시 기억해야 할 3가지 원칙</span>
                </h4>
                <div className="space-y-3">
                  {session.keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="w-6 h-6 rounded-full bg-orange-600/30 text-orange-400 border border-orange-500/40 flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-slate-200 leading-relaxed">{takeaway}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Tags */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  적용된 주요 기술 스택 & 오픈소스
                </div>
                <div className="flex flex-wrap gap-2">
                  {session.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-orange-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recommended Questions Section */}
          {AI_ENABLED && (
            <div className="bg-gradient-to-r from-orange-950/30 via-amber-950/20 to-slate-950 border border-orange-800/40 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider mb-3">
                <Sparkles className="w-4 h-4" />
                <span>AI 아키텍트에게 이 세션 심층 질문하기</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {session.recommendedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAskQuestion(session, q)}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-900/90 hover:bg-orange-600/20 border border-slate-800 hover:border-orange-500/40 text-left text-xs sm:text-sm text-slate-200 hover:text-white transition-all cursor-pointer group"
                  >
                    <span className="line-clamp-1">{q}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-orange-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            2026 당근 빌더 밋업 | SRE Day 플레이리스트 분석
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
