redirectIfLoggedIn();

const form       = document.getElementById('register-form');
const btnText    = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');
const errorBox   = document.getElementById('error-box');
const errorMsg   = document.getElementById('error-msg');
const successBox = document.getElementById('success-box');

function setLoading(state) {
  btnText.classList.toggle('hidden', state);
  btnSpinner.classList.toggle('hidden', !state);
  form.querySelectorAll('input, button').forEach(el => el.disabled = state);
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorBox.classList.remove('hidden');
  successBox.classList.add('hidden');
}

function hideError() {
  errorBox.classList.add('hidden');
}

function validate(username, email, password, confirm, role) {
  if (!username || !email || !password || !confirm) return 'Tous les champs sont obligatoires.';
  if (username.trim().length < 3) return "Le nom d'utilisateur doit contenir au moins 3 caractères.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Adresse email invalide.';
  if (password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.';
  if (password !== confirm) return 'Les mots de passe ne correspondent pas.';
  if (!role) return 'Veuillez choisir un profil.';
  return null;
}

function updateStrength(password) {
  const bar   = document.getElementById('strength-bar');
  const label = document.getElementById('strength-label');
  let score = 0;
  if (password.length >= 8)        score++;
  if (/[A-Z]/.test(password))      score++;
  if (/[0-9]/.test(password))      score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { w: 'w-0',    color: 'bg-slate-mid', text: '' },
    { w: 'w-1/4',  color: 'bg-red-400',    text: 'Faible' },
    { w: 'w-2/4',  color: 'bg-orange-400', text: 'Moyen' },
    { w: 'w-3/4',  color: 'bg-yellow-400', text: 'Bon' },
    { w: 'w-full', color: 'bg-green-500',  text: 'Fort' },
  ];
  const level = levels[score] || levels[0];
  bar.className     = `h-1.5 rounded-full transition-all duration-300 ${level.w} ${level.color}`;
  label.textContent = level.text;
}

document.querySelectorAll('.role-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.role-btn').forEach(b => {
      b.classList.remove('border-[#D45A1A]', 'bg-[#D45A1A]/5', 'text-[#D45A1A]');
      b.classList.add('border-slate-mid', 'text-muted');
      b.querySelector('.role-check').classList.add('hidden');
    });
    btn.classList.add('border-[#D45A1A]', 'bg-[#D45A1A]/5', 'text-[#D45A1A]');
    btn.classList.remove('border-slate-mid', 'text-muted');
    btn.querySelector('.role-check').classList.remove('hidden');
    document.getElementById('role-input').value = btn.dataset.role;
  });
});

document.getElementById('password').addEventListener('input', (e) => {
  updateStrength(e.target.value);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();

  const username = document.getElementById('username').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm  = document.getElementById('confirm').value;
  const role     = document.getElementById('role-input').value;

  const err = validate(username, email, password, confirm, role);
  if (err) { showError(err); return; }

  setLoading(true);

  try {
    const res  = await fetch(`${API_BASE}/auth/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username, email, password, role }),
    });

    const json = await res.json();

    if (!res.ok) {
      showError(json.message || "Une erreur est survenue lors de l'inscription.");
      return;
    }

    successBox.classList.remove('hidden');
    form.reset();
    updateStrength('');
    document.querySelectorAll('.role-btn').forEach(b => {
      b.classList.remove('border-[#D45A1A]', 'bg-[#D45A1A]/5', 'text-[#D45A1A]');
      b.classList.add('border-slate-mid', 'text-muted');
      b.querySelector('.role-check').classList.add('hidden');
    });
    document.getElementById('role-input').value = '';

    setTimeout(() => { window.location.href = 'login.html'; }, 2000);

  } catch {
    showError('Impossible de contacter le serveur. Réessayez plus tard.');
  } finally {
    setLoading(false);
  }
});