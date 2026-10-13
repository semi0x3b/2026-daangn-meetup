import React from 'react';
import { Play, Monitor, Mic, Clock, Eye, Sparkles, ChevronRight, ExternalLink, Layers } from 'lucide-react';
import { SessionData } from '../data/playlistData.ts';

interface SessionCardProps {
  session: SessionData;
  onSelect: (session: SessionData) => void;
  onSelectArchitecture?: (session: SessionData) => void;
  onQuickAsk: (session: SessionData, question: string) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onSelect, onSelectArchitecture, onQuickAsk }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CI/CD & 빌드':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'AI & 배포':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/30';
      case 'Kubernetes & 인프라':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'AI 인프라':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case '옵저버빌리티':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case '커널 & 네트워크':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case '보안 & 거버넌스':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case '데이터 & 캐시':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all duration-200 overflow-hidden shadow-lg shadow-black/20 hover:shadow-orange-500/5">
      {/* Top Banner with Thumbnail & Duration */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={`https://img.youtube.com/vi/${session.videoId}/hqdefault.jpg`}
          alt={session.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        {/* Index Badge */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white font-bold text-xs px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5 shadow-md">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span>세션 {session.index}</span>
        </div>

        {/* Category & Duration */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-md ${getCategoryColor(session.category)}`}>
            {session.category}
          </span>
        </div>

        {/* Duration & Views */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 text-[11px] font-medium text-slate-300 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{session.duration}</span>
          <span className="text-slate-600">|</span>
          <Eye className="w-3 h-3 text-slate-400" />
          <span>{session.views}</span>
        </div>

        {/* Play Overlay Button */}
        <button
          onClick={() => onSelect(session)}
          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-orange-600/90 hover:bg-orange-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-orange-500/30 transform group-hover:scale-110 duration-200 cursor-pointer"
          aria-label="세션 상세 및 영상 재생"
        >
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onSelect(session)}
            className="text-base font-bold text-white hover:text-orange-400 transition-colors line-clamp-2 cursor-pointer mb-2.5 leading-snug"
          >
            {session.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {session.summary}
          </p>

          {/* Multimodal Screen & Audio Quick Previews */}
          <div className="space-y-2 mb-4">
            {/* Screen / Visual Highlight */}
            <div className="flex items-start gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <Monitor className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold text-cyan-300 mr-1.5">[화면]</span>
                <span className="text-slate-300 line-clamp-1">{session.screenAnalysis.headline}</span>
              </div>
            </div>

            {/* Audio / Speech Highlight */}
            <div className="flex items-start gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <Mic className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold text-amber-300 mr-1.5">[음성]</span>
                <span className="text-slate-300 line-clamp-1">{session.audioAnalysis.headline}</span>
              </div>
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {session.techStack.slice(0, 3).map((tech, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 font-mono border border-slate-700/60"
              >
                {tech}
              </span>
            ))}
            {session.techStack.length > 3 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-800/40 text-slate-400">
                +{session.techStack.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={() => onSelectArchitecture ? onSelectArchitecture(session) : onSelect(session)}
            className="flex items-center gap-1.5 py-2 px-2.5 text-xs font-semibold text-orange-400 bg-orange-950/30 hover:bg-orange-900/50 border border-orange-800/40 rounded-lg transition-colors cursor-pointer"
            title="이 세션의 시스템 아키텍처 및 플로우 도식화 보기"
          >
            <Layers className="w-3.5 h-3.5 text-orange-400" />
            <span>📐 아키텍처 도식</span>
          </button>

          <button
            onClick={() => onSelect(session)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <span>상세 분석</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onQuickAsk(session, session.recommendedQuestions[0])}
            className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="이 세션에 대해 AI에게 물어보기"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
