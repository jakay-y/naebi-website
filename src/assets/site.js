/* Naebi Dynamic Concepts: site behaviour. */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function store(get, key, val) { try { return get ? sessionStorage.getItem(key) : sessionStorage.setItem(key, val); } catch (e) { return null; } }

  /* ---- Loader: plays fully on the first page of a visit, skipped afterwards ---- */
  function ready() { root.classList.add("is-ready"); }
  var loader = $("#loader");
  if (!loader || root.classList.contains("no-loader")) { requestAnimationFrame(ready); }
  else {
    var logo = null, start = performance.now(), minTime = reduce ? 700 : 2800, progress = 0, finished = false;
    // three.js is fetched only when the loader actually plays (first page of a visit).
    function load(src, cb) { var sc = document.createElement("script"); sc.src = src; sc.onload = cb; sc.onerror = function () {}; document.head.appendChild(sc); }
    function mount3d() {
      if (finished) return;
      try {
        logo = NaebiLogo3D.mount($("#loader-canvas"), { assemble: true, sway: true, interactive: true });
        loader.classList.add("has-3d");
      } catch (e) { logo = null; }
    }
    load("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js", function () { load("assets/logo3d.js", mount3d); });
    var imgs = $$("img[data-critical]"), loaded = 0;
    function count() { loaded++; }
    imgs.forEach(function (im) { if (im.complete) count(); else { im.addEventListener("load", count); im.addEventListener("error", count); } });
    var bar = $(".loader-bar i"), num = $(".loader-count");
    (function tick(now) {
      var timeP = Math.min(1, (now - start) / minTime);
      var assetP = imgs.length ? loaded / imgs.length : 1;
      var target = Math.min(timeP, 0.4 + 0.6 * assetP);
      if (document.readyState === "complete") target = timeP;
      progress += (target - progress) * 0.12;
      if (timeP >= 1 && (assetP >= 1 || document.readyState === "complete")) progress = Math.max(progress, 0.999);
      bar.style.transform = "scaleX(" + progress.toFixed(4) + ")";
      num.textContent = String(Math.round(progress * 100)).padStart(2, "0");
      if (progress >= 0.999 && !finished) { finished = true; num.textContent = "100"; setTimeout(finish, 220); return; }
      requestAnimationFrame(tick);
    })(start);
    function finish() {
      store(false, "naebi-visited", "1");
      loader.classList.add("done"); ready();
      setTimeout(function () { if (logo) logo.dispose(); loader.remove(); }, 1100);
    }
  }

  /* ---- Header: transparent over the hero, solid after it ---- */
  var header = $(".site-header"), hero = $(".hero");
  if (header) {
    if (!hero) header.classList.add("solid");
    else if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { header.classList.toggle("solid", !es[0].isIntersecting); }, { rootMargin: "-80px 0px 0px 0px" }).observe(hero);
    }
  }
  var menuBtn = $(".menu-btn"), menu = $("#mobile-menu");
  if (menuBtn && menu) {
    function setMenu(open) {
      menu.hidden = !open; menuBtn.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      if (open) { var f = $("a, button", menu); if (f) f.focus(); } else menuBtn.focus();
    }
    menuBtn.addEventListener("click", function () { setMenu(true); });
    $$("[data-close-menu]", menu).forEach(function (b) { b.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) setMenu(false); });
  }

  /* ---- Reveal on scroll (only for content below the first screen) ---- */
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove("pre"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    $$(".rv").forEach(function (el, i) {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add("pre"); el.style.transitionDelay = (el.dataset.delay || 0) + "ms"; io.observe(el);
      }
    });
  }

  /* ---- Statement: words darken as the paragraph scrolls through the viewport ---- */
  $$(".statement").forEach(function (el) {
    var words = [];
    function wrap(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement("span"); s.className = "w"; s.textContent = part; words.push(s); frag.appendChild(s);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) wrap(n);
      });
    }
    wrap(el);
    if (reduce) { words.forEach(function (w) { w.classList.add("on"); }); return; }
    function update() {
      var r = el.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      var n = Math.round(p * words.length);
      words.forEach(function (w, i) { w.classList.toggle("on", i < n); });
    }
    window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update); update();
  });

  /* ---- Carousel arrows ---- */
  $$("[data-carousel]").forEach(function (wrap) {
    var track = $(".carousel", wrap), prev = $("[data-prev]", wrap), next = $("[data-next]", wrap);
    if (!track) return;
    function step() { var c = track.firstElementChild; return c ? c.getBoundingClientRect().width + 16 : 300; }
    function sync() {
      prev.disabled = track.scrollLeft < 8;
      next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8;
    }
    prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: reduce ? "auto" : "smooth" }); });
    next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: reduce ? "auto" : "smooth" }); });
    track.addEventListener("scroll", sync, { passive: true }); window.addEventListener("resize", sync); sync();
  });

  /* ---- Operator steps slider ---- */
  $$("[data-steps]").forEach(function (box) {
    var panes = $$(".step-pane", box), num = $(".step-num", box), dots = $(".step-dots", box), i = 0;
    panes.forEach(function (p, k) {
      var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Step " + (k + 1));
      b.addEventListener("click", function () { show(k); }); dots.appendChild(b);
    });
    function show(k) {
      i = (k + panes.length) % panes.length;
      panes.forEach(function (p, n) { p.hidden = n !== i; if (n === i) { p.classList.remove("step-anim"); void p.offsetWidth; p.classList.add("step-anim"); } });
      num.textContent = String(i + 1).padStart(2, "0");
      $$("button", dots).forEach(function (b, n) { b.setAttribute("aria-current", String(n === i)); });
    }
    $("[data-prev]", box).addEventListener("click", function () { show(i - 1); });
    $("[data-next]", box).addEventListener("click", function () { show(i + 1); });
    show(0);
  });

  /* ---- Marquee: duplicate the track once so the loop is seamless ---- */
  $$(".marquee-track").forEach(function (t) {
    var n = t.children.length; t.innerHTML += t.innerHTML;
    Array.prototype.slice.call(t.children, n).forEach(function (c) { c.setAttribute("aria-hidden", "true"); });
  });

  /* ---- Quick verify forms send the ID to the Verify page ---- */
  $$("form[data-quick-verify]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = $("input", f).value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
      location.href = "verify.html" + (v ? "#" + v : "");
    });
  });

  /* ---- Verify tool (sample register until the live API is connected) ---- */
  var vt = $("#verify-tool");
  if (vt) {
    var REGISTER = {
      staff: {
        "NDC-PH-0142": { s: "ok", h: "Verified: active Naebi staff member", d: { Name: "A. Okoro (sample record)", Role: "Field Monitoring Officer", Base: "Port Harcourt (DNPO)" } },
        "NDC-LG-0087": { s: "warn", h: "Suspended: do not deal with this person", d: { Role: "Field Monitoring Officer", Base: "Lagos (DNMM)", Status: "Suspended" } }
      },
      acct: {
        "0123456789": { s: "ok", h: "Verified: official collection account", d: { Channel: "Government collection account (sample)", Status: "Active" } }
      }
    };
    var SAMPLES = { staff: ["NDC-PH-0142", "NDC-LG-0087", "NDC-PH-9999"], acct: ["0123456789", "2233445566"] };
    var mode = "staff", input = $("#v-input", vt), out = $("#v-result", vt), samples = $("#v-samples", vt), lab = $("#v-label", vt);
    var ICON = { ok: '<svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      warn: '<svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 4v5M8 11.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      bad: '<svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' };
    function esc(s) { return s.replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
    function setMode(m) {
      mode = m;
      $$(".seg button", vt).forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.mode === m)); });
      lab.textContent = m === "staff" ? "Staff ID" : "Account number";
      input.placeholder = m === "staff" ? "Staff ID, e.g. NDC-PH-0142" : "10-digit account number";
      input.inputMode = m === "staff" ? "text" : "numeric";
      samples.innerHTML = "Try a sample: " + SAMPLES[m].map(function (s) { return '<button type="button" data-try="' + s + '">' + s + "</button>"; }).join("");
      out.innerHTML = "";
    }
    function run() {
      var v = input.value.trim().toUpperCase();
      if (!v) { out.innerHTML = '<div class="result warn"><span class="ic">' + ICON.warn + '</span><div><h4>Enter a ' + (mode === "staff" ? "staff ID" : "account number") + ' to check</h4><p>' + (mode === "staff" ? "Staff IDs look like NDC-PH-0142." : "Account numbers have 10 digits.") + "</p></div></div>"; input.focus(); return; }
      var r = REGISTER[mode][v];
      if (!r) { out.innerHTML = '<div class="result bad"><span class="ic">' + ICON.bad + '</span><div><h4>Not on our register: ' + esc(v) + "</h4><p>Do not hand over money or documents. Call our Port Harcourt office on 0201 330 6327 to report it.</p></div></div>"; return; }
      out.innerHTML = '<div class="result ' + r.s + '"><span class="ic">' + ICON[r.s] + "</span><div><h4>" + r.h + '</h4><p class="tabular">' + esc(v) + "</p><dl>" +
        Object.keys(r.d).map(function (k) { return "<dt>" + k + "</dt><dd>" + r.d[k] + "</dd>"; }).join("") + "</dl></div></div>";
    }
    $$(".seg button", vt).forEach(function (b) { b.addEventListener("click", function () { setMode(b.dataset.mode); }); });
    samples.addEventListener("click", function (e) { var v = e.target.getAttribute("data-try"); if (v) { input.value = v; run(); } });
    $("form", vt).addEventListener("submit", function (e) { e.preventDefault(); run(); });
    setMode("staff");
    var pre = decodeURIComponent((location.hash || "").slice(1));
    if (pre && pre !== "verify-tool") { if (/^\d{10}$/.test(pre)) setMode("acct"); input.value = pre; run(); }
  }

  /* ---- Forms: validate in the browser; sending switches on when the site goes live ---- */
  $$("form[data-form]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$(".field", f).forEach(function (fd) {
        var el = $("input, select, textarea", fd); if (!el) return;
        var bad = (el.required && !el.value.trim()) || (el.type === "email" && el.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value)) ||
          (el.type === "tel" && el.value && !/^(\+?234|0)[789][01]\d{8}$/.test(el.value.replace(/[\s-]/g, "")));
        fd.classList.toggle("invalid", !!bad); if (bad && ok) { el.focus(); ok = false; }
      });
      if (!ok) return;
      var name = ($("[name=name]", f) || {}).value || "";
      var box = $(".form-done", f.parentNode);
      box.innerHTML = '<div class="notice ok"><strong>Thank you' + (name ? ", " + name.split(" ")[0].replace(/[<>&"]/g, "") : "") + '.</strong><span>Your message is ready. Online sending switches on when the site launches. Until then, call 0201 330 6327 (Monday to Friday, 09:00 to 17:00) and we will take it from there.</span></div>';
      f.hidden = true; box.focus();
    });
  });

  var y = $("[data-year]"); if (y) y.textContent = new Date().getFullYear();
})();
