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
  show(location.hash.slice(1), false);
})();
