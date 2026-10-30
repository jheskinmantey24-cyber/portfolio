/* ==========================================================================
 * loadEnv.js — tiny .env loader (no dependency)
 * Loaded values never override existing environment variables, so platform
 * configuration (e.g. Hostinger panels) always wins.
 * ========================================================================== */
"use strict";

const fs = require("fs");
const path = require("path");

function loadEnv() {
  const candidates = [
    path.join(process.cwd(), ".env"),
    path.resolve(__dirname, "..", ".env"),
  ];

  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, "utf8");
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      /* strip optional surrounding quotes */
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  }
}

module.exports = { loadEnv };
