(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header: solid background once the page has scrolled
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Reveal on scroll, staggered among siblings
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty('--delay', `${Math.min(i * 0.07, 0.42)}s`);
  });

  const finish = (el) => {
    // Hand transitions back to the element's own styles (e.g. card hover)
    el.classList.remove('reveal', 'is-visible');
    el.style.removeProperty('--delay');
  };

  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(finish);
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-visible');
        el.addEventListener('transitionend', (e) => {
          if (e.target === el && e.propertyName === 'opacity') finish(el);
        });
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    reveals.forEach((el) => io.observe(el));
  }

  // Cards: soft light follows the cursor (pointer devices only)
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  // Links not added yet: don't jump to the top of the page
  document.querySelectorAll('[data-pending-link]').forEach((a) => {
    a.addEventListener('click', (e) => e.preventDefault());
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
