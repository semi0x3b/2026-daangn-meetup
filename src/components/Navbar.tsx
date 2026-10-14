import React from 'react';
import { Sparkles, MessageSquare, FileText, Youtube, Share2, Check, Download } from 'lucide-react';
import { PLAYLIST_INFO, SESSIONS_DATA } from '../data/playlistData.ts';
import { AI_ENABLED, getPublicShareUrl } from '../utils/urlHelper.ts';
import { downloadStandaloneHtmlReport } from '../utils/exportHtmlHelper.ts';

interface NavbarProps {
  onOpenChat: () => void;
  onOpenReport: () => void;
  onOpenPlaybook: () => void;
  onOpenCustomUrl: () => void;
  onOpenShare: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenChat,
  onOpenReport,
  onOpenPlaybook,
  onOpenCustomUrl,
  onOpenShare,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    const publicUrl = getPublicShareUrl();
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    onOpenShare();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 font-black text-xl">
            🥕
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight">당근 SRE Day</span>
              <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                실전 플레이북
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              2026 빌더 밋업 인프라 인사이트 & 우리 팀 실무 적용 가이드
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={downloadStandaloneHtmlReport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/50 rounded-lg shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
            title="9개 세션 통합 오프라인 HTML 파일 다운로드"
          >
            <Download className="w-4 h-4 text-emerald-100" />
            <span className="hidden sm:inline">HTML 다운로드</span>
            <span className="sm:hidden">HTML</span>
          </button>

          <button
            onClick={onOpenPlaybook}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-orange-300 bg-orange-950/40 hover:bg-orange-900/60 border border-orange-700/60 rounded-lg transition-colors cursor-pointer"
            title="우리 인프라에 적용하는 실전 플레이북"
          >
            <span>🛠️ 실무 플레이북</span>
          </button>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors cursor-pointer"
            title="전체 9개 세션 통합 요약 리포트 및 원본 JSON 보기"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">통합 리포트</span>
            <span className="md:hidden">리포트</span>
          </button>

          {AI_ENABLED && (
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 rounded-lg shadow-sm shadow-orange-500/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Q&A</span>
            </button>
          )}

          <a
            href={PLAYLIST_INFO.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          >
            <Youtube className="w-4 h-4 text-red-500" />
            <span>YouTube 재생목록</span>
          </a>

          <button
            onClick={handleShare}
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            title="링크 복사"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
