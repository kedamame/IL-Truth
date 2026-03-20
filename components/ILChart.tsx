'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { ChartDataPoint } from '@/types';
import { t, Lang } from '@/lib/i18n';

interface Props {
  data: ChartDataPoint[];
  currentRatio: number;
  lang: Lang;
}

export default function ILChart({ data, currentRatio, lang }: Props) {
  const tx = t[lang];
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 mb-4">
      <h3 className="text-sm font-semibold text-orange-400 mb-3">{tx.chartTitle}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="priceRatio"
            tickFormatter={(v) => (Number.isFinite(v) ? `${v.toFixed(1)}x` : '—')}
            stroke="#9ca3af"
            tick={{ fontSize: 10 }}
            label={{
              value: tx.chartXAxis,
              position: 'insideBottomRight',
              offset: -5,
              fontSize: 10,
              fill: '#9ca3af',
            }}
          />
          <YAxis
            tickFormatter={(v) => (Number.isFinite(v) ? `${v.toFixed(1)}%` : '—')}
            stroke="#9ca3af"
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            formatter={(v) => {
              const n = Number(v);
              return [Number.isFinite(n) ? `${n.toFixed(2)}%` : '—', 'IL'];
            }}
            labelFormatter={(l) => {
              const n = Number(l);
              return Number.isFinite(n) ? `${n.toFixed(2)}x` : '—';
            }}
            contentStyle={{
              background: '#1f2937',
              border: '1px solid #374151',
              borderRadius: 8,
            }}
          />
          <ReferenceLine x={1} stroke="#6b7280" strokeDasharray="4 4" />
          <ReferenceLine
            x={currentRatio}
            stroke="#f97316"
            strokeDasharray="4 4"
            label={{ value: 'Now', fill: '#f97316', fontSize: 10 }}
          />
          <Line
            type="monotone"
            dataKey="ilPercent"
            stroke="#ef4444"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
