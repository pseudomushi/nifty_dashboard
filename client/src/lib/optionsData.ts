// Nifty 50 Options Trading Analysis with Greeks
// Updated: November 22, 2025

export interface OptionGreeks {
  delta: number; // Rate of change of option price with respect to underlying
  gamma: number; // Rate of change of delta
  theta: number; // Time decay per day
  vega: number; // Sensitivity to volatility changes
  impliedVolatility: number; // IV percentage
}

export interface OptionTrade {
  id: string;
  expiry: string; // Format: "28-Nov-2025"
  daysToExpiry: number;
  type: "CE" | "PE"; // Call or Put
  strikePrice: number;
  currentPrice: number; // Premium
  recommendation: "BUY" | "SELL" | "HOLD";
  confidence: "HIGH" | "MEDIUM" | "LOW";
  entryPrice: number;
  stopLoss: number;
  target1: number;
  target2: number;
  riskRewardRatio: string;
  greeks: OptionGreeks;
  analysis: string;
  reasoning: string;
  maxLoss: number;
  maxGain: number;
  breakeven: number;
}

export interface OptionExpiry {
  expiryDate: string;
  daysToExpiry: number;
  weekNumber: number; // Week 1-8
  recommendedTrades: OptionTrade[];
  marketCondition: string;
  volatilityOutlook: string;
}

// Calculate Greeks (simplified model for demonstration)
const calculateGreeks = (
  strikePrice: number,
  currentPrice: number,
  daysToExpiry: number,
  type: "CE" | "PE",
  spotPrice: number = 26068.15
): OptionGreeks => {
  const moneyness = spotPrice / strikePrice;
  const timeToExpiry = daysToExpiry / 365;

  // Simplified Greeks calculation (in real scenario, use Black-Scholes model)
  const isITM = type === "CE" ? spotPrice > strikePrice : spotPrice < strikePrice;
  const isATM = Math.abs(spotPrice - strikePrice) < 100;

  const delta = type === "CE" 
    ? (isITM ? 0.6 + Math.random() * 0.3 : 0.2 + Math.random() * 0.3)
    : (isITM ? -0.6 - Math.random() * 0.3 : -0.2 - Math.random() * 0.3);

  const gamma = isATM ? 0.015 + Math.random() * 0.01 : 0.005 + Math.random() * 0.005;
  const theta = -(currentPrice / daysToExpiry) * (0.8 + Math.random() * 0.4);
  const vega = currentPrice * 0.1 * Math.sqrt(timeToExpiry);
  const impliedVolatility = 15 + Math.random() * 10; // 15-25% IV

  return {
    delta: Math.round(delta * 1000) / 1000,
    gamma: Math.round(gamma * 1000) / 1000,
    theta: Math.round(theta * 100) / 100,
    vega: Math.round(vega * 100) / 100,
    impliedVolatility: Math.round(impliedVolatility * 100) / 100,
  };
};

// Generate option trades for a specific expiry
const generateTradesForExpiry = (
  expiryDate: string,
  daysToExpiry: number,
  weekNumber: number
): OptionTrade[] => {
  const spotPrice = 26068.15;
  const trades: OptionTrade[] = [];

  // ATM Strikes
  const atmStrike = Math.round(spotPrice / 50) * 50;

  // Generate Call options (CE)
  // ATM Call - for bullish view
  const atmCallPremium = 150 + Math.random() * 50;
  const atmCallGreeks = calculateGreeks(atmStrike, atmCallPremium, daysToExpiry, "CE", spotPrice);
  trades.push({
    id: `${expiryDate}-CE-${atmStrike}`,
    expiry: expiryDate,
    daysToExpiry,
    type: "CE",
    strikePrice: atmStrike,
    currentPrice: atmCallPremium,
    recommendation: atmCallGreeks.delta > 0.5 && atmCallGreeks.theta > -10 ? "BUY" : "HOLD",
    confidence: atmCallGreeks.delta > 0.5 ? "HIGH" : "MEDIUM",
    entryPrice: atmCallPremium * 1.02, // Ask price (2% spread for buying)
    stopLoss: atmCallPremium * 0.6, // 40% stop loss
    target1: atmCallPremium * 1.5, // 50% gain
    target2: atmCallPremium * 2.0, // 100% gain
    riskRewardRatio: "1:2.5",
    greeks: atmCallGreeks,
    analysis: `ATM Call with ${daysToExpiry} days to expiry. Delta: ${atmCallGreeks.delta.toFixed(3)} indicates ${atmCallGreeks.delta > 0.5 ? 'strong' : 'moderate'} directional movement.`,
    reasoning: `Good for bullish breakout above 26,100. High delta provides good leverage. Theta decay: ${atmCallGreeks.theta.toFixed(2)}/day.`,
    maxLoss: atmCallPremium * 100, // Per lot
    maxGain: Infinity,
    breakeven: atmStrike + atmCallPremium,
  });

  // OTM Call - for aggressive bullish view
  const otmCallStrike = atmStrike + 200;
  const otmCallPremium = 80 + Math.random() * 30;
  const otmCallGreeks = calculateGreeks(otmCallStrike, otmCallPremium, daysToExpiry, "CE", spotPrice);
  trades.push({
    id: `${expiryDate}-CE-${otmCallStrike}`,
    expiry: expiryDate,
    daysToExpiry,
    type: "CE",
    strikePrice: otmCallStrike,
    currentPrice: otmCallPremium,
    recommendation: daysToExpiry > 7 && otmCallGreeks.delta > 0.3 ? "BUY" : "HOLD",
    confidence: daysToExpiry > 14 ? "MEDIUM" : "LOW",
    entryPrice: otmCallPremium * 1.02, // Ask price (2% spread for buying)
    stopLoss: otmCallPremium * 0.5,
    target1: otmCallPremium * 2.0,
    target2: otmCallPremium * 3.5,
    riskRewardRatio: "1:5",
    greeks: otmCallGreeks,
    analysis: `OTM Call for aggressive bullish play. Lower delta (${otmCallGreeks.delta.toFixed(3)}) means higher risk but better reward potential.`,
    reasoning: `Suitable if expecting strong rally above 26,280 resistance. Lower premium, higher percentage gains possible.`,
    maxLoss: otmCallPremium * 100,
    maxGain: Infinity,
    breakeven: otmCallStrike + otmCallPremium,
  });

  // ITM Call - for conservative bullish view
  const itmCallStrike = atmStrike - 200;
  const itmCallPremium = 280 + Math.random() * 50;
  const itmCallGreeks = calculateGreeks(itmCallStrike, itmCallPremium, daysToExpiry, "CE", spotPrice);
  trades.push({
    id: `${expiryDate}-CE-${itmCallStrike}`,
    expiry: expiryDate,
    daysToExpiry,
    type: "CE",
    strikePrice: itmCallStrike,
    currentPrice: itmCallPremium,
    recommendation: itmCallGreeks.delta > 0.7 ? "BUY" : "HOLD",
    confidence: "HIGH",
    entryPrice: itmCallPremium * 1.02, // Ask price (2% spread for buying)
    stopLoss: itmCallPremium * 0.7,
    target1: itmCallPremium * 1.3,
    target2: itmCallPremium * 1.6,
    riskRewardRatio: "1:2",
    greeks: itmCallGreeks,
    analysis: `ITM Call with high delta (${itmCallGreeks.delta.toFixed(3)}). Moves almost like stock with lower risk.`,
    reasoning: `Conservative bullish play. Higher premium but more stable. Good for trending markets.`,
    maxLoss: itmCallPremium * 100,
    maxGain: Infinity,
    breakeven: itmCallStrike + itmCallPremium,
  });

  // ATM Put - for bearish view
  const atmPutPremium = 140 + Math.random() * 50;
  const atmPutGreeks = calculateGreeks(atmStrike, atmPutPremium, daysToExpiry, "PE", spotPrice);
  trades.push({
    id: `${expiryDate}-PE-${atmStrike}`,
    expiry: expiryDate,
    daysToExpiry,
    type: "PE",
    strikePrice: atmStrike,
    currentPrice: atmPutPremium,
    recommendation: Math.abs(atmPutGreeks.delta) > 0.5 && spotPrice < 26100 ? "BUY" : "HOLD",
    confidence: spotPrice < 26100 ? "HIGH" : "MEDIUM",
    entryPrice: atmPutPremium * 1.02, // Ask price (2% spread for buying)
    stopLoss: atmPutPremium * 0.6,
    target1: atmPutPremium * 1.5,
    target2: atmPutPremium * 2.0,
    riskRewardRatio: "1:2.5",
    greeks: atmPutGreeks,
    analysis: `ATM Put with delta ${atmPutGreeks.delta.toFixed(3)}. Good for bearish breakdown below 26,050 support.`,
    reasoning: `Recommended if Nifty breaks 26,100 support. High delta provides good downside leverage.`,
    maxLoss: atmPutPremium * 100,
    maxGain: Infinity,
    breakeven: atmStrike - atmPutPremium,
  });

  // OTM Put - for aggressive bearish view
  const otmPutStrike = atmStrike - 200;
  const otmPutPremium = 75 + Math.random() * 25;
  const otmPutGreeks = calculateGreeks(otmPutStrike, otmPutPremium, daysToExpiry, "PE", spotPrice);
  trades.push({
    id: `${expiryDate}-PE-${otmPutStrike}`,
    expiry: expiryDate,
    daysToExpiry,
    type: "PE",
    strikePrice: otmPutStrike,
    currentPrice: otmPutPremium,
    recommendation: daysToExpiry > 7 && Math.abs(otmPutGreeks.delta) > 0.25 ? "BUY" : "HOLD",
    confidence: daysToExpiry > 14 ? "MEDIUM" : "LOW",
    entryPrice: otmPutPremium * 1.02, // Ask price (2% spread for buying)
    stopLoss: otmPutPremium * 0.5,
    target1: otmPutPremium * 2.0,
    target2: otmPutPremium * 3.5,
    riskRewardRatio: "1:5",
    greeks: otmPutGreeks,
    analysis: `OTM Put for aggressive bearish play. Lower cost, higher percentage returns if market crashes.`,
    reasoning: `Hedge or speculative play for sharp correction below 25,850. Lower premium, asymmetric payoff.`,
    maxLoss: otmPutPremium * 100,
    maxGain: Infinity,
    breakeven: otmPutStrike - otmPutPremium,
  });

  // ITM Put - for conservative bearish view
  const itmPutStrike = atmStrike + 200;
  const itmPutPremium = 270 + Math.random() * 50;
  const itmPutGreeks = calculateGreeks(itmPutStrike, itmPutPremium, daysToExpiry, "PE", spotPrice);
  trades.push({
    id: `${expiryDate}-PE-${itmPutStrike}`,
    expiry: expiryDate,
    daysToExpiry,
    type: "PE",
    strikePrice: itmPutStrike,
    currentPrice: itmPutPremium,
    recommendation: Math.abs(itmPutGreeks.delta) > 0.7 ? "BUY" : "HOLD",
    confidence: "HIGH",
    entryPrice: itmPutPremium * 1.02, // Ask price (2% spread for buying)
    stopLoss: itmPutPremium * 0.7,
    target1: itmPutPremium * 1.3,
    target2: itmPutPremium * 1.6,
    riskRewardRatio: "1:2",
    greeks: itmPutGreeks,
    analysis: `ITM Put with high delta (${itmPutGreeks.delta.toFixed(3)}). Conservative bearish position.`,
    reasoning: `Safer bearish play with higher premium. Good for trending down markets. Lower risk.`,
    maxLoss: itmPutPremium * 100,
    maxGain: Infinity,
    breakeven: itmPutStrike - itmPutPremium,
  });

  return trades;
};

// Generate all option expiries for next 8 weeks
export const generateOptionExpiries = (): OptionExpiry[] => {
  const expiries: OptionExpiry[] = [];
  const today = new Date("2025-11-22");

  // Nifty options expire every Thursday
  const getNextThursday = (date: Date, weeksAhead: number): Date => {
    const result = new Date(date);
    const dayOfWeek = result.getDay();
    const daysUntilThursday = (4 - dayOfWeek + 7) % 7 || 7;
    result.setDate(result.getDate() + daysUntilThursday + (weeksAhead * 7));
    return result;
  };

  for (let week = 0; week < 8; week++) {
    const expiryDate = getNextThursday(today, week);
    const daysToExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const expiryString = expiryDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const trades = generateTradesForExpiry(expiryString, daysToExpiry, week + 1);

    // Determine market condition based on days to expiry
    let marketCondition = "Neutral";
    let volatilityOutlook = "Moderate";

    if (daysToExpiry < 7) {
      marketCondition = "High Theta Decay - Avoid buying, consider selling";
      volatilityOutlook = "High - Near expiry volatility";
    } else if (daysToExpiry < 14) {
      marketCondition = "Moderate - Good for directional trades";
      volatilityOutlook = "Moderate - Balanced risk/reward";
    } else {
      marketCondition = "Low Theta Decay - Good for buying options";
      volatilityOutlook = "Low - Time value protection";
    }

    expiries.push({
      expiryDate: expiryString,
      daysToExpiry,
      weekNumber: week + 1,
      recommendedTrades: trades,
      marketCondition,
      volatilityOutlook,
    });
  }

  return expiries;
};

// Get top recommended trades across all expiries
export const getTopRecommendedTrades = (expiries: OptionExpiry[]): OptionTrade[] => {
  const allTrades = expiries.flatMap((e) => e.recommendedTrades);
  
  // Filter only BUY recommendations with HIGH or MEDIUM confidence
  const buyTrades = allTrades.filter(
    (t) => t.recommendation === "BUY" && (t.confidence === "HIGH" || t.confidence === "MEDIUM")
  );

  // Sort by confidence and days to expiry (prefer longer expiry)
  return buyTrades.sort((a, b) => {
    if (a.confidence === "HIGH" && b.confidence !== "HIGH") return -1;
    if (a.confidence !== "HIGH" && b.confidence === "HIGH") return 1;
    return b.daysToExpiry - a.daysToExpiry;
  }).slice(0, 10); // Top 10 trades
};
