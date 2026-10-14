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
