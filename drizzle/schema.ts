import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Trade watchlist table for tracking user's Nifty 50 option trades.
 * Stores trade details, Greeks, targets, stop loss, and current status.
 */
export const tradeWatchlist = mysqlTable("tradeWatchlist", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Foreign key to users table
  
  // Trade Details
  optionType: mysqlEnum("optionType", ["CE", "PE"]).notNull(), // Call or Put
  strikePrice: int("strikePrice").notNull(),
  expiryDate: varchar("expiryDate", { length: 20 }).notNull(), // e.g., "28 Nov 2024"
  
  // Entry Details
  entryPrice: varchar("entryPrice", { length: 20 }).notNull(), // Stored as string to avoid decimal issues
  entryDate: timestamp("entryDate").notNull(),
  quantity: int("quantity").notNull(),
  
  // Targets and Stop Loss
  stopLoss: varchar("stopLoss", { length: 20 }).notNull(),
  target1: varchar("target1", { length: 20 }).notNull(),
  target2: varchar("target2", { length: 20 }),
  
  // Greeks (stored at entry time)
  delta: varchar("delta", { length: 20 }),
  gamma: varchar("gamma", { length: 20 }),
  theta: varchar("theta", { length: 20 }),
  vega: varchar("vega", { length: 20 }),
  iv: varchar("iv", { length: 20 }), // Implied Volatility
  
  // Trade Status
  status: mysqlEnum("status", ["active", "closed"]).default("active").notNull(),
  exitPrice: varchar("exitPrice", { length: 20 }),
  exitDate: timestamp("exitDate"),
  
  // Notes
  notes: text("notes"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TradeWatchlist = typeof tradeWatchlist.$inferSelect;
export type InsertTradeWatchlist = typeof tradeWatchlist.$inferInsert;