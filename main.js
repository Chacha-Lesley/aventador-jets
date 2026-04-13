/* ============================================================
   ROYAL LUXURY JET — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll state ──────────────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const handleScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── Mobile hamburger ─────────────────────────────────────── */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      hamburger.querySelectorAll('span')[0].style.transform = open ? 'translateY(6px) rotate(45deg)' : '';
      hamburger.querySelectorAll('span')[1].style.opacity  = open ? '0' : '';
      hamburger.querySelectorAll('span')[2].style.transform = open ? 'translateY(-6px) rotate(-45deg)' : '';
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.querySelectorAll('span')[0].style.transform = '';
        hamburger.querySelectorAll('span')[1].style.opacity  = '';
        hamburger.querySelectorAll('span')[2].style.transform = '';
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Active nav link ──────────────────────────────────────── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile .nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href === currentPath) link.classList.add('active');
  });

  /* ── Intersection observer for fade-up animations ────────── */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => observer.observe(el));
  }

  /* ── Quote / Contact form handling ───────────────────────── */
  const form = document.getElementById('quoteForm');
  const successEl = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form__submit');
      const originalText = btn.innerHTML;
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Sending…`;
      btn.disabled = true;
      setTimeout(() => {
        form.style.display = 'none';
        if (successEl) {
          successEl.style.display = 'flex';
          successEl.classList.add('visible');
        }
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 1200);
    });
  }

  /* ── Animated counter for stat numbers ───────────────────── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const isDecimal = String(target).includes('.');
    const duration = 1600;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const statEls = document.querySelectorAll('.stats__num[data-target]');
  if (statEls.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => statObserver.observe(el));
  }

  /* ── Fleet category filter (fleet page) ───────────────────── */
  const filterBtns = document.querySelectorAll('[data-filter]');
  const fleetCards = document.querySelectorAll('[data-category]');
  if (filterBtns.length && fleetCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        fleetCards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.style.opacity = match ? '1' : '0';
          card.style.pointerEvents = match ? '' : 'none';
          card.style.transform = match ? '' : 'scale(0.96)';
          card.style.position = match ? '' : 'absolute';
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

});