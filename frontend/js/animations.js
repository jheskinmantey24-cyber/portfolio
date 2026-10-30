/* ==========================================================================
 * animations.js — page-specific motion
 * Staged reveals: flow diagram (home) & git visual (skills) light up step
 * by step when scrolled into view. Degrades gracefully for reduced-motion
 * and non-IntersectionObserver browsers.
 * ========================================================================== */
(function () {
  "use strict";

  var EM = window.EM;

  /* ==========================================================
   * Staged visual reveals
   *   [data-stage-group] > .stage-item elements light up in order
   * ========================================================== */
  function initStageGroups() {
    var groups = document.querySelectorAll("[data-stage-group]");
    if (!groups.length) return;

    var reduced = EM.reducedMotion.matches;

    groups.forEach(function (group) {
      var steps = Array.prototype.slice.call(group.querySelectorAll(".stage-item"));
      if (reduced) {
        steps.forEach(function (step) {
          step.classList.add("is-active");
        });
        /* final state for reduced motion (api response visible) */
        group.classList.add("stage-done");
        return;
      }

      var observer = "IntersectionObserver" in window
        ? new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              observer.unobserve(entry.target);
              play();
            });
          }, { threshold: 0.35 })
        : null;

      function play() {
        steps.forEach(function (step, index) {
          window.setTimeout(function () {
            step.classList.add("is-active");
            if (index === steps.length - 1) group.classList.add("stage-done");
          }, index * 480);
        });
      }

      if (observer) {
        observer.observe(group);
      } else {
        play(); /* very old browsers: run immediately */
      }
    });
  }

  /* ---------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initStageGroups();
  });
})();
