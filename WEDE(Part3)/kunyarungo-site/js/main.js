/* Kunyarungo AgriTech - shared interactivity (vanilla JavaScript)
   Mobile nav, tabs, accordion, modals, lightbox, scroll reveal, counters */
(function () {
  'use strict';

  /* ---------- Mobile navigation ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- Tabs (about.html) ---------- */
  document.querySelectorAll('.tabs').forEach(function (tabs) {
    var buttons = Array.prototype.slice.call(tabs.querySelectorAll('[role="tab"]'));
    function select(btn) {
      buttons.forEach(function (b) {
        var active = b === btn;
        b.setAttribute('aria-selected', String(active));
        b.tabIndex = active ? 0 : -1;
        var panel = document.getElementById(b.getAttribute('aria-controls'));
        if (panel) { panel.hidden = !active; }
      });
    }
    buttons.forEach(function (btn, i) {
      btn.addEventListener('click', function () { select(btn); });
      btn.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') { next = buttons[(i + 1) % buttons.length]; }
        if (e.key === 'ArrowLeft') { next = buttons[(i - 1 + buttons.length) % buttons.length]; }
        if (next) { e.preventDefault(); select(next); next.focus(); }
      });
    });
  });

  /* ---------- Accordion ---------- */
  document.querySelectorAll('.accordion-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (open) {
        panel.style.maxHeight = '0';
        panel.classList.remove('open');
      } else {
        panel.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Modals ---------- */
  var lastTrigger = null;
  function openModal(overlay, trigger) {
    lastTrigger = trigger || null;
    overlay.classList.add('open');
    var focusable = overlay.querySelector('button');
    if (focusable) { focusable.focus(); }
  }
  function closeModal(overlay) {
    overlay.classList.remove('open');
    if (lastTrigger) { lastTrigger.focus(); }
  }
  document.querySelectorAll('[data-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var overlay = document.getElementById(btn.getAttribute('data-modal'));
      if (overlay) { openModal(overlay, btn); }
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.hasAttribute('data-close')) { closeModal(overlay); }
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var gallery = document.getElementById('gallery');
  var lightbox = document.getElementById('lightbox');
  if (gallery && lightbox) {
    var items = Array.prototype.slice.call(gallery.querySelectorAll('button'));
    var img = document.getElementById('lightboxImg');
    var cap = document.getElementById('lightboxCaption');
    var current = 0;

    function show(i) {
      current = (i + items.length) % items.length;
      var btn = items[current];
      img.src = btn.getAttribute('data-full');
      img.alt = btn.querySelector('img').alt;
      cap.textContent = btn.getAttribute('data-caption');
    }
    function openLb(i) {
      show(i);
      lightbox.classList.add('open');
      document.getElementById('lbClose').focus();
      document.body.style.overflow = 'hidden';
    }
    function closeLb() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      items[current].focus();
    }
    items.forEach(function (btn, i) { btn.addEventListener('click', function () { openLb(i); }); });
    document.getElementById('lbClose').addEventListener('click', closeLb);
    document.getElementById('lbPrev').addEventListener('click', function () { show(current - 1); });
    document.getElementById('lbNext').addEventListener('click', function () { show(current + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) { closeLb(); } });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) { return; }
      if (e.key === 'ArrowRight') { show(current + 1); }
      if (e.key === 'ArrowLeft') { show(current - 1); }
    });
  }

  /* Escape closes any open modal or lightbox */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') { return; }
    document.querySelectorAll('.modal-overlay.open').forEach(closeModal);
    if (lightbox && lightbox.classList.contains('open')) { document.getElementById('lbClose').click(); }
  });

  /* ---------- Scroll reveal animation (IntersectionObserver) ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Animated counters (home page) ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var start = null;
    var duration = 1500;
    function step(ts) {
      if (!start) { start = ts; }
      var p = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor(p * target);
      if (p < 1) { requestAnimationFrame(step); } else { el.textContent = target; }
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
    } else {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { runCounter(entry.target); co.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { co.observe(el); });
    }
  }
})();
