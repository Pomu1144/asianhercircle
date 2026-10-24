/*
  Her Circle — privacy consent.

  Stores the visitor's choice in localStorage ("hc-consent") and only runs
  scripts marked with data-consent once that category is allowed:

    <script type="text/plain" data-consent="analytics" data-src="https://example.com/a.js"></script>
    <script type="text/plain" data-consent="marketing">/* inline code *\/</script>

  The banner is shown again when the policy version (data-version on #consent)
  changes or the stored choice is more than a year old. A Global Privacy Control
  signal keeps marketing off. Other scripts can read the choice with
  window.HerCircleConsent.get() or listen for the "hc:consent" event.
*/
(function () {
  "use strict";

  var KEY = "hc-consent";
  var MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
  var CATEGORIES = ["analytics", "marketing"];

  var banner = document.getElementById("consent");
  if (!banner) return;
  var prefs = document.getElementById("consent-prefs");
  var version = banner.getAttribute("data-version");
  var gpc = navigator.globalPrivacyControl === true;

  function read() {
    try {
      var stored = JSON.parse(localStorage.getItem(KEY));
      if (!stored || stored.version !== version) return null;
      if (Date.now() - new Date(stored.date).getTime() > MAX_AGE_MS) return null;
      return stored;
    } catch (e) {
      return null;
    }
  }

  function write(choice) {
    var record = { version: version, date: new Date().toISOString(), analytics: !!choice.analytics, marketing: !!choice.marketing && !gpc };
    try { localStorage.setItem(KEY, JSON.stringify(record)); } catch (e) { /* storage blocked: choice lasts for this page only */ }
    return record;
  }

  var applied = { analytics: false, marketing: false };

  function apply(consent) {
    // A category that was running and is now withdrawn can only be stopped by reloading.
    var withdrawn = CATEGORIES.some(function (c) { return applied[c] && !consent[c]; });
    if (withdrawn) { window.location.reload(); return; }

    CATEGORIES.forEach(function (category) {
      if (!consent[category] || applied[category]) return;
      applied[category] = true;
      document.querySelectorAll('script[type="text/plain"][data-consent="' + category + '"]').forEach(function (placeholder) {
        var script = document.createElement("script");
        var src = placeholder.getAttribute("data-src");
        if (src) script.src = src; else script.text = placeholder.text;
        placeholder.parentNode.replaceChild(script, placeholder);
      });
    });
    document.dispatchEvent(new CustomEvent("hc:consent", { detail: consent }));
  }

  function setMode(customizing) {
    prefs.hidden = !customizing;
    banner.querySelector('[data-consent-action="customize"]').hidden = customizing;
    banner.querySelector('[data-consent-action="save"]').hidden = !customizing;
  }

  function open(customizing) {
    var current = read() || { analytics: false, marketing: false };
    CATEGORIES.forEach(function (c) { prefs.elements[c].checked = !!current[c]; });
    setMode(!!customizing);
    banner.hidden = false;
    if (customizing) prefs.elements.analytics.focus();
  }

  function close(choice) {
    apply(write(choice));
    banner.hidden = true;
  }

  if (gpc) {
    banner.querySelector(".consent-gpc").hidden = false;
    prefs.elements.marketing.disabled = true;
  }

  banner.addEventListener("click", function (e) {
    var button = e.target.closest("[data-consent-action]");
    if (!button) return;
    switch (button.getAttribute("data-consent-action")) {
      case "accept": close({ analytics: true, marketing: true }); break;
      case "reject": close({ analytics: false, marketing: false }); break;
      case "customize": setMode(true); prefs.elements.analytics.focus(); break;
      case "save": close({ analytics: prefs.elements.analytics.checked, marketing: prefs.elements.marketing.checked }); break;
    }
  });

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-consent-open]")) { e.preventDefault(); open(true); }
  });

  window.HerCircleConsent = {
    get: function () { return read(); },
    open: function () { open(true); }
  };

  var existing = read();
  if (existing) apply(existing); else open(false);
})();
