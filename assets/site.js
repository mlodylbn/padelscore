// Language switch shared by all pages. The choice is remembered between pages.
(function () {
  var root = document.documentElement;

  function stored() {
    try { return localStorage.getItem('padelscore-lang'); } catch (e) { return null; }
  }

  function show(lang) {
    root.classList.toggle('en', lang === 'en');
    root.lang = lang;
    document.querySelectorAll('.langs button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    var title = document.querySelector('meta[name="title-' + lang + '"]');
    if (title) document.title = title.content;
    // Screenshots show the app in the page language.
    document.querySelectorAll('img[data-en]').forEach(function (img) {
      if (!img.dataset.pl) { img.dataset.pl = img.getAttribute('src'); img.dataset.altPl = img.alt; }
      var en = lang === 'en';
      img.setAttribute('src', en ? img.dataset.en : img.dataset.pl);
      img.alt = en ? img.dataset.altEn : img.dataset.altPl;
    });
  }

  var hash = location.hash.slice(1);
  var initial = (hash === 'en' || hash === 'pl') ? hash
    : stored() || ((navigator.language || 'pl').toLowerCase().indexOf('pl') === 0 ? 'pl' : 'en');
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
