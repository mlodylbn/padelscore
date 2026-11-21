// Language switch shared by all pages. The choice is remembered between pages.
(function () {
  var root = document.documentElement;

  function stored() {
    try { return localStorage.getItem('padelscore-lang'); } catch (e) { return null; }
  }

  function show(lang) {
    root.classList.toggle('en', lang === 'en');
    root.classList.toggle('es', lang === 'es');
    root.lang = lang;
    document.querySelectorAll('.langs button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    var title = document.querySelector('meta[name="title-' + lang + '"]');
    if (title) document.title = title.content;
    // Screenshots show the app in the page language.
    document.querySelectorAll('img[data-en]').forEach(function (img) {
      if (!img.dataset.pl) { img.dataset.pl = img.getAttribute('src'); img.dataset.altPl = img.alt; }
      var key = lang === 'en' ? 'en' : lang === 'es' && img.dataset.es ? 'es' : 'pl';
      var alt = key === 'en' ? img.dataset.altEn : key === 'es' ? img.dataset.altEs : img.dataset.altPl;
      img.setAttribute('src', img.dataset[key]);
      img.alt = alt;
    });
    // The watch demo plays in the page language too.
    document.querySelectorAll('video[data-src-pl]').forEach(function (v) {
      var src = v.dataset['src' + lang.charAt(0).toUpperCase() + lang.slice(1)];
      var poster = v.dataset['poster' + lang.charAt(0).toUpperCase() + lang.slice(1)];
      if (!v.dataset.labelPl) v.dataset.labelPl = v.getAttribute('aria-label');
      if (v.dataset.lang === lang) return;
      var playing = !v.paused;
      v.dataset.lang = lang;
      v.poster = poster;
      if (v.dataset.loaded) { v.src = src; if (playing) v.play().catch(function () {}); }
      v.setAttribute('aria-label', lang === 'en' ? v.dataset.labelEn : lang === 'es' ? v.dataset.labelEs : v.dataset.labelPl);
    });
  }

  var hash = location.hash.slice(1);
  var known = ['pl', 'en', 'es'];
  // Polish and Spanish browsers get their language, everyone else English.
  var browser = (navigator.language || 'pl').toLowerCase().slice(0, 2);
  var saved = stored();
  var initial = known.indexOf(hash) >= 0 ? hash
    : known.indexOf(saved) >= 0 ? saved
    : known.indexOf(browser) >= 0 ? browser : 'en';
  show(initial);

  document.addEventListener('DOMContentLoaded', function () {
    show(root.lang);
    document.querySelectorAll('.langs button').forEach(function (b) {
      b.addEventListener('click', function () {
        show(b.dataset.lang);
        try { localStorage.setItem('padelscore-lang', b.dataset.lang); } catch (e) {}
      });
    });
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
  });
})();

// The watch demo loads and plays only while it is on screen; a tap pauses it.
// With reduced motion it does not start by itself and shows the controls instead.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('video[data-src-pl]').forEach(function (v) {
      function load() {
        if (v.dataset.loaded) return;
        var lang = v.dataset.lang || document.documentElement.lang || 'pl';
        v.src = v.dataset['src' + lang.charAt(0).toUpperCase() + lang.slice(1)];
        v.dataset.loaded = '1';
      }
      if (reduce || !('IntersectionObserver' in window)) { v.controls = true; v.preload = 'metadata'; load(); return; }
      var userPaused = false;
      v.addEventListener('click', function () {
        if (v.paused) { userPaused = false; v.play().catch(function () {}); } else { userPaused = true; v.pause(); }
      });
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { load(); if (!userPaused) v.play().catch(function () {}); }
          else v.pause();
        });
      }, { threshold: 0.4 }).observe(v);
    });
  });
})();

// Sections slide in as they come into view, unless the system asks for reduced motion.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('reveal-ready');

  document.addEventListener('DOMContentLoaded', function () {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
  });
})();
