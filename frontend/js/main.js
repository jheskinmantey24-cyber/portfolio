/* ==========================================================================
 * main.js — shared boot code for every page
 * Scroll reveal, tilt cards, decorative cursor ring, footer year.
 * ========================================================================== */
(function () {
  "use strict";

  var EM = (window.EM = window.EM || {});
  EM.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  EM.finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  /** Small helper: create element with text (never innerHTML for untrusted data) */
  EM.el = function (tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  /* ---------- Scroll reveal ---------- */
  var revealItems = document.querySelectorAll("[data-reveal]");
  if (revealItems.length) {
    if (EM.reducedMotion.matches) {
      revealItems.forEach(function (item) {
        item.classList.add("is-revealed");
      });
    } else if ("IntersectionObserver" in window) {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-revealed");
            revealObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      revealItems.forEach(function (item) {
        var delay = parseFloat(item.getAttribute("data-reveal-delay") || "0");
        if (delay) item.style.setProperty("--reveal-delay", delay + "ms");
        revealObserver.observe(item);
      });
    }
  }

  /* ---------- Sticky header glass ---------- */
  var header = document.getElementById("site-header");
  var headerScrolled = false;
  function updateHeaderState() {
    var scrolled = window.scrollY > 12;
    if (scrolled !== headerScrolled) {
      headerScrolled = scrolled;
      header.classList.toggle("is-scrolled", scrolled);
    }
  }
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* ---------- Tilt cards (pointer-fine devices only) ---------- */
  function initTilt() {
    if (EM.reducedMotion.matches || !EM.finePointer.matches || !("matchMedia" in window)) return;

    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      if (card.__tiltBound) return; /* idempotent — safe to re-run after JS-rendered grids */
      card.__tiltBound = true;
      var rect = null;
      var raf = 0;
      var glare = card.querySelector(".tilt__glare");

      function render(gx, gy) {
        var px = (gx - rect.left) / rect.width;
        var py = (gy - rect.top) / rect.height;
        var tiltX = (0.5 - py) * 4.5; // degrees — deliberately subtle
        var tiltY = (px - 0.5) * 5;
        card.style.transform =
          "perspective(900px) rotateX(" + tiltX.toFixed(2) + "deg) rotateY(" + tiltY.toFixed(2) + "deg) translateY(-3px)";
        if (glare) {
          glare.style.setProperty("--glare-x", (px * 100).toFixed(1) + "%");
          glare.style.setProperty("--glare-y", (py * 100).toFixed(1) + "%");
        }
        raf = 0;
      }

      card.addEventListener("pointerenter", function () {
        rect = card.getBoundingClientRect();
      });

      card.addEventListener("pointermove", function (event) {
        if (!rect) rect = card.getBoundingClientRect();
        if (raf) return;
        var gx = event.clientX;
        var gy = event.clientY;
        raf = requestAnimationFrame(function () {
          render(gx, gy);
        });
      });

      card.addEventListener("pointerleave", function () {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        card.style.transform = "";
      });
    });
  }
  initTilt();
  /* expose so dynamically-rendered grids (projects.js) can rebind */
  EM.initTilt = initTilt;

  /* ---------- Decorative cursor ring (does not affect the real cursor) ---------- */
  function initCursorRing() {
    if (EM.reducedMotion.matches || !EM.finePointer.matches) return;

    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");
    document.body.appendChild(ring);

    var targetX = 0;
    var targetY = 0;
    var x = targetX;
    var y = targetY;
    var visible = false;
    var running = false;

    function loop() {
      x += (targetX - x) * 0.16;
      y += (targetY - y) * 0.16;
      ring.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      if (Math.abs(targetX - x) < 0.15 && Math.abs(targetY - y) < 0.15) {
        running = false;
        return;
      }
      requestAnimationFrame(loop);
    }

    window.addEventListener(
      "pointermove",
      function (event) {
        targetX = event.clientX;
        targetY = event.clientY;
        if (!visible) {
          visible = true;
          x = targetX;
          y = targetY;
          ring.classList.add("is-active");
        }
        if (!running) {
          running = true;
          requestAnimationFrame(loop);
        }
      },
      { passive: true }
    );

    document.addEventListener(
      "pointerover",
      function (event) {
        var interactive = event.target.closest("a, button, [role='button'], input, select, textarea, summary");
        ring.classList.toggle("is-hovering", Boolean(interactive));
      },
      { passive: true }
    );

    window.addEventListener("pointerleave", function () {
      visible = false;
      ring.classList.remove("is-active");
    });
  }
  initCursorRing();

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  /* ---------- External links: never leak the referrer ---------- */
  document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
    link.setAttribute("rel", "noopener noreferrer");
  });
})();
