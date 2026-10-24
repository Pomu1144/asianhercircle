/* Her Circle — site scripts */
(function () {
  "use strict";

  // Header shadow once the page scrolls
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 4); };
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

    // On small screens the first tap on a parent item opens its submenu
    menu.querySelectorAll(":scope > li").forEach(function (item) {
      if (!item.querySelector(".submenu")) return;
      item.querySelector(":scope > a").addEventListener("click", function (e) {
        if (window.matchMedia("(max-width: 960px)").matches && !item.classList.contains("is-expanded")) {
          e.preventDefault();
          item.classList.add("is-expanded");
        }
      });
    });
    menu.addEventListener("click", function (e) { if (e.target.closest(".submenu a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  // Forms without an action show their success message instead of submitting.
  // Set a form's action (e.g. a Formspree or Netlify Forms endpoint) to make it send.
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      if (form.getAttribute("action")) return;
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.classList.add("is-sent");
      form.reset();
    });
  });

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
