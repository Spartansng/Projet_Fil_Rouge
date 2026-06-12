redirectIfNotLoggedIn();

const API_BASE_URL = 'http://localhost:3000';
const user = getUser();

function $(id) { return document.getElementById(id); }

function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  $(`section-${name}`).classList.remove('hidden');
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('bg-white/10',   l.dataset.section === name);
    l.classList.toggle('text-white',    l.dataset.section === name);
    l.classList.toggle('text-white/60', l.dataset.section !== name);
  });
  $('page-title').textContent = {
    appointments: 'Mes rendez-vous',
    vente:        'Demande de mise en vente',
    profile:      'Mon profil',
  }[name] || '';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR');
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function appointmentBadge(s) {
  return s === 'confirmed' ? 'bg-green-50 text-green-700'
    : s === 'pending'    ? 'bg-yellow-50 text-yellow-700'
    : 'bg-slate-100 text-muted';
}

function appointmentLabel(s) {
  return s === 'confirmed' ? 'Confirmé'
    : s === 'pending'    ? 'En attente'
    : 'Annulé';
}

async function loadAppointments() {
  try {
    const res  = await fetch(`${API_BASE_URL}/appointments`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    const json = await res.json();
    const all  = Array.isArray(json) ? json : [];
    const mine = all.filter(a => a.user_id === user.user_id);
    renderAppointments(mine);
    $('stat-appointments').textContent = mine.length;
  } catch {
    renderAppointments([]);
  }
}

function renderAppointments(appointments) {
  if (appointments.length === 0) {
    $('appointments-list').innerHTML = `
      <div class="text-center py-16 text-muted text-sm">Aucun rendez-vous pour le moment.</div>`;
    return;
  }

  $('appointments-list').innerHTML = appointments.map(a => `
    <div class="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-xl bg-[#0F1C2E] flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <div>
          <p class="font-semibold text-[#0F1C2E] text-sm">Bien #${a.property_id}</p>
          <p class="text-[#8FA3B8] text-xs mt-0.5">${formatDate(a.appointment_date)} à ${formatTime(a.appointment_date)}</p>
          ${a.message ? `<p class="text-[#8FA3B8] text-xs mt-1 italic">"${escapeHtml(a.message)}"</p>` : ''}
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs font-semibold px-2.5 py-1 rounded-lg ${appointmentBadge(a.status)}">
          ${appointmentLabel(a.status)}
        </span>
          <a href="property_detail.html?id=${a.property_id}"
          class="text-xs font-semibold text-[#0F1C2E] bg-[#F4F5F7] hover:bg-[#DDE2E9] px-3 py-1.5 rounded-lg transition-colors">
          Voir le bien
        </a>
      </div>
    </div>
  `).join('');
}

async function handleVenteSubmit(e) {
  e.preventDefault();
  const btn = $('btn-vente');

  const body = {
    title:       $('vente-title').value.trim(),
    description: $('vente-description').value.trim(),
    price:       Number($('vente-price').value),
    surface:     $('vente-surface').value ? Number($('vente-surface').value) : null,
    city:        $('vente-city').value.trim(),
    address:     $('vente-address').value.trim(),
    district:    $('vente-district').value.trim(),
    postal_code: $('vente-postal-code').value.trim(),
    type_id:     Number($('vente-type').value),
    agency_id:   Number($('vente-agency').value),
    status_id:   1,
  };

  btn.textContent = '…';
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE_URL}/properties`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (!res.ok) {
      $('vente-error-msg').textContent = json.message || 'Une erreur est survenue.';
      $('vente-error').classList.remove('hidden');
      $('vente-success').classList.add('hidden');
      return;
    }

    $('vente-success').classList.remove('hidden');
    $('vente-error').classList.add('hidden');
    e.target.reset();

  } catch {
    $('vente-error-msg').textContent = 'Impossible de contacter le serveur.';
    $('vente-error').classList.remove('hidden');
  } finally {
    btn.textContent = 'Envoyer la demande';
    btn.disabled = false;
  }
}

async function loadFormData() {
  try {
    const [typesRes, agenciesRes] = await Promise.all([
      fetch(`${API_BASE_URL}/references/property-types`),
      fetch(`${API_BASE_URL}/agencies`),
    ]);
    const [types, agencies] = await Promise.all([typesRes.json(), agenciesRes.json()]);

    const selType   = $('vente-type');
    const selAgency = $('vente-agency');

    selType.innerHTML   = '<option value="">Sélectionner</option>';
    selAgency.innerHTML = '<option value="">Sélectionner</option>';

    (Array.isArray(types)    ? types    : types.data    || []).forEach(t => {
      selType.innerHTML   += `<option value="${t.type_id}">${escapeHtml(t.name)}</option>`;
    });
    (Array.isArray(agencies) ? agencies : agencies.data || []).forEach(a => {
      selAgency.innerHTML += `<option value="${a.agency_id}">${escapeHtml(a.name)}</option>`;
    });
  } catch {}
}

function renderProfile() {
  $('profile-username').textContent = user.username || '—';
  $('profile-email').textContent    = user.email    || '—';
  $('profile-role').textContent     = user.role === 'vendeur' ? 'Vendeur' : 'Acheteur';
  $('profile-avatar').textContent   = (user.username || 'U')[0].toUpperCase();
}

function initNav() {
  $('user-name').textContent = user.username || 'Utilisateur';
  $('user-role').textContent = user.role     || '';

  if (user.role === 'vendeur') {
    $('nav-vente').classList.remove('hidden');
    $('stat-vente-block').classList.remove('hidden');
  }
}

function logout() {
  clearAuth();
  window.location.href = 'login.html';
}

window.logout = logout;

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => showSection(link.dataset.section));
});

$('menu-btn').addEventListener('click', () => {
  $('sidebar').classList.toggle('-translate-x-full');
  $('sidebar-overlay').classList.toggle('hidden');
});

$('sidebar-overlay').addEventListener('click', () => {
  $('sidebar').classList.add('-translate-x-full');
  $('sidebar-overlay').classList.add('hidden');
});

if ($('vente-form')) {
  $('vente-form').addEventListener('submit', handleVenteSubmit);
}

(async () => {
  initNav();
  renderProfile();
  await loadAppointments();
  if (user.role === 'vendeur') await loadFormData();
  showSection('appointments');
})();