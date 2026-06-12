const user = typeof getUser === 'function' ? getUser() : null;
const navAuth = document.getElementById('nav-auth');

if (user) {
  const href = (user.role === 'agent' || user.role === 'admin') ? 'agent-dashboard.html' : 'user-dashboard.html';
  navAuth.innerHTML = `
    <span class="text-sm text-white/70 font-medium">${user.username}</span>
    <a href="${href}" class="text-sm bg-[#D45A1A] hover:bg-[#E8743A] text-white font-semibold px-5 py-2 rounded-lg transition-colors">Mon espace</a>`;
} else {
  navAuth.innerHTML = `
    <a href="login.html" class="text-sm text-white/75 hover:text-white font-medium transition-colors">Connexion</a>
    <a href="register.html" class="text-sm bg-[#D45A1A] hover:bg-[#E8743A] text-white font-semibold px-5 py-2 rounded-lg transition-colors">Créer un compte</a>`;
}

document.getElementById('menu-btn').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});

const NAVY  = '#0F1C2E';
const CLAY  = '#D45A1A';
const SLATE = '#8FA3B8';

const quartiers = ['Centre — Capitole', 'Est — Bonnefoy', 'Ouest — Saint-Cyprien', 'Nord-Est — Compans', 'Nord — Les Minimes', 'Sud — Rangueil'];
const prixM2    = [4711, 3667, 3528, 3411, 2794, 2538];
const volumes   = [1453, 1614, 1202, 1428, 2023, 986];
const mois      = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
const prixMois  = [3180, 3220, 3290, 3150, 3310, 3380, 3450, 3300, 3420, 3380, 3350, 3280];
const transports = {
  'Centre — Capitole':    'Métro A+B / Tram',
  'Est — Bonnefoy':       'Métro B',
  'Ouest — Saint-Cyprien':'Métro A / Tram',
  'Nord-Est — Compans':   'Métro A',
  'Nord — Les Minimes':   'Bus / Tram',
  'Sud — Rangueil':       'Métro B',
};

const defaultOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 11 }, color: SLATE } },
    y: { grid: { color: '#F4F5F7' }, ticks: { font: { family: 'DM Sans', size: 11 }, color: SLATE } },
  },
};

new Chart(document.getElementById('chartPrixQuartier'), {
  type: 'bar',
  data: {
    labels: quartiers.map(q => q.split(' — ')[1]),
    datasets: [{
      data: prixM2,
      backgroundColor: prixM2.map((v, i) => i === 0 ? CLAY : NAVY),
      borderRadius: 6,
    }]
  },
  options: {
    ...defaultOptions,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ` ${ctx.raw.toLocaleString('fr-FR')} €/m²` } }
    },
    scales: {
      ...defaultOptions.scales,
      y: { ...defaultOptions.scales.y, ticks: { ...defaultOptions.scales.y.ticks, callback: v => v.toLocaleString('fr-FR') + ' €' } }
    }
  }
});

new Chart(document.getElementById('chartVolumeQuartier'), {
  type: 'bar',
  data: {
    labels: quartiers.map(q => q.split(' — ')[1]),
    datasets: [{
      data: volumes,
      backgroundColor: volumes.map((v, i) => i === 4 ? CLAY : NAVY),
      borderRadius: 6,
    }]
  },
  options: {
    ...defaultOptions,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ` ${ctx.raw.toLocaleString('fr-FR')} ventes` } }
    }
  }
});

new Chart(document.getElementById('chartRepartition'), {
  type: 'doughnut',
  data: {
    labels: ['Appartements', 'Maisons'],
    datasets: [{
      data: [6706, 2000],
      backgroundColor: [NAVY, CLAY],
      borderWidth: 0,
      hoverOffset: 6,
    }]
  },
  options: {
    responsive: true,
    cutout: '65%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { font: { family: 'DM Sans', size: 12 }, color: NAVY, padding: 16 }
      },
      tooltip: { callbacks: { label: ctx => ` ${ctx.raw.toLocaleString('fr-FR')} transactions` } }
    }
  }
});

new Chart(document.getElementById('chartEvolution'), {
  type: 'line',
  data: {
    labels: mois,
    datasets: [{
      data: prixMois,
      borderColor: CLAY,
      backgroundColor: 'rgba(212,90,26,0.08)',
      borderWidth: 2.5,
      pointBackgroundColor: CLAY,
      pointRadius: 4,
      fill: true,
      tension: 0.4,
    }]
  },
  options: {
    ...defaultOptions,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ` ${ctx.raw.toLocaleString('fr-FR')} €/m²` } }
    },
    scales: {
      ...defaultOptions.scales,
      y: {
        ...defaultOptions.scales.y,
        min: 2800,
        ticks: { ...defaultOptions.scales.y.ticks, callback: v => v.toLocaleString('fr-FR') + ' €' }
      }
    }
  }
});

new Chart(document.getElementById('chartPieces'), {
  type: 'bar',
  data: {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6+'],
    datasets: [{
      data: [420, 2180, 2640, 1820, 980, 380],
      backgroundColor: [NAVY, NAVY, CLAY, NAVY, NAVY, NAVY],
      borderRadius: 6,
    }]
  },
  options: {
    ...defaultOptions,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ` ${ctx.raw.toLocaleString('fr-FR')} ventes` } }
    }
  }
});

const tbody  = document.getElementById('tableau-quartiers');
const maxPrix = Math.max(...prixM2);
quartiers.forEach((q, i) => {
  const isTop = prixM2[i] === maxPrix;
  const row = document.createElement('tr');
  row.className = 'border-b border-[#F4F5F7] hover:bg-slate-50 transition-colors';
  row.innerHTML = `
    <td class="py-3 pr-4">
      <span class="font-medium text-navy text-sm">${q.split(' — ')[1]}</span>
      ${isTop ? '<span class="ml-1.5 text-xs bg-[#D45A1A]/10 text-[#D45A1A] font-semibold px-1.5 py-0.5 rounded">Premium</span>' : ''}
    </td>
    <td class="py-3 pr-4 text-right font-semibold text-navy text-sm">${prixM2[i].toLocaleString('fr-FR')} €</td>
    <td class="py-3 pr-4 text-right text-[#8FA3B8] text-sm">${volumes[i].toLocaleString('fr-FR')}</td>
    <td class="py-3 text-right text-[#8FA3B8] text-xs">${transports[q]}</td>
  `;
  tbody.appendChild(row);
});