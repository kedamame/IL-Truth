export type Chain = 'ethereum' | 'base' | 'solana';

export type Protocol =
  | 'uniswap-v2'
  | 'uniswap-v3'
  | 'aerodrome'
  | 'raydium';

export type RangeMode = 'full' | 'concentrated';

export interface PoolInput {
  protocol: Protocol;
  chain: Chain;
  token0Symbol: string;
  token1Symbol: string;
  token0CoingeckoId: string;
  token1CoingeckoId: string;
  entryPrice: number;     // token0 の entryPrice in token1
  currentPrice: number;   // token0 の currentPrice in token1
  token0Amount: number;   // エントリー時の token0 の量
  token1Amount: number;   // エントリー時の token1 の量
  rangeMode: RangeMode;
  priceLower?: number;
  priceUpper?: number;
  feesEarnedUSD?: number;
}

export interface ILResult {
  currentValueLP: number;
  currentValueHODL: number;
  entryValueUSD: number;
  ilUSD: number;
  ilPercent: number;
  realizedPnLUSD: number;
  realizedPnLPercent: number;
  vsHODLUSD: number;
  vsHODLPercent: number;
  outOfRange?: boolean;
}

export interface ChartDataPoint {
  priceRatio: number;
  ilPercent: number;
}
