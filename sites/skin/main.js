(function () {
  // mobile menu
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('mnav');
  function setMenu(open) {
    nav.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    btn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  }
  btn.addEventListener('click', function () { setMenu(nav.hidden); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });

  // program tabs (keyboard: arrow keys)
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.menu-tabs [role="tab"]'));
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(tab); });
    tab.addEventListener('keydown', function (e) {
      var next = e.key === 'ArrowRight' ? tabs[(i + 1) % tabs.length] : e.key === 'ArrowLeft' ? tabs[(i - 1 + tabs.length) % tabs.length] : null;
      if (next) { e.preventDefault(); select(next); next.focus(); }
    });
  });

  // hero badge jumps to the special tab
  document.querySelector('.trial-badge').addEventListener('click', function () {
    select(document.getElementById('tab-special'));
  });
})();
