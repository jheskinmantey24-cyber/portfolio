/* ==========================================================================
 * contact.js — contact form: client-side validation, accessible feedback,
 * submission to the configured Node.js API with honest error handling.
 *
 * Delivery contract (documented in README.md):
 *  - EM.apiBase ""  → POST {origin}/api/contact        (same-origin Node.js)
 *  - EM.apiBase URL → POST {apiBase}/api/contact       (separately hosted)
 *  - If the API is unreachable, the form says so plainly — it never fakes
 *    a successful send.
 * ========================================================================== */
(function () {
  "use strict";

  var EM = window.EM;

  var form = document.getElementById("contact-form");
  if (!form) return;

  var submitBtn = document.getElementById("contact-submit");
  var spinner = document.getElementById("contact-spinner");
  var feedback = document.getElementById("form-feedback");

  var fields = {
    name: { input: document.getElementById("contact-name"), error: document.getElementById("error-name"), label: "full name" },
    email: { input: document.getElementById("contact-email"), error: document.getElementById("error-email"), label: "email address" },
    subject: { input: document.getElementById("contact-subject"), error: document.getElementById("error-subject"), label: "subject" },
    type: { input: document.getElementById("contact-type"), error: document.getElementById("error-type"), label: "project type" },
    message: { input: document.getElementById("contact-message"), error: document.getElementById("error-message"), label: "message" },
  };

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ---------- validation ---------- */
  function validateField(key) {
    var field = fields[key];
    if (!field || !field.input) return true;
    var value = field.input.value.trim();
    var message = null;

    if (key === "name" && value.length < 2) message = "Please enter your full name (min. 2 characters).";
    else if (key === "email" && !EMAIL_RE.test(value)) message = "Please enter a valid email address, e.g. you@company.com";
    else if (key === "subject" && value.length < 3) message = "Please describe the subject (min. 3 characters).";
    else if (key === "type" && !value) message = "Please select what this project is.";
    else if (key === "message" && value.length < 20) message = "Please add a little more detail (min. 20 characters).";
    else if (key === "message" && value.length > 4000) message = "Message is too long (max. 4000 characters).";

    setError(key, message);
    return !message;
  }

  function setError(key, message) {
    var field = fields[key];
    if (message) {
      field.error.textContent = message;
      field.error.classList.add("is-visible");
      field.input.setAttribute("aria-invalid", "true");
    } else {
      field.error.textContent = "";
      field.error.classList.remove("is-visible");
      field.input.removeAttribute("aria-invalid");
    }
  }

  Object.keys(fields).forEach(function (key) {
    var input = fields[key].input;
    if (!input) return;
    input.addEventListener("input", function () {
      var hadError = input.getAttribute("aria-invalid") === "true";
      if (hadError) validateField(key);
    });
    input.addEventListener("blur", function () {
      if (input.value.trim() !== "") validateField(key);
    });
  });

  /* ---------- feedback ---------- */
  function showFeedback(kind, message, withMailFallback) {
    feedback.className = "form-feedback is-visible form-feedback--" + kind;
    feedback.textContent = message;

    if (withMailFallback && EM.contact && EM.contact.email) {
      var separator = document.createElement("span");
      separator.textContent = " ";
      var link = document.createElement("a");
      link.href = "mailto:" + EM.contact.email;
      link.textContent = "Email me directly instead →";
      feedback.appendChild(separator);
      feedback.appendChild(link);
    }
  }

  function setSubmitting(submitting) {
    submitBtn.disabled = submitting;
    spinner.hidden = !submitting;
    submitBtn.style.opacity = submitting ? "0.75" : "";
  }

  /* ---------- submit ---------- */
  var attempts = 0;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (attempts >= 4) {
      showFeedback("error", "Too many attempts right now. Please wait a minute before trying again.", true);
      return;
    }

    var honeypot = document.getElementById("contact-website");
    if (honeypot && honeypot.value !== "") {
      /* bots that filled the hidden field — fail silently */
      return;
    }

    var valid = Object.keys(fields).map(validateField).every(Boolean);
    if (!valid) {
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      showFeedback("error", "Please correct the highlighted fields and try again.");
      return;
    }

    var payload = {
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      subject: fields.subject.input.value.trim(),
      type: fields.type.input.value.trim(),
      message: fields.message.input.value.trim(),
    };

    setSubmitting(true);
    showFeedback("success", "Sending your message…"); /* updated below on result */
    var started = Date.now();

    var endpoint = (EM.apiBase || "") + "/api/contact";

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        return response.json().catch(function () {
          return { success: false, error: "invalid-response" };
        }).then(function (body) {
          return { ok: response.ok, status: response.status, body: body };
        });
      })
      .then(function (result) {
        attempts++;
        setSubmitting(false);

        if (result.ok && result.body && result.body.success) {
          attempts = 0;
          form.reset();
          showFeedback(
            "success",
            typeof result.body.message === "string"
              ? result.body.message
              : "Message received — thank you. I'll reply as soon as possible."
          );
        } else if (result.status === 429) {
          showFeedback("error", "You've sent several messages in a short time. Please wait an hour before sending another.", true);
        } else if (result.status === 400 && result.body && result.body.error) {
          showFeedback("error", typeof result.body.error === "string" ? result.body.error : "Some fields need attention. Please review and try again.", true);
        } else {
          showFeedback("error", "The message couldn't be delivered right now (server issue). Nothing was lost — please try again shortly.", true);
        }
      })
      .catch(function () {
        attempts++;
        setSubmitting(false);
        var waited = Date.now() - started;
        if (waited < 300) {
          showFeedback("error", "This site isn't connected to a working backend yet. Configure the Node.js API (see README.md) or email me directly.", true);
        } else {
          showFeedback("error", "Network error — your message couldn't be sent. No message was lost; please try again.", true);
        }
      });
  });
})();
