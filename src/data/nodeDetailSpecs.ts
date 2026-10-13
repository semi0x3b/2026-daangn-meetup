export interface NodeDetailSpec {
  hardwareSpec: string;
  portsProtocols: string;
  architectureRole: string;
  productionConfigTitle: string;
  productionConfigLanguage: string;
  productionConfigCode: string;
  sreProductionTip: string;
  sloMetrics?: string;
}

export const NODE_DETAIL_SPECS: Record<string, Record<string, NodeDetailSpec>> = {
  'session-1': {
    'dev': {
      hardwareSpec: 'GitHub Enterprise Cloud / Workstation (Mac M3 / Linux)',
      portsProtocols: 'HTTPS / TLS 1.3 / Port 443',
      architectureRole: '개발자 PR 및 커밋 발생. 일일 수천 회의 모노레포 변경 사항을 감지하여 CI 파이프라인을 트리거합니다.',
      productionConfigTitle: '.github/workflows/ci.yml (정규화 타임스탬프 설정)',
      productionConfigLanguage: 'yaml',
      productionConfigCode: `name: High-Speed Monorepo CI
on:
  pull_request:
    types: [opened, synchronize, reopened]
jobs:
  build:
    runs-on: arc-runner-set-dnd
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2
      # 타임스탬프 불일치로 인한 캐시 버스팅 원천 방지
      - name: Normalize Git Commit mtime
        run: |
          git log -1 --format="%at" > .git_mtime
          find src -type f -exec touch -d "@$(cat .git_mtime)" {} +`,
      sreProductionTip: 'Git 체크아웃 시 파일 생성 시각(mtime)이 매번 달라지면 빌드 산출물의 SHA256 체크섬이 변해 캐시가 깨집니다. Git 커밋 타임스탬프로 정규화해야 99.4% 캐시 히트율이 보장됩니다.'
    },
    'arc': {
      hardwareSpec: 'K8s ARC Controller Pod (2 Core, 4GB RAM), HPA scale 10~200 pods',
      portsProtocols: 'K8s API Port 6443, GitHub Webhook Port 443 (Mutual TLS)',
      architectureRole: 'Actions Runner Controller가 깃허브 웹훅을 수신하고 Ephemeral 러너 파드를 즉각 프로비저닝합니다.',
      productionConfigTitle: 'arc-runner-set.yaml (K8s ARC AutoscalingRunnerSet)',
      productionConfigLanguage: 'yaml',
      productionConfigCode: `apiVersion: actions.github.com/v1alpha1
kind: AutoscalingRunnerSet
metadata:
  name: daangn-ephemeral-runner
  namespace: arc-runners
spec:
  minRunners: 10
  maxRunners: 250
  template:
    spec:
      containers:
        - name: runner
          image: ghcr.io/daangn/ci-runner:node20-v2
          volumeMounts:
            - mountPath: /cache
              name: nvme-local-cache
      volumes:
        - name: nvme-local-cache
          hostPath:
            path: /mnt/nvme-cache`,
      sreProductionTip: '파드 재사용 대신 Ephemeral 러너를 쓰되, 노드의 NVMe 디스크를 hostPath로 공유 마운트하여 파드가 사라져도 캐시는 노드 로컬에 남도록 설계해야 합니다.'
    },
    'runner': {
      hardwareSpec: 'c6id.4xlarge (16 vCPU, 32GB RAM, 950GB NVMe SSD 로컬 인스턴스 스토리지)',
      portsProtocols: 'Internal IPC / Unix Domain Socket / gRPC',
      architectureRole: '격리된 컨테이너 환경에서 pnpm 빌드, 타입 검사 및 유닛 테스트를 초고속 병렬 수행합니다.',
      productionConfigTitle: 'pnpm-cache-restore.sh (다단계 캐시 키 검사)',
      productionConfigLanguage: 'bash',
      productionConfigCode: `# 1단계: pnpm-lock.yaml 완벽 일치 키 탐색
CACHE_KEY="pnpm-$(sha256sum pnpm-lock.yaml | cut -d' ' -f1)"
if [ -d "/cache/$CACHE_KEY" ]; then
  echo ">>> [Cache Hit 100%] Fast Local Copying..."
  cp -al "/cache/$CACHE_KEY/node_modules" ./node_modules
else
  echo ">>> [Cache Miss] Falling back to parent branch..."
  cp -al "/cache/parent-branch/node_modules" ./node_modules || true
fi`,
      sreProductionTip: '파일 복사 시 일반 cp 대신 hardlink(cp -al)를 쓰면 1.5GB 용량도 0.8초 만에 복원이 완료되어 I/O 병목이 완전히 사라집니다.'
    },
    'cache-proxy': {
      hardwareSpec: '10Gbps AWS VPC Enhanced Networking / NVMe RAID-0 Direct I/O',
      portsProtocols: 'TCP Port 9091 (gRPC / HTTP2), NVMe IOPS 120,000',
      architectureRole: '노드 간 캐시를 고속 공유하는 사내 캐시 프록시 데몬. 동일 노드에 캐시가 없을 시 이웃 노드에서 10Gbps로 즉시 가져옵니다.',
      productionConfigTitle: 'cache-daemon-daemonset.yaml (K8s DaemonSet)',
      productionConfigLanguage: 'yaml',
      productionConfigCode: `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: nvme-cache-proxy
  namespace: ci-infra
spec:
  template:
    spec:
      hostNetwork: true
      containers:
        - name: proxy
          image: daangn/nvme-cache-daemon:v1.4
          env:
            - name: CACHE_DIR
              value: "/mnt/nvme-cache"
            - name: MAX_BANDWIDTH_GBPS
              value: "10"`,
      sreProductionTip: 'S3 원격 다운로드는 네트워크 RTT와 tar 압축 해제 때문에 30초 이상 걸립니다. 10Gbps 내부 프록시를 쓰면 1.8초 만에 1.5GB를 스트리밍할 수 있습니다.'
    },
    'buildkit': {
      hardwareSpec: 'BuildKit Daemon (mode=max), CPU limit: 8 core, Memory limit: 16Gi',
      portsProtocols: 'Docker Buildx TCP 1234 / TLS / OCI Registry v2',
      architectureRole: '도커 멀티스테이지 빌드의 모든 중간 레이어를 분석하여 변경되지 않은 레이어 빌드를 0초 스킵합니다.',
      productionConfigTitle: 'docker-build.sh (Buildx mode=max 실행)',
      productionConfigLanguage: 'bash',
      productionConfigCode: `docker buildx build \\
  --platform linux/amd64,linux/arm64 \\
  --cache-from type=registry,ref=registry.daangn.internal/ci/cache:latest \\
  --cache-to type=registry,ref=registry.daangn.internal/ci/cache:latest,mode=max \\
  --push \\
  -t registry.daangn.internal/app/feed:$(git rev-parse --short HEAD) .`,
      sreProductionTip: 'mode=min은 최종 이미지에 포함된 레이어만 캐시하지만, mode=max를 주면 빌드 스테이지(컴파일러, tsc 단계)의 중간 레이어까지 모두 캐시되어 재빌드 속도가 80% 단축됩니다.'
    },
    'registry': {
      hardwareSpec: 'Harbor / AWS ECR Private Registry (S3 Tiered Storage Backend)',
      portsProtocols: 'HTTPS Port 443 / Docker Registry API v2',
      architectureRole: '도커 레이어 캐시 및 배포용 OCI 아티팩트를 보관하는 고가용성 프라이빗 레지스트리입니다.',
      productionConfigTitle: 'registry-cache-policy.json (보관 주기 정책)',
      productionConfigLanguage: 'json',
      productionConfigCode: `{
  "rules": [
    {
      "tagFilter": "cache-*",
      "action": "expire",
      "params": { "days": 7 },
      "description": "최근 7일간 참조되지 않은 빌드 중간 캐시 자동 청소"
    }
  ]
}`,
      sreProductionTip: '레이어 캐시(mode=max)는 용량이 급증하므로 7일 미참조 캐시 자동 정리(Lifecycle policy)를 반드시 걸어야 레지스트리 스토리지 비용 폭증을 막을 수 있습니다.'
    }
  },
  'session-2': {
    'agent': {
      hardwareSpec: 'Developer IDE / Cursor / Claude Code / Autonomous CLI Agent',
      portsProtocols: 'JSON-RPC over stdio / Local Process Socket',
      architectureRole: 'AI 코딩 에이전트가 코드 수정 후 배포를 시도할 때, 무단 쉘 실행 대신 사내 MCP 도구 호출 함수를 실행합니다.',
      productionConfigTitle: 'mcp_servers.json (Claude / Cursor MCP 설정)',
      productionConfigLanguage: 'json',
      productionConfigCode: `{
  "mcpServers": {
    "daangn-deploy": {
      "command": "node",
      "args": ["/opt/daangn/mcp-deploy-server/dist/index.js"],
      "env": {
        "DAANGN_ENV": "production",
        "STRICT_WHITELIST_ONLY": "true"
      }
    }
  }
}`,
      sreProductionTip: '에이전트에게 쉘 명령어(Bash)를 주면 에러 발생 시 DB 롤백 등 파괴적 명령을 멋대로 수행합니다. 반드시 허용된 함수만 노출하는 MCP 서버로 격리하세요.'
    },
    'mcp-server': {
      hardwareSpec: 'Node.js TypeScript MCP Server (Strict Schema Validation)',
      portsProtocols: 'JSON-RPC 2.0 / HTTPS REST API',
      architectureRole: '오직 deploy_service_canary, evaluate_canary_health 등 사전 승인된 화이트리스트 함수만 처리합니다.',
      productionConfigTitle: 'deploy-tool-definition.ts (MCP 도구 스키마)',
      productionConfigLanguage: 'typescript',
      productionConfigCode: `export const deployCanaryTool = {
  name: "deploy_service_canary",
  description: "안전하게 카나리 10% 파드를 배포하고 트래픽 소킹을 시작합니다.",
  inputSchema: {
    type: "object",
    properties: {
      serviceName: { type: "string" },
      imageTag: { type: "string", pattern: "^[a-f0-9]{7,40}$" },
      canaryWeight: { type: "number", maximum: 10 }
    },
    required: ["serviceName", "imageTag"]
  }
};`,
      sreProductionTip: 'imageTag를 Git Commit SHA 패턴으로 정규식 검증하지 않으면 에이전트가 최신 latest 태그를 넣어 기존 배포를 덮어쓰는 사고가 발생할 수 있습니다.'
    },
    'argocd': {
      hardwareSpec: 'ArgoCD Rollouts Controller (HA 3 Replicas in K8s)',
      portsProtocols: 'K8s CRD Controller / Istio VirtualService Route Weight API',
      architectureRole: '신규 버전 파드를 10%만 가동하고 Ingress/Istio 라우팅 가중치를 10%로 미세 조정합니다.',
      productionConfigTitle: 'rollout.yaml (ArgoCD Rollout 스펙)',
      productionConfigLanguage: 'yaml',
      productionConfigCode: `apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: feed-service
spec:
  strategy:
    canary:
      steps:
        - setWeight: 10
        - pause: { duration: 5m } # 최소 5분간 트래픽 소킹
      trafficRouting:
        istio:
          virtualService:
            name: feed-vservice`,
      sreProductionTip: '카나리 배포 직후 트래픽이 0인 상태에서 에러가 없다고 바로 100% 승격하면 대형 장애가 납니다. 최소 5분간 pause를 강제하세요.'
    },
    'soak-gate': {
      hardwareSpec: 'Prometheus PromQL Validator Engine (Real-time Metric Stream)',
      portsProtocols: 'PromQL HTTP API / Port 9090',
      architectureRole: '최소 5분 동안 RPS > 100 조건과 5xx 에러율 < 0.01% 조건을 실시간 연산하여 승인 가능 여부를 결정합니다.',
      productionConfigTitle: 'canary-slo-check.promql (SLO 검증 쿼리)',
      productionConfigLanguage: 'promql',
      productionConfigCode: `# RPS가 100 이상이면서 5xx 에러율이 0.01% 이하인지 검증
(
  sum(rate(http_requests_total{status=~"5..", version="canary"}[5m]))
  /
  sum(rate(http_requests_total{version="canary"}[5m]))
) < 0.0001
and
sum(rate(http_requests_total{version="canary"}[5m])) > 100`,
      sreProductionTip: '단순 5xx 체크뿐만 아니라 "충분한 RPS가 유입되었는가"를 AND 조건으로 묶어야 새벽 시간대 0 RPS로 인한 허위 정상 판별을 방지할 수 있습니다.'
    },
    'slack': {
      hardwareSpec: 'Slack App Interactive Webhook / AWS KMS Signature Verification',
      portsProtocols: 'HTTPS Webhook / Slack Block Kit JSON Payload',
      architectureRole: 'P99 레이턴시, 에러율, AI 변경 요약본을 슬랙 채널에 게시하고 담당 엔지니어 1클릭 승인을 받습니다.',
      productionConfigTitle: 'slack-modal.json (인터랙티브 결재 블록)',
      productionConfigLanguage: 'json',
      productionConfigCode: `{
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*🚀 [feed-service:a7b8c9] 카나리 10% 검증 완료*\\n• RPS: 142 req/s (5분 유지)\\n• 5xx 에러율: 0.00%\\n• P99 레이턴시: 28ms (-12% 개선)"
      }
    },
    {
      "type": "actions",
      "elements": [
        { "type": "button", "text": { "type": "plain_text", "text": "✅ 100% 승격" }, "style": "primary", "action_id": "approve" },
        { "type": "button", "text": { "type": "plain_text", "text": "🛑 즉시 롤백" }, "style": "danger", "action_id": "rollback" }
      ]
    }
  ]
}`,
      sreProductionTip: '승인 버튼 클릭 시 발송자의 슬랙 ID와 GitHub 저장소 쓰기 권한을 대조(SCIM 연동)하여 허가된 온콜 엔지니어만 배포할 수 있도록 만드세요.'
    }
  },
  'session-3': {
    'traffic': {
      hardwareSpec: '당근 사용자 피크 트래픽 (저녁 7시~10시 트래픽 4.2배 급증)',
      portsProtocols: 'HTTPS / AWS ALB / Kubernetes Ingress',
      architectureRole: '동네생활 및 중고거래 피크 트래픽 유입으로 인해 K8s HPA가 수천 개의 파드를 즉시 생성합니다.',
      productionConfigTitle: 'hpa.yaml (Horizontal Pod Autoscaler)',
      productionConfigLanguage: 'yaml',
      productionConfigCode: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: daangn-feed-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: feed-server
  minReplicas: 20
  maxReplicas: 300
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 65`,
      sreProductionTip: 'HPA가 파드를 늘렸을 때 클러스터 노드가 부족하면 Pending 상태에 빠집니다. 이때 노드가 얼마나 빨리 뜨는지가 전체 서비스 가용성을 좌우합니다.'
    },
    'karpenter': {
      hardwareSpec: 'Karpenter Controller v1.0 (Leader Election HA, 2 Replicas)',
      portsProtocols: 'Kubernetes Watch API / EC2 Fleet API',
      architectureRole: 'kube-scheduler에서 할당되지 않은 Pending 파드의 CPU, 메모리, 토폴로지를 분석하여 1초 만에 최적 인스턴스를 조합합니다.',
      productionConfigTitle: 'nodepool.yaml (Karpenter v1.0 통합 NodePool)',
      productionConfigLanguage: 'yaml',
      productionConfigCode: `apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: general-workload
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
        - key: karpenter.k8s.aws/instance-category
          operator: In
          values: ["c", "m", "r"]
      nodeClassRef:
        group: karpenter.k8s.aws
        kind: EC2NodeClass
        name: default-al2023`,
      sreProductionTip: 'ASG 45개를 유지하던 방식에서 단일 NodePool로 통합하면 유지보수 공수가 0이 되며, Graviton(ARM64)과 x86을 함께 지정해 Spot 재고 고갈을 방지할 수 있습니다.'
    },
    'ec2-fleet': {
      hardwareSpec: 'AWS EC2 Fleet Direct API (우회 ASG)',
      portsProtocols: 'AWS IAM Role / HTTPS Port 443 / AWS SDK v2',
      architectureRole: 'ASG 생성/수정/헬스체크 단계를 거치지 않고 EC2 CreateFleet API를 직접 호출해 35초 만에 인스턴스를 즉각 기동합니다.',
      productionConfigTitle: 'ec2nodeclass.yaml (서브넷 및 보안그룹 동적 바인딩)',
      productionConfigLanguage: 'yaml',
      productionConfigCode: `apiVersion: karpenter.k8s.aws/v1
kind: EC2NodeClass
metadata:
  name: default-al2023
spec:
  amiFamily: AL2023
  subnetSelectorTerms:
    - tags:
        karpenter.sh/discovery: daangn-eks-prod
  securityGroupSelectorTerms:
    - tags:
        karpenter.sh/discovery: daangn-eks-prod
  blockDeviceMappings:
    - deviceName: /dev/xvda
      ebs:
        volumeSize: 80Gi
        volumeType: gp3
        iops: 3000`,
      sreProductionTip: 'AMI를 Amazon Linux 2023(AL2023)으로 지정하면 containerd 최적화 덕분에 부팅부터 Kubelet Ready까지 걸리는 시간이 15초 단축됩니다.'
    },
    'nodepool': {
      hardwareSpec: 'c6g.2xlarge ~ c6g.8xlarge (Graviton3), Spot Instance Pool',
      portsProtocols: 'Kubelet Port 10250, CNI VPC Secondary IP',
      architectureRole: '파드 크기에 딱 맞춘 인스턴스가 35초 만에 준비되어 대기열 없이 파드를 즉시 수용합니다.',
      productionConfigTitle: 'toleration-and-pdb.yaml (Spot 중단 대비 Pod 설정)',
      productionConfigLanguage: 'yaml',
      productionConfigCode: `apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: feed-pdb
spec:
  minAvailable: 80%
  selector:
    matchLabels:
      app: feed-server
---
# Spot 인스턴스 중단 알림 2분 처리
# Karpenter Native Interruption Handling이 자동으로 파드를 선반납함`,
      sreProductionTip: 'Spot 인스턴스를 프로덕션에 쓸 때는 PDB(Pod Disruption Budget)를 minAvailable 80%로 설정하여 Karpenter가 노드를 롤링할 때 절대 장애가 나지 않게 통제해야 합니다.'
    },
    'consolidation': {
      hardwareSpec: 'Karpenter Consolidation Engine (Continuous Bin-packing)',
      portsProtocols: 'Internal Scheduler Loop / 1분 간격 유휴 검사',
      architectureRole: '피크 시간이 지나 트래픽이 줄어들면, 흩어진 파드들을 빈 노드로 재배치하고 빈 노드를 AWS에 즉각 반납합니다.',
      productionConfigTitle: 'consolidation-policy.yaml (자동 압축 설정)',
      productionConfigLanguage: 'yaml',
      productionConfigCode: `spec:
  disruption:
    consolidationPolicy: WhenEmptyOrUnderutilized
    consolidateAfter: 1m
    expireAfter: 720h # 30일마다 최신 보안 패치 노드로 자동 교체`,
      sreProductionTip: 'consolidateAfter를 1분으로 설정하면 유휴 노드가 남지 않아 월 인프라 비용이 28% 즉시 절감됩니다.'
    }
  },
  'session-4': {
    'ai-workload': {
      hardwareSpec: '당근 검색/추천 임베딩 & 거대 언어 모델 서빙 워커',
      portsProtocols: 'gRPC / HTTP/2 / TCP 8000',
      architectureRole: '대규모 임베딩 연산 및 추론 요청을 KubeRay 클러스터로 전달합니다.',
      productionConfigTitle: 'rayjob.yaml (KubeRay 잡 정의)',
      productionConfigLanguage: 'yaml',
      productionConfigCode: `apiVersion: ray.io/v1
kind: RayJob
metadata:
  name: daangn-embedding-eval
spec:
  rayClusterSpec:
    rayVersion: '2.9.0'
    headGroupSpec:
      rayStartParams:
        dashboard-host: '0.0.0.0'`,
      sreProductionTip: 'TPU는 CPU/GPU와 달리 2D 토폴로지 구조를 요구하므로 단일 컨테이너가 아닌 KubeRay 오케스트레이션이 필수적입니다.'
    },
    'kuberay': {
      hardwareSpec: 'GKE KubeRay Controller (TPU v5e Slice Manager)',
      portsProtocols: 'Kubernetes Custom Resource / Ray Cluster API',
      architectureRole: '주간에는 실시간 추론용으로 TPU를 할당하고, 야간 유휴 시간대에는 대규모 오프라인 배치 파이프라인으로 전환합니다.',
      productionConfigTitle: 'tpu-slice-switch.sh (주야간 전환 스크립트)',
      productionConfigLanguage: 'bash',
      productionConfigCode: `# 주간: 실시간 검색 임베딩 서빙 (16 슬라이스 분할)
kubectl apply -f tpu-serving-slice.yaml

# 야간 (23:00~07:00): 오프라인 대규모 벡터 인덱싱 배치 작업으로 동적 스위칭
kubectl scale deployment/serving --replicas=2
kubectl apply -f tpu-batch-indexing-rayjob.yaml`,
      sreProductionTip: 'TPU를 24시간 서빙 전용으로 두면 야간 가동률이 15%로 급락합니다. 주야간 전환 스케줄링으로 가동률을 82%까지 끌어올리세요.'
    },
    'tpu-v5e': {
      hardwareSpec: 'Google Cloud TPU v5e-16 (2x4 2D Mesh Topology, 256GB HBM)',
      portsProtocols: 'ICI (Inter-Chip Interconnect) / Sub-microsecond Latency',
      architectureRole: '초저지연 2D 토폴로지 메시망으로 묶인 TPU 칩들이 대규모 텐서 병렬 연산을 수행합니다.',
      productionConfigTitle: 'tpu-pod-slice.yaml (GKE TPU v5e 리소스 선언)',
      productionConfigLanguage: 'yaml',
      productionConfigCode: `resources:
  limits:
    google.com/tpu: "16"
  requests:
    google.com/tpu: "16"
nodeSelector:
  cloud.google.com/gke-tpu-accelerator: tpu-v5e-slice
  cloud.google.com/gke-tpu-topology: 2x4`,
      sreProductionTip: 'gke-tpu-topology를 2x4로 정확히 명시해야 토폴로지 인식 스케줄러가 물리적으로 인접한 TPU 칩을 배정해 통신 지연을 없앱니다.'
    },
    'xla-cache': {
      hardwareSpec: 'Google Cloud Storage (GCS) Persistent Compilation Cache Bucket',
      portsProtocols: 'HTTPS / GCS API / Local RAM disk',
      architectureRole: 'XLA 그래프 컴파일 산출물을 영구 보관하여 신규 파드 기동 시 콜드스타트를 4분에서 8초로 단축합니다.',
      productionConfigTitle: 'xla-env.sh (XLA 영구 캐시 환경변수)',
      productionConfigLanguage: 'bash',
      productionConfigCode: `export JAX_COMPILATION_CACHE_DIR="/mnt/gcs-cache"
export XLA_FLAGS="--xla_gpu_enable_latency_hiding_scheduler=true"
# 영구 캐시 디렉터리 동기화로 재컴파일 방지`,
      sreProductionTip: 'JAX/TensorFlow는 TPU 기동 시 XLA 컴파일에만 3~5분이 걸립니다. GCS 마운트 영구 캐시를 설정하면 컴파일 단계가 즉시 스킵됩니다.'
    }
  },
  'session-5': {
    'telemetry': {
      hardwareSpec: '초당 수십만 건의 애플리케이션 로그, 메트릭, OTel 분산 트레이스',
      portsProtocols: 'OTLP (OpenTelemetry Protocol) / gRPC 4317, HTTP 4318',
      architectureRole: '전사 마이크로서비스에서 발생하는 방대한 텔레메트리 원천 데이터를 수집합니다.',
      productionConfigTitle: 'otel-collector.yaml (OpenTelemetry 수집기)',
      productionConfigLanguage: 'yaml',
      productionConfigCode: `receivers:
  otlp:
    protocols:
      grpc: { endpoint: 0.0.0.0:4317 }
processors:
  batch:
    timeout: 1s
    send_batch_size: 1024
exporters:
  otlp/ai-agent:
    endpoint: ai-observability-agent.daangn.internal:50051`,
      sreProductionTip: '원천 로그를 무작정 대시보드에 뿌리면 알람 피로(Alert Fatigue)로 인해 정작 중요한 장애를 놓치게 됩니다.'
    },
    'vector': {
      hardwareSpec: 'Vector Aggregator Cluster (High-throughput Rust Engine)',
      portsProtocols: 'TCP / Rust Native Tokio Async',
      architectureRole: '반복 노이즈 로그를 88% 압축 필터링하고 핵심 이상 징후 이벤트만 AI 파이프라인으로 라우팅합니다.',
      productionConfigTitle: 'vector.yaml (VRL 노이즈 필터링 규칙)',
      productionConfigLanguage: 'yaml',
      productionConfigCode: `transforms:
  filter_noise:
    type: remap
    inputs: ["in_logs"]
    source: |
      # 헬스체크 및 단순 반복 디버그 로그 제거
      if match(string!(.message), r'/(healthz|readyz|metrics)/') {
        abort
      }
      .criticality = if .status >= 500 { "high" } else { "normal" }`,
      sreProductionTip: 'Vector의 VRL(Vector Remap Language)로 헬스체크와 단순 성공 로그를 사전에 드롭하면 스토리지 비용과 AI 토큰 비용이 88% 절감됩니다.'
    },
    'ai-agent': {
      hardwareSpec: 'AI Observability Engine (Vector Embeddings + RAG Incident History)',
      portsProtocols: 'gRPC / Slack Webhook / LLM API',
      architectureRole: '이상 징후 발생 시 Grafana 800개 대시보드를 사람이 찾지 않아도, 원인 PR과 롤백 가이드를 30초 내에 합성합니다.',
      productionConfigTitle: 'incident-agent-prompt.md (원인 분석 에이전트)',
      productionConfigLanguage: 'markdown',
      productionConfigCode: `당신은 당근 SRE 인시던트 분석 에이전트입니다.
입력 데이터:
1. 최근 15분간 에러 로그 스택트레이스
2. 최근 1시간 배포 PR 목록 (ArgoCD Sync 기록)
3. 분산 트레이스 지연 스팬
출력 형식:
- 추정 원인 (1문장)
- 결정적 근거 3개 (로그/스팬/배포 커밋 매핑)
- 즉각 조치 권고안 (롤백 커맨드 포함)`,
      sreProductionTip: '단순 알람 메시지가 아닌 "직전 배포된 PR #1042의 Redis 연결 풀 누수"처럼 원인 커밋을 짚어줘야 MTTR(복구 시간)이 45분에서 8분으로 줄어듭니다.'
    },
    'slack-alert': {
      hardwareSpec: 'Slack SRE War-Room Interactive Channel',
      portsProtocols: 'HTTPS / Slack Block Kit API',
      architectureRole: '엔지니어에게 군더더기 없는 원인 진단과 1클릭 롤백 액션 버튼을 즉각 제공합니다.',
      productionConfigTitle: 'smart-alert-card.json (슬랙 스마트 알람)',
      productionConfigLanguage: 'json',
      productionConfigCode: `{
  "blocks": [
    {
      "type": "header",
      "text": { "type": "plain_text", "text": "🚨 [장애 원인 감지] chat-api 지연시간 급증" }
    },
    {
      "type": "section",
      "text": { "type": "mrkdwn", "text": "*원인 규명*: PR #3412 배포 후 Redis 커넥션 타임아웃 발생\\n*영향도*: 동네채팅 P99 3500ms\\n*추천 조치*: \`kubectl rollout undo deployment/chat-api\`" }
    }
  ]
}`,
      sreProductionTip: '알람에 즉시 실행 가능한 롤백 버튼이나 확인된 명령어 스니펫을 포함시키는 것이 야간 온콜 엔지니어의 인지 부하를 줄이는 핵심입니다.'
    }
  },
  'session-6': {
    'traffic': {
      hardwareSpec: '초당 수만 건의 마이크로서비스 간 통신 (간헐적 504 타임아웃 발생 환경)',
      portsProtocols: 'TCP / HTTP/1.1 & HTTP/2',
      architectureRole: '사용자 트래픽이 프론트엔드에서 백엔드 마이크로서비스로 전달되는 과정입니다.',
      productionConfigTitle: 'service-request.sh (간헐적 타임아웃 재현)',
      productionConfigLanguage: 'bash',
      productionConfigCode: `# 간헐적으로 발생하는 504 Gateway Timeout 모니터링
curl -i -X POST https://api.daangn.internal/v1/trade/list \\
  -H "Content-Type: application/json" \\
  --max-time 3`,
      sreProductionTip: '간헐적인 네트워크 지연은 애플리케이션 로그에 찍히지 않고 인프라 어디선가 패킷이 드롭되므로 커널 레벨 계측이 필수적입니다.'
    },
    'kernel': {
      hardwareSpec: 'Linux Kernel 6.1 LTS / TCP IP Stack / Conntrack Table',
      portsProtocols: 'Kernel Ring Buffer / kprobe / tracepoint',
      architectureRole: '리눅스 커널의 네트워크 소켓 상태 머신 및 conntrack 테이블을 직접 계측합니다.',
      productionConfigTitle: 'sysctl.conf (TCP 커널 파라미터 튜닝)',
      productionConfigLanguage: 'ini',
      productionConfigCode: `net.ipv4.tcp_max_syn_backlog = 8192
net.core.somaxconn = 8192
net.netfilter.nf_conntrack_max = 1048576
net.ipv4.tcp_tw_reuse = 1`,
      sreProductionTip: '대규모 트래픽 환경에서 conntrack 테이블이 꽉 차면 패킷이 조용히 드롭(Silent Drop)되어 애플리케이션에 504가 뜹니다.'
    },
    'ebpf-probe': {
      hardwareSpec: 'eBPF Program (Clang/LLVM BPF Backend, Ring Buffer)',
      portsProtocols: 'Kernel BPF Bytecode / BPF_MAP_TYPE_RINGBUF',
      architectureRole: '사이드카 프록시 없이 커널 kprobe/tracepoint에 훅을 걸어 CPU 0.3% 부하로 모든 TCP RTT와 패킷 드롭을 실시간 캡처합니다.',
      productionConfigTitle: 'tcp_drop.bpf.c (커널 패킷 드롭 추적 BPF 코드)',
      productionConfigLanguage: 'c',
      productionConfigCode: `#include <vmlinux.h>
#include <bpf/bpf_tracing.h>

SEC("tracepoint/skb/kfree_skb")
int trace_kfree_skb(struct trace_event_raw_kfree_skb *ctx) {
    u32 location = (u32)(long)ctx->location;
    // 패킷 드롭 발생 시 즉시 BPF 링 버퍼에 송신
    bpf_printk("Packet Drop at kernel loc: 0x%x\\n", location);
    return 0;
}
char LICENSE[] SEC("license") = "GPL";`,
      sreProductionTip: 'tcpdump는 부하가 커서 프로덕션에 돌릴 수 없지만, eBPF는 커널 내부에서 필터링 후 링 버퍼로 이벤트만 쏘기 때문에 성능 저하가 전혀 없습니다.'
    },
    'cilium': {
      hardwareSpec: 'Cilium CNI v1.15 (eBPF-native kube-proxy replacement)',
      portsProtocols: 'eBPF TC (Traffic Control) / XDP / Direct Server Return',
      architectureRole: 'iptables를 완전히 제거하고 커널 eBPF 라우팅으로 패킷을 고속 포워딩합니다.',
      productionConfigTitle: 'cilium-values.yaml (eBPF CNI 설정)',
      productionConfigLanguage: 'yaml',
      productionConfigCode: `kubeProxyReplacement: "strict"
k8sServiceHost: "127.0.0.1"
k8sServicePort: "6443"
bpf:
  masquerade: true
  tproxy: true
prometheus:
  enabled: true`,
      sreProductionTip: 'iptables 룰이 수만 개로 늘어나면 O(N) 순차 탐색 때문에 레이턴시가 튑니다. Cilium eBPF는 O(1) BPF 맵 룩업으로 전환하여 패킷 지연을 제거합니다.'
    }
  },
  'session-7': {
    'github': {
      hardwareSpec: 'GitHub Actions Runner (OIDC Token Request)',
      portsProtocols: 'HTTPS / RFC 8693 OAuth 2.0 Token Exchange',
      architectureRole: '정적 AWS IAM Access Key/Secret 대신 깃허브가 서명한 단기 OIDC JWT 토큰을 요청합니다.',
      productionConfigTitle: 'aws-oidc-step.yml (GitHub Actions OIDC 연동)',
      productionConfigLanguage: 'yaml',
      productionConfigCode: `permissions:
  id-token: write # OIDC 토큰 발급에 필수
  contents: read
steps:
  - name: Configure AWS Credentials via OIDC
    uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::123456789012:role/daangn-ci-deployer
      aws-region: ap-northeast-2
      audience: sts.amazonaws.com`,
      sreProductionTip: '저장소 secrets에 AWS_ACCESS_KEY_ID를 넣어두는 순간 유출 위험이 상존합니다. OIDC를 쓰면 정적 키를 100% 삭제할 수 있습니다.'
    },
    'sts': {
      hardwareSpec: 'AWS STS (Security Token Service) AssumeRoleWithWebIdentity',
      portsProtocols: 'HTTPS / TLS 1.3 / Port 443',
      architectureRole: '깃허브 OIDC 토큰의 서명과 클레임을 검증하고 15분 만료 단기 임시 자격 증명을 발급합니다.',
      productionConfigTitle: 'iam-trust-policy.json (AWS IAM 신뢰 정책)',
      productionConfigLanguage: 'json',
      productionConfigCode: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:daangn/*:ref:refs/heads/main"
        }
      }
    }
  ]
}`,
      sreProductionTip: '신뢰 정책에서 sub 클레임에 repo:daangn/*:ref:refs/heads/main 조건을 걸어야 포크된 브랜치나 타인이 임의로 권한을 탈취하는 것을 방어할 수 있습니다.'
    },
    'aws-infra': {
      hardwareSpec: 'AWS Cloud Resources (S3, ECR, EKS, DynamoDB)',
      portsProtocols: 'AWS SigV4 Signed API',
      architectureRole: '단기 토큰으로 안전하게 인증된 빌드/배포 작업을 수행합니다.',
      productionConfigTitle: 'zero-static-key-audit.sh (정적 키 전수 삭제 스크립트)',
      productionConfigLanguage: 'bash',
      productionConfigCode: `# 전사 450개 IAM 정적 Access Key 감사 및 비활성화
aws iam list-users --query 'Users[*].UserName' --output text | tr '\\t' '\\n' | while read user; do
  keys=$(aws iam list-access-keys --user-name "$user" --query 'AccessKeyMetadata[*].AccessKeyId' --output text)
  for key in $keys; do
    echo "Deactivating static key: $key for $user"
    aws iam update-access-key --user-name "$user" --access-key-id "$key" --status Inactive
  done
done`,
      sreProductionTip: '15분 후 자동 만료되는 단기 세션 토큰만 사용되므로, 러너 로그에 토큰이 노출되어도 즉시 무효화되어 침해 사고가 불가능합니다.'
    }
  },
  'session-8': {
    'client-sdk': {
      hardwareSpec: '사내 공통 Go/Python 캐시 클라이언트 SDK',
      portsProtocols: 'RESP3 (Redis Serialization Protocol v3) / TCP',
      architectureRole: '토폴로지 변경 자동 감지, DNS 캐시 고착 방지, MOVED/ASK 에러 지수 백오프 재시도 로직을 내장한 SDK입니다.',
      productionConfigTitle: 'cache_sdk.go (사내 캐시 클라이언트 서킷브레이커)',
      productionConfigLanguage: 'go',
      productionConfigCode: `type CacheClient struct {
    cluster *valkey.ClusterClient
    breaker *gobreaker.CircuitBreaker
}

func (c *CacheClient) GetWithRetry(ctx context.Context, key string) (string, error) {
    // MOVED/ASK 에러 시 토폴로지 즉시 리프레시 후 최대 3회 재시도
    return c.cluster.Do(ctx, c.cluster.B().Get().Key(key).Build()).ToString()
}`,
      sreProductionTip: '페일오버 직후 클라이언트가 DNS를 캐싱하고 있으면 이전 마스터로 쓰기를 계속 보내 MOVED 에러 폭풍이 발생합니다. SDK 차원에서 토폴로지 자동 갱신을 구현해야 합니다.'
    },
    'valkey-cluster': {
      hardwareSpec: 'Valkey 8.0 Primary-Replica Multi-shard Cluster (32GB Nodes)',
      portsProtocols: 'TCP Port 6379 (Client), Port 16379 (Cluster Bus)',
      architectureRole: 'Redis 호환 오픈소스 고성능 인메모리 저장소. 실시간 복제 스트림을 유지하며 무중단 롤링 페일오버를 수행합니다.',
      productionConfigTitle: 'valkey.conf (Valkey 8.0 무중단 설정)',
      productionConfigLanguage: 'ini',
      productionConfigCode: `cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
repl-backlog-size 256mb
maxmemory 24gb
maxmemory-policy volatile-lru
io-threads 4`,
      sreProductionTip: 'repl-backlog-size를 기본값보다 넉넉한 256MB로 잡아야 페일오버 중 일시적 네트워크 순단 발생 시 전체 풀 동기화(Full Sync) 없이 부분 동기화로 복구됩니다.'
    },
    'hotkey-guard': {
      hardwareSpec: 'L1 Local In-Memory Cache (BigCache / TinyLFU in Application Memory)',
      portsProtocols: 'Process Memory Direct Access (0ns Network Latency)',
      architectureRole: '특정 인기 게시글 등 핫키 트래픽을 프로세스 내부 메모리에 1~3초 캐싱하여 캐시 서버 CPU 스파이크를 원천 차단합니다.',
      productionConfigTitle: 'hotkey-defense.go (L1 메모리 캐시 가드)',
      productionConfigLanguage: 'go',
      productionConfigCode: `// L1 로컬 메모리 캐시 (1초 TTL) -> L2 Valkey 원격 클러스터
func GetFeedDetail(feedId string) (*Feed, error) {
    if val, found := localL1Cache.Get(feedId); found {
        return val.(*Feed), nil // 0ms 초고속 리턴
    }
    feed, err := valkeyCluster.Get(feedId)
    localL1Cache.SetWithTTL(feedId, feed, 1*time.Second)
    return feed, err
}`,
      sreProductionTip: '인기 게시글에 초당 수만 건의 조회가 몰릴 때 L1 로컬 캐시 1초 TTL만 적용해도 백엔드 Valkey 부하가 99% 감소합니다.'
    }
  },
  'session-9': {
    'okta': {
      hardwareSpec: 'Okta Enterprise IdP (Single Sign-On & SCIM API)',
      portsProtocols: 'SAML 2.0 / SCIM 2.0 / HTTPS Port 443',
      architectureRole: '사내 인사 시스템(HR)과 연동된 전사 중앙 계정 디렉터리입니다.',
      productionConfigTitle: 'okta-scim-config.json (SCIM 사용자 속성 매핑)',
      productionConfigLanguage: 'json',
      productionConfigCode: `{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "userName": "user@daangn.com",
  "name": { "familyName": "Kim", "givenName": "Daangn" },
  "active": true,
  "groups": ["daangn-engineers", "sre-team"]
}`,
      sreProductionTip: '개인 깃허브 계정(@gmail)을 사내 조직에 초대하면 퇴사 시 계정 회수가 누락되는 보안 구멍이 발생합니다.'
    },
    'emu-gateway': {
      hardwareSpec: 'GitHub Enterprise Managed Users (EMU) Provisioning Sync',
      portsProtocols: 'SCIM 2.0 Push API / Port 443',
      architectureRole: '입사/퇴사/팀 변경 시 1초 만에 깃허브 엔터프라이즈 계정을 자동 생성, 권한 부여, 또는 즉시 차단합니다.',
      productionConfigTitle: 'emu-saml-sso.xml (GitHub EMU SAML 정책)',
      productionConfigLanguage: 'xml',
      productionConfigCode: `<md:EntityDescriptor entityID="https://github.com/orgs/daangncorp">
  <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://github.com/logout"/>
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>
  </md:SPSSODescriptor>
</md:EntityDescriptor>`,
      sreProductionTip: 'EMU를 적용하면 `username_daangn` 형태의 격리된 회사 소유 계정만 발급되므로 개인 레포지토리와 회사 레포지토리가 완벽히 분리됩니다.'
    },
    'github-org': {
      hardwareSpec: 'GitHub Enterprise Cloud Organization (2FA Enforced, IP Whitelist)',
      portsProtocols: 'Git over HTTPS / SSH via SAML Token',
      architectureRole: '사내 코드베이스 및 저장소. Okta에서 비활성화되는 즉시 0초 만에 모든 SSH 키와 토큰이 만료됩니다.',
      productionConfigTitle: 'org-security-rules.json (조직 보안 정책)',
      productionConfigLanguage: 'json',
      productionConfigCode: `{
  "twoFactorRequirement": true,
  "samlSsoEnforced": true,
  "ipAllowListEnabled": true,
  "ipAllowList": ["123.45.67.89/32"],
  "membersCanCreateRepositories": false
}`,
      sreProductionTip: '퇴사 처리 시 Okta에서 클릭 한 번으로 GitHub, AWS, Datadog의 모든 접근 권한이 SCIM으로 1초 만에 일괄 회수되어 오프보딩 누락 0건을 달성했습니다.'
    }
  }
};
