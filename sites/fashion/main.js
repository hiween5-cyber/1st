(function () {
  var header = document.querySelector('.header');
  var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // mobile drawer
  var drawer = document.getElementById('drawer');
  var menuBtn = document.querySelector('.menu-btn');
  function openDrawer() {
    drawer.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    drawer.querySelector('.drawer-close').focus();
  }
  function closeDrawer() {
    drawer.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuBtn.focus();
  }
  menuBtn.addEventListener('click', openDrawer);
  drawer.addEventListener('click', function (e) {
    if (e.target === drawer || e.target.closest('.drawer-close') || e.target.closest('.drawer-nav a')) closeDrawer();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !drawer.hidden) closeDrawer(); });

  // category tabs
  var tabs = document.querySelectorAll('.tabs [role="tab"]');
  var products = document.querySelectorAll('.product');
  var empty = document.querySelector('.empty');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var f = tab.dataset.filter;
      var shown = 0;
      tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t === tab)); });
      products.forEach(function (p) {
        var match = f === 'all' || p.dataset.cat === f;
        p.hidden = !match;
        if (match) shown++;
      });
      empty.hidden = shown > 0;
    });
  });

  // wishlist toggle
  document.querySelectorAll('.wish').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', on ? '관심상품에서 빼기' : '관심상품 담기');
    });
  });

  // lookbook drag to scroll (desktop mouse)
  var track = document.querySelector('.look-track');
  var down = false, startX = 0, startLeft = 0;
  track.addEventListener('mousedown', function (e) {
    down = true; startX = e.pageX; startLeft = track.scrollLeft;
    track.classList.add('is-dragging');
  });
  window.addEventListener('mouseup', function () { down = false; track.classList.remove('is-dragging'); });
  track.addEventListener('mousemove', function (e) {
    if (!down) return;
    e.preventDefault();
    track.scrollLeft = startLeft - (e.pageX - startX);
  });

  // newsletter
  var form = document.querySelector('.nl-form');
  var email = document.getElementById('nl-email');
  var agree = document.getElementById('nl-agree');
  var msg = form.querySelector('.form-msg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.className = 'form-msg';
    email.removeAttribute('aria-invalid');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.setAttribute('aria-invalid', 'true');
      msg.textContent = '이메일 주소를 정확히 입력해 주세요. 예: name@example.com';
      msg.classList.add('is-error');
      email.focus();
      return;
    }
    if (!agree.checked) {
      msg.textContent = '개인정보 수집·이용에 동의해 주셔야 구독할 수 있습니다.';
      msg.classList.add('is-error');
      return;
    }
    msg.textContent = '구독이 완료되었습니다. 다음 컬렉션 소식을 메일로 보내 드릴게요.';
    msg.classList.add('is-ok');
    form.reset();
  });
})();
