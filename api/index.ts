import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../_core/oauth";
import { appRouter } from "../routers";
import { createContext } from "../_core/context";
import path from "path";

const app = express();

// Configure body parser with larger size limit for file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// OAuth callback under /api/oauth/callback
registerOAuthRoutes(app);

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Serve static files
const distPath = path.join(process.cwd(), "dist", "public");
app.use(express.static(distPath));

// SPA fallback
app.get("*", (req: any, res: any) => {
  res.sendFile(path.join(distPath, "index.html"));
});

export default app;
