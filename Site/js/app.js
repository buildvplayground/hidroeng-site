/* Hidroeng — app.js */
(function () {
  'use strict';

  var WA_NUMBER = '5562999345568'; /* WhatsApp comercial confirmado pelo cliente */
  var WA_MSG = {
    'hero': 'Olá! Vim pelo site da Hidroeng e gostaria de falar com um engenheiro sobre um projeto.',
    'menu': 'Olá! Vim pelo site da Hidroeng e gostaria de solicitar um orçamento.',
    'servicos': 'Olá! Gostaria de um orçamento para projetos de saneamento (água/esgoto/estudos técnicos).',
    'cta-final': 'Olá! Quero discutir meu próximo projeto de saneamento com a Hidroeng.',
    'float': 'Olá! Vim pelo site da Hidroeng e gostaria de mais informações.'
  };

  var docEl = document.documentElement;
  docEl.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp CTAs ---------- */
  document.querySelectorAll('[data-wa-btn]').forEach(function (btn) {
    var key = btn.getAttribute('data-wa-btn');
    var msg = WA_MSG[key] || WA_MSG['menu'];
    btn.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg));
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener');
  });

  /* ---------- Loader ---------- */
  var loader = document.getElementById('loader');
  function hideLoader() { if (loader) loader.classList.add('done'); }
  if (reduceMotion) { hideLoader(); }
  else {
    window.addEventListener('load', function () { setTimeout(hideLoader, 350); });
    setTimeout(hideLoader, 2500); /* nunca prender o usuário */
  }

  /* ---------- Header: sólido + esconde ao descer ---------- */
  var header = document.getElementById('header');
  var lastY = window.scrollY;
  function onScrollHeader() {
    var y = window.scrollY;
    header.classList.toggle('solid', y > 40);
    if (y > 280 && y > lastY + 4 && !nav.classList.contains('open')) header.classList.add('hidden');
    else if (y < lastY - 4 || y <= 280) header.classList.remove('hidden');
    lastY = y;
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  function closeNav() {
    nav.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) closeNav();
  });

  /* ---------- Scrollspy ---------- */
  var spyLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.nav-cta)'));
  var spyObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        spyLinks.forEach(function (l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id], section#inicio').forEach(function (s) { spyObs.observe(s); });

  /* ---------- Reveals (3 camadas de gatilho) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  function staggerize() {
    var groups = new Map();
    revealEls.forEach(function (el) {
      var p = el.parentElement;
      if (!groups.has(p)) groups.set(p, []);
      groups.get(p).push(el);
    });
    groups.forEach(function (els) {
      els.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i, 6) * 80 + 'ms';
      });
    });
  }
  function revealNow(el) { el.classList.add('on'); }
  if (reduceMotion) {
    revealEls.forEach(revealNow);
  } else {
    staggerize();
    /* 1) primeira tela por timer (não depende de observer); re-checa se a aba
       carregou oculta/sem viewport (visibilitychange/resize) */
    var firstScreen = function () {
      if (!window.innerHeight) return;
      revealEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) revealNow(el);
      });
    };
    setTimeout(firstScreen, 140);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') setTimeout(firstScreen, 60);
    });
    window.addEventListener('resize', firstScreen, { once: true });
    /* 2) scroll normal */
    var rvObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { revealNow(en.target); rvObs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    revealEls.forEach(function (el) { rvObs.observe(el); });
    /* 3) saltos (âncora/hash/arraste): revela sem animação o que já passou */
    window.addEventListener('scroll', function () {
      revealEls.forEach(function (el) {
        if (!el.classList.contains('on') && el.getBoundingClientRect().bottom < window.innerHeight * 0.3) {
          el.style.transition = 'none';
          revealNow(el);
        }
      });
    }, { passive: true });
  }

  /* ---------- Contadores ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function runCounter(el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    var t0 = null, dur = 1600;
    function frame(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (en.isIntersecting) {
          (function (el, d) { setTimeout(function () { runCounter(el); }, d); })(en.target, i * 120);
          cObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cObs.observe(c); });
  }

  /* ---------- Parallax leve (≤0.12) ---------- */
  var pxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (!reduceMotion && pxEls.length) {
    var ticking = false;
    function parallax() {
      pxEls.forEach(function (el) {
        var f = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var off = (r.top + r.height / 2 - window.innerHeight / 2) * f;
        var img = el.tagName === 'IMG' ? el : el.querySelector('img');
        if (img) img.style.transform = 'translateY(' + off.toFixed(1) + 'px)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
    parallax();
  }

  /* ---------- FAQ ---------- */
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.parentElement;
      var ans = item.querySelector('.faq-a');
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', String(open));
      ans.style.maxHeight = open ? ans.scrollHeight + 'px' : 0;
    });
  });

  /* ---------- "Como funciona" (3 passos animado) ---------- */
  var howto = document.getElementById('howto');
  if (howto) {
    if (reduceMotion) { howto.classList.add('animate'); }
    else {
      var hObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { howto.classList.add('animate'); hObs.disconnect(); }
        });
      }, { threshold: 0.35 });
      hObs.observe(howto);
    }
  }

  /* ---------- Lightbox (galeria por projeto) ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbTitle = document.getElementById('lbTitle');
  var lbCount = document.getElementById('lbCount');
  var gallery = [], gIndex = 0, gTitle = '';
  function lbShow() {
    lbImg.src = gallery[gIndex];
    lbImg.alt = gTitle + ' — imagem ' + (gIndex + 1) + ' de ' + gallery.length;
    lbTitle.textContent = gTitle;
    lbCount.textContent = (gIndex + 1) + ' / ' + gallery.length;
  }
  function lbOpen(card) {
    gallery = (card.getAttribute('data-gallery') || '').split('|').filter(Boolean);
    gTitle = card.getAttribute('data-title') || '';
    if (!gallery.length) return;
    gIndex = 0;
    lb.classList.add('open');
    lb.classList.toggle('single', gallery.length === 1);
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbShow();
    document.getElementById('lbClose').focus();
  }
  function lbCloseFn() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function lbNav(d) {
    gIndex = (gIndex + d + gallery.length) % gallery.length;
    lbShow();
  }
  document.querySelectorAll('.pcard[data-gallery]').forEach(function (card) {
    card.addEventListener('click', function () { lbOpen(card); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lbOpen(card); }
    });
  });
  document.getElementById('lbClose').addEventListener('click', lbCloseFn);
  document.getElementById('lbPrev').addEventListener('click', function () { lbNav(-1); });
  document.getElementById('lbNext').addEventListener('click', function () { lbNav(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lbCloseFn(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') lbCloseFn();
    if (e.key === 'ArrowLeft') lbNav(-1);
    if (e.key === 'ArrowRight') lbNav(1);
    if (e.key === 'Tab') { /* focus trap simples dentro do diálogo */
      var focusables = lb.querySelectorAll('button');
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Smooth scroll (lerp de wheel, arquitetura B) ---------- */
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!reduceMotion && finePointer) {
    var target = window.scrollY, current = window.scrollY, raf = null, fromLerp = false;
    var maxScroll = function () { return docEl.scrollHeight - window.innerHeight; };
    function loop() {
      current += (target - current) * 0.1;
      if (Math.abs(target - current) < 0.5) { current = target; raf = null; }
      fromLerp = true;
      window.scrollTo({ top: current, behavior: 'instant' });
      fromLerp = false;
      if (raf !== null) raf = requestAnimationFrame(loop);
    }
    function scrollableUnder(el) {
      var n = el, i = 0;
      while (n && n !== document.body && i < 8) {
        var s = getComputedStyle(n);
        if (/(auto|scroll)/.test(s.overflowY) && n.scrollHeight > n.clientHeight) return true;
        n = n.parentElement; i++;
      }
      return false;
    }
    window.addEventListener('wheel', function (e) {
      if (document.body.style.overflow === 'hidden') return; /* modal/menu aberto: nativo */
      if (e.ctrlKey) return;                                  /* zoom do navegador */
      if (scrollableUnder(e.target)) return;
      e.preventDefault();
      target = Math.max(0, Math.min(maxScroll(), target + e.deltaY));
      if (raf === null) raf = requestAnimationFrame(loop);
    }, { passive: false });
    /* ressincroniza quando o scroll vem de fora do lerp (âncora, teclado, barra) */
    window.addEventListener('scroll', function () {
      if (!fromLerp && raf === null) { target = current = window.scrollY; }
    }, { passive: true });
  }

  /* ---------- Política de Privacidade + Cookie Notice (BuildV) ---------- */
  function openModal(id) {
    var el = document.getElementById(id);
    if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
  }
  function closeModal(id) {
    var el = document.getElementById(id);
    if (el) {
      el.classList.remove('open');
      if (!document.querySelectorAll('.privacy-overlay.open').length) document.body.style.overflow = '';
    }
  }
  document.querySelectorAll('[data-modal]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); openModal(el.getAttribute('data-modal')); });
  });
  var privCl = document.getElementById('privacyClose');
  var privOv = document.getElementById('privacyOverlay');
  if (privCl) privCl.addEventListener('click', function () { closeModal('privacyOverlay'); });
  if (privOv) privOv.addEventListener('click', function (e) { if (e.target === privOv) closeModal('privacyOverlay'); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && privOv && privOv.classList.contains('open')) closeModal('privacyOverlay');
  });

  var COOKIE_KEY = 'hidroeng_cookie_ok';
  var notice = document.getElementById('cookieNotice');
  window.dataLayer = window.dataLayer || [];
  function consentEvent(granted) {
    /* as tags (GTM/GA4) devem escutar este evento para respeitar a LGPD */
    window.dataLayer.push({ event: 'cookie_consent', analytics_consent: granted ? 'granted' : 'denied' });
  }
  var saved = localStorage.getItem(COOKIE_KEY);
  if (saved) { consentEvent(saved === 'accept'); }
  else if (notice) { setTimeout(function () { notice.classList.add('show'); }, 1200); }
  function dismissCookie(choice) {
    if (notice) notice.classList.remove('show');
    localStorage.setItem(COOKIE_KEY, choice);
    consentEvent(choice === 'accept');
  }
  var bAcc = document.getElementById('cookieAccept'), bDec = document.getElementById('cookieDecline');
  if (bAcc) bAcc.addEventListener('click', function () { dismissCookie('accept'); });
  if (bDec) bDec.addEventListener('click', function () { dismissCookie('decline'); });

  /* ---------- Ano do rodapé ---------- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
