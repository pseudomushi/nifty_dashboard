import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, TrendingUp, TrendingDown, AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EnhancedTradeWatchlistProps {
  marketSentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
  currentNiftyPrice: number;
}

export default function EnhancedTradeWatchlist({ marketSentiment, currentNiftyPrice }: EnhancedTradeWatchlistProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [expirySearch, setExpirySearch] = useState("");
  const [showExpiryDropdown, setShowExpiryDropdown] = useState(false);
  
  // Fetch active trades
  const { data: trades = [], refetch } = trpc.watchlist.getActiveTrades.useQuery();
  const deleteTradeMutation = trpc.watchlist.deleteTrade.useMutation();
  const addTradeMutation = trpc.watchlist.addTrade.useMutation();
  
  // Fetch available expiry dates from NSE
  const { data: expiryData } = trpc.optionsChain.getExpiryDates.useQuery({ symbol: "NIFTY" });
  const expiryDates = expiryData?.expiryDates || [];
  
  // Fetch live options chain data for real-time pricing
  const { data: optionsChainResponse } = trpc.optionsChain.getOptionsChain.useQuery(
    { symbol: "NIFTY" },
    { refetchInterval: 60000 } // Refetch every minute
  );
  const optionsChainData = optionsChainResponse?.data || [];

  // Form state
  const [formData, setFormData] = useState({
    optionType: "CE" as "CE" | "PE",
    strikePrice: "",
    expiryDate: "",
    entryPrice: "",
    quantity: "1",
    stopLoss: "",
    target1: "",
    target2: "",
    notes: "",
  });

  // Check for pending trade data from localStorage when form opens
  useEffect(() => {
    if (showAddForm) {
      const pendingTrade = localStorage.getItem('pendingWatchlistTrade');
      if (pendingTrade) {
        try {
          const tradeData = JSON.parse(pendingTrade);
          setFormData({
            optionType: tradeData.optionType || "CE",
            strikePrice: tradeData.strikePrice || "",
            expiryDate: tradeData.expiryDate || "",
            entryPrice: tradeData.entryPrice || "",
            quantity: "1",
            stopLoss: tradeData.stopLoss || "",
            target1: tradeData.target1 || "",
            target2: tradeData.target2 || "",
            notes: tradeData.notes || "",
          });
          localStorage.removeItem('pendingWatchlistTrade');
          toast.info('Trade data loaded from recommended trade!');
        } catch (error) {
          console.error('Error loading pending trade:', error);
        }
      }
    }
  }, [showAddForm]);

  // Filter expiry dates based on search
  const filteredExpiries = useMemo(() => {
    if (!expirySearch) return expiryDates;
    return expiryDates.filter((expiry: string) =>
      expiry.toLowerCase().includes(expirySearch.toLowerCase())
    );
  }, [expiryDates, expirySearch]);

  // Auto-calculate optimal SL and Target based on option premium ranges
  const calculateOptimalSLTarget = (
    strikePrice: number,
    entryPrice: number,
    optionType: "CE" | "PE"
  ) => {
    // Options-specific calculation with wider ranges
    // SL: 30-40% below entry (options can move fast)
    // T1: 50-80% above entry (reasonable first target)
    // T2: 100-150% above entry (aggressive but achievable)
    const stopLoss = (entryPrice * 0.65).toFixed(2); // 35% SL
    const target1 = (entryPrice * 1.65).toFixed(2); // 65% gain for T1
    const target2 = (entryPrice * 2.25).toFixed(2); // 125% gain for T2
    
    return { stopLoss, target1, target2 };
  };

  // Validate user-provided SL/Target
  const validateSLTarget = (
    entryPrice: number,
    stopLoss: string,
    target1: string,
    optionType: "CE" | "PE"
  ) => {
    const sl = parseFloat(stopLoss);
    const t1 = parseFloat(target1);
    const entry = entryPrice;
    
    const warnings: string[] = [];
    const suggestions: { stopLoss?: string; target1?: string; target2?: string } = {};
    
    // Check if SL is too tight or too wide
    const slPercent = Math.abs((sl - entry) / entry) * 100;
    if (slPercent < 1) {
      warnings.push("Stop loss is very tight (<1%). Consider widening to avoid premature exit.");
      suggestions.stopLoss = (entry * 0.96).toFixed(2); // 4% SL
    } else if (slPercent > 30) {
      warnings.push("Stop loss is very wide (>30%). Consider tightening to limit risk.");
      suggestions.stopLoss = (entry * 0.85).toFixed(2); // 15% SL
    }
    
    // Check if Target is achievable
    const t1Percent = Math.abs((t1 - entry) / entry) * 100;
    if (t1Percent < 3) {
      warnings.push("Target 1 is very close (<3%). Consider setting a higher target for better risk-reward.");
      suggestions.target1 = (entry * 1.10).toFixed(2); // 10% target
    } else if (t1Percent > 100) {
      warnings.push("Target 1 is very ambitious (>100%). Consider a more realistic target.");
      suggestions.target1 = (entry * 1.25).toFixed(2); // 25% target
    }
    
    // Check risk-reward ratio
    const riskReward = t1Percent / slPercent;
    if (riskReward < 1.5) {
      warnings.push(`Risk-reward ratio is ${riskReward.toFixed(2)}:1. Aim for at least 2:1 for better trades.`);
    }
    
    return { warnings, suggestions };
  };

  // Get live current price for a trade from options chain data
  const getLivePrice = (trade: any) => {
    if (!optionsChainResponse || !optionsChainResponse.records || !optionsChainResponse.records.data) {
      // Fallback to entry price if no live data
      return parseFloat(trade.entryPrice);
    }
    
    try {
      // Access the correct data structure: optionsChainResponse.records.data
      const optionData = optionsChainResponse.records.data.find((opt: any) => 
        opt.strikePrice === parseInt(trade.strikePrice) &&
        opt.expiryDate === trade.expiryDate
      );
      
      if (optionData) {
        const priceData = trade.optionType === "CE" ? optionData.CE : optionData.PE;
        const livePrice = priceData?.lastPrice || priceData?.LTP || parseFloat(trade.entryPrice);
        console.log(`Live price for ${trade.strikePrice} ${trade.optionType} (${trade.expiryDate}): ₹${livePrice}`);
        return livePrice;
      } else {
        console.warn(`No option data found for ${trade.strikePrice} ${trade.optionType} (${trade.expiryDate})`);
      }
    } catch (error) {
      console.error('Error fetching live price:', error);
    }
    
    // Fallback to entry price
    return parseFloat(trade.entryPrice);
  };

  const handleAddTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const entryPrice = parseFloat(formData.entryPrice);
    const strikePrice = parseInt(formData.strikePrice);
    
    // Auto-calculate SL/Target if not provided
    let stopLoss = formData.stopLoss;
    let target1 = formData.target1;
    let target2 = formData.target2;
    
    if (!stopLoss || !target1) {
      const optimal = calculateOptimalSLTarget(strikePrice, entryPrice, formData.optionType);
      if (!stopLoss) stopLoss = optimal.stopLoss;
      if (!target1) target1 = optimal.target1;
      if (!target2) target2 = optimal.target2;
      
      toast.info(`Auto-calculated: SL=₹${stopLoss}, T1=₹${target1}, T2=₹${target2}`);
    } else {
      // Validate user-provided SL/Target
      const validation = validateSLTarget(entryPrice, stopLoss, target1, formData.optionType);
      
      if (validation.warnings.length > 0) {
        const warningMessage = validation.warnings.join(" ");
        toast.warning(warningMessage);
        
        if (Object.keys(validation.suggestions).length > 0) {
          const suggestedSL = validation.suggestions.stopLoss || stopLoss;
          const suggestedT1 = validation.suggestions.target1 || target1;
          toast.info(`Suggested: SL=₹${suggestedSL}, T1=₹${suggestedT1}`);
        }
      }
    }
    
    try {
      await addTradeMutation.mutateAsync({
        optionType: formData.optionType,
        strikePrice,
        expiryDate: formData.expiryDate,
        entryPrice: formData.entryPrice,
        entryDate: new Date(),
        quantity: parseInt(formData.quantity),
        stopLoss,
        target1,
        target2: target2 || undefined,
        notes: formData.notes || undefined,
      });

      toast.success("Trade added to watchlist!");
      setShowAddForm(false);
      setFormData({
        optionType: "CE",
        strikePrice: "",
        expiryDate: "",
        entryPrice: "",
        quantity: "1",
        stopLoss: "",
        target1: "",
        target2: "",
        notes: "",
      });
      refetch();
    } catch (error) {
      toast.error("Failed to add trade. Please try again.");
    }
  };

  const handleDeleteTrade = async (tradeId: number) => {
    try {
      await deleteTradeMutation.mutateAsync({ id: tradeId });
      toast.success("Trade removed from watchlist!");
      refetch();
    } catch (error) {
      toast.error("Failed to remove trade. Please try again.");
    }
  };

  // Calculate hold/exit recommendation for each trade with live prices
  const getTradeRecommendation = (trade: any) => {
    const entryPrice = parseFloat(trade.entryPrice);
    const stopLoss = parseFloat(trade.stopLoss);
    const target1 = parseFloat(trade.target1);
    const target2 = trade.target2 ? parseFloat(trade.target2) : null;
    
    // Get live current price from NSE options chain
    const currentPrice = getLivePrice(trade);
    
    const quantity = trade.quantity;
    const lotSize = 75; // Nifty 50 lot size (should be fetched from NSE API)
    const totalUnits = quantity * lotSize;
    const pnl = (currentPrice - entryPrice) * totalUnits;
    const pnlPercent = ((currentPrice - entryPrice) / entryPrice) * 100;
    const isProfit = currentPrice > entryPrice;
    
    // Calculate conviction rate and likelihood based on Greeks and market sentiment
    const delta = Math.abs(trade.optionType === "CE" ? 0.6 : -0.6); // Simplified, should use real Greeks
    const distanceToTarget = target1 - currentPrice;
    const distanceToSL = currentPrice - stopLoss;
    const targetLikelihood = Math.min(95, Math.max(20, 50 + (delta * 50) + (marketSentiment === "BULLISH" && trade.optionType === "CE" ? 15 : 0) + (marketSentiment === "BEARISH" && trade.optionType === "PE" ? 15 : 0)));
    const slLikelihood = Math.min(80, Math.max(10, 40 - (delta * 30) - (distanceToSL / distanceToTarget * 10)));
    const convictionRate = Math.round((targetLikelihood + (100 - slLikelihood)) / 2);
    
    // Recommendation logic
    let recommendation: "HOLD" | "EXIT" | "CLOSE_TO_SL" | "TARGET_HIT";
    let reason: string;
    let source: string;
    
    if (currentPrice <= stopLoss) {
      recommendation = "EXIT";
      reason = `Stop loss hit at ₹${stopLoss.toFixed(2)}. Exit immediately to limit losses.`;
      source = "Risk Management Rule";
    } else if (target2 && currentPrice >= target2) {
      recommendation = "EXIT";
      reason = `Target 2 achieved at ₹${target2.toFixed(2)}. Book profits and exit.`;
      source = "Profit Booking Strategy";
    } else if (currentPrice >= target1) {
      recommendation = "TARGET_HIT";
      reason = `Target 1 achieved at ₹${target1.toFixed(2)}. Consider booking partial profits or trailing SL.`;
      source = "Profit Booking Strategy";
    } else if (currentPrice <= stopLoss * 1.05) {
      recommendation = "CLOSE_TO_SL";
      reason = `Price dangerously close to stop loss (within 5%). Monitor closely or exit to avoid loss.`;
      source = "Risk Alert";
    } else if (
      (trade.optionType === "CE" && marketSentiment === "BULLISH") ||
      (trade.optionType === "PE" && marketSentiment === "BEARISH")
    ) {
      recommendation = "HOLD";
      reason = `Market sentiment is ${marketSentiment}, favoring your ${trade.optionType} position. Hold for targets.`;
      source = "Market Sentiment Analysis";
    } else {
      recommendation = "HOLD";
      reason = `Trade within range. Monitor market conditions and adjust stop loss if needed.`;
      source = "Technical Analysis";
    }
    
    return {
      currentPrice,
      pnl,
      pnlPercent,
      isProfit,
      recommendation,
      reason,
      source,
      convictionRate,
      targetLikelihood: Math.round(targetLikelihood),
      slLikelihood: Math.round(slLikelihood),
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Trade Watchlist</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track your Nifty 50 option trades with real-time P&L and recommendations
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Trade
        </Button>
      </div>

      {/* Add Trade Form */}
      {showAddForm && (
        <div className="bg-card text-card-foreground rounded-lg shadow-md p-6 border border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Add New Trade</h3>
          <form onSubmit={handleAddTrade} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Option Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Option Type</label>
                <select
                  value={formData.optionType}
                  onChange={(e) => setFormData({ ...formData, optionType: e.target.value as "CE" | "PE" })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="CE">Call (CE)</option>
                  <option value="PE">Put (PE)</option>
                </select>
              </div>

              {/* Strike Price */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Strike Price</label>
                <input
                  type="number"
                  value={formData.strikePrice}
                  onChange={(e) => setFormData({ ...formData, strikePrice: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="26100"
                  required
                />
              </div>

              {/* Expiry Date with Autocomplete */}
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Expiry Date
                  <span className="text-xs text-muted-foreground ml-2">(Type to search)</span>
                </label>
                <input
                  type="text"
                  value={formData.expiryDate || expirySearch}
                  onChange={(e) => {
                    setExpirySearch(e.target.value);
                    setFormData({ ...formData, expiryDate: e.target.value });
                    setShowExpiryDropdown(true);
                  }}
                  onFocus={() => setShowExpiryDropdown(true)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="28-Nov-2025"
                  required
                />
                {showExpiryDropdown && filteredExpiries.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredExpiries.slice(0, 8).map((expiry: string) => (
                      <div
                        key={expiry}
                        onClick={() => {
                          setFormData({ ...formData, expiryDate: expiry });
                          setExpirySearch("");
                          setShowExpiryDropdown(false);
                        }}
                        className="px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm text-foreground"
                      >
                        {expiry}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Entry Price */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Entry Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.entryPrice}
                  onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="150.50"
                  required
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Quantity (Lots)</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="50"
                  required
                />
              </div>

              {/* Stop Loss - Optional */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Stop Loss (₹)
                  <span className="text-xs text-muted-foreground ml-2">(Optional - auto-calculated)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.stopLoss}
                  onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Auto-calculated"
                />
              </div>

              {/* Target 1 - Optional */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Target 1 (₹)
                  <span className="text-xs text-muted-foreground ml-2">(Optional - auto-calculated)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.target1}
                  onChange={(e) => setFormData({ ...formData, target1: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Auto-calculated"
                />
              </div>

              {/* Target 2 - Optional */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Target 2 (₹)
                  <span className="text-xs text-muted-foreground ml-2">(Optional)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.target2}
                  onChange={(e) => setFormData({ ...formData, target2: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Optional"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-foreground mb-1">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Trade notes, strategy, or observations..."
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addTradeMutation.isPending}>
                {addTradeMutation.isPending ? "Adding..." : "Add Trade"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Trades List */}
      {trades.length === 0 ? (
        <div className="bg-card text-card-foreground rounded-lg shadow-md p-12 text-center border border-border">
          <p className="text-muted-foreground">No trades in watchlist. Click "Add Trade" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {trades.map((trade: any) => {
            const analysis = getTradeRecommendation(trade);
            
            return (
              <div
                key={trade.id}
                className="bg-card text-card-foreground rounded-lg shadow-md p-6 border border-border"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Nifty {trade.strikePrice} {trade.optionType}
                    </h3>
                    <p className="text-sm text-muted-foreground">Expiry: {trade.expiryDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* P&L Badge */}
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        analysis.isProfit
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {analysis.isProfit ? "+" : ""}₹{analysis.pnl.toFixed(2)} ({analysis.pnlPercent.toFixed(2)}%)
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTrade(trade.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Trade Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Entry Price</p>
                    <p className="text-sm font-semibold text-foreground">₹{parseFloat(trade.entryPrice).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Current Price (Live)</p>
                    <p className="text-sm font-semibold text-foreground">₹{analysis.currentPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p className="text-sm font-semibold text-foreground">{trade.quantity} lot{trade.quantity > 1 ? 's' : ''} ({trade.quantity * 75} units)</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stop Loss</p>
                    <p className="text-sm font-semibold text-foreground">₹{parseFloat(trade.stopLoss).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Target 1</p>
                    <p className="text-sm font-semibold text-foreground">₹{parseFloat(trade.target1).toFixed(2)}</p>
                  </div>
                  {trade.target2 && (
                    <div>
                      <p className="text-xs text-muted-foreground">Target 2</p>
                      <p className="text-sm font-semibold text-foreground">₹{parseFloat(trade.target2).toFixed(2)}</p>
                    </div>
                  )}
                </div>

                {/* Recommendation */}
                <div
                  className={`p-4 rounded-lg border ${
                    analysis.recommendation === "EXIT"
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      : analysis.recommendation === "TARGET_HIT"
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : analysis.recommendation === "CLOSE_TO_SL"
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                      : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {analysis.recommendation === "EXIT" && <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />}
                    {analysis.recommendation === "TARGET_HIT" && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />}
                    {analysis.recommendation === "CLOSE_TO_SL" && <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />}
                    {analysis.recommendation === "HOLD" && <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      <p className="font-bold text-sm text-foreground mb-1">
                        Recommendation: {analysis.recommendation.replace("_", " ")}
                      </p>
                      <p className="text-sm text-foreground mb-1">{analysis.reason}</p>
                      <p className="text-xs text-muted-foreground">Source: {analysis.source}</p>
                    </div>
                  </div>
                </div>

                {/* Conviction Rate and Likelihood */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-muted-foreground mb-1">Conviction Rate</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{analysis.convictionRate}%</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-xs text-muted-foreground mb-1">Target Likelihood</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{analysis.targetLikelihood}%</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-xs text-muted-foreground mb-1">Stop Loss Risk</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">{analysis.slLikelihood}%</p>
                  </div>
                </div>

                {trade.notes && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Notes:</p>
                    <p className="text-sm text-foreground">{trade.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
