/* ==========================================================================
 * rateLimit.js — in-memory sliding-window rate limiter (no dependency)
 * Limit: CONTACT_RATE_LIMIT submissions per IP per hour (default 5).
 * ========================================================================== */
"use strict";

const WINDOW_MS = 60 * 60 * 1000; /* 1 hour */

function rateLimit() {
  const limit = parseInt(process.env.CONTACT_RATE_LIMIT || "5", 10) || 5;
  const hits = new Map(); /* ip -> [timestamps ms] */

  /* periodic cleanup so the map cannot grow without bound */
  const sweep = setInterval(() => {
    const now = Date.now();
    hits.forEach((times, ip) => {
      const fresh = times.filter((t) => now - t < WINDOW_MS);
      if (fresh.length) hits.set(ip, fresh);
      else hits.delete(ip);
    });
  }, WINDOW_MS);
  if (sweep.unref) sweep.unref();

  return function rateLimitMiddleware(req, res, next) {
    const now = Date.now();
    /* behind a reverse proxy, x-forwarded-for *must* be trusted: the app sets
       `trust proxy` in server.js; on localhost this falls back to req.ip */
    const ip = req.ip || req.connection.remoteAddress || "unknown";

    const times = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);

    if (times.length >= limit) {
      const oldest = times[0];
      const retryIn = Math.ceil((oldest + WINDOW_MS - now) / 1000);
      res.setHeader("Retry-After", String(Math.max(retryIn, 1)));
      return res.status(429).json({
        success: false,
        error: "You've sent several messages in a short time. Please wait before sending another.",
      });
    }

    times.push(now);
    hits.set(ip, times);
    next();
  };
}

module.exports = rateLimit;
