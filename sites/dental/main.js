(function () {
  // mobile menu
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('mnav');
  btn.addEventListener('click', function () {
    var open = nav.hidden;
    nav.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    btn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) { nav.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.querySelector('use').setAttribute('href', '#i-menu'); }
  });

  // today's hours (Korea time)
  var HOURS = {
    0: null,
    1: [930, 1830, true], 2: [930, 1830, true], 3: [930, 2030, true],
    4: [930, 1830, true], 5: [930, 1830, true], 6: [930, 1400, false]
  };
  function seoulNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Seoul', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      var map = {}; parts.forEach(function (p) { map[p.type] = p.value; });
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: days[map.weekday], hm: (parseInt(map.hour, 10) % 24) * 100 + parseInt(map.minute, 10) };
    } catch (e) {
      var d = new Date(); return { day: d.getDay(), hm: d.getHours() * 100 + d.getMinutes() };
    }
  }
  function fmt(n) { var s = String(n).padStart(4, '0'); return s.slice(0, 2) + ':' + s.slice(2); }
  var now = seoulNow();
  var today = HOURS[now.day];
  var hoursEl = document.querySelector('[data-today-hours]');
  var stateEl = document.querySelector('[data-today-state]');
  var noteEl = document.querySelector('.today-note');
  var state, cls = '';
  if (!today) {
    hoursEl.textContent = '휴진';
    state = '오늘은 휴진입니다'; cls = 'is-closed';
    noteEl.textContent = '월요일 09:30에 진료를 시작합니다';
  } else {
    hoursEl.textContent = fmt(today[0]) + ' – ' + fmt(today[1]);
    noteEl.textContent = today[2] ? '점심시간 13:00 – 14:00' : '토요일은 점심시간 없이 진료합니다';
    if (now.hm < today[0]) { state = '진료 시작 전'; cls = 'is-closed'; }
    else if (now.hm >= today[1]) { state = '오늘 진료 종료'; cls = 'is-closed'; }
    else if (today[2] && now.hm >= 1300 && now.hm < 1400) { state = '점심시간'; cls = 'is-lunch'; }
    else { state = '지금 진료 중'; }
  }
  stateEl.innerHTML = '<span class="dot"></span>' + state;
  if (cls) stateEl.classList.add(cls);
  var row = document.querySelector('.hours tr[data-day="' + now.day + '"]');
  if (row) row.classList.add('is-today');

  // reservation form
  var form = document.querySelector('.reserve-form');
  var msg = form.querySelector('.form-msg');
  var tel = document.getElementById('r-tel');
  var date = document.getElementById('r-date');
  var d = new Date(); date.min = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

  tel.addEventListener('input', function () {
    var v = tel.value.replace(/\D/g, '').slice(0, 11);
    tel.value = v.length < 4 ? v : v.length < 8 ? v.slice(0, 3) + '-' + v.slice(3) : v.slice(0, 3) + '-' + v.slice(3, v.length - 4) + '-' + v.slice(-4);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.className = 'form-msg'; msg.textContent = '';
    form.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
    var checks = [
      ['r-name', function (v) { return v.trim().length >= 2; }, '성함을 입력해 주세요.'],
      ['r-tel', function (v) { return /^01\d-\d{3,4}-\d{4}$/.test(v); }, '연락처를 010-0000-0000 형식으로 입력해 주세요.'],
      ['r-type', function (v) { return v !== ''; }, '희망 진료를 선택해 주세요.'],
      ['r-date', function (v) { return v !== ''; }, '희망 날짜를 선택해 주세요.']
    ];
    for (var i = 0; i < checks.length; i++) {
      var el = document.getElementById(checks[i][0]);
      if (!checks[i][1](el.value)) {
        el.setAttribute('aria-invalid', 'true'); el.focus();
        msg.textContent = checks[i][2]; msg.classList.add('is-error');
        return;
      }
    }
    if (!document.getElementById('r-agree').checked) {
      msg.textContent = '개인정보 수집·이용에 동의해 주셔야 예약을 신청할 수 있습니다.'; msg.classList.add('is-error');
      return;
    }
    msg.textContent = '예약 신청이 접수되었습니다. 진료시간 내 30분 안에 ' + tel.value + '로 전화드리겠습니다.';
    msg.classList.add('is-ok');
    form.reset();
  });
})();
