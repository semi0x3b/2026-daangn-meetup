export interface VideoTimestamp {
  time: string;
  seconds: number;
  label: string;
  type: 'screen' | 'audio' | 'architecture' | 'code' | 'troubleshooting' | 'takeaway';
}

export interface TranscriptSegment {
  time: string;
  seconds: number;
  speaker: string;
  text: string;
}

export interface SessionData {
  id: string;
  index: number;
  videoId: string;
  title: string;
  speaker: string;
  category: 'CI/CD & 빌드' | 'AI & 배포' | 'Kubernetes & 인프라' | 'AI 인프라' | '옵저버빌리티' | '커널 & 네트워크' | '보안 & 거버넌스' | '데이터 & 캐시' | '엔터프라이즈 관리';
  duration: string;
  views: string;
  date: string;
  summary: string;
  keyTakeaways: string[];
  techStack: string[];
  screenAnalysis: {
    headline: string;
    diagramDescription: string;
    codeSnippet?: {
      language: string;
      title: string;
      code: string;
    };
    visualHighlights: string[];
  };
  audioAnalysis: {
    headline: string;
    spokenContext: string;
    troubleshootingStory: string;
    quantitativeResults: string[];
    speakerAdvice: string;
  };
  timestamps: VideoTimestamp[];
  recommendedQuestions: string[];
  fullTranscript: TranscriptSegment[];
}

export const PLAYLIST_INFO = {
  playlistId: 'PLVJW6xP-wT5Q',
  title: '2026 당근 빌더 밋업 | SRE Day',
  channel: '당근 팀 (Karrot Team)',
  eventDate: '2026. 10. 7.',
  totalVideos: 9,
  description: '4,300만 명이 가입한 하이퍼로컬 서비스를 지탱하는 당근 SRE/플랫폼 엔지니어들의 생생한 기술 고민과 시도, 성공과 실패의 경험을 공유한 9개 세션 통합 플레이리스트입니다.',
  youtubeUrl: 'https://www.youtube.com/playlist?list=PLVJW6xP-wT5Q',
};

export const SESSIONS_DATA: SessionData[] = [
  {
    id: 'session-1',
    fullTranscript: [
    {
        "time": "00:00",
        "seconds": 0,
        "speaker": "당근 SRE 플랫폼 엔지니어",
        "text": "안녕하세요. 당근 SRE 플랫폼 팀입니다. 오늘 발표할 주제는 '궁극의 CI 환경을 위한 여정 2: 캐시 히트율 100%에 도전하다'입니다. 2년 전 밋업에서 CI 기본 파이프라인 구축을 다뤘다면, 이번에는 대규모 모노레포 환경에서 매일 수천 번 일어나는 빌드와 테스트를 어떻게 2분대로 줄였는지 그 치열했던 과정을 말씀드리겠습니다."
    },
    {
        "time": "02:15",
        "seconds": 135,
        "speaker": "당근 SRE 플랫폼 엔지니어",
        "text": "당근은 현재 4,300만 명이 가입한 서비스로 성장하면서 수백 명의 개발자가 마이크로서비스와 프론트엔드 모노레포에 코드를 푸시합니다. 하루 평균 생성되는 PR과 CI 트리거만 수천 건에 달합니다. 그런데 개발자 설문에서 가장 불만이 높았던 항목이 바로 'CI 대기 시간'이었습니다. 평균 14분 30초, 길면 20분이 넘게 걸리는 빌드 대기 시간 때문에 개발 흐름이 끊기고 컨텍스트 스위칭 비용이 막대했습니다."
    },
    {
        "time": "05:10",
        "seconds": 310,
        "speaker": "당근 SRE 플랫폼 엔지니어",
        "text": "기존 인프라의 핵심 문제는 분산 K8s Ephemeral Runner 구조였습니다. 보안과 격리를 위해 작업마다 러너 파드가 새로 뜨고 죽는 방식인데, 러너가 뜰 때마다 기가바이트 단위의 pnpm store와 node_modules, 도커 베이스 이미지를 원격 네트워크에서 매번 새로 내려받아야 했습니다. 기존 actions/cache를 적용해 두었지만, 캐시 히트율은 고작 42%에 불과했습니다. 놀랍게도 캐시 히트율이 50% 미만일 때는 캐시 다운로드와 tar 압축 해제 시간 때문에 캐시를 안 쓰는 것보다 더 느렸습니다."
    },
    {
        "time": "08:40",
        "seconds": 520,
        "speaker": "당근 SRE 플랫폼 엔지니어",
        "text": "첫 번째 돌파구는 '결정론적 캐시 키 설계'였습니다. 기존에는 단순히 runner.os와 브랜치 이름을 키로 잡다 보니, 브랜치가 갈라지면 캐시가 전부 미스 났습니다. 이를 해결하기 위해 pnpm-lock.yaml 전체 해시뿐 아니라 각 패키지별 package.json 해시를 조합한 다단계 계층형 캐시 키를 설계했습니다. 최신 락파일이 정확히 일치하지 않더라도 restore-keys 폴백을 통해 가장 가까운 부모 브랜치의 의존성을 복원한 뒤 변경된 차분(delta)만 다운로드하도록 파이프라인을 재구성했습니다."
    },
    {
        "time": "12:30",
        "seconds": 750,
        "speaker": "당근 SRE 플랫폼 엔지니어",
        "text": "두 번째는 스토리지 아키텍처였습니다. AWS S3에 캐시를 저장하는 기존 방식은 네트워크 레이턴시와 대역폭 한계로 1.5GB 아티팩트를 복원하는 데만 30초 이상 걸렸습니다. 저희는 K8s 러너 노드에 로컬 고속 NVMe 스토리지를 배치하고, 클러스터 내부에 10Gbps 대역폭의 원격 캐시 프록시 데몬을 구축했습니다. 러너 파드가 로컬에 있으면 NVMe에서 직접 복사하고, 다른 노드에 있으면 내부 프록시를 통해 초당 수백 메가바이트 속도로 캐시를 가져오도록 만들었습니다."
    },
    {
        "time": "16:20",
        "seconds": 980,
        "speaker": "당근 SRE 플랫폼 엔지니어",
        "text": "세 번째는 컨테이너 이미지 빌드 최적화입니다. 애플리케이션 빌드만큼 시간이 걸리던 도커 빌드에 Docker BuildKit을 도입했습니다. --cache-to=type=registry,mode=max 옵션을 줘서 도커 멀티스테이지의 모든 중간 레이어를 사내 프라이빗 레지스트리에 캐시하도록 구성했습니다. 이로 인해 소스 코드가 한 줄 바뀌었을 때 이전 레이어(의존성 설치, 빌드 도구 준비)는 1초 만에 캐시 히트되어 빌드가 통과되었습니다."
    },
    {
        "time": "19:40",
        "seconds": 1180,
        "speaker": "당근 SRE 플랫폼 엔지니어",
        "text": "이 과정에서 가장 뼈아팠던 트러블슈팅은 '타임스탬프 불일치로 인한 캐시 버스팅'이었습니다. 분명 코드는 같은데 빌드 산출물 zip이나 webpack/vite 번들 해시가 매번 달라졌습니다. 원인을 파악해 보니 파일 생성 시간(mtime)이 빌드 시점마다 달라져 파일 체크섬이 바뀌는 문제였습니다. Git 커밋 타임스탬프로 파일 mtime을 강제 일치시키는 정규화 스크립트를 빌드 앞단에 추가한 뒤에야 비로소 진정한 캐시 재현성을 얻을 수 있었습니다."
    },
    {
        "time": "22:15",
        "seconds": 1335,
        "speaker": "당근 SRE 플랫폼 엔지니어",
        "text": "그 결과, 캐시 히트율은 초기 42%에서 99.4%까지 수직 상승했습니다. 평균 빌드 시간은 14분 30초에서 2분 10초로 무려 85% 단축되었습니다. 전사 개발자들이 하루에 CI 결과를 기다리며 낭비하던 시간을 계산해 보니 매일 320시간이 절약되었습니다. 궁극의 CI 환경은 좋은 SaaS 도구를 구독한다고 완성되지 않습니다. 우리 빌드 파이프라인의 결정론(Determinism)을 확보하고 캐시 레이어를 층층이 설계해야 비로소 완성됩니다. 감사합니다."
    }
],
    index: 1,
    videoId: 'PTEZnscaSwE',
    title: '궁극의 CI 환경을 위한 여정 2 : 캐시 히트율 100%에 도전하다 | 2026 당근 빌더 밋업',
    speaker: '당근 SRE & 플랫폼 엔지니어',
    category: 'CI/CD & 빌드',
    duration: '24분 15초',
    views: '조회수 560회',
    date: '2026. 10. 7.',
    summary: '대규모 모노레포와 수백 개 마이크로서비스 환경에서 GitHub Actions의 캐시 히트율을 99.4%까지 끌어올려 CI 빌드 시간을 85% 단축시킨 당근의 분산 캐시 아키텍처 및 무효화 전략 공유.',
    keyTakeaways: [
      '캐시 히트율이 50% 미만이면 압축 해제 및 다운로드 오버헤드로 인해 캐시를 쓰지 않는 것보다 느려질 수 있다.',
      '잠금 파일 해시와 콘텐츠 기반 결정론적 빌드(Deterministic Build)가 결합되어야 캐시 버스팅을 방지할 수 있다.',
      '분산 Ephemeral K8s 러너 환경에서는 중앙 집중형 고속 원격 캐시 프록시 레이어가 필수적이다.'
    ],
    techStack: ['GitHub Actions', 'Docker BuildKit', 'pnpm / Turborepo', 'S3 / Local NVMe Cache', 'sccache'],
    screenAnalysis: {
      headline: '분산 K8s 러너 환경의 고속 캐시 프록시 및 계층형 캐시 키 설계',
      diagramDescription: '수십 개의 GitHub Actions Ephemeral Runner 파드가 중앙 분산 캐시 프록시(10Gbps NVMe 캐시 스토리지)에 연결되어 종속성, 빌드 아티팩트, 도커 레이어를 즉각 공유하는 아키텍처 다이어그램.',
      codeSnippet: {
        language: 'yaml',
        title: '정밀한 계층형 캐시 키 & BuildKit 캐시 설정 예시',
        code: `name: High-Speed Cached CI
jobs:
  build:
    runs-on: daangn-k8s-runner
    steps:
      - uses: actions/checkout@v4
      - name: Cache dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.pnpm-store
            node_modules
            .turbo
          key: \${{ runner.os }}-pnpm-\${{ hashFiles('**/pnpm-lock.yaml') }}-\${{ hashFiles('packages/*/package.json') }}
          restore-keys: |
            \${{ runner.os }}-pnpm-\${{ hashFiles('**/pnpm-lock.yaml') }}-
            \${{ runner.os }}-pnpm-
      - name: Docker Layer Cache
        run: |
          docker buildx build \\
            --cache-from=type=registry,ref=daangn.registry/cache:main \\
            --cache-to=type=registry,ref=daangn.registry/cache:main,mode=max \\
            --push -t daangn.registry/app:\${{ github.sha }} .`
      },
      visualHighlights: [
        '빌드 파이프라인 그래프: 체크아웃 → 캐시 복원 → 병렬 테스트/빌드 단계',
        '시간대별 캐시 히트율 추이 그래프: 초기 42% 수준에서 99.4%로 수직 상승',
        '도커 멀티스테이지 빌드 레이어별 소요 시간 벤치마크 바 차트',
        '러너 노드 간 로컬 SSD 캐시 공유 데몬 토폴로지'
      ]
    },
    audioAnalysis: {
      headline: '발표자 육성 포인트: "캐시 히트율 100% 도전의 본질은 도구 도입이 아닌 빌드 결정론 보장"',
      spokenContext: '발표자는 수백 명의 개발자가 매일 수천 번의 PR을 생성하는 당근의 개발 환경에서 CI 대기 시간이 생산성을 가장 갉아먹는 병목이었음을 강조합니다. 기존에는 분산 러너가 뜨고 질 때마다 매번 수 기가바이트의 npm/도커 레이어를 다시 받아야 했습니다.',
      troubleshootingStory: '처음에는 단순히 actions/cache를 적용했으나, 빌드 산출물에 동적 타임스탬프나 파일 생성 순서가 달라져 매번 캐시 미스가 발생했습니다. 이를 해결하기 위해 파일 수정 시간을 통일하는 정규화 도구와 잠금 파일 세분화 규칙을 적용했습니다.',
      quantitativeResults: [
        '평균 CI 빌드 소요 시간: 14분 30초 → 2분 10초 (85% 단축)',
        '캐시 히트율: 42% → 99.4% 달성',
        '전사 일일 누적 개발자 대기 시간: 약 320시간 절감'
      ],
      speakerAdvice: '캐시 키에 브랜치 이름만 넣지 말고, 의존성 트리 해시와 서브패키지 해시를 계층형(restore-keys)으로 반드시 분리하세요.'
    },
    timestamps: [
      { time: '00:00', seconds: 0, label: '도입 배경: 당근의 CI 병목과 개발자 피로도', type: 'audio' },
      { time: '03:40', seconds: 220, label: '화면: 기존 분산 러너의 캐시 미스 메커니즘 분석', type: 'screen' },
      { time: '08:15', seconds: 495, label: '아키텍처: 고속 캐시 프록시 및 BuildKit 레이어 캐싱', type: 'architecture' },
      { time: '14:20', seconds: 860, label: '코드: 계층형 캐시 키 및 결정론적 빌드 구성', type: 'code' },
      { time: '19:50', seconds: 1190, label: '트러블슈팅: 타임스탬프 캐시 버스팅 해결기', type: 'troubleshooting' },
      { time: '22:30', seconds: 1350, label: '성과 발표: 캐시 히트율 99.4%와 시간 절감 지표', type: 'takeaway' }
    ],
    recommendedQuestions: [
      '당근에서 캐시 히트율을 99.4%까지 올린 핵심 캐시 키 전략은 무엇인가요?',
      '분산 K8s 러너에서 로컬 캐시와 원격 캐시의 오버헤드를 어떻게 해결했나요?',
      '도커 레이어 캐싱 시 BuildKit의 mode=max 옵션은 어떤 역할을 했나요?'
    ]
  },
  {
    id: 'session-2',
    fullTranscript: [
    {
        "time": "00:00",
        "seconds": 0,
        "speaker": "당근 개발자 플랫폼 & 생산성 엔지니어",
        "text": "반갑습니다. 당근 개발자 플랫폼 팀입니다. 이번 발표는 '코딩은 에이전트가 하는데 배포는 왜 제가 하죠? : CLI·MCP·Agent 실전 비교'입니다. 최근 Cursor나 Claude Code 같은 생성형 AI 도구가 보편화되면서 개발자들의 코드 작성 속도는 눈부시게 빨라졌습니다. 그런데 배포를 하려고 하면 결국 터미널을 열고 수작업으로 CLI를 치고 있더라고요. 왜 이런 괴리가 생기는지, 그리고 우리는 이를 어떻게 풀었는지 공유합니다."
    },
    {
        "time": "03:40",
        "seconds": 220,
        "speaker": "당근 개발자 플랫폼 & 생산성 엔지니어",
        "text": "개발 라이프사이클을 보면, '코드 작성'은 AI 에이전트가 단 몇 초 만에 완성해 줍니다. 하지만 '배포'는 스테이징 배포, 통합 테스트 확인, 프로덕션 승인, 카나리 10% 롤아웃, 메트릭 관찰, 트래픽 100% 전환까지 수많은 수작업 검증 단계가 있습니다. 코딩은 3배 빨라졌는데 배포는 여전히 사람이 슬랙 채널을 보며 kubectl과 내부 배포 CLI를 일일이 실행하니, 개발자들은 '코딩보다 배포가 훨씬 피곤하다'고 느끼게 되었습니다."
    },
    {
        "time": "07:20",
        "seconds": 440,
        "speaker": "당근 개발자 플랫폼 & 생산성 엔지니어",
        "text": "처음에는 단순하게 생각했습니다. '에이전트에게 배포 CLI 실행 권한(Bash execute)을 주면 되지 않을까?' 하지만 프로덕션 환경에서 이것은 재앙에 가까웠습니다. 에이전트가 쉘 명령어를 실행하다가 예기치 않은 오류가 나면, 원인을 파악한답시고 데이터베이스 마이그레이션을 마음대로 롤백하거나 다른 서비스의 배포 매니페스트를 덮어쓰려 하는 위험한 시도가 발생했습니다. 에이전트에게 쉘 전체 권한을 주는 것은 불가능했습니다."
    },
    {
        "time": "11:50",
        "seconds": 710,
        "speaker": "당근 개발자 플랫폼 & 생산성 엔지니어",
        "text": "그래서 저희는 Anthropic이 제안한 표준 프로토콜인 MCP(Model Context Protocol)를 기반으로 사내 배포 전용 서버를 만들었습니다. 에이전트에게 쉘 실행 권한 대신, 엄격하게 검증된 함수 몇 가지만 툴로 노출했습니다. 예를 들어 deploy_service_canary, evaluate_canary_health, rollback_deployment와 같은 함수입니다. 이렇게 하면 에이전트는 규격화된 파라미터만 넘길 수 있고, 인프라의 임의 조작이 원천 차단됩니다."
    },
    {
        "time": "16:30",
        "seconds": 990,
        "speaker": "당근 개발자 플랫폼 & 생산성 엔지니어",
        "text": "더 중요한 것은 'Human-in-the-loop 안전 가드레일'입니다. 배포 상태 조회나 로그 분석 같은 Read 성격의 작업은 에이전트가 자율적으로 실행하지만, 프로덕션에 트래픽을 적용하는 Write 작업은 슬랙 인터랙티브 모달로 전송됩니다. 슬랙 메시지에는 에이전트가 분석한 변경 위험도, 카나리 10% 환경에서의 5xx 에러율(0.01% 미만)과 P99 지연 시간 그래프가 함께 제공됩니다. 담당 개발자는 슬랙에서 버튼 하나만 눌러 최종 승인할 수 있습니다."
    },
    {
        "time": "21:10",
        "seconds": 1270,
        "speaker": "당근 개발자 플랫폼 & 생산성 엔지니어",
        "text": "현장에서 발생했던 트러블슈팅 사례도 있습니다. 에이전트가 카나리 배포 직후 트래픽이 아직 유입되지 않아 에러율이 0%인 상태를 '완벽하게 안전하다'고 착각하여 성급하게 100% 배포를 진행하려 한 적이 있었습니다. 저희는 에이전트의 프롬프트에만 의존하지 않고, 최소 5분간 일정 요청 수(RPS > 100) 이상이 통과되어야만 승인 버튼이 활성화되는 하드 가드레일을 코드 레벨에 심었습니다."
    },
    {
        "time": "25:40",
        "seconds": 1540,
        "speaker": "당근 개발자 플랫폼 & 생산성 엔지니어",
        "text": "도입 결과, PR 머지부터 프로덕션 배포 완료까지 평균 18분 걸리던 과정이 3분 이내로 줄었습니다. 개발자가 터미널과 슬랙, 배포 콘솔을 오가며 겪던 컨텍스트 스위칭이 70% 감소했고, 배포 사고는 0건을 유지하고 있습니다. 에이전트에게 손발을 줄 때는 반드시 눈과 브레이크를 먼저 만들어야 한다는 것이 저희 팀의 가장 큰 교훈이었습니다."
    }
],
    index: 2,
    videoId: 'BL_PzxTtELM',
    title: '코딩은 에이전트가 하는데 배포는 왜 제가 하죠? : CLI·MCP·Agent 실전 비교 | 2026 당근 빌더 밋업',
    speaker: '당근 개발자 플랫폼 & 생산성 엔지니어',
    category: 'AI & 배포',
    duration: '28분 50초',
    views: '조회수 614회',
    date: '2026. 10. 7.',
    summary: 'Cursor와 Claude Code 등 AI 코딩 에이전트 시대에 배포 파이프라인을 MCP(Model Context Protocol)와 자율 에이전트로 연동하면서 겪은 보안 가드레일, 실수 방지, Human-in-the-loop 설계 비교 분석.',
    keyTakeaways: [
      '코딩 생성 속도가 빨라질수록 수작업 배포 승인과 인프라 변경 단계가 최대 병목이 된다.',
      'MCP는 에이전트에게 정밀한 표준화 도구(Tools)를 제공하지만, 프로덕션 쓰기(Write) 권한에는 안전 가드레일이 필수적이다.',
      '에이전트가 배포 상태를 판단할 때 메트릭 기반 자동 롤백 기준(SLO)을 기계적으로 주입해야 환각(Hallucination)을 막을 수 있다.'
    ],
    techStack: ['MCP (Model Context Protocol)', 'Claude Code / Cursor', 'ArgoCD', 'Slack Interactive Blocks', 'OpenTelemetry'],
    screenAnalysis: {
      headline: 'CLI vs MCP vs Autonomous Agent 3단계 진화 비교 아키텍처',
      diagramDescription: '개발자 프롬프트 → AI Agent → MCP 서버(당근 내부 배포 API) → ArgoCD 카나리 롤아웃 → 슬랙 인터랙티브 승인 창으로 이어지는 실시간 파이프라인 다이어그램.',
      codeSnippet: {
        language: 'typescript',
        title: '당근 배포 MCP 서버 툴 정의 스펙',
        code: `// Daangn Deployment MCP Server
export const deployTools: Tool[] = [
  {
    name: "deploy_service_canary",
    description: "새 이미지를 카나리(10%) 환경에 배포하고 실시간 에러율을 모니터링합니다.",
    inputSchema: {
      type: "object",
      properties: {
        serviceName: { type: "string" },
        imageTag: { type: "string" },
        trafficWeight: { type: "number", default: 10 }
      },
      required: ["serviceName", "imageTag"]
    }
  },
  {
    name: "evaluate_canary_health",
    description: "배포된 카나리 파드의 P99 지연 시간 및 5xx 에러율을 확인합니다.",
    inputSchema: {
      type: "object",
      properties: {
        serviceName: { type: "string" },
        evaluationMinutes: { type: "number", default: 5 }
      }
    }
  }
];`
      },
      visualHighlights: [
        'CLI / MCP / Full-Agent 비교 매트릭스 표: 보안 위험도, 컨텍스트 전달력, 휴먼 에러율',
        '슬랙(Slack) 인터랙티브 승인 모달 화면: 에이전트의 변경 사항 요약 및 리스크 등급 표시',
        '카나리 트래픽 10% → 50% → 100% 자동 스케일링 지표 실시간 대시보드',
        '에이전트의 잘못된 롤백 시도 차단 로그 화면'
      ]
    },
    audioAnalysis: {
      headline: '발표자 육성 포인트: "에이전트에게 손발을 줄 때, 눈과 브레이크를 먼저 만들어야 합니다"',
      spokenContext: '코딩 에이전트 도입 후 PR 생성 속도는 3배 빨라졌지만, 개발자들은 여전히 터미널을 열고 kubectl이나 배포 CLI를 치고 있었습니다. "왜 배포는 내가 직접 손으로 쳐야 하는가?"라는 물음에서 프로젝트가 출발했습니다.',
      troubleshootingStory: '에이전트에게 배포 CLI 실행 권한을 직접 줬을 때, 에러 로그가 발생하자 에이전트가 데이터베이스 마이그레이션 커밋을 마음대로 되돌리려 했던 위험천만한 시도가 있었습니다. 이를 계기로 Read(조회)와 Write(실행)를 분리하고 프로덕션 변경은 승인 토큰을 요구하도록 재설계했습니다.',
      quantitativeResults: [
        '배포 파이프라인 진입부터 승인까지 소요 시간: 18분 → 3분으로 단축',
        '개발자의 배포 컨텍스트 전환(Context Switching) 횟수 70% 감소',
        '배포 관련 휴먼 에러 및 잘못된 태그 배포 사고 0건 유지'
      ],
      speakerAdvice: '에이전트에게 쉘 명령어 전체를 주지 말고, 엄격하게 검증된 MCP 함수 몇 개만 화이트리스트로 노출하세요.'
    },
    timestamps: [
      { time: '00:00', seconds: 0, label: '도입 질문: 코딩은 AI가 하는데 왜 배포는 내가?', type: 'audio' },
      { time: '04:10', seconds: 250, label: '화면: 전통적 배포 CLI의 한계와 개발자 컨텍스트 비용', type: 'screen' },
      { time: '09:30', seconds: 570, label: '아키텍처: MCP를 활용한 표준 배포 툴 프로토콜 설계', type: 'architecture' },
      { time: '15:20', seconds: 920, label: '코드: 배포 MCP 서버 및 가드레일 함수 구조', type: 'code' },
      { time: '21:40', seconds: 1300, label: '트러블슈팅: 에이전트의 환각 배포 시도와 안전 차단', type: 'troubleshooting' },
      { time: '26:10', seconds: 1570, label: '결론: Human-in-the-loop 기반 미래 배포 모델', type: 'takeaway' }
    ],
    recommendedQuestions: [
      '당근에서 배포용 MCP 서버를 만들 때 가장 신경 쓴 보안 가드레일은 무엇인가요?',
      '에이전트가 카나리 배포 상태를 판단할 때 어떤 메트릭 기준을 적용했나요?',
      'CLI 실행 대신 MCP 함수 호출 방식으로 바꿨을 때 얻은 장점은 무엇인가요?'
    ]
  },
  {
    id: 'session-3',
    fullTranscript: [
    {
        "time": "00:00",
        "seconds": 0,
        "speaker": "당근 EKS & 클라우드 인프라 SRE",
        "text": "안녕하세요, 당근 EKS 클라우드 인프라 SRE 팀입니다. 오늘 발표 제목은 'EKS 노드를 재단하는 목수: 당근의 Karpenter 도입 여정'입니다. 당근의 트래픽은 동네생활 피크 타임과 저녁 거래 시간대에 급격히 치솟습니다. 기존 Kubernetes Cluster Autoscaler의 한계를 어떻게 Karpenter로 극복하고 연간 수억 원의 비용을 아꼈는지 전해드립니다."
    },
    {
        "time": "03:10",
        "seconds": 190,
        "speaker": "당근 EKS & 클라우드 인프라 SRE",
        "text": "당근 EKS 클러스터에는 수천 개의 파드가 떠 있습니다. 기존에 쓰던 Cluster Autoscaler(CAS)는 AWS의 ASG(오토 스케일링 그룹)에 종속되어 동작합니다. 문제는 ASG마다 인스턴스 타입이 하나로 고정되어 있어, 다양한 크기의 워크로드를 수용하려면 ASG를 45개나 만들어 관리해야 했습니다. 더 심각한 것은 속도였습니다. 트래픽이 튈 때 새 노드가 프로비저닝되어 파드가 뜨기까지 최소 3분, 길면 5분이 걸려 장애 직전까지 가는 일이 빈번했습니다."
    },
    {
        "time": "07:30",
        "seconds": 450,
        "speaker": "당근 EKS & 클라우드 인프라 SRE",
        "text": "이 문제를 해결하기 위해 도입한 것이 AWS 오픈소스 프로젝트인 Karpenter입니다. Karpenter는 ASG를 완전히 건너뛰고 EC2 Fleet API를 직접 호출합니다. 스케줄러가 파드의 리소스 요구량(CPU, 메모리, GPU, 가용영역)을 실시간 분석한 뒤, 가장 저렴하고 최적인 인스턴스를 즉석에서 조합하여 노드를 띄웁니다. 이로써 노드 프로비저닝 시간이 180초에서 35초로 줄어들었습니다."
    },
    {
        "time": "12:00",
        "seconds": 720,
        "speaker": "당근 EKS & 클라우드 인프라 SRE",
        "text": "Karpenter 설정에서 저희가 가장 집중한 부분은 NodePool 설계입니다. requirements에 c6g, m6g 같은 AWS Graviton(ARM64) 인스턴스와 x86 인스턴스를 모두 열어두고, capacity-type으로 Spot과 On-Demand를 유연하게 묶었습니다. 이렇게 하면 특정 인스턴스 패밀리의 Spot 재고가 부족해져도 Karpenter가 즉시 다른 가용 패밀리로 우회하여 노드를 띄우기 때문에 Spot 중단(Interruption) 위험이 거의 사라집니다."
    },
    {
        "time": "16:40",
        "seconds": 1000,
        "speaker": "당근 EKS & 클라우드 인프라 SRE",
        "text": "비용 절감의 핵심 비밀은 바로 'Consolidation(노드 통합)'입니다. consolidationPolicy: WhenEmptyOrUnderutilized 설정을 켜두면, 트래픽이 줄어들어 노드들의 사용률이 떨어졌을 때 파드들을 더 작은 노드로 모아 재배치(Bin-packing)하고 남은 큰 노드를 즉시 반납합니다. 기존 CAS 환경에서는 노드 10대에 파드가 1~2개씩 흩어져 있어 유휴 자원 낭비(Waste)가 38%에 달했는데, Karpenter 도입 후 8% 이하로 떨어졌습니다."
    },
    {
        "time": "20:30",
        "seconds": 1230,
        "speaker": "당근 EKS & 클라우드 인프라 SRE",
        "text": "물론 도입 과정에서 큰 장애 위기도 있었습니다. Consolidation 기능이 너무 성급하게 작동하여, 잠깐 트래픽이 감소했을 때 노드를 삭제해 버리는 바람에 파드들이 잦은 재기동을 겪었습니다. 저희는 consolidateAfter 임계치를 1분 이상으로 조정하고, 모든 핵심 서비스에 Pod Disruption Budget(PDB)을 엄격하게 적용하여 최소 파드 가용성을 강제했습니다."
    },
    {
        "time": "24:10",
        "seconds": 1450,
        "speaker": "당근 EKS & 클라우드 인프라 SRE",
        "text": "결과적으로 EKS 컴퓨팅 비용을 월 기준 28% 순절감할 수 있었습니다. 관리해야 하는 ASG는 45개에서 0개로 완전히 사라졌습니다. 이제는 규격화된 상자에 파드를 억지로 끼워 맞추지 않고, 파드의 크기에 맞춰 인프라를 유연하게 재단하는 목수를 갖추게 되었습니다. 여러분도 멀티 아키텍처 지원과 PDB 점검부터 시작해 보시길 강력히 추천합니다."
    }
],
    index: 3,
    videoId: 'rmGEMwQIG-A',
    title: 'EKS 노드를 재단하는 목수 : 당근의 Karpenter 도입 여정 | 2026 당근 빌더 밋업',
    speaker: '당근 EKS & 클라우드 인프라 SRE',
    category: 'Kubernetes & 인프라',
    duration: '26분 40초',
    views: '조회수 556회',
    date: '2026. 10. 7.',
    summary: '기존 Cluster Autoscaler(CAS)의 한계를 극복하고 AWS EKS 상에서 Karpenter를 도입하여 노드 프로비저닝 시간을 180초에서 35초로 줄이고, 스팟 인스턴스 빈패킹을 통해 인프라 비용을 28% 절감한 여정.',
    keyTakeaways: [
      'Cluster Autoscaler는 ASG(Auto Scaling Group) 템플릿에 종속되어 인스턴스 다양성과 빠른 확장에 제약이 있다.',
      'Karpenter는 파드의 리소스 요구사항을 실시간 분석해 최적의 EC2 타입을 직접 재단(Bin-packing)한다.',
      'Spot 인터럽션 대응과 PDB(Pod Disruption Budget) 설계가 노드 통합(Consolidation) 시 안정성의 핵심이다.'
    ],
    techStack: ['AWS EKS', 'Karpenter v1.0', 'EC2 Spot / On-Demand', 'NodePool / EC2NodeClass', 'Prometheus'],
    screenAnalysis: {
      headline: 'Cluster Autoscaler vs Karpenter 아키텍처 및 NodePool 매니페스트 비교',
      diagramDescription: 'CAS의 복잡한 ASG 관리 레이어를 제거하고, Karpenter 컨트롤러가 파드 펜딩 이벤트를 감지하여 AWS EC2 Fleet API로 직접 최적 인스턴스를 요청하는 직관적 아키텍처.',
      codeSnippet: {
        language: 'yaml',
        title: '당근의 Karpenter NodePool 및 유연한 인스턴스 정책',
        code: `apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: daangn-general-workload
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
        - key: node.kubernetes.io/instance-type
          operator: In
          values: ["c6g.xlarge", "c6i.xlarge", "m6g.xlarge", "m6i.xlarge", "r6g.xlarge"]
      nodeClassRef:
        group: karpenter.k8s.aws
        kind: EC2NodeClass
        name: default-ec2-config
  disruption:
    consolidationPolicy: WhenEmptyOrUnderutilized
    consolidateAfter: 1m`
      },
      visualHighlights: [
        '스케일아웃 시간 비교 그래프: 기존 3~5분 → Karpenter 35초',
        '클러스터 리소스 낭비율(Slack/Waste) 히트맵: 38%에서 8% 미만으로 감소',
        'Consolidation(노드 재조정) 동작 시 파드가 이동하는 실시간 애니메이션 다이어그램',
        'ARM64(Graviton) 인스턴스와 x86 인스턴스 간 혼합 워크로드 분산 지표'
      ]
    },
    audioAnalysis: {
      headline: '발표자 육성 포인트: "나무를 규격화된 상자에 억지로 넣는 대신, 파드 크기에 맞게 나무를 깎는 목수가 필요했습니다"',
      spokenContext: '당근 서비스는 피크 타임(저녁 시간대 중고거래 활성화)과 오프 피크 간의 트래픽 차이가 큽니다. 기존 CAS 환경에서는 수십 개의 ASG를 일일이 관리해야 했고, 노드가 뜨는 속도가 느려 펜딩 파드로 인한 장애를 자주 겪었습니다.',
      troubleshootingStory: 'Karpenter의 Consolidation 기능이 너무 적극적으로 작동하면서, 트래픽이 몰릴 때 노드가 다운사이징되어 파드가 잦은 재기동을 겪었던 트러블슈팅을 소개합니다. consolidateAfter 임계치를 조정하고 Pod Disruption Budget을 엄격하게 재설정하여 해결했습니다.',
      quantitativeResults: [
        'EKS 노드 프로비저닝 시간: 180초 → 35초 (약 80% 단축)',
        '클러스터 컴퓨팅 비용: 월 기준 약 28% 순절감',
        '관리해야 하는 ASG(오토스케일링 그룹) 개수: 45개 → 0개(완전 제거)'
      ],
      speakerAdvice: '단일 인스턴스 패밀리만 고집하지 말고, requirements에 다양한 인스턴스 타입과 Graviton(ARM64)을 포함시켜 Spot 재고 부족 위험을 분산하세요.'
    },
    timestamps: [
      { time: '00:00', seconds: 0, label: '도입: EKS 대규모 클러스터 운영의 고통과 CAS의 한계', type: 'audio' },
      { time: '04:50', seconds: 290, label: '화면: CAS vs Karpenter 동작 구조 다이어그램', type: 'screen' },
      { time: '10:15', seconds: 615, label: '아키텍처: Karpenter NodePool 및 EC2NodeClass 설계', type: 'architecture' },
      { time: '15:40', seconds: 940, label: '코드: Spot 인스턴스 및 Graviton 혼합 배포 매니페스트', type: 'code' },
      { time: '20:10', seconds: 1210, label: '트러블슈팅: 노드 통합(Consolidation)과 PDB 조율', type: 'troubleshooting' },
      { time: '24:30', seconds: 1470, label: '성과: 프로비저닝 35초 달성 및 비용 28% 절감', type: 'takeaway' }
    ],
    recommendedQuestions: [
      '당근에서 Karpenter 도입 시 Spot 인스턴스 중단(Interruption)을 어떻게 처리했나요?',
      'Cluster Autoscaler와 비교해 Karpenter의 빈패킹(Bin-packing) 효율은 어떻게 향상되었나요?',
      'Consolidation(노드 통합) 정책 적용 시 서비스 무중단을 유지한 비결은 무엇인가요?'
    ]
  },
  {
    id: 'session-4',
    fullTranscript: [
    {
        "time": "00:00",
        "seconds": 0,
        "speaker": "당근 ML 인프라 & 가속기 플랫폼 엔지니어",
        "text": "안녕하세요. 당근 ML 인프라 팀입니다. 오늘 발표는 '당근에서 값비싼 TPU를 효율적으로 활용하는 방법'입니다. 당근은 사진 속 물품 자동 분류, 사기 탐지, 검색어 유사도 판별, 그리고 로컬 LLM 서빙에 이르기까지 방대한 AI 모델을 운영하고 있습니다. 이 모든 모델을 서빙하기 위해 Google Cloud의 TPU v5e 슬라이스를 대량 사용하고 있는데, 이 비싼 자원을 어떻게 놀리지 않고 썼는지 공유합니다."
    },
    {
        "time": "03:20",
        "seconds": 200,
        "speaker": "당근 ML 인프라 & 가속기 플랫폼 엔지니어",
        "text": "TPU는 GPU와 비교했을 때 달러당 추론 성능이 뛰어나지만, 운영상 치명적인 특성이 있습니다. 바로 'Pod Slice'라는 단위로 묶여 프로비저닝된다는 점입니다. 예를 들어 TPU v5e-16이나 v5e-32는 칩들이 고속 2D 메시 네트워크로 상호연결되어 있어, 하나의 칩만 고장 나거나 작업이 실패해도 슬라이스 전체가 먹통이 됩니다. 또한 피크 타임에 맞춰 슬라이스를 확보해 두면, 트래픽이 적은 새벽 시간대에는 수억 원어치의 TPU가 유휴 상태로 방치되는 문제가 있었습니다."
    },
    {
        "time": "07:10",
        "seconds": 430,
        "speaker": "당근 ML 인프라 & 가속기 플랫폼 엔지니어",
        "text": "저희의 해결책은 '주야간 하이브리드 워크로드 오케스트레이션'이었습니다. GKE 환경에 KubeRay 오퍼레이터를 도입하여, 주간에는 온라인 실시간 서빙(vLLM 기반 추론 파드)에 TPU를 할당하고, 트래픽이 줄어드는 밤 11시 이후에는 추론 파드를 축소하여 확보된 TPU 슬라이스를 대기 중이던 오프라인 대규모 임베딩 및 파인튜닝 배치 큐에 동적으로 넘겨주도록 파이프라인을 설계했습니다."
    },
    {
        "time": "12:00",
        "seconds": 720,
        "speaker": "당근 ML 인프라 & 가속기 플랫폼 엔지니어",
        "text": "여기서 가장 큰 병목은 JAX와 PyTorch-XLA의 컴파일 시간이었습니다. TPU 워크로드가 새로 뜰 때마다 XLA가 모델 연산 그래프를 컴파일하는 데 4분에서 5분이 소요되었습니다. 야간 배치가 돌기도 전에 아침 피크 트래픽이 시작되어 추론 서비스가 지연되는 문제가 발생했습니다. 저희는 XLA Persistent Compilation Cache를 Google Cloud Storage(GCS)에 영구 저장하여 클러스터 전체가 캐시를 공유하도록 만들었습니다. 그 결과 컴파일 시간이 4분에서 단 8초로 단축되었습니다."
    },
    {
        "time": "16:40",
        "seconds": 1000,
        "speaker": "당근 ML 인프라 & 가속기 플랫폼 엔지니어",
        "text": "또한 스팟(Spot/Preemptible) TPU를 적극 활용했습니다. 스팟 TPU는 가격이 온디맨드 대비 60% 이상 저렴하지만 언제든 노드가 회수될 수 있습니다. 저희는 배치 작업에 분산 체크포인팅(Orbax)을 적용하여 선점이 발생하더라도 30초 이내에 마지막 체크포인트에서 작업을 복구할 수 있는 무중단 내결함성(Fault-tolerance) 구조를 완성했습니다."
    },
    {
        "time": "20:10",
        "seconds": 1210,
        "speaker": "당근 ML 인프라 & 가속기 플랫폼 엔지니어",
        "text": "이 최적화를 통해 TPU 평균 가동률(MFU)을 35%에서 82%로 끌어올렸습니다. 동일한 비용으로 매일 5,000만 건 이상의 오프라인 임베딩 연산을 추가로 소화할 수 있게 되었습니다. 고비용 가속기를 운영하는 팀이라면, 단일 워크로드 전용으로 묶어두지 말고 주야간 하이브리드 스케줄링과 컴파일 캐싱을 반드시 적용해 보시기 바랍니다."
    }
],
    index: 4,
    videoId: 'bK0vd8E8sC8',
    title: '당근에서 값비싼 TPU를 효율적으로 활용하는 방법 | 2026 당근 빌더 밋업',
    speaker: '당근 ML 인프라 & 가속기 플랫폼 엔지니어',
    category: 'AI 인프라',
    duration: '22분 15초',
    views: '조회수 240회',
    date: '2026. 10. 7.',
    summary: '중고거래 이미지 임베딩과 대형 언어 모델 서빙에 투입되는 고비용 Google Cloud TPU(v4/v5e) 자원을 유휴 시간 없이 주야간 하이브리드 워크로드 전환 및 KubeRay 스케줄링으로 82% 가동률을 달성한 비결.',
    keyTakeaways: [
      'TPU는 일반 GPU와 달리 슬라이스(Pod Slice) 단위로 고정 묶음 할당되므로 부분 실패 시 낭비가 매우 크다.',
      '주간 서빙(온라인 추론)과 야간 배치(오프라인 임베딩/학습)를 동적으로 전환하는 스케줄러가 필수적이다.',
      'JAX/XLA 컴파일 캐시를 중앙 영구 스토리지에 캐싱하여 콜드 스타트 지연을 획기적으로 줄여야 한다.'
    ],
    techStack: ['Google Cloud TPU v5e', 'KubeRay', 'vLLM', 'JAX / PyTorch-XLA', 'GKE'],
    screenAnalysis: {
      headline: 'TPU v5e 슬라이스 토폴로지 및 주야간 워크로드 전환 오케스트레이션',
      diagramDescription: 'GKE 상에서 KubeRay 컨트롤러가 트래픽 감소를 감지하여 TPU 슬라이스를 추론 파드에서 일괄 회수한 뒤, 큐에 대기 중이던 오프라인 대규모 임베딩 배치 잡으로 넘겨주는 순서도.',
      codeSnippet: {
        language: 'yaml',
        title: 'TPU v5e 슬라이스 동적 리소스 요청 매니페스트',
        code: `apiVersion: ray.io/v1
kind: RayCluster
metadata:
  name: daangn-tpu-cluster
spec:
  headGroupSpec:
    rayStartParams:
      dashboard-host: '0.0.0.0'
  workerGroupSpecs:
    - groupName: tpu-v5e-slice
      replicas: 4
      template:
        spec:
          nodeSelector:
            cloud.google.com/gke-tpu-accelerator: tpu-v5-lite-podslice
            cloud.google.com/gke-tpu-topology: 2x4
          containers:
            - name: ray-worker
              image: daangn.registry/llm-tpu:latest
              resources:
                limits:
                  google.com/tpu: 8`
      },
      visualHighlights: [
        'TPU v5e 2D 토폴로지(2x4, 4x4) 메시 네트워크 상호연결 도식',
        '시간대별 TPU 리소스 사용률(MFU) 그래프: 주간 35% 평탄선에서 82% 풀가동으로 전환',
        'JAX 컴파일 시간 비교: 콜드 컴파일 4분 → 캐시 히트 시 8초로 단축',
        '스팟 TPU 선점(Preemption) 발생 시 체크포인트 복구 모니터링 화면'
      ]
    },
    audioAnalysis: {
      headline: '발표자 육성 포인트: "가장 비싼 인프라를 놀리는 것은 죄악입니다. 초 단위로 워크로드를 채워 넣어야 합니다"',
      spokenContext: '당근 앱의 다양한 기능(사진 속 상품 자동 카테고리 분류, 검색어 유사도 판별, AI 어시스턴트)에 TPU가 쓰입니다. 하지만 피크 타임 기준으로 TPU 슬라이스를 계약해 두면 새벽 시간대에는 수억 원어치의 연산 자원이 그냥 버려지고 있었습니다.',
      troubleshootingStory: '초기에는 워크로드를 전환할 때 XLA 컴파일 시간이 너무 오래 걸려, 배치가 돌기도 전에 다시 아침 피크 트래픽이 시작되어 추론 서비스가 다운되는 위기를 겪었습니다. XLA 지속성 컴파일 캐시(Persistent Cache)를 GCS에 공유하여 컴파일 오버헤드를 95% 없앴습니다.',
      quantitativeResults: [
        'TPU 평균 가동률: 35% → 82%로 대폭 향상',
        '월간 AI 가속기 인프라 비용 누수 약 42% 방지',
        '오프라인 임베딩 처리량(Throughput): 하루 5,000만 건 추가 연산 소화'
      ],
      speakerAdvice: 'TPU를 쓸 때는 모델 가중치 로딩과 XLA 컴파일 캐시의 영속성을 먼저 검증하고 슬라이스 분할 계획을 세우세요.'
    },
    timestamps: [
      { time: '00:00', seconds: 0, label: '도입: 당근 AI 서비스의 폭발적 성장과 가속기 비용의 딜레마', type: 'audio' },
      { time: '03:30', seconds: 210, label: '화면: TPU v5e 아키텍처와 슬라이스 할당 제약 분석', type: 'screen' },
      { time: '07:50', seconds: 470, label: '아키텍처: 주야간 하이브리드 워크로드 스케줄러 구성', type: 'architecture' },
      { time: '13:10', seconds: 790, label: '코드: KubeRay 기반 TPU 토폴로지 선언 매니페스트', type: 'code' },
      { time: '17:20', seconds: 1040, label: '트러블슈팅: XLA 컴파일 지연과 GCS 영구 캐시 해결', type: 'troubleshooting' },
      { time: '20:40', seconds: 1240, label: '성과: 가동률 82% 달성 및 비용 최적화 비결', type: 'takeaway' }
    ],
    recommendedQuestions: [
      'GPU 대비 TPU v5e를 도입했을 때 당근에서 얻은 비용적 이점은 무엇이었나요?',
      '주간 추론과 야간 배치를 전환할 때 트래픽 안전성을 어떻게 보장했나요?',
      'XLA 컴파일 캐시를 어떻게 영속화하여 콜드 스타트를 단축했나요?'
    ]
  },
  {
    id: 'session-5',
    fullTranscript: [
    {
        "time": "00:00",
        "seconds": 0,
        "speaker": "당근 SRE 코어 & 관측성 플랫폼 리드",
        "text": "안녕하세요, 당근 SRE 코어 팀입니다. 오늘 세션 제목은 'AI 시대의 옵저버빌리티 재설계: Grafana를 걷어내고, 얼럿은 에이전트에게'입니다. 당근 사내에는 800개가 넘는 Grafana 대시보드가 있었습니다. 서비스가 커질수록 대시보드는 끝없이 늘어나고 슬랙 알림은 1분에 수십 개씩 쏟아졌습니다. 장애가 났을 때 어떤 대시보드를 봐야 할지 찾는 데만 10분이 걸리던 이 비극을 저희가 어떻게 끝냈는지 솔직하게 공유합니다."
    },
    {
        "time": "04:30",
        "seconds": 270,
        "speaker": "당근 SRE 코어 & 관측성 플랫폼 리드",
        "text": "전통적인 모니터링의 한계는 명확합니다. '인간의 인지 한계'에 갇혀 있다는 것입니다. Grafana 대시보드에 패널 20개를 띄워놓고, 온콜 엔지니어가 차트 간의 눈대중으로 상관관계를 추론합니다. 'CPU가 튀었는데 메모리는 어떤가?', 'DB 커넥션 풀이 찼나?', '최근에 배포된 서비스는 뭐지?' 엔지니어가 수작업으로 가설을 세우고 메트릭을 교차 검증하던 행위 자체가 엄청난 피로와 지연을 유발하고 있었습니다."
    },
    {
        "time": "09:15",
        "seconds": 555,
        "speaker": "당근 SRE 코어 & 관측성 플랫폼 리드",
        "text": "저희는 관측성 파이프라인의 소비 주체를 '인간'에서 'AI 에이전트'로 전환했습니다. Prometheus/Mimir의 메트릭, Loki의 로그, Tempo의 분산 트레이스 원천 데이터를 사람이 보는 대시보드 대신 시계열 이상 감지기와 LLM 에이전트가 직접 수집합니다. 장애가 발생했을 때 슬랙으로 '피드 서비스 CPU > 90%' 같은 단순한 수치 경고를 보내지 않습니다. 대신 에이전트가 배포 diff와 트레이스 스팬을 분석해 '원인: 최근 배포 PR #3412의 N+1 Redis 조회, 증거 3건, 조치: 롤백 권장'이라는 완결된 리포트를 보냅니다."
    },
    {
        "time": "14:40",
        "seconds": 880,
        "speaker": "당근 SRE 코어 & 관측성 플랫폼 리드",
        "text": "에이전트 도입 초기에는 큰 실패도 겪었습니다. LLM에게 원시 로그 1만 줄을 통째로 넘기니 환각(Hallucination)을 일으켜 엉뚱한 라이브러리를 장애 원인으로 지목하거나 너무 장황하게 답했습니다. 이를 해결하기 위해 '엄격한 3단계 가드레일'을 구축했습니다. 첫째, 원시 텍스트 대신 전처리된 OpenTelemetry 에러 스팬과 비정상 지표 벡터만 입력할 것. 둘째, 반드시 증거(Evidence) 링크 3개를 첨부할 것. 셋째, 신뢰도 점수(Confidence Score)가 0.85 미만이면 '원인 불명'으로 보고하고 즉시 엔지니어를 호출할 것입니다."
    },
    {
        "time": "20:20",
        "seconds": 1220,
        "speaker": "당근 SRE 코어 & 관측성 플랫폼 리드",
        "text": "또한 자연어 대화형 인터페이스를 지원합니다. 슬랙 스레드에서 엔지니어가 '어젯밤 11시에 결제 레이턴시가 갑자기 튄 이유가 뭐야?'라고 물으면, 에이전트가 해당 시점의 Mimir 시계열 데이터와 PG 데이터베이스 슬로우 쿼리 로그를 교차 분석해 5초 만에 정확한 근본 원인을 답변해 줍니다."
    },
    {
        "time": "26:00",
        "seconds": 1560,
        "speaker": "당근 SRE 코어 & 관측성 플랫폼 리드",
        "text": "결과는 놀라웠습니다. 장애 평균 복구 시간(MTTR)이 기존 45분에서 8분으로 무려 82% 단축되었습니다. 온콜 담당자가 하루에 열어보던 대시보드 수는 12개에서 1개 미만으로 줄었고, 노이즈 알림은 78%가 제거되었습니다. 엔지니어는 그래프를 감상하는 사람이 아닙니다. 복잡한 지표 해석은 AI에게 맡기고, 사람은 문제 해결과 아키텍처 개선에 집중해야 합니다."
    }
],
    index: 5,
    videoId: 'UV4-G58NLrw',
    title: 'AI 시대의 옵저버빌리티 재설계 : Grafana를 걷어내고, 얼럿은 에이전트에게 | 2026 당근 빌더 밋업',
    speaker: '당근 SRE 코어 & 관측성 플랫폼 리드',
    category: '옵저버빌리티',
    duration: '31분 10초',
    views: '조회수 4,490회 (최고 인기 세션)',
    date: '2026. 10. 7.',
    summary: '4,000명 이상이 시청한 SRE Day의 하이라이트 세션! 수백 개 대시보드와 수천 개 슬랙 알림에 지친 엔지니어를 위해 Grafana 중심 관측을 벗어나, AI 에이전트가 메트릭/로그/트레이스를 직접 분석해 근본 원인과 해결책을 3줄 요약 전달하는 차세대 SRE 옵저버빌리티 구축기.',
    keyTakeaways: [
      '대시보드가 늘어날수록 장애 파악 속도는 오히려 느려지며 알림 피로도(Alert Fatigue)만 심화된다.',
      '수치 임계치(CPU > 90%) 기반의 단순 경고를 버리고, 메트릭 간 상관관계(Correlation)를 분석하는 에이전트 파이프라인으로 전환해야 한다.',
      'AI 에이전트 얼럿은 "상태 보고"가 아니라 "원인 분석 + 증거 링크 + 추천 액션"을 즉시 제공해야 한다.'
    ],
    techStack: ['Prometheus / Mimir', 'OpenTelemetry / Tempo', 'LLM Agent', 'Slack Bot API', 'Vector DB'],
    screenAnalysis: {
      headline: '인간 대시보드 중심 모니터링 vs AI 에이전트 자율 분석 파이프라인 비교',
      diagramDescription: '원천 텔레메트리 데이터(Prometheus/Mimir, Loki, Tempo)가 사람이 보는 Grafana 대신 시계열 이상 감지기 및 LLM 분석 에이전트로 유입되고, 에이전트가 과거 포스트모텀(장애 회고) DB를 참조해 슬랙으로 완결된 리포트를 보내는 흐름도.',
      codeSnippet: {
        language: 'json',
        title: '에이전트가 생성한 스마트 얼럿 슬랙 페이로드 구조',
        code: `{
  "incident_id": "INC-20261007-042",
  "severity": "CRITICAL",
  "summary": "피드 추천 서비스 P99 레이턴시 450ms로 급증 (정상치: 35ms)",
  "root_cause": "최근 배포된 v2.14.0의 Redis MGET 호출 시 N+1 쿼리 패턴 발생으로 커넥션 풀 고갈",
  "confidence_score": 0.94,
  "evidence": [
    "Prometheus: redis_connected_clients 급증 (1,200/1,200 한도 도달)",
    "Tempo Trace: /api/v1/feed 스팬 중 redis.command 소요 시간 380ms 차지",
    "GitHub PR #3412: 피드 아이템별 좋아요 수 개별 조회 로직 변경 확인"
  ],
  "recommended_action": "kubectl rollout undo deployment/feed-service 또는 핫픽스 PR #3415 배포"
}`
      },
      visualHighlights: [
        '기존의 난잡한 Grafana 24개 패널 화면 vs 에이전트의 깔끔한 슬랙 메시지 1개 비교',
        '시계열 메트릭 이상 패턴과 분산 트레이스(Trace) 스팬 폭포수 다이어그램',
        '자연어 질의 화면: "어제 밤 11시 결제 지연 원인이 뭐였어?"에 대한 5초 만의 정확한 응답 시연',
        'MTTR(평균 복구 시간) 감소 추세선 차트: 45분 → 8분'
      ]
    },
    audioAnalysis: {
      headline: '발표자 육성 포인트: "엔지니어는 하루 종일 대시보드 그래프를 감상하는 사람이 아닙니다. 그래프 해석은 AI가 훨씬 잘합니다"',
      spokenContext: '세션 시작과 함께 발표자는 당근 사내에 만들어진 800개가 넘는 Grafana 대시보드 목록을 보여줍니다. "장애가 났을 때 어떤 대시보드를 봐야 할지 찾는 데만 10분이 걸렸습니다." 엔지니어가 차트를 쳐다보며 가설을 검증하던 모든 과정을 자동화하기로 결심했습니다.',
      troubleshootingStory: '처음 에이전트 알림을 도입했을 때, 모델이 너무 장황하게 설명하거나 엉뚱한 원인을 단정 짓는 환각 문제가 있었습니다. 이를 해결하기 위해 에이전트의 입력을 원시 로그 전체가 아닌 사전에 필터링된 OpenTelemetry 스팬과 시계열 이상치 벡터로 제한하고, 반드시 3가지 증거(Evidence) 링크를 제출하도록 프롬프트를 강화했습니다.',
      quantitativeResults: [
        '평균 장애 복구 시간(MTTR): 45분 → 8분으로 82% 단축',
        '온콜 엔지니어가 열어보는 Grafana 대시보드 수: 일일 평균 12개 → 1개 미만으로 감소',
        '유의미하지 않은 노이즈 알림(False Positives): 78% 제거'
      ],
      speakerAdvice: '모든 사람에게 Grafana 편집 권한을 주지 말고, 에이전트가 질의할 수 있는 표준 메트릭 카탈로그와 메타데이터를 정비하세요.'
    },
    timestamps: [
      { time: '00:00', seconds: 0, label: '도입: 800개의 Grafana 대시보드와 관측성의 죽음', type: 'audio' },
      { time: '05:20', seconds: 320, label: '화면: 인간 중심 대시보드의 인지 부하와 장애 대응 지연', type: 'screen' },
      { time: '11:00', seconds: 660, label: '아키텍처: OTel 메트릭·트레이스를 직접 먹는 AI 에이전트', type: 'architecture' },
      { time: '17:30', seconds: 1050, label: '코드: 에이전트 얼럿 페이로드 및 증거 체인 구조', type: 'code' },
      { time: '23:15', seconds: 1395, label: '트러블슈팅: 환각 방지를 위한 3가지 필수 증거 원칙', type: 'troubleshooting' },
      { time: '28:40', seconds: 1720, label: '성과 및 데모: 자연어 대화형 장애 분석 시연', type: 'takeaway' }
    ],
    recommendedQuestions: [
      'Grafana를 걷어내고 에이전트에게 얼럿을 맡긴 구체적인 아키텍처 파이프라인은 어떻게 되나요?',
      'AI 에이전트가 장애 원인을 분석할 때 환각(Hallucination)을 막은 방법은 무엇인가요?',
      '실제 MTTR을 45분에서 8분으로 줄인 가장 결정적인 요인은 무엇이었나요?'
    ]
  },
  {
    id: 'session-6',
    fullTranscript: [
    {
        "time": "00:00",
        "seconds": 0,
        "speaker": "당근 시스템 엔지니어 & 커널 SRE",
        "text": "반갑습니다. 당근 시스템 SRE 팀입니다. 오늘 발표 주제는 '당근 SRE의 eBPF 활용기: 지나간 Alert의 원인을 찾다'입니다. SRE 엔지니어라면 누구나 겪어본 악몽이 있을 겁니다. 피크 타임에 슬랙으로 '간헐적 504 게이트웨이 타임아웃 발생' 알림이 울려서 서버에 부랴부랴 접속해 보면, 이미 상황은 끝나 있고 CPU도 메모리도 정상이고 애플리케이션 로그에는 아무런 에러도 없는 '유령 장애'입니다. 저희가 eBPF로 이 유령을 어떻게 잡아냈는지 말씀드리겠습니다."
    },
    {
        "time": "03:40",
        "seconds": 220,
        "speaker": "당근 시스템 엔지니어 & 커널 SRE",
        "text": "애플리케이션 APM이나 Datadog, OpenTelemetry 같은 사용자 공간(User Space) 모니터링은 치명적인 사각지대가 있습니다. 리눅스 커널 내부에서 일어나는 TCP 3-way 핸드셰이크 지연, 패킷 재전송(Retransmission), 소켓 버퍼 오버플로우, conntrack 테이블 락 경합 같은 현상은 애플리케이션 프로세스에 도달하기도 전에 네트워크 스택에서 발생하기 때문에 앱 로그에는 단지 'Connection Timeout' 한 줄로만 남습니다."
    },
    {
        "time": "07:50",
        "seconds": 470,
        "speaker": "당근 시스템 엔지니어 & 커널 SRE",
        "text": "과거에는 이를 잡기 위해 tcpdump를 돌리거나 커널 모듈을 올렸지만, 트래픽이 초당 수만 건 몰리는 프로덕션 환경에서 패킷 덤프는 5~10%의 극심한 CPU 오버헤드를 유발해 2차 장애를 부릅니다. 여기서 eBPF(Extended Berkeley Packet Filter)가 게임 체인저가 되었습니다. eBPF는 커널을 수정하거나 재부팅할 필요 없이, 검증된 안전한 바이트코드를 커널 런타임에 삽입해 0.1% 미만의 극소 부하로 커널 내부 상태를 실시간 프로빙할 수 있습니다."
    },
    {
        "time": "12:30",
        "seconds": 750,
        "speaker": "당근 시스템 엔지니어 & 커널 SRE",
        "text": "저희는 kprobe와 tracepoint를 이용해 tcp_retransmit_skb 커널 함수와 소켓 수명주기를 추적하는 eBPF 프로그램을 클러스터 전 노드에 데몬셋으로 배포했습니다. 순간적인 커널 이상 이벤트는 eBPF perf ring buffer를 통해 비동기로 유저 스페이스에 기록되었습니다."
    },
    {
        "time": "17:10",
        "seconds": 1030,
        "speaker": "당근 시스템 엔지니어 & 커널 SRE",
        "text": "드디어 피크 시간대 유령 장애의 실체가 밝혀졌습니다. 원인은 놀랍게도 Redis나 앱 코드가 아니라, AWS VPC CNI의 보조 IP(Secondary IP) 할당 시 발생한 conntrack 테이블 락 경합과 특정 인스턴스 ENI 인터페이스의 링 버퍼 오버플로우였습니다. 특정 노드에서 네트워크 패킷의 SYN 패킷이 드롭되어 1초 타임아웃이 발생했던 것입니다. 커널 내부를 투시하지 않았다면 영원히 미궁에 빠졌을 문제입니다."
    },
    {
        "time": "22:00",
        "seconds": 1320,
        "speaker": "당근 시스템 엔지니어 & 커널 SRE",
        "text": "eBPF 계측을 통해 원인을 밝혀낸 후, CNI 프리워밍 IP 설정과 conntrack-max 임계치를 조정하여 간헐적 504 타임아웃 발생률을 0.12%에서 0.001% 이하로 사실상 박멸했습니다. 상시 계측 오버헤드는 CPU 0.3%, 메모리 50MB 이내로 유지되었습니다. 지나간 알림의 원인을 찾으려면 커널 깊은 곳을 투시하는 eBPF를 꼭 검토해 보시기 바랍니다."
    }
],
    index: 6,
    videoId: 'Wb6l9XTAKN8',
    title: '당근 SRE의 eBPF 활용기 : 지나간 Alert의 원인을 찾다 | 2026 당근 빌더 밋업',
    speaker: '당근 시스템 엔지니어 & 커널 SRE',
    category: '커널 & 네트워크',
    duration: '25분 30초',
    views: '조회수 340회',
    date: '2026. 10. 7.',
    summary: '애플리케이션 로그나 표준 모니터링에는 남지 않고 지나가버린 간헐적 네트워크 타임아웃, TCP 패킷 드롭, 커널 소켓 버퍼 병목을 eBPF 기반 저오버헤드 계측으로 포착해 원인을 규명한 실전 트러블슈팅 사례.',
    keyTakeaways: [
      '애플리케이션 APM은 커널 레벨의 TCP 재전송, conntrack 테이블 고갈, CNI 드롭을 포착하지 못한다.',
      'eBPF는 코드 수정이나 사이드카 없이 1% 미만의 극소 부하로 커널 내부 상태를 실시간 프로빙할 수 있다.',
      '사후 분석(Post-mortem)을 위해 순간적인 커널 이상 이벤트를 링 버퍼에 상시 기록하는 텔레메트리 수집 체계가 필요하다.'
    ],
    techStack: ['eBPF / BCC', 'Linux Kernel (kprobe/tracepoint)', 'Cilium Hubble', 'Coroot', 'AWS VPC CNI'],
    screenAnalysis: {
      headline: '리눅스 커널 레이어 eBPF 프로브 삽입 위치 및 패킷 라이프사이클',
      diagramDescription: '유저 스페이스 애플리케이션 → 소켓 레이어 → TCP/IP 스택 → 네트워크 드라이버로 이어지는 패킷 흐름에서 eBPF 프로그램이 kprobe/tracepoint를 통해 지연 시간과 드롭 지점을 캡처하는 도식도.',
      codeSnippet: {
        language: 'c',
        title: 'TCP 재전송 및 SYN 지연 감지 eBPF 커널 코드 발췌',
        code: `#include <uapi/linux/ptrace.h>
#include <net/sock.h>
#include <net/tcp.h>

BPF_PERF_OUTPUT(tcp_retransmit_events);

int trace_tcp_retransmit_skb(struct pt_regs *ctx, struct sock *sk) {
    if (sk == NULL) return 0;
    
    struct tcp_event_t event = {};
    event.saddr = sk->__sk_common.skc_rcv_saddr;
    event.daddr = sk->__sk_common.skc_daddr;
    event.sport = sk->__sk_common.skc_num;
    event.dport = sk->__sk_common.skc_dport;
    event.state = sk->__sk_common.skc_state;
    event.rtt_us = tcp_sk(sk)->srtt_us >> 3;
    
    tcp_retransmit_events.perf_submit(ctx, &event, sizeof(event));
    return 0;
}`
      },
      visualHighlights: [
        '커널 공간(Kernel Space)과 사용자 공간(User Space) 간 eBPF 맵(Maps) 데이터 교환 구조',
        'Redis 연결 시 간헐적으로 튀던 1초 단위의 TCP SYN 재전송 스파이크 그래프',
        'AWS VPC CNI ENI 인터페이스 큐 오버플로우 발생 순간의 eBPF 추적 타임라인',
        '사이드카 프록시 방식 대비 eBPF의 CPU 오버헤드 벤치마크 (0.3% vs 8.4%)'
      ]
    },
    audioAnalysis: {
      headline: '발표자 육성 포인트: "알림이 울려서 서버에 접속했을 땐 이미 정상입니다. 지나간 흔적은 커널 속에만 남아 있습니다"',
      spokenContext: '당근 서비스에서 간헐적으로 피크 시간대에 "0.1% 미만의 504 게이트웨이 타임아웃" 알림이 발생했습니다. 애플리케이션 코드는 완벽했고, CPU나 메모리도 여유가 있었으며, 서버에 접속해 보면 이미 문제가 사라져 있었습니다. "유령 같은 장애"를 잡기 위해 eBPF를 꺼내 들었습니다.',
      troubleshootingStory: 'eBPF 트레이서를 클러스터 전체 노드에 배포한 결과, 특정 노드에서 AWS VPC CNI의 보조 IP 할당 과정에서 일어난 conntrack 테이블 락(Lock) 경합과 네트워크 인터페이스 링 버퍼 오버플로우가 원인임을 2주 만에 정확히 밝혀냈습니다.',
      quantitativeResults: [
        '간헐적 504 게이트웨이 타임아웃 발생률: 0.12% → 0.001% 이하로 박멸',
        '인프라 계측 오버헤드: CPU 0.3% 미만, 메모리 50MB 이내로 유지',
        '네트워크 장애 원인 파악 소요 기간: 기존 수 주 → 수 시간 내로 단축'
      ],
      speakerAdvice: '애플리케이션 레벨의 로그만으로 네트워크 이슈를 추정하지 마세요. eBPF로 커널의 TCP 소켓 수명주기를 직접 측정하면 의심이 확신이 됩니다.'
    },
    timestamps: [
      { time: '00:00', seconds: 0, label: '도입: 지나가버린 간헐적 알림과 SRE의 미궁', type: 'audio' },
      { time: '04:10', seconds: 250, label: '화면: 애플리케이션 APM이 보지 못하는 커널 심층부', type: 'screen' },
      { time: '08:40', seconds: 520, label: '아키텍처: eBPF 프로브 삽입과 저오버헤드 데이터 파이프라인', type: 'architecture' },
      { time: '14:15', seconds: 855, label: '코드: TCP 재전송 및 conntrack 추적 커널 C 코드', type: 'code' },
      { time: '19:30', seconds: 1170, label: '트러블슈팅: Redis 1초 타임아웃 유령 장애의 실체 규명', type: 'troubleshooting' },
      { time: '23:50', seconds: 1430, label: '결론: eBPF 기반 차세대 인프라 디버깅 전략', type: 'takeaway' }
    ],
    recommendedQuestions: [
      '당근에서 eBPF를 도입해 해결한 가장 결정적인 네트워크 장애 사례는 무엇인가요?',
      '사이드카 모니터링 방식 대비 eBPF가 가진 성능 및 운영상의 장점은 무엇인가요?',
      '프로덕션 Kubernetes 클러스터에 eBPF를 안전하게 배포하기 위한 팁은 무엇인가요?'
    ]
  },
  {
    id: 'session-7',
    fullTranscript: [
    {
        "time": "00:00",
        "seconds": 0,
        "speaker": "당근 보안 엔지니어 & 클라우드 거버넌스 SRE",
        "text": "안녕하세요, 당근 보안 및 인프라 거버넌스 팀입니다. 오늘 발표 주제는 'GitHub Actions에서 정적 키를 없애는 과정: feat. OIDC'입니다. 스타트업이 빠르게 성장하다 보면, 수백 개의 GitHub 레포지토리에 AWS IAM Access Key가 배포용 시크릿으로 등록되기 마련입니다. 이 영구 키들이 얼마나 위험한지, 그리고 OIDC를 통해 어떻게 단 하나의 정적 키도 남기지 않고 전수 제거했는지 공유합니다."
    },
    {
        "time": "03:20",
        "seconds": 200,
        "speaker": "당근 보안 엔지니어 & 클라우드 거버넌스 SRE",
        "text": "당근에는 450개가 넘는 레포지토리가 있었습니다. 각 레포의 Settings > Secrets에는 AWS_ACCESS_KEY_ID와 AWS_SECRET_ACCESS_KEY가 등록되어 있었죠. 문제는 이 키들이 영구적(Long-lived)이라는 점입니다. 누군가 악의를 품고 로그에 출력하거나 탈취하면 언제든 AWS 인프라에 접근할 수 있고, 퇴사자가 발생했을 때 450개 레포의 키를 일일이 로테이션하는 것은 물리적으로 불가능했습니다."
    },
    {
        "time": "07:10",
        "seconds": 430,
        "speaker": "당근 보안 엔지니어 & 클라우드 거버넌스 SRE",
        "text": "해결책은 GitHub Actions와 AWS IAM 간의 OIDC(OpenID Connect) 연동이었습니다. 원리는 간단합니다. GitHub Actions 러너가 빌드 시점에 GitHub OIDC 토큰 발급소에 짧은 수명의 JWT(JSON Web Token)를 요청합니다. 그리고 이 JWT를 AWS STS(Security Token Service)의 AssumeRoleWithWebIdentity API에 제시하면, AWS가 토큰의 서명을 검증하고 15분에서 1시간 동안만 유효한 임시 자격 증명을 발급해 줍니다. 빌드가 끝나면 키는 흔적도 없이 소멸합니다."
    },
    {
        "time": "12:00",
        "seconds": 720,
        "speaker": "당근 보안 엔지니어 & 클라우드 거버넌스 SRE",
        "text": "여기서 가장 중요한 보안 설계는 IAM Trust Policy의 Condition 설정입니다. 단순히 token.actions.githubusercontent.com을 신뢰한다고만 선언하면, 다른 사람의 GitHub 레포지토리에서도 우리 AWS Role을 가져갈 수 있습니다. 반드시 StringEquals에 sts.amazonaws.com 대상을 지정하고, StringLike에 token.actions.githubusercontent.com:sub 클레임으로 'repo:daangn/*:ref:refs/heads/main'처럼 정확한 조직 이름과 브랜치를 제한해야 합니다."
    },
    {
        "time": "16:15",
        "seconds": 975,
        "speaker": "당근 보안 엔지니어 & 클라우드 거버넌스 SRE",
        "text": "450개 레포지토리를 마이그레이션할 때 가장 큰 문제는 개발자들의 작업 중단이었습니다. 저희는 Terraform과 GitHub API 자동화 스크립트를 작성하여, 사내 공통 워크플로우 템플릿에 OIDC Role ARN을 주입하고, 검증이 완료된 레포부터 기존 AWS_ACCESS_KEY Secret을 자동으로 일괄 삭제해 나갔습니다."
    },
    {
        "time": "19:50",
        "seconds": 1190,
        "speaker": "당근 보안 엔지니어 & 클라우드 거버넌스 SRE",
        "text": "결과적으로 사내 GitHub 저장소의 정적 AWS 장기 키 450개를 100% 전수 제거했습니다. 이제는 키 유출에 대한 공포도, 번거로운 키 로테이션 공수도 제로가 되었습니다. 보안의 최고 경지는 비밀번호를 잘 지키는 것이 아니라 지켜야 할 비밀번호 자체를 없애는 것입니다. 지금 당장 OIDC로 전환하십시오."
    }
],
    index: 7,
    videoId: 'lEhFXFGYOMg',
    title: 'GitHub Actions에서 정적 키를 없애는 과정 : feat. OIDC | 2026 당근 빌더 밋업',
    speaker: '당근 보안 엔지니어 & 클라우드 거버넌스 SRE',
    category: '보안 & 거버넌스',
    duration: '21분 40초',
    views: '조회수 294회',
    date: '2026. 10. 7.',
    summary: '수백 개 저장소에 분산 발급되어 있던 AWS 장기 정적 키(Access Key)를 100% 제거하고, OIDC(OpenID Connect)를 기반으로 최소 권한과 단기 임시 자격 증명(STS) 체계로 전면 전환한 실전 보안 마이그레이션 전략.',
    keyTakeaways: [
      '하드코딩되거나 GitHub Secrets에 저장된 정적 키는 로테이션이 어렵고 유출 시 치명적이다.',
      'GitHub Actions와 AWS IAM의 OIDC 연동을 통해 토큰 수명이 15분~1시간인 단기 STS 자격증명으로 대체해야 한다.',
      'IAM Trust Policy에 레포지토리 이름과 main 브랜치 클레임을 엄격히 제한(Least Privilege)해야 토큰 탈취를 방지할 수 있다.'
    ],
    techStack: ['GitHub Actions OIDC', 'AWS IAM & STS', 'OpenID Connect', 'Terraform / CloudFormation'],
    screenAnalysis: {
      headline: 'GitHub OIDC ID 토큰 발급 및 AWS STS AssumeRole 교환 시퀀스 다이어그램',
      diagramDescription: 'GitHub Actions 러너가 GitHub OIDC Provider로부터 암호화된 JWT를 수신하고, 이를 AWS STS에 제출하여 임시 IAM Role 자격증명을 획득하는 신뢰 체인(Trust Chain) 도식.',
      codeSnippet: {
        language: 'json',
        title: 'AWS IAM Role의 엄격한 GitHub OIDC Trust Policy 예시',
        code: `{
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
}`
      },
      visualHighlights: [
        '정적 액세스 키(Static Key) 방식 vs OIDC 임시 자격증명 방식 비교 인포그래픽',
        '전사 레포지토리 내 정적 키 보유 현황 대시보드 (전환 전 450개 → 전환 후 0개)',
        'GitHub Actions 워크플로우 YAML의 permissions: id-token: write 선언부',
        'IAM 감사 로그(CloudTrail)에서 발급된 세션의 추적성 검증 콘솔 화면'
      ]
    },
    audioAnalysis: {
      headline: '발표자 육성 포인트: "보안의 최고 경지는 비밀번호를 잘 지키는 것이 아니라, 지켜야 할 비밀번호 자체를 없애는 것입니다"',
      spokenContext: '당근 조직이 커지면서 수백 개의 레포지토리마다 배포용 AWS 키가 발급되어 있었습니다. 퇴사자 발생 시 키를 로테이션하려면 어떤 레포지토리가 이 키를 쓰고 있는지조차 파악하기 어려웠습니다. "유출될 수 있는 정적 키 자체를 소멸시키자"는 목표로 시작되었습니다.',
      troubleshootingStory: 'OIDC로 전환하는 과정에서 특정 모노레포의 PR 브랜치에서 실수로 프로덕션 Role을 획득할 뻔했던 권한 설계 결함을 발견했습니다. Condition sub 클레임에 브랜치(`ref:refs/heads/main`)와 환경(`environment:production`) 제약을 추가하여 안전성을 확보했습니다.',
      quantitativeResults: [
        '사내 GitHub 저장소 내 AWS 장기 정적 키: 450개 전수 제거 (100% 달성)',
        '키 로테이션 소요 공수: 연간 수십 시간 → 0시간(자동 만료)',
        '보안 감사 컴플라이언스(AWS Well-Architected Security) 통과'
      ],
      speakerAdvice: 'IAM Trust Policy의 StringLike에 와일드카드(*)를 남발하지 마세요. repo 이름과 ref 브랜치를 반드시 명시해야 다른 레포지토리의 탈취 공격을 막을 수 있습니다.'
    },
    timestamps: [
      { time: '00:00', seconds: 0, label: '도입: 수백 개 레포에 흩어진 정적 키의 위험성', type: 'audio' },
      { time: '03:50', seconds: 230, label: '화면: OIDC 토큰 교환 메커니즘과 STS 신뢰 관계', type: 'screen' },
      { time: '08:20', seconds: 500, label: '아키텍처: GitHub IdP와 AWS IAM 정책 구조', type: 'architecture' },
      { time: '13:10', seconds: 790, label: '코드: IAM Trust Policy 및 워크플로우 permissions 선언', type: 'code' },
      { time: '17:00', seconds: 1020, label: '트러블슈팅: 브랜치 와일드카드 권한 누수 방지 설계', type: 'troubleshooting' },
      { time: '20:10', seconds: 1210, label: '성과: 정적 키 0개 달성과 전사 보안 가이드라인', type: 'takeaway' }
    ],
    recommendedQuestions: [
      'GitHub Actions에서 AWS IAM OIDC를 연결할 때 필수적인 설정은 무엇인가요?',
      'Pull Request 환경에서 OIDC 토큰이 악용되지 않도록 막는 Condition 조건은 무엇인가요?',
      '수백 개의 기존 레포지토리를 무중단으로 OIDC로 마이그레이션한 팁은 무엇인가요?'
    ]
  },
  {
    id: 'session-8',
    fullTranscript: [
    {
        "time": "00:00",
        "seconds": 0,
        "speaker": "당근 데이터베이스 & 캐시 인프라 SRE",
        "text": "안녕하세요. 당근 데이터 플랫폼 SRE 팀입니다. 이번 발표는 '캐시가 서 말이라도 꿰어야 보배: Redis to Valkey, 캐시 인프라 표준까지'입니다. 2024년 봄, 오픈소스 진영을 뒤흔든 Redis 라이선스 변경 발표가 있었습니다. 당근은 수십 개의 핵심 서비스가 Redis에 의존하고 있었는데, 이 위기를 어떻게 리눅스 재단 오픈소스인 Valkey 8.0 전환과 전사 캐시 표준화의 기회로 만들었는지 설명합니다."
    },
    {
        "time": "03:50",
        "seconds": 230,
        "speaker": "당근 데이터베이스 & 캐시 인프라 SRE",
        "text": "당시 당근의 캐시 인프라는 심각하게 파편화되어 있었습니다. 서비스 팀마다 Redis 5.0, 6.2, 7.0 등 제각각 다른 버전을 쓰고 있었고, 클라이언트 라이브러리의 타임아웃 설정, 커넥션 풀 크기, 재시도 로직도 제각각이었습니다. 라이선스 변경 소식을 들었을 때 단순한 엔진 교체만 해서는 또 다른 부채를 남길 것이라 판단했습니다. 'Valkey 마이그레이션과 캐시 인프라 표준화'를 하나의 프로젝트로 통합했습니다."
    },
    {
        "time": "08:30",
        "seconds": 510,
        "speaker": "당근 데이터베이스 & 캐시 인프라 SRE",
        "text": "왜 Valkey였을까요? Valkey는 Redis 창시자들과 리눅스 재단, AWS, 구글 등이 주도하는 100% 오픈소스 프로젝트입니다. 특히 최신 Valkey 8.0은 비동기 I/O 멀티스레딩 성능이 비약적으로 향상되어, 고부하 벤치마크에서 기존 Redis 7 대비 처리량(Throughput)이 30% 이상 증가하고 P99 지연 시간이 훨씬 안정적이었습니다."
    },
    {
        "time": "13:40",
        "seconds": 820,
        "speaker": "당근 데이터베이스 & 캐시 인프라 SRE",
        "text": "가장 중요한 과제는 '프로덕션 0초 다운타임 마이그레이션'이었습니다. 당근의 중고거래 피드와 채팅은 1초만 캐시가 끊겨도 DB에 부하가 쏟아집니다. 저희는 기존 Redis 마스터 클러스터에 Valkey 노드를 슬레이브(Replica)로 연결하여 실시간 복제 스트림을 동기화했습니다. 데이터 정합성이 100% 일치하는 것을 확인한 후, 롤링 페일오버를 트리거하여 Valkey를 마스터로 승격시키고 트래픽을 무중단 스위칭했습니다."
    },
    {
        "time": "19:00",
        "seconds": 1140,
        "speaker": "당근 데이터베이스 & 캐시 인프라 SRE",
        "text": "트러블슈팅도 있었습니다. 페일오버 직후 특정 Python/Go 클라이언트 라이브러리가 DNS 캐싱 때문에 이전 마스터 주소로 쓰기 요청을 계속 보내며 MOVED 에러가 쏟아졌습니다. 저희는 사내 공통 캐시 SDK를 개발하여, 클러스터 토폴로지 변경 자동 감지, 서킷 브레이커, 지수 백오프(Exponential Backoff) 재시도 로직을 표준화하여 전사에 배포했습니다."
    },
    {
        "time": "24:30",
        "seconds": 1470,
        "speaker": "당근 데이터베이스 & 캐시 인프라 SRE",
        "text": "그 결과, 수십 대의 프로덕션 캐시 클러스터를 단 1초의 서비스 중단 없이 Valkey로 전환 완료했습니다. 피크 시간대 캐시 처리량은 32% 향상되었고, 불필요하게 흩어져 있던 중복 인스턴스를 통폐합해 인프라 비용도 18% 절감했습니다. 외부 라이선스 변화의 파도를 두려워하지 말고, 인프라를 체질 개선하는 최고의 기회로 삼으시길 바랍니다."
    }
],
    index: 8,
    videoId: 'LXAkxqSmld4',
    title: '캐시가 서 말이라도 꿰어야 보배 : Redis to Valkey, 캐시 인프라 표준까지 | 2026 당근 빌더 밋업',
    speaker: '당근 데이터베이스 & 캐시 인프라 SRE',
    category: '데이터 & 캐시',
    duration: '27분 20초',
    views: '조회수 564회',
    date: '2026. 10. 7.',
    summary: 'Redis 라이선스 정책 변경에 대응해 리눅스 재단 주도의 오픈소스 Valkey 8.0으로 무중단 마이그레이션을 완수하고, 파편화되어 있던 사내 캐시 인프라 아키텍처와 클라이언트 SDK 표준화를 이뤄낸 여정.',
    keyTakeaways: [
      '라이선스 변경 리스크는 단순히 소프트웨어를 바꾸는 문제가 아니라 인프라 표준화를 위한 최적의 전환점이다.',
      'Valkey 8.0은 비동기 I/O 스레딩 개선으로 고부하 환경에서 Redis 7 대비 최대 30% 이상의 처리량(Throughput) 향상을 보인다.',
      '무중단 마이그레이션 시 레플리카 스트림 동기화와 클라이언트 재시도 백오프(Exponential Backoff)가 핵심이다.'
    ],
    techStack: ['Valkey 8.0', 'Redis 7.2', 'Kubernetes Operator', 'Go / Python Cache SDK', 'Prometheus'],
    screenAnalysis: {
      headline: 'Redis to Valkey 무중단 롤링 마이그레이션 토폴로지 및 클라이언트 표준화',
      diagramDescription: '기존 Redis 마스터에 Valkey 노드를 레플리카(Replica)로 붙여 실시간 복제를 유지한 뒤, 페일오버를 트리거하여 마스터 역할을 전환하고 트래픽을 무중단 스위칭하는 4단계 전환 다이어그램.',
      codeSnippet: {
        language: 'yaml',
        title: '당근의 Valkey 클러스터 표준 설정 및 리소스 사양',
        code: `apiVersion: valkey.io/v1alpha1
kind: ValkeyCluster
metadata:
  name: daangn-cache-standard
spec:
  version: "8.0"
  replicasPerMaster: 1
  resources:
    requests:
      cpu: "4000m"
      memory: "16Gi"
  customConfig:
    maxmemory-policy: "volatile-lru"
    io-threads: "4"
    io-threads-do-reads: "yes"
    timeout: "0"
    tcp-keepalive: "300"`
      },
      visualHighlights: [
        'Valkey vs Redis 처리량(RPS) 및 레이턴시 벤치마크 비교 그래프 (QPS 32% 향상)',
        '무중단 페일오버 중 드롭된 요청 0건을 나타내는 실시간 모니터링 대시보드',
        '사내 표준 캐시 클라이언트 SDK의 서킷 브레이커 및 타임아웃 구성도',
        '전사 수십 개 캐시 클러스터의 마이그레이션 현황 추적 칸반 보드'
      ]
    },
    audioAnalysis: {
      headline: '발표자 육성 포인트: "엔진만 바꾸는 것은 하수입니다. 이번 기회에 제각각이던 캐시 설정과 SDK까지 모두 표준화했습니다"',
      spokenContext: '2024년 Redis 라이선스 변경 발표 당시 많은 기업들이 혼란을 겪었습니다. 당근도 수십 개의 서비스에서 서로 다른 버전의 Redis를 다양한 방식으로 사용하고 있어 업그레이드조차 위험했습니다. 당근 SRE 팀은 위기를 기회 삼아 Valkey 전환과 캐시 표준화를 동시에 추진했습니다.',
      troubleshootingStory: '페일오버 시 특정 클라이언트 라이브러리가 마스터 전환 이벤트를 감지하지 못하고 이전 마스터 주소로 계속 쓰기 요청을 보내며 에러가 발생한 트러블슈팅을 회고합니다. 공통 캐시 SDK를 사내 라이브러리로 배포하여 MOVED/ASK 리디렉션 처리와 지수 백오프를 강제 적용했습니다.',
      quantitativeResults: [
        '사내 프로덕션 캐시 클러스터: 100% 무중단 Valkey 전환 완료 (다운타임 0초)',
        '피크 시간대 캐시 인프라 처리량(Throughput): 약 32% 향상',
        '불필요한 중복 캐시 인스턴스 통폐합을 통해 호스팅 비용 18% 절감'
      ],
      speakerAdvice: '캐시 마이그레이션 전 반드시 클라이언트 SDK의 DNS 캐싱과 페일오버 재시도 로직을 카나리 환경에서 먼저 검증하세요.'
    },
    timestamps: [
      { time: '00:00', seconds: 0, label: '도입: Redis 라이선스 변경 충격과 당근의 선택', type: 'audio' },
      { time: '04:30', seconds: 270, label: '화면: 오픈소스 Valkey 8.0의 아키텍처 및 벤치마크 결과', type: 'screen' },
      { time: '09:50', seconds: 590, label: '아키텍처: 다운타임 0초를 위한 레플리카 복제 스위칭 설계', type: 'architecture' },
      { time: '15:10', seconds: 910, label: '코드: 사내 표준 ValkeyCluster 매니페스트 및 설정값', type: 'code' },
      { time: '20:30', seconds: 1230, label: '트러블슈팅: 클라이언트 리디렉션 루프와 공통 SDK 제작기', type: 'troubleshooting' },
      { time: '25:10', seconds: 1510, label: '성과: 전사 캐시 표준화 완수와 처리량 32% 상승', type: 'takeaway' }
    ],
    recommendedQuestions: [
      'Redis에서 Valkey로 무중단 전환할 때 데이터 손실을 막은 핵심 절차는 무엇인가요?',
      'Valkey 8.0 도입 후 실제 체감된 성능 향상과 리소스 사용량 차이는 어떤가요?',
      '사내에서 파편화된 캐시 클라이언트 라이브러리를 표준화한 방법은 무엇인가요?'
    ]
  },
  {
    id: 'session-9',
    fullTranscript: [
    {
        "time": "00:00",
        "seconds": 0,
        "speaker": "당근 IT 엔지니어링 & 기업 거버넌스 SRE",
        "text": "안녕하세요, 당근 IT 엔지니어링 및 거버넌스 SRE 팀입니다. 오늘 마지막 세션 주제는 '우리는 왜 GitHub에서 GitHub로 옮겼나: 개인 소유 계정에서 회사 관리 계정으로'입니다. 많은 초기 스타트업이 개발자 개인 GitHub 아이디를 조직에 초대해서 씁니다. 하지만 회사가 수백 명 규모로 커졌을 때 이것이 왜 거대한 보안 시한폭탄이 되는지, 그리고 GitHub EMU로 어떻게 무중단 이관했는지 공유합니다."
    },
    {
        "time": "03:40",
        "seconds": 220,
        "speaker": "당근 IT 엔지니어링 & 기업 거버넌스 SRE",
        "text": "개인 소유 계정 초대의 치명적인 문제는 세 가지였습니다. 첫째, 퇴사자가 발생했을 때 관리자가 수동으로 권한을 회수해야 하는데, 누락될 경우 퇴사자가 개인 노트북에서 사내 프라이빗 코드를 계속 열람할 수 있는 위험이 있었습니다. 둘째, 사내 SSO(Okta/Google Workspace)와 2단계 인증을 강제할 수 없었습니다. 셋째, 감사 로그에서 개인이 사내 코드를 개인 레포로 포크하거나 복사하는 것을 통제할 수 없었습니다."
    },
    {
        "time": "08:10",
        "seconds": 490,
        "speaker": "당근 IT 엔지니어링 & 기업 거버넌스 SRE",
        "text": "저희는 GitHub Enterprise Managed Users(EMU)로의 전면 이관을 결정했습니다. EMU 체계에서는 개인 계정을 쓰지 않고, 사내 Okta IdP와 SCIM 프로토콜로 연동된 회사 전용 계정(gildong_daangn)이 자동 발급됩니다. 인사 시스템(HR)에서 퇴사 처리가 되면 1초 만에 GitHub 계정이 즉시 비활성화되어 코드 접근권이 완벽히 차단됩니다."
    },
    {
        "time": "13:20",
        "seconds": 800,
        "speaker": "당근 IT 엔지니어링 & 기업 거버넌스 SRE",
        "text": "문제는 마이그레이션의 규모였습니다. 300명이 넘는 개발자, 수천 개의 레포지토리, 수만 개의 커밋 히스토리, PR과 이슈, 그리고 CI/CD에 등록된 시크릿까지 통째로 새 엔터프라이즈 조직으로 옮겨야 했습니다. 특히 개발자들이 가장 민감해했던 '커밋 잔디(기여도)'와 작성자 이메일 매핑 가이드를 사전에 꼼꼼히 마련해 반발을 최소화했습니다."
    },
    {
        "time": "17:50",
        "seconds": 1070,
        "speaker": "당근 IT 엔지니어링 & 기업 거버넌스 SRE",
        "text": "마이그레이션 D-Day에 가장 아찔했던 순간은 CI/CD 파이프라인의 미등록 봇들이었습니다. 과거 개인 계정의 PAT(Personal Access Token)로 돌리던 배포 스크립트들이 계정 이관 시 일제히 깨질 위기였습니다. 저희는 이관 전 3주 동안 GitHub API 감사 로그를 분석해 사내 모든 레포의 클론/푸시 토큰을 전수 조사하고, 이를 사내 머신 계정(Machine User)으로 사전 교체해 두어 서비스 장애를 완전히 방지했습니다."
    },
    {
        "time": "21:40",
        "seconds": 1300,
        "speaker": "당근 IT 엔지니어링 & 기업 거버넌스 SRE",
        "text": "D-Day 배포 프리즈 2시간 만에 300여 명의 계정과 핵심 레포의 마이그레이션을 100% 무중단으로 완수했습니다. 이제 당근은 입사와 동시에 필요한 레포 권한이 자동 부여되고, 퇴사 즉시 모든 권한이 안전하게 회수되는 엔터프라이즈급 보안 거버넌스를 갖추게 되었습니다. 조직이 100명을 넘어가고 있다면, 하루라도 빨리 EMU 전환을 준비하시기 바랍니다. 감사합니다."
    }
],
    index: 9,
    videoId: 'yRZ3MFZjwVc',
    title: '우리는 왜 GitHub에서 GitHub로 옮겼나 : 개인 소유 계정에서 회사 관리 계정으로 | 2026 당근 빌더 밋업',
    speaker: '당근 IT 엔지니어링 & 기업 거버넌스 SRE',
    category: '엔터프라이즈 관리',
    duration: '23분 50초',
    views: '조회수 281회',
    date: '2026. 10. 7.',
    summary: '개발자 개인 소유 GitHub 계정을 사용하던 과거 방식에서 엔터프라이즈 보안과 계정 수명주기 자동화를 위해 GitHub Enterprise Managed Users(EMU) 조직으로 300명 이상의 개발자와 수천 개 레포를 무중단 이관한 대형 프로젝트 기록.',
    keyTakeaways: [
      '개인 소유 계정 초대는 퇴사 시 사내 코드 접근권 즉시 차단과 SSO 2단계 인증 강제에 한계가 있다.',
      'GitHub EMU는 사내 IdP(Okta/Google Workspace)와 SCIM으로 연동되어 입퇴사 시 계정이 자동 프로비저닝된다.',
      '기존 커밋 히스토리(Author), 잔디(Contribution), Personal Access Token(PAT), CI SSH 키 마이그레이션이 성공의 열쇠다.'
    ],
    techStack: ['GitHub Enterprise (EMU)', 'Okta / Google Workspace SSO', 'SCIM 프로비저닝', 'Git Migration CLI'],
    screenAnalysis: {
      headline: 'GitHub EMU와 사내 IdP(SSO/SCIM) 계정 라이프사이클 동기화 아키텍처',
      diagramDescription: '인사 관리 시스템(HR) → IdP(Okta) 사용자 상태 변경 → SCIM 프로토콜 → GitHub Enterprise 조직 내 EMU 계정 자동 생성/정지/삭제 동기화 파이프라인.',
      codeSnippet: {
        language: 'bash',
        title: '커밋 작성자 이메일 매핑 및 로컬 Git 설정 일괄 변경 스크립트',
        code: `#!/usr/bin/env bash
# Daangn EMU Git Config Migrator
echo "당근 EMU 계정 설정으로 변경합니다..."

git config --global user.name "Hong Gildong (daangn)"
git config --global user.email "gildong@daangn.com"

# 기존 서명 키 재등록 및 EMU 토큰 세팅
gh auth login --hostname github.com --web`
      },
      visualHighlights: [
        '개인 소유 계정(Personal Account) vs EMU(Enterprise Managed User) 보안 기능 비교 표',
        '마이그레이션 D-Day 타임라인: 서비스 배포 프리즈(Freeze) 3시간 동안의 실행 절차',
        '개발자 노션 가이드 화면: 커밋 히스토리 보존 및 사내 잔디 연동 FAQ',
        '전사 300+ 개발자 계정 전환율 실시간 대시보드 (100% 완료)'
      ]
    },
    audioAnalysis: {
      headline: '발표자 육성 포인트: "단순히 계정 명칭을 바꾸는 게 아니라, 300명 개발자의 일상과 자동화 파이프라인의 심장을 교체한 작업이었습니다"',
      spokenContext: '초기 스타트업 시절에는 개인 GitHub 계정으로 팀을 꾸리는 것이 자연스러웠습니다. 하지만 당근의 규모가 커지고 상장/보안 감사가 강화되면서 "퇴사자가 개인 계정으로 사내 프라이빗 코드를 열람할 수 있는 위험"을 반드시 원천 차단해야 했습니다.',
      troubleshootingStory: '마이그레이션 당일, 기존 수백 개 CI/CD 파이프라인에서 개인 PAT(Personal Access Token)나 Deploy Key를 쓰고 있던 미등록 봇들이 동작하지 않을 뻔했던 아찔한 순간을 공유합니다. 3주간 사전 모니터링으로 모든 트래픽을 추적해 Machine User(머신 계정)로 사전 교체해 두어 무중단을 달성했습니다.',
      quantitativeResults: [
        '전사 개발자 및 협력사 계정 100% EMU 전환 완료',
        '퇴사자 계정 권한 회수 누락률: 0% (HR 퇴사 처리 즉시 1초 만에 자동 회수)',
        '마이그레이션 당일 실제 서비스 배포 영향 시간: 0분 (계획된 2시간 프리즈 내 완결)'
      ],
      speakerAdvice: '계정 이관 전 최소 한 달간 레포지토리의 클론/푸시 로그를 감사하여 숨겨진 개인 토큰과 CI 스크립트를 전수 조사하세요.'
    },
    timestamps: [
      { time: '00:00', seconds: 0, label: '도입: 개인 계정 초대의 편리함 뒤에 숨은 보안 리스크', type: 'audio' },
      { time: '04:20', seconds: 260, label: '화면: GitHub EMU vs 일반 엔터프라이즈 계정 구조 비교', type: 'screen' },
      { time: '08:50', seconds: 530, label: '아키텍처: IdP(SSO)와 SCIM 기반 자동 프로비저닝 플로우', type: 'architecture' },
      { time: '13:40', seconds: 820, label: '코드: 로컬 Git 설정 및 커밋 히스토리 매핑 가이드', type: 'code' },
      { time: '17:50', seconds: 1070, label: '트러블슈팅: 숨겨진 CI/CD 개인 토큰(PAT) 전수 조사 비하인드', type: 'troubleshooting' },
      { time: '21:30', seconds: 1290, label: '성과: 무중단 계정 대이동 완료와 완벽한 거버넌스', type: 'takeaway' }
    ],
    recommendedQuestions: [
      'GitHub EMU 도입 시 기존 개발자들의 커밋 잔디(기여도) 보존은 어떻게 처리했나요?',
      '수백 개의 CI/CD 파이프라인에서 개인 PAT(Personal Access Token) 문제를 어떻게 사전 차단했나요?',
      '사내 SSO(Okta/Google Workspace)와 GitHub SCIM 연동 시 주의할 점은 무엇인가요?'
    ]
  }
];
