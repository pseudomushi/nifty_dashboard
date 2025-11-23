import { z } from "zod";
import { getDb } from "../db";
import { tradeWatchlist } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";

// Validation schemas
const addTradeSchema = z.object({
  optionType: z.enum(["CE", "PE"]),
  strikePrice: z.number().int().positive(),
  expiryDate: z.string(),
  entryPrice: z.string(),
  entryDate: z.date(),
  quantity: z.number().int().positive(),
  stopLoss: z.string(),
  target1: z.string(),
  target2: z.string().optional(),
  delta: z.string().optional(),
  gamma: z.string().optional(),
  theta: z.string().optional(),
  vega: z.string().optional(),
  iv: z.string().optional(),
  notes: z.string().optional(),
});

const updateTradeSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(["active", "closed"]).optional(),
  exitPrice: z.string().optional(),
  exitDate: z.date().optional(),
  notes: z.string().optional(),
});

const deleteTradeSchema = z.object({
  id: z.number().int().positive(),
});

export const watchlistRouter = router({
  // Get all active trades for the current user
  getActiveTrades: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    
    const trades = await db
      .select()
      .from(tradeWatchlist)
      .where(
        and(
          eq(tradeWatchlist.userId, ctx.user.id),
          eq(tradeWatchlist.status, "active")
        )
      )
      .orderBy(desc(tradeWatchlist.createdAt));
    
    return trades;
  }),

  // Get all trades (active + closed) for the current user
  getAllTrades: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    
    const trades = await db
      .select()
      .from(tradeWatchlist)
      .where(eq(tradeWatchlist.userId, ctx.user.id))
      .orderBy(desc(tradeWatchlist.createdAt));
    
    return trades;
  }),

  // Add a new trade to watchlist
  addTrade: protectedProcedure
    .input(addTradeSchema)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [newTrade] = await db.insert(tradeWatchlist).values({
        userId: ctx.user.id,
        ...input,
      });

      return { success: true, tradeId: newTrade.insertId };
    }),

  // Update an existing trade
  updateTrade: protectedProcedure
    .input(updateTradeSchema)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { id, ...updates } = input;

      await db
        .update(tradeWatchlist)
        .set(updates)
        .where(
          and(
            eq(tradeWatchlist.id, id),
            eq(tradeWatchlist.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),

  // Delete a trade from watchlist
  deleteTrade: protectedProcedure
    .input(deleteTradeSchema)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db
        .delete(tradeWatchlist)
        .where(
          and(
            eq(tradeWatchlist.id, input.id),
            eq(tradeWatchlist.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),
});
