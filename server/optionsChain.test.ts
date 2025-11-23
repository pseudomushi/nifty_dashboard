import { describe, it, expect } from 'vitest';
import { optionsChainRouter } from './routes/optionsChain';

describe('optionsChainRouter', () => {
  it('should have getOptionsChain procedure', () => {
    expect(optionsChainRouter._def.procedures.getOptionsChain).toBeDefined();
  });

  it('should have getOptionsByExpiry procedure', () => {
    expect(optionsChainRouter._def.procedures.getOptionsByExpiry).toBeDefined();
  });

  it('should have getATMOptions procedure', () => {
    expect(optionsChainRouter._def.procedures.getATMOptions).toBeDefined();
  });

  it('should have getExpiryDates procedure', () => {
    expect(optionsChainRouter._def.procedures.getExpiryDates).toBeDefined();
  });
});
