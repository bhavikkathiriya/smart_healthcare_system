import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, subtitle, icon: Icon, color, trend, trendValue }) {
  const colorMap = {
    blue: { bg: 'bg-primary-50', icon: 'text-primary-600', iconBg: 'bg-primary-100', border: 'border-primary-100' },
    teal: { bg: 'bg-teal-50', icon: 'text-teal-600', iconBg: 'bg-teal-100', border: 'border-teal-100' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', iconBg: 'bg-purple-100', border: 'border-purple-100' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', iconBg: 'bg-orange-100', border: 'border-orange-100' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', iconBg: 'bg-emerald-100', border: 'border-emerald-100' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', iconBg: 'bg-red-100', border: 'border-red-100' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className={`stat-card border ${c.border}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-white leading-none">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{subtitle}</p>}
        </div>
        <div className={`${c.iconBg} p-3 rounded-2xl`}>
          <Icon size={22} className={c.icon} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-slate-50">
          {trend === 'up' ? (
            <><TrendingUp size={14} className="text-emerald-500" /><span className="text-xs font-semibold text-emerald-600">{trendValue}</span></>
          ) : (
            <><TrendingDown size={14} className="text-red-500" /><span className="text-xs font-semibold text-red-600">{trendValue}</span></>
          )}
          <span className="text-xs text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
}
