import React, { useState, useMemo } from "react";
import { OptionExpiry, OptionTrade } from "@/lib/optionsData";
import { MarketFactor } from "@/lib/marketData";
import { TrendingUp, TrendingDown, Target, Shield, AlertCircle, Info, Award, AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EnhancedOptionsAnalysisProps {
  expiries: OptionExpiry[];
  marketFactors: MarketFactor[];
}

export default function EnhancedOptionsAnalysis({ expiries, marketFactors }: EnhancedOptionsAnalysisProps) {
  const [selectedExpiry, setSelectedExpiry] = useState<string>("all");

  // Calculate market sentiment score from market factors
  const marketSentimentScore = useMemo(() => {
    const positiveCount = marketFactors.filter((f) => f.sentiment === "positive").length;
    const negativeCount = marketFactors.filter((f) => f.sentiment === "negative").length;
    const totalCount = marketFactors.length;

    const score = ((positiveCount - negativeCount) / totalCount) * 100;
    
    let sentiment: "bullish" | "bearish" | "neutral";
    if (score > 20) sentiment = "bullish";
    else if (score < -20) sentiment = "bearish";
    else sentiment = "neutral";

    return { score, sentiment, positiveCount, negativeCount };
  }, [marketFactors]);

  // Adjust confidence based on market sentiment
  const adjustConfidenceBasedOnSentiment = (trade: OptionTrade): OptionTrade => {
    let adjustedConfidence = trade.confidence;

    // Boost confidence for trades aligned with market sentiment
    if (marketSentimentScore.sentiment === "bullish" && trade.type === "CE" && trade.recommendation === "BUY") {
      if (trade.confidence === "MEDIUM") adjustedConfidence = "HIGH";
    } else if (marketSentimentScore.sentiment === "bearish" && trade.type === "PE" && trade.recommendation === "BUY") {
      if (trade.confidence === "MEDIUM") adjustedConfidence = "HIGH";
    }
    // Reduce confidence for trades against market sentiment
    else if (marketSentimentScore.sentiment === "bullish" && trade.type === "PE" && trade.recommendation === "BUY") {
      if (trade.confidence === "HIGH") adjustedConfidence = "MEDIUM";
      if (trade.confidence === "MEDIUM") adjustedConfidence = "LOW";
    } else if (marketSentimentScore.sentiment === "bearish" && trade.type === "CE" && trade.recommendation === "BUY") {
      if (trade.confidence === "HIGH") adjustedConfidence = "MEDIUM";
      if (trade.confidence === "MEDIUM") adjustedConfidence = "LOW";
    }

    return { ...trade, confidence: adjustedConfidence };
  };

  // Get all trades with adjusted confidence
  const allTrades = useMemo(() => {
    let trades: OptionTrade[] = [];

    if (selectedExpiry === "all") {
      trades = expiries.flatMap((e) => e.recommendedTrades);
    } else {
      const expiry = expiries.find((e) => e.expiryDate === selectedExpiry);
      trades = expiry?.recommendedTrades || [];
    }

    // Adjust confidence based on market sentiment
    return trades
      .map((trade) => adjustConfidenceBasedOnSentiment(trade))
      .filter((trade) => trade.recommendation === "BUY"); // Only show BUY recommendations
  }, [expiries, selectedExpiry, marketSentimentScore]);

  // Segregate by confidence
  const highConfidenceTrades = useMemo(
    () => allTrades.filter((t) => t.confidence === "HIGH").sort((a, b) => b.daysToExpiry - a.daysToExpiry),
    [allTrades]
  );

  const mediumConfidenceTrades = useMemo(
    () => allTrades.filter((t) => t.confidence === "MEDIUM").sort((a, b) => b.daysToExpiry - a.daysToExpiry),
    [allTrades]
  );

  const lowConfidenceTrades = useMemo(
    () => allTrades.filter((t) => t.confidence === "LOW").sort((a, b) => b.daysToExpiry - a.daysToExpiry),
    [allTrades]
  );

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "HIGH":
        return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50";
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50";
      default:
        return "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/50";
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case "HIGH":
        return <Award className="w-5 h-5 text-green-600" />;
      case "MEDIUM":
        return <Info className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    }
  };

  const renderTradeCard = (trade: OptionTrade) => (
    <div
      key={trade.id}
      className="bg-card text-card-foreground rounded-lg border-2 border-border p-5 hover:shadow-lg transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-lg font-bold">
              {trade.strikePrice} {trade.type}
            </h4>
            {trade.type === "CE" ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">Expiry: {trade.expiry} ({trade.daysToExpiry} days)</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1 ${getConfidenceColor(
              trade.confidence
            )}`}
          >
            {getConfidenceIcon(trade.confidence)}
            {trade.confidence} CONFIDENCE
          </span>
          <button
            onClick={() => {
              // Store trade data in localStorage for the watchlist form to pick up
              const watchlistData = {
                optionType: trade.type,
                strikePrice: trade.strikePrice.toString(),
                expiryDate: trade.expiry,
                entryPrice: trade.entryPrice.toString(),
                stopLoss: trade.stopLoss.toString(),
                target1: trade.target1.toString(),
                target2: trade.target2.toString(),
                notes: `${trade.analysis} | ${trade.reasoning}`,
              };
              localStorage.setItem('pendingWatchlistTrade', JSON.stringify(watchlistData));
              toast.success('Trade added! Switch to Trade Watchlist tab and click "Add Trade".');
            }}
            className="p-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            title="Add to Watchlist"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Premium & Entry */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
          <p className="text-xs text-muted-foreground font-semibold">Current Premium</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">₹{trade.currentPrice.toFixed(2)}</p>
        </div>
        <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30">
          <p className="text-xs text-muted-foreground font-semibold">Entry Price</p>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">₹{trade.entryPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Stop Loss & Targets */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-red-500/10 rounded-lg p-2 border border-red-500/30">
          <div className="flex items-center gap-1 mb-1">
            <Shield className="w-3 h-3 text-red-600 dark:text-red-400" />
            <p className="text-xs text-muted-foreground font-semibold">Stop Loss</p>
          </div>
          <p className="text-sm font-bold text-red-600 dark:text-red-400">₹{trade.stopLoss.toFixed(2)}</p>
        </div>
        <div className="bg-green-500/10 rounded-lg p-2 border border-green-500/30">
          <div className="flex items-center gap-1 mb-1">
            <Target className="w-3 h-3 text-green-600 dark:text-green-400" />
            <p className="text-xs text-muted-foreground font-semibold">Target 1</p>
          </div>
          <p className="text-sm font-bold text-green-600 dark:text-green-400">₹{trade.target1.toFixed(2)}</p>
        </div>
        <div className="bg-green-500/10 rounded-lg p-2 border border-green-500/30">
          <div className="flex items-center gap-1 mb-1">
            <Target className="w-3 h-3 text-green-600 dark:text-green-400" />
            <p className="text-xs text-muted-foreground font-semibold">Target 2</p>
          </div>
          <p className="text-sm font-bold text-green-600 dark:text-green-400">₹{trade.target2.toFixed(2)}</p>
        </div>
      </div>

      {/* Greeks */}
      <div className="bg-muted/50 rounded-lg p-3 mb-4 border border-border">
        <p className="text-xs font-bold mb-2 text-foreground">Greeks Analysis</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          <div>
            <p className="text-muted-foreground">Delta</p>
            <p className="font-bold text-foreground">{trade.greeks.delta.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Gamma</p>
            <p className="font-bold text-foreground">{trade.greeks.gamma.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Theta</p>
            <p className="font-bold text-red-600 dark:text-red-400">{trade.greeks.theta.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Vega</p>
            <p className="font-bold text-foreground">{trade.greeks.vega.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">IV</p>
            <p className="font-bold text-foreground">{trade.greeks.impliedVolatility.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Risk/Reward */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-orange-500/10 rounded-lg p-2 border border-orange-500/30">
          <p className="text-xs text-muted-foreground font-semibold">Risk:Reward</p>
          <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{trade.riskRewardRatio}</p>
        </div>
        <div className="bg-yellow-500/10 rounded-lg p-2 border border-yellow-500/30">
          <p className="text-xs text-muted-foreground font-semibold">Breakeven</p>
          <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{trade.breakeven.toFixed(2)}</p>
        </div>
      </div>

      {/* Analysis */}
      <div className="bg-blue-500/10 rounded-lg p-3 mb-3 border border-blue-500/30">
        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Analysis</p>
        <p className="text-xs text-foreground">{trade.analysis}</p>
      </div>

      {/* Reasoning */}
      <div className="bg-purple-500/10 rounded-lg p-3 mb-3 border border-purple-500/30">
        <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Reasoning</p>
        <p className="text-xs text-foreground">{trade.reasoning}</p>
      </div>


    </div>
  );

  const renderConfidenceSection = (title: string, trades: OptionTrade[], confidence: string, description: string) => {
    if (trades.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {getConfidenceIcon(confidence)}
          <div>
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${getConfidenceColor(confidence)}`}>
            {trades.length} {trades.length === 1 ? "Trade" : "Trades"}
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trades.map((trade) => renderTradeCard(trade))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Market Sentiment Indicator */}
      <div className={`mb-6 p-4 rounded-lg border-2 ${
        marketSentimentScore.sentiment === "bullish"
          ? "bg-green-500/10 border-green-500/30"
          : marketSentimentScore.sentiment === "bearish"
          ? "bg-red-500/10 border-red-500/30"
          : "bg-yellow-500/10 border-yellow-500/30"
      }`}>
        <div className="flex items-start gap-3">
          <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            marketSentimentScore.sentiment === "bullish"
              ? "text-green-600 dark:text-green-400"
              : marketSentimentScore.sentiment === "bearish"
              ? "text-red-600 dark:text-red-400"
              : "text-yellow-600 dark:text-yellow-400"
          }`} />
          <div>
            <p className={`text-sm font-bold ${
              marketSentimentScore.sentiment === "bullish"
                ? "text-green-600 dark:text-green-400"
                : marketSentimentScore.sentiment === "bearish"
                ? "text-red-600 dark:text-red-400"
                : "text-yellow-600 dark:text-yellow-400"
            }`}>
              Market Sentiment: {marketSentimentScore.sentiment.toUpperCase()}
            </p>
            <p className="text-xs mt-1 text-foreground">
              {marketSentimentScore.positiveCount} positive factors, {marketSentimentScore.negativeCount} negative factors. 
              Confidence levels are adjusted based on market sentiment alignment.
            </p>
          </div>
        </div>
      </div>

      {/* Expiry Selector */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-foreground mb-2 block">Select Expiry</label>
        <select
          value={selectedExpiry}
          onChange={(e) => setSelectedExpiry(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          <option value="all">🔥 All Recommended Trades (8 Weeks)</option>
          {expiries.map((expiry) => (
            <option key={expiry.expiryDate} value={expiry.expiryDate}>
              Week {expiry.weekNumber}: {expiry.expiryDate} ({expiry.daysToExpiry} days)
            </option>
          ))}
        </select>
      </div>

      {/* Confidence-Segregated Sections */}
      {renderConfidenceSection(
        "🏆 High Confidence Trades",
        highConfidenceTrades,
        "HIGH",
        "Best risk-reward ratio aligned with market sentiment. Recommended for execution."
      )}

      {renderConfidenceSection(
        "⚠️ Medium Confidence Trades",
        mediumConfidenceTrades,
        "MEDIUM",
        "Moderate risk-reward. Consider these if high confidence trades are not available."
      )}

      {renderConfidenceSection(
        "🔸 Low Confidence Trades",
        lowConfidenceTrades,
        "LOW",
        "Higher risk. Only for aggressive traders or hedging purposes."
      )}

      {/* No Trades Message */}
      {allTrades.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-semibold">No recommended trades available for this expiry</p>
          <p className="text-xs text-gray-500 mt-1">Try selecting a different expiry or check back later</p>
        </div>
      )}

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
              Options trading involves substantial risk. Confidence levels are based on market sentiment and Greeks analysis. 
              Always do your own analysis and consult with a financial advisor before trading. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
