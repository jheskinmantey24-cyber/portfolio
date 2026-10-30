/* ==========================================================================
 * contact-links.js — renders verified contact data (or honest placeholders)
 * Sources of truth: js/config.js  →  window.EM.contact / window.EM.availability
 * ========================================================================== */
(function () {
  "use strict";

  var EM = window.EM || {};
  var contact = EM.contact || {};
  var availability = EM.availability || {};

  function svgIcon(name) {
    var icons = {
      email:
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      github:
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z"/></svg>',
      linkedin:
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>',
      location:
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11z" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.6"/></svg>',
      phone:
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" stroke-linejoin="round"/></svg>',
    };
    var wrapper = document.createElement("span");
    wrapper.innerHTML = icons[name] || ""; /* trusted, static markup */
    return wrapper.firstChild;
  }

  /* ---------- Footer social row ---------- */
  document.querySelectorAll("[data-social-row]").forEach(function (row) {
    if (contact.github) {
      var gh = document.createElement("a");
      gh.className = "social-link";
      gh.href = contact.github;
      gh.setAttribute("aria-label", "GitHub profile");
      gh.appendChild(svgIcon("github"));
      row.appendChild(gh);
    }
    if (contact.linkedin) {
      var li = document.createElement("a");
      li.className = "social-link";
      li.href = contact.linkedin;
      li.setAttribute("aria-label", "LinkedIn profile");
      li.appendChild(svgIcon("linkedin"));
      row.appendChild(li);
    }
    if (contact.email) {
      var em = document.createElement("a");
      em.className = "social-link";
      em.href = "mailto:" + contact.email;
      em.setAttribute("aria-label", "Email Emmanuel Mantey");
      em.appendChild(svgIcon("email"));
      row.appendChild(em);
    }
    if (!contact.github && !contact.linkedin && !contact.email) {
      var pending = EM.el(
        "p",
        "footer-pending mono",
        "Add GitHub / LinkedIn / Email in js/config.js"
      );
      pending.style.cssText =
        "font-family:var(--font-mono);font-size:0.68rem;color:var(--ink-3);letter-spacing:0.05em;";
      row.appendChild(pending);
    }
  });

  /* Ghana local "0557030059" → international tel: target "+233557030059" */
  function phoneHref(value) {
    var digits = String(value).replace(/[^\d+]/g, "");
    if (digits.charAt(0) === "0") digits = "+233" + digits.slice(1);
    return "tel:" + digits;
  }

  /* ---------- Footer contact list ---------- */
  document.querySelectorAll("[data-footer-contact]").forEach(function (list) {
    var items = [
      {
        ok: contact.email,
        label: "Email",
        href: "mailto:" + contact.email,
        value: contact.email,
      },
      {
        ok: contact.phone,
        label: "Phone",
        href: phoneHref(contact.phone),
        value: contact.phone,
      },
      {
        ok: contact.github,
        label: "GitHub",
        href: contact.github,
        value: "GitHub profile",
      },
      { ok: contact.linkedin, label: "LinkedIn", href: contact.linkedin, value: "LinkedIn profile" },
    ];
    items.forEach(function (item) {
      var li = EM.el("li");
      if (item.ok) {
        var a = EM.el("a", null, item.value);
        a.href = item.href;
        li.appendChild(a);
      } else {
        var span = EM.el("span", null, item.label + " — pending");
        span.style.cssText = "opacity:.55;";
        span.title = "Configure in js/config.js";
        li.appendChild(span);
      }
      list.appendChild(li);
    });
  });

  /* ---------- Contact page details ---------- */
  document.querySelectorAll("[data-contact-value]").forEach(function (slot) {
    var key = slot.getAttribute("data-contact-value");
    var href = null;
    var value = null;

    if (key === "email") {
      value = contact.email;
      href = contact.email ? "mailto:" + contact.email : null;
    } else if (key === "phone") {
      value = contact.phone;
      href = contact.phone ? phoneHref(contact.phone) : null;
    } else if (key === "github") {
      value = contact.github ? contact.github.replace(/^https?:\/\//, "") : null;
      href = contact.github || null;
    } else if (key === "linkedin") {
      value = contact.linkedin ? contact.linkedin.replace(/^https?:\/\//, "") : null;
      href = contact.linkedin || null;
    } else if (key === "location") {
      value = contact.location || "";
    }

    if (value) {
      if (href) {
        var a = EM.el("a", null, value);
        a.href = href;
        slot.appendChild(a);
      } else {
        slot.appendChild(EM.el("p", null, value));
      }
    } else {
      var pending = EM.el(
        "p",
        null,
        "Add " + key + " in js/config.js to display it here."
      );
      pending.style.cssText = "opacity:.55;font-family:var(--font-mono);font-size:0.78rem;";
      slot.appendChild(pending);
    }
  });

  /* ---------- Availability card ---------- */
  document.querySelectorAll("[data-availability-headline]").forEach(function (node) {
    if (availability.headline) node.textContent = availability.headline;
  });
  document.querySelectorAll("[data-availability-copy]").forEach(function (node) {
    if (availability.copy) node.textContent = availability.copy;
  });

  /* ---------- Final email CTA (contact page) ---------- */
  document.querySelectorAll("[data-email-cta]").forEach(function (btn) {
    if (contact.email) {
      btn.href = "mailto:" + contact.email;
      btn.setAttribute("aria-label", "Email " + contact.email);
    } else {
      btn.classList.add("is-disabled");
      btn.setAttribute("aria-disabled", "true");
      btn.addEventListener("click", function (event) {
        event.preventDefault();
      });
      btn.title = "Configure your email in js/config.js to enable this button.";
    }
  });
})();
