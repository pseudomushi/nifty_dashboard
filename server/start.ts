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
// In Vercel, the working directory is the project root
const staticDirs = [
  path.join(process.cwd(), "dist", "public"),           // Standard: project/dist/public
  path.join(process.cwd(), ".vercel", "output", "static"), // Vercel static output
  path.join(__dirname, "..", "dist", "public"),         // Relative from server/start.ts
];

let staticDir = null;
let foundIndexHtml = false;

for (const dir of staticDirs) {
  const indexPath = path.join(dir, "index.html");
  const exists = fs.existsSync(indexPath);
  console.log(`[PATH CHECK] ${dir} → index.html exists: ${exists}`);
  
  if (exists) {
    staticDir = dir;
    foundIndexHtml = true;
    console.log(`✓ Using static files at: ${staticDir}`);
    break;
  }
}

if (!foundIndexHtml) {
  console.error("✗ index.html not found in any expected location!");
  console.error("  Checked paths:", staticDirs);
  console.error("  Current directory: " + process.cwd());
  
  // List what's actually in the current directory
  try {
    console.error("  Contents of cwd:", fs.readdirSync(process.cwd()));
    const distPath = path.join(process.cwd(), "dist");
    if (fs.existsSync(distPath)) {
      console.error("  Contents of dist/:", fs.readdirSync(distPath));
      const publicPath = path.join(distPath, "public");
      if (fs.existsSync(publicPath)) {
        console.error("  Contents of dist/public/:", fs.readdirSync(publicPath).slice(0, 10));
      }
    }
  } catch (e) {
    console.error("  Error listing directories:", e);
  }
  
  // Fall back to first path
  staticDir = staticDirs[0];
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

