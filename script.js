(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-tab]'));
  var names = tabs.map(function (t) { return t.dataset.tab; });

  function show(name, focus) {
    if (names.indexOf(name) === -1) name = names[0];
    tabs.forEach(function (t) {
      var on = t.dataset.tab === name;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.dataset.tab).hidden = !on;
    });
    var tab = tabs[names.indexOf(name)];
    document.title = tab.textContent + ' · Soren L. Larsen, PhD';
    if (focus) document.getElementById(name).focus({ preventScroll: true });
  }

  window.addEventListener('hashchange', function () { show(location.hash.slice(1), true); });
  tabs.forEach(function (t, i) {
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var n = tabs[(i + d + tabs.length) % tabs.length];
      n.focus();
      location.hash = n.dataset.tab;
    });
  });
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  function paintBtn() {
    var dark = root.getAttribute('data-theme') !== 'light';
    btn.textContent = dark ? '\u2600 Light theme' : '\u263E Dark theme';
    btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    paintBtn();
  });
  paintBtn();

  // Keep following the device setting live, unless the visitor has chosen a theme with the button
  if (window.matchMedia) {
    var mq = matchMedia('(prefers-color-scheme: dark)');
    var onChange = function (e) {
      var saved = null;
      try { saved = localStorage.getItem('theme'); } catch (err) {}
      if (saved === 'light' || saved === 'dark') return;
      root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      paintBtn();
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
  show(location.hash.slice(1), false);
})();
