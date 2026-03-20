import { ILResult } from '@/types';
import { t, Lang } from '@/lib/i18n';

interface Props {
  result: ILResult;
  lang: Lang;
  protocol: string;
}

function fmt(v: number, decimals = 2): string {
  if (!Number.isFinite(v)) return '—';
  return v.toLocaleString('en-US', { maximumFractionDigits: decimals });
}

function pct(v: number): string {
  if (!Number.isFinite(v)) return '—';
  return `${v > 0 ? '+' : ''}${fmt(v)}%`;
}

function usd(v: number): string {
  if (!Number.isFinite(v)) return '—';
  return `${v >= 0 ? '+' : ''}$${fmt(Math.abs(v))}`;
}

export default function ResultCard({ result, lang }: Props) {
  const tx = t[lang];

  const rows = [
    { label: tx.currentLPValue, value: `$${fmt(result.currentValueLP)}`, color: 'text-white' },
    { label: tx.hodlValue, value: `$${fmt(result.currentValueHODL)}`, color: 'text-gray-300' },
    { label: tx.ilAmount, value: usd(result.ilUSD), color: 'text-red-400' },
    { label: tx.ilPercent, value: pct(result.ilPercent), color: 'text-red-400' },
    {
      label: tx.vsHODL,
      value: pct(result.vsHODLPercent),
      color: result.vsHODLPercent >= 0 ? 'text-green-400' : 'text-red-400',
    },
    {
      label: tx.realizedPnL,
      value: `${usd(result.realizedPnLUSD)} (${pct(result.realizedPnLPercent)})`,
      color: result.realizedPnLUSD >= 0 ? 'text-green-400' : 'text-red-400',
    },
  ];

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-orange-400">{tx.resultTitle}</h2>
        {result.outOfRange && (
          <span className="text-xs bg-yellow-900/60 text-yellow-300 px-2 py-1 rounded-full">
            {tx.outOfRange}
          </span>
        )}
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex justify-between items-center py-1 border-b border-gray-800 last:border-0"
          >
            <span className="text-xs text-gray-400">{row.label}</span>
            <span className={`text-sm font-mono font-medium ${row.color}`}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
