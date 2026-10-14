import React from 'react';
import { Clock, TrendingDown, ShieldAlert, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

export const StatsOverview: React.FC = () => {
  const stats = [
    {
      title: 'CI 빌드 시간 단축',
      value: '14분 → 2.1분',
      subtext: '캐시 히트율 99.4% 달성',
      badge: '-85% 단축',
      icon: Clock,
    },
    {
      title: 'EKS 노드 프로비저닝',
      value: '180초 → 35초',
      subtext: 'Karpenter 및 Spot 빈패킹',
      badge: '비용 -28% 절감',
      icon: Cpu,
    },
    {
      title: '평균 장애 복구 (MTTR)',
      value: '45분 → 8분',
      subtext: 'Grafana 걷어내고 에이전트 얼럿',
      badge: '-82% 급감',
      icon: TrendingDown,
    },
    {
      title: '정적 시크릿 키 제거',
      value: '450개 → 0개',
      subtext: 'OIDC STS 및 EMU 계정 이관',
      badge: '보안 100% 달성',
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-md hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm font-bold text-slate-300">{stat.title}</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/30 shrink-0">
                {stat.badge}
              </span>
            </div>

            <div className="mb-2">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">{stat.value}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400 pt-2 border-t border-slate-800/80">
              <Icon className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="leading-snug break-keep">{stat.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
