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

  // floating button: hidden while the hero buttons or the consult form are on screen
  var floatCta = document.querySelector('.float-cta');
  var watched = [document.querySelector('.hero-actions'), document.getElementById('consult')];
  var visible = new Set();
  if ('IntersectionObserver' in window) {
    floatCta.style.visibility = 'hidden';
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) visible.add(en.target); else visible.delete(en.target); });
      floatCta.style.visibility = visible.size ? 'hidden' : '';
    });
    watched.forEach(function (el) { io.observe(el); });
  }

  // consultation form
  var form = document.querySelector('.consult-form');
  var msg = form.querySelector('.form-msg');
  var tel = document.getElementById('c-tel');
  tel.addEventListener('input', function () {
    var v = tel.value.replace(/\D/g, '').slice(0, 11);
    tel.value = v.length < 4 ? v : v.length < 8 ? v.slice(0, 3) + '-' + v.slice(3) : v.slice(0, 3) + '-' + v.slice(3, v.length - 4) + '-' + v.slice(-4);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.className = 'form-msg';
    form.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
    var rules = [
      ['c-name', function (v) { return v.trim().length >= 2; }, '성함을 입력해 주세요.'],
      ['c-tel', function (v) { return /^01\d-\d{3,4}-\d{4}$/.test(v); }, '연락처를 010-0000-0000 형식으로 입력해 주세요.'],
      ['c-area', function (v) { return v !== ''; }, '상담 분야를 선택해 주세요.'],
      ['c-body', function (v) { return v.trim().length >= 10; }, '상담 내용을 10자 이상 적어 주세요.']
    ];
    for (var i = 0; i < rules.length; i++) {
      var el = document.getElementById(rules[i][0]);
      if (!rules[i][1](el.value)) { el.setAttribute('aria-invalid', 'true'); el.focus(); msg.textContent = rules[i][2]; msg.classList.add('is-error'); return; }
    }
    if (!document.getElementById('c-agree').checked) { msg.textContent = '개인정보 수집·이용에 동의해 주셔야 예약할 수 있습니다.'; msg.classList.add('is-error'); return; }
    var way = document.getElementById('c-way').value;
    msg.textContent = way + ' 예약이 접수되었습니다. 담당 변호사가 업무시간 내 2시간 안에 연락드리겠습니다.';
    msg.classList.add('is-ok');
    form.reset();
  });
})();
