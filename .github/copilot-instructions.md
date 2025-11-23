# Nifty Dashboard - Copilot Instructions

This document provides essential guidance for AI agents working on the Nifty Dashboard codebase.

## Project Overview

**Nifty Dashboard** is a real-time financial trading dashboard for NSE (Indian stock market) options trading, specifically for NIFTY 50 and BANKNIFTY indices. It combines live market data, technical analysis, AI-powered trading recommendations, and P&L calculations for options contracts.

### Tech Stack
- **Frontend**: React 19 + TypeScript, Vite, Tailwind CSS, Radix UI components
- **Backend**: Node.js + Express, tRPC for type-safe RPC, Drizzle ORM
- **Database**: MySQL with Drizzle migrations
- **Testing**: Vitest for unit/integration tests
- **Deployment**: Vercel (see `DEPLOYMENT_GUIDE.md`)

## Architecture & Data Flow

### Core Layers

```
Client (React Components)
    ↓ (tRPC)
Server (Express + tRPC routes)
    ↓ (callDataApi)
External APIs (Yahoo Finance, NSE, LLM APIs, Image Generation)
    ↓
Database (MySQL via Drizzle)
```

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `client/src/` | React frontend components, pages, hooks, utilities |
| `server/` | tRPC routers, database operations, external API integration |
| `shared/` | Shared types, constants, utilities (used by both client & server) |
| `drizzle/` | Database schema and migrations |

## Critical Developer Workflows

### Development
```bash
pnpm dev              # Starts Express server with TSX watch + Vite dev server
pnpm build            # Builds client (Vite) + server (esbuild)
pnpm start            # Runs production server
```

### Testing & Quality
```bash
pnpm test             # Runs Vitest (watches server/**/*.test.ts)
pnpm check            # TypeScript type checking
pnpm format           # Prettier code formatting
pnpm db:push          # Generate & migrate database schema changes
```

## Important Patterns & Conventions

### 1. tRPC Router Organization (`server/routes/` & `server/routers.ts`)

All backend API procedures are defined as tRPC routers organized by feature:
- `marketData` - Live stock/index data from Yahoo Finance
- `optionsChain` - Options premium and Greeks (real-time NSE data)
- `watchlist` - User trade tracking (database-backed)

**Pattern**: Each router is a nested object of `publicProcedure` or `protectedProcedure` queries/mutations.

```typescript
// Example from server/routes/marketData.ts
export const marketDataRouter = router({
  getNiftyData: publicProcedure.query(async () => { /* ... */ }),
  getStockData: publicProcedure.input(z.object({ symbol: z.string() })).query(async () => { /* ... */ }),
});
```

**Client Usage**: `trpc.marketData.getNiftyData.useQuery()` in React components via `@trpc/react-query`

### 2. Caching Strategy

Market data is cached **in-memory for 1 minute** to avoid excessive API calls:
```typescript
const CACHE_DURATION = 60 * 1000; // 1 minute
function isCacheValid(key: string): boolean { /* checks timestamp */ }
```

**When adding new endpoints**: Implement caching if data is fetched from external APIs.

### 3. External Data Integration (`server/_core/dataApi.ts`)

All external API calls go through `callDataApi()`, which abstracts the Forge API/webhook system:
```typescript
const response = await callDataApi("YahooFinance/get_stock_chart", {
  query: { symbol: "^NSEI", region: "IN", interval: "5m", range: "1d" }
});
```

**Key APIs used**:
- `YahooFinance/get_stock_chart` - Stock prices and technical data
- NSE API (via wrapper) - Options chain data, Greeks, premiums
- Image generation & LLM APIs - AI features (see `server/_core/`)

### 4. Database Operations (Drizzle ORM)

**Schema** is in `drizzle/schema.ts` with two main tables:
- `users` - OAuth-backed user accounts (openId from Manus auth)
- `tradeWatchlist` - User-created trade records with Greeks, targets, stop losses

**Migrations**: Run `pnpm db:push` when modifying schema (generates/applies migrations automatically).

**Pattern**: Use Drizzle ORM instead of raw SQL:
```typescript
import { db } from "./db"; // initialized connection
const trades = await db.select().from(tradeWatchlist).where(eq(tradeWatchlist.userId, userId));
```

### 5. Component Structure & State Management

- **Pages**: `client/src/pages/` (Home.tsx is main entry point)
- **Components**: Use React hooks + tRPC queries for data fetching
- **Context**: `ThemeContext` for dark/light theme management
- **Custom Hooks**: `useLiveMarketData()`, `useAuth()`, `useComposition()` handle complex state logic

**Pattern**: Components fetch data directly via tRPC hooks:
```typescript
const { data, isLoading } = trpc.marketData.getAllMarketData.useQuery();
```

### 6. Authentication & Authorization

- `protectedProcedure` - Requires authenticated user (middleware checks `ctx.user`)
- `adminProcedure` - Requires `user.role === 'admin'`
- `publicProcedure` - No authentication required
- Auth state accessible in components via `useAuth()` hook

### 7. Type Safety & Inference

Types are inferred from database schema and tRPC procedures:
```typescript
export type User = typeof users.$inferSelect;      // from Drizzle schema
export type AppRouter = typeof appRouter;          // from tRPC router
```

Import shared types from `shared/types.ts` or schema exports.

### 8. Testing Patterns

- **Location**: `server/**/*.test.ts` files
- **Framework**: Vitest
- **Pattern**: Test tRPC router structure and API integration (see `marketData.test.ts`)
- Run tests before deployment: `pnpm test`

## Common Tasks & Code Examples

### Add a New tRPC Endpoint

1. Define in `server/routes/featureName.ts`:
```typescript
export const featureRouter = router({
  getFeatureData: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // fetch and return data
    }),
});
```

2. Register in `server/routers.ts`:
```typescript
export const appRouter = router({
  feature: featureRouter,
  // ...
});
```

3. Use in client: `trpc.feature.getFeatureData.useQuery({ id: "123" })`

### Add a Database Query

1. Ensure table exists in `drizzle/schema.ts`
2. Import and use Drizzle in `server/routes/`:
```typescript
import { db } from "../db";
import { eq } from "drizzle-orm";

const result = await db.select().from(tradeWatchlist).where(eq(tradeWatchlist.userId, userId));
```

3. Expose via tRPC router (step above)

### Add a React Component

1. Create in `client/src/components/ComponentName.tsx`
2. Use tRPC hooks for data: `trpc.routerName.procedureName.useQuery()`
3. Use Radix UI components from `client/src/components/ui/` for consistency
4. Export from component file (no barrel exports)

## Special Considerations

### Real-Time Data Updates

The dashboard heavily relies on polling for live data:
- **Market Data**: Refreshes every 60 seconds via `useLiveMarketData()` hook
- **Chart Data**: Regenerated on each refresh to reflect current market state
- **Manual Refresh**: User can manually trigger via button (calls `handleRefresh()`)

When modifying data endpoints, ensure they support the polling interval appropriately.

### Options Trading Domain

The codebase heavily features **options Greeks** (delta, gamma, theta, vega) and **P&L bubbles**:
- Greeks are stored when a trade is entered (see `tradeWatchlist` schema)
- Current premium is fetched in real-time via `optionsChain` router
- P&L is calculated as: `(currentPremium - entryPrice) × quantity × multiplier`

Understand this domain context when working on trading features.

### Deployment Notes

- Production build: `pnpm build` → generates `dist/` folder
- Server runs on `PORT` env var (default 3000)
- Client served from `dist/public/` in production
- See `DEPLOYMENT_GUIDE.md` for Vercel deployment steps

## Testing Before Commit

```bash
pnpm check          # Verify no TypeScript errors
pnpm format         # Format code
pnpm test           # Run test suite
pnpm build          # Verify build succeeds
```

## References

- **Architecture**: See `IMPLEMENTATION_GUIDE.md` for detailed feature design
- **Deployment**: `DEPLOYMENT_GUIDE.md` for production setup
- **UI Components**: `client/src/components/ui/` - Radix UI + Tailwind styled components
- **Database**: `drizzle/schema.ts` with comprehensive table definitions
