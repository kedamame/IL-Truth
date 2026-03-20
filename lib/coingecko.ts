import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const TOKEN_ID_MAP: Record<string, string> = {
  ETH: 'ethereum',
  WETH: 'weth',
  BTC: 'bitcoin',
  WBTC: 'wrapped-bitcoin',
  USDC: 'usd-coin',
  USDT: 'tether',
  DAI: 'dai',
  SOL: 'solana',
  AERO: 'aerodrome-finance',
  OP: 'optimism',
  ARB: 'arbitrum',
  MATIC: 'matic-network',
  BNB: 'binancecoin',
  CBBTC: 'coinbase-wrapped-btc',
  VIRTUAL: 'virtual-protocol',
};

export async function getTokenPricesUSD(coingeckoIds: string[]): Promise<Record<string, number>> {
  const ids = coingeckoIds.join(',');
  const res = await axios.get(`${BASE_URL}/simple/price`, {
    params: { ids, vs_currencies: 'usd' },
  });
  const result: Record<string, number> = {};
  for (const id of coingeckoIds) {
    result[id] = res.data[id]?.usd ?? 0;
  }
  return result;
}

// レート制限対策: 30秒キャッシュ
const cache: Map<string, { value: number; ts: number }> = new Map();
const CACHE_TTL = 30_000;

export async function getCachedPrice(coingeckoId: string): Promise<number> {
  const now = Date.now();
  const cached = cache.get(coingeckoId);
  if (cached && now - cached.ts < CACHE_TTL) return cached.value;

  const prices = await getTokenPricesUSD([coingeckoId]);
  cache.set(coingeckoId, { value: prices[coingeckoId], ts: now });
  return prices[coingeckoId];
}
