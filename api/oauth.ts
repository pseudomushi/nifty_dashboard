import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * OAuth endpoint placeholder
 * TODO: Implement OAuth flow in serverless environment
 */
export default async (req: VercelRequest, res: VercelResponse) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  res.status(501).json({
    error: "OAuth not yet configured in serverless environment",
  });
};
