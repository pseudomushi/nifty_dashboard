import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * This is a simple proxy that will handle the tRPC API calls.
 * In production, we need to properly set up the tRPC server here.
 * For now, return a placeholder that tells us this is being called.
 */
export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS for tRPC calls
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // TODO: Implement proper tRPC server in serverless environment
    // For now, return a message indicating the API endpoint is reachable
    res.status(501).json({
      error: "tRPC API not yet configured in serverless environment",
      message: "The backend API routes need to be properly set up in the serverless functions.",
    });
  } catch (error) {
    console.error("tRPC API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
