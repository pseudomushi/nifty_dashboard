#!/usr/bin/env node
/**
 * Vercel production server entry point
 * This is the main file that Vercel runs to start your application
 */

import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

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

// Determine static files directory
// In Vercel, the working directory is the project root after build
const staticDirs = [
  path.join(process.cwd(), "dist", "public"),           // Standard build output path
  path.join(process.cwd(), ".vercel", "output", "static"), // Vercel static output
  path.join(__dirname, "..", "..", "dist", "public"),   // Relative to bundled location
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
  console.error("  Listing current directory:");
  try {
    const files = fs.readdirSync(process.cwd());
    console.error("  ", files);
  } catch (e) {
    console.error("  Error reading directory:", e);
  }
  staticDir = path.join(process.cwd(), "dist", "public");
}

// Serve static files with proper headers
app.use(express.static(staticDir, { 
  maxAge: "1d",
  etag: false,
  lastModified: true
}));

// SPA fallback - serve index.html for all non-API routes
app.get("*", (req, res) => {
  const indexPath = path.join(staticDir, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error(`✗ index.html not found at: ${indexPath}`);
    return res.status(500).send(
      `Application error: index.html not found at ${indexPath}`
    );
  }
  res.sendFile(indexPath);
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Server error:", err);
  res.status(500).send("Server error");
});

// Start server
const port = parseInt(process.env.PORT || "3000");
server.listen(port, "0.0.0.0", () => {
  console.log(`✓ Server running on port ${port}`);
  console.log(`✓ Static files served from: ${staticDir}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down...");
  server.close(() => {
    console.log("Server shut down");
    process.exit(0);
  });
});

export default app;
