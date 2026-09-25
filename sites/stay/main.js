(function () {
  var header = document.querySelector('.header');
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('mnav');
  function solid() { header.classList.toggle('is-solid', window.scrollY > 40 || !nav.hidden); }
  window.addEventListener('scroll', solid, { passive: true }); solid();
  function setMenu(open) {
    nav.hidden = !open; btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    btn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu'); solid();
  }
  btn.addEventListener('click', function () { setMenu(nav.hidden); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });

  // booking inquiry
  var form = document.querySelector('.booking-bar');
  var cin = document.getElementById('b-in'), cout = document.getElementById('b-out');
  var msg = form.querySelector('.booking-msg');
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  var today = new Date(); cin.min = iso(today);
  cin.addEventListener('change', function () {
    if (!cin.value) return;
    var next = new Date(cin.value); next.setDate(next.getDate() + 1);
    cout.min = iso(next);
    if (!cout.value || cout.value <= cin.value) cout.value = iso(next);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault(); msg.className = 'booking-msg';
    if (!cin.value || !cout.value) { msg.textContent = '체크인과 체크아웃 날짜를 선택해 주세요.'; msg.classList.add('is-error'); return; }
    var nights = Math.round((new Date(cout.value) - new Date(cin.value)) / 86400000);
    if (nights < 1) { msg.textContent = '체크아웃은 체크인 다음 날 이후로 선택해 주세요.'; msg.classList.add('is-error'); return; }
    msg.textContent = document.getElementById('b-room').value + ' · ' + nights + '박 예약 문의가 접수되었습니다. 30분 안에 카카오톡으로 가능 여부를 알려 드릴게요.';
    msg.classList.add('is-ok');
  });
})();
