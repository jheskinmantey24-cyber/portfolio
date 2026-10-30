/* ==========================================================================
 * security.js — security headers + CORS restriction
 * The API serves JSON only. Links to the FRONTEND must be served over HTTPS
 * from the static host (see README.md → Deployment).
 * ========================================================================== */
"use strict";

const SECONDS_IN_24H = 43200;

function securityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'; form-action 'none'; base-uri 'none'"
  );
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");

  const isHttps =
    req.secure || (req.headers["x-forwarded-proto"] || "").includes("https");
  if (isHttps) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=" + SECONDS_IN_24H + "; includeSubDomains"
    );
  }
  next();
}

/**
 * CORS: same-origin deployments need nothing. When ALLOWED_ORIGINS is set
 * (comma-separated), only those origins may call the API with JSON POSTs.
 * Empty Origin (curl, same-origin HTML forms) is allowed because typical
 * same-origin requests skip CORS entirely.
 */
function cors() {
  const allowed = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

  return function corsMiddleware(req, res, next) {
    if (!allowed.length) return next();

    const origin = req.headers.origin;
    if (!origin) return next(); /* not a CORS request */

    if (allowed.indexOf(origin.replace(/\/$/, "")) === -1) {
      res.setHeader("Vary", "Origin");
      return res.status(403).json({
        success: false,
        error: "Origin not allowed.",
      });
    }

    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
    res.setHeader("Access-Control-Max-Age", "600");

    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }
    next();
  };
}

module.exports = { securityHeaders, cors };
