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
  const [playerMode, setPlayerMode] = useState<'embed' | 'direct'>('embed');
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
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2.5 leading-snug">
              {session.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <span className="text-white font-semibold">{session.speaker}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                {session.duration}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-slate-400" />
                {session.views}
              </span>
              <span>•</span>
              <span>{session.date}</span>
            </div>
          </div>

          {/* Video Player */}
          <div className="space-y-3">
            {/* Player Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 px-1 text-sm">
              <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPlayerMode('embed')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer text-xs sm:text-sm ${
                    playerMode === 'embed'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  임베드 재생 모드
                </button>
                <button
                  type="button"
                  onClick={() => setPlayerMode('direct')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm ${
                    playerMode === 'direct'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-red-300'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>직접 재생 모드</span>
                </button>
              </div>

              <a
                href={`https://www.youtube.com/watch?v=${session.videoId}${currentSeconds > 0 ? `&t=${currentSeconds}s` : ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 transition-colors font-semibold text-xs sm:text-sm cursor-pointer shrink-0"
              >
                <ExternalLink className="w-4 h-4 text-orange-400" />
                <span>YouTube 원본 전체화면 열기 ↗</span>
              </a>
            </div>

            {/* Video Viewport */}
            {playerMode === 'embed' ? (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg border border-slate-800">
                <iframe
                  src={`https://www.youtube.com/embed/${session.videoId}?enablejsapi=1&rel=0${currentSeconds > 0 ? `&start=${currentSeconds}` : ''}`}
                  title={session.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : (
              <div
                onClick={() =>
                  window.open(
                    `https://www.youtube.com/watch?v=${session.videoId}${currentSeconds > 0 ? `&t=${currentSeconds}s` : ''}`,
                    '_blank'
                  )
                }
                className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg border border-red-900/60 cursor-pointer group flex items-center justify-center"
              >
                <img
                  src={`https://img.youtube.com/vi/${session.videoId}/hqdefault.jpg`}
                  alt={session.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-red-500 transition-all">
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </div>
                  <h4 className="mt-3 text-base sm:text-lg font-bold text-white max-w-lg">
                    {session.title}
                  </h4>
                  <p className="mt-1.5 text-sm text-slate-200">
                    클릭하면 YouTube 사이트에서 바로 재생됩니다
                  </p>
                  <span className="mt-3.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 px-4 py-1.5 rounded-xl shadow-lg">
                    ▶ YouTube에서 바로 보기
                  </span>
                </div>
              </div>
            )}

            {/* Error Guidance Callout */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="text-orange-400 font-bold shrink-0">안내:</span>
              <span>
                브라우저나 샌드박스 정책으로 인해 임베드 화면에서 <em>'동영상 플레이어 구성 오류'</em>가 표시될 경우, 상단 <strong>[직접 재생 모드]</strong> 또는 우측의 <strong>[YouTube 원본 전체화면 열기 ↗]</strong>를 클릭하면 정상적으로 시청할 수 있습니다.
              </span>
            </div>
          </div>

          {/* Quick Timestamp Jump Bar */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 mb-2.5 text-sm font-bold text-slate-300">
              <ListOrdered className="w-4 h-4 text-orange-400" />
              <span>타임스탬프 바로가기 (클릭 시 해당 구간 이동)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {session.timestamps.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSeek(t.seconds)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono transition-colors cursor-pointer border ${
                    currentSeconds === t.seconds
                      ? 'bg-orange-600 text-white border-orange-500 font-bold shadow-md'
                      : 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-orange-400">[{t.time}]</span>
                  <span className="font-sans break-keep leading-tight">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Multimodal Analysis Tabs */}
          <div className="border-b border-slate-800">
            <nav className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-px">
              <button
                onClick={() => setActiveTab('architecture')}
                className={`flex items-center gap-2 py-3.5 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'architecture'
                    ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4 text-orange-400" />
                <span>아키텍처·플로우 도식</span>
              </button>

              <button
                onClick={() => setActiveTab('screen')}
                className={`flex items-center gap-2 py-3.5 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'screen'
                    ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>화면 요약</span>
              </button>

              <button
                onClick={() => setActiveTab('audio')}
                className={`flex items-center gap-2 py-3.5 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'audio'
                    ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>음성 요약</span>
              </button>

              <button
                onClick={() => setActiveTab('transcript')}
                className={`flex items-center gap-2 py-3.5 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'transcript'
                    ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>전체 음성 녹취 스크립트</span>
              </button>

              <button
                onClick={() => setActiveTab('takeaways')}
                className={`flex items-center gap-2 py-3.5 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'takeaways'
                    ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span>교훈과 체크리스트</span>
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
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
                  <Monitor className="w-4 h-4" />
                  <span>슬라이드 핵심 화면 및 시각 구조</span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {session.screenAnalysis.headline}
                </h4>
                <p className="text-base text-slate-200 leading-relaxed">
                  {session.screenAnalysis.diagramDescription}
                </p>
              </div>

              {/* Code Snippet if present */}
              {session.screenAnalysis.codeSnippet && (
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                  <div className="flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                      <Code2 className="w-4 h-4 text-orange-400" />
                      <span>{session.screenAnalysis.codeSnippet.title}</span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(session.screenAnalysis.codeSnippet!.code)}
                      className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? '복사됨' : '코드 복사'}</span>
                    </button>
                  </div>
                  <pre className="p-5 text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed bg-black/60 max-h-80">
                    <code>{session.screenAnalysis.codeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {/* Visual Highlights */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
                  화면에서 주목해야 할 주요 시각 지표
                </h4>
                <ul className="space-y-3">
                  {session.screenAnalysis.visualHighlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-base text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-orange-400 mt-2 shrink-0" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Audio (Spoken Speech) Analysis */}
          {activeTab === 'audio' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Spoken Context */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
                  <Mic className="w-4 h-4" />
                  <span>발표자 핵심 메시지</span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {session.audioAnalysis.headline}
                </h4>
                <p className="text-base text-slate-200 leading-relaxed">
                  {session.audioAnalysis.spokenContext}
                </p>
              </div>

              {/* Troubleshooting Story */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>현장 트러블슈팅과 실패 경험담</span>
                </div>
                <p className="text-base text-slate-200 leading-relaxed">
                  {session.audioAnalysis.troubleshootingStory}
                </p>
              </div>

              {/* Quantitative Results */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
                  <Award className="w-4 h-4" />
                  <span>정량적 도입 성과 (수치 지표)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {session.audioAnalysis.quantitativeResults.map((res, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                      <div className="text-xs text-orange-400 font-bold mb-1">성과 {idx + 1}</div>
                      <div className="text-base sm:text-lg font-black text-white">{res}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speaker Advice */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
                  <Lightbulb className="w-4 h-4" />
                  <span>발표자가 다른 팀에 전하는 조언</span>
                </div>
                <p className="text-base text-slate-200 leading-relaxed italic font-medium bg-slate-950 p-4 rounded-xl border border-slate-800">
                  "{session.audioAnalysis.speakerAdvice}"
                </p>
              </div>
            </div>
          )}

          {/* Tab: Full Spoken Transcript */}
          {activeTab === 'transcript' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-sm text-slate-200 font-medium">
                  <FileText className="w-4 h-4 text-orange-400" />
                  <span>타임라인별 전체 녹취 스크립트 ({session.fullTranscript?.length || 0}개 구간)</span>
                </div>
                <button
                  onClick={handleCopyTranscript}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white border border-slate-700 transition-colors cursor-pointer"
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
                      className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => handleSeek(segment.seconds)}
                          className="flex items-center gap-1.5 text-xs font-mono font-bold text-orange-400 hover:text-orange-300 bg-orange-950/30 px-2.5 py-1 rounded border border-orange-800/40 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>[{segment.time}]</span>
                        </button>
                        <span className="text-xs text-slate-400 font-semibold">{segment.speaker}</span>
                      </div>
                      <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                        {segment.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-sm text-slate-400">
                    녹취 스크립트를 불러올 수 없습니다.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Key Takeaways */}
          {activeTab === 'takeaways' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-orange-400" />
                  <span>이 세션에서 기억할 3가지 원칙</span>
                </h4>
                <div className="space-y-3">
                  {session.keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center text-sm font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-base text-slate-200 leading-relaxed">{takeaway}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Tags */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
                  적용된 기술 스택과 오픈소스
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {session.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-sm font-mono text-slate-200"
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3.5">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-sm uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>AI 아키텍트에게 이 세션 질문하기</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {session.recommendedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAskQuestion(session, q)}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/50 text-left text-sm sm:text-base text-slate-200 hover:text-white transition-all cursor-pointer group"
                  >
                    <span className="leading-snug break-keep pr-2">{q}</span>
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
