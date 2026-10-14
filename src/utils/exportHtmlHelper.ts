import { SESSIONS_DATA, PLAYLIST_INFO } from '../data/playlistData.ts';
import { SESSION_ARCHITECTURES, SessionArchitecture } from '../data/sessionArchitectureData.ts';
import { NODE_DETAIL_SPECS, NodeDetailSpec } from '../data/nodeDetailSpecs.ts';
import { ADOPTION_TRACKS, QUANTITATIVE_METRICS, FAQ_KNOWLEDGE_BASE } from '../data/adoptionPlaybookData.ts';

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates the complete, standalone, self-contained single-file HTML document
 * containing the 9-session master topology, interactive node inspectors for every session,
 * full transcripts, audio insights, and visual code snippets.
 */
export function generateStandaloneHtmlReport(): string {
  // 1. Build Master 5-Layer Architecture Section
  const masterLayersHtml = `
    <section class="master-architecture-section" id="master-topology">
      <div class="master-header">
        <div class="master-badge-row">
          <span class="badge badge-accent">🗺️ 전체 아키텍처 토폴로지</span>
          <span class="badge badge-secondary">9대 세션 실측 융합 맵</span>
          <span class="badge badge-emerald">✓ 전사 프로덕션 검증 완료</span>
        </div>
        <h2 class="master-title">당근 SRE 차세대 인프라 전체 아키텍처 토폴로지 (5계층)</h2>
        <p class="master-subtitle">
          개발자 환경(CI/CD)부터 Kubernetes 오케스트레이션, TPU 가속기, eBPF 커널 계측, AI 옵저버빌리티, 제로 트러스트 보안 거버넌스까지 9대 세션의 실무 아키텍처를 통합한 종합 시스템 토폴로지입니다.
        </p>
      </div>

      <!-- 5 Layers Grid -->
      <div class="layers-container">
        <!-- Layer 1 -->
        <div class="layer-card layer-l1">
          <div class="layer-head">
            <div class="layer-tag">L1. 개발자 환경 & 배포 오케스트레이션</div>
            <div class="layer-metric">CI 14분 → 2분 | MCP 가드레일</div>
          </div>
          <div class="layer-nodes-grid">
            <a href="#session-1" class="topo-node-box">
              <div class="topo-node-title">
                <span class="topo-icon">⚡</span>
                <strong>[세션 1] 고속 캐시 CI 러너</strong>
              </div>
              <span class="topo-pill pill-amber">히트율 99.4%</span>
              <p class="topo-desc">K8s Ephemeral Runner + NVMe 로컬 캐시 데몬 + BuildKit mode=max 레이어 공유</p>
              <span class="topo-link">세션 1 상세 스펙 보기 →</span>
            </a>
            <a href="#session-2" class="topo-node-box">
              <div class="topo-node-title">
                <span class="topo-icon">🛡️</span>
                <strong>[세션 2] 배포 전용 MCP 서버</strong>
              </div>
              <span class="topo-pill pill-purple">SLO 가드레일</span>
              <p class="topo-desc">AI 쉘 직접 실행 차단, 표준 MCP 툴 래핑 + 카나리 10% 자동 메트릭 검증</p>
              <span class="topo-link">세션 2 상세 스펙 보기 →</span>
            </a>
          </div>
        </div>

        <!-- Layer 2 -->
        <div class="layer-card layer-l2">
          <div class="layer-head">
            <div class="layer-tag">L2. 멀티 클라우드 오케스트레이션 & AI 가속기</div>
            <div class="layer-metric">EKS 비용 -28% | TPU 가동률 82%</div>
          </div>
          <div class="layer-nodes-grid">
            <a href="#session-3" class="topo-node-box">
              <div class="topo-node-title">
                <span class="topo-icon">⚙️</span>
                <strong>[세션 3] AWS EKS + Karpenter v1.0</strong>
              </div>
              <span class="topo-pill pill-emerald">프로비저닝 35초</span>
              <p class="topo-desc">ASG 45개 전면 제거, Spot 인스턴스 빈패킹 & Graviton(ARM64) 유연성 풀</p>
              <span class="topo-link">세션 3 상세 스펙 보기 →</span>
            </a>
            <a href="#session-4" class="topo-node-box">
              <div class="topo-node-title">
                <span class="topo-icon">🚀</span>
                <strong>[세션 4] GKE + TPU v5e 가속기 풀</strong>
              </div>
              <span class="topo-pill pill-cyan">가동률 82%</span>
              <p class="topo-desc">KubeRay 주간 추론(vLLM) ↔ 야간 배치 동적 전환, GCS 영구 XLA 캐시</p>
              <span class="topo-link">세션 4 상세 스펙 보기 →</span>
            </a>
          </div>
        </div>

        <!-- Layer 3 -->
        <div class="layer-card layer-l3">
          <div class="layer-head">
            <div class="layer-tag">L3. 데이터 캐시 인프라 & 커널 레벨 분석</div>
            <div class="layer-metric">다운타임 0초 Valkey | eBPF 0.3% 계측</div>
          </div>
          <div class="layer-nodes-grid">
            <a href="#session-8" class="topo-node-box">
              <div class="topo-node-title">
                <span class="topo-icon">💾</span>
                <strong>[세션 8] Valkey 8.0 표준 캐시</strong>
              </div>
              <span class="topo-pill pill-teal">QPS +32% 향상</span>
              <p class="topo-desc">Redis 무중단 마이그레이션, 레플리카 롤링 페일오버, 공통 캐시 SDK 표준화</p>
              <span class="topo-link">세션 8 상세 스펙 보기 →</span>
            </a>
            <a href="#session-6" class="topo-node-box">
              <div class="topo-node-title">
                <span class="topo-icon">🔬</span>
                <strong>[세션 6] eBPF 커널 심층 모니터링</strong>
              </div>
              <span class="topo-pill pill-amber">오버헤드 0.3% 미만</span>
              <p class="topo-desc">APM 불가 영역 추적: TCP SYN 재전송 & conntrack 락 경합 kprobe 링 버퍼 기록</p>
              <span class="topo-link">세션 6 상세 스펙 보기 →</span>
            </a>
          </div>
        </div>

        <!-- Layer 4 -->
        <div class="layer-card layer-l4">
          <div class="layer-head">
            <div class="layer-tag">L4. 차세대 AI 옵저버빌리티 & 장애 대응</div>
            <div class="layer-metric">MTTR 45분 → 8분 (-82%)</div>
          </div>
          <div class="layer-nodes-grid full-width">
            <a href="#session-5" class="topo-node-box">
              <div class="topo-node-title">
                <span class="topo-icon">🤖</span>
                <strong>[세션 5] Grafana 800개 대시보드 탈피 & AI 에이전트 자율 분석 파이프라인</strong>
              </div>
              <span class="topo-pill pill-blue">최고 조회수 4,490회</span>
              <p class="topo-desc">Mimir/Tempo/Loki 원천 텔레메트리 직접 파싱 → 슬랙 스마트 얼럿(원인 PR + 3개 증거 체인 + 권장 조치) 즉시 발송</p>
              <span class="topo-link">세션 5 상세 스펙 보기 →</span>
            </a>
          </div>
        </div>

        <!-- Layer 5 -->
        <div class="layer-card layer-l5">
          <div class="layer-head">
            <div class="layer-tag">L5. 엔터프라이즈 보안 & ID 거버넌스</div>
            <div class="layer-metric">정적 키 0개 | 퇴사 권한 회수 1초</div>
          </div>
          <div class="layer-nodes-grid">
            <a href="#session-7" class="topo-node-box">
              <div class="topo-node-title">
                <span class="topo-icon">🔑</span>
                <strong>[세션 7] GitHub Actions OIDC (Zero Keys)</strong>
              </div>
              <span class="topo-pill pill-rose">AWS 키 450개 전수 삭제</span>
              <p class="topo-desc">하드코딩 키 완전 제거, GitHub OIDC Token 발급 및 15분 STS 단기 자격 증명</p>
              <span class="topo-link">세션 7 상세 스펙 보기 →</span>
            </a>
            <a href="#session-9" class="topo-node-box">
              <div class="topo-node-title">
                <span class="topo-icon">🏢</span>
                <strong>[세션 9] GitHub EMU 전사 무중단 이관</strong>
              </div>
              <span class="topo-pill pill-purple">권한 회수 누락률 0%</span>
              <p class="topo-desc">개인 계정 초대 폐기, Okta SSO + SCIM 프로토콜 300+명 수천 개 레포 안전 이관</p>
              <span class="topo-link">세션 9 상세 스펙 보기 →</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `;

  // 1-1. Build Adoption Playbook Section (All 4 Tracks with 3-Step Guides & Production Snippets)
  const playbookTracksHtml = ADOPTION_TRACKS.map((track, idx) => {
    const isFirst = idx === 0;
    const whatDidHtml = track.whatDaangnDid
      .map((item) => `<li><span class="chk-icon">✓</span> <span>${escapeHtml(item)}</span></li>`)
      .join('');

    const stepsHtml = track.howToAdopt
      .map((step, sIdx) => {
        const codeHtml = step.code
          ? `
          <div class="code-box">
            <div class="code-header">
              <span>⚙️ 실전 적용 설정 스니펫</span>
              <button class="btn-copy" onclick="copyCode(this)">코드 복사</button>
            </div>
            <pre><code>${escapeHtml(step.code)}</code></pre>
          </div>
        `
          : '';

        return `
          <div class="playbook-step-card">
            <div class="step-badge-row">
              <span class="step-num-badge">Step ${sIdx + 1}</span>
              <span class="step-phase-title">${escapeHtml(step.phase)}</span>
            </div>
            <p class="step-action-desc">${escapeHtml(step.action)}</p>
            ${codeHtml}
          </div>
        `;
      })
      .join('');

    return `
      <div class="playbook-track-pane ${isFirst ? 'active' : ''}" id="pb-pane-${track.id}">
        <div class="track-pane-header">
          <div class="track-header-top">
            <span class="badge badge-accent">${escapeHtml(track.title)}</span>
            <span class="badge badge-secondary">난이도: <strong>${escapeHtml(track.difficulty)}</strong></span>
            <span class="badge badge-secondary">${escapeHtml(track.sessions)}</span>
          </div>
          <p class="track-summary-text">${escapeHtml(track.summary)}</p>
        </div>

        <div class="playbook-two-col">
          <!-- Left: What Daangn SRE Did -->
          <div class="playbook-col-card">
            <div class="col-card-title">📌 당근 SRE 실제 적용 사례 (Production Proven)</div>
            <ul class="daangn-did-list">
              ${whatDidHtml}
            </ul>
          </div>

          <!-- Right: How To Adopt (3-Step Guide) -->
          <div class="playbook-col-card flex-grow">
            <div class="col-card-title">🛠️ 우리 회사 3단계 실무 도입 가이드</div>
            <div class="steps-flow">
              ${stepsHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const playbookNavTabs = ADOPTION_TRACKS.map(
    (t, idx) => `
    <button class="pb-tab-btn ${idx === 0 ? 'active' : ''}" id="pb-btn-${t.id}" onclick="switchPlaybookTrack('${t.id}')">
      <span class="pb-tab-title">${escapeHtml(t.shortTitle)}</span>
      <span class="pb-tab-sub">${escapeHtml(t.difficulty)}</span>
    </button>
  `
  ).join('');

  const adoptionPlaybookHtml = `
    <section class="adoption-playbook-section" id="adoption-playbook">
      <div class="section-header-box">
        <div class="section-badge-row">
          <span class="badge badge-accent">🛠️ 실전 인프라 도입 플레이북</span>
          <span class="badge badge-secondary">4대 핵심 트랙</span>
          <span class="badge badge-emerald">✓ 우리 회사 인프라 적용 3단계 가이드</span>
        </div>
        <h2 class="section-main-title">당근 SRE 인사이트 실무 도입 플레이북</h2>
        <p class="section-sub-desc">
          당근 엔지니어들이 4,300만 사용자를 지탱하며 직접 겪고 해결한 9대 세션의 핵심 엔지니어링을 우리 회사 인프라에 바로 적용할 수 있도록 정리한 4대 핵심 트랙별 3단계 실천 로드맵입니다.
        </p>
      </div>

      <!-- Playbook Track Tabs -->
      <div class="pb-tabs-container">
        <div class="pb-tabs-bar">
          ${playbookNavTabs}
        </div>
        <button class="pb-toggle-all-btn" onclick="toggleAllPlaybookTracks()">
          <span id="pb-toggle-text">전체 트랙 한 번에 펼치기 ⬇</span>
        </button>
      </div>

      <!-- Track Panes -->
      <div class="pb-panes-wrapper" id="pb-panes-wrapper">
        ${playbookTracksHtml}
      </div>
    </section>
  `;

  // 1-2. Build Quantitative Metrics Comparison Table
  const metricsRowsHtml = QUANTITATIVE_METRICS.map(
    (m) => `
    <tr>
      <td class="col-session">
        <a href="#${m.sessionId}" class="table-session-link">
          <span class="badge badge-accent">세션 ${m.sessionIndex}</span>
        </a>
      </td>
      <td class="col-title">
        <a href="#${m.sessionId}" class="table-title-link">
          <strong>${escapeHtml(m.sessionTitle)}</strong>
        </a>
      </td>
      <td class="col-metric font-semibold">${escapeHtml(m.metricName)}</td>
      <td class="col-before text-muted"><del>${escapeHtml(m.before)}</del></td>
      <td class="col-after font-bold text-white">${escapeHtml(m.after)}</td>
      <td class="col-improve">
        <span class="metric-pill">${escapeHtml(m.improvement)}</span>
      </td>
      <td class="col-tech text-muted font-mono text-xs">${escapeHtml(m.keyTech)}</td>
    </tr>
  `
  ).join('');

  const metricsTableHtml = `
    <section class="metrics-overview-section" id="metrics-table">
      <div class="section-header-box">
        <div class="section-badge-row">
          <span class="badge badge-accent">📊 핵심 성과 총괄표</span>
          <span class="badge badge-secondary">9대 세션 전수 정량 지표</span>
          <span class="badge badge-emerald">✓ 실측치 검증 완료</span>
        </div>
        <h2 class="section-main-title">9대 세션 인프라 혁신 정량 지표 총괄 비교표</h2>
        <p class="section-sub-desc">
          당근 SRE 팀이 각 세션별로 발표한 인프라 도입 전(Before)과 도입 후(After)의 핵심 측정치 및 정량적 개선 효과를 한눈에 비교할 수 있는 총괄표입니다.
        </p>
      </div>

      <div class="table-scroll-wrapper">
        <table class="styled-metrics-table">
          <thead>
            <tr>
              <th>세션</th>
              <th>세션 주제</th>
              <th>측정 지표</th>
              <th>도입 전 (Before)</th>
              <th>도입 후 (After)</th>
              <th>정량적 개선 성과</th>
              <th>핵심 기술 스택</th>
            </tr>
          </thead>
          <tbody>
            ${metricsRowsHtml}
          </tbody>
        </table>
      </div>
    </section>
  `;

  // 1-3. Build FAQ / Knowledge Base Section
  const faqCardsHtml = FAQ_KNOWLEDGE_BASE.map(
    (faq) => `
    <div class="faq-item-card">
      <div class="faq-card-head">
        <span class="badge badge-accent">${escapeHtml(faq.category)}</span>
        <span class="badge badge-secondary">${escapeHtml(faq.relatedSession)}</span>
      </div>
      <h3 class="faq-card-q">Q. ${escapeHtml(faq.question)}</h3>
      <div class="faq-card-a">
        <p>${escapeHtml(faq.answer)}</p>
      </div>
    </div>
  `
  ).join('');

  const faqSectionHtml = `
    <section class="faq-knowledge-section" id="sre-faq">
      <div class="section-header-box">
        <div class="section-badge-row">
          <span class="badge badge-accent">💡 SRE 아키텍트 질의응답</span>
          <span class="badge badge-secondary">현장 질의 & 실전 노하우</span>
          <span class="badge badge-emerald">FAQ Knowledge Base</span>
        </div>
        <h2 class="section-main-title">당근 SRE 실전 도입 Q&A & 핵심 아키텍처 질의응답</h2>
        <p class="section-sub-desc">
          현업 엔지니어들이 가장 많이 질문하는 아키텍처 핵심 사항(대시보드 없는 옵저버빌리티, Karpenter Spot 전략, CI 캐시 99%, eBPF 커널 계측, Valkey 페일오버, OIDC 제로키)에 대한 실전 답변입니다.
        </p>
      </div>

      <div class="faq-cards-grid">
        ${faqCardsHtml}
      </div>
    </section>
  `;

  // 1-4. Category Filter Bar
  const allCategories = ['전체', ...Array.from(new Set(SESSIONS_DATA.map((s) => s.category)))];
  const categoryButtonsHtml = allCategories
    .map((cat, idx) => {
      const count =
        cat === '전체'
          ? SESSIONS_DATA.length
          : SESSIONS_DATA.filter((s) => s.category === cat).length;
      return `
      <button class="cat-pill-btn ${idx === 0 ? 'active' : ''}" onclick="filterCategory('${escapeHtml(cat)}')">
        ${escapeHtml(cat)} (${count})
      </button>
    `;
    })
    .join('');

  const categoryFilterBarHtml = `
    <div class="category-filter-wrapper">
      <div class="filter-headline-row">
        <span class="filter-main-label">🎯 9대 세션 심층 분석 전수 목록</span>
        <span class="filter-guide-label">카테고리를 클릭하면 해당 세션만 필터링됩니다:</span>
      </div>
      <div class="filter-buttons-row">
        ${categoryButtonsHtml}
      </div>
    </div>
  `;

  // 1-5. Full Markdown Report & Raw JSON Data
  let fullMarkdownText = `# 🥕 2026 당근 빌더 밋업 | SRE Day 플레이리스트 화면·음성 통합 심층 요약 리포트\n\n`;
  fullMarkdownText += `- 재생목록: ${PLAYLIST_INFO.youtubeUrl}\n`;
  fullMarkdownText += `- 주최: ${PLAYLIST_INFO.channel} | 일자: ${PLAYLIST_INFO.eventDate}\n`;
  fullMarkdownText += `- 분석 세션 수: 총 ${PLAYLIST_INFO.totalVideos}개 세션 전수 분석 완료\n\n`;
  fullMarkdownText += `---\n\n`;

  SESSIONS_DATA.forEach((s) => {
    fullMarkdownText += `## 세션 ${s.index}. ${s.title}\n`;
    fullMarkdownText += `- 발표자: ${s.speaker} | 카테고리: ${s.category} | 재생시간: ${s.duration} | 조회수: ${s.views}회\n`;
    fullMarkdownText += `- 영상 링크: https://www.youtube.com/watch?v=${s.videoId}\n\n`;
    fullMarkdownText += `### 📌 핵심 요약\n${s.summary}\n\n`;
    fullMarkdownText += `### 🖥️ 화면(Visual / Architecture) 분석\n${s.screenAnalysis.headline}\n${s.screenAnalysis.diagramDescription}\n\n`;
    if (s.screenAnalysis.codeSnippet) {
      fullMarkdownText += `\`\`\`${s.screenAnalysis.codeSnippet.language}\n${s.screenAnalysis.codeSnippet.code}\n\`\`\`\n\n`;
    }
    fullMarkdownText += `### 🎙️ 음성(Audio / Spoken) 분석\n${s.audioAnalysis.headline}\n${s.audioAnalysis.spokenContext}\n\n`;
    fullMarkdownText += `**트러블슈팅 스토리**:\n${s.audioAnalysis.troubleshootingStory}\n\n`;
    fullMarkdownText += `**발표자의 실전 조언**: "${s.audioAnalysis.speakerAdvice}"\n\n`;
    fullMarkdownText += `### 💡 핵심 기술 스택: ${s.techStack.join(', ')}\n\n`;
    fullMarkdownText += `### 🎯 실전 도입 체크리스트 (Key Takeaways)\n`;
    s.keyTakeaways.forEach((k, ki) => {
      fullMarkdownText += `${ki + 1}. ${k}\n`;
    });
    fullMarkdownText += `\n---\n\n`;
  });

  const rawJsonObject = {
    playlist: PLAYLIST_INFO,
    exportedAt: '2026-10-08T01:32:00Z',
    totalSessions: SESSIONS_DATA.length,
    sessions: SESSIONS_DATA,
    playbookTracks: ADOPTION_TRACKS,
    quantitativeMetrics: QUANTITATIVE_METRICS,
    faqKnowledgeBase: FAQ_KNOWLEDGE_BASE
  };
  const fullJsonString = JSON.stringify(rawJsonObject, null, 2);

  const fullReportSectionHtml = `
    <section class="full-report-section" id="full-report-data">
      <div class="section-header-box">
        <div class="section-badge-row">
          <span class="badge badge-accent">📑 전체 요약 & 원시 데이터</span>
          <span class="badge badge-secondary">Markdown & JSON</span>
          <span class="badge badge-emerald">✓ 오프라인 영구 보관용</span>
        </div>
        <h2 class="section-main-title">2026 당근 SRE Day 전체 보고서 전문 & 데이터</h2>
        <p class="section-sub-desc">
          노션, GitHub, 옵시디언, 사내 위키에 바로 붙여넣어 활용할 수 있는 마크다운 보고서 전문과 자동화 파이프라인 연동용 JSON 원시 데이터입니다.
        </p>
      </div>

      <div class="report-box-wrapper">
        <div class="report-action-header">
          <div class="report-tabs-btn-group">
            <button class="rep-tab-btn active" id="btn-rep-md" onclick="switchReportTab('md')">📝 마크다운 보고서 (Markdown)</button>
            <button class="rep-tab-btn" id="btn-rep-json" onclick="switchReportTab('json')">💾 JSON 원시 데이터 (Raw JSON)</button>
          </div>
          <button class="btn-copy-rep" onclick="copyActiveReport()">
            <span id="rep-copy-text">📋 활성 탭 전체 내용 복사</span>
          </button>
        </div>

        <div class="report-code-container">
          <pre id="pre-report-md"><code id="code-report-md">${escapeHtml(fullMarkdownText)}</code></pre>
          <pre id="pre-report-json" style="display:none;"><code id="code-report-json">${escapeHtml(fullJsonString)}</code></pre>
        </div>
      </div>
    </section>
  `;

  // 2. Build 9 Sessions
  const sessionsHtml = SESSIONS_DATA.map((s) => {
    const arch: SessionArchitecture | undefined = SESSION_ARCHITECTURES[s.id];
    const nodeSpecs: Record<string, NodeDetailSpec> = NODE_DETAIL_SPECS[s.id] || {};
    const nodes = arch?.nodes || [];
    const edges = arch?.edges || [];

    // Interactive Flow Topology HTML
    const flowNodesHtml = nodes
      .map((node, idx) => {
        const isFirst = idx === 0;
        const nextEdge = edges.find((e) => e.from === node.id);
        const hasNext = idx < nodes.length - 1;

        return `
          <div class="flow-step-wrapper">
            <div 
              class="flow-node-capsule ${node.type} ${isFirst ? 'active' : ''}" 
              id="btn-${s.id}-${node.id}"
              onclick="selectNode('${s.id}', '${node.id}')"
            >
              <div class="capsule-top">
                <span class="capsule-badge">${node.type}</span>
                <span class="capsule-status ${node.status}">${node.status}</span>
              </div>
              <div class="capsule-name">${escapeHtml(node.label)}</div>
              <div class="capsule-sub">${escapeHtml(node.sublabel)}</div>
              ${node.spec ? `<div class="capsule-spec">⚙️ ${escapeHtml(node.spec)}</div>` : ''}
              <div class="capsule-hint">노드 스펙 보기 👇</div>
            </div>

            ${
              hasNext
                ? `
              <div class="flow-connector">
                <div class="flow-line">
                  <div class="flow-arrow"></div>
                </div>
                ${
                  nextEdge?.protocol
                    ? `<span class="flow-proto-tag">${escapeHtml(nextEdge.protocol)}</span>`
                    : ''
                }
              </div>
            `
                : ''
            }
          </div>
        `;
      })
      .join('');

    // Pre-rendered Inspector Panels for each node (switched via JS onclick)
    const nodeInspectorsHtml = nodes
      .map((node, idx) => {
        const spec = nodeSpecs[node.id];
        const isFirst = idx === 0;
        const inboundEdges = edges.filter((e) => e.to === node.id);
        const outboundEdges = edges.filter((e) => e.from === node.id);

        return `
          <div 
            class="node-inspector-panel ${isFirst ? 'active' : ''}" 
            id="inspector-${s.id}-${node.id}"
          >
            <div class="inspector-header">
              <div class="inspector-title-group">
                <span class="inspector-type-pill">${node.type}</span>
                <span class="inspector-status-pill ${node.status}">${node.status}</span>
                <h4 class="inspector-title">${escapeHtml(node.label)} <small>(${escapeHtml(node.sublabel)})</small></h4>
              </div>
              <div class="inspector-id">Node ID: <code>${node.id}</code></div>
            </div>

            <div class="inspector-grid">
              <!-- Col 1: Role -->
              <div class="inspector-box">
                <div class="inspector-box-title">🔍 아키텍처 역할 & 처리 로직</div>
                <p class="inspector-box-desc">${escapeHtml(spec?.architectureRole || node.description)}</p>
              </div>

              <!-- Col 2: HW & Spec -->
              <div class="inspector-box">
                <div class="inspector-box-title">⚙️ 인프라 사양 & 네트워크 프로토콜</div>
                <div class="inspector-item">
                  <span class="lbl">인프라 규격:</span>
                  <strong>${escapeHtml(spec?.hardwareSpec || node.spec || '표준 Pod / K8s 규격')}</strong>
                </div>
                <div class="inspector-item">
                  <span class="lbl">포트 / 프로토콜:</span>
                  <code class="proto-code">${escapeHtml(spec?.portsProtocols || 'gRPC / HTTPS')}</code>
                </div>
              </div>

              <!-- Col 3: Traffic Route -->
              <div class="inspector-box">
                <div class="inspector-box-title">🔀 트래픽 경로 (입출력)</div>
                <div class="inspector-item">
                  <span class="lbl">인바운드 (수신):</span>
                  ${
                    inboundEdges.length > 0
                      ? inboundEdges
                          .map(
                            (e) => `<div><code>${e.from}</code> → <span>(${escapeHtml(e.label)})</span></div>`
                          )
                          .join('')
                      : '<div class="text-muted">최초 유입 지점 (Root)</div>'
                  }
                </div>
                <div class="inspector-item pt-1">
                  <span class="lbl">아웃바운드 (발신):</span>
                  ${
                    outboundEdges.length > 0
                      ? outboundEdges
                          .map(
                            (e) => `<div><code>${e.to}</code> → <span>(${escapeHtml(e.label)})</span></div>`
                          )
                          .join('')
                      : '<div class="text-muted">최종 영속/완료 지점 (Terminal)</div>'
                  }
                </div>
              </div>
            </div>

            <!-- SRE Tip Banner -->
            ${
              spec?.sreProductionTip
                ? `
              <div class="sre-tip-box">
                <div class="sre-tip-title">💡 당근 SRE 현장 트러블슈팅 경험담 & 장애 방지 가드레일:</div>
                <p class="sre-tip-text">${escapeHtml(spec.sreProductionTip)}</p>
              </div>
            `
                : ''
            }

            <!-- Production Config Snippet -->
            ${
              spec?.productionConfigCode
                ? `
              <div class="code-box">
                <div class="code-header">
                  <span>💻 실전 프로덕션 설정 코드: ${escapeHtml(spec.productionConfigTitle)}</span>
                  <button class="btn-copy" onclick="copyCode(this)">코드 복사</button>
                </div>
                <pre><code>${escapeHtml(spec.productionConfigCode)}</code></pre>
              </div>
            `
                : ''
            }
          </div>
        `;
      })
      .join('');

    // Pre-rendered Full Node Cards (Fully expanded, all specifications un-truncated)
    const allNodeCardsHtml = nodes
      .map((node) => {
        const spec = nodeSpecs[node.id];
        const inboundEdges = edges.filter((e) => e.to === node.id);
        const outboundEdges = edges.filter((e) => e.from === node.id);

        return `
          <div class="node-card-full">
            <div class="inspector-header">
              <div class="inspector-title-group">
                <span class="inspector-type-pill">${node.type}</span>
                <span class="inspector-status-pill ${node.status}">${node.status}</span>
                <h4 class="inspector-title">${escapeHtml(node.label)} <small>(${escapeHtml(node.sublabel)})</small></h4>
              </div>
              <div class="inspector-id">Node ID: <code>${node.id}</code></div>
            </div>

            <div class="inspector-grid">
              <!-- Col 1: Role -->
              <div class="inspector-box">
                <div class="inspector-box-title">🔍 아키텍처 역할 & 처리 로직</div>
                <p class="inspector-box-desc">${escapeHtml(spec?.architectureRole || node.description)}</p>
              </div>

              <!-- Col 2: HW & Spec -->
              <div class="inspector-box">
                <div class="inspector-box-title">⚙️ 인프라 사양 & 네트워크 프로토콜</div>
                <div class="inspector-item">
                  <span class="lbl">인프라 규격:</span>
                  <strong>${escapeHtml(spec?.hardwareSpec || node.spec || '표준 Pod / K8s 규격')}</strong>
                </div>
                <div class="inspector-item">
                  <span class="lbl">포트 / 프로토콜:</span>
                  <code class="proto-code">${escapeHtml(spec?.portsProtocols || 'gRPC / HTTPS')}</code>
                </div>
              </div>

              <!-- Col 3: Traffic Route -->
              <div class="inspector-box">
                <div class="inspector-box-title">🔀 트래픽 경로 (입출력)</div>
                <div class="inspector-item">
                  <span class="lbl">인바운드 (수신):</span>
                  ${
                    inboundEdges.length > 0
                      ? inboundEdges
                          .map(
                            (e) => `<div><code>${e.from}</code> → <span>(${escapeHtml(e.label)})</span></div>`
                          )
                          .join('')
                      : '<div class="text-muted">최초 유입 지점 (Root)</div>'
                  }
                </div>
                <div class="inspector-item pt-1">
                  <span class="lbl">아웃바운드 (발신):</span>
                  ${
                    outboundEdges.length > 0
                      ? outboundEdges
                          .map(
                            (e) => `<div><code>${e.to}</code> → <span>(${escapeHtml(e.label)})</span></div>`
                          )
                          .join('')
                      : '<div class="text-muted">최종 영속/완료 지점 (Terminal)</div>'
                  }
                </div>
              </div>
            </div>

            ${
              spec?.sreProductionTip
                ? `
              <div class="sre-tip-box">
                <div class="sre-tip-title">💡 당근 SRE 현장 트러블슈팅 경험담 & 장애 방지 가드레일:</div>
                <p class="sre-tip-text">${escapeHtml(spec.sreProductionTip)}</p>
              </div>
            `
                : ''
            }

            ${
              spec?.productionConfigCode
                ? `
              <div class="code-box">
                <div class="code-header">
                  <span>💻 실전 프로덕션 설정 코드: ${escapeHtml(spec.productionConfigTitle)}</span>
                  <button class="btn-copy" onclick="copyCode(this)">코드 복사</button>
                </div>
                <pre><code>${escapeHtml(spec.productionConfigCode)}</code></pre>
              </div>
            `
                : ''
            }
          </div>
        `;
      })
      .join('');

    // Before vs After Comparison
    const comparisonHtml = arch
      ? `
      <div class="comp-grid">
        <div class="comp-card before">
          <div class="comp-card-head">
            <span class="comp-badge before">기존 한계</span>
            <h4>${escapeHtml(arch.beforeArchitecture.title)}</h4>
          </div>
          <p class="comp-desc">${escapeHtml(arch.beforeArchitecture.description)}</p>
          <div class="comp-list-title">발생했던 병목 현상 & 리스크:</div>
          <ul class="comp-list">
            ${arch.beforeArchitecture.bottlenecks.map((b) => `<li>✕ ${escapeHtml(b)}</li>`).join('')}
          </ul>
        </div>

        <div class="comp-card after">
          <div class="comp-card-head">
            <span class="comp-badge after">당근 도입 효과</span>
            <h4>${escapeHtml(arch.afterArchitecture.title)}</h4>
          </div>
          <p class="comp-desc">${escapeHtml(arch.afterArchitecture.description)}</p>
          <div class="comp-list-title">달성한 정량적 성과 & 개선:</div>
          <ul class="comp-list">
            ${arch.afterArchitecture.improvements.map((imp) => `<li>✓ ${escapeHtml(imp)}</li>`).join('')}
          </ul>
        </div>
      </div>
    `
      : '';

    // 5-Step Pipeline
    const pipelineHtml = arch?.pipelineSteps
      ? `
      <div class="pipeline-card">
        <h4 class="pipeline-heading">⚡ 5단계 엔지니어링 실행 파이프라인 (완전 분해)</h4>
        <div class="pipeline-items">
          ${arch.pipelineSteps
            .map(
              (step) => `
            <div class="pipeline-row">
              <div class="step-badge">${step.step}</div>
              <div class="step-info">
                <div class="step-head-line">
                  <span class="step-tag">[Phase ${step.step}: ${escapeHtml(step.phase)}]</span>
                  <strong>${escapeHtml(step.action)}</strong>
                  ${step.durationOrMetric ? `<span class="step-metric-badge">⏱️ ${escapeHtml(step.durationOrMetric)}</span>` : ''}
                </div>
                <div class="step-details">${escapeHtml(step.detail)}</div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
      : '';

    // Screen Slide & Code Box
    const screenCodeHtml = s.screenAnalysis.codeSnippet
      ? `
      <div class="code-box">
        <div class="code-header">
          <span>💻 슬라이드 핵심 코드: ${escapeHtml(s.screenAnalysis.codeSnippet.title)} (${escapeHtml(s.screenAnalysis.codeSnippet.language)})</span>
          <button class="btn-copy" onclick="copyCode(this)">코드 복사</button>
        </div>
        <pre><code>${escapeHtml(s.screenAnalysis.codeSnippet.code)}</code></pre>
      </div>
    `
      : '';

    // Transcript Rows
    const transcriptRows = s.fullTranscript
      .map(
        (t) => `
        <div class="transcript-row">
          <span class="transcript-time">${t.time}</span>
          <div class="transcript-content">
            <strong class="transcript-speaker">${escapeHtml(t.speaker)}</strong>
            <p class="transcript-text">${escapeHtml(t.text)}</p>
          </div>
        </div>
      `
      )
      .join('');

    return `
      <section class="session-card" id="${s.id}" data-category="${escapeHtml(s.category)}">
        <div class="session-header-row">
          <span class="badge badge-accent">세션 ${s.index}</span>
          <span class="badge badge-secondary">${s.category}</span>
          <span class="session-duration">⏱️ ${s.duration}</span>
        </div>

        <h2 class="session-title">${escapeHtml(s.title)}</h2>
        <div class="session-meta">
          발표자: <strong>${escapeHtml(s.speaker)}</strong> | 행사: 2026 당근 SRE Day | 조회수: ${s.views}회
        </div>

        <div class="summary-box">
          <strong>📌 세션 핵심 요약:</strong>
          <p>${escapeHtml(s.summary)}</p>
        </div>

        <!-- Video Player Section (Web App Fidelity & Error Fallback) -->
        <div class="video-header-bar">
          <div class="video-status-badge">
            <span class="status-dot"></span>
            <span>YouTube 공식 세션 영상 (${s.duration})</span>
          </div>
          <a id="yt-direct-${s.id}" href="https://www.youtube.com/watch?v=${s.videoId}" target="_blank" rel="noopener noreferrer" class="youtube-main-btn">
            <svg viewBox="0 0 24 24" class="yt-icon" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            <span>YouTube에서 원본 고화질 시청하기 (새 창 열림) ↗</span>
          </a>
        </div>

        <div class="file-protocol-warning">
          💡 <strong>[동영상 재생 안내]</strong> 다운로드한 로컬 HTML 파일(<code>file://</code>) 환경에서는 브라우저 보안 정책으로 인해 유튜브 임베드 시 <em>'동영상 플레이어 구성 오류'</em>가 표시될 수 있습니다. 상단의 <strong>[YouTube에서 원본 고화질 시청하기]</strong> 버튼 또는 아래 타임스탬프를 클릭하시면 유튜브 사이트에서 해당 구간부터 오류 없이 100% 정상 재생됩니다.
        </div>

        <div class="video-container">
          <div class="video-responsive">
            <iframe 
              id="player-${s.id}" 
              src="https://www.youtube.com/embed/${s.videoId}?enablejsapi=1&rel=0" 
              title="${escapeHtml(s.title)}" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen>
            </iframe>
          </div>
          <div class="video-error-fallback" onclick="window.open('https://www.youtube.com/watch?v=${s.videoId}', '_blank')">
            <span>🔴 영상이 재생되지 않거나 '동영상 플레이어 구성 오류'가 뜨나요? 여기를 클릭하면 YouTube에서 바로 시청하실 수 있습니다 ↗</span>
          </div>
        </div>

        <!-- Quick Timestamp Jump Bar -->
        <div class="timestamp-bar">
          <div class="timestamp-label">
            <span>⏱️ 타임스탬프 바로가기 (클릭 시 해당 구간 이동 & 새 창 열기 지원)</span>
            <a href="https://www.youtube.com/watch?v=${s.videoId}" target="_blank" rel="noopener noreferrer" class="youtube-direct-link">YouTube 원본 보기 ↗</a>
          </div>
          <div class="timestamp-chips">
            ${s.timestamps
              .map(
                (t) => `
              <button 
                type="button" 
                class="ts-chip" 
                onclick="seekVideo('${s.id}', '${s.videoId}', ${t.seconds})"
                title="${escapeHtml(t.label)}"
              >
                <span class="ts-time">[${t.time}]</span>
                <span class="ts-text">${escapeHtml(t.label)}</span>
              </button>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- Tech Stack Tags -->
        <div class="tech-stack-row">
          <span class="tech-label">🛠️ 핵심 기술 스택:</span>
          ${s.techStack.map((tech) => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('')}
        </div>

        <!-- Session Tabs -->
        <div class="tab-nav">
          <button class="tab-btn active" onclick="switchSessionTab('${s.id}', 'topology')">🗺️ 시스템 아키텍처 토폴로지</button>
          <button class="tab-btn" onclick="switchSessionTab('${s.id}', 'compare')">⚖️ 기존 한계 vs 당근 개선</button>
          <button class="tab-btn" onclick="switchSessionTab('${s.id}', 'pipeline')">⚡ 5단계 파이프라인</button>
          <button class="tab-btn" onclick="switchSessionTab('${s.id}', 'screen')">🖥️ 슬라이드 & 코드</button>
          <button class="tab-btn" onclick="switchSessionTab('${s.id}', 'audio')">🎙️ 발표자 음성 & 트러블슈팅</button>
          <button class="tab-btn" onclick="switchSessionTab('${s.id}', 'transcript')">📜 전체 녹취록 (${s.fullTranscript.length}구간)</button>
        </div>

        <!-- TAB 1: Topology & Interactive Node Inspector -->
        <div class="tab-content active" id="${s.id}-tab-topology">
          <div class="headline-box">
            <h3>${escapeHtml(arch?.headline || s.screenAnalysis.headline)}</h3>
            <p>${escapeHtml(arch?.architectureSummary || s.screenAnalysis.diagramDescription)}</p>
          </div>

          <div class="topology-wrapper">
            <div class="topology-instruction-bar">
              <span class="instruction-tag">👆 아래 노드를 클릭하면 세부 엔지니어링 스펙 & 프로덕션 설정이 표시됩니다:</span>
              <span class="node-count-tag">${nodes.length}개 노드 • ${edges.length}개 네트워크 링크</span>
            </div>

            <!-- Responsive Flow Diagram Pipeline -->
            <div class="flow-diagram-container">
              <div class="flow-diagram-track">
                ${flowNodesHtml}
              </div>
            </div>

            <!-- Dynamic Node Detail Inspector -->
            <div class="inspectors-wrapper">
              ${nodeInspectorsHtml}
            </div>
          </div>

          <!-- Full Un-truncated Node Cards Breakdown -->
          <div class="all-nodes-section">
            <h4 class="all-nodes-heading">📑 [도식화 상세] 세션 ${s.index} 전체 ${nodes.length}대 아키텍처 노드 및 엔지니어링 스펙 전수 목록</h4>
            <p class="all-nodes-sub">모든 노드의 아키텍처 역할, 하드웨어 규격, 네트워크 프로토콜, SRE 실전 팁, 실전 설정 코드가 줄임표(...) 없이 100% 완전하게 공개되어 있습니다.</p>
            <div class="all-nodes-list">
              ${allNodeCardsHtml}
            </div>
          </div>

          ${
            arch?.mermaidCode
              ? `
            <div class="code-box" style="margin-top: 20px;">
              <div class="code-header">
                <span>📊 Mermaid 아키텍처 다이어그램 코드 (Notion / GitHub / Obsidian 호환)</span>
                <button class="btn-copy" onclick="copyCode(this)">코드 복사</button>
              </div>
              <pre><code>${escapeHtml(arch.mermaidCode)}</code></pre>
            </div>
          `
              : ''
          }
        </div>

        <!-- TAB 2: Comparison -->
        <div class="tab-content" id="${s.id}-tab-compare">
          ${comparisonHtml}
        </div>

        <!-- TAB 3: Pipeline -->
        <div class="tab-content" id="${s.id}-tab-pipeline">
          ${pipelineHtml}
        </div>

        <!-- TAB 4: Screen Slide -->
        <div class="tab-content" id="${s.id}-tab-screen">
          <div class="detail-card screen-style">
            <h4>🖥️ 슬라이드 화면 & 아키텍처 다이어그램 심층 분석</h4>
            <div class="card-headline">${escapeHtml(s.screenAnalysis.headline)}</div>
            <p class="card-body">${escapeHtml(s.screenAnalysis.diagramDescription)}</p>
            ${screenCodeHtml}
            <div class="highlights-box">
              <strong>핵심 시각 지표 & 슬라이드 하이라이트:</strong>
              <ul>
                ${s.screenAnalysis.visualHighlights.map((vh) => `<li>${escapeHtml(vh)}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <!-- TAB 5: Audio & Troubleshooting -->
        <div class="tab-content" id="${s.id}-tab-audio">
          <div class="detail-card audio-style">
            <h4>🎙️ 발표자 음성 인사이트 & 현장 트러블슈팅 스토리</h4>
            <div class="card-headline">${escapeHtml(s.audioAnalysis.headline)}</div>
            <p class="card-body">${escapeHtml(s.audioAnalysis.spokenContext)}</p>

            <div class="troubleshoot-story-box">
              <strong>🛠️ 현장 트러블슈팅 & 실패 극복기 (전문):</strong>
              <p>${escapeHtml(s.audioAnalysis.troubleshootingStory)}</p>
            </div>

            <div class="advice-card">
              <strong>💡 발표자의 실전 조언:</strong>
              <p>"${escapeHtml(s.audioAnalysis.speakerAdvice)}"</p>
            </div>

            <div class="takeaways-card">
              <h5>🎯 정량적 성과 & 실전 도입 체크리스트:</h5>
              <div class="pills-row">
                ${s.audioAnalysis.quantitativeResults
                  .map((res) => `<span class="res-pill">✓ ${escapeHtml(res)}</span>`)
                  .join('')}
              </div>
              <ol class="takeaways-ol">
                ${s.keyTakeaways.map((k) => `<li>${escapeHtml(k)}</li>`).join('')}
              </ol>
            </div>
          </div>
        </div>

        <!-- TAB 6: Transcript -->
        <div class="tab-content" id="${s.id}-tab-transcript">
          <div class="transcript-box">
            <div class="transcript-bar">
              <span>📜 전체 음성 녹취 스크립트 전문 (${s.fullTranscript.length}구간 100% 무삭제)</span>
              <button class="btn-copy" onclick="copyTranscript('${s.id}')">녹취록 전체 복사</button>
            </div>
            <div class="transcript-scroll" id="${s.id}-transcript-body">
              ${transcriptRows}
            </div>
          </div>
        </div>
      </section>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>2026 당근 SRE Day 실전 인프라 플레이북 & 아키텍처 전문 리포트</title>
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #0f172a;
      --card-alt: #1e293b;
      --border: #334155;
      --border-light: #475569;
      --primary: #f97316;
      --primary-light: #fed7aa;
      --primary-dark: #ea580c;
      --text: #ffffff;
      --text-body: #e2e8f0;
      --text-muted: #94a3b8;
      --success: #10b981;
      --danger: #ef4444;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text-body);
      font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Segoe UI", Roboto, "Noto Sans KR", sans-serif;
      font-size: 16px;
      line-height: 1.75;
      -webkit-font-smoothing: antialiased;
      word-break: keep-all;
      overflow-wrap: break-word;
    }

    /* Top Sticky Navigation */
    .top-navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(15, 23, 42, 0.96);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
      padding: 14px 28px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
    }
    .brand-group {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 900;
      font-size: 18px;
      color: #fff;
    }
    .brand-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #f97316, #ea580c);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    .top-nav-links {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      max-width: 100%;
      padding-bottom: 4px;
    }
    .nav-chip {
      background: #1e293b;
      color: #e2e8f0;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      padding: 7px 14px;
      border-radius: 10px;
      border: 1px solid var(--border);
      white-space: nowrap;
      transition: all 0.2s;
    }
    .nav-chip:hover {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }
    .nav-chip.accent {
      background: rgba(249, 115, 22, 0.2);
      border-color: rgba(249, 115, 22, 0.5);
      color: var(--primary-light);
    }
    .search-box {
      background: #030712;
      border: 1px solid var(--border);
      color: #fff;
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 14px;
      width: 240px;
    }
    .search-box:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.3);
    }

    .container {
      max-width: 1160px;
      margin: 0 auto;
      padding: 36px 24px 90px;
    }

    /* Hero Header */
    .hero-header {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 60%, #090d16 100%);
      border: 1px solid var(--border);
      border-radius: 28px;
      padding: 44px 36px;
      margin-bottom: 40px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6);
      position: relative;
      overflow: hidden;
    }
    .hero-title {
      font-size: 30px;
      font-weight: 900;
      color: #fff;
      margin-bottom: 14px;
      line-height: 1.35;
    }
    .hero-desc {
      color: #cbd5e1;
      font-size: 16px;
      margin-bottom: 24px;
      max-width: 980px;
      line-height: 1.75;
    }
    .hero-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      font-size: 13px;
    }
    .badge {
      padding: 6px 14px;
      border-radius: 10px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      font-size: 13px;
    }
    .badge-accent {
      background: rgba(249, 115, 22, 0.2);
      color: var(--primary-light);
      border: 1px solid rgba(249, 115, 22, 0.45);
    }
    .badge-secondary {
      background: #1e293b;
      color: #e2e8f0;
      border: 1px solid var(--border);
    }
    .badge-emerald {
      background: rgba(16, 185, 129, 0.15);
      color: #6ee7b7;
      border: 1px solid rgba(16, 185, 129, 0.35);
    }

    /* Master 5-Layer Topology Section */
    .master-architecture-section {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 28px;
      padding: 36px;
      margin-bottom: 52px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .master-header {
      margin-bottom: 28px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 22px;
    }
    .master-badge-row {
      display: flex;
      gap: 10px;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }
    .master-title {
      font-size: 24px;
      font-weight: 900;
      color: #fff;
      margin-bottom: 10px;
    }
    .master-subtitle {
      font-size: 15px;
      color: var(--text-muted);
      line-height: 1.7;
    }
    .layers-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .layer-card {
      background: #090d16;
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 24px;
      transition: border-color 0.2s;
    }
    .layer-card:hover {
      border-color: var(--primary);
    }
    .layer-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .layer-tag {
      font-size: 16px;
      font-weight: 800;
      color: #fff;
    }
    .layer-metric {
      font-size: 13px;
      font-family: monospace;
      font-weight: bold;
      color: var(--primary-light);
      background: rgba(249, 115, 22, 0.15);
      padding: 4px 10px;
      border-radius: 8px;
      border: 1px solid rgba(249, 115, 22, 0.35);
    }
    .layer-nodes-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
    }
    @media (min-width: 640px) {
      .layer-nodes-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .layer-nodes-grid.full-width {
        grid-template-columns: 1fr;
      }
    }
    .topo-node-box {
      background: #0f172a;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: all 0.2s;
    }
    .topo-node-box:hover {
      border-color: var(--primary);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    }
    .topo-node-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      font-weight: 800;
      color: #fff;
    }
    .topo-icon { font-size: 18px; }
    .topo-pill {
      align-self: flex-start;
      font-size: 12px;
      font-weight: 800;
      font-family: monospace;
      padding: 3px 8px;
      border-radius: 6px;
      background: rgba(249, 115, 22, 0.15);
      color: var(--primary-light);
      border: 1px solid rgba(249, 115, 22, 0.35);
    }
    .pill-amber, .pill-purple, .pill-emerald, .pill-cyan, .pill-teal, .pill-blue, .pill-rose {
      background: #1e293b;
      color: #f1f5f9;
      border: 1px solid #334155;
    }
    .topo-desc {
      font-size: 14px;
      color: #cbd5e1;
      line-height: 1.65;
    }
    .topo-link {
      font-size: 13px;
      font-weight: 700;
      color: var(--primary);
      margin-top: auto;
    }

    /* Session Card */
    .session-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 28px;
      padding: 36px;
      margin-bottom: 52px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      scroll-margin-top: 90px;
    }
    .session-header-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }
    .session-duration {
      margin-left: auto;
      font-size: 13px;
      font-family: monospace;
      color: #e2e8f0;
      font-weight: bold;
    }
    .session-title {
      font-size: 24px;
      font-weight: 900;
      color: #fff;
      margin-bottom: 8px;
      line-height: 1.4;
    }
    .session-meta {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 20px;
    }
    .summary-box {
      background: #1e293b;
      border-left: 4px solid var(--primary);
      padding: 18px 22px;
      border-radius: 14px;
      font-size: 15px;
      line-height: 1.8;
      color: #f1f5f9;
      margin-bottom: 26px;
    }
    .summary-box strong {
      color: var(--primary-light);
      display: block;
      margin-bottom: 6px;
      font-size: 15px;
    }

    /* Tab Buttons inside Session */
    .tab-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 14px;
      margin-bottom: 28px;
    }
    .tab-btn {
      background: #1e293b;
      border: 1px solid var(--border);
      color: #cbd5e1;
      padding: 10px 18px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tab-btn:hover {
      background: #334155;
      color: #fff;
    }
    .tab-btn.active {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
      box-shadow: 0 4px 14px rgba(249, 115, 22, 0.4);
    }
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
      animation: fadeIn 0.2s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .headline-box {
      background: #090d16;
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 22px 26px;
      margin-bottom: 26px;
    }
    .headline-box h3 {
      font-size: 18px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 8px;
    }
    .headline-box p {
      font-size: 15px;
      color: #cbd5e1;
      line-height: 1.7;
    }

    /* Topology Flow Pipeline Container */
    .topology-wrapper {
      background: #090d16;
      border: 1px solid var(--border);
      border-radius: 22px;
      padding: 24px;
      margin-bottom: 28px;
    }
    .topology-instruction-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      font-size: 13px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .instruction-tag {
      color: var(--primary-light);
      font-weight: bold;
    }
    .node-count-tag {
      font-family: monospace;
      color: var(--text-muted);
      background: #0f172a;
      padding: 3px 10px;
      border-radius: 8px;
      border: 1px solid var(--border);
    }

    .flow-diagram-container {
      background: #0f172a;
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 20px;
      overflow-x: auto;
      margin-bottom: 24px;
    }
    .flow-diagram-track {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 700px;
      padding: 10px 6px;
    }
    .flow-step-wrapper {
      display: flex;
      align-items: center;
      gap: 14px;
      flex: 1;
    }
    .flow-node-capsule {
      flex: 1;
      min-width: 170px;
      background: #090d16;
      border: 2px solid #334155;
      border-radius: 16px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }
    .flow-node-capsule:hover {
      border-color: var(--primary-light);
      transform: translateY(-2px);
    }
    .flow-node-capsule.active {
      border-color: var(--primary);
      background: #1e293b;
      box-shadow: 0 0 20px rgba(249, 115, 22, 0.4);
    }
    .capsule-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .capsule-badge {
      font-size: 11px;
      font-family: monospace;
      font-weight: 800;
      text-transform: uppercase;
      background: #0f172a;
      color: #cbd5e1;
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid #334155;
    }
    .capsule-status {
      font-size: 11px;
      font-family: monospace;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: bold;
      background: #0f172a;
      color: #94a3b8;
      border: 1px solid #334155;
    }
    .capsule-status.optimized {
      background: rgba(249, 115, 22, 0.15);
      color: var(--primary-light);
      border-color: rgba(249, 115, 22, 0.4);
    }
    .capsule-status.active {
      background: #1e293b;
      color: #f1f5f9;
      border-color: #475569;
    }
    .capsule-status.monitored {
      background: #1e293b;
      color: #e2e8f0;
      border-color: #475569;
    }
    .capsule-name {
      font-size: 15px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 4px;
      white-space: normal;
      word-break: keep-all;
      line-height: 1.4;
    }
    .capsule-sub {
      font-size: 12px;
      color: var(--text-muted);
      font-family: monospace;
      margin-bottom: 6px;
    }
    .capsule-spec {
      font-size: 12px;
      font-family: monospace;
      color: #e2e8f0;
      background: #1e293b;
      padding: 4px 8px;
      border-radius: 6px;
      margin-bottom: 6px;
      border: 1px solid #334155;
    }
    .capsule-hint {
      font-size: 11px;
      font-weight: bold;
      color: var(--primary);
      text-align: right;
    }

    .flow-connector {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      shrink: 0;
    }
    .flow-line {
      width: 36px;
      height: 2px;
      background: linear-gradient(90deg, #475569, #f97316);
      position: relative;
    }
    .flow-arrow {
      position: absolute;
      right: 0;
      top: -4px;
      width: 9px;
      height: 9px;
      border-top: 2px solid #f97316;
      border-right: 2px solid #f97316;
      transform: rotate(45deg);
    }
    .flow-proto-tag {
      font-size: 11px;
      font-family: monospace;
      background: #0f172a;
      color: #cbd5e1;
      border: 1px solid #334155;
      padding: 2px 7px;
      border-radius: 6px;
      white-space: nowrap;
    }

    /* Node Inspector Panel */
    .node-inspector-panel {
      display: none;
      background: #0f172a;
      border: 2px solid var(--primary);
      border-radius: 18px;
      padding: 24px;
      animation: fadeIn 0.2s ease-in-out;
    }
    .node-inspector-panel.active {
      display: block;
    }
    .inspector-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
      padding-bottom: 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .inspector-title-group {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .inspector-type-pill {
      font-size: 12px;
      font-family: monospace;
      font-weight: 800;
      text-transform: uppercase;
      background: rgba(249, 115, 22, 0.2);
      color: var(--primary-light);
      padding: 4px 10px;
      border-radius: 8px;
      border: 1px solid rgba(249, 115, 22, 0.4);
    }
    .inspector-status-pill {
      font-size: 12px;
      font-family: monospace;
      padding: 4px 10px;
      border-radius: 8px;
      font-weight: bold;
      background: #1e293b;
      color: #cbd5e1;
      border: 1px solid #334155;
    }
    .inspector-status-pill.optimized {
      background: rgba(249, 115, 22, 0.15);
      color: var(--primary-light);
      border-color: rgba(249, 115, 22, 0.4);
    }
    .inspector-title {
      font-size: 18px;
      font-weight: 800;
      color: #fff;
    }
    .inspector-title small {
      font-size: 14px;
      color: var(--text-muted);
      font-weight: normal;
    }
    .inspector-id code {
      font-size: 13px;
      color: #e2e8f0;
      background: #090d16;
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid var(--border);
    }

    .inspector-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    @media (min-width: 768px) {
      .inspector-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    .inspector-box {
      background: #090d16;
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 18px;
    }
    .inspector-box-title {
      font-size: 14px;
      font-weight: 800;
      color: var(--primary-light);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .inspector-box-desc {
      font-size: 14px;
      color: #cbd5e1;
      line-height: 1.65;
    }
    .inspector-item {
      font-size: 14px;
      margin-bottom: 8px;
      line-height: 1.5;
    }
    .inspector-item .lbl {
      color: var(--text-muted);
      display: block;
      font-size: 12px;
      font-family: monospace;
      margin-bottom: 2px;
    }
    .proto-code {
      color: #e2e8f0;
      font-family: monospace;
      font-size: 13px;
      background: #0f172a;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .sre-tip-box {
      background: rgba(249, 115, 22, 0.1);
      border: 1px solid rgba(249, 115, 22, 0.35);
      border-radius: 14px;
      padding: 18px 20px;
      margin-bottom: 18px;
    }
    .sre-tip-title {
      font-size: 14px;
      font-weight: 800;
      color: var(--primary-light);
      margin-bottom: 6px;
    }
    .sre-tip-text {
      font-size: 14px;
      color: #f1f5f9;
      line-height: 1.7;
    }

    /* Comparison (Before / After) */
    .comp-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }
    @media (min-width: 640px) {
      .comp-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .comp-card {
      border-radius: 20px;
      padding: 26px;
      border: 1px solid var(--border);
    }
    .comp-card.before {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.35);
    }
    .comp-card.after {
      background: rgba(16, 185, 129, 0.1);
      border-color: rgba(16, 185, 129, 0.35);
    }
    .comp-card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .comp-badge {
      font-size: 12px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 8px;
      font-family: monospace;
    }
    .comp-badge.before { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }
    .comp-badge.after { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; }
    .comp-card h4 {
      font-size: 17px;
      font-weight: 800;
      color: #fff;
    }
    .comp-desc {
      font-size: 14px;
      color: #cbd5e1;
      margin-bottom: 16px;
      line-height: 1.65;
    }
    .comp-list-title {
      font-size: 12px;
      font-weight: 800;
      color: #94a3b8;
      text-transform: uppercase;
      margin-bottom: 10px;
      font-family: monospace;
    }
    .comp-list {
      list-style: none;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .comp-card.before .comp-list li {
      background: rgba(239, 68, 68, 0.12);
      padding: 10px 14px;
      border-radius: 10px;
      color: #fecdd3;
    }
    .comp-card.after .comp-list li {
      background: rgba(16, 185, 129, 0.12);
      padding: 10px 14px;
      border-radius: 10px;
      color: #a7f3d0;
    }

    /* Pipeline */
    .pipeline-card {
      background: #090d16;
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 26px;
    }
    .pipeline-heading {
      font-size: 17px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 18px;
    }
    .pipeline-items {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .pipeline-row {
      display: flex;
      gap: 16px;
      background: #0f172a;
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 16px 20px;
      align-items: flex-start;
    }
    .step-badge {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: rgba(249, 115, 22, 0.2);
      color: var(--primary);
      font-weight: 900;
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      shrink: 0;
    }
    .step-info { flex: 1; }
    .step-head-line {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      color: #fff;
      margin-bottom: 6px;
      flex-wrap: wrap;
    }
    .step-tag {
      font-family: monospace;
      font-size: 13px;
      color: var(--primary);
      font-weight: bold;
    }
    .step-metric-badge {
      margin-left: auto;
      font-size: 12px;
      font-family: monospace;
      color: #6ee7b7;
      background: rgba(16, 185, 129, 0.15);
      padding: 3px 10px;
      border-radius: 8px;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .step-details {
      font-size: 14px;
      color: #cbd5e1;
      line-height: 1.6;
    }

    /* Code Snippet Box */
    .code-box {
      background: #090d16;
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      margin-top: 16px;
    }
    .code-header {
      background: #0f172a;
      border-bottom: 1px solid var(--border);
      padding: 12px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700;
      color: #cbd5e1;
    }
    .btn-copy {
      background: #1e293b;
      border: 1px solid var(--border);
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-copy:hover {
      background: var(--primary);
      border-color: var(--primary);
    }
    pre {
      padding: 18px;
      overflow-x: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      color: #e2e8f0;
      line-height: 1.6;
      white-space: pre;
    }

    /* Screen & Audio Cards */
    .detail-card {
      border-radius: 20px;
      padding: 28px;
      border: 1px solid var(--border);
      background: #090d16;
    }
    .detail-card h4 {
      font-size: 18px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 12px;
    }
    .card-headline {
      font-weight: 700;
      color: #fff;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .card-body {
      font-size: 15px;
      color: #cbd5e1;
      margin-bottom: 18px;
      line-height: 1.7;
    }
    .highlights-box {
      background: #0f172a;
      border: 1px solid var(--border);
      padding: 18px;
      border-radius: 14px;
      font-size: 14px;
      margin-top: 16px;
    }
    .highlights-box strong {
      color: #fff;
      display: block;
      margin-bottom: 10px;
      font-size: 15px;
    }
    .highlights-box ul {
      padding-left: 22px;
      color: #cbd5e1;
    }
    .highlights-box li {
      margin-bottom: 6px;
      line-height: 1.6;
    }

    .troubleshoot-story-box {
      background: rgba(249, 115, 22, 0.1);
      border: 1px solid rgba(249, 115, 22, 0.35);
      padding: 18px;
      border-radius: 14px;
      font-size: 14px;
      color: #f1f5f9;
      margin-bottom: 16px;
      line-height: 1.7;
    }
    .troubleshoot-story-box strong {
      color: var(--primary-light);
      display: block;
      margin-bottom: 8px;
      font-size: 15px;
    }
    .advice-card {
      background: #0f172a;
      border: 1px solid var(--border);
      padding: 16px 20px;
      border-radius: 14px;
      font-size: 14px;
      color: #fed7aa;
      margin-bottom: 18px;
      font-style: italic;
    }
    .advice-card strong {
      color: var(--primary);
      font-style: normal;
      display: block;
      margin-bottom: 6px;
      font-size: 15px;
    }
    .takeaways-card {
      background: #0f172a;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 22px;
    }
    .takeaways-card h5 {
      font-size: 16px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 14px;
    }
    .pills-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 14px;
    }
    .res-pill {
      font-size: 12px;
      padding: 5px 12px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #6ee7b7;
      border-radius: 8px;
      font-weight: 700;
    }
    .takeaways-ol {
      padding-left: 22px;
      font-size: 14px;
      color: #e2e8f0;
    }
    .takeaways-ol li {
      margin-bottom: 8px;
      line-height: 1.6;
    }

    /* Transcript Box */
    .transcript-box {
      background: #090d16;
      border: 1px solid var(--border);
      border-radius: 18px;
      overflow: hidden;
    }
    .transcript-bar {
      background: #0f172a;
      padding: 14px 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-weight: 700;
      color: #fff;
    }
    .transcript-scroll {
      padding: 22px;
      max-height: 550px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .transcript-row {
      display: flex;
      gap: 16px;
      font-size: 14px;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 14px;
    }
    .transcript-time {
      font-family: monospace;
      color: var(--primary);
      font-weight: 800;
      width: 56px;
      shrink: 0;
      font-size: 13px;
    }
    .transcript-speaker {
      color: var(--text-muted);
      font-size: 12px;
      margin-bottom: 4px;
      display: block;
    }
    .transcript-text {
      color: #f1f5f9;
      line-height: 1.65;
      font-size: 14px;
    }

    /* Video Player & Timestamps */
    .video-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 22px;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .video-status-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      font-weight: 700;
      color: #cbd5e1;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      display: inline-block;
      box-shadow: 0 0 8px #10b981;
    }
    .youtube-main-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #dc2626;
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      padding: 9px 18px;
      border-radius: 12px;
      text-decoration: none;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35);
    }
    .youtube-main-btn:hover {
      background: #b91c1c;
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(220, 38, 38, 0.5);
    }
    .yt-icon {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }
    .file-protocol-warning {
      background: rgba(249, 115, 22, 0.12);
      border: 1px solid rgba(249, 115, 22, 0.35);
      border-radius: 14px;
      padding: 14px 18px;
      margin-bottom: 16px;
      font-size: 13px;
      line-height: 1.65;
      color: #fed7aa;
    }
    .video-container {
      margin: 16px 0 20px;
      border-radius: 18px;
      overflow: hidden;
      border: 1px solid var(--border);
      background: #000;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    .video-error-fallback {
      background: #0f172a;
      border-top: 1px solid var(--border);
      padding: 12px 18px;
      font-size: 13px;
      font-weight: 700;
      color: #fca5a5;
      cursor: pointer;
      text-align: center;
      transition: background 0.2s;
    }
    .video-error-fallback:hover {
      background: #1e293b;
      color: #fff;
    }
    .all-nodes-section {
      margin-top: 36px;
      padding-top: 28px;
      border-top: 1px solid var(--border);
    }
    .all-nodes-heading {
      font-size: 18px;
      font-weight: 900;
      color: #fff;
      margin-bottom: 8px;
    }
    .all-nodes-sub {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 22px;
      line-height: 1.65;
    }
    .all-nodes-list {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .node-card-full {
      background: #0f172a;
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 24px;
      transition: border-color 0.2s;
    }
    .node-card-full:hover {
      border-color: var(--primary);
    }
    .video-responsive {
      position: relative;
      padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
      height: 0;
      overflow: hidden;
    }
    .video-responsive iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
    .timestamp-bar {
      background: #090d16;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px 20px;
      margin-bottom: 20px;
    }
    .timestamp-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700;
      color: var(--primary-light);
      margin-bottom: 12px;
    }
    .youtube-direct-link {
      color: #ef4444;
      text-decoration: none;
      font-size: 12px;
      font-weight: 700;
    }
    .youtube-direct-link:hover {
      text-decoration: underline;
    }
    .timestamp-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .ts-chip {
      background: #0f172a;
      border: 1px solid var(--border);
      color: #e2e8f0;
      padding: 6px 12px;
      border-radius: 10px;
      font-size: 13px;
      font-family: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .ts-chip:hover {
      background: #1e293b;
      border-color: var(--primary);
      color: #fff;
    }
    .ts-chip.active {
      background: var(--primary);
      border-color: var(--primary);
      color: #fff;
    }
    .ts-time {
      color: var(--primary);
      font-family: monospace;
      font-weight: 800;
    }
    .ts-chip.active .ts-time {
      color: #fff;
    }
    .tech-stack-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      padding: 10px 16px;
      background: #090d16;
      border-radius: 12px;
      border: 1px solid var(--border);
    }
    .tech-label {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-muted);
      margin-right: 6px;
    }
    .tech-tag {
      font-size: 13px;
      font-family: monospace;
      background: #1e293b;
      color: #f1f5f9;
      padding: 4px 10px;
      border-radius: 8px;
      border: 1px solid var(--border);
    }

    /* Stats Overview Section */
    .stats-overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 18px;
      margin-bottom: 40px;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 22px;
      padding: 24px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      transition: transform 0.2s, border-color 0.2s;
    }
    .stat-card:hover {
      border-color: var(--primary);
      transform: translateY(-2px);
    }
    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .stat-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-muted);
    }
    .stat-pill {
      font-size: 12px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 8px;
      background: #1e293b;
      color: #f1f5f9;
      border: 1px solid var(--border);
    }
    .stat-pill.amber { background: rgba(249, 115, 22, 0.15); color: var(--primary-light); border: 1px solid rgba(249, 115, 22, 0.35); }
    .stat-pill.emerald { background: rgba(16, 185, 129, 0.15); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.35); }
    .stat-pill.blue { background: #1e293b; color: #f1f5f9; border: 1px solid var(--border); }
    .stat-pill.rose { background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.35); }
    .stat-value {
      font-size: 26px;
      font-weight: 900;
      color: #fff;
      margin-bottom: 6px;
      letter-spacing: -0.5px;
    }
    .stat-subtext {
      font-size: 13px;
      color: var(--text-muted);
    }

    footer {
      text-align: center;
      color: var(--text-muted);
      font-size: 13px;
      margin-top: 60px;
      padding: 32px;
      border-top: 1px solid #1e293b;
    /* Playbook & Extra Sections Shared */
    .section-header-box {
      margin-bottom: 24px;
    }
    .section-badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      margin-bottom: 12px;
    }
    .section-main-title {
      font-size: 26px;
      font-weight: 900;
      color: #fff;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }
    .section-sub-desc {
      font-size: 15px;
      color: var(--text-body);
      line-height: 1.7;
      max-width: 900px;
    }

    /* Adoption Playbook Section */
    .adoption-playbook-section {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 28px;
      padding: 36px;
      margin-bottom: 40px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.4);
    }
    .pb-tabs-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }
    .pb-tabs-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .pb-tab-btn {
      background: #1e293b;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 10px 18px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .pb-tab-btn:hover {
      background: #334155;
      border-color: var(--border-light);
    }
    .pb-tab-btn.active {
      background: rgba(249, 115, 22, 0.15);
      border-color: var(--primary);
    }
    .pb-tab-btn.active .pb-tab-title {
      color: var(--primary-light);
    }
    .pb-tab-title {
      font-size: 14px;
      font-weight: 800;
      color: #fff;
    }
    .pb-tab-sub {
      font-size: 12px;
      color: var(--text-muted);
      font-family: monospace;
    }
    .pb-toggle-all-btn {
      background: #1e293b;
      border: 1px solid var(--border);
      color: var(--text-body);
      font-size: 13px;
      font-weight: 700;
      padding: 8px 16px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .pb-toggle-all-btn:hover {
      background: #334155;
      color: #fff;
    }
    .playbook-track-pane {
      display: none;
      animation: fadeIn 0.2s ease-in-out;
    }
    .playbook-track-pane.active {
      display: block;
    }
    .playbook-track-pane.force-show {
      display: block !important;
      margin-bottom: 32px;
      padding-bottom: 32px;
      border-bottom: 1px solid var(--border);
    }
    .track-pane-header {
      background: #090d16;
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 20px 24px;
      margin-bottom: 24px;
    }
    .track-header-top {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .track-summary-text {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      line-height: 1.6;
    }
    .playbook-two-col {
      display: grid;
      grid-template-columns: 1fr 1.35fr;
      gap: 20px;
    }
    @media (max-width: 900px) {
      .playbook-two-col { grid-template-columns: 1fr; }
    }
    .playbook-col-card {
      background: #0b1120;
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 24px;
    }
    .col-card-title {
      font-size: 15px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 18px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border);
    }
    .daangn-did-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .daangn-did-list li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 14.5px;
      line-height: 1.6;
      color: var(--text-body);
    }
    .chk-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 6px;
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
      font-size: 12px;
      font-weight: 900;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .steps-flow {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .playbook-step-card {
      background: #0f172a;
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 18px;
    }
    .step-badge-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    .step-num-badge {
      background: rgba(249, 115, 22, 0.2);
      color: var(--primary-light);
      border: 1px solid rgba(249, 115, 22, 0.4);
      font-size: 12px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 6px;
    }
    .step-phase-title {
      font-size: 15px;
      font-weight: 800;
      color: #fff;
    }
    .step-action-desc {
      font-size: 14px;
      color: var(--text-body);
      line-height: 1.6;
      margin-bottom: 12px;
    }

    /* Quantitative Metrics Table Section */
    .metrics-overview-section {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 28px;
      padding: 36px;
      margin-bottom: 40px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.4);
    }
    .table-scroll-wrapper {
      overflow-x: auto;
      border-radius: 16px;
      border: 1px solid var(--border);
      background: #090d16;
    }
    .styled-metrics-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
      min-width: 860px;
    }
    .styled-metrics-table th {
      background: #0f172a;
      color: #f1f5f9;
      font-weight: 800;
      padding: 16px 18px;
      border-bottom: 1px solid var(--border);
      white-space: nowrap;
      font-size: 13.5px;
    }
    .styled-metrics-table td {
      padding: 16px 18px;
      border-bottom: 1px solid rgba(51, 65, 85, 0.6);
      vertical-align: middle;
    }
    .styled-metrics-table tr:hover {
      background: rgba(30, 41, 59, 0.4);
    }
    .table-session-link {
      text-decoration: none;
    }
    .table-title-link {
      color: #fff;
      text-decoration: none;
      transition: color 0.2s;
    }
    .table-title-link:hover {
      color: var(--primary-light);
    }
    .metric-pill {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 8px;
      background: rgba(16, 185, 129, 0.15);
      color: #6ee7b7;
      border: 1px solid rgba(16, 185, 129, 0.35);
      font-size: 12px;
      font-weight: 800;
      white-space: nowrap;
    }

    /* FAQ Knowledge Base Section */
    .faq-knowledge-section {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 28px;
      padding: 36px;
      margin-bottom: 40px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.4);
    }
    .faq-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
      gap: 20px;
    }
    @media (max-width: 768px) {
      .faq-cards-grid { grid-template-columns: 1fr; }
    }
    .faq-item-card {
      background: #090d16;
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: border-color 0.2s;
    }
    .faq-item-card:hover {
      border-color: var(--primary);
    }
    .faq-card-head {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .faq-card-q {
      font-size: 16px;
      font-weight: 800;
      color: #fff;
      line-height: 1.5;
    }
    .faq-card-a {
      font-size: 14px;
      color: var(--text-body);
      line-height: 1.7;
    }

    /* Category Filter Bar */
    .category-filter-wrapper {
      background: #090d16;
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 20px 24px;
      margin-bottom: 30px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .filter-headline-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .filter-main-label {
      font-size: 18px;
      font-weight: 900;
      color: #fff;
    }
    .filter-guide-label {
      font-size: 13px;
      color: var(--text-muted);
    }
    .filter-buttons-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .cat-pill-btn {
      background: #1e293b;
      border: 1px solid var(--border);
      color: var(--text-body);
      font-size: 14px;
      font-weight: 700;
      padding: 8px 18px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .cat-pill-btn:hover {
      background: #334155;
      color: #fff;
    }
    .cat-pill-btn.active {
      background: var(--primary);
      border-color: var(--primary);
      color: #fff;
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.35);
    }

    /* Full Report / Data Section */
    .full-report-section {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 28px;
      padding: 36px;
      margin-bottom: 40px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.4);
    }
    .report-box-wrapper {
      background: #090d16;
      border: 1px solid var(--border);
      border-radius: 18px;
      overflow: hidden;
    }
    .report-action-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 16px 20px;
      background: #0f172a;
      border-bottom: 1px solid var(--border);
    }
    .report-tabs-btn-group {
      display: flex;
      gap: 8px;
    }
    .rep-tab-btn {
      background: #1e293b;
      border: 1px solid var(--border);
      color: var(--text-body);
      font-size: 13.5px;
      font-weight: 700;
      padding: 8px 16px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .rep-tab-btn:hover {
      background: #334155;
      color: #fff;
    }
    .rep-tab-btn.active {
      background: rgba(249, 115, 22, 0.2);
      border-color: var(--primary);
      color: var(--primary-light);
    }
    .btn-copy-rep {
      background: var(--primary);
      color: #fff;
      border: none;
      font-size: 13px;
      font-weight: 800;
      padding: 9px 18px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-copy-rep:hover {
      background: var(--primary-dark);
    }
    .report-code-container {
      padding: 24px;
      max-height: 550px;
      overflow-y: auto;
    }
    .report-code-container pre {
      margin: 0;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13.5px;
      line-height: 1.6;
      color: #e2e8f0;
      white-space: pre-wrap;
      word-break: break-word;
    }

    @media print {
      .top-navbar { display: none; }
      body { background: #fff; color: #000; }
      .session-card, .adoption-playbook-section, .metrics-overview-section, .faq-knowledge-section { page-break-after: always; box-shadow: none; border-color: #ddd; }
    }
  </style>
</head>
<body>
  <!-- Top Navigation Bar -->
  <nav class="top-navbar">
    <div class="brand-group">
      <div class="brand-icon">🥕</div>
      <span>당근 SRE Day 실전 플레이북</span>
    </div>

    <div class="top-nav-links">
      <a href="#adoption-playbook" class="nav-chip accent">🛠️ 실무 플레이북</a>
      <a href="#master-topology" class="nav-chip accent">🗺️ 5계층 아키텍처</a>
      <a href="#metrics-table" class="nav-chip">📊 성과 총괄표</a>
      <a href="#sre-faq" class="nav-chip">💡 SRE 질의응답</a>
      <a href="#sessionList" class="nav-chip">📑 9대 세션 분석</a>
      <a href="#full-report-data" class="nav-chip">📄 요약 리포트/데이터</a>
      <a href="#session-1" class="nav-chip">#1 CI 캐시</a>
      <a href="#session-2" class="nav-chip">#2 MCP 배포</a>
      <a href="#session-3" class="nav-chip">#3 Karpenter</a>
      <a href="#session-4" class="nav-chip">#4 TPU v5e</a>
      <a href="#session-5" class="nav-chip">#5 옵저버빌리티</a>
      <a href="#session-6" class="nav-chip">#6 eBPF</a>
      <a href="#session-7" class="nav-chip">#7 OIDC 제로키</a>
      <a href="#session-8" class="nav-chip">#8 Valkey 8.0</a>
      <a href="#session-9" class="nav-chip">#9 GitHub EMU</a>
    </div>

    <div>
      <input type="text" class="search-box" placeholder="세션 검색 (eBPF, TPU, Redis...)" oninput="filterSessions(this.value)">
    </div>
  </nav>

  <div class="container">
    <!-- Hero Header -->
    <header class="hero-header">
      <h1 class="hero-title">🥕 2026 당근 빌더 밋업 | SRE Day 실전 인프라 플레이북 & 아키텍처 리포트</h1>
      <p class="hero-desc">${escapeHtml(PLAYLIST_INFO.description)}</p>
      <div class="hero-badges">
        <span class="badge badge-accent">총 9개 세션 전수 분석 완료</span>
        <span class="badge badge-secondary">일자: ${PLAYLIST_INFO.eventDate}</span>
        <span class="badge badge-secondary">주최: ${PLAYLIST_INFO.channel}</span>
        <span class="badge badge-emerald">단일 오프라인 HTML (100% 완전 독립 실행)</span>
      </div>
    </header>

    <!-- Engineering Stats Overview (Web App Matching) -->
    <div class="stats-overview-grid">
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">CI 빌드 시간 단축</span>
          <span class="stat-pill amber">-85% 단축</span>
        </div>
        <div class="stat-value">14분 → 2.1분</div>
        <div class="stat-subtext">캐시 히트율 99.4% 달성 (세션 1)</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">EKS 노드 프로비저닝</span>
          <span class="stat-pill emerald">비용 -28% 절감</span>
        </div>
        <div class="stat-value">180초 → 35초</div>
        <div class="stat-subtext">Karpenter 및 Spot 빈패킹 (세션 3)</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">평균 장애 복구 (MTTR)</span>
          <span class="stat-pill blue">-82% 급감</span>
        </div>
        <div class="stat-value">45분 → 8분</div>
        <div class="stat-subtext">Grafana 걷어내고 에이전트 얼럿 (세션 5)</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">정적 시크릿 키 제거</span>
          <span class="stat-pill rose">보안 100% 달성</span>
        </div>
        <div class="stat-value">450개 → 0개</div>
        <div class="stat-subtext">OIDC STS 및 EMU 계정 이관 (세션 7, 9)</div>
      </div>
    </div>

    <!-- 1. Adoption Playbook (4 Tracks with 3-Step Guides & Code) -->
    ${adoptionPlaybookHtml}

    <!-- 2. Master Architecture Topology (5 Layers) -->
    ${masterLayersHtml}

    <!-- 3. Quantitative Metrics Table (9 Sessions Overview) -->
    ${metricsTableHtml}

    <!-- 4. SRE Architect FAQ Knowledge Base -->
    ${faqSectionHtml}

    <!-- 5. Category Filter Bar -->
    ${categoryFilterBarHtml}

    <!-- 6. 9 Sessions Full Cards -->
    <main id="sessionList">
      ${sessionsHtml}
    </main>

    <!-- 7. Full Report & Raw Data (Markdown / JSON) -->
    ${fullReportSectionHtml}

    <footer>
      당근 팀 (Karrot Team) 2026 SRE Day 9개 세션 통합 플레이북 | 본 리포트는 단일 HTML 파일로 구성되어 별도 인터넷 연결이나 로그인 없이 브라우저에서 영구 열람 가능합니다.
    </footer>
  </div>

  <script>
    // Tab switching for each session
    function switchSessionTab(sessionId, tabKey) {
      var card = document.getElementById(sessionId);
      if (!card) return;

      var buttons = card.querySelectorAll('.tab-btn');
      buttons.forEach(function(b) { b.classList.remove('active'); });

      var contents = card.querySelectorAll('.tab-content');
      contents.forEach(function(c) { c.classList.remove('active'); });

      var target = document.getElementById(sessionId + '-tab-' + tabKey);
      if (target) target.classList.add('active');

      if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
      }
    }

    // Dynamic Node Inspector Selection
    function selectNode(sessionId, nodeId) {
      var card = document.getElementById(sessionId);
      if (!card) return;

      // 1. Highlight clicked node capsule
      var capsules = card.querySelectorAll('.flow-node-capsule');
      capsules.forEach(function(c) { c.classList.remove('active'); });

      var targetCapsule = document.getElementById('btn-' + sessionId + '-' + nodeId);
      if (targetCapsule) {
        targetCapsule.classList.add('active');
      }

      // 2. Show corresponding inspector panel
      var panels = card.querySelectorAll('.node-inspector-panel');
      panels.forEach(function(p) { p.classList.remove('active'); });

      var targetPanel = document.getElementById('inspector-' + sessionId + '-' + nodeId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    }

    // Seek Video Player to specific seconds from Timestamp chips
    function seekVideo(sessionId, videoId, seconds) {
      var iframe = document.getElementById('player-' + sessionId);
      if (iframe) {
        iframe.src = 'https://www.youtube.com/embed/' + videoId + '?start=' + seconds + '&autoplay=1&enablejsapi=1&rel=0';
      }

      var directBtn = document.getElementById('yt-direct-' + sessionId);
      if (directBtn) {
        directBtn.href = 'https://www.youtube.com/watch?v=' + videoId + '&t=' + seconds + 's';
      }

      var card = document.getElementById(sessionId);
      if (card) {
        var chips = card.querySelectorAll('.ts-chip');
        chips.forEach(function(c) { c.classList.remove('active'); });
        if (window.event && window.event.currentTarget) {
          window.event.currentTarget.classList.add('active');
        }
      }

      if (window.location.protocol === 'file:') {
        window.open('https://www.youtube.com/watch?v=' + videoId + '&t=' + seconds + 's', '_blank');
      }
    }

    // Copy Code button
    function copyCode(btn) {
      var box = btn.closest('.code-box');
      if (!box) return;
      var code = box.querySelector('code');
      if (!code) return;

      navigator.clipboard.writeText(code.innerText).then(function() {
        var prev = btn.innerText;
        btn.innerText = '복사 완료!';
        btn.style.background = '#10b981';
        setTimeout(function() {
          btn.innerText = prev;
          btn.style.background = '';
        }, 2000);
      });
    }

    // Copy Entire Transcript of a Session
    function copyTranscript(sessionId) {
      var body = document.getElementById(sessionId + '-transcript-body');
      if (!body) return;
      var text = body.innerText;
      navigator.clipboard.writeText(text).then(function() {
        alert('세션 ' + sessionId + ' 전체 녹취록 전문이 클립보드에 복사되었습니다.');
      });
    }

    // Playbook Track Switching
    function switchPlaybookTrack(trackId) {
      var buttons = document.querySelectorAll('.pb-tab-btn');
      buttons.forEach(function(b) { b.classList.remove('active'); });

      var targetBtn = document.getElementById('pb-btn-' + trackId);
      if (targetBtn) targetBtn.classList.add('active');

      var panes = document.querySelectorAll('.playbook-track-pane');
      panes.forEach(function(p) {
        p.classList.remove('active');
        p.classList.remove('force-show');
      });

      var targetPane = document.getElementById('pb-pane-' + trackId);
      if (targetPane) targetPane.classList.add('active');

      var toggleBtn = document.getElementById('pb-toggle-text');
      if (toggleBtn) toggleBtn.innerText = '전체 트랙 한 번에 펼치기 ⬇';
    }

    // Toggle All Playbook Tracks Expand/Collapse
    var allPlaybookTracksExpanded = false;
    function toggleAllPlaybookTracks() {
      allPlaybookTracksExpanded = !allPlaybookTracksExpanded;
      var panes = document.querySelectorAll('.playbook-track-pane');
      var toggleBtn = document.getElementById('pb-toggle-text');

      if (allPlaybookTracksExpanded) {
        panes.forEach(function(p) { p.classList.add('force-show'); });
        if (toggleBtn) toggleBtn.innerText = '탭 전환 모드로 접기 ⬆';
      } else {
        panes.forEach(function(p) { p.classList.remove('force-show'); });
        if (toggleBtn) toggleBtn.innerText = '전체 트랙 한 번에 펼치기 ⬇';
        var activeBtn = document.querySelector('.pb-tab-btn.active');
        if (activeBtn) {
          var tid = activeBtn.id.replace('pb-btn-', '');
          var activePane = document.getElementById('pb-pane-' + tid);
          if (activePane) activePane.classList.add('active');
        }
      }
    }

    // Category Filtering
    var currentCategoryFilter = '전체';
    function filterCategory(catName) {
      currentCategoryFilter = catName;
      var buttons = document.querySelectorAll('.cat-pill-btn');
      buttons.forEach(function(b) {
        if (b.innerText.indexOf(catName) !== -1) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });

      var searchInput = document.querySelector('.search-box');
      filterSessions(searchInput ? searchInput.value : '');
    }

    // Search filter across sessions (combining category filter)
    function filterSessions(query) {
      var q = (query || '').toLowerCase().trim();
      var cards = document.querySelectorAll('.session-card');
      cards.forEach(function(card) {
        var cardCat = card.getAttribute('data-category') || '';
        var matchCategory = currentCategoryFilter === '전체' || cardCat === currentCategoryFilter;

        if (!matchCategory) {
          card.style.display = 'none';
          return;
        }

        if (!q) {
          card.style.display = 'block';
          return;
        }

        var text = card.innerText.toLowerCase();
        if (text.indexOf(q) !== -1) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }

    // Report Format Switching (Markdown vs JSON)
    var currentReportFormat = 'md';
    function switchReportTab(fmt) {
      currentReportFormat = fmt;
      var btnMd = document.getElementById('btn-rep-md');
      var btnJson = document.getElementById('btn-rep-json');
      var preMd = document.getElementById('pre-report-md');
      var preJson = document.getElementById('pre-report-json');

      if (fmt === 'md') {
        if (btnMd) btnMd.classList.add('active');
        if (btnJson) btnJson.classList.remove('active');
        if (preMd) preMd.style.display = 'block';
        if (preJson) preJson.style.display = 'none';
      } else {
        if (btnJson) btnJson.classList.add('active');
        if (btnMd) btnMd.classList.remove('active');
        if (preJson) preJson.style.display = 'block';
        if (preMd) preMd.style.display = 'none';
      }
    }

    // Copy Active Report Content
    function copyActiveReport() {
      var codeElem = currentReportFormat === 'md' 
        ? document.getElementById('code-report-md') 
        : document.getElementById('code-report-json');
      if (!codeElem) return;

      var text = codeElem.innerText;
      navigator.clipboard.writeText(text).then(function() {
        var btnText = document.getElementById('rep-copy-text');
        if (btnText) {
          var prev = btnText.innerText;
          btnText.innerText = '✓ ' + (currentReportFormat === 'md' ? '마크다운 리포트' : 'JSON 원시 데이터') + ' 복사 완료!';
          setTimeout(function() {
            btnText.innerText = prev;
          }, 2500);
        }
      });
    }
  </script>
</body>
</html>`;
}

/**
 * Generates and downloads a complete, standalone, self-contained single-file HTML document
 * containing all 9 sessions, full transcripts, audio & screen insights, and vector architecture diagrams.
 *
 * Guaranteed 100% UTF-8 BOM encoding so it never breaks on Windows/Mac/Chrome/Edge/Safari.
 */
export function downloadStandaloneHtmlReport() {
  const fullHtml = generateStandaloneHtmlReport();

  // Prepend UTF-8 BOM (\uFEFF) to guarantee 100% proper Korean UTF-8 decoding across all OS/Browsers/Notepad
  const blob = new Blob(['\uFEFF', fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', '2026_당근_SRE_Day_완전판_플레이북.html');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
