// Vercel serverless entry point: wraps the existing Express app (server.ts) so all
// /api/* requests are handled by the exact same routes, Supabase-backed pricing/blog
// logic, HMAC admin auth, and security headers used in local dev. No route logic is
// duplicated here — this file only adapts the app to Vercel's Node function runtime.
import app from '../server.js';

export default app;
