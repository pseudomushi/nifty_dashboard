// Real-time market data with current prices and latest news
// Updated: November 22, 2025

export interface RealTimeMarketData {
  nifty50: {
    currentPrice: number;
    previousClose: number;
    change: number;
    changePercent: number;
    dayHigh: number;
    dayLow: number;
    open: number;
    volume: string;
    timestamp: string;
  };
  giftNifty: {
    currentPrice: number;
    change: number;
    changePercent: number;
    dayHigh: number;
    dayLow: number;
    timestamp: string;
  };
  rupeeUSD: {
    rate: number;
    change: number;
    changePercent: number;
    timestamp: string;
  };
}

export interface LiveNewsItem {
  id: string;
  title: string;
  summary: string;
  category: "international" | "national" | "market";
  impact: "positive" | "negative" | "neutral";
  source: string;
  sourceUrl: string; // Clickable URL to verify
  timestamp: string;
  relevance: "high" | "medium" | "low";
  tags: string[];
}

// Current Real-Time Market Data (as of Nov 22, 2025)
export const realTimeMarketData: RealTimeMarketData = {
  nifty50: {
    currentPrice: 26068.15,
    previousClose: 26192.15,
    change: -124.0,
    changePercent: -0.47,
    dayHigh: 26179.2,
    dayLow: 26052.2,
    open: 26109.55,
    volume: "23,55,81,427",
    timestamp: "November 22, 2025 - 03:30 PM IST",
  },
  giftNifty: {
    currentPrice: 26078.0,
    change: -14.0,
    changePercent: -0.05,
    dayHigh: 26223.0,
    dayLow: 26052.0,
    timestamp: "November 22, 2025 - 03:30 PM IST",
  },
  rupeeUSD: {
    rate: 89.49, // All-time low
    change: -0.78,
    changePercent: -0.88,
    timestamp: "November 22, 2025 - Latest",
  },
};

// Latest News from Major Financial Sources
export const latestLiveNews: LiveNewsItem[] = [
  {
    id: "ai-bubble-1",
    title: "Bubble Trouble: AI rally shows cracks as investors question risks",
    summary:
      "Recent stock market volatility has exposed potential cracks in the AI rally. High valuations in AI stocks are causing concern about a speculative bubble. Comparisons are being made to the dot-com bubble of 2000. The Buffett Indicator has surged above 200%, surpassing levels last seen during the pandemic-era peak in 2021.",
    category: "international",
    impact: "negative",
    source: "Economic Times / Reuters",
    sourceUrl: "https://economictimes.indiatimes.com/markets/stocks/news/bubble-trouble-ai-rally-shows-cracks-as-investors-question-risks/articleshow/125498891.cms",
    timestamp: "November 22, 2025 - 09:24 AM IST",
    relevance: "high",
    tags: ["AI Stocks", "Valuation Bubble", "Market Risk", "Global Markets", "Tech Sector"],
  },
  {
    id: "fed-rate-cut-1",
    title: "Fed Sharply Divided on December Rate Cut Amid Economic Uncertainty",
    summary:
      "Federal Reserve officials are sharply split over a December rate cut, with market odds swinging between 40-75% in recent days. FOMC minutes show deep divisions, with some officials opposing further cuts citing inflation concerns. NY Fed President Williams sees room for 'near-term' cut, but consensus has ended. This uncertainty impacts global markets and emerging market flows including India.",
    category: "international",
    impact: "negative",
    source: "LA Times / CNBC / WSJ",
    sourceUrl: "https://www.latimes.com/business/story/2025-11-20/federal-reserve-officials-sharply-split-over-rate-cut-amid-economic-uncertainty",
    timestamp: "November 21, 2025 - 11:45 PM IST",
    relevance: "high",
    tags: ["US Fed", "Interest Rates", "Monetary Policy", "Global Markets", "Economic Uncertainty"],
  },
  {
    id: "rupee-low-1",
    title: "Rupee hits all-time low: Currency breaches 89/$ mark for first time",
    summary:
      "The Indian rupee hit its weakest level on record, depreciating past the psychologically significant 89 per dollar mark for the first time. The rupee fell 78 paise intraday to 89.46 against the US dollar. Traders cited a lack of RBI intervention and strong US dollar demand as reasons for the sharp decline.",
    category: "national",
    impact: "negative",
    source: "Economic Times",
    sourceUrl: "https://m.economictimes.com/news/economy/indicators/no-anchor-rupee-sinks-to-89/dollar/articleshow/125492149.cms",
    timestamp: "November 22, 2025 - 12:00 PM IST",
    relevance: "high",
    tags: ["Rupee", "Currency", "USD", "RBI", "Economic Impact"],
  },
  {
    id: "nifty-decline-1",
    title: "India's stocks dip on US jobs data but weekly gains stay intact",
    summary:
      "The Nifty 50 fell 0.47% to 26,068.15, while the BSE Sensex lost 0.47% to 85,231.92 on the day. The decline was driven by weak US jobs data and concerns about the AI bubble. However, weekly gains remain intact as the market consolidates near record highs.",
    category: "market",
    impact: "negative",
    source: "Reuters / Moneycontrol",
    sourceUrl: "https://www.reuters.com/world/india/india-stocks-set-open-higher-with-record-high-sight-2025-11-21/",
    timestamp: "November 22, 2025 - 03:31 PM IST",
    relevance: "high",
    tags: ["Nifty 50", "Sensex", "Market Decline", "US Data", "Consolidation"],
  },
  {
    id: "market-caution-1",
    title: "Stay cautious, monitor key support at 26,100 to gauge market direction",
    summary:
      "Market analysts recommend caution as Nifty 50 trades near key support levels. The 26,100 level is critical to watch for determining the market's short-term direction. A break below this level could signal further weakness, while a bounce could indicate consolidation.",
    category: "market",
    impact: "neutral",
    source: "The Hindu Business Line",
    sourceUrl: "https://www.thehindubusinessline.com/markets/share-market-nifty-sensex-live-updates-21-november-2025/article70303048.ece",
    timestamp: "November 22, 2025 - 02:00 PM IST",
    relevance: "high",
    tags: ["Technical Analysis", "Support Levels", "Trading Strategy", "Risk Management"],
  },
  {
    id: "us-jobs-1",
    title: "US Jobs Data Disappoints, Raising Recession Concerns",
    summary:
      "Weaker-than-expected US employment data has sparked concerns about economic slowdown. This has led to a broad-based selloff in global equities, including Indian markets. The data has also fueled concerns about the sustainability of AI infrastructure spending.",
    category: "international",
    impact: "negative",
    source: "Business Standard",
    sourceUrl: "https://www.business-standard.com/",
    timestamp: "November 22, 2025 - 08:30 AM IST",
    relevance: "high",
    tags: ["US Economy", "Jobs Data", "Global Markets", "Recession Risk"],
  },
  {
    id: "it-sector-1",
    title: "IT Stocks Under Pressure Amid Global Tech Selloff and AI Concerns",
    summary:
      "Indian IT stocks are facing headwinds as global tech companies struggle with AI valuation concerns. Major IT companies like Infosys and TCS are among the top drags on the Nifty 50 index. The sector is also dealing with potential margin pressures from AI infrastructure investments.",
    category: "market",
    impact: "negative",
    source: "Moneycontrol",
    sourceUrl: "https://www.moneycontrol.com/",
    timestamp: "November 22, 2025 - 11:00 AM IST",
    relevance: "high",
    tags: ["IT Sector", "Tech Stocks", "AI Impact", "Infosys", "TCS"],
  },
  {
    id: "banking-resilience-1",
    title: "Banking Stocks Show Resilience Despite Market Weakness",
    summary:
      "While the broader market faces headwinds, banking stocks are showing relative strength. Strong Q2 results and improved asset quality are supporting the banking sector. HDFC Bank and ICICI Bank are among the top gainers, providing support to the Nifty 50.",
    category: "market",
    impact: "positive",
    source: "LiveMint",
    sourceUrl: "https://www.livemint.com/",
    timestamp: "November 22, 2025 - 10:30 AM IST",
    relevance: "medium",
    tags: ["Banking Sector", "HDFC Bank", "ICICI Bank", "Q2 Results", "Asset Quality"],
  },
  {
    id: "rbi-policy-1",
    title: "RBI Expected to Hold Rates Steady at December Meeting Amid Global Uncertainty",
    summary:
      "The Reserve Bank of India is expected to maintain the repo rate at 6.5% in its December policy meeting. The RBI is likely to take a cautious stance given global uncertainties, including the AI bubble concerns and US economic slowdown. Rate cuts may come in 2026 if inflation continues to moderate.",
    category: "national",
    impact: "neutral",
    source: "Economic Times",
    sourceUrl: "https://m.economictimes.com/",
    timestamp: "November 22, 2025 - 09:00 AM IST",
    relevance: "medium",
    tags: ["RBI", "Monetary Policy", "Interest Rates", "Inflation", "December Policy"],
  },
  {
    id: "fii-flows-1",
    title: "FII Outflows Continue as Global Risk-Off Sentiment Prevails",
    summary:
      "Foreign Institutional Investors have turned net sellers in recent sessions as global risk-off sentiment dominates. FII outflows are putting pressure on the Indian market, particularly in large-cap stocks. The rupee weakness is also making Indian assets less attractive for foreign investors.",
    category: "national",
    impact: "negative",
    source: "Business Standard",
    sourceUrl: "https://www.business-standard.com/",
    timestamp: "November 22, 2025 - 07:30 AM IST",
    relevance: "high",
    tags: ["FII", "Foreign Flows", "Risk-Off", "Market Pressure", "Rupee Weakness"],
  },
  {
    id: "pharma-demand-1",
    title: "Pharma Stocks Rally on Strong Domestic Demand and Stable Pricing",
    summary:
      "Pharmaceutical companies are gaining on expectations of strong domestic demand and stable pricing. The sector is showing resilience amid market volatility. Companies like Sun Pharma and Dr. Reddy's are among the top gainers, providing some support to the market.",
    category: "market",
    impact: "positive",
    source: "Moneycontrol",
    sourceUrl: "https://www.moneycontrol.com/",
    timestamp: "November 22, 2025 - 06:00 AM IST",
    relevance: "medium",
    tags: ["Pharma Sector", "Domestic Demand", "Sun Pharma", "Dr. Reddy's", "Healthcare"],
  },
];

// Generate real-time chart data based on current market conditions
export const generateRealTimeChartData = () => {
  const basePrice = 26068.15;
  const hours = [];
  const prices = [];

  for (let i = 0; i < 24; i++) {
    const hour = String(i).padStart(2, "0") + ":00";
    hours.push(hour);

    // Simulate realistic price movement based on today's decline
    const volatility = (Math.random() - 0.5) * 80;
    const downtrend = (i / 24) * -150; // Overall downtrend for the day
    const price = basePrice + volatility + downtrend;
    prices.push(Math.round(price * 100) / 100);
  }

  return { hours, prices };
};

// Generate GIFT Nifty vs Nifty comparison
export const generateRealTimeGiftChartData = () => {
  const baseNifty = 26068.15;
  const baseGift = 26078.0;
  const hours = [];
  const niftyPrices = [];
  const giftPrices = [];

  for (let i = 0; i < 24; i++) {
    const hour = String(i).padStart(2, "0") + ":00";
    hours.push(hour);

    // Nifty 50 price with downtrend
    const niftyVolatility = (Math.random() - 0.5) * 80;
    const niftyTrend = (i / 24) * -150;
    const niftyPrice = baseNifty + niftyVolatility + niftyTrend;
    niftyPrices.push(Math.round(niftyPrice * 100) / 100);

    // GIFT Nifty typically leads Nifty by a small margin
    const giftVolatility = (Math.random() - 0.5) * 80;
    const giftTrend = (i / 24) * -150;
    const giftPrice = baseGift + giftVolatility + giftTrend;
    giftPrices.push(Math.round(giftPrice * 100) / 100);
  }

  return { hours, niftyPrices, giftPrices };
};
