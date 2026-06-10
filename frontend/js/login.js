redirectIfLoggedIn();

const form     = document.getElementById('login-form');
const btnText  = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');
const errorBox = document.getElementById('error-box');
const errorMsg = document.getElementById('error-msg');

function setLoading(state) {
  btnText.classList.toggle('hidden', state);
  btnSpinner.classList.toggle('hidden', !state);
  form.querySelectorAll('input, button').forEach(el => el.disabled = state);
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorBox.classList.remove('hidden');
}

function hideError() {
  errorBox.classList.add('hidden');
}

function validate(email, password) {
  if (!email || !password) return 'Tous les champs sont obligatoires.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Adresse email invalide.';
  if (password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.';
  return null;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const err = validate(email, password);
  if (err) { showError(err); return; }

  setLoading(true);

  try {
    const res  = await fetch(`${API_BASE}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    });

    const json = await res.json();

    if (!res.ok) {
      showError(json.message || 'Identifiants incorrects.');
      return;
    }

    saveAuth(json.token, json.user);
    window.location.href = '../index.html';

  } catch {
    showError('Impossible de contacter le serveur. Réessayez plus tard.');
  } finally {
    setLoading(false);
  }
});

document.getElementById('toggle-password').addEventListener('click', () => {
  const input = document.getElementById('password');
  const icon  = document.getElementById('eye-icon');
  if (input.type === 'password') {
    input.type = 'text';
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7
         a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878
         l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59
         m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7
         a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>`;
  } else {
    input.type = 'password';
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7
         -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>`;
  }
});