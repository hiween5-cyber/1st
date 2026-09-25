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

  // rough estimate from type and size
  var form = document.querySelector('.contact-form');
  var size = document.getElementById('c-size');
  var est = form.querySelector('.estimate');
  var rate = { '아파트': 180, '빌라·주택': 200, '상업 공간': 150 };
  function update() {
    var type = form.querySelector('input[name="c-type"]:checked').value;
    var py = parseInt(size.value, 10);
    if (!py || !rate[type]) { est.textContent = type === '부분 인테리어' && py ? '부분 인테리어는 공간별로 견적을 드립니다.' : ''; return; }
    var low = Math.round(py * rate[type] / 100) * 100, high = Math.round(py * rate[type] * 1.35 / 100) * 100;
    est.textContent = '예상 공사비 ' + low.toLocaleString() + '만 – ' + high.toLocaleString() + '만 원 (' + type + ' ' + py + '평 기준, 자재에 따라 달라집니다)';
  }
  size.addEventListener('input', update);
  form.querySelectorAll('input[name="c-type"]').forEach(function (r) { r.addEventListener('change', update); });

  var tel = document.getElementById('c-tel'), name = document.getElementById('c-name'), msg = form.querySelector('.form-msg');
  tel.addEventListener('input', function () {
    var v = tel.value.replace(/\D/g, '').slice(0, 11);
    tel.value = v.length < 4 ? v : v.length < 8 ? v.slice(0, 3) + '-' + v.slice(3) : v.slice(0, 3) + '-' + v.slice(3, v.length - 4) + '-' + v.slice(-4);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault(); msg.className = 'form-msg';
    [name, tel].forEach(function (el) { el.removeAttribute('aria-invalid'); });
    if (name.value.trim().length < 2) { name.setAttribute('aria-invalid', 'true'); name.focus(); msg.textContent = '성함을 입력해 주세요.'; msg.classList.add('is-error'); return; }
    if (!/^01\d-\d{3,4}-\d{4}$/.test(tel.value)) { tel.setAttribute('aria-invalid', 'true'); tel.focus(); msg.textContent = '연락처를 010-0000-0000 형식으로 입력해 주세요.'; msg.classList.add('is-error'); return; }
    if (!document.getElementById('c-agree').checked) { msg.textContent = '개인정보 수집·이용에 동의해 주셔야 문의할 수 있습니다.'; msg.classList.add('is-error'); return; }
    msg.textContent = '견적 문의가 접수되었습니다. 담당 실장이 하루 안에 연락드립니다.';
    msg.classList.add('is-ok'); form.reset(); est.textContent = '';
  });
})();
