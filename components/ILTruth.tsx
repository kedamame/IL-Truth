'use client';

import { useState } from 'react';
import { PoolInput, ILResult, Chain, Protocol, RangeMode } from '@/types';
import { calculateIL, generateChartData } from '@/lib/il-calculator';
import { TOKEN_ID_MAP } from '@/lib/coingecko';
import { t, Lang } from '@/lib/i18n';
import ResultCard from './ResultCard';
import ILChart from './ILChart';
import ShareButton from './ShareButton';

const PROTOCOLS: { value: Protocol; label: string; chains: Chain[] }[] = [
  { value: 'uniswap-v2', label: 'Uniswap V2', chains: ['ethereum', 'base'] },
  { value: 'uniswap-v3', label: 'Uniswap V3', chains: ['ethereum', 'base'] },
  { value: 'aerodrome', label: 'Aerodrome', chains: ['base'] },
  { value: 'raydium', label: 'Raydium', chains: ['solana'] },
];

export default function ILTruth() {
  const [lang, setLang] = useState<Lang>('en');
  const tx = t[lang];

  const [protocol, setProtocol] = useState<Protocol>('uniswap-v2');
  const [chain, setChain] = useState<Chain>('ethereum');
  const [token0Symbol, setToken0Symbol] = useState('ETH');
  const [token1Symbol, setToken1Symbol] = useState('USDC');
  const [entryPrice, setEntryPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [token0Amount, setToken0Amount] = useState('');
  const [token1Amount, setToken1Amount] = useState('');
  const [feesEarned, setFeesEarned] = useState('');
  const [rangeMode, setRangeMode] = useState<RangeMode>('full');
  const [priceLower, setPriceLower] = useState('');
  const [priceUpper, setPriceUpper] = useState('');
  const [result, setResult] = useState<ILResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [error, setError] = useState('');

  const isV3 = protocol === 'uniswap-v3';
  const availableProtocols = PROTOCOLS.filter((p) => p.chains.includes(chain));

  const handleFetchPrice = async () => {
    const id0 = TOKEN_ID_MAP[token0Symbol.toUpperCase()];
    const id1 = TOKEN_ID_MAP[token1Symbol.toUpperCase()];
    if (!id0 || !id1) {
      setError('Token symbol not found in CoinGecko map. Please enter price manually.');
      return;
    }
    setError('');
    setPriceLoading(true);
    try {
      const res = await fetch(`/api/price?ids=${id0},${id1}`);
      const data = await res.json();
      const p0 = data[id0]?.usd;
      const p1 = data[id1]?.usd;
      if (p0 && p1) {
        setCurrentPrice((p0 / p1).toFixed(6));
      }
    } catch {
      setError('Failed to fetch price. Please enter manually.');
    } finally {
      setPriceLoading(false);
    }
  };

  const handleCalculate = async () => {
    setError('');
    const ep = parseFloat(entryPrice);
    const cp = parseFloat(currentPrice);
    const t0 = parseFloat(token0Amount);
    const t1 = parseFloat(token1Amount);
    if (!Number.isFinite(ep) || ep <= 0 || !Number.isFinite(cp) || cp <= 0 ||
        !Number.isFinite(t0) || t0 <= 0 || !Number.isFinite(t1) || t1 <= 0) {
      setError('Please enter valid positive numbers for all required fields.');
      return;
    }
    setLoading(true);
    try {
      const id1 = TOKEN_ID_MAP[token1Symbol.toUpperCase()];
      const id0 = TOKEN_ID_MAP[token0Symbol.toUpperCase()];
      let token0PriceUSD = 1;
      let token1PriceUSD = 1;

      if (id0 || id1) {
        const ids = [id0, id1].filter(Boolean).join(',');
        const res = await fetch(`/api/price?ids=${ids}`);
        const data = await res.json();
        if (id1) token1PriceUSD = data[id1]?.usd ?? 1;
        if (id0) token0PriceUSD = data[id0]?.usd ?? parseFloat(currentPrice) * token1PriceUSD;
      }

      const input: PoolInput = {
        protocol,
        chain,
        token0Symbol,
        token1Symbol,
        token0CoingeckoId: TOKEN_ID_MAP[token0Symbol.toUpperCase()] ?? '',
        token1CoingeckoId: TOKEN_ID_MAP[token1Symbol.toUpperCase()] ?? '',
        entryPrice: parseFloat(entryPrice),
        currentPrice: parseFloat(currentPrice),
        token0Amount: parseFloat(token0Amount),
        token1Amount: parseFloat(token1Amount),
        feesEarnedUSD: feesEarned ? parseFloat(feesEarned) : 0,
        rangeMode,
        priceLower: priceLower ? parseFloat(priceLower) : undefined,
        priceUpper: priceUpper ? parseFloat(priceUpper) : undefined,
      };

      const calcResult = calculateIL(input, token0PriceUSD, token1PriceUSD);
      setResult(calcResult);
    } catch {
      setError('Calculation error. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const entryPriceNum = parseFloat(entryPrice);
  const validEntryPrice = Number.isFinite(entryPriceNum) && entryPriceNum > 0;
  const chartData = validEntryPrice
    ? generateChartData(
        rangeMode,
        priceLower ? parseFloat(priceLower) : undefined,
        priceUpper ? parseFloat(priceUpper) : undefined,
        entryPriceNum
      )
    : [];

  const castText = result
    ? tx.castText(
        `${result.ilPercent.toFixed(2)}%`,
        `${result.vsHODLPercent > 0 ? '+' : ''}${result.vsHODLPercent.toFixed(2)}%`,
        PROTOCOLS.find((p) => p.value === protocol)?.label ?? protocol
      )
    : '';

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 max-w-lg mx-auto">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-orange-400">{tx.appTitle}</h1>
          <p className="text-sm text-gray-400">{tx.appSubtitle}</p>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'ja' : 'en')}
          className="text-xs border border-gray-600 px-3 py-1 rounded-full hover:bg-gray-800"
        >
          {tx.langToggle}
        </button>
      </div>

      {/* チェーン・プロトコル選択 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">{tx.chainLabel}</label>
          <select
            value={chain}
            onChange={(e) => {
              const c = e.target.value as Chain;
              setChain(c);
              const available = PROTOCOLS.filter((p) => p.chains.includes(c));
              if (available.length > 0) setProtocol(available[0].value);
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="ethereum">Ethereum</option>
            <option value="base">Base</option>
            <option value="solana">Solana</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">{tx.protocolLabel}</label>
          <select
            value={protocol}
            onChange={(e) => setProtocol(e.target.value as Protocol)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
          >
            {availableProtocols.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* V3 レンジタイプ */}
      {isV3 && (
        <div className="mb-4">
          <label className="text-xs text-gray-400 mb-1 block">{tx.rangeModeLabel}</label>
          <div className="flex gap-2">
            {(['full', 'concentrated'] as RangeMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setRangeMode(mode)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rangeMode === mode
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {mode === 'full' ? tx.fullRange : tx.concentrated}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* トークン入力 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">{tx.token0Label}</label>
          <input
            value={token0Symbol}
            onChange={(e) => setToken0Symbol(e.target.value.toUpperCase())}
            placeholder="ETH"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">{tx.token1Label}</label>
          <input
            value={token1Symbol}
            onChange={(e) => setToken1Symbol(e.target.value.toUpperCase())}
            placeholder="USDC"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* 価格入力 */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">{tx.entryPriceLabel}</label>
          <input
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            placeholder="3000"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">{tx.currentPriceLabel}</label>
          <div className="flex gap-1">
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              placeholder="2500"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={handleFetchPrice}
              disabled={priceLoading}
              className="bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded-lg text-xs whitespace-nowrap disabled:opacity-50"
            >
              {priceLoading ? '...' : '↻'}
            </button>
          </div>
        </div>
      </div>

      {/* V3 集中流動性レンジ */}
      {isV3 && rangeMode === 'concentrated' && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">{tx.priceLowerLabel}</label>
            <input
              type="number"
              value={priceLower}
              onChange={(e) => setPriceLower(e.target.value)}
              placeholder="2000"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">{tx.priceUpperLabel}</label>
            <input
              type="number"
              value={priceUpper}
              onChange={(e) => setPriceUpper(e.target.value)}
              placeholder="4000"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}

      {/* 数量・フィー入力 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">{tx.token0AmountLabel}</label>
          <input
            type="number"
            value={token0Amount}
            onChange={(e) => setToken0Amount(e.target.value)}
            placeholder="1.0"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">{tx.token1AmountLabel}</label>
          <input
            type="number"
            value={token1Amount}
            onChange={(e) => setToken1Amount(e.target.value)}
            placeholder="3000"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="text-xs text-gray-400 mb-1 block">{tx.feesLabel}</label>
        <input
          type="number"
          value={feesEarned}
          onChange={(e) => setFeesEarned(e.target.value)}
          placeholder="0"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* エラー */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded-lg text-sm text-red-300">
          {error}
        </div>
      )}

      {/* 計算ボタン */}
      <button
        onClick={handleCalculate}
        disabled={loading || !entryPrice || !currentPrice || !token0Amount || !token1Amount}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl mb-6 transition-colors"
      >
        {loading ? '...' : tx.calculateBtn}
      </button>

      {/* 結果表示 */}
      {result && (
        <>
          <ResultCard
            result={result}
            lang={lang}
            protocol={PROTOCOLS.find((p) => p.value === protocol)?.label ?? protocol}
          />
          <ILChart
            data={chartData}
            currentRatio={parseFloat(currentPrice) / parseFloat(entryPrice)}
            lang={lang}
          />
          <ShareButton castText={castText} lang={lang} />
        </>
      )}
    </div>
  );
}
