import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText, Code2, Database, Globe, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { SESSIONS_DATA, PLAYLIST_INFO } from '../data/playlistData.ts';
import { downloadStandaloneHtmlReport } from '../utils/exportHtmlHelper.ts';
import { IS_STATIC_SITE } from '../utils/urlHelper.ts';

interface FullReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullReportModal: React.FC<FullReportModalProps> = ({ isOpen, onClose }) => {
  const [viewTab, setViewTab] = useState<'markdown' | 'json'>('markdown');
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [expandedTranscripts, setExpandedTranscripts] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const toggleTranscript = (sessionId: string) => {
    setExpandedTranscripts((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  const handleCopyCodeSnippet = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Complete Raw Data Object
  const rawDataObject = {
    playlist: PLAYLIST_INFO,
    exportedAt: '2026-10-08T01:32:00Z',
    totalSessions: SESSIONS_DATA.length,
    sessions: SESSIONS_DATA,
  };

  const jsonString = JSON.stringify(rawDataObject, null, 2);

  // Generate full markdown report with 100% full content (NO truncation)
  const generateMarkdownReport = () => {
    let md = `# 2026 당근 빌더 밋업 | SRE Day 플레이리스트 화면·음성 요약 리포트\n\n`;
    md += `- **재생목록 URL**: ${PLAYLIST_INFO.youtubeUrl}\n`;
    md += `- **주최/채널**: ${PLAYLIST_INFO.channel}\n`;
    md += `- **행사 일자**: ${PLAYLIST_INFO.eventDate}\n`;
    md += `- **분석 세션 수**: 총 ${PLAYLIST_INFO.totalVideos}개 세션\n\n`;
    md += `---\n\n`;

    SESSIONS_DATA.forEach((s) => {
      md += `## 세션 ${s.index}. ${s.title}\n`;
      md += `- **영상 링크**: https://www.youtube.com/watch?v=${s.videoId}\n`;
      md += `- **발표자**: ${s.speaker} | **카테고리**: ${s.category} | **재생시간**: ${s.duration} | **조회수**: ${s.views}\n\n`;
      md += `### 핵심 요약\n${s.summary}\n\n`;

      md += `### 화면(슬라이드·코드) 분석\n`;
      md += `- **화면 핵심 헤드라인**: ${s.screenAnalysis.headline}\n`;
      md += `- **아키텍처 및 도식 설명**: ${s.screenAnalysis.diagramDescription}\n`;
      if (s.screenAnalysis.codeSnippet) {
        md += `- **핵심 코드/매니페스트 (${s.screenAnalysis.codeSnippet.title})**:\n\`\`\`${s.screenAnalysis.codeSnippet.language}\n${s.screenAnalysis.codeSnippet.code}\n\`\`\`\n`;
      }
      md += `- **화면 주목 지표**:\n`;
      s.screenAnalysis.visualHighlights.forEach((vh) => {
        md += `  * ${vh}\n`;
      });
      md += `\n`;

      md += `### 음성 분석\n`;
      md += `- **발표자 핵심 메시지**: ${s.audioAnalysis.headline}\n`;
      md += `- **도입 배경 및 구두 설명**: ${s.audioAnalysis.spokenContext}\n`;
      md += `- **현장 트러블슈팅과 극복 과정**: ${s.audioAnalysis.troubleshootingStory}\n`;
      md += `- **정량적 개선 성과**:\n`;
      s.audioAnalysis.quantitativeResults.forEach((res) => {
        md += `  * ${res}\n`;
      });
      md += `- **발표자 조언**: "${s.audioAnalysis.speakerAdvice}"\n\n`;

      md += `### 핵심 키워드와 기술 스택\n`;
      md += `${s.techStack.map((t) => `\`${t}\``).join(', ')}\n\n`;

      md += `### 도입 체크리스트\n`;
      s.keyTakeaways.forEach((k, idx) => {
        md += `${idx + 1}. ${k}\n`;
      });
      md += `\n`;

      md += `### 전체 음성 녹취 스크립트\n`;
      s.fullTranscript.forEach((t) => {
        md += `- [${t.time}] **${t.speaker}**: ${t.text}\n`;
      });
      md += `\n---\n\n`;
    });

    return md;
  };

  const reportText = generateMarkdownReport();

  const handleCopyMd = () => {
    navigator.clipboard.writeText(reportText);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownload = () => {
    const isJson = viewTab === 'json';
    const blob = new Blob([isJson ? jsonString : reportText], {
      type: isJson ? 'application/json;charset=utf-8;' : 'text/markdown;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', isJson ? 'daangn_sre_day_raw_data.json' : '2026_당근_SRE_Day_요약_리포트.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">세션 데이터 보기·내보내기</h3>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  생략 없이 전문 출력
                </span>
              </div>
              <p className="text-xs text-slate-400">
                마크다운 리포트, 전체 JSON 원본 데이터{IS_STATIC_SITE ? '' : ', 단일 HTML 오프라인 파일'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!IS_STATIC_SITE && (
              <button
                onClick={downloadStandaloneHtmlReport}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
                title="팀원 공유용 단독 실행 HTML 파일 (더블클릭으로 열람)"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>HTML 파일 다운로드</span>
              </button>
            )}

            {viewTab === 'markdown' ? (
              <button
                onClick={handleCopyMd}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors cursor-pointer"
              >
                {copiedMd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMd ? '복사 완료' : '마크다운 전체 복사'}</span>
              </button>
            ) : (
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors cursor-pointer"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? '복사 완료' : 'JSON 전체 복사'}</span>
              </button>
            )}

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              title="파일로 다운로드"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{viewTab === 'json' ? 'JSON 다운로드' : 'MD 다운로드'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center px-4 sm:px-6 bg-slate-950 border-b border-slate-800 gap-2">
          <button
            onClick={() => setViewTab('markdown')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              viewTab === 'markdown'
                ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>리포트 형식 보기</span>
          </button>

          <button
            onClick={() => setViewTab('json')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              viewTab === 'json'
                ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>전체 JSON 원본 데이터</span>
          </button>
        </div>

        {/* Report Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950/40">
          {viewTab === 'json' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span>총 9개 세션의 화면, 음성, 타임스탬프, 코드 스니펫 원본 JSON 트리</span>
                <span className="text-orange-400 font-mono text-xs font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/30">{SESSIONS_DATA.length} items</span>
              </div>
              <pre className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[65vh] select-all">
                <code>{jsonString}</code>
              </pre>
            </div>
          ) : (
            <>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-200 leading-relaxed space-y-1.5 shadow-md">
                <div className="flex items-center gap-2 font-bold text-white text-base">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>2026 당근 빌더 밋업 SRE Day 9개 세션 전문 리포트</span>
                </div>
                <p className="text-slate-300 text-sm">
                  코드 스니펫, 트러블슈팅 스토리, 음성 녹취 스크립트 등 모든 텍스트가 줄임표(...) 없이 그대로 출력됩니다.
                  {!IS_STATIC_SITE && (
                    <> 상단의 <strong>[HTML 파일 다운로드]</strong>를 누르면 로그인 없이 팀원과 공유 가능한 오프라인 파일을 내려받을 수 있습니다.</>
                  )}
                </p>
              </div>

              <div className="space-y-6">
                {SESSIONS_DATA.map((s) => (
                  <div
                    key={s.id}
                    className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-800 pb-4 gap-2.5">
                      <div>
                        <span className="text-sm font-bold text-orange-400 mr-2.5">[세션 {s.index}]</span>
                        <h4 className="text-lg sm:text-xl font-bold text-white inline">{s.title}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-400 shrink-0">
                        <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold">
                          {s.category}
                        </span>
                        <span className="font-mono text-slate-300">{s.duration}</span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 text-sm sm:text-base text-slate-200 leading-relaxed">
                      <strong className="text-orange-400 block mb-1.5 font-bold">핵심 아키텍처 및 개요:</strong>
                      {s.summary}
                    </div>

                    {/* Dual Screen & Audio Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {/* Screen */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3.5">
                        <div className="text-sm font-bold text-white flex items-center justify-between">
                          <span>슬라이드 화면 분석</span>
                          <span className="text-xs font-mono text-orange-400 bg-orange-950/40 px-2.5 py-1 rounded-md border border-orange-800/60">
                            Slide & Code
                          </span>
                        </div>
                        <div className="text-base font-bold text-slate-100">{s.screenAnalysis.headline}</div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {s.screenAnalysis.diagramDescription}
                        </p>

                        {/* Full Code Snippet (NO Truncation) */}
                        {s.screenAnalysis.codeSnippet && (
                          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 mt-3">
                            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-700 text-xs">
                              <div className="flex items-center gap-2 text-slate-200 font-mono font-semibold">
                                <Code2 className="w-4 h-4 text-orange-400" />
                                <span>{s.screenAnalysis.codeSnippet.title}</span>
                              </div>
                              <button
                                onClick={() => handleCopyCodeSnippet(s.screenAnalysis.codeSnippet!.code, s.id)}
                                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 transition-colors cursor-pointer"
                              >
                                {copiedCodeId === s.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400 font-semibold">복사됨</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>코드 전체 복사</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="p-4 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-80 whitespace-pre">
                              <code>{s.screenAnalysis.codeSnippet.code}</code>
                            </pre>
                          </div>
                        )}

                        {/* Visual Highlights */}
                        <div className="pt-3 border-t border-slate-800 space-y-2">
                          <span className="text-xs font-bold text-slate-300 uppercase block tracking-wider font-mono">주목해야 할 시각 지표:</span>
                          <ul className="space-y-2 text-sm text-slate-200">
                            {s.screenAnalysis.visualHighlights.map((vh, i) => (
                              <li key={i} className="flex items-start gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-orange-400 mt-2 shrink-0" />
                                <span>{vh}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Audio */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3.5">
                        <div className="text-sm font-bold text-white flex items-center justify-between">
                          <span>발표자 음성 인사이트</span>
                          <span className="text-xs font-mono text-orange-400 bg-orange-950/40 px-2.5 py-1 rounded-md border border-orange-800/60">
                            Spoken Context
                          </span>
                        </div>
                        <div className="text-base font-bold text-slate-100">{s.audioAnalysis.headline}</div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {s.audioAnalysis.spokenContext}
                        </p>

                        {/* Full Troubleshooting Story (NO Truncation) */}
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                          <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                            <span>현장 트러블슈팅 스토리</span>
                          </span>
                          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                            {s.audioAnalysis.troubleshootingStory}
                          </p>
                        </div>

                        {/* Speaker Advice */}
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200">
                          <strong className="text-orange-400 block mb-1 font-bold">발표자 조언:</strong>
                          <p className="italic text-slate-100">"{s.audioAnalysis.speakerAdvice}"</p>
                        </div>
                      </div>
                    </div>

                    {/* Key Takeaways */}
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="text-sm font-bold text-white flex flex-wrap items-center justify-between gap-2">
                        <span>도입 체크리스트</span>
                        <div className="flex flex-wrap gap-2">
                          {s.audioAnalysis.quantitativeResults.map((r, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-md bg-slate-900 text-white border border-slate-700 text-xs font-semibold"
                            >
                              ✓ {r}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ol className="space-y-2 text-sm text-slate-200 pl-4 list-decimal">
                        {s.keyTakeaways.map((k, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {k}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Expandable Full Transcript */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
                      <button
                        onClick={() => toggleTranscript(s.id)}
                        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-850 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-orange-400" />
                          <span>전체 음성 녹취 스크립트 ({s.fullTranscript.length}개 발언 구간)</span>
                        </span>
                        {expandedTranscripts[s.id] ? (
                          <span className="flex items-center gap-1 text-orange-400 text-xs">
                            <span>접기</span>
                            <ChevronUp className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-400 text-xs">
                            <span>전체 펼치기</span>
                            <ChevronDown className="w-4 h-4" />
                          </span>
                        )}
                      </button>

                      {expandedTranscripts[s.id] && (
                        <div className="p-5 border-t border-slate-800 max-h-80 overflow-y-auto space-y-3 divide-y divide-slate-800/40">
                          {s.fullTranscript.map((t, idx) => (
                            <div key={idx} className="pt-2.5 first:pt-0 flex gap-3 text-sm">
                              <span className="font-mono text-orange-400 shrink-0 font-bold">[{t.time}]</span>
                              <div className="flex-1">
                                <span className="text-slate-400 font-semibold block text-xs">{t.speaker}</span>
                                <p className="text-slate-200 leading-relaxed">{t.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
