import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Globe,
  Download,
  FileText,
  Lock,
  Layers,
  HelpCircle
} from 'lucide-react';
import { IS_STATIC_SITE, getPublicShareUrl } from '../utils/urlHelper.ts';
import { SESSIONS_DATA } from '../data/playlistData.ts';
import { downloadStandaloneHtmlReport } from '../utils/exportHtmlHelper.ts';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedSlack, setCopiedSlack] = useState(false);
  const [copiedSessionId, setCopiedSessionId] = useState<string | null>(null);

  if (!isOpen) return null;

  const publicUrl = getPublicShareUrl();

  const slackText = `🥕 [2026 당근 SRE Day 실전 플레이북 & 9대 세션 통합 요약]
대규모 트래픽을 지탱하는 당근 SRE/플랫폼 엔지니어들의 9개 세션 전체 녹취록, 슬라이드 화면 분석, 마스터 아키텍처 토폴로지 대시보드입니다.

🔗 바로가기: ${publicUrl}
• 주요 내용: CI 캐시 99.4%, AI Agent MCP 배포, Karpenter v1.0, TPU 슬라이스 최적화, Grafana 대체 AI 옵저버빌리티, eBPF 커널 계측, OIDC 정적 키 제거, Valkey 8.0 마이그레이션, GitHub EMU`;

  const handleCopyMain = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedMain(true);
    setTimeout(() => setCopiedMain(false), 2000);
  };

  const handleCopySlack = () => {
    navigator.clipboard.writeText(slackText);
    setCopiedSlack(true);
    setTimeout(() => setCopiedSlack(false), 2000);
  };

  const handleCopySession = (sessionTitle: string, index: number) => {
    const sessionShareText = `🥕 [당근 SRE Day 세션 ${index}] ${sessionTitle}\n${publicUrl}`;
    navigator.clipboard.writeText(sessionShareText);
    setCopiedSessionId(`session-${index}`);
    setTimeout(() => setCopiedSessionId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                공유하기 및 팀원 전달
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  100% 열람 보장
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                동료 엔지니어 및 팀원들에게 플레이북과 아키텍처를 공유하는 방법입니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-200 text-sm">
          {/* Solution Box: Why other people cannot open Cloud Run & How to fix */}
          {!IS_STATIC_SITE && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>💡 팀원에게 링크가 안 열릴 때 (Google 계정 보안 권한 해결책)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Google AI Studio의 Cloud Run 웹 주소(<code className="bg-slate-950 px-1 py-0.5 rounded text-cyan-300 font-mono text-[11px]">*.run.app</code>)는 구글 클라우드 조직 권한이 없는 외부 인원이 접근하면 <strong>로그인 요구 화면</strong>이나 <strong>403/404 차단</strong>이 발생할 수 있습니다.
              </p>

              {/* 1-Click Offline Standalone HTML Download */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <strong className="text-xs text-emerald-300 block">가장 확실한 100% 공유 방법:</strong>
                  <span className="text-[11px] text-slate-400">
                    9대 세션 녹취록, 도식화, 분석 전체가 포함된 단일 HTML 파일로 전송
                  </span>
                </div>
                <button
                  onClick={downloadStandaloneHtmlReport}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>단독 HTML 파일 다운로드</span>
                </button>
              </div>
            </div>
          )}

          {/* Primary Share URL Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-orange-400" />
              정식 공개 웹 애플리케이션 링크 (개발용 ais-dev- ➔ 공개형 ais-pre- 자동 변환)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-orange-300 font-mono select-all focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleCopyMain}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-orange-600/30 transition-all cursor-pointer shrink-0"
              >
                {copiedMain ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>복사됨!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>링크 복사</span>
                  </>
                )}
              </button>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors shrink-0"
                title="새 탭에서 직접 열어보기 (접속 테스트)"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[11px] text-slate-500">
              * 동일한 Google Workspace 조직 권한을 가진 팀원은 위 링크로 바로 브라우저에서 접속할 수 있습니다.
            </p>
          </div>

          {/* Slack / Team Messenger Template */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                팀 슬랙/잔디/메신저 공유용 서식
              </label>
              <button
                onClick={handleCopySlack}
                className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                {copiedSlack ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">슬랙 텍스트 복사됨!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>서식 전체 복사</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
              {slackText}
            </div>
          </div>

          {/* Per-session deep links */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              세션별 개별 공유 텍스트
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {SESSIONS_DATA.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors text-xs"
                >
                  <div className="flex-1 mr-2 leading-snug">
                    <span className="text-orange-400 font-bold mr-1.5">[세션 {s.index}]</span>
                    <span className="text-slate-200">{s.title}</span>
                  </div>
                  <button
                    onClick={() => handleCopySession(s.title, s.index)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                  >
                    {copiedSessionId === s.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 text-[11px]">복사됨</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[11px]">복사</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
