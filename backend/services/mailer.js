/* ==========================================================================
 * mailer.js — email delivery via SMTP (nodemailer)
 *
 * Delivery contract:
 *  - EMAIL_ENABLED=true  + full SMTP_* + CONTACT_TO_EMAIL  → sends email
 *  - anything else                                          → queues to the
 *    submissions log (backend/data/submissions.jsonl) instead.
 *
 * This keeps the API honest: a submission is either emailed or acknowledged
 * as stored — the failure mode is visible in logs, not silent.
 * ========================================================================== */
"use strict";

const nodemailer = require("nodemailer");
const { appendSubmission } = require("./submissionStore");

const emailEnabled =
  String(process.env.EMAIL_ENABLED || "").toLowerCase() === "true";

let transporter = null;
if (emailEnabled && process.env.SMTP_HOST && process.env.CONTACT_TO_EMAIL) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: String(process.env.SMTP_SECURE || "").toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else if (emailEnabled) {
  console.warn(
    "[mailer] EMAIL_ENABLED=true but SMTP_HOST/CONTACT_TO_EMAIL missing — falling back to the submissions log."
  );
}

/** @returns {{ delivered: boolean, mode: 'smtp' | 'queued' }} */
async function deliver(contact) {
  const record = {
    receivedAt: new Date().toISOString(),
    ...contact,
  };

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER,
        replyTo: { name: contact.name, address: contact.email },
        to: process.env.CONTACT_TO_EMAIL,
        subject: `[Portfolio] ${contact.type}: ${contact.subject}`,
        text:
          `New portfolio message\n` +
          `----------------------------\n` +
          `From:    ${contact.name}\n` +
          `Email:   ${contact.email}\n` +
          `Type:    ${contact.type}\n\n` +
          `${contact.message}\n`,
      });
      /* also keep a local copy for the record */
      await appendSubmission({ ...record, delivered: "email" });
      return { delivered: true, mode: "smtp" };
    } catch (error) {
      console.error("[mailer] SMTP delivery failed:", error.message);
      await appendSubmission({ ...record, delivered: "fallback-queued" });
      return { delivered: true, mode: "queued" };
    }
  }

  await appendSubmission(record);
  console.log(
    "[mailer] No email service configured — submission stored to backend/data/submissions.jsonl " +
    "(configure EMAIL_* variables in .env to enable delivery; see .env.example)."
  );
  return { delivered: true, mode: "queued" };
}

module.exports = { deliver, emailEnabled };
