#!/usr/bin/env node
/**
 * Vercel production server entry point
 * This is the main file that Vercel runs to start your application
 */

import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Configure body parser with larger size limit for file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy load tRPC and OAuth routes only if needed
app.use("/api/trpc", async (req, res, next) => {
  try {
    const { createExpressMiddleware } = await import("@trpc/server/adapters/express");
    const { appRouter } = await import("../routers.js");
    const { createContext } = await import("./_core/context.js");
    
    const middleware = createExpressMiddleware({
      router: appRouter,
      createContext,
    });
    middleware(req, res, next);
  } catch (err) {
    console.error("Error loading tRPC:", err);
    res.status(500).json({ error: "tRPC initialization failed" });
  }
});

app.use("/api/oauth", async (req, res, next) => {
  try {
    const { registerOAuthRoutes } = await import("./_core/oauth.js");
    const tempApp = express();
    registerOAuthRoutes(tempApp);
    tempApp(req, res, next);
  } catch (err) {
    console.error("Error loading OAuth:", err);
    res.status(500).json({ error: "OAuth initialization failed" });
  }
});

// Determine static files directory
const staticDirs = [
  path.join(process.cwd(), "dist", "public"),
  path.join(process.cwd(), ".vercel", "output", "static"),
  path.join(__dirname, "..", "dist", "public"),
];

let staticDir = null;
for (const dir of staticDirs) {
  if (fs.existsSync(dir) && fs.existsSync(path.join(dir, "index.html"))) {
    staticDir = dir;
    console.log(`✓ Found static files at: ${dir}`);
    break;
  }
}

if (!staticDir) {
  console.error("✗ Static files (dist/public) not found!");
  console.error("  Searched in:", staticDirs);
  console.error("  Current directory:", process.cwd());
  staticDir = path.join(process.cwd(), "dist", "public");
}

// Serve static files
app.use(express.static(staticDir, { 
  maxAge: "1d",
  etag: false
}));

// SPA fallback - serve index.html for all non-API routes
app.get("*", (req, res) => {
  const indexPath = path.join(staticDir, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error(`✗ index.html not found at: ${indexPath}`);
    return res.status(500).send(
      `Application error: index.html not found`
    );
  }
  res.sendFile(indexPath);
});

// Start server
const port = parseInt(process.env.PORT || "3000");
server.listen(port, "0.0.0.0", () => {
  console.log(`✓ Server running on port ${port}`);
});

process.on("SIGTERM", () => {
  console.log("Shutting down...");
  server.close(() => process.exit(0));
});

