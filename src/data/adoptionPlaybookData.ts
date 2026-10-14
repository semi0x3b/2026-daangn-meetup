export interface PlaybookStep {
  phase: string;
  action: string;
  code?: string;
}

export interface PlaybookTrack {
  id: string;
  title: string;
  shortTitle: string;
  sessions: string;
  iconName: string;
  color?: string;
  difficulty: string;
  summary: string;
  whatDaangnDid: string[];
  howToAdopt: PlaybookStep[];
}

export interface MetricComparison {
  sessionId: string;
  sessionIndex: number;
  sessionTitle: string;
  metricName: string;
  before: string;
  after: string;
  improvement: string;
  keyTech: string;
}

export interface FaqItem {
  id: string;
  question: string;
  category: string;
  answer: string;
  relatedSession: string;
}

export const ADOPTION_TRACKS: PlaybookTrack[] = [
  {
    id: 'track-1',
    title: '트랙 1. CI/CD & 배포 속도 극대화',
    shortTitle: 'CI/CD 속도 & MCP 배포',
    sessions: '세션 1 (CI 캐시 99.4%) & 세션 2 (MCP 배포 가드레일)',
    iconName: 'Terminal',
    difficulty: '중간 (1~2주)',
    summary: '개발자 피드백 루프를 1/5로 단축하고 AI 코딩 시대의 배포 병목을 안전하게 해소하는 엔지니어링 파이프라인 구축',
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
        action: 'AI 코딩 도구에 kubectl 쉘 권한을 직접 주지 않고, 카나리 10% 배포 및 실시간 에러율 조회 툴만 노출하는 경량 TypeScript MCP 서버를 띄웁니다.',
        code: `// MCP Server Deployment Guardrail Tool
export const deployCanaryTool = {
  name: "deploy_canary",
  description: "안전 가드레일이 적용된 카나리 10% 배포 실행 도구",
  inputSchema: {
    type: "object",
    properties: {
      service: { type: "string" },
      imageTag: { type: "string" },
      canaryWeight: { type: "number", default: 10 }
    },
    required: ["service", "imageTag"]
  }
};`
      }
    ]
  },
  {
    id: 'track-2',
    title: '트랙 2. Kubernetes 컴퓨팅 & 가속기 최적화',
    shortTitle: 'K8s Karpenter & TPU/GPU',
    sessions: '세션 3 (Karpenter EKS 비용 절감) & 세션 4 (TPU/GPU 가동률 극대화)',
    iconName: 'Cpu',
    difficulty: '중상 (2~3주)',
    summary: 'ASG 종속성을 끊고 즉각적인 인스턴스 빈패킹으로 클라우드 인프라 비용 25~30% 절감 및 가속기 가동률 82% 달성',
    whatDaangnDid: [
      '기존 Cluster Autoscaler(CAS)의 복잡한 ASG 45개 전면 제거',
      'Karpenter v1.0 도입으로 프로비저닝 시간 180초 → 35초 단축',
      'Spot 인스턴스 우선 정책 + c6g/m6g Graviton(ARM64) 유연성 풀 확보',
      'Consolidation(노드 통합) 정책으로 클라우드 유휴 리소스 38% → 8%로 최소화',
      '주간 실시간 추론과 야간 배치(임베딩)를 동적으로 전환하는 KubeRay 스케줄러로 가속기 가동률 82% 달성'
    ],
    howToAdopt: [
      {
        phase: 'Step 1: PDB(Pod Disruption Budget) 및 멀티 아키텍처 사전 점검',
        action: 'Karpenter의 노드 통합 기능이 정상 작동하려면 서비스 파드에 PDB가 올바르게 설정되어 있어야 합니다. 컨테이너 이미지를 arm64/amd64 멀티 플랫폼으로 빌드합니다.',
        code: `apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: core-api-pdb
spec:
  minAvailable: 80%
  selector:
    matchLabels:
      app: core-api`
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
        action: '새벽 저트래픽 시간대에는 온라인 추론 파드 레플리카를 줄이고, Ray/KubeRay를 통해 오프라인 배치 잡을 실행하도록 K8s HPA/CronJob을 조율합니다.',
        code: `export JAX_COMPILATION_CACHE_DIR="/mnt/gcs-cache"
export XLA_FLAGS="--xla_gpu_enable_latency_hiding_scheduler=true"
# 영구 볼륨 캐시 마운트로 콜드 스타트 12분 -> 40초 단축`
      }
    ]
  },
  {
    id: 'track-3',
    title: '트랙 3. 관측성과 eBPF',
    shortTitle: 'AI 옵저버빌리티 & eBPF',
    sessions: '세션 5 (Grafana 걷어낸 에이전트 얼럿) & 세션 6 (eBPF 커널 계측)',
    iconName: 'Layers',
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
        action: '단순한 노드 CPU > 90% 같은 노이즈 알림을 정리하고, 실제 유저 지연 시간(P99) 및 5xx 에러율 기준의 핵심 SLO 알림만 남깁니다.',
        code: `groups:
- name: user-slo-alerts
  rules:
  - alert: HighErrorRateSLO
    expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.01
    for: 2m
    labels:
      severity: critical`
      },
      {
        phase: 'Step 2: 알림 웹훅에 배포 Git 커밋 및 OTel Trace 링크 자동 결합',
        action: 'Alertmanager 웹훅 수신 시 최근 30분간 배포된 서비스의 Git Commit diff와 Tempo/Jaeger 분산 트레이스 에러 스팬을 수집해 LLM에 컨텍스트로 전달합니다.',
        code: `// Alert Correlation Payload
const aiContext = {
  alertName: alert.labels.alertname,
  impactedService: alert.labels.service,
  recentCommits: await github.getRecentCommits(service, '30m'),
  errorTraceSpans: await otel.getErrorSpans(traceId)
};`
      },
      {
        phase: 'Step 3: eBPF 모니터링 도구(Coroot, Cilium Hubble) 클러스터 배포',
        action: '사이드카 없이 커널 TCP RTT와 SYN 재전송, 소켓 드롭을 캡처하는 eBPF 에이전트를 데몬셋으로 설치하여 간헐적 통신 장애를 추적합니다.',
        code: `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: ebpf-kernel-tracer
spec:
  template:
    spec:
      hostNetwork: true
      containers:
        - name: tracer
          securityContext:
            privileged: true`
      }
    ]
  },
  {
    id: 'track-4',
    title: '트랙 4. 보안, 스토리지 & 엔터프라이즈 거버넌스',
    shortTitle: 'OIDC 보안 & Valkey & EMU',
    sessions: '세션 7 (OIDC 키 제거), 세션 8 (Valkey 전환), 세션 9 (GitHub EMU 이관)',
    iconName: 'ShieldCheck',
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
        action: '기존 Redis 마스터에 Valkey 노드를 레플리카로 붙여 실시간 복제를 검증한 뒤, 페일오버를 실행하여 애플리케이션 접속 주소를 교체합니다. (다운타임 0초)',
        code: `# Valkey Replica Setup & Zero-Downtime Failover
valkey-cli -h valkey-node-01 REPLICAOF redis-master-prod 6379
# 복제 지연 0 확인 후 승격
valkey-cli -h valkey-node-01 REPLICAOF NO ONE`
      },
      {
        phase: 'Step 3: 계정 수명주기 자동화(EMU/SSO) 감사',
        action: 'CI/CD에 숨겨진 개인 PAT(Personal Access Token)를 찾아 GitHub App 인증으로 전환하고, 퇴사 시 1초 만에 권한이 회수되는 SCIM 체계를 준비합니다.',
        code: `# GitHub EMU SCIM Provisioning Check
# Enterprise IdP(Okta/Azure AD)와 동기화되어 즉각적인 계정 라이프사이클 관리 실현`
      }
    ]
  }
];

export const QUANTITATIVE_METRICS: MetricComparison[] = [
  {
    sessionId: 'session-1',
    sessionIndex: 1,
    sessionTitle: '초고속 CI 캐싱 파이프라인',
    metricName: 'CI 빌드 시간',
    before: '14분 12초',
    after: '2분 08초',
    improvement: '-85% 단축 (캐시 히트율 99.4%)',
    keyTech: 'K8s Ephemeral Runner, NVMe 캐시 데몬, BuildKit'
  },
  {
    sessionId: 'session-2',
    sessionIndex: 2,
    sessionTitle: 'MCP 기반 AI 코딩 배포 가드레일',
    metricName: '배포 소요 시간 및 사고율',
    before: '12분 (수동 승인)',
    after: '3분 (자동 SLO 가드레일)',
    improvement: '-75% 단축, 배포 장애 0건 유지',
    keyTech: 'Model Context Protocol(MCP), 카나리 10%, Slack Approval'
  },
  {
    sessionId: 'session-3',
    sessionIndex: 3,
    sessionTitle: 'Karpenter 기반 EKS 대규모 비용 절감',
    metricName: '노드 프로비저닝 속도 & 클라우드 비용',
    before: '180초 (ASG 45개)',
    after: '35초 (단일 NodePool)',
    improvement: '속도 -80% 단축, EKS 비용 -28% 절감',
    keyTech: 'Karpenter v1.0, Spot 빈패킹, Graviton(ARM64)'
  },
  {
    sessionId: 'session-4',
    sessionIndex: 4,
    sessionTitle: 'TPU v5e 동적 파티셔닝 & AI 추론 최적화',
    metricName: '가속기 자원 가동률 (Utilization)',
    before: '38% (단일 고정 할당)',
    after: '82% (주간 추론 ↔ 야간 배치)',
    improvement: '+115% 효율 향상, 콜드스타트 12분→40초',
    keyTech: 'GKE Cloud TPU v5e, KubeRay, GCS 영구 XLA 캐시'
  },
  {
    sessionId: 'session-5',
    sessionIndex: 5,
    sessionTitle: 'Grafana 대시보드 없는 AI 에이전트 장애 분석',
    metricName: '평균 장애 인지 및 복구 시간 (MTTR)',
    before: '45분 (800개 대시보드 수동 조사)',
    after: '8분 (LLM 에이전트 자동 원인 규명)',
    improvement: 'MTTR -82% 급감, 불필요 알림 -65%',
    keyTech: 'Mimir/Tempo/Loki 파싱, Slack AI Alert, OTel Trace'
  },
  {
    sessionId: 'session-6',
    sessionIndex: 6,
    sessionTitle: 'eBPF 커널 레벨 네트워크 심층 모니터링',
    metricName: '간헐적 504 통신 장애 규명률 & 계측 오버헤드',
    before: '규명 불가 (APM 암전)',
    after: '원인 100% 규명 (TCP 재전송/conntrack)',
    improvement: 'CPU 오버헤드 0.3% 미만 상시 추적',
    keyTech: 'Linux eBPF kprobe/tracepoint, 링 버퍼, Hubble'
  },
  {
    sessionId: 'session-7',
    sessionIndex: 7,
    sessionTitle: 'GitHub Actions OIDC 기반 제로 시크릿 전환',
    metricName: 'AWS 영구 IAM 정적 시크릿 키 개수',
    before: '450개 레포 하드코딩 키',
    after: '0개 (완전 제거)',
    improvement: '보안 누출 리스크 100% 원천 차단',
    keyTech: 'GitHub OIDC IdP, AWS STS AssumeRoleWithWebIdentity (15분)'
  },
  {
    sessionId: 'session-8',
    sessionIndex: 8,
    sessionTitle: 'Redis 라이선스 변경 대응 Valkey 8.0 무중단 전환',
    metricName: '마이그레이션 다운타임 & 캐시 처리량',
    before: '점검 다운타임 필요 (수 분)',
    after: '0초 다운타임 (무중단 페일오버)',
    improvement: 'QPS +32% 향상, 라이선스 리스크 0%',
    keyTech: 'Valkey 8.0 레플리카 롤링 복제, 사내 공통 캐시 SDK'
  },
  {
    sessionId: 'session-9',
    sessionIndex: 9,
    sessionTitle: 'GitHub Enterprise Managed Users(EMU) 전사 이관',
    metricName: '퇴사자 권한 회수 소요 시간 & 누락률',
    before: '수동 회수 (누락 위험 존재)',
    after: '1초 미만 (IdP SCIM 자동 회수)',
    improvement: '고스트 계정 0개, 300+명/수천 개 레포 안전 이관',
    keyTech: 'Okta SSO, SCIM 계정 수명주기, GitHub EMU'
  }
];

export const FAQ_KNOWLEDGE_BASE: FaqItem[] = [
  {
    id: 'faq-1',
    category: '옵저버빌리티 & AI',
    question: 'Grafana 800개 대시보드를 걷어내고 에이전트 얼럿으로 전환한 핵심 아키텍처는 무엇인가요?',
    relatedSession: '세션 5',
    answer: '대시보드가 너무 많아지면 엔지니어들이 지표를 일일이 대조하느라 정작 원인 파악에 45분 이상 소요됩니다. 당근은 사람이 대시보드를 보는 대신, Alertmanager 웹훅이 발송되는 순간 백그라운드 워커가 Mimir 메트릭, Tempo 분산 트레이스, 최근 배포된 Git 커밋 diff를 자동으로 수집해 LLM 컨텍스트에 투입하도록 설계했습니다. LLM은 "원인 PR 링크, 에러 스팬 3가지 증거, 롤백 명령어"를 단일 슬랙 메시지로 요약 발송하여 MTTR을 8분으로 단축했습니다.'
  },
  {
    id: 'faq-2',
    category: 'Kubernetes & 비용',
    question: 'Karpenter 도입 시 ASG를 없애고 Spot 인스턴스를 안전하게 운영하는 비결은?',
    relatedSession: '세션 3',
    answer: 'Karpenter NodePool 요구조건에 단일 인스턴스 타입(예: c5.xlarge)만 지정하지 않고, c6g, c6i, m6g, m6i 등 다양한 패밀리와 Graviton(ARM64)을 포괄적으로 등록합니다. 이렇게 하면 AWS 한 가용영역에서 특정 Spot 재고가 고갈되어도 다른 인스턴스 타입으로 35초 만에 우회 바인딩됩니다. 또한 각 애플리케이션에 PodDisruptionBudget(PDB)을 minAvailable: 80%로 설정하여 Node Consolidation(노드 통합) 중에도 서비스 중단이 발생하지 않도록 가드레일을 둡니다.'
  },
  {
    id: 'faq-3',
    category: 'CI/CD & 빌드',
    question: 'CI 캐시 히트율을 99.4%까지 끌어올린 계층형 캐시 키 설계 방법은?',
    relatedSession: '세션 1',
    answer: '단순히 브랜치명을 캐시 키로 쓰면 커밋마다 캐시가 무효화됩니다. 당근은 패키지 매니저의 글로벌 lockfile 해시(pnpm-lock.yaml)와 각 서브 프로젝트의 소스 해시를 조합한 다단계 계층 키를 적용했습니다. 또한 K8s Ephemeral Runner 노드 자체에 로컬 NVMe 캐시 데몬을 배치하여 네트워크 왕복 다운로드 시간 없이 로컬 디스크 속도로 캐시를 복원합니다. Docker 빌드는 BuildKit의 --cache-to=type=registry,mode=max 원격 레이어 캐싱을 결합했습니다.'
  },
  {
    id: 'faq-4',
    category: '네트워크 & 커널',
    question: 'APM으로 잡히지 않는 간헐적 504 에러를 eBPF로 어떻게 찾아냈나요?',
    relatedSession: '세션 6',
    answer: 'Datadog이나 일반 APM은 사용자 프로세스 내부에서 HTTP 요청과 응답을 계측하므로, 커널 레벨에서 발생하는 패킷 유실이나 TCP 연결 지연을 알지 못합니다. 당근은 Linux eBPF kprobe를 통해 tcp_retransmit_skb와 nf_conntrack 테이블 락 경합을 추적하는 초경량 데몬을 실행했습니다. 이를 통해 파드가 급격히 늘어날 때 노드의 conntrack 최대 용량 한계에 부딪혀 TCP SYN 패킷이 유실되고 있었다는 원인을 CPU 0.3% 미만의 오버헤드로 정확히 규명했습니다.'
  },
  {
    id: 'faq-5',
    category: '스토리지 & 캐시',
    question: 'Redis에서 Valkey 8.0으로 무중단 전환할 때 다운타임이 0초였던 절차는?',
    relatedSession: '세션 8',
    answer: 'Valkey 8.0은 Redis 7.2 프로토콜과 100% 호환됩니다. 기존 Redis 마스터 노드에 Valkey 노드를 슬레이브(Replica)로 연결하여 실시간 복제를 구성합니다. 데이터 동기화 지연이 0인 것을 메트릭으로 확인한 뒤, Valkey 노드에 REPLICAOF NO ONE 명령을 내려 마스터로 승격(Failover)합니다. 동시에 사내 공통 캐시 클라이언트 SDK의 DNS/엔드포인트 라우팅을 전환하여 서비스 중단 시간 0초를 달성했습니다.'
  },
  {
    id: 'faq-6',
    category: '보안 & 거버넌스',
    question: '450개 레포지토리의 하드코딩된 AWS IAM Access Key를 어떻게 전수 삭제했나요?',
    relatedSession: '세션 7',
    answer: 'GitHub Actions 환경과 AWS IAM 사이에 OpenID Connect(OIDC) 신뢰 관계를 구성했습니다. 워크플로우 실행 시 GitHub가 서명한 단기 OIDC JWT 토큰을 발급받고, AWS STS의 AssumeRoleWithWebIdentity API를 호출해 유효기간 15분의 임시 자격 증명을 획득합니다. 이를 통해 어떤 레포지토리 Secrets에도 영구적인 AWS_ACCESS_KEY_ID와 AWS_SECRET_ACCESS_KEY를 저장할 필요가 없어져 450개의 정적 키를 모두 안전하게 영구 삭제했습니다.'
  }
];
