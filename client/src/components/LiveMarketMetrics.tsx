import React from "react";
import { RealTimeMarketData } from "@/lib/liveMarketData";
import { TrendingUp, TrendingDown, AlertCircle, DollarSign } from "lucide-react";

interface LiveMarketMetricsProps {
  data: RealTimeMarketData;
}

export default function LiveMarketMetrics({ data }: LiveMarketMetricsProps) {
  const isNiftyPositive = data.nifty50.change >= 0;
  const isRupeePositive = data.rupeeUSD.change >= 0;

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Market Overview</h3>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Nifty 50 */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-semibold">NIFTY 50</p>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            </div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{data.nifty50.currentPrice.toFixed(2)}</p>
            <div className="flex items-center gap-1 mt-2">
              {isNiftyPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <p className={`text-sm font-bold ${isNiftyPositive ? "text-green-600" : "text-red-600"}`}>
                {isNiftyPositive ? "+" : ""}{data.nifty50.change.toFixed(2)} ({data.nifty50.changePercent.toFixed(2)}%)
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{data.nifty50.timestamp}</p>
          </div>

          {/* GIFT Nifty */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-semibold">GIFT NIFTY</p>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            </div>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{data.giftNifty.currentPrice.toFixed(2)}</p>
            <div className="flex items-center gap-1 mt-2">
              {data.giftNifty.change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <p className={`text-sm font-bold ${data.giftNifty.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                {data.giftNifty.change >= 0 ? "+" : ""}{data.giftNifty.change.toFixed(2)} ({data.giftNifty.changePercent.toFixed(2)}%)
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{data.giftNifty.timestamp}</p>
          </div>

          {/* Rupee USD */}
          <div className={`bg-gradient-to-br ${isRupeePositive ? "from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/40" : "from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/40"} rounded-lg p-4 border ${isRupeePositive ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800"}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-semibold">INR / USD</p>
              <DollarSign className={`w-4 h-4 ${isRupeePositive ? "text-green-600" : "text-red-600"}`} />
            </div>
            <p className={`text-2xl font-bold ${isRupeePositive ? "text-green-900 dark:text-green-100" : "text-red-900 dark:text-red-100"}`}>
              {data.rupeeUSD.rate.toFixed(2)}
            </p>
            <div className="flex items-center gap-1 mt-2">
              {isRupeePositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <p className={`text-sm font-bold ${isRupeePositive ? "text-green-600" : "text-red-600"}`}>
                {isRupeePositive ? "+" : ""}{data.rupeeUSD.change.toFixed(2)} ({data.rupeeUSD.changePercent.toFixed(2)}%)
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">All-time low</p>
          </div>

          {/* Day High/Low */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/40 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <p className="text-xs text-muted-foreground font-semibold mb-2">NIFTY RANGE</p>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Day High</p>
                <p className="text-lg font-bold text-orange-900 dark:text-orange-100">{data.nifty50.dayHigh.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Day Low</p>
                <p className="text-lg font-bold text-orange-900 dark:text-orange-100">{data.nifty50.dayLow.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nifty Details */}
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <h4 className="font-semibold text-foreground mb-3">Nifty 50 Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Open</span>
                <span className="font-semibold text-foreground">{data.nifty50.open.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Previous Close</span>
                <span className="font-semibold text-foreground">{data.nifty50.previousClose.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volume</span>
                <span className="font-semibold text-foreground">{data.nifty50.volume}</span>
              </div>
            </div>
          </div>

          {/* Market Alert */}
          <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 dark:text-red-200 mb-1">Market Alert</h4>
                <p className="text-sm text-red-800 dark:text-red-300">
                  Nifty 50 down 0.47% amid AI bubble concerns and rupee weakness. Watch support at 26,100.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Observations */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Key Observations</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li>Rupee hits all-time low of 89.49 against USD - significant depreciation</li>
          <li>AI bubble concerns weighing on global and Indian markets</li>
          <li>GIFT Nifty trading near Nifty 50 levels - limited lead</li>
          <li>Support level at 26,100 is critical for market direction</li>
          <li>FII outflows adding pressure on the market</li>
        </ul>
      </div>
    </div>
  );
}
