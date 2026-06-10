document.addEventListener('DOMContentLoaded', () => {

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 72);
  }, { passive: true });

  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', String(!mobileMenu.classList.contains('hidden')));
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });

  const searchTabs = document.querySelectorAll('.search-tab');
  searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      searchTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const frames = (1600 / 1000) * 60;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = 1 - Math.pow(1 - frame / frames, 3);
      el.textContent = Math.round(progress * target).toLocaleString('fr-FR') + suffix;

      if (frame >= frames) {
        el.textContent = target.toLocaleString('fr-FR') + suffix;
        clearInterval(timer);
      }
    }, 1000 / 60);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => statObserver.observe(el));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const location = document.getElementById('search-location').value.trim();
    const type = document.getElementById('search-type').value;
    const budget = document.getElementById('search-budget').value;

    if (location) params.set('city', location);
    if (type) params.set('type_id', type);
    if (budget) params.set('maxPrice', budget);

    console.log('Recherche :', Object.fromEntries(params));
  });

  document.querySelectorAll('[data-property-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('Naviguer vers le bien :', btn.dataset.propertyId);
    });
  });

});