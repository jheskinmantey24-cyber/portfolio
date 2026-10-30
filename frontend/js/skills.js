/* ==========================================================================
 * skills.js — Skills page interactivity
 * 1. Live task-tracker demo inside the mini browser preview
 * 2. API demo terminal: replay request/response animation
 * 3. Git flow: replay staged animation
 * 4. Code showcase: tabs, syntax highlighting, line numbers, copy button
 * ========================================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ==========================================================
   * 1. Task tracker demo — actually functional
   * ========================================================== */
  function initTaskDemo() {
    var form = document.getElementById("demo-form");
    var input = document.getElementById("demo-input");
    var list = document.getElementById("demo-list");
    var count = document.getElementById("demo-count");
    var empty = document.getElementById("demo-empty");
    if (!form) return;

    var tasks = [
      { id: 1, title: "Fetch projects from REST API" },
      { id: 2, title: "Validate the form inputs" },
    ];
    var nextId = 3;

    function render() {
      list.textContent = "";
      tasks.forEach(function (task) {
        var row = document.createElement("div");
        row.className = "demo-task";

        var label = document.createElement("span");
        label.textContent = task.title; /* textContent — safe rendering */
        row.appendChild(label);

        var del = document.createElement("button");
        del.type = "button";
        del.className = "demo-task__del";
        del.setAttribute("aria-label", "Delete task: " + task.title);
        del.textContent = "×";
        del.addEventListener("click", function () {
          tasks = tasks.filter(function (t) {
            return t.id !== task.id;
          });
          render();
        });
        row.appendChild(del);
        list.appendChild(row);
      });

      empty.hidden = tasks.length > 0;
      count.textContent =
        tasks.length + (tasks.length === 1 ? " task" : " tasks");
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var title = input.value.trim();
      if (!title) return; /* ignore empty input */
      tasks.push({ id: nextId++, title: title });
      input.value = "";
      input.focus();
      render();
    });

    render();
  }

  /* ==========================================================
   * 2. API request/response demo — clearly labelled demonstration
   * ========================================================== */
  function initApiDemo() {
    var stage = document.getElementById("api-demo");
    var replay = document.querySelector("[data-api-replay]");
    if (!stage) return;

    var steps = stage.querySelectorAll(".stage-item");

    function run() {
      steps.forEach(function (step) {
        step.classList.remove("is-active");
      });
      stage.classList.remove("stage-done");
      if (reduced.matches) {
        steps.forEach(function (step) {
          step.classList.add("is-active");
        });
        return;
      }
      /* request line is always visible; stages: status → response */
      window.setTimeout(function () {
        steps[0].classList.add("is-active");
      }, 350);
      window.setTimeout(function () {
        steps[1].classList.add("is-active");
      }, 1000);
    }

    if (replay) replay.addEventListener("click", run);
    return run;
  }

  /* ==========================================================
   * 3. Git workflow animation
   * ========================================================== */
  function initGitDemo() {
    var stage = document.getElementById("git-demo");
    var replay = document.querySelector("[data-git-replay]");
    if (!stage) return;

    var steps = stage.querySelectorAll(".stage-item");

    function run() {
      steps.forEach(function (step) {
        step.classList.remove("is-active");
      });
      if (reduced.matches) {
        steps.forEach(function (step) {
          step.classList.add("is-active");
        });
        return;
      }
      steps.forEach(function (step, index) {
        window.setTimeout(function () {
          step.classList.add("is-active");
        }, index * 620);
      });
    }

    if (replay) replay.addEventListener("click", run);
    return run;
  }

  /* ==========================================================
   * Logic: api/git demos overlap with animations.js IO staging.
   * animations.js auto-plays groups on first view; here we only
   * wire the replay buttons — playing twice is harmless because
   * classes converge to the same final state.
   * ========================================================== */

  /* ==========================================================
   * 4. Code showcase
   * ========================================================== */
  var CODE_EXAMPLES = [
    {
      name: "projects-filter.js",
      label: "JavaScript",
      code: [
        "// Project filtering — vanilla JavaScript, zero dependencies.",
        "const filterButtons = document.querySelectorAll('[data-filter]');",
        "const projectCards = document.querySelectorAll('[data-category]');",
        "",
        "filterButtons.forEach((button) => {",
        "  button.addEventListener('click', () => {",
        "    const filter = button.dataset.filter;",
        "",
        "    projectCards.forEach((card) => {",
        "      const visible = filter === 'all' || card.dataset.category === filter;",
        "      card.hidden = !visible;",
        "    });",
        "  });",
        "});",
      ].join("\n"),
    },
    {
      name: "mini-api-server.js",
      label: "Node.js",
      code: [
        "// Node.js — a minimal API server using standard modules only.",
        "import { createServer } from 'node:http';",
        "",
        "const server = createServer((req, res) => {",
        "  const { method, url } = req;",
        "",
        "  if (method === 'GET' && url === '/api/health') {",
        "    res.writeHead(200, { 'Content-Type': 'application/json' });",
        "    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));",
        "    return;",
        "  }",
        "",
        "  res.writeHead(404, { 'Content-Type': 'application/json' });",
        "  res.end(JSON.stringify({ success: false, error: 'Not found' }));",
        "});",
        "",
        "server.listen(5000, () => {",
        "  console.log('API listening on http://localhost:5000');",
        "});",
      ].join("\n"),
    },
    {
      name: "contact.route.js",
      label: "API Example",
      code: [
        "// Express — a contact route with validation before business logic.",
        "// Credentials live in environment variables, never in this file.",
        "router.post('/contact', rateLimit, validateContact, async (req, res) => {",
        "  const { name, email, subject, message } = req.body;",
        "",
        "  await mailer.send({",
        "    to: process.env.CONTACT_TO_EMAIL,",
        "    replyTo: email,",
        "    subject: `Portfolio inquiry: ${subject}`,",
        "    text: `${name} wrote:\\n\\n${message}`,",
        "  });",
        "",
        "  res.status(201).json({ success: true, message: 'Message received.' });",
        "});",
      ].join("\n"),
    },
  ];

  /* Tiny tokenizer — escapes everything and wraps tokens in spans */
  var TOKEN_RULES = [
    { type: "com", re: /\/\/[^\n]*/ },
    {
      type: "str",
      re: /'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/,
    },
    {
      type: "key",
      re: /\b(?:const|let|var|function|return|import|from|export|default|async|await|if|else|new|for|of|in|try|catch|true|false|null|typeof)\b/,
    },
    { type: "num", re: /\b\d[\d_.]*\b/ },
    { type: "fn", re: /[A-Za-z_$][\w$]*(?=\s*\()/ },
  ];

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function highlight(code) {
    var out = "";
    var lastIndex = 0;

    var master = new RegExp(
      TOKEN_RULES.map(function (rule) {
        return "(" + rule.re.source + ")";
      }).join("|"),
      "g"
    );

    var match;
    while ((match = master.exec(code)) !== null) {
      if (match.index > lastIndex) {
        out += escapeHtml(code.slice(lastIndex, match.index));
      }
      var groupIndex = match.findIndex(function (value, index) {
        return index > 0 && value !== undefined;
      });
      out +=
        '<span class="tok-' +
        TOKEN_RULES[groupIndex - 1].type +
        '">' +
        escapeHtml(match[0]) +
        "</span>";
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < code.length) out += escapeHtml(code.slice(lastIndex));
    return out;
  }

  function buildPanel(examples) {
    examples.forEach(function (example, index) {
      var panel = document.getElementById("panel-" + index);
      if (!panel) return;

      var pre = document.createElement("pre");
      var lines = example.code.split("\n");

      var lineNumbers = document.createElement("div");
      lineNumbers.className = "code-line-no";
      lineNumbers.setAttribute("aria-hidden", "true");
      lineNumbers.textContent = lines.map(function (_, i) {
        return i + 1;
      }).join("\n");

      var code = document.createElement("code");
      code.innerHTML = highlight(example.code); /* escapes internally */

      pre.appendChild(lineNumbers);
      pre.appendChild(code);
      panel.appendChild(pre);
    });
  }

  function initCodeShowcase() {
    buildPanel(CODE_EXAMPLES);

    var tabs = Array.prototype.slice.call(document.querySelectorAll(".code-tab"));
    var filename = document.getElementById("code-filename");
    var copyBtn = document.getElementById("code-copy");

    function selectTab(tab, focus) {
      tabs.forEach(function (other) {
        var selected = other === tab;
        other.setAttribute("aria-selected", String(selected));
        other.tabIndex = selected ? 0 : -1;
        document.getElementById(other.getAttribute("aria-controls")).hidden = !selected;
      });
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        selectTab(tab);
        if (filename) filename.textContent = CODE_EXAMPLES[index].name;
      });

      tab.addEventListener("keydown", function (event) {
        var dir =
          event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
        if (!dir) return;
        event.preventDefault();
        var next = (index + dir + tabs.length) % tabs.length;
        selectTab(tabs[next], true);
        if (filename) filename.textContent = CODE_EXAMPLES[next].name;
      });
    });

    if (filename) filename.textContent = CODE_EXAMPLES[0].name;

    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var activeIndex = tabs.findIndex(function (tab) {
          return tab.getAttribute("aria-selected") === "true";
        });
        var code = CODE_EXAMPLES[activeIndex] ? CODE_EXAMPLES[activeIndex].code : "";
        var label = copyBtn.querySelector("span");

        function flash() {
          copyBtn.classList.add("is-copied");
          if (label) label.textContent = "Copied!";
          window.setTimeout(function () {
            copyBtn.classList.remove("is-copied");
            if (label) label.textContent = "Copy";
          }, 1800);
        }

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(code).then(flash, function () {
            fallbackCopy(code);
            flash();
          });
        } else {
          fallbackCopy(code);
          flash();
        }
      });

      function fallbackCopy(text) {
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.cssText = "position:fixed;opacity:0;";
        document.body.appendChild(area);
        area.select();
        try {
          document.execCommand("copy");
        } catch (error) {
          /* clipboard unavailable — non-critical */
        }
        document.body.removeChild(area);
      }
    }
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initTaskDemo();
    initApiDemo();
    initGitDemo();
    initCodeShowcase();
  });
})();
