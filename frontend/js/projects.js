/* ==========================================================================
 * projects.js — project data, rendering, filtering, case studies, GitHub API
 * --------------------------------------------------------------------------
 * ADDING A PROJECT: append an object to PROJECTS below. Render handles the
 * rest. Include real information only — statuses, links, and features are
 * rendered exactly as written.
 * ========================================================================== */
(function () {
  "use strict";

  var EM = window.EM;
  var contact = (EM.contact = EM.contact || {});

  /* ==========================================================
   * Project definitions — single source of truth for home + projects page
   * ========================================================== */
  var STATUS_TONES = { live: "live", wip: "wip", proto: "proto", done: "live" };

  var PROJECTS = [
    {
      id: "point-of-sale",
      title: "Point of Sale System",
      categoryLabel: "Full-Stack Application",
      categories: ["fullstack", "backend"],
      filters: ["all", "fullstack", "backend"],
      status: { label: "In Development", tone: "wip" }, /* EDIT: update as project progresses */
      description:
        "A point-of-sale application designed to support sales recording, product management, and day-to-day business operations.",
      problem:
        "Small retail operations still record sales and stock by hand or across scattered tools, which slows checkout and makes records easy to lose.",
      image: "./assets/images/projects/pos-system.svg",
      imageAlt:
        "Concept preview of the Point of Sale System: a browser window with a navy sidebar, a product catalogue, a checkout cart with a charge button, and a sales summary. Labeled as a concept preview with demo data — the interface is in development.",
      tech: ["HTML5", "CSS3", "JavaScript", "Node.js"],
      github: null,  /* EDIT: add repository URL when published */
      demo: null,    /* EDIT: add live URL when deployed */
      caseStudy: {
        overview:
          "A practical point-of-sale application for small businesses: record sales, manage a product catalogue, and keep day-to-day operations in one place instead of scattered paper or spreadsheets.",
        problem:
          "Manual sales tracking is slow at the counter and unreliable afterwards — totals get miscalculated, stock drifts out of sync, and there is no single record a business owner can trust when reviewing the day.",
        role:
          "Designed and built as a personal project: the product interface (checkout flow, product management) and the Node.js backend that handles the application logic.",
        technologies: ["HTML5 — interface structure", "CSS3 — responsive layout", "JavaScript — application logic & DOM", "Node.js — server-side logic"],
        architecture:
          "A static frontend (semantic HTML, modern CSS, vanilla JS) talks to a Node.js backend over REST endpoints for products and sales. The separation keeps the interface usable and testable while backend logic evolves. MODERATELY EDIT: refine to match the final implementation.",
        challenges: [
          "Modeling the checkout flow so totals, quantities, and product state stay consistent between the interface and the server.",
          "Designing forms and validation that prevent bad sales records at entry time rather than after submission.",
          "Keeping the interface responsive and usable on the small screens and limited hardware typical of sales counters.",
        ],
        solutions: [
          "Centralized the cost calculation in one module so the interface and the record sent to the server can never disagree.",
          "Structured validation to run on both sides — instant feedback in the browser, authoritative checks on the server.",
          "Built mobile-first CSS layouts and kept interactions as plain, dependable controls rather than heavy effects.",
        ],
        outcome:
          "The core flows — product management, the checkout screen, and sales recording — are implemented and exercised locally. It is not yet deployed to production; this is stated plainly rather than implied.",
        future: [
          "A persistence layer (database) for products and historical sales.",
          "Receipt printing or export.",
          "Simple staff accounts so actions are attributable.",
          "Deployment so the system runs from a single browser on shop hardware.",
        ],
      },
    },
    {
      id: "business-os",
      title: "Business Operating System",
      categoryLabel: "Business Management Application",
      categories: ["fullstack"],
      filters: ["all", "fullstack"],
      status: { label: "Prototype", tone: "proto" }, /* EDIT: update status milestone */
      description:
        "A software project exploring how businesses can organize and manage operational processes through a unified digital system.",
      problem:
        "Most operational processes — records, handovers, and informal workflows — live in people's heads and scattered notes, and any factual, structured knowledge of how work happens is lost.",
      image: "./assets/images/projects/business-os.svg",
      imageAlt:
        "Prototype preview of the Business Operating System: a browser window with a charcoal sidebar, operations summary cards, and a process table with in-progress, complete, and scheduled state badges. Labeled as a prototype concept with demo data.",
      tech: ["HTML5", "CSS3", "JavaScript", "Node.js"],
      github: null,
      demo: null,
      caseStudy: {
        overview:
          "An exploratory application that models how a business's recurring operational processes could be represented digitally — as structured records with defined states, rather than as informal notes.",
        problem:
          "Operational knowledge in small businesses is usually oral and informal. This project treats that as a software problem: define the processes, their steps, and their states so they become inspectable and improvable.",
        role:
          "Conceived, designed, and prototyped personally: the process model, the interface concepts, and the Node.js backend structure that the prototype runs against.",
        technologies: ["HTML5", "CSS3", "JavaScript", "Node.js"],
        architecture:
          "The prototype focuses on the process model: entities for processes, steps, and states, with a Node.js service layer shaping how they are created and updated. MODERATELY EDIT: refine as the design settles.",
        challenges: [
          "Resisting the temptation to model everything — deciding what minimal set of entities makes a process representation genuinely useful.",
          "Keeping the prototype honest: every screen must map to a real operational question a business would ask.",
        ],
        solutions: [
          "Started from a single well-understood process and modeled only what that process strictly requires.",
          "Anchored each revision of the prototype to a concrete scenario, so features exist for reasons rather than for completeness.",
        ],
        outcome:
          "A working prototype that demonstrates the core idea and data structure. Features remain modest by design — it is presented as a prototype, not a production system.",
        future: [
          "Confirm a persistence approach and build it out.",
          "A reporting view over process status.",
          "User research with real business workflows.",
        ],
      },
    },
    {
      id: "portfolio",
      title: "Personal Developer Portfolio",
      categoryLabel: "Frontend / Full-Stack",
      categories: ["frontend", "fullstack"],
      filters: ["all", "frontend", "fullstack"],
      status: { label: "Completed", tone: "live" },
      description:
        "A responsive developer portfolio designed to showcase technical skills, projects, and professional identity — the site you are looking at.",
      problem:
        "A developer's portfolio has to demonstrate rather than claim. This site is built as evidence: custom design system, working interactions, and honest content, with no borrowed template.",
      image: "./assets/images/projects/portfolio.svg",
      imageAlt:
        "Rendered preview of this portfolio website: a desktop browser and a phone showing the real homepage design — warm paper background, the headline Designing Experiences. Engineering Solutions., and the two navigation buttons.",
      tech: ["HTML5", "CSS3", "JavaScript (ES6+)", "Node.js", "Express", "Git", "GitHub"],
      github: null,  /* EDIT: this repo's URL */
      demo: null,    /* EDIT: the production URL once live */
      caseStudy: {
        overview:
          "A five-page portfolio built from scratch with vanilla HTML, CSS, and JavaScript on the frontend, and a Node.js/Express backend that powers the contact form. Deployable as a static site plus an API.",
        problem:
          "Generic portfolio templates communicate nothing about the developer — they look borrowed, load slowly, and fake credibility. The alternative was to design a custom system and let the implementation speak.",
        role:
          "Everything: design system, typography scale, component library, page architecture, JS modules, backend, and security hardening.",
        technologies: [
          "HTML5 — semantic, accessible markup",
          "CSS3 — design tokens & responsive layout",
          "JavaScript ES6+ — no frameworks, no template libraries",
          "Node.js & Express — contact API with validation and rate limiting",
          "Git & GitHub — version control",
        ],
        architecture:
          "Static pages (not rendered by Node), a small module layer per concern (navigation, animations, projects, contact), and an Express API that is configurable per deployment so the static site works standalone.",
        challenges: [
          "Building real modal, filtering, and validation behavior without UI libraries.",
          "Keeping animation tasteful and performant across five different pages.",
          "Making the contact form trustworthy: security headers, rate limiting, and server-side validation.",
        ],
        solutions: [
          "Wrote each behavior as a small, focused vanilla-JS module with progressive enhancement.",
          "Set a strict motion budget: CSS-native animations, an IntersectionObserver for reveals, and a full prefers-reduced-motion path.",
          "Treated the backend as if it handled real data: size limits, best-effort sanitization, JSON-only responses, no stack traces in production.",
        ],
        outcome:
          "You are using the outcome. All five pages, the interactions, and the contact backend are implemented in this repository.",
        future: [
          "Domain & HTTPS deployment.",
          "GitHub API showcase once the GitHub profile URL is confirmed.",
          "Lightweight analytics to understand what recruiters read.",
        ],
      },
    },
  ];

  /* ---------- shared rendering helpers (all text via textContent) ---------- */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  var ICONS = {
    github:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z"/></svg>',
  };

  function icon(name, className) {
    var holder = document.createElement("span");
    holder.className = className || "";
    holder.style.display = "inline-flex";
    holder.innerHTML = ICONS[name] || ""; /* trusted static markup only */
    return holder;
  }

  /* ---------- project card ---------- */
  function buildProjectCard(project, size) {
    var card = el("article", "card card--hover media-card tilt");
    card.style.padding = "0";
    card.setAttribute("data-category", project.categories.join(" ")); /* space-separated for aria */
    card.setAttribute("data-categories", project.filters.join(" "));
    card.setAttribute("data-project", project.id);
    if (size === "large") {
      card.classList.add("media-card--featured");
    }

    /* figure */
    var figure = el("figure", "media-card__figure");
    var img = document.createElement("img");
    img.src = project.image;
    img.alt = project.imageAlt;
    img.width = 800;
    img.height = 500;
    if (size !== "large") img.loading = "lazy";
    figure.appendChild(img);

    var statusWrap = el("span", "media-card__status");
    var dot = el("i", "badge__pulse badge__pulse--" + (STATUS_TONES[project.status.tone] || "live"));
    dot.setAttribute("aria-hidden", "true");
    statusWrap.appendChild(dot);
    statusWrap.appendChild(document.createTextNode(project.status.label));
    figure.appendChild(statusWrap);
    card.appendChild(figure);

    /* body */
    var body = el("div", "media-card__body");
    body.appendChild(el("span", "media-card__meta mono", project.categoryLabel));
    body.appendChild(el("h3", null, project.title));
    body.appendChild(el("p", "media-card__desc", project.description));

    var problem = el("p", "media-card__desc");
    problem.style.marginTop = "-0.35rem";
    problem.appendChild(Object.assign(document.createElement("strong"), { textContent: "Problem addressed: " }));
    problem.appendChild(document.createTextNode(project.problem));
    problem.style.fontSize = "0.8rem";
    problem.style.color = "var(--ink-3)";
    body.appendChild(problem);

    var techRow = el("div", "media-card__tech");
    techRow.style.marginTop = "-0.35rem";
    project.tech.forEach(function (name) {
      techRow.appendChild(el("span", "tech-badge", name));
    });
    body.appendChild(techRow);

    /* actions */
    var actions = el("div", "media-card__actions");
    var caseBtn = el("button", "btn btn--primary btn--sm", "View Case Study");
    caseBtn.type = "button";
    caseBtn.setAttribute("data-case", project.id);
    caseBtn.addEventListener("click", function () {
      openCaseStudy(project.id);
    });
    actions.appendChild(caseBtn);

    if (project.github) {
      actions.appendChild(buildLink(project.github, "Repository", "icon-link icon-link--hide-sm", ICONS.github, true));
    }
    if (project.demo) {
      actions.appendChild(buildLink(project.demo, "Live Demo", "icon-link", null, true));
    }
    body.appendChild(actions);
    card.appendChild(body);
    card.insertAdjacentHTML("beforeend", '<span class="tilt__glare" aria-hidden="true"></span>');

    return card;
  }

  function buildLink(href, label, className, iconMarkup, external) {
    var a = el("a", className, label);
    a.href = href;
    if (external) a.target = "_blank";
    if (iconMarkup) {
      var wrap = document.createElement("span");
      wrap.setAttribute("aria-hidden", "true");
      wrap.style.display = "inline-flex";
      wrap.innerHTML = iconMarkup; /* trusted static markup */
      a.insertBefore(wrap, a.firstChild);
    }
    return a;
  }

  /* ---------- render into page grids ---------- */
  document.querySelectorAll("[data-projects-grid]").forEach(function (grid) {
    var mode = grid.getAttribute("data-projects-grid");
    var projects = mode === "featured" ? PROJECTS.slice(0, 3) : PROJECTS;
    projects.forEach(function (project) {
      grid.appendChild(buildProjectCard(project, mode === "featured" ? "large" : "default"));
    });
  });

  /* cards were created after main.js booted — (re)bind tilt now */
  if (typeof EM.initTilt === "function") EM.initTilt();

  /* ==========================================================
   * Filtering (projects page)
   * ========================================================== */
  var filterButtons = document.querySelectorAll("[data-filter]");
  var grid = document.getElementById("projects-grid");
  var emptyState = document.getElementById("filter-empty");
  var statusText = document.getElementById("filter-status");

  function applyFilter(filter) {
    if (!grid) return;
    var cards = grid.querySelectorAll("[data-project]");
    var shown = 0;

    cards.forEach(function (card) {
      var match = filter === "all" || card.dataset.categories.split(" ").indexOf(filter) !== -1;
      card.hidden = !match;
      if (match) shown++;
    });

    if (emptyState) emptyState.hidden = shown > 0;
    if (statusText) {
      statusText.textContent =
        "Showing " + shown + " project" + (shown === 1 ? "" : "s") +
        " — " + (filter === "all" ? "all categories" : "category: " + filter);
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterButtons.forEach(function (other) {
        other.setAttribute("aria-pressed", String(other === button));
      });
      applyFilter(button.getAttribute("data-filter"));
    });
  });

  applyFilter("all");
  if (statusText) statusText.textContent = ""; /* set after initial render */

  /* ==========================================================
   * Case study dialog (native <dialog> = focus trapping, Escape)
   * ========================================================== */
  var dialog = document.getElementById("case-dialog");
  var dialogTitle = document.getElementById("case-dialog-title");
  var dialogMeta = document.getElementById("case-dialog-meta");
  var dialogBody = document.getElementById("case-dialog-body");
  var dialogFoot = document.getElementById("case-dialog-foot");
  var closeBtn = document.getElementById("case-dialog-close");
  var lastTrigger = null;

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      dialog.close();
    });
  }

  if (dialog) {
    dialog.addEventListener("close", function () {
      /* restore light DOM state underneath */
      document.documentElement.style.overflow = "";
    });
  }

  function buildCaseSection(titleText) {
    var section = el("section", "case-section");
    section.appendChild(el("h3", null, titleText));
    return section;
  }

  function openCaseStudy(id) {
    var project = PROJECTS.find(function (p) {
      return p.id === id;
    });
    if (!project || !dialog) return;

    var study = project.caseStudy;
    lastTrigger = document.activeElement;
    document.documentElement.style.overflow = "hidden";

    dialogTitle.textContent = project.title;
    dialogMeta.textContent = project.categoryLabel + " · " + project.status.label;

    dialogBody.textContent = "";

    var overview = buildCaseSection("Overview");
    overview.appendChild(el("p", null, study.overview));
    dialogBody.appendChild(overview);

    var problem = buildCaseSection("The Problem");
    problem.appendChild(el("p", null, study.problem));
    dialogBody.appendChild(problem);

    var role = buildCaseSection("My Role");
    role.appendChild(el("p", null, study.role));
    dialogBody.appendChild(role);

    var technologies = buildCaseSection("Technologies");
    study.technologies.forEach(function (tech) {
      var li = el("li", null, tech);
      technologies.appendChild(li);
    });
    dialogBody.appendChild(technologies);

    var architecture = buildCaseSection("Architecture");
    architecture.appendChild(el("p", null, study.architecture));
    dialogBody.appendChild(architecture);

    var challenges = buildCaseSection("Challenges");
    study.challenges.forEach(function (item) {
      challenges.appendChild(el("li", null, item));
    });
    dialogBody.appendChild(challenges);

    var solutions = buildCaseSection("Solutions");
    study.solutions.forEach(function (item) {
      solutions.appendChild(el("li", null, item));
    });
    dialogBody.appendChild(solutions);

    var outcome = buildCaseSection("Outcome");
    outcome.appendChild(el("p", null, study.outcome));
    dialogBody.appendChild(outcome);

    var future = buildCaseSection("Future Improvements");
    study.future.forEach(function (item) {
      future.appendChild(el("li", null, item));
    });
    dialogBody.appendChild(future);

    /* footer: same actions as card */
    dialogFoot.textContent = "";
    if (project.github) {
      dialogFoot.appendChild(buildLink(project.github, "View Repository", "btn btn--ghost btn--sm", ICONS.github, true));
    }
    if (project.demo) {
      dialogFoot.appendChild(buildLink(project.demo, "Live Demo", "btn btn--primary btn--sm", null, true));
    }
    var backBtn = el("button", "btn btn--ghost btn--sm case-dialog__back", "Close");
    backBtn.type = "button";
    backBtn.addEventListener("click", function () {
      dialog.close();
    });
    dialogFoot.appendChild(backBtn);

    dialog.showModal();
    dialog.querySelector(".case-dialog__scroll").scrollTop = 0;
  }

  /* ==========================================================
   * GitHub showcase (public API, graceful failure, no invented stats)
   * ========================================================== */
  function initGitHub() {
    var username = contact.githubUsername;
    var grid = document.getElementById("repo-grid");
    var statusNode = document.getElementById("github-status");
    var profileLink = document.querySelector("[data-github-link]");
    if (!grid) return;

    function setStatus(text, isError) {
      if (statusNode) {
        statusNode.textContent = text;
        statusNode.style.color = isError ? "var(--color-danger)" : "var(--ink-3)";
      }
    }

    if (!username) {
      setStatus("Setup: add your GitHub username to js/config.js (contact.githubUsername) to display live repository data here.");
      if (profileLink) profileLink.hidden = true;
      return;
    }

    if (profileLink) {
      profileLink.hidden = false;
      profileLink.href = "https://github.com/" + encodeURIComponent(username);
    }

    setStatus("Loading repositories from GitHub…");

    fetch(
      "https://api.github.com/users/" + encodeURIComponent(username) + "/repos?sort=updated&per_page=6&type=owner",
      { headers: { Accept: "application/vnd.github+json" } }
    )
      .then(function (response) {
        if (response.status === 403 || response.status === 429) {
          throw new Error("rate-limited");
        }
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then(function (repos) {
        if (!Array.isArray(repos)) throw new Error("unexpected");
        grid.textContent = "";
        var own = repos.filter(function (repo) {
          return !repo.fork && !repo.private;
        });

        if (!own.length) {
          setStatus("No public repositories found for this account yet.");
          return;
        }

        own.slice(0, 6).forEach(function (repo) {
          var card = el("a", "repo-card");
          card.href = repo.html_url;
          card.target = "_blank";

          var nameRow = el("span", "repo-card__name");
          nameRow.appendChild(icon("github"));
          nameRow.appendChild(document.createTextNode(repo.name));
          card.appendChild(nameRow);

          card.appendChild(el("p", "repo-card__desc", repo.description || "No description provided."));

          var lang = el("span", "repo-card__lang", repo.language || "—");
          card.appendChild(lang);
          grid.appendChild(card);
        });

        setStatus("Live data via the public GitHub API — figures shown are what GitHub reports.");
      })
      .catch(function (error) {
        grid.textContent = "";
        if (error.message === "rate-limited") {
          setStatus("GitHub's public API rate limit was reached. Your repositories remain at the profile link above.", true);
        } else {
          setStatus("Repository data couldn't be loaded (network issue or API limit). Visit the profile link above instead.", true);
        }
      });
  }
  initGitHub();

  /* expose for potential page-specific needs */
  window.PROJECTS_DATA = PROJECTS;
})();
