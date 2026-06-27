import { useState, useEffect } from 'react';
import DarkCard from '@/components/ui/DarkCard';
import api from '@/utils/api';

function GaugeRing({ score }) {
  return (
    <div className="relative w-[136px] h-[136px] mx-auto mb-3">
      <svg width="136" height="136" viewBox="0 0 136 136">
        <circle
          cx="68" cy="68" r="52"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="13"
        />
        <circle
          cx="68" cy="68" r="52"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="13"
          strokeDasharray="213 327"
          strokeDashoffset="82"
          strokeLinecap="round"
          transform="rotate(-90 68 68)"
        />
        <circle
          cx="68" cy="68" r="52"
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="13"
          strokeDasharray="50 327"
          strokeDashoffset="-131"
          strokeLinecap="round"
          transform="rotate(-90 68 68)"
        />
        <circle
          cx="68" cy="68" r="52"
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="13"
          strokeDasharray="64 327"
          strokeDashoffset="-181"
          strokeLinecap="round"
          transform="rotate(-90 68 68)"
        />
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1D9E75" />
            <stop offset="100%" stopColor="#0F6E56" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-6xl font-bold text-white leading-none tracking-tight">
          {score}
        </div>
        <div className="text-2xs text-white/35 mt-px">/ 100 score</div>
      </div>
    </div>
  );
}

function LegendRow({ label, value, color }) {
  const dotStyle = color.startsWith('rgba')
    ? { background: color, border: color === 'rgba(255,255,255,0.12)' ? '1px solid rgba(255,255,255,0.18)' : 'none' }
    : { background: color };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-xs-plus text-white/50">
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={dotStyle} />
        {label}
      </div>
      <div className="flex-1 h-[2.5px] bg-white/[0.06] rounded-sm mx-2 overflow-hidden">
        <div
          className="h-full rounded-sm"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <div className="text-xs-plus font-semibold text-white/80">{value}%</div>
    </div>
  );
}

export default function OrgProductivityScore({ from: propFrom, to: propTo }) {
  const [data, setData] = useState({
    score: 0,
    target: 80,
    changePercent: 0,
    period: 'Today · All Teams',
    breakdown: [
      { label: 'Productive', value: 0, color: '#1D9E75' },
      { label: 'Idle', value: 0, color: 'rgba(255,255,255,0.28)' },
      { label: 'Unproductive', value: 0, color: 'rgba(255,255,255,0.12)' },
    ],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const params = new URLSearchParams();
        if (propFrom) params.set('from', propFrom instanceof Date ? propFrom.toISOString().slice(0, 10) : propFrom);
        if (propTo) params.set('to', propTo instanceof Date ? propTo.toISOString().slice(0, 10) : propTo);
        const qs = params.toString() ? `?${params}` : '';
        const res = await api.get(`/api/client/dashboard/stats${qs}`);
        const stats = res.data;

        const grandTotal = (stats.totalProductiveSeconds || 0) + (stats.totalIdleSeconds || 0)
          + (stats.totalUnproductiveSeconds || 0) + (stats.totalNeutralSeconds || 0);
        const prodPct = grandTotal > 0 ? Math.round((stats.totalProductiveSeconds / grandTotal) * 100) : 0;
        const idlePct = grandTotal > 0 ? Math.round((stats.totalIdleSeconds / grandTotal) * 100) : 0;
        const unprodPct = grandTotal > 0 ? Math.round((stats.totalUnproductiveSeconds / grandTotal) * 100) : 0;

        const fromStr = propFrom ? (propFrom instanceof Date ? propFrom : new Date(propFrom)).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
        const toStr = propTo ? (propTo instanceof Date ? propTo : new Date(propTo)).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
        const period = fromStr && toStr && fromStr !== toStr ? `${fromStr} – ${toStr} · All Teams` : (fromStr ? `${fromStr} · All Teams` : 'Today · All Teams');

        const score = Math.round(stats.avgProductivityScore || 0);
        const target = 80;

        setData({
          score,
          target,
          changePercent: score - target,
          period,
          breakdown: [
            { label: 'Productive', value: prodPct, color: '#1D9E75' },
            { label: 'Idle', value: idlePct, color: 'rgba(255,255,255,0.28)' },
            { label: 'Unproductive', value: unprodPct, color: 'rgba(255,255,255,0.12)' },
          ],
        });
      } catch (err) {
        console.error('Error loading org productivity score:', err);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [propFrom, propTo]);

  return (
    <DarkCard className="p-5 flex flex-col">
      <h3 className="text-md font-semibold text-white/90 mb-0.5">
        Org Productivity Score
      </h3>
      <p className="text-xs text-white/30 mb-3">{data.period}</p>

      <GaugeRing score={data.score} />

      <div className="flex flex-col gap-[7px] w-full">
        {data.breakdown.map((item) => (
          <LegendRow
            key={item.label}
            label={item.label}
            value={item.value}
            color={item.color}
          />
        ))}
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex justify-between">
        <span className="text-2xs-plus text-white/25">Target: {data.target}%</span>
      </div>
    </DarkCard>
  );
}

