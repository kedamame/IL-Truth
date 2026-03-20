import { PoolInput, ILResult, ChartDataPoint, RangeMode } from '@/types';

/**
 * Uniswap V2 / Aerodrome / Raydium (フルレンジ) の IL 計算
 * 公式: IL = 2√k/(1+k) - 1  where k = currentPrice / entryPrice
 */
export function calcILFullRange(k: number): number {
  return (2 * Math.sqrt(k)) / (1 + k) - 1;
}

/**
 * Uniswap V3 集中流動性の IL 計算
 * priceLower, priceUpper: レンジ境界 (token1 建て)
 * entryPrice, currentPrice: token1 建て
 */
export function calcILConcentrated(
  entryPrice: number,
  currentPrice: number,
  priceLower: number,
  priceUpper: number
): number {
  // アウトオブレンジ: 片方のトークンのみ保持
  if (currentPrice <= priceLower) {
    const valueLP = currentPrice / entryPrice;
    return valueLP - 1;
  }
  if (currentPrice >= priceUpper) {
    const valueLP = Math.sqrt(priceUpper / entryPrice);
    return valueLP - 1;
  }

  // レンジ内: 集中流動性 IL 計算
  const sqrtPa = Math.sqrt(priceLower);
  const sqrtPb = Math.sqrt(priceUpper);
  const sqrtP0 = Math.sqrt(entryPrice);
  const sqrtP = Math.sqrt(currentPrice);

  const valueLP =
    (sqrtP - sqrtPa + (1 / sqrtP - 1 / sqrtPb) * currentPrice) /
    (sqrtP0 - sqrtPa + (1 / sqrtP0 - 1 / sqrtPb) * entryPrice);

  const valueHODL = (currentPrice / entryPrice + 1) / 2;

  return valueLP / valueHODL - 1;
}

/**
 * メイン計算関数
 */
export function calculateIL(
  input: PoolInput,
  token0PriceUSD: number,
  token1PriceUSD: number
): ILResult {
  const {
    entryPrice,
    currentPrice,
    token0Amount,
    token1Amount,
    rangeMode,
    priceLower,
    priceUpper,
    feesEarnedUSD = 0,
  } = input;

  const entryValueUSD =
    token0Amount * (entryPrice * token1PriceUSD) + token1Amount * token1PriceUSD;

  const k = currentPrice / entryPrice;

  let ilPercent: number;
  let outOfRange: boolean | undefined;

  if (
    rangeMode === 'concentrated' &&
    priceLower !== undefined &&
    priceUpper !== undefined
  ) {
    ilPercent = calcILConcentrated(entryPrice, currentPrice, priceLower, priceUpper);
    outOfRange = currentPrice < priceLower || currentPrice > priceUpper;
  } else {
    ilPercent = calcILFullRange(k);
  }

  const currentValueHODL =
    token0Amount * currentPrice * token1PriceUSD + token1Amount * token1PriceUSD;

  const currentValueLP = currentValueHODL * (1 + ilPercent);

  const ilUSD = currentValueLP - currentValueHODL;

  const vsHODLUSD = currentValueLP - currentValueHODL + feesEarnedUSD;
  const vsHODLPercent = vsHODLUSD / currentValueHODL;

  const realizedPnLUSD = currentValueLP - entryValueUSD + feesEarnedUSD;
  const realizedPnLPercent = realizedPnLUSD / entryValueUSD;

  return {
    currentValueLP,
    currentValueHODL,
    entryValueUSD,
    ilUSD,
    ilPercent: ilPercent * 100,
    realizedPnLUSD,
    realizedPnLPercent: realizedPnLPercent * 100,
    vsHODLUSD,
    vsHODLPercent: vsHODLPercent * 100,
    outOfRange,
  };
}

/**
 * グラフ用データ生成
 * 価格比率 0.1x〜10x の範囲で IL% を計算
 */
export function generateChartData(
  rangeMode: RangeMode,
  priceLower?: number,
  priceUpper?: number,
  entryPrice = 1
): ChartDataPoint[] {
  const points: ChartDataPoint[] = [];
  const ratios = Array.from({ length: 200 }, (_, i) => 0.1 + i * 0.0995);

  for (const ratio of ratios) {
    const currentPrice = entryPrice * ratio;
    let ilPercent: number;

    if (rangeMode === 'concentrated' && priceLower !== undefined && priceUpper !== undefined) {
      ilPercent = calcILConcentrated(entryPrice, currentPrice, priceLower, priceUpper) * 100;
    } else {
      ilPercent = calcILFullRange(ratio) * 100;
    }

    points.push({ priceRatio: ratio, ilPercent });
  }

  return points;
}
