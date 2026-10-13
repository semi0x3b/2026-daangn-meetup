import React, { useState } from 'react';
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

  const tracks = [
    {
      id: 'track-1',
      title: '트랙 1. CI/CD & 배포 속도 극대화',
      sessions: '세션 1 (CI 캐시 99%) & 세션 2 (MCP 배포 가드레일)',
      icon: Terminal,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      difficulty: '중간 (1~2주)',
      summary: '개발자 피드백 루프를 1/5로 단축하고 AI 코딩 시대의 배포 병목을 안전하게 해소하는 인프라 구축',
      whatDaangnDid: [
        'K8s Ephemeral Runner에 고속 로컬 NVMe 캐시 스토리지 데몬 구축',
        'pnpm/Turborepo Lock 파일 해시 + 서브패키지 해시 결합 다단계 계층형 캐시 키 적용',
        'Docker BuildKit의 --cache-to=type=registry,mode=max 원격 레이어 캐싱',
        'Cursor/Claude Code 에이전트용 사내 배포 MCP 서버 구축 (Read는 자율화, Write는 슬랙 Human-in-the-loop + 카나리 SLO 승인)'
      ],
      howToAdopt: [
        {
          phase: 'Step 1: 캐시 히트율 계측 & 키 구조 분리',
          action: 'GitHub Actions 캐시 키에 단순 브랜치명 대신 lockfile 해시와 restore-keys 계층(폴백)을 구성하고, 타임스탬프 불일치로 인한 캐시 버스팅을 제거합니다.',
          code: `name: High-Speed Cache Pipeline
steps:
  - uses: actions/checkout@v4
  - uses: actions/cache@v4
    with:
      path: ~/.pnpm-store
      key: \${{ runner.os }}-pnpm-\${{ hashFiles('**/pnpm-lock.yaml') }}
      restore-keys: \${{ runner.os }}-pnpm-`
        },
        {
          phase: 'Step 2: Docker BuildKit 레지스트리 캐시 도입',
          action: 'CI 워크플로우 빌드 단계에서 BuildKit inline/registry 캐시를 활성화하여 변경되지 않은 도커 레이어를 매번 빌드하지 않도록 설정합니다.',
          code: `docker buildx build \\
  --cache-from=type=registry,ref=myregistry.io/app:cache \\
  --cache-to=type=registry,ref=myregistry.io/app:cache,mode=max \\
  --push -t myregistry.io/app:\${{ github.sha }} .`
        },
        {
          phase: 'Step 3: 배포 전용 MCP 서버 및 안전 가드레일',
          action: 'AI 코딩 도구에 kubectl 쉘 권한을 직접 주지 않고, 카나리 10% 배포 및 실시간 에러율 조회 툴만 노출하는 경량 TypeScript MCP 서버를 띄웁니다.'
        }
      ]
    },
    {
      id: 'track-2',
      title: '트랙 2. Kubernetes 컴퓨팅 & 가속기 최적화',
      sessions: '세션 3 (Karpenter EKS 비용 절감) & 세션 4 (TPU/GPU 가동률 극대화)',
      icon: Cpu,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      difficulty: '중상 (2~3주)',
      summary: 'ASG 종속성을 끊고 즉각적인 인스턴스 빈패킹으로 클라우드 인프라 비용 25~30% 절감',
      whatDaangnDid: [
        '기존 Cluster Autoscaler(CAS)의 복잡한 ASG 45개 전면 제거',
        'Karpenter v1.0 도입으로 프로비저닝 시간 180초 → 35초 단축',
        'Spot 인스턴스 우선 정책 + c6g/m6g Graviton(ARM64) 유연성 확보',
        'Consolidation(노드 통합) 정책으로 클라우드 유휴 리소스 38% → 8%로 최소화',
        '주간 실시간 추론과 야간 배치(임베딩)를 동적으로 전환하는 KubeRay 스케줄러로 가속기 가동률 82% 달성'
      ],
      howToAdopt: [
        {
          phase: 'Step 1: PDB(Pod Disruption Budget) 및 멀티 아키텍처 사전 점검',
          action: 'Karpenter의 노드 통합 기능이 정상 작동하려면 서비스 파드에 PDB가 올바르게 설정되어 있어야 합니다. 컨테이너 이미지를 arm64/amd64 멀티 플랫폼으로 빌드합니다.'
        },
        {
          phase: 'Step 2: Karpenter NodePool 배포',
          action: '단일 인스턴스 타입을 지정하지 말고, 다양한 패밀리와 Graviton을 풀로 지정하여 Spot 재고 부족을 방지합니다.',
          code: `apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: default-pool
spec:
  template:
    spec:
      requirements:
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot", "on-demand"]
        - key: kubernetes.io/arch
          operator: In
          values: ["arm64", "amd64"]
  disruption:
    consolidationPolicy: WhenEmptyOrUnderutilized
    consolidateAfter: 1m`
        },
        {
          phase: 'Step 3: 주야간 하이브리드 가속기 전환',
          action: '새벽 저트래픽 시간대에는 온라인 추론 파드 레플리카를 줄이고, Ray/KubeRay를 통해 오프라인 배치 잡을 실행하도록 K8s HPA/CronJob을 조율합니다.'
        }
      ]
    },
    {
      id: 'track-3',
      title: '트랙 3. 차세대 관측성(Observability) & eBPF',
      sessions: '세션 5 (Grafana 걷어낸 에이전트 얼럿) & 세션 6 (eBPF 커널 계측)',
      icon: Layers,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      difficulty: '중간 (1~2주)',
      summary: '800개 대시보드의 알림 피로도를 없애고, 지나간 간헐적 유령 장애 원인을 0.3% 오버헤드로 추적',
      whatDaangnDid: [
        '단순 CPU/메모리 임계치 알림을 대폭 줄이고 OpenTelemetry 트레이스 기반 상관관계 분석으로 전환',
        'LLM 에이전트가 장애 발생 시 "원인(PR 링크) + 3가지 증거 + 롤백 명령"을 완성해 슬랙으로 발송 (MTTR 45분 → 8분)',
        '애플리케이션 APM이 보지 못하는 커널 TCP 재전송 및 conntrack 고갈을 eBPF 링 버퍼에 상시 기록하여 간헐적 504 장애 원인 규명'
      ],
      howToAdopt: [
        {
          phase: 'Step 1: 알림 다이어트 & 사용자 중심 SLO 전환',
          action: '단순한 노드 CPU > 90% 같은 노이즈 알림을 정리하고, 실제 유저 지연 시간(P99) 및 5xx 에러율 기준의 핵심 SLO 알림만 남깁니다.'
        },
        {
          phase: 'Step 2: 알림 웹훅에 배포 Git 커밋 및 OTel Trace 링크 자동 결합',
          action: 'Alertmanager 웹훅 수신 시 최근 30분간 배포된 서비스의 Git Commit diff와 Tempo/Jaeger 분산 트레이스 에러 스팬을 수집해 LLM에 컨텍스트로 전달합니다.'
        },
        {
          phase: 'Step 3: eBPF 모니터링 도구(Coroot, Cilium Hubble) 클러스터 배포',
          action: '사이드카 없이 커널 TCP RTT와 SYN 재전송, 소켓 드롭을 캡처하는 eBPF 에이전트를 데몬셋으로 설치하여 간헐적 통신 장애를 추적합니다.'
        }
      ]
    },
    {
      id: 'track-4',
      title: '트랙 4. 보안, 스토리지 & 엔터프라이즈 거버넌스',
      sessions: '세션 7 (OIDC 키 제거), 세션 8 (Valkey 전환), 세션 9 (GitHub EMU 이관)',
      icon: ShieldCheck,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      difficulty: '낮음~중간 (즉시 적용 가능)',
      summary: 'AWS 정적 키 100% 제거, 오픈소스 Valkey 8.0 무중단 표준화, 사내 IdP 계정 수명주기 자동화',
      whatDaangnDid: [
        '450개 레포지토리의 하드코딩된 AWS IAM Access Key 전수 삭제 후 15분 단기 OIDC STS 토큰으로 대체',
        'Redis 라이선스 전환 시점에 다운타임 0초로 Valkey 8.0 롤링 마이그레이션 및 사내 공통 캐시 SDK 표준화',
        '개인 GitHub 계정 초대 방식을 폐기하고 Okta SSO + SCIM 기반 GitHub EMU로 300+명 무중단 이관'
      ],
      howToAdopt: [
        {
          phase: 'Step 1: [당일 즉시 적용] GitHub Actions OIDC 연결',
          action: 'AWS IAM에 GitHub OIDC Provider를 등록하고, 레포지토리 main 브랜치만 허용하는 Trust Policy를 작성합니다. (영구 키 즉시 삭제 가능)',
          code: `name: Deploy with OIDC
permissions:
  id-token: write
  contents: read
steps:
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::123456789012:role/github-actions-deploy
      aws-region: ap-northeast-2`
        },
        {
          phase: 'Step 2: Valkey 8.0 레플리카 연결 후 무중단 페일오버',
          action: '기존 Redis 마스터에 Valkey 노드를 레플리카로 붙여 실시간 복제를 검증한 뒤, 페일오버를 실행하여 애플리케이션 접속 주소를 교체합니다. (다운타임 0초)'
        },
        {
          phase: 'Step 3: 계정 수명주기 자동화(EMU/SSO) 감사',
          action: 'CI/CD에 숨겨진 개인 PAT(Personal Access Token)를 찾아 GitHub App 인증으로 전환하고, 퇴사 시 1초 만에 권한이 회수되는 SCIM 체계를 준비합니다.'
        }
      ]
    }
  ];

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
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Track Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-950 border-b border-slate-800 divide-x divide-slate-800/80 text-xs font-semibold">
          {tracks.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTrack(t.id)}
              className={`p-3 text-left transition-colors cursor-pointer flex flex-col gap-1 ${
                activeTrack === t.id
                  ? 'bg-slate-900 text-orange-400 border-b-2 border-orange-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <span className="truncate">{t.title.split('. ')[1]}</span>
              <span className="text-[10px] text-slate-500 truncate">{t.difficulty}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950/30">
          {/* Track Summary Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${currentTrack.color}`}>
                  {currentTrack.title}
                </span>
                <span className="text-xs text-slate-400">난이도: <strong className="text-slate-300">{currentTrack.difficulty}</strong></span>
              </div>
              <span className="text-xs text-slate-500">{currentTrack.sessions}</span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              {currentTrack.summary}
            </p>
          </div>

          {/* Section: What Daangn SRE Did */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>당근 SRE 팀이 현장에서 실제로 구축한 것들 (What They Did)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentTrack.whatDaangnDid.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Step-by-Step How We Can Adopt */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              <span>우리가 따라할 수 있는 단계별 실행 가이드 (How We Can Adopt)</span>
            </h4>

            {currentTrack.howToAdopt.map((step, idx) => (
              <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <span className="w-6 h-6 rounded-full bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                  <span>{step.phase}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-8">
                  {step.action}
                </p>

                {step.code && (
                  <div className="ml-8 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 text-[11px] text-slate-400 border-b border-slate-800">
                      <span>적용 설정 스니펫</span>
                      <button
                        onClick={() => handleCopyCode(`${activeTrack}-${idx}`, step.code!)}
                        className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedStep === `${activeTrack}-${idx}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedStep === `${activeTrack}-${idx}` ? '복사됨' : '복사'}</span>
                      </button>
                    </div>
                    <pre className="p-3 text-xs font-mono text-cyan-300/90 overflow-x-auto leading-relaxed">
                      <code>{step.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Ask AI button for this track */}
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
        </div>
      </div>
    </div>
  );
};
