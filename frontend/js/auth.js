const API_BASE = 'http://localhost:3000';

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function saveAuth(token, user) {
  localStorage.setItem('ymmo_token', token);
  localStorage.setItem('ymmo_user', JSON.stringify(user));
}

function getToken() {
  return localStorage.getItem('ymmo_token');
}

function getUser() {
  const raw = localStorage.getItem('ymmo_user');
  return raw ? JSON.parse(raw) : null;
}

function clearAuth() {
  localStorage.removeItem('ymmo_token');
  localStorage.removeItem('ymmo_user');
}

function isLoggedIn() {
  return !!getToken();
}

function redirectIfLoggedIn(to = '../index.html') {
  if (isLoggedIn()) window.location.href = to;
}

function redirectIfNotLoggedIn(to = 'login.html') {
  if (!isLoggedIn()) window.location.href = to;
}