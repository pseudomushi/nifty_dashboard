import "dotenv/config";

// Use production server in Vercel/production, development server locally
if (process.env.NODE_ENV === "production") {
  // Import and run production server
  import("./production.js").catch(console.error);
} else {
  // Import and run development server with Vite HMR
  import("./development.js").catch(console.error);
}
