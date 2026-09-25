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

  // timetable day tabs (mobile shows one day at a time)
  var table = document.querySelector('.tt');
  var dayTabs = document.querySelectorAll('.day-tabs button');
  function showDay(d) {
    table.setAttribute('data-day', d);
    dayTabs.forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.day === String(d))); });
  }
  dayTabs.forEach(function (b) { b.addEventListener('click', function () { showDay(b.dataset.day); }); });
  var today = new Date().getDay();
  showDay(today >= 1 && today <= 6 ? today : 1);
  var head = table.querySelector('thead th[data-d="' + today + '"]');
  if (head) head.textContent += ' (오늘)';

  // trial form
  var form = document.querySelector('.trial-form');
  var msg = form.querySelector('.form-msg');
  var name = document.getElementById('t-name');
  var tel = document.getElementById('t-tel');
  tel.addEventListener('input', function () {
    var v = tel.value.replace(/\D/g, '').slice(0, 11);
    tel.value = v.length < 4 ? v : v.length < 8 ? v.slice(0, 3) + '-' + v.slice(3) : v.slice(0, 3) + '-' + v.slice(3, v.length - 4) + '-' + v.slice(-4);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.className = 'form-msg';
    [name, tel].forEach(function (el) { el.removeAttribute('aria-invalid'); });
    if (name.value.trim().length < 2) { name.setAttribute('aria-invalid', 'true'); name.focus(); msg.textContent = '이름을 입력해 주세요.'; msg.classList.add('is-error'); return; }
    if (!/^01\d-\d{3,4}-\d{4}$/.test(tel.value)) { tel.setAttribute('aria-invalid', 'true'); tel.focus(); msg.textContent = '연락처를 010-0000-0000 형식으로 입력해 주세요.'; msg.classList.add('is-error'); return; }
    if (!document.getElementById('t-agree').checked) { msg.textContent = '개인정보 수집·이용에 동의해 주셔야 신청할 수 있습니다.'; msg.classList.add('is-error'); return; }
    var type = form.querySelector('input[name="t-type"]:checked').value;
    var time = form.querySelector('input[name="t-time"]:checked').value;
    msg.textContent = name.value.trim() + '님, ' + type + ' 체험(' + time + ') 신청이 접수되었습니다. 오늘 중 카카오톡으로 가능한 시간을 보내 드릴게요.';
    msg.classList.add('is-ok');
    form.reset();
  });
})();
