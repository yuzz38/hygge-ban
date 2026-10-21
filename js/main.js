/* Hygge Barn — landing scripts
   © 2026 Полунин Лев. Все права защищены. */
(function () {
  'use strict';

  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header + burger ---------- */
  var header = $('#header');
  var burger = $('#burger');
  var nav = $('#nav');
  var sticky = $('#stickyCta');
  var lastY = 0;

  function closeMenu() {
    nav.classList.remove('is-open');
    header.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
    doc.documentElement.style.overflow = '';
    doc.body.style.overflow = '';
  }
  burger.addEventListener('click', function () {
    var open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    header.classList.remove('is-hidden');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    doc.documentElement.style.overflow = open ? 'hidden' : '';
    doc.body.style.overflow = open ? 'hidden' : '';
  });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', closeMenu); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); closeLb(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 980) closeMenu(); });

  var ticking = false;
  function onScroll() {
    var y = window.pageYOffset || doc.documentElement.scrollTop;
    header.classList.toggle('is-scrolled', y > 40);
    if (!nav.classList.contains('is-open')) header.classList.toggle('is-hidden', y > 500 && y > lastY + 4);
    if (y < lastY - 4) header.classList.remove('is-hidden');
    if (sticky) {
      var nearEnd = (window.innerHeight + y) > (doc.documentElement.scrollHeight - 700);
      sticky.classList.toggle('is-visible', y > window.innerHeight * 0.8 && !nearEnd);
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- garland bulbs along the gable roof ---------- */
  var bulbs = $('#bulbs');
  if (bulbs) {
    var n = 7, html = '';
    for (var side = 0; side < 2; side++) {
      for (var i = 0; i <= n; i++) {
        if (side === 1 && i === 0) continue; // ridge once
        var t = i / n;
        var x = side === 0 ? 50 - t * 52 : 50 + t * 52;
        var y = 0.6 + t * 24.9;
        html += '<i class="bulb" style="left:' + x.toFixed(2) + '%;top:' + y.toFixed(2) + '%;animation-delay:-' + (Math.random() * 4).toFixed(2) + 's"></i>';
      }
    }
    bulbs.innerHTML = html;
  }

  /* ---------- hero video: play only when visible, respect data saver ---------- */
  var video = $('.gable--hero video');
  if (video) {
    var saveData = navigator.connection && navigator.connection.saveData;
    if (reduce || saveData) { video.removeAttribute('autoplay'); video.pause(); }
    else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
          else video.pause();
        });
      }, { threshold: 0.1 }).observe(video);
    }
  }

  /* ---------- moods ---------- */
  var moods = {
    couple: {
      img: 'evening', alt: 'Вечерний костёр у дома под гирляндами',
      title: 'Свидание с лесом', lead: 'Без экранов и расписаний. Только вы двое, огонь и сосны вокруг.',
      list: [['15:00', 'Заезд, кофе из капсульной кофемашины на террасе'], ['17:00', 'Прогулка через лес к берегу Ангары'], ['19:00', 'Сауна — без ограничения по времени'], ['21:00', 'Камин, плед и кино на проекторе'], ['утро', 'Завтрак у панорамного окна и гамак до выезда']]
    },
    family: {
      img: 'dark-dining', alt: 'Обеденный стол у панорамного окна',
      title: 'Выходные всей семьёй', lead: 'Дети до 4 лет — бесплатно. Отдельная спальня, своя кухня и лес вместо детской площадки.',
      list: [['15:00', 'Заезд: малыши в гамак, взрослые — разбирать сумки'], ['16:00', 'Обед за большим столом на своей кухне'], ['18:00', 'Прогулка по тропинкам и к реке'], ['20:00', 'Костёр, сосиски на мангале, настольные игры'], ['утро', 'Тишина, пение птиц и неспешный завтрак']]
    },
    friends: {
      img: 'light-summer', alt: 'Светлый дом с шезлонгами вокруг кострища',
      title: 'Компанией до шести', lead: 'Два этажа, две спальни и диван. А если вас больше — бронируйте оба дома.',
      list: [['15:00', 'Заезд и первый тост на террасе'], ['17:00', 'Мангал: дрова, решётка и шампуры уже на месте'], ['20:00', 'Сауна на четверых, пока остальные у костра'], ['23:00', 'Разговоры до ночи под гирляндами'], ['утро', 'Кофе на всех из кофемашины']]
    },
    party: {
      img: 'dark-winter', alt: 'Тёмный дом зимой с венком и гирляндами',
      title: 'Праздник в лесу', lead: 'День рождения, годовщина, Новый год — здесь любой повод становится историей.',
      list: [['15:00', 'Заезд, украшаем дом и террасу'], ['18:00', 'Праздничный ужин: посуда, бокалы и штопор есть'], ['20:00', 'Шашлык на мангале и тосты у костра'], ['22:00', 'Сауна и снег / летняя ночь — по сезону'], ['утро', 'Никаких соседей за стенкой и уборки после гостей']]
    },
    reset: {
      img: 'sauna', alt: 'Сауна с видом на лес',
      title: 'Перезагрузка', lead: 'Когда город выжал до капли. Сутки тишины, которые лечат лучше отпуска.',
      list: [['15:00', 'Заезд, телефон — в режим «не беспокоить»'], ['16:00', 'Гамак между соснами и свежий воздух'], ['18:00', 'Долгая сауна без таймера'], ['21:00', 'Треск поленьев в печи-камине'], ['утро', 'Проснуться без будильника — от пения птиц']]
    },
    self: {
      img: 'living', alt: 'Гостиная с книгой о хюгге и свечами',
      title: 'Наедине с собой', lead: 'Книга, плед, лес за окном. Иногда лучший собеседник — вы сами.',
      list: [['15:00', 'Заезд и чай у окна со вторым светом'], ['16:00', 'Одиночная прогулка к Ангаре'], ['19:00', 'Ужин на террасе в тишине'], ['21:00', 'Камин и книга «Хюгге» с журнального столика'], ['утро', 'Медленное утро — выезд только в 12:00']]
    }
  };
  var stage = $('#moodStage');
  var chips = $$('.moods__tabs .chip');
  function setMood(key) {
    var m = moods[key]; if (!m) return;
    chips.forEach(function (c) { var on = c.getAttribute('data-mood') === key; c.classList.toggle('is-active', on); c.setAttribute('aria-selected', on ? 'true' : 'false'); });
    stage.classList.add('is-switching');
    setTimeout(function () {
      $('#moodSrc').srcset = 'img/' + m.img + '-600.webp';
      var img = $('#moodImg'); img.src = 'img/' + m.img + '-600.jpg'; img.alt = m.alt;
      $('#moodTitle').textContent = m.title;
      $('#moodLead').textContent = m.lead;
      $('#moodList').innerHTML = m.list.map(function (r) { return '<li><time>' + r[0] + '</time><span>' + r[1] + '</span></li>'; }).join('');
      stage.classList.remove('is-switching');
    }, reduce ? 0 : 320);
  }
  chips.forEach(function (c) { c.addEventListener('click', function () { setMood(c.getAttribute('data-mood')); }); });
  // preload mood images when the block approaches
  if ('IntersectionObserver' in window && stage) {
    var pre = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { Object.keys(moods).forEach(function (k) { var i = new Image(); i.src = 'img/' + moods[k].img + '-600.jpg'; }); pre.disconnect(); }
    }, { rootMargin: '400px' });
    pre.observe(stage);
  }

  /* ---------- house galleries ---------- */
  $$('[data-gallery]').forEach(function (g) {
    var pic = $('.house__main', g);
    var source = $('source', pic), img = $('img', pic);
    $$('.thumb', g).forEach(function (t) {
      t.addEventListener('click', function () {
        if (t.classList.contains('is-active')) return;
        $$('.thumb', g).forEach(function (x) { x.classList.remove('is-active'); });
        t.classList.add('is-active');
        var n = t.getAttribute('data-img');
        pic.classList.add('is-fading');
        var next = new Image();
        next.onload = next.onerror = function () {
          source.srcset = 'img/' + n + '-600.webp 600w, img/' + n + '-1200.webp 1200w';
          img.src = 'img/' + n + '-1200.jpg';
          img.alt = t.getAttribute('data-alt');
          setTimeout(function () { pic.classList.remove('is-fading'); }, 30);
        };
        next.src = 'img/' + n + '-1200.jpg';
      });
    });
    img.addEventListener('click', function () { openLb(img.currentSrc || img.src, img.alt); });
  });

  /* ---------- lightbox ---------- */
  var lb = $('#lightbox');
  function openLb(src, alt) { var i = $('img', lb); i.src = src; i.alt = alt || ''; lb.hidden = false; doc.body.style.overflow = 'hidden'; $('.lightbox__close', lb).focus(); }
  function closeLb() { if (!lb || lb.hidden) return; lb.hidden = true; doc.body.style.overflow = ''; }
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lightbox__close')) closeLb(); });

  /* ---------- seasons switch + snow ---------- */
  var seasons = $('#seasons');
  var canvas = $('#snow');
  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  var flakes = [], snowing = false, raf = null, visible = false;

  function sizeCanvas() {
    if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = seasons.offsetWidth * dpr; canvas.height = seasons.offsetHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.round(seasons.offsetWidth / 9);
    flakes = [];
    for (var i = 0; i < count; i++) flakes.push({ x: Math.random() * seasons.offsetWidth, y: Math.random() * seasons.offsetHeight, r: Math.random() * 2.2 + .6, s: Math.random() * .6 + .3, d: Math.random() * Math.PI * 2 });
  }
  function draw() {
    var w = seasons.offsetWidth, h = seasons.offsetHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    ctx.beginPath();
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.y += f.s; f.d += .01; f.x += Math.sin(f.d) * .35;
      if (f.y > h + 5) { f.y = -5; f.x = Math.random() * w; }
      ctx.moveTo(f.x, f.y); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    }
    ctx.fill();
    raf = window.requestAnimationFrame(draw);
  }
  function updateSnow() {
    var should = ctx && !reduce && snowing && visible;
    if (should && !raf) { if (!flakes.length) sizeCanvas(); draw(); }
    if (!should && raf) { window.cancelAnimationFrame(raf); raf = null; }
  }
  function setSeason(s) {
    seasons.setAttribute('data-season', s);
    $$('.switch__opt', seasons).forEach(function (b) { var on = b.getAttribute('data-set') === s; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); });
    snowing = s === 'winter';
    updateSnow();
  }
  if (seasons) {
    $$('.switch__opt', seasons).forEach(function (b) { b.addEventListener('click', function () { setSeason(b.getAttribute('data-set')); }); });
    // auto-pick by current month in Irkutsk: Nov–Mar → winter
    var mth = new Date().getMonth();
    if (mth >= 10 || mth <= 2) setSeason('winter');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; updateSnow(); }).observe(seasons);
    } else { visible = true; updateSnow(); }
    var rT; window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(function () { if (ctx) sizeCanvas(); }, 200); });
  }

  /* ---------- reviews slider (drag / swipe / arrows / dots) ---------- */
  var slider = $('#revSlider'), track = $('#revTrack');
  if (slider && track) {
    var cards = $$('.review', track), idx = 0, dotsWrap = $('#revDots');
    var prev = $('#revPrev'), next = $('#revNext');
    function step() { var c = cards[0]; var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 18; return c.getBoundingClientRect().width + gap; }
    function maxIdx() {
      var pad = parseFloat(getComputedStyle(slider).paddingLeft) || 0;
      var visibleW = slider.clientWidth - pad * 2;
      var total = track.scrollWidth;
      var m = Math.ceil((total - visibleW) / step());
      return Math.max(0, Math.min(cards.length - 1, m));
    }
    function renderDots() {
      var m = maxIdx(), h = '';
      for (var i = 0; i <= m; i++) h += '<i' + (i === idx ? ' class="is-on"' : '') + '></i>';
      dotsWrap.innerHTML = h;
    }
    function go(i) {
      var m = maxIdx();
      idx = Math.max(0, Math.min(m, i));
      var pad = parseFloat(getComputedStyle(slider).paddingLeft) || 0;
      var limit = Math.max(0, track.scrollWidth - (slider.clientWidth - pad * 2));
      var x = Math.min(idx * step(), limit);
      track.style.transform = 'translate3d(' + (-x) + 'px,0,0)';
      prev.disabled = idx === 0; next.disabled = idx === m;
      renderDots();
    }
    prev.addEventListener('click', function () { go(idx - 1); });
    next.addEventListener('click', function () { go(idx + 1); });
    slider.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') go(idx - 1); if (e.key === 'ArrowRight') go(idx + 1); });

    var startX = 0, startY = 0, dx = 0, dragging = false, decided = false, horiz = false, baseX = 0;
    function curX() { var m = /translate3d\((-?[\d.]+)px/.exec(track.style.transform || ''); return m ? parseFloat(m[1]) : 0; }
    function down(x, y) { startX = x; startY = y; dx = 0; dragging = true; decided = false; horiz = false; baseX = curX(); }
    function move(x, y, e) {
      if (!dragging) return;
      dx = x - startX; var dy = y - startY;
      if (!decided && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) { decided = true; horiz = Math.abs(dx) > Math.abs(dy); if (horiz) slider.classList.add('is-drag'); }
      if (horiz) { if (e && e.cancelable) e.preventDefault(); track.style.transform = 'translate3d(' + (baseX + dx) + 'px,0,0)'; }
    }
    function up() {
      if (!dragging) return; dragging = false; slider.classList.remove('is-drag');
      if (horiz && Math.abs(dx) > 50) go(idx + (dx < 0 ? Math.max(1, Math.round(-dx / step())) : -Math.max(1, Math.round(dx / step()))));
      else go(idx);
    }
    if (window.PointerEvent) {
      slider.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse' && e.button !== 0) return; down(e.clientX, e.clientY); });
      window.addEventListener('pointermove', function (e) { move(e.clientX, e.clientY, e); }, { passive: false });
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    } else {
      slider.addEventListener('touchstart', function (e) { down(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
      slider.addEventListener('touchmove', function (e) { move(e.touches[0].clientX, e.touches[0].clientY, e); }, { passive: false });
      slider.addEventListener('touchend', up);
      slider.addEventListener('mousedown', function (e) { down(e.clientX, e.clientY); });
      window.addEventListener('mousemove', function (e) { move(e.clientX, e.clientY, e); });
      window.addEventListener('mouseup', up);
    }
    // touch-action: pan-y lets vertical scroll pass; horizontal handled above
    slider.addEventListener('dragstart', function (e) { e.preventDefault(); });
    slider.setAttribute('tabindex', '0');
    var rs; window.addEventListener('resize', function () { clearTimeout(rs); rs = setTimeout(function () { go(idx); }, 150); });
    go(0);
  }

  /* ---------- map: load iframe when near viewport ---------- */
  var mapFrame = $('#map iframe');
  if (mapFrame) {
    var loadMap = function () { if (!mapFrame.src) mapFrame.src = mapFrame.getAttribute('data-src'); };
    if ('IntersectionObserver' in window) {
      var mo = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { loadMap(); mo.disconnect(); } }, { rootMargin: '600px' });
      mo.observe(mapFrame);
    } else loadMap();
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = $$('.sec-head, .manifest__text, .manifest__foot, .moods__stage, .house, .season-card, .seasons__copy, .tile, .details__text, .details__collage, .clock, .tags, .faq, .contacts__card, .map');
  if ('IntersectionObserver' in window && !reduce) {
    revealEls.forEach(function (el) { el.classList.add('reveal'); });
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); ro.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealEls.forEach(function (el) { ro.observe(el); });
  }

  var yEl = $('#year'); if (yEl) yEl.textContent = new Date().getFullYear();
})();
