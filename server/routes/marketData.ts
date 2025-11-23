import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { callDataApi } from "../_core/dataApi";

// In-memory cache for market data
interface CachedData {
  data: any;
  timestamp: number;
}

const cache: Record<string, CachedData> = {};
const CACHE_DURATION = 60 * 1000; // 1 minute cache

function isCacheValid(key: string): boolean {
  const cached = cache[key];
  if (!cached) return false;
  return Date.now() - cached.timestamp < CACHE_DURATION;
}

function getFromCache(key: string): any | null {
  if (isCacheValid(key)) {
    return cache[key].data;
  }
  return null;
}

function setCache(key: string, data: any): void {
  cache[key] = {
    data,
    timestamp: Date.now(),
  };
}

async function fetchStockData(symbol: string, region: string = 'IN') {
  try {
    const response = await callDataApi("YahooFinance/get_stock_chart", {
      query: {
        symbol,
        region,
        interval: '5m',
        range: '1d',
      },
    });

    if (response && typeof response === 'object' && 'chart' in response) {
      const chart = (response as any).chart;
      if (chart && chart.result && chart.result[0]) {
        const result = chart.result[0];
      const meta = result.meta;
      const timestamps = result.timestamp || [];
      const quotes = result.indicators?.quote?.[0] || {};

        return {
          symbol: meta.symbol,
          price: meta.regularMarketPrice,
          previousClose: meta.previousClose,
          dayHigh: meta.regularMarketDayHigh,
          dayLow: meta.regularMarketDayLow,
          volume: meta.regularMarketVolume,
          currency: meta.currency,
          exchange: meta.exchangeName,
          change: meta.regularMarketPrice - meta.previousClose,
          changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
          timestamps,
          prices: quotes.close || [],
          highs: quotes.high || [],
          lows: quotes.low || [],
          opens: quotes.open || [],
          volumes: quotes.volume || [],
        };
      }
    }

    return null;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
}

export const marketDataRouter = router({
  // Get live Nifty 50 data
  getNiftyData: publicProcedure.query(async () => {
    const cacheKey = 'nifty50';
    const cached = getFromCache(cacheKey);
    if (cached) {
      return { ...cached, fromCache: true };
    }

    const data = await fetchStockData('^NSEI', 'IN');
    if (data) {
      setCache(cacheKey, data);
      return { ...data, fromCache: false };
    }

    throw new Error('Failed to fetch Nifty 50 data');
  }),

  // Get live Bank Nifty data
  getBankNiftyData: publicProcedure.query(async () => {
    const cacheKey = 'banknifty';
    const cached = getFromCache(cacheKey);
    if (cached) {
      return { ...cached, fromCache: true };
    }

    const data = await fetchStockData('^NSEBANK', 'IN');
    if (data) {
      setCache(cacheKey, data);
      return { ...data, fromCache: false };
    }

    throw new Error('Failed to fetch Bank Nifty data');
  }),

  // Get USD/INR exchange rate
  getUsdInrRate: publicProcedure.query(async () => {
    const cacheKey = 'usdinr';
    const cached = getFromCache(cacheKey);
    if (cached) {
      return { ...cached, fromCache: true };
    }

    const data = await fetchStockData('USDINR=X', 'IN');
    if (data) {
      setCache(cacheKey, data);
      return { ...data, fromCache: false };
    }

    throw new Error('Failed to fetch USD/INR rate');
  }),

  // Get all market data in one call
  getAllMarketData: publicProcedure.query(async () => {
    const [nifty, bankNifty, usdInr] = await Promise.all([
      fetchStockData('^NSEI', 'IN'),
      fetchStockData('^NSEBANK', 'IN'),
      fetchStockData('USDINR=X', 'IN'),
    ]);

    return {
      nifty: nifty || null,
      bankNifty: bankNifty || null,
      usdInr: usdInr || null,
      timestamp: new Date().toISOString(),
    };
  }),

  // Get specific stock data
  getStockData: publicProcedure
    .input(
      z.object({
        symbol: z.string(),
        region: z.string().optional().default('IN'),
      })
    )
    .query(async ({ input }) => {
      const cacheKey = `stock_${input.symbol}_${input.region}`;
      const cached = getFromCache(cacheKey);
      if (cached) {
        return { ...cached, fromCache: true };
      }

      const data = await fetchStockData(input.symbol, input.region);
      if (data) {
        setCache(cacheKey, data);
        return { ...data, fromCache: false };
      }

      throw new Error(`Failed to fetch data for ${input.symbol}`);
    }),
});
