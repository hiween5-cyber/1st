(function () {
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('mnav');
  function setMenu(open) {
    nav.hidden = !open; btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    btn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  }
  btn.addEventListener('click', function () { setMenu(nav.hidden); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });

  var form = document.querySelector('.trial-form');
  var msg = form.querySelector('.form-msg');
  var name = document.getElementById('g-name'), tel = document.getElementById('g-tel');
  tel.addEventListener('input', function () {
    var v = tel.value.replace(/\D/g, '').slice(0, 11);
    tel.value = v.length < 4 ? v : v.length < 8 ? v.slice(0, 3) + '-' + v.slice(3) : v.slice(0, 3) + '-' + v.slice(3, v.length - 4) + '-' + v.slice(-4);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault(); msg.className = 'form-msg';
    [name, tel].forEach(function (el) { el.removeAttribute('aria-invalid'); });
    if (name.value.trim().length < 2) { name.setAttribute('aria-invalid', 'true'); name.focus(); msg.textContent = '이름을 입력해 주세요.'; msg.classList.add('is-error'); return; }
    if (!/^01\d-\d{3,4}-\d{4}$/.test(tel.value)) { tel.setAttribute('aria-invalid', 'true'); tel.focus(); msg.textContent = '연락처를 010-0000-0000 형식으로 입력해 주세요.'; msg.classList.add('is-error'); return; }
    if (!document.getElementById('g-agree').checked) { msg.textContent = '개인정보 수집·이용에 동의해 주셔야 신청할 수 있습니다.'; msg.classList.add('is-error'); return; }
    msg.textContent = name.value.trim() + '님, 체험 신청이 접수되었습니다. 오늘 안에 담당 트레이너가 연락드립니다.';
    msg.classList.add('is-ok'); form.reset();
  });
})();
