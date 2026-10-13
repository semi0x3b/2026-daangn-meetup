export interface ArchitectureNode {
  id: string;
  label: string;
  sublabel: string;
  type: 'client' | 'gateway' | 'compute' | 'storage' | 'cache' | 'security' | 'guardrail' | 'observability';
  iconName: string;
  status: 'active' | 'optimized' | 'monitored' | 'isolated';
  description: string;
  spec?: string;
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label: string;
  protocol?: string;
  isOptimized?: boolean;
}

export interface FlowStep {
  step: number;
  phase: string;
  action: string;
  detail: string;
  durationOrMetric?: string;
}

export interface SessionArchitecture {
  sessionId: string;
  title: string;
  headline: string;
  architectureSummary: string;
  beforeArchitecture: {
    title: string;
    description: string;
    bottlenecks: string[];
  };
  afterArchitecture: {
    title: string;
    description: string;
    improvements: string[];
  };
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  pipelineSteps: FlowStep[];
  keySpecs: {
    component: string;
    role: string;
    tech: string;
    keyConfig: string;
  }[];
  mermaidCode: string;
  asciiDiagram: string;
}

export const SESSION_ARCHITECTURES: Record<string, SessionArchitecture> = {
  'session-1': {
    sessionId: 'session-1',
    title: '궁극의 CI 환경을 위한 여정 2: 캐시 히트율 100% 도전',
    headline: '모노레포 K8s Ephemeral Runner 고속 분산 캐시 & BuildKit 계층화 아키텍처',
    architectureSummary: '격리된 K8s 파드 러너마다 반복 발생하던 pnpm/도커 레이어 다운로드를 로컬 NVMe 캐시 프록시 데몬과 결정론적 다단계 캐시 키로 99.4% 히트율 달성',
    beforeArchitecture: {
      title: '기존: S3 원격 캐시 & 단순 브랜치 키',
      description: '파드 기동마다 S3에서 수 GB를 다운로드하고 tar 압축 해제 오버헤드로 인해 캐시 미스 시 빌드가 2배 지연됨',
      bottlenecks: [
        '캐시 히트율 42% (50% 미만 시 압축 해제로 더 느림)',
        'S3 네트워크 레이턴시로 1.5GB 복원에 30초+ 소요',
        '빌드 시 파일 생성 타임스탬프(mtime) 불일치로 캐시 버스팅'
      ]
    },
    afterArchitecture: {
      title: '개선: 10Gbps NVMe 로컬 프록시 & BuildKit mode=max',
      description: '로컬 SSD 직접 복사 + 클러스터 내부 10Gbps 고속 프록시 + Git 커밋 타임스탬프 정규화로 완전 결정론적 빌드 확립',
      improvements: [
        '캐시 히트율 99.4% 달성 (빌드 시간 14분 30초 → 2분 10초)',
        'Docker BuildKit mode=max로 중간 레이어 레지스트리 공유',
        '전사 일일 대기 시간 320시간 순절감'
      ]
    },
    nodes: [
      { id: 'dev', label: '개발자 PR / Push', sublabel: 'GitHub Webhook', type: 'client', iconName: 'GitPullRequest', status: 'active', description: '일일 수천 건의 PR 및 모노레포 커밋 발생' },
      { id: 'arc', label: 'Actions Runner Controller', sublabel: 'K8s ARC Manager', type: 'gateway', iconName: 'Cpu', status: 'active', description: 'Ephemeral 러너 파드를 오토스케일링 프로비저닝' },
      { id: 'runner', label: 'Ephemeral Runner Pods', sublabel: 'K8s isolated pod', type: 'compute', iconName: 'Box', status: 'optimized', description: '격리된 컨테이너 환경에서 pnpm 빌드 및 테스트 수행' },
      { id: 'cache-proxy', label: '10Gbps 원격 캐시 프록시', sublabel: 'Local NVMe + DaemonSet', type: 'cache', iconName: 'HardDrive', status: 'optimized', description: '노드 로컬 NVMe 스토리지와 클러스터 내부 고속망 연동', spec: '10Gbps / NVMe Direct IO' },
      { id: 'buildkit', label: 'Docker BuildKit 데몬', sublabel: 'mode=max layer cache', type: 'compute', iconName: 'Layers', status: 'optimized', description: '도커 멀티스테이지의 모든 중간 레이어를 프라이빗 레지스트리에 캐싱' },
      { id: 'registry', label: '사내 Docker Registry', sublabel: 'OCI Layer Storage', type: 'storage', iconName: 'Database', status: 'monitored', description: '도커 레이어 캐시 및 최종 아티팩트 보관' }
    ],
    edges: [
      { from: 'dev', to: 'arc', label: 'PR 생성 이벤트', protocol: 'HTTPS Webhook' },
      { from: 'arc', to: 'runner', label: '러너 파드 스케줄링', protocol: 'K8s Pod API' },
      { from: 'runner', to: 'cache-proxy', label: '결정론적 캐시 키 조회 (99.4% Hit)', protocol: 'Local NVMe / gRPC', isOptimized: true },
      { from: 'runner', to: 'buildkit', label: '도커 이미지 멀티스테이지 빌드', protocol: 'Buildx API' },
      { from: 'buildkit', to: 'registry', label: '레이어 캐시 푸시 & 풀', protocol: 'OCI Registry v2', isOptimized: true }
    ],
    pipelineSteps: [
      { step: 1, phase: '체크아웃 & 타임스탬프 정규화', action: 'Git Commit 시간으로 mtime 강제 일치', detail: '빌드 산출물 체크섬 불일치 원천 차단', durationOrMetric: '소요 2초' },
      { step: 2, phase: '계층형 캐시 키 계산', action: 'pnpm-lock.yaml + package.json 해시 조합', detail: 'restore-keys 폴백으로 최단 부모 브랜치 차분 복원', durationOrMetric: '히트율 99.4%' },
      { step: 3, phase: '고속 캐시 복원', action: '노드 로컬 NVMe 캐시 프록시에서 I/O 복사', detail: '1.5GB 아티팩트를 1.8초 만에 메모리/디스크 복원', durationOrMetric: '1.8초' },
      { step: 4, phase: '병렬 모노레포 빌드 & 테스트', action: 'Turborepo / pnpm 분산 캐시 재활용', detail: '변경된 패키지만 선별적으로 테스트 및 빌드 수행', durationOrMetric: '1분 40초' },
      { step: 5, phase: 'BuildKit 레이어 캐시 푸시', action: '--cache-to=type=registry,mode=max', detail: '다음 빌드를 위한 도커 중간 레이어 비동기 저장', durationOrMetric: '총 2분 10초' }
    ],
    keySpecs: [
      { component: 'Cache Key Generator', role: '다단계 결정론적 해시 계산', tech: 'GitHub Actions hashFiles', keyConfig: '${{ runner.os }}-pnpm-${{ hashFiles(\'**/pnpm-lock.yaml\') }}-${{ hashFiles(\'packages/*/package.json\') }}' },
      { component: 'Cache Storage', role: '고속 로컬 & 원격 프록시', tech: 'Local NVMe SSD + Cluster Daemon', keyConfig: '10Gbps Internal Network Proxy' },
      { component: 'Image Builder', role: '도커 멀티레이어 캐싱', tech: 'Docker BuildKit Buildx', keyConfig: '--cache-to=type=registry,mode=max' },
      { component: 'mtime Normalizer', role: '타임스탬프 캐시 버스팅 방지', tech: 'Git Commit Time Normalizer', keyConfig: 'git-restore-mtime script' }
    ],
    mermaidCode: `graph TD
  A[개발자 PR 푸시] --> B[GitHub Actions Controller]
  B --> C[K8s Ephemeral Runner 파드]
  C --> D{계층형 캐시 키 검사}
  D -- 99.4% Hit --> E[10Gbps NVMe 로컬 캐시 프록시]
  D -- Fallback Miss --> F[부모 브랜치 Delta 복원]
  E --> G[초고속 의존성 주입 1.8s]
  C --> H[Docker BuildKit mode=max]
  H --> I[사내 프라이빗 레지스트리]
  G & H --> J[CI 완료: 14분 30초 -> 2분 10초]`,
    asciiDiagram: `[개발자 PR] ──► [GitHub Webhook] ──► [ARC K8s Runner Pod]
                                            │
               ┌────────────────────────────┴───────────────────────────┐
               ▼                                                        ▼
    [결정론적 캐시 키 엔진]                                      [Docker BuildKit]
  (pnpm-lock + package.json)                                    (--cache-to=mode=max)
               │ (99.4% Hit)                                            │
               ▼                                                        ▼
    [10Gbps NVMe 로컬 프록시]                                    [프라이빗 레지스트리]
    (1.5GB 아티팩트 1.8초 복원)                                 (중간 레이어 캐시 보관)
               │                                                        │
               └────────────────────────────┬───────────────────────────┘
                                            ▼
                           [CI 완료: 14분 30초 ➔ 2분 10초 (85% 단축)]`
  },
  'session-2': {
    sessionId: 'session-2',
    title: '코딩은 에이전트가 하는데 배포는 왜 제가 하죠?: CLI·MCP·Agent 실전 비교',
    headline: '표준 MCP(Model Context Protocol) 배포 서버 & 슬랙 Human-in-the-loop 안전 가드레일',
    architectureSummary: 'AI 에이전트에게 쉘 명령어 대신 엄격한 MCP 화이트리스트 함수만 노출하고, 10% 카나리 배포 후 SLO 기반 실시간 지표를 슬랙 인터랙티브 모달로 승인받는 0-인시던트 자동화 파이프라인',
    beforeArchitecture: {
      title: '기존: 쉘 전체 권한 부여 or 수작업 CLI',
      description: '에이전트에게 Bash 실행 권한을 줬더니 에러 발생 시 DB 마이그레이션을 무단 롤백하려 하거나, 사람이 터미널/슬랙을 오가며 18분간 수동 배포함',
      bottlenecks: [
        '에이전트 환각으로 인한 파괴적 인프라 명령어 실행 위험',
        '배포 1건당 평균 18분 소요 및 컨텍스트 스위칭 피로',
        '카나리 트래픽 유입 전 0% 에러를 "정상"으로 오판하여 조기 100% 배포'
      ]
    },
    afterArchitecture: {
      title: '개선: MCP 도구 격리 + 슬랙 인터랙티브 가드레일',
      description: '표준 MCP 서버로 Read/Write 분리, 최소 5분간 RPS > 100 통과 조건 하드코딩, 슬랙 버튼 원클릭 승인 체계 확립',
      improvements: [
        '배포 소요 시간 18분 → 3분 이내로 83% 단축',
        '배포 관련 휴먼 에러 및 잘못된 태그 롤아웃 0건 유지',
        '컨텍스트 스위칭 70% 감소 및 완전 감사 로그 기록'
      ]
    },
    nodes: [
      { id: 'agent', label: 'AI 코딩 에이전트', sublabel: 'Cursor / Claude Code', type: 'client', iconName: 'Bot', status: 'active', description: 'PR 생성 및 배포 요청 인텐트 생성' },
      { id: 'mcp-server', label: '당근 표준 배포 MCP 서버', sublabel: 'Model Context Protocol', type: 'gateway', iconName: 'ShieldCheck', status: 'optimized', description: '엄격한 화이트리스트 함수만 노출 (임의 쉘 실행 차단)', spec: 'JSON-RPC over stdio/HTTP' },
      { id: 'argocd', label: 'ArgoCD Rollouts 엔진', sublabel: 'Canary Controller', type: 'compute', iconName: 'GitBranch', status: 'active', description: '카나리 10% 트래픽 분기 및 프로덕션 파드 롤아웃' },
      { id: 'soak-gate', label: '하드 가드레일 (Traffic Soak)', sublabel: 'Min 5min & RPS > 100', type: 'guardrail', iconName: 'Clock', status: 'optimized', description: '충분한 실트래픽 검증 전 승인 버튼 비활성화' },
      { id: 'slack', label: '슬랙 인터랙티브 승인 모달', sublabel: 'Human-in-the-loop', type: 'security', iconName: 'MessageSquare', status: 'monitored', description: 'P99 지연시간, 5xx 에러율(0.01% 미만) 그래프 확인 후 1클릭 승인' }
    ],
    edges: [
      { from: 'agent', to: 'mcp-server', label: 'deploy_service_canary() 호출', protocol: 'MCP JSON-RPC', isOptimized: true },
      { from: 'mcp-server', to: 'argocd', label: '10% 카나리 파드 프로비저닝', protocol: 'K8s CRD' },
      { from: 'argocd', to: 'soak-gate', label: '실시간 텔레메트리 관찰', protocol: 'OTel / Prometheus' },
      { from: 'soak-gate', to: 'slack', label: '승인 모달 푸시 (5분 검증 통과 후)', protocol: 'Slack Block Kit', isOptimized: true },
      { from: 'slack', to: 'argocd', label: '엔지니어 승인 시 100% 트래픽 전환', protocol: 'Signed Webhook' }
    ],
    pipelineSteps: [
      { step: 1, phase: '배포 요청 수신', action: '에이전트가 배포 함수 호출', detail: 'mcp.deploy_service_canary(serviceName, imageTag, 10)', durationOrMetric: '소요 5초' },
      { step: 2, phase: 'ArgoCD 10% 카나리 롤아웃', action: '신규 파드 배포 및 트래픽 분기', detail: 'Istio/Ingress를 통해 10% 트래픽만 신규 버전으로 라우팅', durationOrMetric: '소요 30초' },
      { step: 3, phase: '하드 가드레일 트래픽 소킹', action: '최소 5분 동안 RPS > 100 유지 검증', detail: '유입 트래픽 없는 허위 정상 판별 환각을 원천 방지', durationOrMetric: '5분 검증' },
      { step: 4, phase: '슬랙 대화형 승인 카드 발송', action: 'P99 35ms & 5xx < 0.01% 지표 보고', detail: '담당 엔지니어에게 AI 요약 및 승인/롤백 버튼 제공', durationOrMetric: '실시간 발송' },
      { step: 5, phase: '100% 프로덕션 전환 완료', action: '엔지니어 버튼 클릭 즉시 전면 프로모션', detail: '이상 감지 시 에이전트 자동 롤백 트리거', durationOrMetric: '총 3분 (기존 18분)' }
    ],
    keySpecs: [
      { component: 'MCP Server', role: '배포 함수 화이트리스트 격리', tech: 'TypeScript MCP SDK', keyConfig: 'tools: deploy_service_canary, evaluate_canary_health' },
      { component: 'Canary Engine', role: '점진적 롤아웃', tech: 'ArgoCD Rollouts', keyConfig: 'trafficRouting: Istio / weight: 10%' },
      { component: 'Soak Guardrail', role: '환각 방지 하드 게이트', tech: 'PromQL Validator', keyConfig: 'rate(http_requests_total[5m]) > 100' },
      { component: 'Approval UI', role: '인간 피드백 결재', tech: 'Slack Interactive Blocks', keyConfig: 'Block Kit action_id: approve_rollout_100' }
    ],
    mermaidCode: `graph LR
  A[AI 코딩 에이전트] -->|엄격한 도구 호출| B[배포 전용 MCP 서버]
  B -->|Canary 10%| C[ArgoCD Rollouts]
  C --> D[트래픽 소킹 게이트: RPS>100 & 5분]
  D -->|SLO 검증 통과| E[슬랙 인터랙티브 모달]
  E -->|엔지니어 1클릭 승인| F[프로덕션 100% 트래픽]
  D -.->|에러율 0.01% 초과 시| G[자동 롤백]`,
    asciiDiagram: `[AI 에이전트] ──(MCP 표준 함수)──► [당근 배포 MCP 서버] 
                                            │
                                            ▼
                                   [ArgoCD 10% 카나리]
                                            │
                                            ▼
                           [하드 가드레일 게이트 (5분 & RPS>100)]
                                            │
                        ┌───────────────────┴───────────────────┐
                        ▼ (정상 지표 통과)                      ▼ (이상 감지)
           [슬랙 인터랙티브 승인 모달]                   [즉시 자동 롤백]
             (엔지니어 버튼 1클릭)
                        │
                        ▼
           [프로덕션 100% 트래픽 승격 (3분 내 완료, 인시던트 0건)]`
  },
  'session-3': {
    sessionId: 'session-3',
    title: 'EKS 노드를 재단하는 목수: 당근의 Karpenter 도입 여정',
    headline: 'AWS EKS ASG 45개 전수 제거 & Karpenter v1.0 Spot 빈패킹 오케스트레이션',
    architectureSummary: 'ASG에 묶여 있던 Cluster Autoscaler를 폐기하고, 파드 요구량에 맞춰 EC2 Fleet API를 직접 호출하는 Karpenter로 프로비저닝 속도 180초 → 35초 단축 및 월 인프라 비용 28% 절감',
    beforeArchitecture: {
      title: '기존: Cluster Autoscaler (CAS) + ASG 45개',
      description: '인스턴스 크기별로 ASG를 일일이 만들어 관리해야 했으며 트래픽 급증 시 노드가 뜨는 데 3~5분이 걸려 펜딩 파드 장애 빈번',
      bottlenecks: [
        '노드 스케일아웃에 180~300초 소요되어 피크 대응 지연',
        'ASG 45개 유지 관리 오버헤드 극심',
        '노드 간 파드 분산으로 유휴 자원 낭비(Waste) 38% 발생'
      ]
    },
    afterArchitecture: {
      title: '개선: Karpenter NodePool + Graviton/Spot 빈패킹',
      description: '파드 스펙을 보고 최적 인스턴스를 즉석 조합, Consolidation 기능으로 유휴 노드 자동 압축 및 반납',
      improvements: [
        '노드 프로비저닝 시간 180초 → 35초 (80% 단축)',
        'EKS 컴퓨팅 비용 월 28% 순절감 (유휴 자원 8% 이하)',
        'ASG 45개 → 0개로 완전 폐기 및 단일 NodePool 통합'
      ]
    },
    nodes: [
      { id: 'traffic', label: '동네생활 / 저녁 피크 트래픽', sublabel: '수천 개 Pod 생성', type: 'client', iconName: 'Activity', status: 'active', description: '시간대별 급격한 트래픽 변동' },
      { id: 'karpenter', label: 'Karpenter v1.0 컨트롤러', sublabel: 'Just-in-time Scheduler', type: 'compute', iconName: 'Cpu', status: 'optimized', description: 'Pending 파드 요구량을 분석해 최적 EC2 조합 계산' },
      { id: 'ec2-fleet', label: 'AWS EC2 Fleet API', sublabel: 'Direct API Call', type: 'gateway', iconName: 'Cloud', status: 'optimized', description: 'ASG 없이 직접 EC2 인스턴스 인스턴티에이션 (35초)' },
      { id: 'nodepool', label: '하이브리드 NodePool', sublabel: 'c6g, m6g, Spot, AMD/ARM', type: 'compute', iconName: 'Layers', status: 'optimized', description: 'ARM64 Graviton + x86 혼합 지원으로 Spot 재고 고갈 방지' },
      { id: 'consolidation', label: 'Consolidation 엔진 (Bin-packing)', sublabel: 'WhenEmptyOrUnderutilized', type: 'guardrail', iconName: 'Minimize2', status: 'optimized', description: '트래픽 감소 시 파드를 작은 노드로 재배치하고 대형 노드 반납' }
    ],
    edges: [
      { from: 'traffic', to: 'karpenter', label: 'Pending Pod 이벤트 감지', protocol: 'K8s Watch API' },
      { from: 'karpenter', to: 'ec2-fleet', label: '최적 EC2 타입 직접 요청', protocol: 'AWS EC2 Fleet SDK', isOptimized: true },
      { from: 'ec2-fleet', to: 'nodepool', label: '35초 만에 신규 노드 가동', protocol: 'AWS VPC', isOptimized: true },
      { from: 'nodepool', to: 'consolidation', label: '리소스 사용률 실시간 감시', protocol: 'Kubelet / Metrics' },
      { from: 'consolidation', to: 'karpenter', label: 'PDB 검증 후 안전 노드 반납', protocol: 'Pod Disruption Budget' }
    ],
    pipelineSteps: [
      { step: 1, phase: '파드 펜딩 이벤트 포착', action: 'Karpenter가 kube-scheduler 미할당 파드 감지', detail: 'CPU, 메모리, GPU, 가용영역 토폴로지 요구사항 취합', durationOrMetric: '소요 1초' },
      { step: 2, phase: '최적 인스턴스 빈패킹 계산', action: 'EC2 단가표 및 Spot 가용성 실시간 대조', detail: 'Graviton(ARM64)과 x86 중 가장 저렴한 인스턴스 선택', durationOrMetric: '소요 2초' },
      { step: 3, phase: 'EC2 Fleet 즉시 프로비저닝', action: 'AWS API 직접 호출로 인스턴스 기동', detail: 'ASG 생성/동기화 과정 생략으로 35초 만에 노드 Ready', durationOrMetric: '35초 (기존 180초)' },
      { step: 4, phase: '파드 스케줄링 & 서비스 투입', action: '노드 Ready 즉시 파드 바인딩 및 트래픽 유입', detail: '피크 트래픽 병목 없이 수천 개 파드 수용', durationOrMetric: '즉시 가동' },
      { step: 5, phase: '유휴 자원 자동 통합 (Consolidation)', action: '트래픽 감소 시 파드 재배치 후 노드 반납', detail: 'PDB 1분 유예(consolidateAfter: 1m)로 무중단 비용 절감', durationOrMetric: '비용 28% 절감' }
    ],
    keySpecs: [
      { component: 'NodePool Spec', role: '유연한 인스턴스 풀 정의', tech: 'karpenter.sh/v1', keyConfig: 'capacity-type: ["spot", "on-demand"], arch: ["arm64", "amd64"]' },
      { component: 'NodeClass', role: 'AWS 서브넷 & 보안그룹 매핑', tech: 'EC2NodeClass', keyConfig: 'amiFamily: AL2023, subnetSelectorTerms' },
      { component: 'Disruption Policy', role: '노드 자동 통합 및 다운사이징', tech: 'Consolidation', keyConfig: 'consolidationPolicy: WhenEmptyOrUnderutilized, consolidateAfter: 1m' },
      { component: 'Safety Boundary', role: '파드 가용성 보장', tech: 'Pod Disruption Budget (PDB)', keyConfig: 'minAvailable: 80%' }
    ],
    mermaidCode: `graph TD
  A[피크 트래픽 Pending 파드 발생] --> B[Karpenter v1.0 스케줄러]
  B --> C{인스턴스 최적 빈패킹 계산}
  C -->|ASG 우회 직접 호출| D[AWS EC2 Fleet API]
  D --> E[Spot / Graviton 노드 기동 35초]
  E --> F[서비스 안정 트래픽 처리]
  F --> G[트래픽 감소 감지]
  G --> H[Consolidation: 파드 압축 재배치]
  H --> I[유휴 노드 반납: 비용 28% 절감]`,
    asciiDiagram: `[피크 트래픽 발생] ──► [Karpenter 컨트롤러] ──► [AWS EC2 Fleet API] (35초)
                              │                                │
                              ▼                                ▼
                 [인스턴스 최적 빈패킹]               [ARM64 / Spot 노드]
             (c6g, m6g, x86 혼합 지원)                         │
                              │                                ▼
                              └─────────────────────► [파드 즉시 바인딩]
                                                               │
                                                               ▼
                                                  [Consolidation 노드 압축]
                                                  (유휴 노드 반납 ➔ 비용 28% 절감)`
  },
  'session-4': {
    sessionId: 'session-4',
    title: '당근에서 값비싼 TPU를 효율적으로 활용하는 방법',
    headline: 'GKE KubeRay 주야간 하이브리드 스케줄링 & GCS 영구 XLA 컴파일 캐싱',
    architectureSummary: '주간 실시간 온라인 서빙(vLLM)과 야간 대규모 임베딩/학습 배치를 TPU 슬라이스 단위로 동적 전환하고, 4분 걸리던 XLA 컴파일을 GCS 캐시로 8초로 단축해 가동률 82% 달성',
    beforeArchitecture: {
      title: '기존: 24시간 고정 슬라이스 & 콜드 컴파일',
      description: 'TPU Pod Slice 단위로 고정 계약하여 새벽 시간대 막대한 유휴 비용이 발생하고, 작업 시작마다 XLA 컴파일에 4~5분이 소요됨',
      bottlenecks: [
        '새벽 시간대 TPU 유휴 방치로 막대한 클라우드 비용 누수',
        'JAX/XLA 컴파일 시간 4~5분 소요로 아침 피크 전환 실패 위험',
        '슬라이스 칩 1개 결함 시 전체 파드 슬라이스 먹통 위험'
      ]
    },
    afterArchitecture: {
      title: '개선: KubeRay 주야간 전환 + GCS Persistent Cache',
      description: '밤 11시 온라인 서빙 축소 후 오프라인 임베딩 큐로 TPU 이전, 분산 체크포인팅(Orbax)으로 선점(Preemption) 시 30초 내 복구',
      improvements: [
        'TPU 평균 가동률(MFU) 35% → 82%로 수직 상승',
        'XLA 컴파일 시간 4분 → 8초로 96% 단축',
        '일일 5,000만 건 추가 임베딩 연산 무비용 소화'
      ]
    },
    nodes: [
      { id: 'day-traffic', label: '주간 온라인 추론 트래픽', sublabel: '중고거래 사진/검색 vLLM', type: 'client', iconName: 'Sun', status: 'active', description: '실시간 검색 및 사기 탐지 요청' },
      { id: 'kuberay', label: 'KubeRay 오퍼레이터', sublabel: 'GKE 워크로드 조율기', type: 'compute', iconName: 'Cpu', status: 'optimized', description: '주간(서빙) / 야간(배치) 슬라이스 동적 리스케줄링' },
      { id: 'tpu-slice', label: 'TPU v5e Pod Slice', sublabel: '2x4 / 4x4 2D Mesh', type: 'compute', iconName: 'Server', status: 'optimized', description: '초고속 인터커넥트 기반 가속기 슬라이스' },
      { id: 'gcs-cache', label: 'GCS 영구 XLA 캐시', sublabel: 'Persistent Compile Cache', type: 'cache', iconName: 'HardDrive', status: 'optimized', description: '컴파일된 연산 그래프를 클러스터 전역에 공유 (8초 복원)' },
      { id: 'night-batch', label: '야간 5,000만 건 임베딩 큐', sublabel: 'Orbax 분산 체크포인트', type: 'storage', iconName: 'Moon', status: 'active', description: '스팟 TPU 선점 시 30초 내 복구 가능한 내결함성 배치' }
    ],
    edges: [
      { from: 'day-traffic', to: 'kuberay', label: '주간 온라인 서빙 라우팅', protocol: 'HTTP gRPC' },
      { from: 'kuberay', to: 'tpu-slice', label: '슬라이스 자원 동적 바인딩', protocol: 'GKE TPU Accelerator' },
      { from: 'tpu-slice', to: 'gcs-cache', label: 'XLA 그래프 캐시 조회 (8초 복구)', protocol: 'GCS API', isOptimized: true },
      { from: 'kuberay', to: 'night-batch', label: '밤 11시 이후 배치 큐로 TPU 이관', protocol: 'Ray Job Submit', isOptimized: true },
      { from: 'night-batch', to: 'tpu-slice', label: '야간 100% 풀가동 (MFU 82%)', protocol: 'Internal Mesh' }
    ],
    pipelineSteps: [
      { step: 1, phase: '주간 실시간 서빙 (08:00 ~ 23:00)', action: 'vLLM 서빙 파드에 TPU v5e 슬라이스 배정', detail: '중고거래 이미지 자동 분류 및 로컬 LLM 추론 처리', durationOrMetric: 'P99 < 120ms' },
      { step: 2, phase: '야간 워크로드 전환 (23:00)', action: 'KubeRay가 서빙 파드를 최소 유지 스케일다운', detail: '확보된 TPU 슬라이스를 오프라인 임베딩 배치 잡으로 동적 할당', durationOrMetric: '전환 소요 1분' },
      { step: 3, phase: 'GCS 영구 XLA 캐시 로드', action: '미리 컴파일된 연산 그래프 즉시 복원', detail: '콜드 스타트 컴파일 시간을 4분에서 8초로 단축', durationOrMetric: '8초 복원' },
      { step: 4, phase: '대규모 야간 배치 연산 수행', action: '매일 5,000만 건의 게시글/이미지 벡터 임베딩', detail: 'Orbax 체크포인팅으로 스팟 선점 시 30초 내 복구', durationOrMetric: '5,000만 건 처리' },
      { step: 5, phase: '아침 피크 복귀 (07:30)', action: '배치 잡 정상 체크포인트 저장 후 서빙 파드 복원', detail: 'TPU 가동률(MFU) 35% → 82% 달성', durationOrMetric: '가동률 82%' }
    ],
    keySpecs: [
      { component: 'TPU Topology', role: '가속기 슬라이스 사양', tech: 'Google Cloud TPU v5e', keyConfig: 'tpu-v5-lite-podslice / 2x4 (8 chips)' },
      { component: 'Orchestrator', role: '주야간 하이브리드 잡 제어', tech: 'KubeRay / RayCluster CRD', keyConfig: 'workerGroupSpecs replicas dynamic scale' },
      { component: 'Compile Cache', role: '연산 그래프 영속화', tech: 'JAX/PyTorch-XLA Persistent Cache', keyConfig: 'XLA_FLAGS=--xla_gpu_persistent_cache_dir=gs://cache' },
      { component: 'Checkpointing', role: '스팟 선점 내결함성', tech: 'Orbax Checkpoint Manager', keyConfig: 'save_interval_steps=100 / resume in 30s' }
    ],
    mermaidCode: `graph TD
  A[주간 피크: 온라인 vLLM 추론] --> B[GKE KubeRay 스케줄러]
  B --> C[TPU v5e Pod Slice 2x4]
  C <--> D[GCS 영구 XLA 캐시: 4분 -> 8초]
  B -->|밤 11시 트래픽 감소| E[오프라인 5,000만 건 배치 큐]
  E --> C
  C --> F[야간 풀가동 MFU 82%]
  F -->|아침 07:30| A`,
    asciiDiagram: `[주간 08:00~23:00] ──► [vLLM 온라인 추론] ──► [TPU v5e 슬라이스] ◄── [GCS XLA 캐시]
                                                 │                 (4분 ➔ 8초)
                               [밤 11시 전환]    ▼
[야간 23:00~08:00] ──► [5,000만 건 임베딩] ──► [야간 배치 풀가동 (MFU 82% 달성)]`
  },
  'session-5': {
    sessionId: 'session-5',
    title: 'AI 시대의 옵저버빌리티 재설계: Grafana를 걷어내고, 얼럿은 에이전트에게',
    headline: '800개 Grafana 대시보드 탈피 & OTel + 시계열 이상감지 AI 에이전트 파이프라인',
    architectureSummary: '대시보드 20개를 쳐다보며 원인을 추론하던 관측성 체계를 폐기하고, Prometheus/Mimir/Tempo 원천 데이터를 먹은 AI 에이전트가 "원인+증거 3건+조치 방안"을 슬랙으로 즉시 전달해 MTTR 45분 → 8분 단축',
    beforeArchitecture: {
      title: '기존: 800개 Grafana 패널 & 알림 폭탄',
      description: '장애 발생 시 어떤 대시보드를 봐야 할지 찾는 데만 10분이 걸렸으며, CPU > 90% 같은 단순 임계치 알림이 분당 수십 개씩 쏟아져 온콜 피로도 극심',
      bottlenecks: [
        'MTTR 45분 소요 (대시보드 패널 간 상관관계 눈대중 추론)',
        '사내 800개 대시보드로 관측성 파편화',
        '노이즈 알림(False Positives) 범람으로 핵심 장애 인지 지연'
      ]
    },
    afterArchitecture: {
      title: '개선: AI 에이전트 자율 분석 + 3대 증거 체인',
      description: 'OTel 에러 스팬과 Mimir 시계열 이상치를 벡터화하여 LLM이 분석, 신뢰도 0.85 이상 시 완성된 슬랙 액션 카드 발송',
      improvements: [
        '장애 평균 복구 시간(MTTR) 45분 → 8분으로 82% 단축',
        '온콜 엔지니어가 확인하는 대시보드 수 12개 → 1개 미만',
        '노이즈 알림 78% 제거 및 자연어 질의 지원 (5초 응답)'
      ]
    },
    nodes: [
      { id: 'telemetry', label: '원천 텔레메트리 파이프라인', sublabel: 'Mimir, Loki, Tempo', type: 'storage', iconName: 'Database', status: 'active', description: '초당 수백만 건의 메트릭/로그/분산 트레이스 수집' },
      { id: 'anomaly', label: '시계열 이상 감지기', sublabel: 'Z-Score & Pattern Matcher', type: 'compute', iconName: 'Activity', status: 'optimized', description: '트래픽 급증 및 레이턴시 스파이크 실시간 벡터화' },
      { id: 'sre-agent', label: 'SRE AI 분석 에이전트', sublabel: 'LLM + Correlation Engine', type: 'gateway', iconName: 'Bot', status: 'optimized', description: '배포 diff, 트레이스 스팬, 과거 포스트모텀 교차 분석' },
      { id: 'evidence-guard', label: '3대 증거 검증 가드레일', sublabel: 'Confidence > 0.85', type: 'guardrail', iconName: 'ShieldCheck', status: 'optimized', description: '환각 방지를 위한 3개 필수 증거 링크 및 신뢰도 검증' },
      { id: 'slack-card', label: '슬랙 원인 분석 리포트', sublabel: 'Interactive Action Card', type: 'client', iconName: 'MessageSquare', status: 'active', description: '3줄 요약, 원인, 증거 링크, 추천 복구 명령어 제공' }
    ],
    edges: [
      { from: 'telemetry', to: 'anomaly', label: 'OTel 에러 스팬 & 메트릭 스트림', protocol: 'gRPC / OTLP' },
      { from: 'anomaly', to: 'sre-agent', label: '이상 패턴 벡터 전달', protocol: 'Internal API', isOptimized: true },
      { from: 'sre-agent', to: 'evidence-guard', label: '가설 및 증거 체인 검증', protocol: 'Strict Validator' },
      { from: 'evidence-guard', to: 'slack-card', label: '완결된 액션 카드 발송', protocol: 'Slack Webhook', isOptimized: true }
    ],
    pipelineSteps: [
      { step: 1, phase: '이상 징후 실시간 감지', action: 'Mimir/Tempo에서 P99 레이턴시 스파이크 포착', detail: '피드 서비스 레이턴시 35ms → 450ms 급증 감지', durationOrMetric: '소요 5초' },
      { step: 2, phase: 'OpenTelemetry 트레이스 스팬 분석', action: '분산 트레이스에서 병목 스팬 자동 드릴다운', detail: '/api/v1/feed 호출 중 redis.command 소요시간 380ms 지목', durationOrMetric: '소요 10초' },
      { step: 3, phase: '최근 배포 diff 및 포스트모텀 대조', action: 'GitHub PR 커밋 내역과 에러 패턴 매칭', detail: 'PR #3412의 N+1 Redis MGET 쿼리 변경점 특정', durationOrMetric: '소요 15초' },
      { step: 4, phase: '환각 방지 3대 증거 검증', action: '신뢰도 0.94 및 증거 링크 3건 첨부', detail: '클라이언트 커넥션 1200/1200 고갈 + Tempo 스팬 + PR 링크', durationOrMetric: 'Confidence 0.94' },
      { step: 5, phase: '슬랙 원인 리포트 & 복구 추천', action: '온콜 엔지니어에게 롤백 버튼이 달린 메시지 발송', detail: 'MTTR 45분에서 8분으로 단축', durationOrMetric: 'MTTR 8분' }
    ],
    keySpecs: [
      { component: 'Metrics Engine', role: '대규모 시계열 저장소', tech: 'Grafana Mimir / Prometheus', keyConfig: 'Multi-tenant high availability cluster' },
      { component: 'Tracing Engine', role: '분산 트랜잭션 추적', tech: 'Grafana Tempo / OpenTelemetry', keyConfig: 'TraceQL span analysis' },
      { component: 'LLM Agent', role: '상관관계 자율 추론', tech: 'Fine-tuned SRE Agent', keyConfig: 'Input: Vectorized OTel Spans + GitHub Diff' },
      { component: 'Safety Boundary', role: '환각 방지 하드 가드레일', tech: 'Evidence Guardrail', keyConfig: 'min_evidence_count: 3, min_confidence: 0.85' }
    ],
    mermaidCode: `graph TD
  A[원천 텔레메트리: Mimir/Tempo/Loki] --> B[시계열 이상 감지기]
  B --> C[SRE AI 분석 에이전트]
  C --> D{3대 증거 검증 가드레일}
  D -- Confidence >= 0.85 --> E[슬랙 액션 리포트 발송]
  D -- 신뢰도 부족 시 --> F[원인불명 보고 + 즉시 온콜 호출]
  E --> G[MTTR 45분 -> 8분 단축]`,
    asciiDiagram: `[Prometheus / Tempo / Loki] ──► [시계열 이상 감지기] ──► [SRE AI 분석 에이전트]
                                                                  │
                                                      (배포 diff + OTel 스팬 교차)
                                                                  │
                                                                  ▼
                                                      [3대 증거 검증 가드레일]
                                                      (Confidence >= 0.85)
                                                                  │
                                                                  ▼
                                                  [슬랙 완성형 액션 리포트]
                                               (원인 3줄 + 증거 3건 + 롤백 버튼)
                                                                  │
                                                                  ▼
                                                    [MTTR: 45분 ➔ 8분 (82% 단축)]`
  },
  'session-6': {
    sessionId: 'session-6',
    title: '당근 SRE의 eBPF 활용기: 지나간 Alert의 원인을 찾다',
    headline: '리눅스 커널 레이어 eBPF 실시간 프로빙 & 0.1% 미만 극소 부하 패킷 드롭 추적',
    architectureSummary: '애플리케이션 APM이 보지 못하는 리눅스 커널 소켓 버퍼 오버플로우와 AWS VPC CNI conntrack 테이블 락 경합을 kprobe/tracepoint 기반 eBPF로 포착해 간헐적 504 타임아웃 박멸',
    beforeArchitecture: {
      title: '기존: 앱 레벨 APM & tcpdump 한계',
      description: '간헐적 504 타임아웃 알림 발생 시 서버에 접속하면 이미 상황 종료, tcpdump는 5~10% CPU 부하를 일으켜 2차 장애 유발',
      bottlenecks: [
        '커널 TCP 재전송 및 conntrack 락 경합은 앱 로그에 미기록',
        '상시 패킷 덤프 시 극심한 CPU 오버헤드로 실서버 적용 불가',
        '장애 재현이 불가능해 원인 규명에 수 주 소요'
      ]
    },
    afterArchitecture: {
      title: '개선: eBPF kprobe 데몬셋 + Perf Ring Buffer',
      description: 'CPU 0.3% 미만 부하로 커널 레벨 tcp_retransmit_skb 함수를 상시 프로빙하여 이상 징후를 메모리 링 버퍼에 비동기 기록',
      improvements: [
        '간헐적 504 게이트웨이 타임아웃 발생률 0.12% → 0.001% 이하로 박멸',
        '인프라 계측 오버헤드 CPU 0.3% / 메모리 50MB 이내 유지',
        '원인 파악 기간 수 주 → 수 시간 내로 대폭 단축'
      ]
    },
    nodes: [
      { id: 'user-app', label: '사용자 애플리케이션', sublabel: 'User Space Process', type: 'client', iconName: 'Box', status: 'active', description: 'HTTP 요청 및 Redis 호출 수행' },
      { id: 'socket', label: '리눅스 커널 소켓 계층', sublabel: 'Kernel TCP/IP Stack', type: 'compute', iconName: 'Network', status: 'active', description: 'TCP 3-way 핸드셰이크 및 송수신 버퍼 관리' },
      { id: 'ebpf-probe', label: 'eBPF kprobe/tracepoint', sublabel: 'Kernel Bytecode Probe', type: 'security', iconName: 'Eye', status: 'optimized', description: '커널 함수 실행 시점에 0.1% 부하로 후킹', spec: 'kprobe: tcp_retransmit_skb' },
      { id: 'ring-buffer', label: 'BPF Perf Ring Buffer', sublabel: 'Lockless Shared Memory', type: 'cache', iconName: 'HardDrive', status: 'optimized', description: '패킷 드롭 발생 시 즉시 메모리에 이벤트 기록' },
      { id: 'coroot', label: 'eBPF 데몬 & 분석기', sublabel: 'Cilium Hubble / Coroot', type: 'observability', iconName: 'Activity', status: 'optimized', description: 'VPC CNI conntrack 락 경합 지점을 시각화' }
    ],
    edges: [
      { from: 'user-app', to: 'socket', label: 'Syscall (connect, sendto)', protocol: 'Linux Syscall' },
      { from: 'socket', to: 'ebpf-probe', label: '커널 이벤트 가로채기 (0.3% CPU)', protocol: 'Kernel Hook', isOptimized: true },
      { from: 'ebpf-probe', to: 'ring-buffer', label: 'SYN 패킷 재전송 이벤트 기록', protocol: 'Perf Buffer', isOptimized: true },
      { from: 'ring-buffer', to: 'coroot', label: '유저 스페이스 비동기 전달', protocol: 'bpf_perf_event_read' },
      { from: 'coroot', to: 'socket', label: 'conntrack-max & CNI 프리워밍 패치', protocol: 'Sysctl Tuning' }
    ],
    pipelineSteps: [
      { step: 1, phase: '커널 함수 후킹 등록', action: 'eBPF 바이트코드를 커널 VM에 로드', detail: 'kprobe/tcp_retransmit_skb 및 tracepoint 소켓 추적', durationOrMetric: '오버헤드 0.3%' },
      { step: 2, phase: '패킷 라이프사이클 상시 감시', action: '노드 내 모든 인/아웃바운드 패킷 지연 측정', detail: 'TCP SYN 패킷 1초 지연 및 RTT 비정상 스파이크 감지', durationOrMetric: '실시간 감시' },
      { step: 3, phase: '이상 이벤트 링 버퍼 제출', action: '락 없는 고속 공유 메모리에 드롭 데이터 저장', detail: '송수신 IP, 포트, 패킷 플래그, 커널 호출 스택 캡처', durationOrMetric: '마이크로초 단위' },
      { step: 4, phase: '원인 규명: VPC CNI conntrack 락', action: '보조 IP 할당 시의 네트워크 인터페이스 큐 병목 적발', detail: 'Redis 접속 시 1초 타임아웃의 실체가 커널 락임을 규명', durationOrMetric: '정밀 적발' },
      { step: 5, phase: '커널 파라미터 최적화 조치', action: 'CNI 프리워밍 IP 및 conntrack-max 튜닝', detail: '504 타임아웃 발생률 0.12% → 0.001% 이하로 박멸', durationOrMetric: '에러율 0.001%' }
    ],
    keySpecs: [
      { component: 'Probe Mechanism', role: '커널 동적 계측', tech: 'eBPF / BCC / Cilium', keyConfig: 'SEC("kprobe/tcp_retransmit_skb")' },
      { component: 'Data Transport', role: '초고속 무잠금 메모리 전송', tech: 'BPF Perf Ring Buffer', keyConfig: 'bpf_perf_event_output(ctx, &events, ...)' },
      { component: 'Target Symptom', role: '추적 대상 장애', tech: 'AWS VPC CNI & Netfilter', keyConfig: 'conntrack table lock contention & ENI ring buffer' },
      { component: 'Overhead Metric', role: '시스템 영향도', tech: 'eBPF Runtime', keyConfig: 'CPU < 0.3%, Memory < 50MB per node' }
    ],
    mermaidCode: `graph TD
  A[사용자 앱 요청] --> B[리눅스 커널 소켓 스택]
  B --> C{TCP 패킷 처리}
  C -->|eBPF kprobe 후킹| D[eBPF 커널 바이트코드]
  D -->|SYN 재전송 감지| E[Perf Ring Buffer]
  E --> F[유저스페이스 eBPF 수집기]
  F --> G[원인 규명: VPC CNI conntrack 락]
  G --> H[Sysctl 튜닝으로 504 에러 0.001%로 박멸]`,
    asciiDiagram: `[애플리케이션 (User Space)]
             │ Syscall
             ▼
[리눅스 커널 TCP/IP 스택] ──► [eBPF 프로브 (kprobe)] ──► [Perf Ring Buffer]
             │ (CPU 0.3%)                 │                      │
             ▼                            ▼                      ▼
  [VPC CNI conntrack 경합 적발] ◄── [SYN 재전송 추적] ◄── [비동기 텔레메트리]
             │
             ▼
  [커널 sysctl & CNI 튜닝 ➔ 504 타임아웃 0.001% 이하 박멸]`
  },
  'session-7': {
    sessionId: 'session-7',
    title: 'GitHub Actions에서 정적 키를 없애는 과정: feat. OIDC',
    headline: '450개 레포지토리 AWS 정적 장기 키 100% 전수 제거 & OIDC 단기 STS 토큰 교환',
    architectureSummary: 'Settings > Secrets에 보관되던 영구 Access Key를 전수 삭제하고, GitHub OIDC IdP와 AWS IAM 간 단기 JWT 기반 STS AssumeRoleWithWebIdentity 신뢰 체인 구축',
    beforeArchitecture: {
      title: '기존: 450개 레포지토리의 AWS 정적 키',
      description: '레포마다 AWS_ACCESS_KEY_ID가 등록되어 있어 유출 위험이 높고 퇴사자 발생 시 450개 레포의 키를 일일이 교체하는 것이 불가능함',
      bottlenecks: [
        '정적 장기 키 탈취 시 영구적인 AWS 인프라 침해 위험',
        '퇴사자 발생 시 키 로테이션 공수 연간 수십 시간 낭비',
        'CloudTrail에서 실제 빌드 주체 및 PR 추적 어려움'
      ]
    },
    afterArchitecture: {
      title: '개선: GitHub Actions OIDC + AWS IAM STS',
      description: '러너가 빌드 시점에 15분짜리 단기 JWT를 발급받아 STS와 교환, main 브랜치와 조직 이름을 엄격히 제한(Least Privilege)',
      improvements: [
        '사내 정적 AWS 장기 키 450개 100% 전수 제거',
        '키 로테이션 소요 공수 0시간 (자동 만료)',
        'IAM 감사 로그(CloudTrail)에서 PR 단위 완벽한 추적성 확보'
      ]
    },
    nodes: [
      { id: 'gh-runner', label: 'GitHub Actions 러너', sublabel: 'Ephemeral CI Runner', type: 'client', iconName: 'Cpu', status: 'active', description: 'PR 또는 main 브랜치 빌드 워크플로우 실행' },
      { id: 'gh-oidc', label: 'GitHub OIDC Provider', sublabel: 'token.actions.githubusercontent', type: 'security', iconName: 'Key', status: 'optimized', description: '레포/브랜치 메타데이터가 담긴 단기 JWT 발급' },
      { id: 'aws-sts', label: 'AWS STS (Security Token)', sublabel: 'AssumeRoleWithWebIdentity', type: 'gateway', iconName: 'ShieldCheck', status: 'optimized', description: 'OIDC 토큰 서명 및 Trust Policy 검증' },
      { id: 'iam-role', label: '최소 권한 AWS IAM Role', sublabel: 'Condition Claim 제한', type: 'security', iconName: 'Lock', status: 'optimized', description: 'daangn/*:ref:refs/heads/main 클레임만 엄격 허용' },
      { id: 'aws-infra', label: 'AWS EKS / S3 / ECR', sublabel: '15분 임시 자격증명', type: 'compute', iconName: 'Server', status: 'active', description: '빌드 후 자동 소멸하는 자격 증명으로 안전 배포' }
    ],
    edges: [
      { from: 'gh-runner', to: 'gh-oidc', label: 'ID 토큰 요청 (permissions: id-token)', protocol: 'HTTPS OIDC' },
      { from: 'gh-oidc', to: 'gh-runner', label: '단기 암호화 JWT 발급', protocol: 'JSON Web Token', isOptimized: true },
      { from: 'gh-runner', to: 'aws-sts', label: 'JWT 제시 및 AssumeRole 요청', protocol: 'AWS STS API' },
      { from: 'aws-sts', to: 'iam-role', label: 'Trust Policy Condition 검증', protocol: 'IAM Policy Engine' },
      { from: 'iam-role', to: 'aws-infra', label: '15분 임시 세션 발급 & 배포 수행', protocol: 'Temporary Credential', isOptimized: true }
    ],
    pipelineSteps: [
      { step: 1, phase: '워크플로우 권한 선언', action: 'id-token: write 권한 명시', detail: 'GitHub Actions 러너가 OIDC 토큰을 요청할 수 있도록 허가', durationOrMetric: '선언적 설정' },
      { step: 2, phase: 'GitHub OIDC ID 토큰 발급', action: 'GitHub IdP로부터 서명된 JWT 수신', detail: '토큰 페이로드에 repo, actor, ref, sha 클레임 자동 포함', durationOrMetric: '소요 1초' },
      { step: 3, phase: 'AWS STS AssumeRole 호출', action: 'aws-actions/configure-aws-credentials', detail: 'WebIdentity 토큰을 STS 엔드포인트에 제출', durationOrMetric: '소요 1.5초' },
      { step: 4, phase: 'IAM Trust Policy 엄격 검증', action: 'StringLike repo:daangn/*:ref:refs/heads/main 검사', detail: '타 레포지토리나 무단 PR에서의 Role 탈취 원천 차단', durationOrMetric: 'Least Privilege' },
      { step: 5, phase: '임시 자격증명 수령 및 빌드 종료', action: '15분 유효 단기 세션으로 ECR 푸시/EKS 배포', detail: '빌드 완료 즉시 메모리에서 증발, 정적 키 0개 유지', durationOrMetric: '정적 키 0개' }
    ],
    keySpecs: [
      { component: 'OIDC Provider', role: '신뢰 공급자', tech: 'token.actions.githubusercontent.com', keyConfig: 'aud: sts.amazonaws.com' },
      { component: 'IAM Trust Policy', role: '권한 경계 제한', tech: 'AWS IAM Policy', keyConfig: 'StringLike: token.actions.githubusercontent.com:sub: "repo:daangn/*:ref:refs/heads/main"' },
      { component: 'Workflow Action', role: '토큰 교환 클라이언트', tech: 'aws-actions/configure-aws-credentials@v4', keyConfig: 'role-to-assume, aws-region, role-session-name' },
      { component: 'Session Duration', role: '토큰 수명', tech: 'AWS STS Token', keyConfig: 'DurationSeconds: 900 (15 minutes)' }
    ],
    mermaidCode: `graph LR
  A[GitHub Actions 러너] -->|1. id-token 요청| B[GitHub OIDC Provider]
  B -->|2. 단기 JWT 발급| A
  A -->|3. AssumeRoleWithWebIdentity| C[AWS STS]
  C -->|4. Condition 클레임 검증| D[IAM Role: repo/main 한정]
  D -->|5. 15분 단기 자격증명 반환| A
  A -->|6. EKS/ECR 안전 배포| E[AWS 프로덕션 인프라]`,
    asciiDiagram: `[GitHub Actions 러너] ──(1. id-token 요청)──► [GitHub OIDC Provider]
           │                                                │
           │ (2. 서명된 JWT 발급)                           │
           ▼                                                ▼
[AWS STS 엔드포인트] ◄──(3. AssumeRoleWithWebIdentity)──────┘
           │
           ▼
[IAM Trust Policy 검증: repo:daangn/*:ref:refs/heads/main]
           │
           ▼
[15분 단기 임시 자격증명 발급 ➔ 배포 후 자동 소멸 (정적 키 450개 ➔ 0개)]`
  },
  'session-8': {
    sessionId: 'session-8',
    title: '캐시가 서 말이라도 꿰어야 보배: Redis to Valkey, 캐시 인프라 표준까지',
    headline: '다운타임 0초 Valkey 8.0 마이그레이션 & 사내 표준 SDK 서킷 브레이커 구축',
    architectureSummary: 'Redis 라이선스 변경을 기회 삼아 멀티스레드 비동기 I/O 기반 Valkey 8.0으로 0초 무중단 롤링 페일오버를 달성하고, DNS 캐시 고착 및 MOVED 에러를 사내 표준 캐시 SDK로 완전 해결',
    beforeArchitecture: {
      title: '기존: Redis 5~7 버전 파편화 & 라이선스 리스크',
      description: '팀마다 서로 다른 Redis 버전과 제각각인 클라이언트 타임아웃 설정을 사용하여 장애 시 연쇄 다운타임 발생 위험',
      bottlenecks: [
        'Redis SSPL 라이선스 변경으로 인한 상용 사용 위험',
        '클라이언트별 DNS 캐싱 및 MOVED 에러 미처리로 페일오버 실패',
        '중복 캐시 인스턴스 남발로 비용 및 관리 부담 증가'
      ]
    },
    afterArchitecture: {
      title: '개선: Valkey 8.0 레플리카 복제 스위칭 & 표준 SDK',
      description: 'Valkey 노드를 기존 Redis 마스터의 슬레이브로 연결해 데이터 동기화 후 페일오버, 공통 SDK에 지수 백오프 및 서킷 브레이커 내장',
      improvements: [
        '전사 프로덕션 캐시 클러스터 100% 무중단 전환 (다운타임 0초)',
        '피크 시간대 처리량(Throughput) 32% 향상 (멀티스레드 I/O)',
        '중복 인스턴스 통폐합으로 호스팅 비용 18% 절감'
      ]
    },
    nodes: [
      { id: 'client-app', label: '마이크로서비스 클라이언트', sublabel: 'Go / Python / Node.js', type: 'client', iconName: 'Box', status: 'active', description: '중고거래 피드 및 채팅 캐시 요청' },
      { id: 'sdk', label: '당근 표준 캐시 SDK', sublabel: 'Smart Router & Retry', type: 'guardrail', iconName: 'Cpu', status: 'optimized', description: 'MOVED/ASK 자동 리디렉션, 서킷 브레이커, 지수 백오프' },
      { id: 'redis-old', label: '기존 Redis 마스터', sublabel: 'Redis 7.2 Cluster', type: 'storage', iconName: 'Database', status: 'monitored', description: '마이그레이션 전 쓰기 트래픽 수용' },
      { id: 'valkey-new', label: 'Valkey 8.0 레플리카 ➔ 마스터', sublabel: 'Linux Foundation OSS', type: 'cache', iconName: 'Server', status: 'optimized', description: '비동기 I/O 멀티스레딩 (처리량 +32%)', spec: 'io-threads: 4' },
      { id: 'sync-stream', label: '실시간 복제 스트림', sublabel: 'Replication Stream', type: 'gateway', iconName: 'RefreshCw', status: 'optimized', description: '바이트 단위 완전 무손실 데이터 동기화' }
    ],
    edges: [
      { from: 'client-app', to: 'sdk', label: '캐시 읽기/쓰기 호출', protocol: 'In-process SDK' },
      { from: 'sdk', to: 'redis-old', label: '1단계: 기존 Redis 쓰기', protocol: 'RESP3' },
      { from: 'redis-old', to: 'sync-stream', label: '실시간 데이터 복제', protocol: 'Replication Protocol' },
      { from: 'sync-stream', to: 'valkey-new', label: '레플리카 상태 유지', protocol: 'RESP Sync' },
      { from: 'sdk', to: 'valkey-new', label: '2단계: 롤링 페일오버 후 Valkey 승격', protocol: 'RESP3 (QPS +32%)', isOptimized: true }
    ],
    pipelineSteps: [
      { step: 1, phase: 'Valkey 8.0 레플리카 노드 투입', action: '기존 Redis 마스터에 슬레이브로 연결', detail: '초기 RDB 동기화 및 실시간 복제 스트림 정합성 100% 확인', durationOrMetric: '무중단 동기화' },
      { step: 2, phase: '사내 공통 캐시 SDK 배포', action: '토폴로지 변경 감지 및 서킷 브레이커 주입', detail: 'DNS 캐시 고착 및 MOVED/ASK 에러 자동 재시도 로직 강제', durationOrMetric: 'SDK 표준화' },
      { step: 3, phase: '롤링 페일오버 트리거', action: 'Valkey 노드를 마스터로 전격 승격', detail: 'CLUSTER FAILOVER 명령어로 트래픽 0초 무중단 스위칭', durationOrMetric: '다운타임 0초' },
      { step: 4, phase: '구 Redis 마스터 안전 퇴출', action: '복제 연결 해제 및 구 인스턴스 회수', detail: '불필요한 중복 클러스터 통폐합으로 인프라 비용 18% 절감', durationOrMetric: '비용 18% 절감' },
      { step: 5, phase: '멀티스레드 I/O 풀가동', action: 'io-threads 4개 활성화로 고부하 서빙', detail: '피크 QPS 32% 향상 및 P99 지연시간 안정화', durationOrMetric: '처리량 +32%' }
    ],
    keySpecs: [
      { component: 'Cache Engine', role: '차세대 인메모리 스토리지', tech: 'Valkey 8.0 (Linux Foundation)', keyConfig: 'io-threads: 4, io-threads-do-reads: yes' },
      { component: 'Failover Strategy', role: '무중단 전환', tech: 'Cluster Replication & Failover', keyConfig: 'CLUSTER FAILOVER TAKEOVER (0s downtime)' },
      { component: 'Standard SDK', role: '클라이언트 복원력 보장', tech: 'Go/Python/Node In-house SDK', keyConfig: 'Exponential backoff, circuit breaker threshold: 5' },
      { component: 'Memory Policy', role: '메모리 관리 표준', tech: 'Valkey Config', keyConfig: 'maxmemory-policy: volatile-lru, tcp-keepalive: 300' }
    ],
    mermaidCode: `graph TD
  A[마이크로서비스 클라이언트] --> B[당근 공통 캐시 SDK]
  B -->|1단계 복제| C[기존 Redis 마스터]
  C -->|실시간 복제 스트림| D[Valkey 8.0 레플리카]
  B -.->|2단계 롤링 페일오버 0s| D
  D -->|3단계 마스터 승격| E[Valkey 8.0 프로덕션]
  E --> F[처리량 32% 향상 & 라이선스 완전 해결]`,
    asciiDiagram: `[클라이언트 애플리케이션] ──► [당근 표준 캐시 SDK]
                                          │
            ┌─────────────────────────────┴─────────────────────────────┐
            ▼ (1단계: 기존 쓰기)                                         ▼ (2단계: 페일오버 스위칭)
    [기존 Redis 7.2 마스터] ──(실시간 복제 스트림)──► [Valkey 8.0 레플리카] ──► [Valkey 마스터 승격]
                                                                                │
                                                                                ▼
                                                                  [처리량 32% 향상, 다운타임 0초]`
  },
  'session-9': {
    sessionId: 'session-9',
    title: '전사 개발자 500명을 위한 플랫폼 엔지니어링: GitHub EMU & IdP 연동',
    headline: 'Okta IdP SCIM 동기화 & GitHub Enterprise Managed Users(EMU) 권한 자동화',
    architectureSummary: '입퇴사 시 수동으로 초대하던 GitHub 조직 권한을 Okta IdP와 SCIM 프로토콜로 실시간 연동하여 개발자 온보딩 시간 3일 → 2시간 단축 및 권한 탈취 침해 0건 달성',
    beforeArchitecture: {
      title: '기존: 개인 GitHub 계정 초대 & 수작업 권한 부여',
      description: '개발자가 개인 계정으로 조직에 들어와 2FA 미설정 위험이 있고, 퇴사 시 팀별 레포지토리 권한이 잔존하는 보안 사각지대 존재',
      bottlenecks: [
        '신규 입사자 개발 환경 및 레포 권한 세팅에 2~3일 소요',
        '퇴사자 발생 시 수백 개 레포에서 수동 제거 누락 위험',
        '전사 500명 권한 현황을 한눈에 감사(Audit)하기 불가능'
      ]
    },
    afterArchitecture: {
      title: '개선: GitHub EMU + Okta SCIM 실시간 프로비저닝',
      description: '회사 이메일 기반 전용 계정 자동 생성, IdP 그룹(Group Rules)에 따라 레포지토리 권한을 즉시 매핑하고 퇴사 시 1초 만에 일괄 비활성화',
      improvements: [
        '개발자 권한 온보딩 소요 시간 3일 → 2시간 이내로 단축',
        '퇴사자 계정 잔존 및 비인가 접근 사고 0건',
        'SCIM 프로토콜 기반 전사 500명 RBAC 완전 자동화'
      ]
    },
    nodes: [
      { id: 'okta', label: '사내 IdP (Okta / Google IdP)', sublabel: 'Single Source of Truth', type: 'security', iconName: 'ShieldCheck', status: 'active', description: '인사 시스템 연동 직원 디렉터리' },
      { id: 'scim', label: 'SCIM 2.0 프로비저닝 엔진', sublabel: 'System for Cross-domain Identity', type: 'gateway', iconName: 'RefreshCw', status: 'optimized', description: '사용자 생성/수정/삭제 이벤트 실시간 전달' },
      { id: 'github-emu', label: 'GitHub Enterprise (EMU)', sublabel: 'Managed Users Only', type: 'compute', iconName: 'Github', status: 'optimized', description: '사내 관리 전용 GitHub 계정 격리' },
      { id: 'team-sync', label: 'IdP Group Sync 매핑', sublabel: 'RBAC Team Mapping', type: 'guardrail', iconName: 'Users', status: 'optimized', description: '부서/직무별 팀에 레포지토리 최소 권한 자동 부여' },
      { id: 'repos', label: '사내 450개 레포지토리', sublabel: 'Protected Codebase', type: 'storage', iconName: 'FolderGit2', status: 'monitored', description: '감사 로그 실시간 수집 및 안전한 협업' }
    ],
    edges: [
      { from: 'okta', to: 'scim', label: '입퇴사/부서이동 이벤트', protocol: 'SCIM REST API', isOptimized: true },
      { from: 'scim', to: 'github-emu', label: '계정 자동 생성/정지', protocol: 'GitHub SCIM API' },
      { from: 'okta', to: 'team-sync', label: 'SAML SSO 속성 동기화', protocol: 'SAML 2.0 Assertion' },
      { from: 'team-sync', to: 'repos', label: '팀별 레포지토리 RBAC 매핑', protocol: 'GitHub Team API', isOptimized: true }
    ],
    pipelineSteps: [
      { step: 1, phase: '인사 시스템 직원 등록', action: 'HR 시스템에서 신규 엔지니어 등록', detail: 'Okta에 사용자 생성 및 소속 팀(예: SRE Platform) 그룹 할당', durationOrMetric: '인사 트리거' },
      { step: 2, phase: 'SCIM 2.0 실시간 프로비저닝', action: 'Okta가 GitHub EMU API로 계정 생성 요청', detail: 'daangn_honggildong 전용 관리 계정 3초 만에 생성', durationOrMetric: '소요 3초' },
      { step: 3, phase: '팀 기반 레포 권한 자동 매핑', action: 'IdP Group Sync로 해당 직무 레포지토리 바인딩', detail: '기본 Read/Write 권한 및 워크플로우 접근권 즉시 획득', durationOrMetric: '온보딩 2시간' },
      { step: 4, phase: 'SAML SSO 및 하드웨어 2FA 강제', action: '개인 비밀번호 대신 회사 SSO 인증 강제', detail: 'FIDO2 WebAuthn 보안키로 계정 탈취 원천 차단', durationOrMetric: '보안 100%' },
      { step: 5, phase: '퇴사 시 원클릭 전수 차단', action: 'Okta 비활성화 즉시 GitHub 모든 세션 만료', detail: '450개 레포지토리 토큰 및 SSH 키 1초 만에 무효화', durationOrMetric: '1초 차단' }
    ],
    keySpecs: [
      { component: 'Enterprise Type', role: '계정 관리 격리', tech: 'GitHub EMU (Enterprise Managed Users)', keyConfig: 'Normalized usernames: daangn_<handle>' },
      { component: 'Identity Sync', role: '사용자 생명주기 관리', tech: 'SCIM 2.0 API', keyConfig: 'Push Users, Push Groups, Real-time deprovisioning' },
      { component: 'Authentication', role: '단일 인증 체계', tech: 'SAML 2.0 SSO', keyConfig: 'Enforce SSO for all repository and CLI access' },
      { component: 'Governance', role: '감사 및 감사 추적', tech: 'GitHub Audit Log Streaming', keyConfig: 'Stream to AWS S3 & Datadog' }
    ],
    mermaidCode: `graph LR
  A[인사 시스템 / Okta IdP] -->|SCIM 2.0 실시간 동기화| B[GitHub EMU 엔터프라이즈]
  A -->|SAML SSO 그룹 매핑| C[IdP Group Sync]
  B --> D[전용 관리 계정 생성: daangn_*]
  C --> E[팀별 레포지토리 RBAC 권한 자동 부여]
  D & E --> F[온보딩 3일 -> 2시간 단축 / 퇴사 시 1초 전수 차단]`,
    asciiDiagram: `[인사 시스템 / Okta IdP] ──(SCIM 2.0 자동화)──► [GitHub Enterprise Managed Users]
            │                                                      │
            │ (SAML SSO 그룹 규칙)                                 │
            ▼                                                      ▼
  [IdP Group Sync 팀 매핑] ────────────────────────► [전용 회사 계정 즉시 프로비저닝]
            │                                                      │
            ▼                                                      ▼
  [450개 레포지토리 RBAC 자동 부여]               [온보딩 3일 ➔ 2시간, 퇴사 시 1초 차단]`
  }
};
