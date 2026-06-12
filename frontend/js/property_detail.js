const params = new URLSearchParams(window.location.search);
const propertyId = params.get('id');

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
];

let currentImageIndex = 0;
let images = [];

function formatPrice(price) {
  return Number(price).toLocaleString('fr-FR') + ' €';
}

function showError() {
  document.getElementById('loader').classList.add('hidden');
  document.getElementById('error-state').classList.remove('hidden');
}

function setGalleryImage(index) {
  currentImageIndex = index;
  document.getElementById('gallery-main').src = images[index];
  document.querySelectorAll('.thumb').forEach((t, i) => {
    t.classList.toggle('ring-2', i === index);
    t.classList.toggle('ring-[#D45A1A]', i === index);
    t.classList.toggle('opacity-50', i !== index);
  });
}

function prevImage() {
  setGalleryImage((currentImageIndex - 1 + images.length) % images.length);
}

function nextImage() {
  setGalleryImage((currentImageIndex + 1) % images.length);
}

function renderGallery() {
  const thumbs = document.getElementById('gallery-thumbs');
  thumbs.innerHTML = images.map((src, i) => `
    <button class="thumb w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 transition-all ${i === 0 ? 'ring-2 ring-[#D45A1A]' : 'opacity-50 hover:opacity-80'}"
      onclick="setGalleryImage(${i})">
      <img src="${src}" alt="Photo ${i + 1}" class="w-full h-full object-cover" />
    </button>
  `).join('');
  document.getElementById('gallery-main').src = images[0];
}

function renderProperty(p) {
  images = p.images?.length ? p.images : FALLBACK_IMAGES;

  document.title = `${p.title} — Ymmo`;
  document.getElementById('breadcrumb-title').textContent = p.title;

  renderGallery();

  document.getElementById('prop-price').textContent    = formatPrice(p.price);
  document.getElementById('prop-title').textContent    = p.title;
  document.getElementById('prop-location').textContent =
    [p.address, p.district, p.city, p.postal_code].filter(Boolean).join(', ');

  document.getElementById('prop-surface').textContent  = p.surface ? `${p.surface} m²` : '—';
  document.getElementById('prop-city').textContent     = p.city || '—';
  document.getElementById('prop-type').textContent     = p.type_name  || `Type #${p.type_id}`;
  document.getElementById('prop-status').textContent   = p.status_name || `Statut #${p.status_id}`;
  document.getElementById('prop-district').textContent = p.district || '—';
  document.getElementById('prop-ref').textContent      = `#${p.property_id}`;

  document.getElementById('prop-description').textContent =
    p.description || 'Aucune description disponible pour ce bien.';

  if (p.agency_id) {
    document.getElementById('agency-section').classList.remove('hidden');
    document.getElementById('agency-name').textContent    = p.agency_name    || `Agence #${p.agency_id}`;
    document.getElementById('agency-city').textContent    = p.agency_city    || '';
    document.getElementById('agency-address').textContent = p.agency_address || '';
  }

  document.getElementById('loader').classList.add('hidden');
  document.getElementById('content').classList.remove('hidden');
}

async function fetchProperty() {
  if (!propertyId) { showError(); return; }
  try {
    const res = await fetch(`${API_BASE}/properties/${propertyId}`);
    if (!res.ok) { showError(); return; }
    const json = await res.json();
    renderProperty(json);
  } catch {
    showError();
  }
}

function handleContactSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-contact');
  btn.textContent = 'Message envoyé ✓';
  btn.disabled = true;
  btn.classList.replace('bg-[#D45A1A]', 'bg-green-600');
  e.target.reset();
  setTimeout(() => {
    btn.textContent = 'Envoyer le message';
    btn.disabled = false;
    btn.classList.replace('bg-green-600', 'bg-[#D45A1A]');
  }, 4000);
}

async function handleAppointmentSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-appointment');

  const token = getToken();
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const date    = document.getElementById('appt-date').value;
  const slot    = document.getElementById('appt-slot').value;
  const message = document.getElementById('appt-message') ? document.getElementById('appt-message').value : '';

  const appointment_date = `${date} ${slot}:00`;

  btn.textContent = '…';
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/appointments`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        property_id:      Number(propertyId),
        appointment_date: appointment_date,
        message:          message || null,
      }),
    });

    if (!res.ok) {
      const json = await res.json();
      btn.textContent = json.message || 'Erreur, réessayez.';
      btn.classList.replace('bg-[#0F1C2E]', 'bg-red-600');
      setTimeout(() => {
        btn.textContent = 'Confirmer le rendez-vous';
        btn.disabled = false;
        btn.classList.replace('bg-red-600', 'bg-[#0F1C2E]');
      }, 3000);
      return;
    }

    btn.textContent = 'Rendez-vous confirmé ✓';
    btn.classList.replace('bg-[#0F1C2E]', 'bg-green-600');
    e.target.reset();
    setTimeout(() => {
      btn.textContent = 'Confirmer le rendez-vous';
      btn.disabled = false;
      btn.classList.replace('bg-green-600', 'bg-[#0F1C2E]');
    }, 4000);

  } catch {
    btn.textContent = 'Erreur serveur.';
    setTimeout(() => {
      btn.textContent = 'Confirmer le rendez-vous';
      btn.disabled = false;
    }, 3000);
  }
}

window.setGalleryImage = setGalleryImage;
window.prevImage = prevImage;
window.nextImage = nextImage;

document.getElementById('contact-form').addEventListener('submit', handleContactSubmit);
document.getElementById('appointment-form').addEventListener('submit', handleAppointmentSubmit);
document.getElementById('menu-btn').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});

const user = typeof getUser === 'function' ? getUser() : null;
const navAuth = document.getElementById('nav-auth');
if (user) {
  const href = (user.role === 'agent' || user.role === 'admin') ? 'agent-dashboard.html' : 'user_dashboard.html';
  navAuth.innerHTML = `<span class="text-sm text-white/70 font-medium">${user.username}</span><a href="${href}" class="text-sm bg-[#D45A1A] hover:bg-[#E8743A] text-white font-semibold px-5 py-2 rounded-lg transition-colors">Mon espace</a>`;
} else {
  navAuth.innerHTML = `<a href="login.html" class="text-sm text-white/75 hover:text-white font-medium transition-colors">Connexion</a><a href="register.html" class="text-sm bg-[#D45A1A] hover:bg-[#E8743A] text-white font-semibold px-5 py-2 rounded-lg transition-colors">Créer un compte</a>`;
}

fetchProperty();