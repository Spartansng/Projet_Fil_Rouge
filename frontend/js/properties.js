const PER_PAGE = 9;

let currentPage = 1;
let allProperties = [];

const elements = {
  grid:        document.getElementById('properties-grid'),
  count:       document.getElementById('results-count'),
  pagination:  document.getElementById('pagination'),
  empty:       document.getElementById('empty-state'),
  loader:      document.getElementById('loader'),
  filterCity:  document.getElementById('filter-city'),
  filterType:  document.getElementById('filter-type'),
  filterMin:   document.getElementById('filter-min-price'),
  filterMax:   document.getElementById('filter-max-price'),
  filterSurf:  document.getElementById('filter-min-surface'),
  filterAgency:document.getElementById('filter-agency'),
  btnReset:    document.getElementById('btn-reset'),
  btnSearch:   document.getElementById('btn-search'),
};

async function fetchTypes() {
  try {
    const res  = await fetch(`${API_BASE}/references/property-types`);
    const json = await res.json();
    const data = Array.isArray(json) ? json : json.data || [];
    data.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.type_id;
      opt.textContent = t.name;
      elements.filterType.appendChild(opt);
    });
  } catch {}
}

async function fetchAgencies() {
  try {
    const res  = await fetch(`${API_BASE}/agencies`);
    const json = await res.json();
    const data = Array.isArray(json) ? json : json.data || [];
    data.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.agency_id;
      opt.textContent = a.name;
      elements.filterAgency.appendChild(opt);
    });
  } catch {}
}

function buildParams() {
  const params = new URLSearchParams();
  const city   = elements.filterCity.value.trim();
  const type   = elements.filterType.value;
  const min    = elements.filterMin.value;
  const max    = elements.filterMax.value;
  const surf   = elements.filterSurf.value;
  const agency = elements.filterAgency.value;

  if (city)   params.set('city',       city);
  if (type)   params.set('type_id',    type);
  if (min)    params.set('minPrice',   min);
  if (max)    params.set('maxPrice',   max);
  if (surf)   params.set('minSurface', surf);
  if (agency) params.set('agency_id',  agency);

  return params;
}

async function fetchProperties() {
  setLoading(true);
  const params = buildParams();

  try {
    const res  = await fetch(`${API_BASE}/properties?${params.toString()}`);
    const json = await res.json();
    allProperties = Array.isArray(json) ? json : [];
    currentPage = 1;
    render();
  } catch {
    allProperties = [];
    render();
  } finally {
    setLoading(false);
  }
}

function formatPrice(price) {
  return Number(price).toLocaleString('fr-FR') + ' €';
}

function cardHTML(p) {
  const image = p.image_url
    || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';

  const desc = p.description
    ? p.description.length > 90 ? p.description.slice(0, 90) + '…' : p.description
    : 'Aucune description disponible.';

  return `
    <article class="property-card bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
      <div class="relative overflow-hidden h-52 flex-shrink-0">
        <img src="${image}" alt="${p.title}" class="card-img w-full h-full object-cover transition-transform duration-500" />
        ${p.status_id ? `<span class="absolute top-3 left-3 bg-white/90 text-navy text-xs font-semibold px-2.5 py-1 rounded-lg">${p.status_name || 'Disponible'}</span>` : ''}
        ${p.type_name ? `<span class="absolute top-3 right-3 bg-[#0F1C2E]/80 text-white text-xs font-semibold px-2.5 py-1 rounded-lg">${p.type_name}</span>` : ''}
      </div>
      <div class="p-5 flex flex-col flex-1">
        <p class="font-serif font-bold text-[#0F1C2E] text-xl mb-1">${formatPrice(p.price)}</p>
        <h3 class="font-semibold text-[#0F1C2E] text-sm mb-1 leading-snug">${p.title}</h3>
        <p class="text-[#8FA3B8] text-xs mb-3 flex items-center gap-1">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          </svg>
          ${p.city}${p.district ? ` — ${p.district}` : ''}
        </p>
        <p class="text-[#8FA3B8] text-xs leading-relaxed mb-4 flex-1">${desc}</p>
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-[#8FA3B8] flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
            </svg>
            ${p.surface ? p.surface + ' m²' : 'N/A'}
          </span>
          <a href="property_detail.html?id=${p.property_id}"
            class="text-xs font-semibold bg-[#0F1C2E] hover:bg-[#1A2D45] text-white px-4 py-2 rounded-xl transition-colors">
            Voir le bien
          </a>
        </div>
      </div>
    </article>
  `;
}

function render() {
  const total = allProperties.length;
  const pages = Math.ceil(total / PER_PAGE);
  const start = (currentPage - 1) * PER_PAGE;
  const slice = allProperties.slice(start, start + PER_PAGE);

  elements.count.textContent = `${total} bien${total > 1 ? 's' : ''} trouvé${total > 1 ? 's' : ''}`;

  if (total === 0) {
    elements.grid.innerHTML = '';
    elements.empty.classList.remove('hidden');
    elements.pagination.innerHTML = '';
    return;
  }

  elements.empty.classList.add('hidden');
  elements.grid.innerHTML = slice.map(cardHTML).join('');
  renderPagination(pages);
}

function renderPagination(pages) {
  if (pages <= 1) { elements.pagination.innerHTML = ''; return; }

  const btnClass = (active) => active
    ? 'w-9 h-9 rounded-lg bg-[#D45A1A] text-white text-sm font-semibold'
    : 'w-9 h-9 rounded-lg bg-white border border-slate-200 text-[#0F1C2E] text-sm font-medium hover:border-[#D45A1A] hover:text-[#D45A1A] transition-colors';

  let html = `
    <button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}
      class="w-9 h-9 rounded-lg bg-white border border-slate-200 text-[#8FA3B8] text-sm flex items-center justify-center hover:border-[#D45A1A] hover:text-[#D45A1A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
    </button>`;

  for (let i = 1; i <= pages; i++) {
    if (pages > 7 && i > 2 && i < pages - 1 && Math.abs(i - currentPage) > 1) {
      if (i === 3 || i === pages - 2) html += `<span class="w-9 h-9 flex items-center justify-center text-[#8FA3B8] text-sm">…</span>`;
      continue;
    }
    html += `<button onclick="goToPage(${i})" class="${btnClass(i === currentPage)}">${i}</button>`;
  }

  html += `
    <button onclick="goToPage(${currentPage + 1})" ${currentPage === pages ? 'disabled' : ''}
      class="w-9 h-9 rounded-lg bg-white border border-slate-200 text-[#8FA3B8] text-sm flex items-center justify-center hover:border-[#D45A1A] hover:text-[#D45A1A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>`;

  elements.pagination.innerHTML = html;
}

function goToPage(page) {
  const pages = Math.ceil(allProperties.length / PER_PAGE);
  if (page < 1 || page > pages) return;
  currentPage = page;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setLoading(state) {
  elements.loader.classList.toggle('hidden', !state);
  elements.grid.classList.toggle('opacity-40', state);
}

function resetFilters() {
  elements.filterCity.value    = '';
  elements.filterType.value    = '';
  elements.filterMin.value     = '';
  elements.filterMax.value     = '';
  elements.filterSurf.value    = '';
  elements.filterAgency.value  = '';
  fetchProperties();
}

function syncFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('city'))       elements.filterCity.value   = params.get('city');
  if (params.get('type_id'))    elements.filterType.value   = params.get('type_id');
  if (params.get('minPrice'))   elements.filterMin.value    = params.get('minPrice');
  if (params.get('maxPrice'))   elements.filterMax.value    = params.get('maxPrice');
  if (params.get('minSurface')) elements.filterSurf.value   = params.get('minSurface');
  if (params.get('agency_id'))  elements.filterAgency.value = params.get('agency_id');
}

elements.btnSearch.addEventListener('click', fetchProperties);
elements.btnReset.addEventListener('click', resetFilters);
elements.filterCity.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') fetchProperties();
});

window.goToPage = goToPage;

const user = typeof getUser === 'function' ? getUser() : null;
const navAuth = document.getElementById('nav-auth');
if (navAuth) {
  if (user) {
    const href = (user.role === 'agent' || user.role === 'admin') ? 'agent-dashboard.html' : 'user_dashboard.html';
    navAuth.innerHTML = `<span class="text-sm text-white/70 font-medium">${user.username}</span><a href="${href}" class="text-sm bg-[#D45A1A] hover:bg-[#E8743A] text-white font-semibold px-5 py-2 rounded-lg transition-colors">Mon espace</a>`;
  } else {
    navAuth.innerHTML = `<a href="login.html" class="text-sm text-white/75 hover:text-white font-medium transition-colors">Connexion</a><a href="register.html" class="text-sm bg-[#D45A1A] hover:bg-[#E8743A] text-white font-semibold px-5 py-2 rounded-lg transition-colors">Créer un compte</a>`;
  }
}

(async () => {
  await Promise.all([fetchTypes(), fetchAgencies()]);
  syncFromURL();
  fetchProperties();
})();