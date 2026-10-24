/* Her Circle — site interactions (no dependencies) */
(function () {
  "use strict";

  // Sticky header shadow
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    var setOpen = function (open) {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      toggle.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", function () { setOpen(!menu.classList.contains("is-open")); });

    // On small screens, the first tap on a parent item expands its submenu
    menu.querySelectorAll(":scope > li").forEach(function (item) {
      var link = item.querySelector(":scope > a");
      if (!item.querySelector(".submenu")) return;
      link.addEventListener("click", function (e) {
        if (window.matchMedia("(max-width: 980px)").matches && !item.classList.contains("is-expanded")) {
          e.preventDefault();
          item.classList.add("is-expanded");
        }
      });
    });
    menu.addEventListener("click", function (e) {
      var a = e.target.closest(".submenu a");
      if (a) setOpen(false);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Animated counters: <strong data-count="1200" data-suffix="+">
  var counters = document.querySelectorAll("[data-count]");
  var animate = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1400, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animate(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }

  // Filter groups: buttons [data-filter] inside [data-filter-group] toggle [data-filter-item] by data-tags
  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var target = document.querySelector(group.getAttribute("data-filter-group"));
    if (!target) return;
    var apply = function (value) {
      group.querySelectorAll("[data-filter]").forEach(function (b) {
        b.classList.toggle("is-active", b.getAttribute("data-filter") === value);
      });
      target.querySelectorAll("[data-filter-item]").forEach(function (item) {
        var tags = (item.getAttribute("data-tags") || "").split(" ");
        item.classList.toggle("is-hidden", value !== "all" && tags.indexOf(value) === -1);
      });
    };
    group.addEventListener("click", function (e) {
      var b = e.target.closest("[data-filter]");
      if (b) apply(b.getAttribute("data-filter"));
    });
    // Allow deep links like events.html?type=workshop#upcoming
    var param = new URLSearchParams(window.location.search).get("type");
    if (param && group.querySelector('[data-filter="' + param + '"]')) apply(param);
  });

  // Nav links that preset an events filter
  document.querySelectorAll("[data-filter-link]").forEach(function (a) {
    a.setAttribute("href", "events.html?type=" + a.getAttribute("data-filter-link") + "#upcoming");
  });

  // Live search: <input data-search="#list"> filters children with [data-search-item]
  document.querySelectorAll("[data-search]").forEach(function (input) {
    var list = document.querySelector(input.getAttribute("data-search"));
    if (!list) return;
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      list.querySelectorAll("[data-search-item]").forEach(function (item) {
        item.classList.toggle("is-hidden", q && item.textContent.toLowerCase().indexOf(q) === -1);
      });
    });
  });

  // Demo forms: show success message without a backend.
  // Replace with a real endpoint (e.g. Formspree, Netlify Forms) by setting the form's action.
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      if (form.getAttribute("action")) return;
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.classList.add("is-sent");
      form.reset();
    });
  });

  // Links that preselect a form option: membership tier and contact topic
  var preselect = function (attr, selectId) {
    document.querySelectorAll("[" + attr + "]").forEach(function (a) {
      a.addEventListener("click", function () {
        var select = document.getElementById(selectId);
        if (select) select.value = a.getAttribute(attr);
      });
    });
  };
  preselect("data-tier", "j-tier");
  preselect("data-topic", "c-topic");

  // Member portal tabs
  var portalLinks = document.querySelectorAll("[data-panel]");
  if (portalLinks.length) {
    var show = function (id) {
      portalLinks.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("data-panel") === id); });
      document.querySelectorAll(".portal-panel").forEach(function (p) { p.classList.toggle("is-active", p.id === id); });
    };
    portalLinks.forEach(function (l) {
      l.addEventListener("click", function (e) {
        e.preventDefault();
        var id = l.getAttribute("data-panel");
        show(id);
        history.replaceState(null, "", "#" + id);
      });
    });
    var initial = window.location.hash.slice(1);
    if (initial && document.getElementById(initial)) show(initial);
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
