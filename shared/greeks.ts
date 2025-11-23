/**
 * Greeks Calculation Library using Black-Scholes Model
 * 
 * Calculates option Greeks (Delta, Gamma, Theta, Vega, Rho) for European-style options
 * Based on the Black-Scholes-Merton model
 */

/**
 * Standard normal cumulative distribution function
 * Approximation using Abramowitz and Stegun formula
 */
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  
  return x > 0 ? 1 - probability : probability;
}

/**
 * Standard normal probability density function
 */
function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Calculate d1 parameter for Black-Scholes
 */
function calculateD1(S: number, K: number, T: number, r: number, sigma: number): number {
  return (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
}

/**
 * Calculate d2 parameter for Black-Scholes
 */
function calculateD2(d1: number, sigma: number, T: number): number {
  return d1 - sigma * Math.sqrt(T);
}

export interface OptionGreeks {
  delta: number;      // Rate of change of option price with respect to underlying price
  gamma: number;      // Rate of change of delta with respect to underlying price
  theta: number;      // Rate of change of option price with respect to time (per day)
  vega: number;       // Rate of change of option price with respect to volatility (per 1% change)
  rho: number;        // Rate of change of option price with respect to interest rate (per 1% change)
}

export interface OptionPricing {
  theoreticalPrice: number;
  intrinsicValue: number;
  timeValue: number;
  greeks: OptionGreeks;
}

export interface BlackScholesParams {
  S: number;          // Current price of underlying asset
  K: number;          // Strike price
  T: number;          // Time to expiration (in years)
  r: number;          // Risk-free interest rate (as decimal, e.g., 0.06 for 6%)
  sigma: number;      // Implied volatility (as decimal, e.g., 0.20 for 20%)
  optionType: 'call' | 'put';
}

/**
 * Calculate Call option price and Greeks using Black-Scholes
 */
export function calculateCallGreeks(params: BlackScholesParams): OptionPricing {
  const { S, K, T, r, sigma } = params;
  
  // Handle edge cases
  if (T <= 0) {
    const intrinsicValue = Math.max(S - K, 0);
    return {
      theoreticalPrice: intrinsicValue,
      intrinsicValue,
      timeValue: 0,
      greeks: {
        delta: S > K ? 1 : 0,
        gamma: 0,
        theta: 0,
        vega: 0,
        rho: 0,
      },
    };
  }
  
  const d1 = calculateD1(S, K, T, r, sigma);
  const d2 = calculateD2(d1, sigma, T);
  
  const Nd1 = normalCDF(d1);
  const Nd2 = normalCDF(d2);
  const nd1 = normalPDF(d1);
  
  // Call option price
  const callPrice = S * Nd1 - K * Math.exp(-r * T) * Nd2;
  
  // Greeks
  const delta = Nd1;
  const gamma = nd1 / (S * sigma * Math.sqrt(T));
  const theta = (-(S * nd1 * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * Nd2) / 365; // Per day
  const vega = (S * nd1 * Math.sqrt(T)) / 100; // Per 1% change in volatility
  const rho = (K * T * Math.exp(-r * T) * Nd2) / 100; // Per 1% change in interest rate
  
  const intrinsicValue = Math.max(S - K, 0);
  const timeValue = Math.max(callPrice - intrinsicValue, 0);
  
  return {
    theoreticalPrice: callPrice,
    intrinsicValue,
    timeValue,
    greeks: {
      delta,
      gamma,
      theta,
      vega,
      rho,
    },
  };
}

/**
 * Calculate Put option price and Greeks using Black-Scholes
 */
export function calculatePutGreeks(params: BlackScholesParams): OptionPricing {
  const { S, K, T, r, sigma } = params;
  
  // Handle edge cases
  if (T <= 0) {
    const intrinsicValue = Math.max(K - S, 0);
    return {
      theoreticalPrice: intrinsicValue,
      intrinsicValue,
      timeValue: 0,
      greeks: {
        delta: S < K ? -1 : 0,
        gamma: 0,
        theta: 0,
        vega: 0,
        rho: 0,
      },
    };
  }
  
  const d1 = calculateD1(S, K, T, r, sigma);
  const d2 = calculateD2(d1, sigma, T);
  
  const Nd1 = normalCDF(d1);
  const Nd2 = normalCDF(d2);
  const nd1 = normalPDF(d1);
  
  // Put option price
  const putPrice = K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
  
  // Greeks
  const delta = Nd1 - 1; // Put delta is negative
  const gamma = nd1 / (S * sigma * Math.sqrt(T));
  const theta = (-(S * nd1 * sigma) / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * normalCDF(-d2)) / 365; // Per day
  const vega = (S * nd1 * Math.sqrt(T)) / 100; // Per 1% change in volatility
  const rho = (-K * T * Math.exp(-r * T) * normalCDF(-d2)) / 100; // Per 1% change in interest rate
  
  const intrinsicValue = Math.max(K - S, 0);
  const timeValue = Math.max(putPrice - intrinsicValue, 0);
  
  return {
    theoreticalPrice: putPrice,
    intrinsicValue,
    timeValue,
    greeks: {
      delta,
      gamma,
      theta,
      vega,
      rho,
    },
  };
}

/**
 * Calculate option price and Greeks (auto-detects Call or Put)
 */
export function calculateOptionGreeks(params: BlackScholesParams): OptionPricing {
  if (params.optionType === 'call') {
    return calculateCallGreeks(params);
  } else {
    return calculatePutGreeks(params);
  }
}

/**
 * Calculate time to expiration in years from expiry date string
 * @param expiryDate - Date string in format "DD-MMM-YYYY" (e.g., "25-Nov-2025")
 * @returns Time to expiration in years
 */
export function calculateTimeToExpiry(expiryDate: string): number {
  // Parse date in format "DD-MMM-YYYY"
  const months: Record<string, number> = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  const parts = expiryDate.split('-');
  if (parts.length !== 3) {
    throw new Error(`Invalid expiry date format: ${expiryDate}`);
  }
  
  const day = parseInt(parts[0], 10);
  const month = months[parts[1]];
  const year = parseInt(parts[2], 10);
  
  if (month === undefined) {
    throw new Error(`Invalid month in expiry date: ${parts[1]}`);
  }
  
  const expiryDateTime = new Date(year, month, day, 15, 30, 0); // NSE expiry at 3:30 PM IST
  const now = new Date();
  
  const diffMs = expiryDateTime.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const diffYears = diffDays / 365;
  
  return Math.max(diffYears, 0); // Return 0 if expired
}

/**
 * Helper function to calculate Greeks for NSE options data
 * @param spotPrice - Current Nifty/BankNifty price
 * @param strikePrice - Option strike price
 * @param expiryDate - Expiry date string (DD-MMM-YYYY)
 * @param impliedVolatility - IV from NSE (as percentage, e.g., 18.5)
 * @param optionType - 'call' or 'put'
 * @param riskFreeRate - Risk-free rate (default 6.5% for India)
 * @returns OptionPricing with Greeks
 */
export function calculateNSEOptionGreeks(
  spotPrice: number,
  strikePrice: number,
  expiryDate: string,
  impliedVolatility: number,
  optionType: 'call' | 'put',
  riskFreeRate: number = 0.065 // 6.5% default for India (10-year G-Sec yield)
): OptionPricing {
  const T = calculateTimeToExpiry(expiryDate);
  const sigma = impliedVolatility / 100; // Convert percentage to decimal
  
  return calculateOptionGreeks({
    S: spotPrice,
    K: strikePrice,
    T,
    r: riskFreeRate,
    sigma,
    optionType,
  });
}

/**
 * Calculate implied volatility using Newton-Raphson method
 * (For future use - currently NSE provides IV directly)
 */
export function calculateImpliedVolatility(
  marketPrice: number,
  spotPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number,
  optionType: 'call' | 'put',
  tolerance: number = 0.0001,
  maxIterations: number = 100
): number {
  let sigma = 0.3; // Initial guess: 30% volatility
  
  for (let i = 0; i < maxIterations; i++) {
    const pricing = calculateOptionGreeks({
      S: spotPrice,
      K: strikePrice,
      T: timeToExpiry,
      r: riskFreeRate,
      sigma,
      optionType,
    });
    
    const priceDiff = pricing.theoreticalPrice - marketPrice;
    
    if (Math.abs(priceDiff) < tolerance) {
      return sigma * 100; // Return as percentage
    }
    
    // Newton-Raphson: sigma_new = sigma_old - f(sigma) / f'(sigma)
    // f'(sigma) = vega
    if (pricing.greeks.vega > 0) {
      sigma = sigma - priceDiff / (pricing.greeks.vega * 100);
    } else {
      break;
    }
    
    // Keep sigma within reasonable bounds
    sigma = Math.max(0.01, Math.min(sigma, 3.0));
  }
  
  return sigma * 100; // Return as percentage
}
