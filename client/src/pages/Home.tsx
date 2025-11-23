import React, { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { APP_TITLE } from "@/const";
import NiftyChart from "@/components/NiftyChart";
import LiveMarketMetrics from "@/components/LiveMarketMetrics";
import TechnicalLevelsComponent from "@/components/TechnicalLevels";
import EnhancedMarketSentiment from "@/components/EnhancedMarketSentiment";
import TradingRecommendations from "@/components/TradingRecommendations";
import GiftNiftyPerformance from "@/components/GiftNiftyPerformance";
import LiveComprehensiveNews from "@/components/LiveComprehensiveNews";
import EnhancedOptionsAnalysis from "@/components/EnhancedOptionsAnalysis";
import TabbedDashboard from "@/components/TabbedDashboard";
import EnhancedTradeWatchlist from "@/components/EnhancedTradeWatchlist";
import ThemeSelector from "@/components/ThemeSelector";
import {
  realTimeMarketData,
  latestLiveNews,
  generateRealTimeChartData,
  generateRealTimeGiftChartData,
} from "@/lib/liveMarketData";
import { useLiveMarketData } from "@/hooks/useLiveMarketData";
import {
  technicalLevels,
  marketFactors,
  tradingRecommendations,
  marketOutlook,
  fiiDiiData,
} from "@/lib/marketData";
import { generateOptionExpiries } from "@/lib/optionsData";
import FiiDiiData from "@/components/FiiDiiData";
import { TrendingUp, AlertTriangle, RefreshCw, Sun, Moon } from "lucide-react";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();

  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(60000); // Default 1 minute
  const [chartData, setChartData] = useState(generateRealTimeChartData());
  const [giftChartData, setGiftChartData] = useState(generateRealTimeGiftChartData());
  const [optionExpiries] = useState(generateOptionExpiries());
  
  // Fetch live market data with auto-refresh every 1 minute
  const liveData = useLiveMarketData(true, 60000);

  // Auto-refresh with configurable interval
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Refresh live data from API
    await liveData.manualRefresh();
    
    // Also refresh chart data
    setChartData(generateRealTimeChartData());
    setGiftChartData(generateRealTimeGiftChartData());
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // 24-hour format
    });
  };

  const getRefreshIntervalLabel = () => {
    if (refreshInterval === 60000) return "1 min";
    if (refreshInterval === 300000) return "5 min";
    if (refreshInterval === 1800000) return "30 min";
    return "1 min";
  };

  // Market Analysis Content
  const marketAnalysisContent = (
    <>
      {/* Live Market Metrics */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Live Market Metrics</h2>
        <LiveMarketMetrics data={realTimeMarketData} />
      </section>

      {/* Chart Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Price Movement</h2>
        <div className="bg-card text-card-foreground rounded-lg shadow-md p-6">
          <NiftyChart
            labels={chartData.hours}
            data={chartData.prices}
            title="Nifty 50 - 24 Hour Price Movement (Real-Time)"
          />
        </div>
      </section>

      {/* GIFT Nifty Performance Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">GIFT Nifty vs Nifty 50 (Live Comparison)</h2>
        <GiftNiftyPerformance
          giftData={realTimeMarketData.giftNifty as any}
          labels={giftChartData.hours}
          niftyPrices={giftChartData.niftyPrices}
          giftPrices={giftChartData.giftPrices}
        />
      </section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Technical Levels */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Technical Analysis</h2>
          <TechnicalLevelsComponent levels={technicalLevels} />
        </section>

        {/* FII/DII Data */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Institutional Activity</h2>
          <FiiDiiData
            diiNetBuy={fiiDiiData.diiNetBuy}
            fiiNetBuy={fiiDiiData.fiiNetBuy}
            totalNetBuy={fiiDiiData.totalNetBuy}
            date={fiiDiiData.date}
          />
        </section>
      </div>

      {/* Market Sentiment - Weighted & Clickable */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Market Sentiment (Weighted Analysis)</h2>
        <EnhancedMarketSentiment factors={marketFactors} />
      </section>

      {/* Trading Recommendations */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Trading Recommendations</h2>
        <TradingRecommendations recommendations={tradingRecommendations} />
      </section>

      {/* Live News Section - With Clickable Sources */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Live Market News (Verified Sources)</h2>
        <LiveComprehensiveNews news={latestLiveNews} />
      </section>
    </>
  );

  // Options Trades Content
  const optionsTradesContent = (
    <EnhancedOptionsAnalysis expiries={optionExpiries} marketFactors={marketFactors} />
  );

  // Watchlist Content
  const watchlistContent = (
    <EnhancedTradeWatchlist
      marketSentiment={marketFactors.reduce((acc, f) => acc + (f.impact === "positive" ? f.weight : f.impact === "negative" ? -f.weight : 0), 0) > 0 ? "BULLISH" : "BEARISH"}
      currentNiftyPrice={realTimeMarketData.nifty50.currentPrice}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-background border-b border-border shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{APP_TITLE}</h1>
                <p className="text-xs text-muted-foreground">Real-time Market Analysis & Options Trading</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Last Refresh Time */}
              <div className="text-right hidden md:block">
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm font-semibold text-foreground">{formatTime(lastRefresh)}</p>
              </div>
              {/* Theme Selector */}
              <ThemeSelector />
              {/* Manual Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  isRefreshing
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                }`}
                title="Refresh data manually"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
              </button>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">November 22, 2025</p>
                <p className="text-xs text-muted-foreground">4H Chart Analysis</p>
              </div>
            </div>
          </div>
          {/* Auto-refresh indicator and interval selector */}
          <div className="mt-2 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              <p className="text-xs text-muted-foreground">Auto-refresh:</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setRefreshInterval(60000)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  refreshInterval === 60000
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                1 min
              </button>
              <button
                onClick={() => setRefreshInterval(300000)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  refreshInterval === 300000
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                5 min
              </button>
              <button
                onClick={() => setRefreshInterval(1800000)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  refreshInterval === 1800000
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                30 min
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Critical Market Alert */}
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-900 dark:text-red-200">Critical Market Alert</p>
            <p className="text-sm text-red-800 dark:text-red-300 mt-1">
              <strong>AI Bubble Concerns:</strong> Global AI stocks showing cracks. Buffett Indicator at 200%+ (highest since dot-com). 
              <strong className="ml-2">Rupee Crisis:</strong> INR hits all-time low of 89.49 vs USD. 
              <strong className="ml-2">Nifty Outlook:</strong> Trading at 26,068.15 near support - monitor closely for direction.
            </p>
          </div>
        </div>

        {/* Market Overview Alert */}
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">Market Outlook</p>
          <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
            <span className="font-bold">Opening:</span> {marketOutlook.opening} | 
            <span className="font-bold ml-2">Trend:</span> {marketOutlook.intradayTrend} | 
            <span className="font-bold ml-2">Bias:</span> {marketOutlook.overallBias}
          </p>
        </div>

        {/* Tabbed Dashboard */}
        <TabbedDashboard
          marketAnalysisContent={marketAnalysisContent}
          optionsTradesContent={optionsTradesContent}
          watchlistContent={watchlistContent}
        />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white dark:text-gray-100 font-bold mb-3">About Dashboard</h3>
              <p className="text-sm">Real-time Nifty 50 analysis with GIFT Nifty tracking, sentiment-based options recommendations with Greeks analysis, live news from verified sources, and trading insights for 4H chart traders.</p>
            </div>
            <div>
              <h3 className="text-white dark:text-gray-100 font-bold mb-3">Data Sources</h3>
              <p className="text-sm">Live data from NSE, GIFT, Economic Times, Reuters, Business Standard, Moneycontrol, and LiveMint. Options confidence adjusted based on market sentiment. Auto-refreshes every 1 minute.</p>
            </div>
            <div>
              <h3 className="text-white dark:text-gray-100 font-bold mb-3">Disclaimer</h3>
              <p className="text-sm">This analysis is for educational purposes only. Options trading involves substantial risk. Always consult with a financial advisor before trading. Past performance does not guarantee future results.</p>
            </div>
          </div>
          <div className="border-t border-gray-700 dark:border-gray-800 pt-6 text-center text-sm">
            <p>© 2025 Nifty 50 Market Dashboard. All rights reserved. Last updated: {formatTime(lastRefresh)}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
