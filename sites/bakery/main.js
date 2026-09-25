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

  // bake timeline follows Korea time
  function seoulNow() {
    try {
      var p = {};
      new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Seoul', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), hm: (parseInt(p.hour, 10) % 24) * 100 + parseInt(p.minute, 10) };
    } catch (e) { var d = new Date(); return { day: d.getDay(), hm: d.getHours() * 100 + d.getMinutes() }; }
  }
  function josa(word) {
    var c = word.charCodeAt(word.length - 1);
    return (c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0) ? '이' : '가';
  }
  var now = seoulNow();
  var note = document.querySelector('[data-now-baking]');
  var items = Array.prototype.slice.call(document.querySelectorAll('.timeline li'));
  var closedToday = now.day === 2; // Tuesday
  if (closedToday) {
    note.innerHTML = '화요일은 쉬어요<br><b>수요일 아침 7시</b>에 만나요';
  } else if (now.hm < 700) {
    note.innerHTML = '곧 첫 빵이 나와요<br><b>아침 7시</b> 소금빵부터';
  } else if (now.hm >= 2000) {
    note.innerHTML = '오늘 영업은 끝났어요<br><b>내일 아침 7시</b>에 만나요';
  } else {
    var latest = null, next = null;
    items.forEach(function (li) {
      var at = parseInt(li.dataset.at, 10);
      if (now.hm >= at) { li.classList.add('is-done'); latest = li; }
      else if (!next) { next = li; }
    });
    var toMin = function (hm) { return Math.floor(hm / 100) * 60 + hm % 100; };
    var sinceLatest = latest ? toMin(now.hm) - toMin(parseInt(latest.dataset.at, 10)) : Infinity;
    if (latest && sinceLatest < 60) {
      latest.classList.remove('is-done'); latest.classList.add('is-now');
      var name = latest.dataset.name;
      note.innerHTML = '지금 매장에<br><b>' + name + '</b>' + josa(name) + ' 따끈해요';
    } else if (next) {
      next.classList.add('is-next');
      note.innerHTML = '다음 오븐은<br><b>' + next.querySelector('time').textContent + ' ' + next.dataset.name + '</b>';
    } else {
      note.innerHTML = '오늘 굽기는 끝났어요<br><b>남은 빵</b>은 인스타그램에서';
    }
  }
})();
