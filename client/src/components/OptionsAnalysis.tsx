import React, { useState } from "react";
import { OptionExpiry, OptionTrade, getTopRecommendedTrades } from "@/lib/optionsData";
import { TrendingUp, TrendingDown, Target, Shield, AlertCircle, Info } from "lucide-react";

interface OptionsAnalysisProps {
  expiries: OptionExpiry[];
}

export default function OptionsAnalysis({ expiries }: OptionsAnalysisProps) {
  const [selectedExpiry, setSelectedExpiry] = useState<string>("top");
  const topTrades = getTopRecommendedTrades(expiries);

  const getDisplayTrades = (): OptionTrade[] => {
    if (selectedExpiry === "top") {
      return topTrades;
    }
    const expiry = expiries.find((e) => e.expiryDate === selectedExpiry);
    return expiry?.recommendedTrades || [];
  };

  const displayTrades = getDisplayTrades();
  const selectedExpiryData = expiries.find((e) => e.expiryDate === selectedExpiry);

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "BUY":
        return "bg-green-100 text-green-800 border-green-300";
      case "SELL":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "HIGH":
        return "bg-blue-100 text-blue-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderTradeCard = (trade: OptionTrade) => (
    <div
      key={trade.id}
      className="bg-white rounded-lg border-2 border-gray-200 p-5 hover:shadow-lg transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-lg font-bold text-gray-900">
              {trade.strikePrice} {trade.type}
            </h4>
            {trade.type === "CE" ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>
          <p className="text-xs text-gray-600">Expiry: {trade.expiry} ({trade.daysToExpiry} days)</p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${getRecommendationColor(
              trade.recommendation
            )}`}
          >
            {trade.recommendation}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getConfidenceColor(trade.confidence)}`}>
            {trade.confidence}
          </span>
        </div>
      </div>

      {/* Premium & Entry */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="text-xs text-gray-600 font-semibold">Current Premium</p>
          <p className="text-xl font-bold text-blue-900">₹{trade.currentPrice.toFixed(2)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <p className="text-xs text-gray-600 font-semibold">Entry Price</p>
          <p className="text-xl font-bold text-purple-900">₹{trade.entryPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Stop Loss & Targets */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-red-50 rounded-lg p-2 border border-red-200">
          <div className="flex items-center gap-1 mb-1">
            <Shield className="w-3 h-3 text-red-600" />
            <p className="text-xs text-gray-600 font-semibold">Stop Loss</p>
          </div>
          <p className="text-sm font-bold text-red-900">₹{trade.stopLoss.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-2 border border-green-200">
          <div className="flex items-center gap-1 mb-1">
            <Target className="w-3 h-3 text-green-600" />
            <p className="text-xs text-gray-600 font-semibold">Target 1</p>
          </div>
          <p className="text-sm font-bold text-green-900">₹{trade.target1.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-2 border border-green-200">
          <div className="flex items-center gap-1 mb-1">
            <Target className="w-3 h-3 text-green-600" />
            <p className="text-xs text-gray-600 font-semibold">Target 2</p>
          </div>
          <p className="text-sm font-bold text-green-900">₹{trade.target2.toFixed(2)}</p>
        </div>
      </div>

      {/* Greeks */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
        <p className="text-xs font-bold text-gray-900 mb-2">Greeks Analysis</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          <div>
            <p className="text-gray-600">Delta</p>
            <p className="font-bold text-gray-900">{trade.greeks.delta.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-gray-600">Gamma</p>
            <p className="font-bold text-gray-900">{trade.greeks.gamma.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-gray-600">Theta</p>
            <p className="font-bold text-red-600">{trade.greeks.theta.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-600">Vega</p>
            <p className="font-bold text-gray-900">{trade.greeks.vega.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-600">IV</p>
            <p className="font-bold text-gray-900">{trade.greeks.impliedVolatility.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Risk/Reward */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-orange-50 rounded-lg p-2 border border-orange-200">
          <p className="text-xs text-gray-600 font-semibold">Risk:Reward</p>
          <p className="text-sm font-bold text-orange-900">{trade.riskRewardRatio}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-2 border border-yellow-200">
          <p className="text-xs text-gray-600 font-semibold">Breakeven</p>
          <p className="text-sm font-bold text-yellow-900">{trade.breakeven.toFixed(2)}</p>
        </div>
      </div>

      {/* Analysis */}
      <div className="bg-blue-50 rounded-lg p-3 mb-3 border border-blue-200">
        <p className="text-xs font-semibold text-blue-900 mb-1">Analysis</p>
        <p className="text-xs text-blue-800">{trade.analysis}</p>
      </div>

      {/* Reasoning */}
      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
        <p className="text-xs font-semibold text-purple-900 mb-1">Reasoning</p>
        <p className="text-xs text-purple-800">{trade.reasoning}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Nifty 50 Options Analysis</h3>
          <p className="text-xs text-gray-600 mt-1">Greeks-based recommendations for next 8 weeks</p>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <span className="text-xs font-semibold text-blue-600">Live Analysis</span>
        </div>
      </div>

      {/* Expiry Selector */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-900 mb-2 block">Select Expiry</label>
        <select
          value={selectedExpiry}
          onChange={(e) => setSelectedExpiry(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          <option value="top">🔥 Top Recommended Trades (All Expiries)</option>
          {expiries.map((expiry) => (
            <option key={expiry.expiryDate} value={expiry.expiryDate}>
              Week {expiry.weekNumber}: {expiry.expiryDate} ({expiry.daysToExpiry} days)
            </option>
          ))}
        </select>
      </div>

      {/* Market Condition (if specific expiry selected) */}
      {selectedExpiryData && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-900">
                Market Condition: {selectedExpiryData.marketCondition}
              </p>
              <p className="text-xs text-yellow-800 mt-1">
                Volatility Outlook: {selectedExpiryData.volatilityOutlook}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trades Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayTrades.length > 0 ? (
          displayTrades.map((trade) => renderTradeCard(trade))
        ) : (
          <div className="col-span-2 text-center py-8">
            <p className="text-gray-500">No recommended trades available</p>
          </div>
        )}
      </div>

      {/* Greeks Legend */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-bold text-gray-900 mb-3">Understanding Greeks</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <p className="font-semibold text-gray-900">Delta</p>
            <p className="text-gray-600">Rate of change per ₹1 move in Nifty. Higher = more sensitive.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Gamma</p>
            <p className="text-gray-600">Rate of change of Delta. Higher near ATM strikes.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Theta</p>
            <p className="text-gray-600">Time decay per day. Negative for buyers, positive for sellers.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Vega</p>
            <p className="text-gray-600">Sensitivity to volatility. Higher = more IV impact.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">IV</p>
            <p className="text-gray-600">Implied Volatility. Higher = expensive options.</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-red-900">Risk Disclaimer</p>
            <p className="text-xs text-red-800 mt-1">
              Options trading involves substantial risk. Greeks are calculated using simplified models for educational purposes. 
              Always do your own analysis and consult with a financial advisor before trading. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
