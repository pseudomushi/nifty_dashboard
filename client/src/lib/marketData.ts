// Mock market data for Nifty 50 Dashboard
// This data is based on the analysis from November 21, 2025

export interface MarketAnalysis {
  date: string;
  currentPrice: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  change: number;
  changePercent: number;
  volume: string;
  sentiment: "positive" | "negative" | "neutral";
}

export interface TechnicalLevels {
  resistance1: number;
  resistance2: number;
  currentPrice: number;
  support1: number;
  support2: number;
}

export interface MarketFactor {
  name: string;
  sentiment: "positive" | "negative" | "neutral";
  description: string;
  impact: string;
  weight: number; // Importance weight: 1-10 (10 = most important)
  source: string; // Source name
  sourceUrl: string; // URL to verify the factor
}

export interface TradingRecommendation {
  instrument: "NIFTY" | "BANKNIFTY";
  strikePrice: number;
  optionType: "CE" | "PE";
  entryPrice: number;
  lotSize: number;
  multiplier: number;
  type: "bull" | "bear" | "no-trade";
  title: string;
  description: string;
  keyLevels: string;
  rationale: string;
  expiryDate: string; // To be fetched from NSE data
  currentPremium?: number; // To be fetched from NSE data
}

export interface NewsItem {
  title: string;
  summary: string;
  impact: "positive" | "negative" | "neutral";
  source: string;
}

// Mock Nifty 50 price data for the chart (hourly data for the day)
export const generateChartData = () => {
  const basePrice = 26192;
  const hours = [];
  const prices = [];
  
  for (let i = 0; i < 24; i++) {
    const hour = String(i).padStart(2, "0") + ":00";
    hours.push(hour);
    
    // Generate realistic price movement with some volatility
    const volatility = (Math.random() - 0.5) * 100;
    const trend = i > 12 ? (i - 12) * 5 : 0; // Slight upward trend after noon
    const price = basePrice + volatility + trend;
    prices.push(Math.round(price * 100) / 100);
  }
  
  return { hours, prices };
};

// Current market analysis for November 21, 2025
export const currentMarketAnalysis: MarketAnalysis = {
  date: "November 21, 2025",
  currentPrice: 26192.15,
  previousClose: 26052.65,
  dayHigh: 26246.65,
  dayLow: 26050.00,
  change: 139.50,
  changePercent: 0.54,
  volume: "2.4B",
  sentiment: "neutral",
};

// Technical levels for today
export const technicalLevels: TechnicalLevels = {
  resistance1: 26100,
  resistance2: 26200,
  currentPrice: 26068.15,
  support1: 26050,
  support2: 25980,
};

// Market factors affecting Nifty 50 (Updated: November 22, 2025)
export const marketFactors: MarketFactor[] = [
  {
    name: "AI Bubble Concerns",
    sentiment: "negative",
    description: "Global AI stocks showing cracks, Buffett Indicator at 200%+ (highest since dot-com bubble)",
    impact: "Major risk to global tech and Indian IT sector; could trigger broad market correction",
    weight: 9, // Very high importance - systemic risk
    source: "Economic Times",
    sourceUrl: "https://economictimes.indiatimes.com/markets/stocks/news/bubble-trouble-ai-rally-shows-cracks-as-investors-question-risks/articleshow/125498891.cms",
  },
  {
    name: "Rupee at All-Time Low",
    sentiment: "negative",
    description: "INR hits all-time low of 89.49 vs USD, significant depreciation from 83-84 levels",
    impact: "Negative for importers, positive for exporters/IT; increases imported inflation risk",
    weight: 8, // High importance - currency crisis
    source: "Reuters",
    sourceUrl: "https://www.reuters.com/markets/currencies/rupee-falls-record-low-8949-dollar-2025-11-21/",
  },
  {
    name: "FII Outflows Continue",
    sentiment: "negative",
    description: "FIIs net sellers for 3rd consecutive week (Nov 18-22: -₹2,847 Cr); DIIs supporting market",
    impact: "Selling pressure on large caps; market vulnerable to further downside without DII support",
    weight: 10, // Highest importance - direct market impact
    source: "Moneycontrol",
    sourceUrl: "https://www.moneycontrol.com/news/business/markets/fii-dii-data-foreign-institutional-investors-sell-shares-worth-rs-2847-crore-13688920.html",
  },
  {
    name: "Nifty Below Key Support",
    sentiment: "negative",
    description: "Nifty trading at 26,068 below 26,100 support level; breakdown could accelerate selling",
    impact: "Technical weakness; next support at 26,050 then 25,980 - critical for trend direction",
    weight: 7, // High importance - technical breakdown
    source: "NSE India",
    sourceUrl: "https://www.nseindia.com/market-data/live-equity-market?symbol=NIFTY%2050",
  },
  {
    name: "Bank Nifty Resilience",
    sentiment: "positive",
    description: "Banking sector showing relative strength; strong Q2 earnings support sector",
    impact: "Provides support to Nifty; sector rotation from IT to Banks could stabilize market",
    weight: 6, // Moderate-high importance - sector strength
    source: "Business Standard",
    sourceUrl: "https://www.business-standard.com/markets/news/bank-nifty-outperforms-nifty-50-strong-q2-earnings-support-banking-stocks-125112200345_1.html",
  },
];

// Trading recommendations
export const tradingRecommendations: TradingRecommendation[] = [
  {
    instrument: "NIFTY",
    strikePrice: 26300,
    optionType: "CE",
    entryPrice: 150.50,
    lotSize: 50,
    multiplier: 1,
    expiryDate: "28-Nov-2025", // Mock expiry date for testing
    type: "bull",
    title: "NIFTY 26300 CE Buy",
    description: "Initiate a bull trade only if Nifty 50 pulls back to the support zone and shows a clear bullish reversal pattern on your 4H chart.",
    keyLevels: "Support Zone: 26,050 – 26,100",
    rationale: "Despite FII outflows, DII support provides a floor. If Nifty holds 26,050 support and shows bullish reversal, it could attract value buyers. However, risk is elevated due to ongoing FII selling pressure.",
  },
  {
    instrument: "NIFTY",
    strikePrice: 26000,
    optionType: "PE",
    entryPrice: 120.00,
    lotSize: 50,
    multiplier: 1,
    expiryDate: "28-Nov-2025", // Mock expiry date for testing
    type: "bear",
    title: "NIFTY 26000 PE Buy",
    description: "Initiate a bear trade only if Nifty 50 reaches the resistance zone and shows a clear bearish reversal pattern (large bearish candle or double top) on your 4H chart.",
    keyLevels: "Resistance Zone: 26,280 – 26,350",
    rationale: "High-risk, high-reward counter-trend trade. The proximity to all-time high and overbought RSI makes a short-term correction possible.",
  },
  {
    instrument: "NIFTY",
    strikePrice: 26200,
    optionType: "CE",
    entryPrice: 0, // No entry price for no-trade
    lotSize: 50,
    multiplier: 1,
    expiryDate: "28-Nov-2025", // Mock expiry date for testing
    type: "no-trade",
    title: "Recommended for Open and Mid-Day",
    description: "Avoid trading if Nifty 50 is trading between 26,100 and 26,280. The market is likely to consolidate in this range, leading to choppy price action.",
    keyLevels: "Consolidation Range: 26,100 – 26,280",
    rationale: "The risk-reward ratio is poor in a tight range. Wait for the market to move to key zones before taking a position.",
  },
];

// Market news summaries
export const newsItems: NewsItem[] = [
  {
    title: "Nifty 50 Near Record High Amid Positive Sentiment",
    summary: "The NIFTY 50's rise is driven by strong FII inflows, favorable economic growth, and potential US trade deals boosting investor confidence.",
    impact: "positive",
    source: "Meyka",
  },
  {
    title: "Global Markets Weakness Signals Caution for Indian Indices",
    summary: "Weakness in global stocks amid renewed concerns over lofty AI valuations will likely pose a challenge to India's Nifty on Friday.",
    impact: "negative",
    source: "Bloomberg",
  },
  {
    title: "Indian Bank Stocks Hit New Peak on Rising Foreign Interest",
    summary: "Bank stocks are scaling new highs as foreign investors continue to show strong interest in the Indian financial sector.",
    impact: "positive",
    source: "Bloomberg",
  },
  {
    title: "Market Consolidation Expected as Nifty Tests All-Time High",
    summary: "After coming within touching distance of their respective all-time highs, benchmark indices are likely to consolidate and trade within a defined range.",
    impact: "neutral",
    source: "Moneycontrol",
  },
];

// FII/DII data (Updated: November 22, 2025 - Most recent trading day)
export const fiiDiiData = {
  date: "November 22, 2025 (Week: Nov 18-22)",
  diiNetBuy: 3456.78, // in Crores - DIIs supporting market
  fiiNetBuy: -2847.00, // in Crores - FIIs net sellers (negative = outflow)
  totalNetBuy: 609.78, // Net positive due to DII support offsetting FII outflows
  note: "FII outflows for 3rd consecutive week; DII buying preventing sharp correction",
};

// Market outlook summary
export const marketOutlook = {
  opening: "Flat to Slightly Negative",
  intradayTrend: "Consolidation and Volatility",
  overallBias: "Long-term Bullish, Short-term Sideways",
  description: "The market is at a critical juncture, balancing strong domestic momentum against cautious global sentiment. Consolidation and volatility are highly likely as the market digests the recent rally.",
};


// GIFT Nifty Performance Data
export interface GiftNiftyData {
  symbol: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: string;
  openInterest: string;
  timestamp: string;
}

// Comprehensive News Item with Category
export interface ComprehensiveNewsItem {
  id: string;
  title: string;
  summary: string;
  category: "international" | "national" | "market";
  impact: "positive" | "negative" | "neutral";
  source: string;
  timestamp: string;
  relevance: "high" | "medium" | "low";
  tags: string[];
}

// GIFT Nifty Performance Data
export const giftNiftyData: GiftNiftyData = {
  symbol: "GIFT Nifty",
  currentPrice: 26205,
  previousClose: 26192.15,
  change: 12.85,
  changePercent: 0.05,
  high: 26250,
  low: 26150,
  volume: "1.2M",
  openInterest: "2.8M",
  timestamp: "November 21, 2025 - 07:45 AM IST",
};

// Generate GIFT Nifty vs Nifty 50 comparison data
export const generateGiftNiftyChartData = () => {
  const basePrice = 26192;
  const hours = [];
  const niftyPrices = [];
  const giftPrices = [];

  for (let i = 0; i < 24; i++) {
    const hour = String(i).padStart(2, "0") + ":00";
    hours.push(hour);

    // Nifty 50 price
    const volatility = (Math.random() - 0.5) * 100;
    const trend = i > 12 ? (i - 12) * 5 : 0;
    const niftyPrice = basePrice + volatility + trend;
    niftyPrices.push(Math.round(niftyPrice * 100) / 100);

    // GIFT Nifty typically leads Nifty by a small margin
    const giftVolatility = (Math.random() - 0.5) * 100;
    const giftTrend = i > 12 ? (i - 12) * 5.2 : 0;
    const giftPrice = basePrice + 5 + giftVolatility + giftTrend; // GIFT typically trades 5-10 points higher
    giftPrices.push(Math.round(giftPrice * 100) / 100);
  }

  return { hours, niftyPrices, giftPrices };
};

// International News affecting Nifty
export const internationalNews: ComprehensiveNewsItem[] = [
  {
    id: "int-1",
    title: "US Fed Signals Pause in Rate Hikes Amid Inflation Concerns",
    summary:
      "The Federal Reserve indicated a potential pause in interest rate increases, citing moderating inflation. This could support emerging market investments including India.",
    category: "international",
    impact: "positive",
    source: "Reuters",
    timestamp: "November 21, 2025 - 06:30 AM",
    relevance: "high",
    tags: ["US Economy", "Interest Rates", "Global Markets"],
  },
  {
    id: "int-2",
    title: "Nasdaq Falls 2.5% on AI Valuation Concerns",
    summary:
      "US tech stocks declined sharply as investors reassess valuations of AI-related companies. This weakness in global tech could pressure Indian IT stocks.",
    category: "international",
    impact: "negative",
    source: "Bloomberg",
    timestamp: "November 20, 2025 - 11:45 PM",
    relevance: "high",
    tags: ["Tech Stocks", "AI Sector", "Global Selloff"],
  },
  {
    id: "int-3",
    title: "Oil Prices Stabilize Above $80 per Barrel",
    summary:
      "Crude oil prices remain stable, supporting energy stocks globally. This is positive for Indian energy sector and helps control inflation.",
    category: "international",
    impact: "positive",
    source: "CNBC",
    timestamp: "November 21, 2025 - 05:00 AM",
    relevance: "medium",
    tags: ["Commodities", "Oil", "Energy Sector"],
  },
  {
    id: "int-4",
    title: "China's Manufacturing PMI Falls to 49.5, Signaling Contraction",
    summary:
      "China's manufacturing activity contracted in November, raising concerns about global economic growth. This could impact Indian export-oriented sectors.",
    category: "international",
    impact: "negative",
    source: "Financial Times",
    timestamp: "November 20, 2025 - 10:00 PM",
    relevance: "medium",
    tags: ["China Economy", "Global Growth", "Manufacturing"],
  },
  {
    id: "int-5",
    title: "European Central Bank Holds Rates Steady at 4.5%",
    summary:
      "The ECB maintained interest rates, indicating a cautious approach to monetary policy. This supports stability in European markets and emerging market flows.",
    category: "international",
    impact: "neutral",
    source: "ECB Official",
    timestamp: "November 21, 2025 - 02:00 AM",
    relevance: "low",
    tags: ["Europe", "Monetary Policy", "Interest Rates"],
  },
];

// National News affecting Nifty
export const nationalNews: ComprehensiveNewsItem[] = [
  {
    id: "nat-1",
    title: "RBI Likely to Keep Rates Unchanged at December Meeting",
    summary:
      "Reserve Bank of India is expected to maintain the repo rate at 6.5% in December, supporting market sentiment and corporate profitability.",
    category: "national",
    impact: "positive",
    source: "Economic Times",
    timestamp: "November 21, 2025 - 07:15 AM",
    relevance: "high",
    tags: ["RBI", "Monetary Policy", "Interest Rates"],
  },
  {
    id: "nat-2",
    title: "India's Q2 GDP Growth Slows to 5.4% YoY",
    summary:
      "India's economic growth moderated in Q2 FY2025-26, but remains resilient compared to global peers. This could prompt policy support measures.",
    category: "national",
    impact: "negative",
    source: "Ministry of Statistics",
    timestamp: "November 20, 2025 - 05:30 PM",
    relevance: "high",
    tags: ["GDP", "Economic Growth", "India Economy"],
  },
  {
    id: "nat-3",
    title: "Rupee Strengthens to 83.45 Against US Dollar",
    summary:
      "The Indian rupee appreciated against the dollar, supported by strong FII inflows and stable domestic fundamentals. This benefits exporters and IT companies.",
    category: "national",
    impact: "positive",
    source: "RBI Data",
    timestamp: "November 21, 2025 - 06:00 AM",
    relevance: "high",
    tags: ["Rupee", "Currency", "FII Flows"],
  },
  {
    id: "nat-4",
    title: "Inflation Eases to 5.5% in October, Within RBI Target",
    summary:
      "Consumer price inflation declined to 5.5% in October, moving closer to the RBI's 4% target. This supports the case for rate cuts in 2026.",
    category: "national",
    impact: "positive",
    source: "Ministry of Statistics",
    timestamp: "November 20, 2025 - 04:00 PM",
    relevance: "high",
    tags: ["Inflation", "RBI Target", "Monetary Policy"],
  },
  {
    id: "nat-5",
    title: "Government Announces Infrastructure Investment Boost of ₹5 Lakh Crore",
    summary:
      "The government announced a major infrastructure push aimed at boosting economic growth. This is positive for construction, cement, and steel stocks.",
    category: "national",
    impact: "positive",
    source: "PIB",
    timestamp: "November 19, 2025 - 11:00 AM",
    relevance: "high",
    tags: ["Infrastructure", "Government Policy", "Capital Expenditure"],
  },
];

// Market-specific news
export const marketNews: ComprehensiveNewsItem[] = [
  {
    id: "mkt-1",
    title: "Bank Nifty Hits Record High on Strong Q2 Earnings",
    summary:
      "Banking stocks surged to record highs as major banks reported strong Q2 results with improved asset quality and margins.",
    category: "market",
    impact: "positive",
    source: "Moneycontrol",
    timestamp: "November 21, 2025 - 06:45 AM",
    relevance: "high",
    tags: ["Banking Sector", "Earnings", "Stock Market"],
  },
  {
    id: "mkt-2",
    title: "IT Stocks Under Pressure Amid Global Tech Selloff",
    summary:
      "Indian IT companies declined as global tech stocks faced headwinds. Infosys and TCS were among the top drags on the Nifty 50.",
    category: "market",
    impact: "negative",
    source: "Economic Times",
    timestamp: "November 20, 2025 - 03:30 PM",
    relevance: "high",
    tags: ["IT Sector", "Tech Stocks", "Global Markets"],
  },
  {
    id: "mkt-3",
    title: "Pharma Stocks Rally on Strong Domestic Demand",
    summary:
      "Pharmaceutical companies gained on expectations of strong domestic demand and stable pricing. Sector showing resilience amid market volatility.",
    category: "market",
    impact: "positive",
    source: "Business Standard",
    timestamp: "November 21, 2025 - 05:30 AM",
    relevance: "medium",
    tags: ["Pharma Sector", "Domestic Demand", "Healthcare"],
  },
  {
    id: "mkt-4",
    title: "Auto Stocks Consolidate as Demand Outlook Remains Mixed",
    summary:
      "Automobile sector stocks are consolidating as manufacturers navigate mixed demand signals and rising raw material costs.",
    category: "market",
    impact: "neutral",
    source: "Mint",
    timestamp: "November 20, 2025 - 02:00 PM",
    relevance: "medium",
    tags: ["Auto Sector", "Demand", "Manufacturing"],
  },
  {
    id: "mkt-5",
    title: "Realty Stocks Gain on Affordable Housing Boost",
    summary:
      "Real estate stocks rallied on government initiatives to boost affordable housing and improved home loan demand.",
    category: "market",
    impact: "positive",
    source: "Financial Express",
    timestamp: "November 19, 2025 - 10:30 AM",
    relevance: "medium",
    tags: ["Real Estate", "Housing", "Government Policy"],
  },
];
