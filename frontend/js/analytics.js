const user = typeof getUser === 'function' ? getUser() : null;
const navAuth = document.getElementById('nav-auth');

if (user) {
  const href = (user.role === 'agent' || user.role === 'admin') ? 'agent-dashboard.html' : 'user_dashboard.html';
  navAuth.innerHTML = `
    <span class="text-sm text-white/70 font-medium">${escapeHtml(user.username)}</span>
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

const transports = {
  'Centre — Capitole':     'Métro A+B / Tram',
  'Est — Bonnefoy':        'Métro B',
  'Ouest — Saint-Cyprien': 'Métro A / Tram',
  'Nord-Est — Compans':    'Métro A',
  'Nord — Les Minimes':    'Bus / Tram',
  'Sud — Rangueil':        'Métro B',
};

const defaultOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 11 }, color: SLATE } },
    y: { grid: { color: '#F4F5F7' }, ticks: { font: { family: 'DM Sans', size: 11 }, color: SLATE } },
  },
};

function renderKPIs(meta) {
  document.getElementById('kpi-transactions').textContent = meta.transactions.toLocaleString('fr-FR');
  document.getElementById('kpi-prix-appart').textContent = `${meta.prix_m2_median_appart.toLocaleString('fr-FR')} €`;
  document.getElementById('kpi-prix-maison').textContent = `${meta.prix_m2_median_maison.toLocaleString('fr-FR')} €`;
  document.getElementById('kpi-prix-median').textContent = `${Math.round(meta.prix_median_global / 1000)} k€`;
  document.getElementById('hero-desc').textContent =
    `Analyse de ${meta.transactions.toLocaleString('fr-FR')} transactions réelles sur Toulouse en 2024. Comparez les quartiers, les prix au m² et trouvez le bien qui correspond à votre budget.`;
}

function renderCharts(data) {
  const labels = data.secteurs.labels.map(q => q.split(' — ')[1]);
  const prixM2 = data.secteurs.prix_m2;
  const volumes = data.secteurs.volumes;

  const maxPrix = Math.max(...prixM2);
  const maxVolume = Math.max(...volumes);

  new Chart(document.getElementById('chartPrixQuartier'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: prixM2,
        backgroundColor: prixM2.map(v => v === maxPrix ? CLAY : NAVY),
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
      labels,
      datasets: [{
        data: volumes,
        backgroundColor: volumes.map(v => v === maxVolume ? CLAY : NAVY),
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
      labels: data.repartition.labels,
      datasets: [{
        data: data.repartition.values,
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

  const evoValues = data.evolution.prix_m2_median;
  const evoMin = Math.floor(Math.min(...evoValues) / 100) * 100 - 100;

  new Chart(document.getElementById('chartEvolution'), {
    type: 'line',
    data: {
      labels: data.evolution.mois,
      datasets: [{
        data: evoValues,
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
          min: evoMin,
          ticks: { ...defaultOptions.scales.y.ticks, callback: v => v.toLocaleString('fr-FR') + ' €' }
        }
      }
    }
  });

  const piecesLabels = [...data.pieces.labels];
  const piecesValues = [...data.pieces.values];
  if (piecesLabels[0] === 'T0') {
    piecesValues[1] += piecesValues[0];
    piecesLabels.shift();
    piecesValues.shift();
  }
  piecesLabels[piecesLabels.length - 1] += '+';
  const maxPieces = Math.max(...piecesValues);

  new Chart(document.getElementById('chartPieces'), {
    type: 'bar',
    data: {
      labels: piecesLabels,
      datasets: [{
        data: piecesValues,
        backgroundColor: piecesValues.map(v => v === maxPieces ? CLAY : NAVY),
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
}

function renderTable(secteurs) {
  const tbody = document.getElementById('tableau-quartiers');
  const maxPrix = Math.max(...secteurs.prix_m2);

  secteurs.labels.forEach((q, i) => {
    const prix = secteurs.prix_m2[i];
    const volume = secteurs.volumes[i];
    const isTop = prix === maxPrix;
    const row = document.createElement('tr');
    row.className = 'border-b border-[#F4F5F7] hover:bg-slate-50 transition-colors';
    row.innerHTML = `
      <td class="py-3 pr-4">
        <span class="font-medium text-navy text-sm">${q.split(' — ')[1]}</span>
        ${isTop ? '<span class="ml-1.5 text-xs bg-[#D45A1A]/10 text-[#D45A1A] font-semibold px-1.5 py-0.5 rounded">Premium</span>' : ''}
      </td>
      <td class="py-3 pr-4 text-right font-semibold text-navy text-sm">${prix.toLocaleString('fr-FR')} €</td>
      <td class="py-3 pr-4 text-right text-[#8FA3B8] text-sm">${volume.toLocaleString('fr-FR')}</td>
      <td class="py-3 text-right text-[#8FA3B8] text-xs">${transports[q]}</td>
    `;
    tbody.appendChild(row);
  });
}

async function loadMarketData() {
  const res = await fetch('../data/market_analysis.json');
  const data = await res.json();
  renderKPIs(data.meta);
  renderCharts(data);
  renderTable(data.secteurs);
}

loadMarketData();