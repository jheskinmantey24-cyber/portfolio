/* ==========================================================================
 * validateContact.js — server-side validation (authoritative)
 * The frontend validates too, but the server must never trust that.
 * ========================================================================== */
"use strict";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PROJECT_TYPES = [
  "Full-Stack Development",
  "Frontend Development",
  "Backend Development",
  "Freelance Project",
  "Job Opportunity",
  "Collaboration",
  "Other",
];

const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 120 },
  subject: { min: 3, max: 120 },
  message: { min: 20, max: 4000 },
};

/** Strip control characters that would poison log files or email headers. */
function sanitizeText(value) {
  // eslint-disable-next-line no-control-regex
  return String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

function validateContact(req, res, next) {
  let body = req.body || {};
  /* some clients send form-encoded data */
  if (typeof body.name !== "string" && typeof req.body === "object") {
    body = req.body;
  }

  const name = sanitizeText(String(body.name || "")).trim().slice(0, LIMITS.name.max);
  const email = sanitizeText(String(body.email || "")).trim().slice(0, LIMITS.email.max);
  const subject = sanitizeText(String(body.subject || "")).trim().slice(0, LIMITS.subject.max);
  const type = sanitizeText(String(body.type || "")).trim().slice(0, 40);
  const message = sanitizeText(String(body.message || "")).trim().slice(0, LIMITS.message.max);

  if (name.length < LIMITS.name.min)
    return res.status(400).json({ success: false, error: "Please enter your full name." });
  if (!EMAIL_RE.test(email))
    return res.status(400).json({ success: false, error: "Please enter a valid email address." });
  if (subject.length < LIMITS.subject.min)
    return res.status(400).json({ success: false, error: "Please include a subject." });
  if (PROJECT_TYPES.indexOf(type) === -1)
    return res.status(400).json({ success: false, error: "Please select a valid project type." });
  if (message.length < LIMITS.message.min || message.length > LIMITS.message.max)
    return res.status(400).json({ success: false, error: "Message must be between 20 and 4000 characters." });

  req.contact = { name, email, subject, type, message };
  next();
}

module.exports = validateContact;
