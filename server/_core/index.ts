import "dotenv/config";

// Use production server in Vercel/production, development server locally
if (process.env.NODE_ENV === "production") {
  import("./production.js").catch(err => {
    console.error("Failed to load production server:", err);
    process.exit(1);
  });
} else {
  import("./development.js").catch(err => {
    console.error("Failed to load development server:", err);
    process.exit(1);
  });
}
