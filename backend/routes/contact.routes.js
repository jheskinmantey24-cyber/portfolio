/* ==========================================================================
 * contact.routes.js — POST /api/contact
 * ========================================================================== */
"use strict";

const { Router } = require("express");
const rateLimit = require("../middleware/rateLimit");
const validateContact = require("../middleware/validateContact");
const controller = require("../controllers/contact.controller");

const router = Router();

router.post("/contact", rateLimit(), validateContact, controller.submitContact);

module.exports = router;
