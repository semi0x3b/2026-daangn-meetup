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
      color: 'from-amber-500/20 to-orange-500/10',
      textColor: 'text-amber-400',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      title: 'EKS 노드 프로비저닝',
      value: '180초 → 35초',
      subtext: 'Karpenter 및 Spot 빈패킹',
      badge: '비용 -28% 절감',
      icon: Cpu,
      color: 'from-emerald-500/20 to-teal-500/10',
      textColor: 'text-emerald-400',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      title: '평균 장애 복구 (MTTR)',
      value: '45분 → 8분',
      subtext: 'Grafana 걷어내고 에이전트 얼럿',
      badge: '-82% 급감',
      icon: TrendingDown,
      color: 'from-blue-500/20 to-indigo-500/10',
      textColor: 'text-blue-400',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      title: '정적 시크릿 키 제거',
      value: '450개 → 0개',
      subtext: 'OIDC STS 및 EMU 계정 이관',
      badge: '보안 100% 달성',
      icon: ShieldAlert,
      color: 'from-rose-500/20 to-pink-500/10',
      textColor: 'text-rose-400',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg shadow-black/20 hover:border-slate-700 transition-all"
          >
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} blur-2xl pointer-events-none`} />
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">{stat.title}</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${stat.badgeColor}`}>
                {stat.badge}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-black text-white tracking-tight">{stat.value}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Icon className={`w-3.5 h-3.5 ${stat.textColor} shrink-0`} />
              <span className="truncate">{stat.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
