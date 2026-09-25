(function () {
  var viewer = document.getElementById('viewer');
  var frame = viewer.querySelector('iframe');
  var title = document.getElementById('viewer-title');
  var openLink = viewer.querySelector('.viewer-open');

  document.querySelectorAll('[data-mobile]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var url = btn.getAttribute('data-mobile');
      // phones: just open the site itself
      if (window.innerWidth < 640 || typeof viewer.showModal !== 'function') { window.location.href = url; return; }
      frame.src = url;
      title.textContent = btn.getAttribute('data-title') + ' · 모바일 화면';
      openLink.href = url;
      viewer.showModal();
    });
  });

  function close() { viewer.close(); }
  viewer.querySelector('.viewer-close').addEventListener('click', close);
  viewer.addEventListener('click', function (e) { if (e.target === viewer) close(); });
  viewer.addEventListener('close', function () { frame.src = 'about:blank'; });
})();
