import React, { useMemo } from "react";
import { MarketFactor } from "@/lib/marketData";
import { TrendingUp, TrendingDown, Minus, ExternalLink, AlertCircle, Info } from "lucide-react";

interface EnhancedMarketSentimentProps {
  factors: MarketFactor[];
}

export default function EnhancedMarketSentiment({ factors }: EnhancedMarketSentimentProps) {
  // Calculate weighted sentiment score
  const weightedSentiment = useMemo(() => {
    let positiveScore = 0;
    let negativeScore = 0;
    let totalWeight = 0;

    factors.forEach((factor) => {
      totalWeight += factor.weight;
      if (factor.sentiment === "positive") {
        positiveScore += factor.weight;
      } else if (factor.sentiment === "negative") {
        negativeScore += factor.weight;
      }
    });

    const netScore = positiveScore - negativeScore;
    const normalizedScore = (netScore / totalWeight) * 100; // -100 to +100

    let sentiment: "bullish" | "bearish" | "neutral";
    let confidenceLevel: string;

    if (normalizedScore > 15) {
      sentiment = "bullish";
      confidenceLevel = "Strong";
    } else if (normalizedScore > 5) {
      sentiment = "bullish";
      confidenceLevel = "Moderate";
    } else if (normalizedScore < -15) {
      sentiment = "bearish";
      confidenceLevel = "Strong";
    } else if (normalizedScore < -5) {
      sentiment = "bearish";
      confidenceLevel = "Moderate";
    } else {
      sentiment = "neutral";
      confidenceLevel = "Weak";
    }

    return {
      sentiment,
      confidenceLevel,
      normalizedScore: Math.round(normalizedScore),
      positiveScore,
      negativeScore,
      totalWeight,
      positiveCount: factors.filter((f) => f.sentiment === "positive").length,
      negativeCount: factors.filter((f) => f.sentiment === "negative").length,
      neutralCount: factors.filter((f) => f.sentiment === "neutral").length,
    };
  }, [factors]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "bg-green-100 text-green-800 border-green-300";
      case "bearish":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "negative":
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getFactorBgColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-50 border-green-200";
      case "negative":
        return "bg-red-50 border-red-200";
      default:
        return "bg-yellow-50 border-yellow-200";
    }
  };

  const getWeightLabel = (weight: number) => {
    if (weight >= 9) return "Critical";
    if (weight >= 7) return "High";
    if (weight >= 5) return "Moderate";
    return "Low";
  };

  const getWeightColor = (weight: number) => {
    if (weight >= 9) return "bg-red-600 text-white";
    if (weight >= 7) return "bg-orange-600 text-white";
    if (weight >= 5) return "bg-yellow-600 text-white";
    return "bg-gray-600 text-white";
  };

  // Sort factors by weight (highest first)
  const sortedFactors = useMemo(() => {
    return [...factors].sort((a, b) => b.weight - a.weight);
  }, [factors]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Weighted Sentiment Summary */}
      <div className={`mb-6 p-4 rounded-lg border-2 ${getSentimentColor(weightedSentiment.sentiment)}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {weightedSentiment.sentiment === "bullish" ? (
                <TrendingUp className="w-6 h-6" />
              ) : weightedSentiment.sentiment === "bearish" ? (
                <TrendingDown className="w-6 h-6" />
              ) : (
                <Minus className="w-6 h-6" />
              )}
              <h3 className="text-lg font-bold">
                Market Sentiment: {weightedSentiment.sentiment.toUpperCase()}
              </h3>
            </div>
            <p className="text-sm font-semibold mb-2">
              Confidence: {weightedSentiment.confidenceLevel} ({weightedSentiment.normalizedScore > 0 ? "+" : ""}
              {weightedSentiment.normalizedScore} weighted score)
            </p>
            <p className="text-xs">
              Based on weighted analysis: {weightedSentiment.positiveCount} positive factors (
              {weightedSentiment.positiveScore} pts), {weightedSentiment.negativeCount} negative factors (
              {weightedSentiment.negativeScore} pts), {weightedSentiment.neutralCount} neutral factors
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {weightedSentiment.normalizedScore > 0 ? "+" : ""}
              {weightedSentiment.normalizedScore}
            </div>
            <p className="text-xs">Weighted Score</p>
          </div>
        </div>
      </div>

      {/* Methodology Explanation */}
      <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-blue-900">Weighted Sentiment Methodology</p>
            <p className="text-xs text-blue-800 mt-1">
              Sentiment is calculated by weighing each factor by its importance (1-10 scale). Critical factors like FII
              flows (weight: 10) have more impact than sector-specific news (weight: 5-6). This ensures market-moving
              events are properly reflected, not just factor count.
            </p>
          </div>
        </div>
      </div>

      {/* Factors List - Sorted by Weight */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-gray-900 mb-3">
          Market Factors (Sorted by Importance - Click to Verify)
        </h4>
        {sortedFactors.map((factor, index) => (
          <div key={index} className={`rounded-lg border-2 p-4 ${getFactorBgColor(factor.sentiment)} transition-all hover:shadow-md`}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-start gap-2 flex-1">
                {getSentimentIcon(factor.sentiment)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-bold text-gray-900">{factor.name}</h5>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${getWeightColor(factor.weight)}`}>
                      {getWeightLabel(factor.weight)} ({factor.weight}/10)
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 mb-2">{factor.description}</p>
                  <p className="text-xs text-gray-700 italic">
                    <span className="font-semibold">Impact:</span> {factor.impact}
                  </p>
                </div>
              </div>
            </div>
            {/* Clickable Source Link */}
            <div className="mt-3 pt-3 border-t border-gray-300">
              <a
                href={factor.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Verify from {factor.source}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Weekend/Holiday Notice */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-gray-900">Data Availability Note</p>
            <p className="text-xs text-gray-700 mt-1">
              During weekends and market holidays, the dashboard displays data from the most recent trading day. FII/DII
              data is updated on T+1 basis (next trading day). All factors are verified from official sources and updated
              in real-time during market hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
