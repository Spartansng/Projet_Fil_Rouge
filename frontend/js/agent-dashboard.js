redirectIfNotLoggedIn();

const API_BASE_URL = 'http://localhost:3000';

let properties = [];
let editingId  = null;

const MOCK_REQUESTS = [
  { id: 1, name: 'Marie Laurent',  email: 'marie@exemple.fr', property: 'T3 Capitole',       date: '2025-06-10', status: 'nouveau' },
  { id: 2, name: 'Thomas Renaud',  email: 'thomas@exemple.fr', property: 'Villa Colomiers',   date: '2025-06-09', status: 'en_cours' },
  { id: 3, name: 'Sarah Cohen',    email: 'sarah@exemple.fr',  property: 'Studio Rangueil',   date: '2025-06-08', status: 'traité' },
];

function $(id) { return document.getElementById(id); }

function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  $(`section-${name}`).classList.remove('hidden');
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('bg-white/10', l.dataset.section === name);
    l.classList.toggle('text-white',  l.dataset.section === name);
    l.classList.toggle('text-white/60', l.dataset.section !== name);
  });
  $('page-title').textContent = {
    properties:   'Mes biens',
    requests:     'Demandes clients',
    appointments: 'Rendez-vous',
  }[name] || '';
}

async function loadProperties() {
  try {
    const res  = await fetch(`${API_BASE_URL}/properties`);
    const json = await res.json();
    properties = Array.isArray(json) ? json : [];
  } catch {
    properties = [];
  }
  renderProperties();
  renderStats();
}

function renderStats() {
  $('stat-total').textContent = properties.length;
  $('stat-requests').textContent = MOCK_REQUESTS.filter(r => r.status === 'nouveau').length;
}

function renderProperties() {
  const tbody = $('properties-tbody');
  if (properties.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-12 text-center text-muted text-sm">
          Aucun bien enregistré. Ajoutez votre premier bien.
        </td>
      </tr>`;
    return;
  }
  tbody.innerHTML = properties.map(p => `
    <tr class="border-t border-slate-100 hover:bg-slate-50 transition-colors">
      <td class="px-6 py-4">
        <div class="font-semibold text-navy text-sm">${escapeHtml(p.title)}</div>
        <div class="text-muted text-xs mt-0.5">${escapeHtml(p.city)}${p.district ? ' — ' + escapeHtml(p.district) : ''}</div>
      </td>
      <td class="px-6 py-4 text-sm text-navy font-medium">${Number(p.price).toLocaleString('fr-FR')} €</td>
      <td class="px-6 py-4 text-sm text-muted">${p.surface ? p.surface + ' m²' : '—'}</td>
      <td class="px-6 py-4">
        <span class="text-xs font-semibold px-2.5 py-1 rounded-lg ${statusBadge(p.status_id)}">
          ${escapeHtml(p.status_name || 'Statut #' + p.status_id)}
        </span>
      </td>
      <td class="px-6 py-4 text-xs text-muted">${formatDate(p.created_at)}</td>
      <td class="px-6 py-4">
        <div class="flex items-center gap-2">
          <button onclick="openEditModal(${p.property_id})"
            class="text-xs font-semibold text-navy bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
            Modifier
          </button>
          <button onclick="confirmDelete(${p.property_id})"
            class="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
            Supprimer
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function statusBadge(statusId) {
  const map = {
    1: 'bg-green-50 text-green-700',
    2: 'bg-yellow-50 text-yellow-700',
    3: 'bg-blue-50 text-blue-700',
    4: 'bg-slate-100 text-muted',
  };
  return map[statusId] || 'bg-slate-100 text-muted';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR');
}

function renderRequests() {
  $('requests-list').innerHTML = MOCK_REQUESTS.map(r => `
    <div class="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-full bg-clay/10 flex items-center justify-center text-clay font-bold text-sm flex-shrink-0">
          ${r.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p class="font-semibold text-navy text-sm">${r.name}</p>
          <p class="text-muted text-xs">${r.email}</p>
          <p class="text-navy/60 text-xs mt-1">Bien : <span class="font-medium">${r.property}</span></p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs text-muted">${formatDate(r.date)}</span>
        <span class="text-xs font-semibold px-2.5 py-1 rounded-lg ${requestBadge(r.status)}">${requestLabel(r.status)}</span>
      </div>
    </div>
  `).join('');
}

function requestBadge(s) {
  return s === 'nouveau' ? 'bg-clay/10 text-clay' : s === 'en_cours' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-muted';
}
function requestLabel(s) {
  return s === 'nouveau' ? 'Nouveau' : s === 'en_cours' ? 'En cours' : 'Traité';
}

async function loadAppointments() {
  try {
    const res  = await fetch(`${API_BASE_URL}/appointments`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    const json = await res.json();
    const appointments = Array.isArray(json) ? json : [];
    renderAppointments(appointments);
    $('stat-appointments').textContent = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;
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
        <div class="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <div>
          <p class="font-semibold text-navy text-sm">Utilisateur #${a.user_id}</p>
          <p class="text-navy/60 text-xs mt-0.5">Bien #${a.property_id}</p>
          ${a.message ? `<p class="text-muted text-xs mt-1 italic">"${escapeHtml(a.message)}"</p>` : ''}
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="text-right">
          <p class="text-sm font-semibold text-navy">${formatDate(a.appointment_date)}</p>
          <p class="text-xs text-muted">${new Date(a.appointment_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <span class="text-xs font-semibold px-2.5 py-1 rounded-lg ${appointmentBadge(a.status)}">
          ${appointmentLabel(a.status)}
        </span>
      </div>
    </div>
  `).join('');
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

async function loadFormData() {
  try {
    const [typesRes, statusRes, agenciesRes] = await Promise.all([
      fetch(`${API_BASE_URL}/references/property-types`),
      fetch(`${API_BASE_URL}/references/property-status`),
      fetch(`${API_BASE_URL}/agencies`),
    ]);
    const [types, statuses, agencies] = await Promise.all([
      typesRes.json(), statusRes.json(), agenciesRes.json(),
    ]);

    const selType   = $('form-type');
    const selStatus = $('form-status');
    const selAgency = $('form-agency');

    selType.innerHTML   = '<option value="">Sélectionner</option>';
    selStatus.innerHTML = '<option value="">Sélectionner</option>';
    selAgency.innerHTML = '<option value="">Sélectionner</option>';

    (types.data    || []).forEach(t => selType.innerHTML   += `<option value="${t.type_id}">${escapeHtml(t.name)}</option>`);
    (statuses.data || []).forEach(s => selStatus.innerHTML += `<option value="${s.status_id}">${escapeHtml(s.name)}</option>`);
    (agencies.data || []).forEach(a => selAgency.innerHTML += `<option value="${a.agency_id}">${escapeHtml(a.name)}</option>`);
  } catch {}
}

function openAddModal() {
  editingId = null;
  $('modal-title').textContent = 'Ajouter un bien';
  $('property-form').reset();
  $('modal').classList.remove('hidden');
}

function openEditModal(id) {
  const p = properties.find(x => x.property_id === id);
  if (!p) return;
  editingId = id;
  $('modal-title').textContent = 'Modifier le bien';
  $('form-title').value       = p.title       || '';
  $('form-description').value = p.description || '';
  $('form-price').value       = p.price       || '';
  $('form-surface').value     = p.surface     || '';
  $('form-city').value        = p.city        || '';
  $('form-postal-code').value = p.postal_code || '';
  $('form-address').value     = p.address     || '';
  $('form-district').value    = p.district    || '';
  $('form-type').value        = p.type_id     || '';
  $('form-status').value      = p.status_id   || '';
  $('form-agency').value      = p.agency_id   || '';
  $('modal').classList.remove('hidden');
}

function closeModal() {
  $('modal').classList.add('hidden');
  editingId = null;
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const body = {
    title:       $('form-title').value.trim(),
    description: $('form-description').value.trim(),
    price:       Number($('form-price').value),
    surface:     $('form-surface').value ? Number($('form-surface').value) : null,
    city:        $('form-city').value.trim(),
    postal_code: $('form-postal-code').value.trim(),
    address:     $('form-address').value.trim(),
    district:    $('form-district').value.trim(),
    type_id:     Number($('form-type').value),
    status_id:   Number($('form-status').value),
    agency_id:   Number($('form-agency').value),
  };

  const token  = getToken();
  const url    = editingId ? `${API_BASE_URL}/properties/${editingId}` : `${API_BASE_URL}/properties`;
  const method = editingId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const json = await res.json();
      alert(json.message || 'Une erreur est survenue.');
      return;
    }

    closeModal();
    loadProperties();
  } catch {
    alert('Impossible de contacter le serveur.');
  }
}

async function confirmDelete(id) {
  const p = properties.find(x => x.property_id === id);
  if (!confirm(`Supprimer "${p?.title}" ? Cette action est irréversible.`)) return;

  try {
    const res = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });

    if (!res.ok) {
      const json = await res.json();
      alert(json.message || 'Erreur lors de la suppression.');
      return;
    }
    loadProperties();
  } catch {
    alert('Impossible de contacter le serveur.');
  }
}

function logout() {
  clearAuth();
  window.location.href = 'login.html';
}

window.openEditModal   = openEditModal;
window.confirmDelete   = confirmDelete;
window.openAddModal    = openAddModal;
window.closeModal      = closeModal;
window.logout          = logout;

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => showSection(link.dataset.section));
});

$('menu-btn').addEventListener('click', () => {
  $('sidebar').classList.toggle('-translate-x-full');
});

$('sidebar-overlay').addEventListener('click', () => {
  $('sidebar').classList.add('-translate-x-full');
});

$('property-form').addEventListener('submit', handleFormSubmit);

const user = getUser();
if (user) {
  $('user-name').textContent  = user.username || 'Agent';
  $('user-role').textContent  = user.role     || 'agent';
}

(async () => {
  await loadFormData();
  await loadProperties();
  renderRequests();
  await loadAppointments();
  showSection('properties');
})();