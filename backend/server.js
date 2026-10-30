/* ==========================================================================
 * server.js — Node.js / Express API for the Emmanuel Mantey portfolio
 *
 * Purpose: receive validated contact submissions. The static frontend is
 * deployed separately (it never depends on this server to render).
 *
 * Endpoints:
 *   GET  /api/health          — status probe (no secrets)
 *   POST /api/contact         — rate-limited, validated contact form
 *
 * Configuration: .env → see ../.env.example and README.md
 * ========================================================================== */
"use strict";

const express = require("express");
const { loadEnv } = require("./loadEnv");
const { securityHeaders, cors } = require("./middleware/security");

loadEnv();

const PORT = parseInt(process.env.PORT || "5000", 10);
const IS_PROD = String(process.env.NODE_ENV || "").toLowerCase() === "production";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1); /* respect reverse proxies (Hostinger, Nginx) */

app.use(securityHeaders);
app.use(cors());

/* Accept JSON only, with a strict body-size limit */
app.use(
  express.json({
    limit: "16kb",
    type: ["application/json"],
  })
);

/* health probe */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    env: IS_PROD ? "production" : "development",
  });
});

app.use("/api", require("./routes/contact.routes"));

/* JSON 404 (no HTML error pages leaking a stack) */
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Not found." });
});

/* central error handler — sanitized, stack-free in production */
app.use((error, req, res, next) => {
  if (error && error.type === "entity.too.large") {
    return res.status(413).json({ success: false, error: "Payload too large." });
  }
  if (error && error.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, error: "Invalid request body." });
  }

  if (!IS_PROD) {
    console.error("[server]", error);
  } else {
    console.error("[server]", error.message || "Unhandled error");
  }
  res.status(500).json({ success: false, error: "Server error — please try again shortly." });
});

const server = app.listen(PORT, () => {
  console.log(
    `[server] Portfolio API listening on :${PORT} (${IS_PROD ? "production" : "development"})`
  );
  if (!process.env.EMAIL_ENABLED || String(process.env.EMAIL_ENABLED).toLowerCase() !== "true") {
    console.log("[server] Email delivery is NOT configured — submissions will be stored to backend/data/submissions.jsonl");
  }
});

/* graceful shutdown */
for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => {
    console.log(`[server] ${signal} received — shutting down.`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000).unref();
  });
}

module.exports = app;
