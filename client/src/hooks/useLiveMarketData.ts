import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { TradingRecommendation } from '@/lib/marketData';

export interface LiveMarketData {
  nifty: {
    price: number;
    change: number;
    changePercent: number;
    dayHigh: number;
    dayLow: number;
    previousClose: number;
    volume: number;
    timestamps: number[];
    prices: number[];
  } | null;
  bankNifty: {
    price: number;
    change: number;
    changePercent: number;
    dayHigh: number;
    dayLow: number;
    previousClose: number;
  } | null;
  usdInr: {
    price: number;
    change: number;
    changePercent: number;
  } | null;
  lastUpdated: string;
  isLoading: boolean;
  error: string | null;
}

export function useLiveMarketData(autoRefresh: boolean = true, refreshInterval: number = 60000) {
  const [data, setData] = useState<LiveMarketData>({
    nifty: null,
    bankNifty: null,
    usdInr: null,
    lastUpdated: new Date().toISOString(),
    isLoading: true,
    error: null,
  });

  const { data: allMarketData, isLoading, error, refetch } = trpc.marketData.getAllMarketData.useQuery(
    undefined,
    {
      refetchInterval: autoRefresh ? refreshInterval : false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (allMarketData) {
      setData({
        nifty: allMarketData.nifty,
        bankNifty: allMarketData.bankNifty,
        usdInr: allMarketData.usdInr,
        lastUpdated: allMarketData.timestamp,
        isLoading: false,
        error: null,
      });
    }
  }, [allMarketData]);

  useEffect(() => {
    if (error) {
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch market data',
      }));
    }
  }, [error]);

  const manualRefresh = async () => {
    await refetch();
  };

  return {
    ...data,
    manualRefresh,
  };
}

export function useNiftyData(autoRefresh: boolean = true, refreshInterval: number = 60000) {
  const { data, isLoading, error, refetch } = trpc.marketData.getNiftyData.useQuery(
    undefined,
    {
      refetchInterval: autoRefresh ? refreshInterval : false,
      refetchOnWindowFocus: false,
    }
  );

  return {
    data,
    isLoading,
    error: error?.message || null,
    refetch,
  };
}

export function useBankNiftyData(autoRefresh: boolean = true, refreshInterval: number = 60000) {
  const { data, isLoading, error, refetch } = trpc.marketData.getBankNiftyData.useQuery(
    undefined,
    {
      refetchInterval: autoRefresh ? refreshInterval : false,
      refetchOnWindowFocus: false,
    }
  );

  return {
    data,
    isLoading,
    error: error?.message || null,
    refetch,
  };
}

export function useUsdInrRate(autoRefresh: boolean = true, refreshInterval: number = 60000) {
  const { data, isLoading, error, refetch } = trpc.marketData.getUsdInrRate.useQuery(
    undefined,
    {
      refetchInterval: autoRefresh ? refreshInterval : false,
      refetchOnWindowFocus: false,
    }
  );

  return {
    data,
    isLoading,
    error: error?.message || null,
    refetch,
  };
}


export const useLiveOptionData = (recommendations: TradingRecommendation[]) => {
  const activeRecommendations = recommendations.filter(rec => rec.type !== "no-trade");

  const queryInput = activeRecommendations.map(rec => ({
    instrument: rec.instrument,
    strikePrice: rec.strikePrice,
    optionType: rec.optionType,
    expiryDate: rec.expiryDate,
  }));

  return trpc.optionsChain.getOptionDataForRecommendations.useQuery({
    recommendations: queryInput,
  }, {
    enabled: activeRecommendations.length > 0,
    refetchInterval: 5000, // Refetch every 5 seconds
    select: (data) => {
      // Map the fetched data back to the original recommendations
      return recommendations.map(rec => {
        if (rec.type === "no-trade") {
          return rec;
        }
        const match = data.find(d =>
          d.instrument === rec.instrument &&
          d.strikePrice === rec.strikePrice &&
          d.optionType === rec.optionType &&
          d.expiryDate === rec.expiryDate
        );

        if (match && match.currentPremium !== null) {
          return {
            ...rec,
            currentPremium: match.currentPremium,
            expiryDate: match.actualExpiryDate || rec.expiryDate, // Update expiry date with accurate one
          };
        }
        return rec;
      });
    }
  });
};
