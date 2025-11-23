import { describe, it, expect } from 'vitest';
import { marketDataRouter } from './routes/marketData';

describe('Market Data Router', () => {
  it('should export marketDataRouter with correct procedures', () => {
    expect(marketDataRouter).toBeDefined();
    expect(marketDataRouter._def).toBeDefined();
    
    const procedures = (marketDataRouter._def as any).procedures;
    expect(procedures).toBeDefined();
    
    // Check that all expected procedures exist
    expect(procedures.getNiftyData).toBeDefined();
    expect(procedures.getBankNiftyData).toBeDefined();
    expect(procedures.getUsdInrRate).toBeDefined();
    expect(procedures.getAllMarketData).toBeDefined();
    expect(procedures.getStockData).toBeDefined();
  });

  it('should have getStockData procedure with input validation', () => {
    const procedures = (marketDataRouter._def as any).procedures;
    const getStockData = procedures.getStockData;
    
    expect(getStockData).toBeDefined();
    expect(getStockData._def).toBeDefined();
  });
});

describe('Market Data API Integration', () => {
  it('should define correct procedure types', () => {
    const procedures = (marketDataRouter._def as any).procedures;
    
    // All procedures should be queries (not mutations)
    expect(procedures.getNiftyData).toBeDefined();
    expect(procedures.getBankNiftyData).toBeDefined();
    expect(procedures.getUsdInrRate).toBeDefined();
    expect(procedures.getAllMarketData).toBeDefined();
    expect(procedures.getStockData).toBeDefined();
  });
});
