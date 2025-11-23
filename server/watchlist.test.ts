import { describe, it, expect } from "vitest";
import { watchlistRouter } from "./routes/watchlist";

describe("Watchlist Router", () => {
  it("should export watchlistRouter with correct procedures", () => {
    expect(watchlistRouter).toBeDefined();
    expect(watchlistRouter._def).toBeDefined();
    
    // Check that all expected procedures exist
    const procedures = watchlistRouter._def.procedures;
    expect(procedures.getActiveTrades).toBeDefined();
    expect(procedures.getAllTrades).toBeDefined();
    expect(procedures.addTrade).toBeDefined();
    expect(procedures.updateTrade).toBeDefined();
    expect(procedures.deleteTrade).toBeDefined();
  });

  it("should have correct procedure types", () => {
    const procedures = watchlistRouter._def.procedures;
    
    // getActiveTrades and getAllTrades should be queries
    expect(procedures.getActiveTrades._def._config.procedure).toBe("query");
    expect(procedures.getAllTrades._def._config.procedure).toBe("query");
    
    // addTrade, updateTrade, deleteTrade should be mutations
    expect(procedures.addTrade._def._config.procedure).toBe("mutation");
    expect(procedures.updateTrade._def._config.procedure).toBe("mutation");
    expect(procedures.deleteTrade._def._config.procedure).toBe("mutation");
  });
});

describe("Watchlist Schema Validation", () => {
  it("should validate addTrade input schema", () => {
    const procedures = watchlistRouter._def.procedures;
    const addTradeProcedure = procedures.addTrade;
    
    // Valid input should pass
    const validInput = {
      optionType: "CE" as const,
      strikePrice: 26100,
      expiryDate: "28 Nov 2024",
      entryPrice: "150.50",
      entryDate: new Date(),
      quantity: 1,
      stopLoss: "120.00",
      target1: "180.00",
      target2: "210.00",
      delta: "0.65",
      gamma: "0.002",
      theta: "-8.5",
      vega: "12.3",
      iv: "18.5",
      notes: "Test trade",
    };
    
    // This should not throw
    expect(() => {
      addTradeProcedure._def._config.input?.parse(validInput);
    }).not.toThrow();
  });

  it("should reject invalid addTrade input", () => {
    const procedures = watchlistRouter._def.procedures;
    const addTradeProcedure = procedures.addTrade;
    
    // Invalid input (missing required fields)
    const invalidInput = {
      optionType: "CE" as const,
      strikePrice: 26100,
      // Missing expiryDate, entryPrice, etc.
    };
    
    // This should throw
    expect(() => {
      addTradeProcedure._def._config.input?.parse(invalidInput);
    }).toThrow();
  });

  it("should validate updateTrade input schema", () => {
    const procedures = watchlistRouter._def.procedures;
    const updateTradeProcedure = procedures.updateTrade;
    
    // Valid input should pass
    const validInput = {
      id: 1,
      status: "closed" as const,
      exitPrice: "160.00",
      exitDate: new Date(),
      notes: "Closed with profit",
    };
    
    // This should not throw
    expect(() => {
      updateTradeProcedure._def._config.input?.parse(validInput);
    }).not.toThrow();
  });

  it("should validate deleteTrade input schema", () => {
    const procedures = watchlistRouter._def.procedures;
    const deleteTradeProcedure = procedures.deleteTrade;
    
    // Valid input should pass
    const validInput = {
      id: 1,
    };
    
    // This should not throw
    expect(() => {
      deleteTradeProcedure._def._config.input?.parse(validInput);
    }).not.toThrow();
  });

  it("should reject invalid trade ID", () => {
    const procedures = watchlistRouter._def.procedures;
    const deleteTradeProcedure = procedures.deleteTrade;
    
    // Invalid input (negative ID)
    const invalidInput = {
      id: -1,
    };
    
    // This should throw
    expect(() => {
      deleteTradeProcedure._def._config.input?.parse(invalidInput);
    }).toThrow();
  });
});
