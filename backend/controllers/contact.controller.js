/* ==========================================================================
 * contact.controller.js — request handling for POST /api/contact
 * ========================================================================== */
"use strict";

const { deliver } = require("../services/mailer");

const VISITOR_CONFIRMATION =
  "Message received — thank you. I'll reply as soon as possible.";

async function submitContact(req, res, next) {
  try {
    /* the honeypot must be empty; humans never see that field */
    if (typeof req.body.website === "string" && req.body.website.trim() !== "") {
      return res.status(200).json({ success: true, message: VISITOR_CONFIRMATION });
    }

    const result = await deliver(req.contact);

    /* Never reveal delivery internals to visitors — only a confirmation. */
    res.status(201).json({
      success: true,
      message: result.delivered
        ? VISITOR_CONFIRMATION
        : "Message received and stored. The owner will see it in the submissions log.",
    });
  } catch (error) {
    /* handled by the central error handler — no internals leak */
    next(error);
  }
}

module.exports = { submitContact };
