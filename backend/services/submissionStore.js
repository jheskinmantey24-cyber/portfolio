/* ==========================================================================
 * submissionStore.js — durable fallback when SMTP is not configured
 * Appends validated submissions to backend/data/submissions.jsonl (one JSON
 * object per line). Secrets are never stored here — only message content.
 * ========================================================================== */
"use strict";

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.jsonl");

let appending = Promise.resolve();

function appendSubmission(record) {
  appending = appending
    .then(() => {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.appendFileSync(DATA_FILE, JSON.stringify(record) + "\n", "utf8");
      return true;
    })
    .catch((error) => {
      console.error("[submissionStore] failed to persist submission:", error.message);
      return false;
    });
  return appending;
}

module.exports = { appendSubmission };
