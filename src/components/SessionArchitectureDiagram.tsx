import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Download,
  Terminal,
  Cpu,
  Server,
  Zap,
  ShieldCheck,
  HardDrive,
  GitBranch,
  Bot,
  Activity,
  FileCode,
  Sparkles,
  RefreshCw,
  Box,
  Eye,
  Key,
  Database,
  Radio,
  Workflow,
  ArrowDownRight,
  Code2,
  Sliders,
  ExternalLink,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { SESSION_ARCHITECTURES, SessionArchitecture, ArchitectureNode } from '../data/sessionArchitectureData.ts';
import { SessionData } from '../data/playlistData.ts';
import { NODE_DETAIL_SPECS, NodeDetailSpec } from '../data/nodeDetailSpecs.ts';

interface SessionArchitectureDiagramProps {
  session: SessionData;
  onOpenTranscript?: () => void;
}

export const SessionArchitectureDiagram: React.FC<SessionArchitectureDiagramProps> = ({
  session,
  onOpenTranscript
}) => {
  const [activeView, setActiveView] = useState<'visual' | 'comparison' | 'pipeline' | 'mermaid' | 'specs'>('visual');
  const [diagramMode, setDiagramMode] = useState<'flow' | 'grid'>('flow');
  const [copiedMermaid, setCopiedMermaid] = useState(false);
  const [copiedAscii, setCopiedAscii] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const arch: SessionArchitecture = SESSION_ARCHITECTURES[session.id] || {
    sessionId: session.id,
    title: session.title,
    headline: session.screenAnalysis.headline,
    architectureSummary: session.summary,
    beforeArchitecture: {
      title: '기존 아키텍처 한계',
      description: '단순 표준 구성으로 인한 성능 병목 및 유휴 리소스 발생',
      bottlenecks: ['높은 레이턴시 및 대기 시간', '수작업 관리 오버헤드', '가용성 및 복원력 한계']
    },
    afterArchitecture: {
      title: '당근 도입 아키텍처',
      description: session.screenAnalysis.diagramDescription,
      improvements: session.keyTakeaways
    },
    nodes: [
      { id: 'client', label: '요청 유입 / 트리거', sublabel: 'Client / Event', type: 'client', iconName: 'Box', status: 'active', description: '트래픽 유입' },
      { id: 'controller', label: '오케스트레이터 / 엔진', sublabel: 'Controller Plane', type: 'compute', iconName: 'Cpu', status: 'optimized', description: '핵심 로직 처리' },
      { id: 'storage', label: '스토리지 및 인프라', sublabel: 'Data / State', type: 'storage', iconName: 'Database', status: 'monitored', description: '영속성 및 캐시 레이어' }
    ],
    edges: [
      { from: 'client', to: 'controller', label: '요청 전달' },
      { from: 'controller', to: 'storage', label: '데이터 동기화', isOptimized: true }
    ],
    pipelineSteps: [
      { step: 1, phase: '준비', action: '트래픽 수신', detail: '초기 파라미터 검증' },
      { step: 2, phase: '실행', action: '최적화 파이프라인 수행', detail: '가드레일 검증' },
      { step: 3, phase: '완료', action: '결과 반영', detail: '모니터링 및 알람' }
    ],
    keySpecs: [
      { component: 'Core Engine', role: '핵심 처리기', tech: session.techStack[0] || 'Kubernetes', keyConfig: 'Standard Config' }
    ],
    mermaidCode: `graph LR\n  A[Client Trigger] --> B[Core Engine]\n  B --> C[Optimized Storage]`,
    asciiDiagram: `[Client] ──► [Core Engine] ──► [Optimized Storage]`
  };

  // Default select the primary or 2nd node so the inspector is NEVER empty!
  const defaultSelectedId = arch.nodes.length > 1 ? arch.nodes[1].id : arch.nodes[0]?.id;
  const [selectedNodeId, setSelectedNodeId] = useState<string>(defaultSelectedId || 'client');

  const selectedNode = arch.nodes.find((n) => n.id === selectedNodeId) || arch.nodes[0];
  const sessionNodeSpecs = NODE_DETAIL_SPECS[session.id] || {};
  const selectedNodeSpec: NodeDetailSpec | undefined = selectedNode ? sessionNodeSpecs[selectedNode.id] : undefined;

  // Connected inbound and outbound edges
  const inboundEdges = selectedNode ? arch.edges.filter((e) => e.to === selectedNode.id) : [];
  const outboundEdges = selectedNode ? arch.edges.filter((e) => e.from === selectedNode.id) : [];

  const handleCopyMermaid = () => {
    navigator.clipboard.writeText(arch.mermaidCode);
    setCopiedMermaid(true);
    setTimeout(() => setCopiedMermaid(false), 2000);
  };

  const handleCopyAscii = () => {
    navigator.clipboard.writeText(arch.asciiDiagram);
    setCopiedAscii(true);
    setTimeout(() => setCopiedAscii(false), 2000);
  };

  const handleCopySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'client':
        return <Activity className="w-5 h-5 text-sky-400" />;
      case 'gateway':
        return <Server className="w-5 h-5 text-violet-400" />;
      case 'compute':
        return <Cpu className="w-5 h-5 text-amber-400" />;
      case 'storage':
        return <Database className="w-5 h-5 text-emerald-400" />;
      case 'cache':
        return <HardDrive className="w-5 h-5 text-cyan-400" />;
      case 'guardrail':
      case 'security':
        return <ShieldCheck className="w-5 h-5 text-rose-400" />;
      case 'observability':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      default:
        return <Box className="w-5 h-5 text-slate-400" />;
    }
  };

  const getNodeColors = (type: string, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-slate-900 border-orange-500 shadow-xl shadow-orange-500/25 ring-2 ring-orange-500/80';
    }
    switch (type) {
      case 'client':
        return 'bg-gradient-to-b from-sky-950/60 to-slate-950/90 border-sky-500/40 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/10';
      case 'gateway':
        return 'bg-gradient-to-b from-violet-950/60 to-slate-950/90 border-violet-500/40 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/10';
      case 'compute':
        return 'bg-gradient-to-b from-amber-950/60 to-slate-950/90 border-amber-500/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10';
      case 'cache':
        return 'bg-gradient-to-b from-cyan-950/60 to-slate-950/90 border-cyan-500/40 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10';
      case 'storage':
        return 'bg-gradient-to-b from-emerald-950/60 to-slate-950/90 border-emerald-500/40 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10';
      case 'guardrail':
      case 'security':
        return 'bg-gradient-to-b from-rose-950/60 to-slate-950/90 border-rose-500/40 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-500/10';
      default:
        return 'bg-slate-900/90 border-slate-700 hover:border-slate-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'optimized':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            최적화됨 (Optimized)
          </span>
        );
      case 'active':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            활성 파이프라인
          </span>
        );
      case 'monitored':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
            실시간 모니터링
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            표준 노드
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-orange-950/50 via-slate-900 to-cyan-950/50 border border-slate-700/80 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-orange-500/25 text-orange-300 border border-orange-500/50 shadow-sm">
                세션 {session.index} 실무 인프라 아키텍처
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {session.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-800/80">
                ✓ 9대 세션 전수 실측 완료
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {arch.headline}
            </h3>
            <p className="text-sm text-slate-300 mt-2 max-w-4xl leading-relaxed">
              {arch.architectureSummary}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyMermaid}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl transition-all cursor-pointer shadow"
              title="Mermaid 다이어그램 코드를 복사하여 Notion/GitHub/Obsidian에 붙여넣기"
            >
              {copiedMermaid ? <Check className="w-4 h-4 text-emerald-400" /> : <FileCode className="w-4 h-4 text-orange-400" />}
              <span>{copiedMermaid ? 'Mermaid 복사 완료!' : 'Mermaid 코드 복사'}</span>
            </button>
            <button
              onClick={handleCopyAscii}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl transition-all cursor-pointer shadow"
              title="텍스트 기반 ASCII 아키텍처 다이어그램 복사"
            >
              {copiedAscii ? <Check className="w-4 h-4 text-emerald-400" /> : <Terminal className="w-4 h-4 text-cyan-400" />}
              <span>{copiedAscii ? 'ASCII 복사 완료!' : 'ASCII 복사'}</span>
            </button>
          </div>
        </div>

        {/* View Switcher Sub-tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveView('visual')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'visual'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30 ring-1 ring-orange-400'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4 text-white" />
            <span>🗺️ 실전 시스템 토폴로지 & 노드 인스펙터</span>
          </button>

          <button
            onClick={() => setActiveView('comparison')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'comparison'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30 ring-1 ring-orange-400'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>⚖️ 기존 한계 vs 당근 개선 비교</span>
          </button>

          <button
            onClick={() => setActiveView('pipeline')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'pipeline'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30 ring-1 ring-orange-400'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>⚡ 5단계 엔지니어링 실행 파이프라인</span>
          </button>

          <button
            onClick={() => setActiveView('specs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'specs'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30 ring-1 ring-orange-400'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>🛠️ 핵심 컴포넌트 실무 스펙 테이블</span>
          </button>

          <button
            onClick={() => setActiveView('mermaid')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'mermaid'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30 ring-1 ring-orange-400'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>💻 다이어그램 코드 & ASCII 전체보기</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Visual Interactive Architecture Map & Node Inspector */}
      {activeView === 'visual' && (
        <div className="space-y-6">
          {/* Architecture Topology Canvas */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-950 border-2 border-slate-800 relative overflow-hidden shadow-2xl">
            {/* Header with Display Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                    <span>당근 SRE 실전 시스템 토폴로지</span>
                    <span className="text-xs font-normal text-orange-400 bg-orange-950/60 border border-orange-800/80 px-2 py-0.5 rounded-full">
                      노드를 클릭하면 아래에 세부 스펙 표시됨
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    전체 {arch.nodes.length}개 노드와 {arch.edges.length}개 데이터 흐름 경로가 실측 매핑되어 있습니다.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setDiagramMode('flow')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      diagramMode === 'flow'
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Workflow className="w-3.5 h-3.5" />
                    <span>플로우 연결 뷰</span>
                  </button>
                  <button
                    onClick={() => setDiagramMode('grid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      diagramMode === 'grid'
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>매트릭스 카드 뷰</span>
                  </button>
                </div>
              </div>
            </div>

            {/* FLOW VIEW: Interactive Flow Pipeline with Directional Connections */}
            {diagramMode === 'flow' ? (
              <div className="space-y-6">
                {/* SVG Visual Flow Blueprint Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 overflow-x-auto">
                  <div className="min-w-[700px] flex items-center justify-between gap-3 py-2 px-1">
                    {arch.nodes.map((node, index) => {
                      const isSelected = selectedNodeId === node.id;
                      const hasNext = index < arch.nodes.length - 1;
                      const connectedEdge = arch.edges.find((e) => e.from === node.id);

                      return (
                        <React.Fragment key={node.id}>
                          {/* Node Capsule */}
                          <div
                            onClick={() => setSelectedNodeId(node.id)}
                            className={`flex-1 min-w-[130px] p-3 rounded-2xl border-2 transition-all cursor-pointer relative group text-left ${getNodeColors(
                              node.type,
                              isSelected
                            )}`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span className="p-1 rounded-lg bg-slate-950/80 border border-slate-800">
                                {getNodeIcon(node.type)}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-bold bg-slate-950/90 text-slate-300 border border-slate-800">
                                {node.type}
                              </span>
                            </div>

                            <div className="text-xs font-black text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                              {node.label}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono truncate">
                              {node.sublabel}
                            </div>

                            {isSelected && (
                              <div className="mt-2 text-[10px] font-bold text-orange-300 flex items-center gap-1 bg-orange-950/90 px-1.5 py-0.5 rounded border border-orange-700/60">
                                <span>선택됨 (스펙 표시 중)</span>
                              </div>
                            )}
                          </div>

                          {/* Connecting Arrow & Protocol Pill */}
                          {hasNext && (
                            <div className="flex flex-col items-center justify-center px-1 shrink-0">
                              <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-slate-700 via-orange-500 to-slate-700 relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-orange-400 rotate-45"></div>
                              </div>
                              {connectedEdge?.protocol && (
                                <span className="text-[9px] font-mono text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded border border-cyan-900/60 mt-1 whitespace-nowrap">
                                  {connectedEdge.protocol}
                                </span>
                              )}
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Nodes Card List with Full Specs preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {arch.nodes.map((node) => {
                    const isSelected = selectedNodeId === node.id;
                    const nodeSpec = sessionNodeSpecs[node.id];

                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left relative flex flex-col justify-between ${getNodeColors(
                          node.type,
                          isSelected
                        )}`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 rounded-xl bg-slate-950/90 border border-slate-800 shadow">
                                {getNodeIcon(node.type)}
                              </div>
                              <div>
                                <h4 className="text-sm font-extrabold text-white leading-tight">
                                  {node.label}
                                </h4>
                                <span className="text-[11px] font-mono text-slate-400">{node.sublabel}</span>
                              </div>
                            </div>
                            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                              {node.type}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed mb-3">
                            {node.description}
                          </p>
                        </div>

                        <div className="space-y-2 pt-3 border-t border-slate-800/80">
                          {node.spec && (
                            <div className="text-[11px] font-mono text-cyan-300 bg-slate-950/90 px-2.5 py-1 rounded-lg border border-cyan-900/70 flex items-center justify-between">
                              <span>⚙️ {node.spec}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            {getStatusBadge(node.status)}
                            <span
                              className={`text-[11px] font-bold transition-colors ${
                                isSelected ? 'text-orange-400' : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              {isSelected ? '✓ 세부 스펙 열람 중' : '클릭하여 스펙 보기 →'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {arch.nodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${getNodeColors(
                        node.type,
                        isSelected
                      )}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                            {getNodeIcon(node.type)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{node.label}</h4>
                            <span className="text-[10px] font-mono text-slate-400">{node.sublabel}</span>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                          {node.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mb-2">{node.description}</p>
                      {node.spec && (
                        <div className="text-[11px] font-mono text-cyan-300 bg-slate-950 px-2 py-1 rounded border border-cyan-900/60 mb-2">
                          {node.spec}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs">
                        {getStatusBadge(node.status)}
                        <span className="text-[11px] text-orange-400 font-bold">
                          {isSelected ? '선택됨' : '스펙 열기'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Data Flow Connections (Edge Map) */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>데이터 & 제어 통신 파이프라인 (연결된 네트워크 프로토콜)</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-mono">총 {arch.edges.length}개 트래픽 링크</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                {arch.edges.map((edge, idx) => {
                  const isEdgeActive = selectedNode && (edge.from === selectedNode.id || edge.to === selectedNode.id);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isEdgeActive
                          ? 'bg-slate-900/90 border-orange-500/60 ring-1 ring-orange-500/30'
                          : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-slate-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNodeId(edge.from);
                          }}
                          className="font-mono text-cyan-300 font-bold hover:underline cursor-pointer"
                        >
                          {edge.from}
                        </button>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNodeId(edge.to);
                          }}
                          className="font-mono text-amber-300 font-bold hover:underline cursor-pointer"
                        >
                          {edge.to}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs">{edge.label}</span>
                        {edge.protocol && (
                          <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/70">
                            {edge.protocol}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* NODE DETAIL INSPECTOR: The Critical Specification Panel */}
          {selectedNode && (
            <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-orange-500/70 shadow-2xl space-y-5 animate-in fade-in duration-300">
              {/* Inspector Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/50 flex items-center justify-center shadow-lg shadow-orange-500/10">
                    {getNodeIcon(selectedNode.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-mono font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                        {selectedNode.type} 노드 세부 엔지니어링 스펙
                      </span>
                      {getStatusBadge(selectedNode.status)}
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                      {selectedNode.label} <span className="text-sm font-mono text-slate-400 font-normal">({selectedNode.sublabel})</span>
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    ID: {selectedNode.id}
                  </span>
                </div>
              </div>

              {/* Inspector 3-Column Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. 아키텍처 역할 */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    <span>아키텍처 역할 & 처리 로직</span>
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedNodeSpec?.architectureRole || selectedNode.description}
                  </p>
                </div>

                {/* 2. 하드웨어 및 인프라 실측 규격 */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" />
                    <span>하드웨어 규격 & 네트워크 프로토콜</span>
                  </h5>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-500 text-[11px] block font-mono">인프라 사양:</span>
                      <span className="font-semibold">{selectedNodeSpec?.hardwareSpec || selectedNode.spec || '표준 K8s Pod Spec'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block font-mono">포트 및 프로토콜:</span>
                      <span className="font-mono text-emerald-300">{selectedNodeSpec?.portsProtocols || 'gRPC / HTTPS / TCP'}</span>
                    </div>
                  </div>
                </div>

                {/* 3. 연결된 트래픽 경로 (Inbound / Outbound) */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                    <Workflow className="w-4 h-4" />
                    <span>연결된 트래픽 입출력</span>
                  </h5>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] font-mono">인바운드 (수신):</span>
                      {inboundEdges.length > 0 ? (
                        inboundEdges.map((e, i) => (
                          <div key={i} className="text-slate-300 flex items-center gap-1 mt-0.5">
                            <span className="font-mono text-cyan-400">{e.from}</span>
                            <span className="text-slate-500">→</span>
                            <span className="text-[11px] text-slate-400">({e.label})</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-500 text-[11px]">외부 최초 인입점 (Root Trigger)</div>
                      )}
                    </div>
                    <div className="pt-1 border-t border-slate-800/80">
                      <span className="text-slate-500 text-[11px] font-mono">아웃바운드 (발신):</span>
                      {outboundEdges.length > 0 ? (
                        outboundEdges.map((e, i) => (
                          <div key={i} className="text-slate-300 flex items-center gap-1 mt-0.5">
                            <span className="font-mono text-amber-400">{e.to}</span>
                            <span className="text-slate-500">→</span>
                            <span className="text-[11px] text-slate-400">({e.label})</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-500 text-[11px]">최종 영속 저장/완료 노드 (Terminal)</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SRE Production Tip Banner */}
              {selectedNodeSpec?.sreProductionTip && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 border border-amber-500/40 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-amber-300 mb-1">
                      💡 당근 SRE 현장 트러블슈팅 경험담 & 장애 방지 가드레일:
                    </h5>
                    <p className="text-xs text-amber-100/90 leading-relaxed">
                      {selectedNodeSpec.sreProductionTip}
                    </p>
                  </div>
                </div>
              )}

              {/* Production Configuration / YAML Manifest Box */}
              {selectedNodeSpec?.productionConfigCode && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <Code2 className="w-4 h-4 text-orange-400" />
                      <span>실전 프로덕션 설정 코드: {selectedNodeSpec.productionConfigTitle}</span>
                    </div>

                    <button
                      onClick={() => handleCopySnippet(selectedNodeSpec.productionConfigCode)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors"
                    >
                      {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSnippet ? '복사됨!' : '설정 코드 복사'}</span>
                    </button>
                  </div>

                  <pre className="p-4 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed bg-black/60 max-h-72">
                    <code>{selectedNodeSpec.productionConfigCode}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: Comparison (Before vs After) */}
      {activeView === 'comparison' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before */}
          <div className="p-6 rounded-3xl bg-rose-950/20 border-2 border-rose-900/50 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-rose-900/50">
              <div className="flex items-center gap-2 text-rose-400 font-extrabold text-base">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>{arch.beforeArchitecture.title}</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-900/40 text-rose-300 border border-rose-800">
                기존 한계
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {arch.beforeArchitecture.description}
            </p>

            <div className="space-y-2 pt-2">
              <h5 className="text-xs font-bold text-rose-300 uppercase tracking-wider font-mono">
                발생했던 병목 현상 및 리스크:
              </h5>
              <ul className="space-y-2">
                {arch.beforeArchitecture.bottlenecks.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-rose-200/90 bg-rose-950/40 p-2.5 rounded-xl border border-rose-900/40"
                  >
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* After (당근 개선) */}
          <div className="p-6 rounded-3xl bg-emerald-950/20 border-2 border-emerald-900/50 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/50">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{arch.afterArchitecture.title}</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-300 border border-emerald-800">
                당근 도입 효과
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {arch.afterArchitecture.description}
            </p>

            <div className="space-y-2 pt-2">
              <h5 className="text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono">
                달성한 정량적 성과 & 엔지니어링 개선:
              </h5>
              <ul className="space-y-2">
                {arch.afterArchitecture.improvements.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-emerald-200/90 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-900/40"
                  >
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: 5-Step Pipeline */}
      {activeView === 'pipeline' && (
        <div className="p-6 rounded-3xl bg-slate-950 border-2 border-slate-800 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>엔지니어링 실행 파이프라인 (5단계 완전 분해)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                요청 유입부터 실제 최적화 로직 및 완료까지 단계별 소요 시간과 처리 메트릭입니다.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {arch.pipelineSteps.map((step) => (
              <div
                key={step.step}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/40 flex items-center justify-center font-bold text-sm shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-orange-400 font-mono">
                        [Phase {step.step}: {step.phase}]
                      </span>
                      <h5 className="text-sm font-bold text-white">{step.action}</h5>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{step.detail}</p>
                  </div>
                </div>

                {step.durationOrMetric && (
                  <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 whitespace-nowrap self-start sm:self-center">
                    ⏱️ {step.durationOrMetric}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: Core Component Technical Specs Table */}
      {activeView === 'specs' && (
        <div className="p-6 rounded-3xl bg-slate-950 border-2 border-slate-800 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-orange-400" />
                <span>핵심 기술 컴포넌트 실무 구성표</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                실제 프로덕션 환경에 배포된 스펙, 라이브러리 버전, 파라미터 구성 내역입니다.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">컴포넌트</th>
                  <th className="py-3 px-4">역할 및 책임</th>
                  <th className="py-3 px-4">기술 스택 / 엔진</th>
                  <th className="py-3 px-4">핵심 설정값 / 파라미터</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {arch.keySpecs.map((spec, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{spec.component}</td>
                    <td className="py-3 px-4">{spec.role}</td>
                    <td className="py-3 px-4 font-mono text-cyan-300">{spec.tech}</td>
                    <td className="py-3 px-4 font-mono text-amber-300 bg-slate-950/40">{spec.keyConfig}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 5: Mermaid Code & ASCII */}
      {activeView === 'mermaid' && (
        <div className="space-y-6">
          {/* ASCII Diagram Box */}
          <div className="p-5 rounded-3xl bg-slate-950 border-2 border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>ASCII 아키텍처 다이어그램 (터미널 & 텍스트 문서용)</span>
              </div>
              <button
                onClick={handleCopyAscii}
                className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg cursor-pointer"
              >
                {copiedAscii ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAscii ? '복사됨!' : 'ASCII 복사'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900/90 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed border border-slate-800">
              <code>{arch.asciiDiagram}</code>
            </pre>
          </div>

          {/* Mermaid Code Box */}
          <div className="p-5 rounded-3xl bg-slate-950 border-2 border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <FileCode className="w-4 h-4 text-orange-400" />
                <span>Mermaid 다이어그램 원본 코드 (Notion / GitHub / Obsidian 지원)</span>
              </div>
              <button
                onClick={handleCopyMermaid}
                className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg cursor-pointer"
              >
                {copiedMermaid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMermaid ? '복사됨!' : 'Mermaid 코드 복사'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900/90 text-xs font-mono text-orange-300 overflow-x-auto leading-relaxed border border-slate-800">
              <code>{arch.mermaidCode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
