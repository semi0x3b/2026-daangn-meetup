import React, { useState } from 'react';
import {
  X,
  Layers,
  ArrowRight,
  ExternalLink,
  Cpu,
  ShieldCheck,
  Activity,
  Terminal,
  Database,
  Bot,
  Copy,
  Check,
  Download,
  Sparkles,
  Zap
} from 'lucide-react';
import { SESSIONS_DATA, SessionData } from '../data/playlistData.ts';
import { downloadStandaloneHtmlReport } from '../utils/exportHtmlHelper.ts';
import { IS_STATIC_SITE } from '../utils/urlHelper.ts';

interface MasterArchitectureDiagramProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (session: SessionData) => void;
}

export const MasterArchitectureDiagram: React.FC<MasterArchitectureDiagramProps> = ({
  isOpen,
  onClose,
  onSelectSession,
}) => {
  const [selectedLayer, setSelectedLayer] = useState<string>('all');
  const [copiedAscii, setCopiedAscii] = useState(false);

  if (!isOpen) return null;

  const asciiArchitecture = `
===================================================================================================================
                🥕 2026 당근 SRE Day: 차세대 하이퍼로컬 인프라 전체 아키텍처 토폴로지 (9대 세션 융합)
===================================================================================================================

[1. 개발자 환경 & 배포 오케스트레이션]
 ┌────────────────────────┐      ┌─────────────────────────┐      ┌──────────────────────────────────────────────┐
 │ Developer / AI Agent   │ ───> │ GitHub Actions CI       │ ───> │ 배포 안전 거버넌스 (MCP Server)              │
 │ (Cursor / Claude Code) │      │ • Cache Hit 99.4%       │      │ • 세션 2: 코딩은 AI가, 배포는 MCP+Slack 승인 │
 │                        │      │ • 세션 1: NVMe/BuildKit │      │ • 카나리 10% 자동 메트릭 검증 (SLO)          │
 └────────────────────────┘      └─────────────────────────┘      └──────────────────────────────────────────────┘
              │                                                                     │ (ArgoCD Sync)
              ▼                                                                     ▼
[2. 멀티 클라우드 오케스트레이션 & 가속기 계층]
 ┌───────────────────────────────────────────────────┐    ┌──────────────────────────────────────────────────────┐
 │ AWS EKS 클러스터 (컴퓨팅 최적화)                  │    │ Google Cloud GKE (AI 가속기 클러스터)                │
 │ • 세션 3: Karpenter v1.0 (ASG 45개 제거)          │    │ • 세션 4: TPU v5e Pod Slice 최적화                  │
 │ • Spot 인스턴스 빈패킹 & Graviton(ARM64) 풀       │    │ • KubeRay 주야간 동적 스케줄링 (가동률 82%)          │
 │ • 노드 프로비저닝: 180초 -> 35초 (-80%)           │    │ • GCS 영구 XLA 컴파일 캐시 (콜드스타트 8초)          │
 └───────────────────────────────────────────────────┘    └──────────────────────────────────────────────────────┘
              │                                                                     │
              ▼                                                                     ▼
[3. 스토리지, 캐시 & 저수준 커널 계층]
 ┌───────────────────────────────────────────────────┐    ┌──────────────────────────────────────────────────────┐
 │ 고성능 캐시 인프라 (표준화)                       │    │ 리눅스 커널 심층 모니터링 (eBPF)                     │
 │ • 세션 8: Valkey 8.0 무중단 전환 (다운타임 0초)   │    │ • 세션 6: eBPF kprobe/tracepoint 상시 계측           │
 │ • 레플리카 복제 스트림 롤링 페일오버              │    │ • 간헐적 504 타임아웃 추적 (conntrack/TCP RTT)       │
 │ • 사내 공통 캐시 SDK (지수 백오프/MOVED 핸들링)   │    │ • 사이드카 없는 극소 부하 (CPU 0.3% 미만)            │
 └───────────────────────────────────────────────────┘    └──────────────────────────────────────────────────────┘
              │                                                                     │
              ▼                                                                     ▼
[4. 차세대 AI 관측성 (Observability) 계층]
 ┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
 │ 세션 5: AI 시대의 옵저버빌리티 재설계 (Grafana 800개 대시보드 걷어내기)                                       │
 │ • 원천 텔레메트리(Prometheus/Mimir 메트릭 + Tempo 트레이스 + Loki 로그) -> AI Observability Agent 파이프라인 │
 │ • 실시간 이상 탐지 -> 슬랙 스마트 얼럿 (배포 PR #3412 원인 규명 + 3개 증거 체인 + 롤백 액션 추천)            │
 │ • MTTR(평균 장애 복구 시간): 45분 -> 8분 (-82% 급감)                                                         │
 └───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
              │
              ▼
[5. 엔터프라이즈 보안 & ID 거버넌스]
 ┌───────────────────────────────────────────────────┐    ┌──────────────────────────────────────────────────────┐
 │ GitHub Actions OIDC (Zero Static Keys)            │    │ GitHub Enterprise Managed Users (EMU)                │
 │ • 세션 7: 450개 AWS 장기 정적 키 전수 삭제        │    │ • 세션 9: 개인 계정 초대 방식 영구 폐기             │
 │ • 15분 단기 STS 토큰 자동 발급 (AssumeRole)       │    │ • Okta IdP + SCIM 기반 계정 수명주기 1초 자동화     │
 └───────────────────────────────────────────────────┘    └──────────────────────────────────────────────────────┘
===================================================================================================================
`;

  const handleCopyAscii = () => {
    navigator.clipboard.writeText(asciiArchitecture);
    setCopiedAscii(true);
    setTimeout(() => setCopiedAscii(false), 2000);
  };

  const handleDownloadAscii = () => {
    const blob = new Blob([asciiArchitecture], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'daangn_sre_master_architecture.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 font-black text-xl">
              🗺️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">당근 SRE 차세대 인프라 전체 아키텍처 구성도</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  9대 세션 통합 맵
                </span>
              </div>
              <p className="text-xs text-slate-400">
                개발 환경부터 Kubernetes, GPU/TPU, eBPF, AI 관측성, 제로 트러스트 보안까지 한눈에 보는 종합 시스템 토폴로지
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!IS_STATIC_SITE && (
              <button
                onClick={downloadStandaloneHtmlReport}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer border border-emerald-400/50 shadow-sm"
                title="오프라인 영구 보관용 단일 HTML 다운로드"
              >
                <Download className="w-3.5 h-3.5" />
                <span>HTML 파일 다운로드</span>
              </button>
            )}

            <button
              onClick={handleCopyAscii}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-700"
            >
              {copiedAscii ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAscii ? '복사됨' : 'ASCII 다이어그램 복사'}</span>
            </button>

            <button
              onClick={handleDownloadAscii}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="텍스트 파일로 다운로드"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Layer Filter Pills */}
        {/* Layer Filter Pills */}
        <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-sm">
          <span className="text-slate-400 shrink-0 font-semibold">계층 필터:</span>
          {[
            { id: 'all', label: '전체 5계층 아키텍처 뷰' },
            { id: 'layer-1', label: '1. CI/CD & 배포' },
            { id: 'layer-2', label: '2. EKS & TPU 컴퓨팅' },
            { id: 'layer-3', label: '3. 캐시 & eBPF 커널' },
            { id: 'layer-4', label: '4. AI 옵저버빌리티' },
            { id: 'layer-5', label: '5. 보안 & 계정 거버넌스' },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setSelectedLayer(l.id)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer whitespace-nowrap text-sm ${
                selectedLayer === l.id
                  ? 'bg-orange-600 text-white shadow-sm shadow-orange-500/30'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Interactive Visual Blueprint Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950/60">
          {/* Layer 1: Developer Environment & CI/CD */}
          {(selectedLayer === 'all' || selectedLayer === 'layer-1') && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-xs">
                    L1
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white">개발자 환경 & 배포 오케스트레이션 계층</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-slate-300 font-mono">CI 14분 → 2분 | MCP 배포 안전 가드레일</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Node 1 */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-orange-400" />
                      <span>AI 코딩 & 개발 환경</span>
                    </span>
                    <span className="text-xs bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">Cursor / Claude</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    AI 코딩 도구를 통해 PR 생성 속도 3배 증가. 마이크로서비스 및 프론트엔드 모노레포에 코드 푸시.
                  </p>
                </div>

                {/* Node 2 - Session 1 */}
                <div
                  onClick={() => onSelectSession(SESSIONS_DATA[0])}
                  className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500 transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors flex items-center gap-1.5">
                      <span>[세션 1] 고속 캐시 CI 러너</span>
                    </span>
                    <span className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded font-bold">히트율 99.4%</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    K8s Ephemeral Runner + NVMe 로컬 캐시 데몬 + BuildKit 레지스트리 캐시(mode=max)로 빌드 시간 85% 단축.
                  </p>
                  <div className="text-xs sm:text-sm text-orange-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                    세션 상세 보기 →
                  </div>
                </div>

                {/* Node 3 - Session 2 */}
                <div
                  onClick={() => onSelectSession(SESSIONS_DATA[1])}
                  className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500 transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors flex items-center gap-1.5">
                      <span>[세션 2] 배포 전용 MCP 서버</span>
                    </span>
                    <span className="text-xs bg-slate-900 text-slate-200 border border-slate-700 px-2 py-0.5 rounded font-bold">SLO 가드레일</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    에이전트 쉘 실행 차단. 표준 MCP 툴로 래핑하여 슬랙 Human-in-the-loop + 카나리 10% 메트릭 자동 검증.
                  </p>
                  <div className="text-xs sm:text-sm text-orange-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                    세션 상세 보기 →
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Layer 2: Compute & Accelerator Layer */}
          {(selectedLayer === 'all' || selectedLayer === 'layer-2') && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-xs">
                    L2
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white">멀티 클라우드 오케스트레이션 & AI 가속기 계층</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-slate-300 font-mono">EKS 비용 -28% | TPU 가동률 82%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Node 1 - Session 3 */}
                <div
                  onClick={() => onSelectSession(SESSIONS_DATA[2])}
                  className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500 transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-orange-400" />
                      <span>[세션 3] AWS EKS + Karpenter v1.0</span>
                    </span>
                    <span className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded font-bold">프로비저닝 35초</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    기존 ASG 45개 전면 제거. Spot 우선 정책과 Graviton(ARM64) 유연성 풀, Consolidation으로 클라우드 유휴 리소스 38% → 8% 절감.
                  </p>
                  <div className="text-xs sm:text-sm text-orange-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                    세션 상세 보기 →
                  </div>
                </div>

                {/* Node 2 - Session 4 */}
                <div
                  onClick={() => onSelectSession(SESSIONS_DATA[3])}
                  className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500 transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-400" />
                      <span>[세션 4] GKE + TPU v5e 가속기 풀</span>
                    </span>
                    <span className="text-xs bg-slate-900 text-slate-200 border border-slate-700 px-2 py-0.5 rounded font-bold">가동률 82%</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    KubeRay 기반 주간 실시간 추론(vLLM) ↔ 야간 대규모 임베딩 배치 자동 전환. GCS 영구 XLA 캐시로 콜드 스타트 95% 단축.
                  </p>
                  <div className="text-xs sm:text-sm text-orange-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                    세션 상세 보기 →
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Layer 3: Storage, Caching & Kernel Layer */}
          {(selectedLayer === 'all' || selectedLayer === 'layer-3') && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-xs">
                    L3
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white">데이터 캐시 인프라 & 커널 레벨 분석 계층</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-slate-300 font-mono">다운타임 0초 Valkey | eBPF 0.3% 계측</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Node 1 - Session 8 */}
                <div
                  onClick={() => onSelectSession(SESSIONS_DATA[7])}
                  className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500 transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors flex items-center gap-2">
                      <Database className="w-4 h-4 text-orange-400" />
                      <span>[세션 8] Valkey 8.0 표준 캐시 인프라</span>
                    </span>
                    <span className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded font-bold">QPS +32% 향상</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Redis 라이선스 전환에 대응해 리눅스 재단 Valkey로 무중단 레플리카 복제 페일오버. 사내 공통 캐시 SDK로 재시도 백오프 표준화.
                  </p>
                  <div className="text-xs sm:text-sm text-orange-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                    세션 상세 보기 →
                  </div>
                </div>

                {/* Node 2 - Session 6 */}
                <div
                  onClick={() => onSelectSession(SESSIONS_DATA[5])}
                  className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500 transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors flex items-center gap-2">
                      <Activity className="w-4 h-4 text-orange-400" />
                      <span>[세션 6] eBPF 커널 심층 모니터링</span>
                    </span>
                    <span className="text-xs bg-slate-900 text-slate-200 border border-slate-700 px-2 py-0.5 rounded font-bold">부하 0.3% 미만</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    애플리케이션 APM이 보지 못하는 TCP SYN 재전송 및 conntrack 락 경합을 kprobe 링 버퍼에 기록해 간헐적 504 유령 장애 규명.
                  </p>
                  <div className="text-xs sm:text-sm text-orange-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                    세션 상세 보기 →
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Layer 4: Next-Gen AI Observability */}
          {(selectedLayer === 'all' || selectedLayer === 'layer-4') && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-xs">
                    L4
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white">차세대 AI 옵저버빌리티 & 장애 대응 계층</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-slate-300 font-mono">MTTR 45분 → 8분 (-82%)</span>
                </div>
              </div>

              {/* Node - Session 5 Full Width */}
              <div
                onClick={() => onSelectSession(SESSIONS_DATA[4])}
                className="p-5 sm:p-6 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500 transition-all cursor-pointer group space-y-3.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-base font-bold text-white group-hover:text-orange-400 transition-colors flex items-center gap-2">
                    <Bot className="w-5 h-5 text-orange-400" />
                    <span>[세션 5] Grafana 800개 대시보드 탈피 & AI 에이전트 자율 분석 파이프라인</span>
                  </span>
                  <span className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-md font-bold">
                    최고 인기 세션 (조회수 4,490회)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-sm text-slate-300 pt-1">
                  <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block mb-1.5">1. 원천 텔레메트리 직접 파싱</span>
                    Prometheus/Mimir 시계열 메트릭 + Tempo 분산 트레이스 스팬을 사람이 아닌 에이전트가 자동 수집.
                  </div>
                  <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block mb-1.5">2. 스마트 슬랙 얼럿 발송</span>
                    단순 임계치 알림 대신 "원인(PR 링크) + 3가지 증거 체인 + 권장 롤백 조치"가 완결된 메시지 전달.
                  </div>
                  <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block mb-1.5">3. 자연어 대화형 인터페이스</span>
                    온콜 엔지니어가 "어젯밤 11시 결제 지연 원인 뭐야?" 물으면 5초 만에 상관관계 정밀 진단.
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-orange-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform pt-1">
                  세션 상세 보기 →
                </div>
              </div>
            </div>
          )}

          {/* Layer 5: Enterprise Security & Identity Governance */}
          {(selectedLayer === 'all' || selectedLayer === 'layer-5') && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-xs">
                    L5
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white">엔터프라이즈 보안 & ID 거버넌스 계층</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-slate-300 font-mono">정적 키 0개 | 퇴사 권한 회수 1초</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Node 1 - Session 7 */}
                <div
                  onClick={() => onSelectSession(SESSIONS_DATA[6])}
                  className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500 transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-orange-400" />
                      <span>[세션 7] GitHub Actions OIDC (Zero Static Keys)</span>
                    </span>
                    <span className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded font-bold">AWS 키 450개 전수 제거</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    하드코딩된 AWS IAM Secret Access Key를 전수 삭제하고, GitHub Actions OIDC Provider를 통해 15분 만료 STS 임시 토큰으로 전면 대체.
                  </p>
                  <div className="text-xs sm:text-sm text-orange-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                    세션 상세 보기 →
                  </div>
                </div>

                {/* Node 2 - Session 9 */}
                <div
                  onClick={() => onSelectSession(SESSIONS_DATA[8])}
                  className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500 transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-orange-400" />
                      <span>[세션 9] GitHub EMU 전사 무중단 이관</span>
                    </span>
                    <span className="text-xs bg-slate-900 text-slate-200 border border-slate-700 px-2 py-0.5 rounded font-bold">권한 회수 누락률 0%</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    개인 계정 초대 방식을 폐기하고, Okta SSO + SCIM 프로토콜 연동 회사 관리 계정(EMU)으로 300+명 및 수천 개 레포 무중단 이관.
                  </p>
                  <div className="text-xs sm:text-sm text-orange-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                    세션 상세 보기 →
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
