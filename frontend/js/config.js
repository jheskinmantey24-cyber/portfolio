/* ==========================================================================
 * config.js — EDITABLE SITE CONFIGURATION
 * --------------------------------------------------------------------------
 * Everything verified-personal lives here so real details can be added
 * without touching markup. Leave values as empty strings ("") until the
 * information is confirmed — the UI renders honest placeholders and skips
 * missing links rather than fabricating them.
 * ========================================================================== */
(function () {
  "use strict";

  window.EM = {
    /**
     * Base URL of the Node.js contact API, WITHOUT a trailing slash and
     * WITHOUT the /api prefix.
     *   ""               -> same-origin deployments (https://your-domain.com/api/...)
     *   "https://api.your-domain.com" -> separately hosted Node backend
     * See README.md → "Deployment".
     */
    apiBase: "",

    /* Verified contact details. Empty string = renders an editable placeholder. */
    contact: {
      email: "jheskinmantey24@gmail.com", // confirmed — contact form + mailto links
      phone: "0557030059",                // confirmed — displayed on the Contact page
      github: "",          // e.g. "https://github.com/your-username"
      githubUsername: "",  // e.g. "your-username" (enables the GitHub repo showcase)
      linkedin: "",        // e.g. "https://www.linkedin.com/in/your-handle"
      location: "Ghana",   // confirmed
    },

    /* Availability card on the Contact page — edit freely. */
    availability: {
      headline: "Open to Meaningful Opportunities",
      copy: "Interested in discussing software development opportunities, projects, and collaborations.",
    },

    /**
     * Fallback for the case-study GitHub/repository CTA buttons: they are
     * only rendered when a project entry in projects.js provides real URLs.
     */
  };
})();
