import React from 'react';
import { Play, Monitor, Mic, Clock, Eye, Sparkles, ChevronRight, ExternalLink, Layers } from 'lucide-react';
import { SessionData } from '../data/playlistData.ts';
import { AI_ENABLED } from '../utils/urlHelper.ts';

interface SessionCardProps {
  session: SessionData;
  onSelect: (session: SessionData) => void;
  onSelectArchitecture?: (session: SessionData) => void;
  onQuickAsk: (session: SessionData, question: string) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onSelect, onSelectArchitecture, onQuickAsk }) => {
  return (
    <div className="group relative flex flex-col rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 overflow-hidden shadow-lg shadow-black/20">
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
        <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md text-white font-bold text-xs sm:text-sm px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-2 shadow-md">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span>세션 {session.index}</span>
        </div>

        {/* Category */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-slate-900/90 text-slate-200 border-slate-700 backdrop-blur-md shadow-sm">
            {session.category}
          </span>
        </div>

        {/* Duration & Views */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs font-medium text-slate-200 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{session.duration}</span>
          <span className="text-slate-600">|</span>
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>{session.views}</span>
        </div>

        {/* Play Overlay Button */}
        <button
          onClick={() => onSelect(session)}
          className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-orange-600/90 hover:bg-orange-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xl shadow-orange-500/30 transform group-hover:scale-110 duration-200 cursor-pointer"
          aria-label="세션 상세 및 영상 재생"
        >
          <Play className="w-6 h-6 fill-current ml-0.5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onSelect(session)}
            className="text-lg font-bold text-white hover:text-orange-400 transition-colors cursor-pointer mb-2.5 leading-snug break-keep"
          >
            {session.title}
          </h3>

          <p className="text-sm text-slate-300 mb-4 leading-relaxed break-keep">
            {session.summary}
          </p>

          {/* Multimodal Screen & Audio Previews (High-contrast, Large text) */}
          <div className="space-y-2.5 mb-5">
            {/* Screen / Visual Highlight */}
            <div className="flex items-start gap-2.5 text-sm bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <Monitor className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-white mr-1.5">[화면 분석]</span>
                <span className="text-slate-300 leading-relaxed break-keep">{session.screenAnalysis.headline}</span>
              </div>
            </div>

            {/* Audio / Speech Highlight */}
            <div className="flex items-start gap-2.5 text-sm bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <Mic className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-white mr-1.5">[음성 분석]</span>
                <span className="text-slate-300 leading-relaxed break-keep">{session.audioAnalysis.headline}</span>
              </div>
            </div>
          </div>

          {/* Tech Stack Pills (Clear, legible font) */}
          <div className="flex flex-wrap gap-2 mb-5">
            {session.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono border border-slate-700/70"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => onSelectArchitecture ? onSelectArchitecture(session) : onSelect(session)}
            className="flex items-center gap-1.5 py-2.5 px-3 text-sm font-semibold text-orange-400 bg-orange-950/30 hover:bg-orange-900/50 border border-orange-800/50 rounded-xl transition-colors cursor-pointer"
            title="이 세션의 시스템 아키텍처 및 플로우 도식화 보기"
          >
            <Layers className="w-4 h-4 text-orange-400" />
            <span>📐 아키텍처 도식</span>
          </button>

          <button
            onClick={() => onSelect(session)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <span>상세 분석 보기</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {AI_ENABLED && (
            <button
              onClick={() => onQuickAsk(session, session.recommendedQuestions[0])}
              className="p-2.5 text-slate-400 hover:text-orange-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-700"
              title="이 세션에 대해 AI에게 물어보기"
            >
              <Sparkles className="w-4 h-4 text-orange-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
