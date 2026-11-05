(function () {
  'use strict';

  var html = document.documentElement;
  var hdr = document.getElementById('hdr');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var veil = document.getElementById('veil');
  var links = Array.prototype.slice.call(document.querySelectorAll('.lnk'));
  var up = document.getElementById('fxUp');
  var ticking = false;

  if (!hdr || !burger || !nav || !veil) {
    return;
  }

  function openMenu() {
    nav.classList.add('open');
    veil.classList.add('show');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'إغلاق القائمة');
    html.classList.add('lock');
  }

  function closeMenu() {
    nav.classList.remove('open');
    veil.classList.remove('show');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'فتح القائمة');
    html.classList.remove('lock');
  }

  burger.addEventListener('click', function () {
    if (nav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  veil.addEventListener('click', closeMenu);

  links.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1180) {
      closeMenu();
    }
  });

  function setActive(target) {
    links.forEach(function (link) {
      link.classList.toggle('act', link === target);
    });
  }

  function update() {
    ticking = false;

    hdr.classList.toggle('sc', window.scrollY > 30);

    if (up) {
      up.classList.toggle('show', window.scrollY > 600);
    }

    var y = window.scrollY + window.innerHeight * 0.35;
    var current = links[0];
    var last = links[0];

    links.forEach(function (link) {
      var id = link.getAttribute('href');
      var section = id && id.charAt(0) === '#' ? document.querySelector(id) : null;
      if (section) {
        last = link;
        if (section.offsetTop <= y) {
          current = link;
        }
      }
    });

    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom && window.scrollY > 0) {
      current = last;
    }

    setActive(current);
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', update);
  update();
})();

(function () {
  'use strict';

  var items = Array.prototype.slice.call(document.querySelectorAll('.rv'));

  function reveal(el) {
    el.classList.add('in');
  }

  if (!('IntersectionObserver' in window)) {
    items.forEach(reveal);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        reveal(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

  items.forEach(function (el) {
    io.observe(el);
  });
})();

(function () {
  'use strict';

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.sv-tab'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.sv'));

  if (!tabs.length || !cards.length) {
    return;
  }

  function filterBy(key) {
    cards.forEach(function (card) {
      var match = key === 'all' || card.getAttribute('data-c') === key;
      card.classList.toggle('off', !match);
      card.classList.remove('pop');
      if (match) {
        card.classList.add('in');
        void card.offsetWidth;
        card.classList.add('pop');
      }
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('on', on);
        t.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      filterBy(tab.getAttribute('data-f'));
    });
  });
})();

(function () {
  'use strict';

  var html = document.documentElement;
  var items = Array.prototype.slice.call(document.querySelectorAll('.gi'));
  var lb = document.getElementById('lb');
  var im = document.getElementById('lbImg');
  var cn = document.getElementById('lbCnt');
  var closeBtn = document.getElementById('lbClose');
  var prevBtn = document.getElementById('lbPrev');
  var nextBtn = document.getElementById('lbNext');
  var cur = 0;
  var sx = 0;

  if (!items.length || !lb || !im) {
    return;
  }

  function hasImg(i) {
    return !!items[i].querySelector('img');
  }

  function show(i, dir) {
    var n = items.length;
    var idx = (i + n) % n;
    var guard = 0;

    while (!hasImg(idx) && guard < n) {
      idx = (idx + (dir || 1) + n) % n;
      guard += 1;
    }

    if (!hasImg(idx)) {
      return false;
    }

    cur = idx;
    var img = items[cur].querySelector('img');
    im.classList.remove('sw');
    im.src = img.getAttribute('src');
    im.alt = img.getAttribute('alt') || '';
    if (cn) {
      cn.textContent = (cur + 1) + ' / ' + n;
    }
    void im.offsetWidth;
    im.classList.add('sw');
    return true;
  }

  function open(i) {
    if (!hasImg(i)) {
      return;
    }
    if (!show(i, 1)) {
      return;
    }
    lb.classList.add('show');
    lb.setAttribute('aria-hidden', 'false');
    html.classList.add('lock');
  }

  function close() {
    lb.classList.remove('show');
    lb.setAttribute('aria-hidden', 'true');
    html.classList.remove('lock');
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function () {
      open(i);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', close);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      show(cur - 1, -1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      show(cur + 1, 1);
    });
  }

  lb.addEventListener('click', function (e) {
    if (e.target === lb) {
      close();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('show')) {
      return;
    }
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'ArrowLeft') {
      show(cur + 1, 1);
    } else if (e.key === 'ArrowRight') {
      show(cur - 1, -1);
    }
  });

  lb.addEventListener('touchstart', function (e) {
    sx = e.changedTouches[0].clientX;
  }, { passive: true });

  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) {
      if (dx < 0) {
        show(cur + 1, 1);
      } else {
        show(cur - 1, -1);
      }
    }
  }, { passive: true });
})();

(function () {
  'use strict';

  var list = document.getElementById('fqList');

  if (!list) {
    return;
  }

  var items = Array.prototype.slice.call(list.querySelectorAll('.fq-q'));

  items.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) {
        return;
      }
      items.forEach(function (other) {
        if (other !== item && other.open) {
          other.open = false;
        }
      });
    });
  });
})();

(function () {
  'use strict';

  var canHover = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var hero = document.getElementById('home');
  var art = document.getElementById('artW');

  if (!canHover || !hero || !art) {
    return;
  }

  hero.addEventListener('pointermove', function (e) {
    var x = (e.clientX / window.innerWidth - 0.5) * 16;
    var y = (e.clientY / window.innerHeight - 0.5) * 10;
    art.style.transform = 'translate(' + (-x).toFixed(1) + 'px,' + (-y).toFixed(1) + 'px)';
  });

  hero.addEventListener('pointerleave', function () {
    art.style.transform = 'translate(0,0)';
  });
})();

(function () {
  'use strict';

  var yr = document.getElementById('ftYear');
  var form = document.getElementById('ctForm');
  var note = document.getElementById('ctNote');

  if (yr) {
    yr.textContent = new Date().getFullYear();
  }

  if (!form || !note) {
    return;
  }

  var nameEl = document.getElementById('ctName');
  var phoneEl = document.getElementById('ctPhone');
  var cityEl = document.getElementById('ctCity');
  var serviceEl = document.getElementById('ctService');
  var dateEl = document.getElementById('ctDate');
  var msgEl = document.getElementById('ctMsg');

  function mark(el, bad) {
    var box = el.closest('.ct-f');
    if (box) {
      box.classList.toggle('bad', bad);
    }
  }

  function show(text, type) {
    note.textContent = text;
    note.className = 'ct-note ' + type;
  }

  [nameEl, phoneEl].forEach(function (el) {
    el.addEventListener('input', function () {
      mark(el, false);
      note.textContent = '';
      note.className = 'ct-note';
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = nameEl.value.trim();
    var phone = phoneEl.value.trim();
    var digits = phone.replace(/[^0-9٠-٩]/g, '');
    var okName = name.length >= 2;
    var okPhone = digits.length >= 8;

    mark(nameEl, !okName);
    mark(phoneEl, !okPhone);

    if (!okName) {
      show('من فضلك اكتب اسمك.', 'err');
      nameEl.focus();
      return;
    }

    if (!okPhone) {
      show('من فضلك اكتب رقم جوال صحيح.', 'err');
      phoneEl.focus();
      return;
    }

    var lines = [
      'السلام عليكم منى الحربي للحفلات، أرغب في طلب خدمة.',
      '',
      'الاسم: ' + name,
      'رقم الجوال: ' + phone,
      'الخدمة المطلوبة: ' + serviceEl.value
    ];

    var city = cityEl.value.trim();
    if (city) {
      lines.push('المدينة: ' + city);
    }

    var date = dateEl.value.trim();
    if (date) {
      lines.push('تاريخ المناسبة: ' + date);
    }

    var msg = msgEl.value.trim();
    if (msg) {
      lines.push('التفاصيل: ' + msg);
    }

    var url = 'https://wa.me/966545711924?text=' + encodeURIComponent(lines.join('\n'));
    var win = window.open(url, '_blank', 'noopener');

    if (!win) {
      window.location.href = url;
    }

    show('تم تجهيز طلبك، أكمل الإرسال من واتساب. شكراً لتواصلك معنا.', 'ok');
    form.reset();
  });
})();