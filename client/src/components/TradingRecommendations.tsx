import React from "react";
import { TradingRecommendation } from "@/lib/marketData";
import { useLiveOptionData } from "@/hooks/useLiveMarketData";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface TradingRecommendationsProps {
  recommendations: TradingRecommendation[];
}

export default function TradingRecommendations({ recommendations: initialRecommendations }: TradingRecommendationsProps) {
  const { data: recommendations = initialRecommendations } = useLiveOptionData(initialRecommendations);

  const calculatePnL = (rec: TradingRecommendation) => {
    if (rec.type === "no-trade" || rec.currentPremium === undefined || rec.entryPrice === 0) {
      return null;
    }

    // P&L = (Current Premium - Entry Price) * Lot Size * Multiplier
    // For a long CE/PE, profit is when current premium > entry price
    // For a short CE/PE, profit is when current premium < entry price (assuming a short trade, but here we assume long trade for simplicity)
    // Since the trades are "Buy" (long), the P&L is calculated as:
    // P&L = (Current Premium - Entry Price) * Lot Size * Multiplier
    const pnl = (rec.currentPremium - rec.entryPrice) * rec.lotSize * rec.multiplier;

    return pnl.toFixed(2);
  };
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "bull":
        return <TrendingUp className="w-6 h-6 text-green-600" />;
      case "bear":
        return <TrendingDown className="w-6 h-6 text-red-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case "bull":
        return "bg-green-50 border-green-300";
      case "bear":
        return "bg-red-50 border-red-300";
      default:
        return "bg-yellow-50 border-yellow-300";
    }
  };

  const getRecommendationBadgeColor = (type: string) => {
    switch (type) {
      case "bull":
        return "bg-green-100 text-green-800";
      case "bear":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Trading Recommendations (4H Chart)</h3>

      <div className="space-y-5">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`border-2 rounded-lg p-5 ${getRecommendationColor(rec.type)}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">{getRecommendationIcon(rec.type)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <h4 className="text-lg font-bold text-gray-900">{rec.title}</h4>
                    {rec.type !== "no-trade" && rec.currentPremium !== undefined && rec.entryPrice !== 0 && (
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          parseFloat(calculatePnL(rec)!) >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        P&L: ₹{calculatePnL(rec)}
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${getRecommendationBadgeColor(
                      rec.type
                    )}`}
                  >
                    {rec.type === "no-trade" ? "No Trade" : rec.type}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-3">{rec.description}</p>

                {/* Key Levels */}
                <div className="bg-white bg-opacity-70 rounded p-3 mb-3 border-l-4 border-gray-400">
                  <p className="text-xs text-gray-600 font-semibold">Key Levels:</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{rec.keyLevels}</p>
                  <p className="text-xs text-gray-600 mt-2">Expiry: {rec.expiryDate}</p>
                </div>

                {/* Rationale */}
                <div className="bg-white bg-opacity-70 rounded p-3 border-l-4 border-blue-400">
                  <p className="text-xs text-gray-600 font-semibold">Rationale:</p>
                  <p className="text-sm text-gray-700 mt-1">{rec.rationale}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Final Recommendation */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-300">
        <p className="text-xs text-gray-600 font-bold uppercase">Final Recommendation</p>
        <p className="text-sm text-gray-800 mt-2">
          <span className="font-bold text-indigo-700">No Trade</span> is the safest initial stance. Wait for the market to move to one of the two key zones and confirm the move with your 4H chart price action before taking a position. This ensures a favorable risk-reward ratio.
        </p>
      </div>
    </div>
  );
}
