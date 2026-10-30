/* ==========================================================================
 * navigation.js — sticky header, mobile menu, smooth internal transitions
 * ========================================================================== */
(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("primary-nav");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---- Scrolled state (adds glass effect) ---- */
  var lastScrolled = false;
  function updateHeader() {
    var scrolled = window.scrollY > 12;
    if (scrolled !== lastScrolled) {
      lastScrolled = scrolled;
      header.classList.toggle("is-scrolled", scrolled);
    }
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (!toggle || !nav) return;

  /* ---- Mobile menu ---- */
  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    if (open) {
      var first = nav.querySelector("a");
      if (first) first.focus({ preventScroll: true });
    }
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  /* Close when a link inside the panel is used, or when clicking outside */
  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("click", function (event) {
    if (
      nav.classList.contains("is-open") &&
      !nav.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      setOpen(false);
    }
  });

  /* Reset the panel when resizing back to desktop */
  window.matchMedia("(min-width: 1024px)").addEventListener("change", function (event) {
    if (event.matches) setOpen(false);
  });

  /* ---- Smooth fade transition between internal pages ---- */
  document.addEventListener("click", function (event) {
    if (reducedMotion.matches) return;
    var link = event.target.closest('a[href$=".html"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var href = link.getAttribute("href") || "";
    if (/^(https?:)?\/\//.test(href) || href.startsWith("#")) return;

    event.preventDefault();
    document.documentElement.classList.add("page-exit");
    window.setTimeout(function () {
      window.location.href = href;
    }, 130);
  });
})();
