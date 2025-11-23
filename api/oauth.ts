import "dotenv/config";
import express from "express";

const app = express();

app.use(express.json());

// OAuth routes - delegate to the actual OAuth handler
app.use(async (req, res, next) => {
  try {
    const { registerOAuthRoutes } = await import("../../_core/oauth");
    const tempApp = express();
    registerOAuthRoutes(tempApp);
    // Copy request to temp app and execute
    tempApp(req, res, next);
  } catch (error) {
    console.error("OAuth error:", error);
    res.status(500).json({ error: "OAuth failed" });
  }
});

export default app;
