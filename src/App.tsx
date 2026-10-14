import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  FileText,
  Youtube,
  Play,
  Monitor,
  Mic,
  Clock,
  LayoutGrid,
  List,
  CheckCircle2,
  Share2,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  HelpCircle,
  Download
} from 'lucide-react';
import { Navbar } from './components/Navbar.tsx';
import { StatsOverview } from './components/StatsOverview.tsx';
import { SessionCard } from './components/SessionCard.tsx';
import { SessionDetailModal } from './components/SessionDetailModal.tsx';
import { AiChatDrawer } from './components/AiChatDrawer.tsx';
import { FullReportModal } from './components/FullReportModal.tsx';
import { CustomUrlModal } from './components/CustomUrlModal.tsx';
import { AdoptionPlaybookModal } from './components/AdoptionPlaybookModal.tsx';
import { MasterArchitectureDiagram } from './components/MasterArchitectureDiagram.tsx';
import { ShareModal } from './components/ShareModal.tsx';
import { SESSIONS_DATA, PLAYLIST_INFO, SessionData } from './data/playlistData.ts';
import { downloadStandaloneHtmlReport } from './utils/exportHtmlHelper.ts';
import { AI_ENABLED, IS_STATIC_SITE } from './utils/urlHelper.ts';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals & Drawers
  const [activeSession, setActiveSession] = useState<SessionData | null>(null);
  const [sessionModalInitialTab, setSessionModalInitialTab] = useState<'architecture' | 'screen' | 'audio' | 'transcript' | 'takeaways'>('architecture');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatSession, setChatSession] = useState<SessionData | null>(null);
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string>('');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isPlaybookOpen, setIsPlaybookOpen] = useState<boolean>(false);
  const [isCustomUrlOpen, setIsCustomUrlOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(SESSIONS_DATA.map((s) => s.category));
    return ['전체', ...Array.from(set)];
  }, []);

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    return SESSIONS_DATA.filter((s) => {
      const matchCategory = selectedCategory === '전체' || s.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchCategory;

      const matchText =
        s.title.toLowerCase().includes(query) ||
        s.summary.toLowerCase().includes(query) ||
        s.speaker.toLowerCase().includes(query) ||
        s.techStack.some((t) => t.toLowerCase().includes(query)) ||
        s.screenAnalysis.headline.toLowerCase().includes(query) ||
        s.audioAnalysis.headline.toLowerCase().includes(query);

      return matchCategory && matchText;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenChatWithQuestion = (session: SessionData, question: string) => {
    setChatSession(session);
    setChatInitialQuestion(question);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenChat={() => {
          setChatSession(null);
          setChatInitialQuestion('');
          setIsChatOpen(true);
        }}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenPlaybook={() => setIsPlaybookOpen(true)}
        onOpenCustomUrl={() => setIsCustomUrlOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-10 mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-4">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>YouTube 플레이리스트: {PLAYLIST_INFO.playlistId}</span>
              <span className="text-slate-600">•</span>
              <span>총 9개 세션 전수 분석 완료</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              2026 당근 빌더 밋업 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">SRE Day</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6 font-normal">
              4,300만 명이 가입한 거대한 하이퍼로컬 서비스를 지탱하는 당근 SRE/플랫폼 엔지니어들의 9개 세션 
              <strong className="text-white font-semibold"> 화면(슬라이드·도식·코드)</strong>과 
              <strong className="text-white font-semibold"> 음성(발표·트러블슈팅·성과)</strong>을 
              우리 인프라에 바로 적용할 수 있도록 설계된 실무 플레이북 & 요약 대시보드입니다.
            </p>

            {/* Quick Action Badges (Clear hierarchy, no rainbow clutter) */}
            <div className="flex flex-wrap items-center gap-3">
              {!IS_STATIC_SITE && (
                <button
                  onClick={downloadStandaloneHtmlReport}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-xl shadow-orange-600/25 transition-all cursor-pointer border border-orange-500"
                  title="9대 세션 전체 아키텍처 토폴로지, 노드 스펙, 무삭제 녹취록이 담긴 단일 HTML 파일 즉시 다운로드"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>📥 HTML 플레이북 다운로드 (오프라인 영구 보관용)</span>
                </button>
              )}

              <button
                onClick={() => setIsPlaybookOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-sm border border-slate-700 transition-colors cursor-pointer"
              >
                <span>🛠️ 실전 인프라 도입 플레이북</span>
              </button>

              <button
                onClick={() => setIsArchitectureOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-sm border border-slate-700 transition-colors cursor-pointer"
              >
                <span>🗺️ 전체 아키텍처 토폴로지</span>
              </button>

              <button
                onClick={() => setIsReportOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-orange-400" />
                <span>전체 요약 & JSON 데이터</span>
              </button>

              <button
                onClick={() => setIsShareOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-orange-400" />
                <span>공개 링크 공유</span>
              </button>

              {AI_ENABLED && (
                <button
                  onClick={() => {
                    setChatSession(null);
                    setChatInitialQuestion('우리 회사 인프라에 가장 먼저 도입해볼 만한 당근 SRE의 Quick-Win 액션 3가지를 추천해줘.');
                    setIsChatOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-sm font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>AI 아키텍트 맞춤 질의</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Engineering Stats Overview */}
        <StatsOverview />

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Categories Pill Scroller */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white shadow-sm shadow-orange-500/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {cat} {cat === '전체' ? `(${SESSIONS_DATA.length})` : ''}
              </button>
            ))}
          </div>

          {/* Search Box & View Toggle */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="세션명, eBPF, Karpenter, TPU 검색..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="그리드 뷰"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="리스트 뷰"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sessions List / Grid */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
            <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">검색 결과가 없습니다</h3>
            <p className="text-xs text-slate-400 mb-4">다른 키워드로 검색하거나 카테고리를 변경해보세요.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('전체');
              }}
              className="px-3 py-1.5 bg-slate-800 text-xs text-slate-200 rounded-lg hover:bg-slate-700"
            >
              필터 초기화
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onSelect={(s) => {
                  setActiveSession(s);
                  setSessionModalInitialTab('screen');
                }}
                onQuickAsk={(s, q) => handleOpenChatWithQuestion(s, q)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => {
                  setActiveSession(session);
                  setSessionModalInitialTab('screen');
                }}
                className="group p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row gap-5 cursor-pointer shadow-md"
              >
                <div className="w-full md:w-72 aspect-video rounded-xl overflow-hidden bg-black shrink-0 relative">
                  <img
                    src={`https://img.youtube.com/vi/${session.videoId}/mqdefault.jpg`}
                    alt={session.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-slate-950/90 text-white font-bold text-xs px-2.5 py-1 rounded-md border border-slate-700">
                    세션 {session.index}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-slate-950/90 text-white text-xs px-2 py-0.5 rounded-md border border-slate-700 font-mono">
                    {session.duration}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-750">
                        {session.category}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-300 font-medium">{session.speaker}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors mb-2 leading-snug break-keep">
                      {session.title}
                    </h3>
                    <p className="text-sm text-slate-300 mb-4 leading-relaxed break-keep">
                      {session.summary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
                        <Monitor className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                        <span className="text-slate-300 font-sans leading-relaxed break-keep">
                          <strong className="text-white font-bold mr-1.5">[화면 분석]</strong>
                          {session.screenAnalysis.headline}
                        </span>
                      </div>
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
                        <Mic className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                        <span className="text-slate-300 font-sans leading-relaxed break-keep">
                          <strong className="text-white font-bold mr-1.5">[음성 분석]</strong>
                          {session.audioAnalysis.headline}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
                    <div className="flex flex-wrap gap-2">
                      {session.techStack.map((t, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono border border-slate-700/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-bold text-white group-hover:text-orange-400 group-hover:translate-x-1 transition-all flex items-center gap-1">
                      상세 보기 <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Info Box */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-400">
            출처: <strong className="text-slate-300">당근(Karrot) 2026 빌더 밋업 | SRE Day</strong> 공식 발표 영상
          </p>
          <p className="text-[11px] text-slate-500">
            모든 요약과 분석은 실제 발표 화면의 슬라이드/아키텍처/코드 및 발표자 발화 내용(트러블슈팅/수치 성과)을 기반으로 정밀하게 구조화되었습니다.
          </p>
        </div>
      </main>

      {/* Multimodal Session Detail Modal */}
      <SessionDetailModal
        session={activeSession}
        initialTab={sessionModalInitialTab}
        onClose={() => setActiveSession(null)}
        onAskQuestion={(session, q) => handleOpenChatWithQuestion(session, q)}
      />

      {/* AI Q&A Drawer */}
      <AiChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        selectedSession={chatSession}
        initialQuestion={chatInitialQuestion}
      />

      {/* Full Report Modal */}
      <FullReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {/* Adoption Playbook Modal */}
      <AdoptionPlaybookModal
        isOpen={isPlaybookOpen}
        onClose={() => setIsPlaybookOpen(false)}
        onOpenChatWithTopic={(topic) => {
          setChatSession(null);
          setChatInitialQuestion(topic);
          setIsChatOpen(true);
        }}
      />

      {/* Custom URL Modal */}
      <CustomUrlModal
        isOpen={isCustomUrlOpen}
        onClose={() => setIsCustomUrlOpen(false)}
      />

      {/* Master Architecture Diagram Modal */}
      <MasterArchitectureDiagram
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
        onSelectSession={(session) => {
          setIsArchitectureOpen(false);
          setActiveSession(session);
        }}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}
