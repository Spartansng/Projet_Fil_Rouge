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

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

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
    const type     = document.getElementById('search-type').value;
    const budget   = document.getElementById('search-budget').value;
    if (location) params.set('city',     location);
    if (type)     params.set('type_id',  type);
    if (budget)   params.set('maxPrice', budget);
    window.location.href = `pages/properties.html?${params.toString()}`;
  });

  document.querySelectorAll('.quick-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      const city = btn.dataset.city;
      window.location.href = `pages/properties.html?city=${encodeURIComponent(city)}`;
    });
  });

  const user = typeof getUser === 'function' ? getUser() : null;
  const navAuth = document.getElementById('nav-auth');
  if (user) {
    const href = (user.role === 'agent' || user.role === 'admin')
  ? 'pages/agent-dashboard.html'
  : 'pages/user_dashboard.html';
    navAuth.innerHTML = `
      <span class="text-sm text-white/70 font-medium">${escapeHtml(user.username)}</span>
      <a href="${href}" class="text-sm bg-clay hover:bg-clay-light text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
        Mon espace
      </a>
    `;
  } else {
    navAuth.innerHTML = `
      <a href="pages/login.html" class="text-sm text-white/75 hover:text-white font-medium transition-colors">Connexion</a>
      <a href="pages/register.html" class="text-sm bg-clay hover:bg-clay-light text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">Créer un compte</a>
    `;
  }

});