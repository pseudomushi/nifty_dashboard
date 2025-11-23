import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import fs from "fs";

async function startServer() {
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

  // Serve static files - try multiple possible paths for Vercel
  const possiblePaths = [
    path.join(process.cwd(), "dist", "public"),           // Standard build output
    path.join(process.cwd(), "public"),                    // Vercel root public
    path.join(__dirname, "..", "..", "dist", "public"),   // Relative from bundled location
  ];

  let publicPath = possiblePaths[0];
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      publicPath = possiblePath;
      console.log(`Using public path: ${publicPath}`);
      break;
    }
  }

  console.log(`Static files path (checking): ${publicPath}`);
  console.log(`Files exist: ${fs.existsSync(publicPath)}`);

  app.use(express.static(publicPath, { 
    maxAge: "1d",
    etag: false 
  }));

  // SPA fallback - serve index.html for all non-API routes
  app.get("*", (req, res) => {
    const indexPath = path.join(publicPath, "index.html");
    if (!fs.existsSync(indexPath)) {
      console.error(`index.html not found at ${indexPath}`);
      res.status(500).send(`Static files not found. Looking in: ${publicPath}`);
      return;
    }
    res.sendFile(indexPath);
  });

  const port = process.env.PORT || "3000";

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
