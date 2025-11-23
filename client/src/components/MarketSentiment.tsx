import React from "react";
import { MarketFactor } from "@/lib/marketData";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MarketSentimentProps {
  factors: MarketFactor[];
}

export default function MarketSentiment({ factors }: MarketSentimentProps) {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "negative":
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-50 border-green-200";
      case "negative":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Market Sentiment Analysis</h3>

      <div className="space-y-4">
        {factors.map((factor, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${getSentimentColor(factor.sentiment)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">{getSentimentIcon(factor.sentiment)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{factor.name}</h4>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getSentimentBadgeColor(
                      factor.sentiment
                    )}`}
                  >
                    {factor.sentiment}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{factor.description}</p>
                <div className="bg-white bg-opacity-60 rounded p-2 border-l-2 border-gray-300">
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Impact:</span> {factor.impact}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-gray-600 font-semibold uppercase">Market Summary</p>
        <p className="text-sm text-gray-700 mt-2">
          The market is at a critical juncture, balancing <span className="font-semibold">strong domestic momentum</span> against <span className="font-semibold">cautious global sentiment</span>. The underlying trend remains bullish, but short-term consolidation is likely.
        </p>
      </div>
    </div>
  );
}
