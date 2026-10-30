// =============================================
// Dashboard Page
// =============================================
function renderDashboard(container) {
  const stats = getStatistik();
  const role = currentUser.role;

  if (role === 'warga') renderDashboardWarga(container, stats);
  else if (role === 'admin') renderDashboardAdmin(container, stats);
  else if (role === 'opd') renderDashboardOPD(container, stats);
  else if (role === 'pimpinan') renderDashboardPimpinan(container, stats);
}

// ---- WARGA DASHBOARD ----
function renderDashboardWarga(container, stats) {
  const myLaporan = LAPORAN_DB.filter(l => l.userId === currentUser.id);
  const mySelesai = myLaporan.filter(l => l.status === 'selesai').length;
  const myProses = myLaporan.filter(l => l.status === 'diteruskan' || l.status === 'diproses').length;
  const myMenunggu = myLaporan.filter(l => l.status === 'menunggu').length;

  const recentLaporan = myLaporan.slice(-3).reverse();

  container.innerHTML = `
    <div class="page-header animate-in">
      <h1>Selamat Datang, ${currentUser.nama.split(' ')[0]}! 👋</h1>
      <p>Pantau laporan Anda dan lihat perkembangan penanganannya.</p>
    </div>

    <div class="grid-4 animate-in animate-in-delay-1" style="margin-bottom:24px">
      ${statCard('📋','Total Laporan',myLaporan.length,'Laporan Anda','#6366F1','rgba(99,102,241,0.15)')}
      ${statCard('✅','Selesai',mySelesai,'Berhasil ditangani','#10B981','rgba(16,185,129,0.15)')}
      ${statCard('⚙️','Diproses',myProses,'Sedang ditindaklanjuti','#3B82F6','rgba(59,130,246,0.15)')}
      ${statCard('⏳','Menunggu',myMenunggu,'Verifikasi admin','#F59E0B','rgba(245,158,11,0.15)')}
    </div>

    <div class="grid-2 animate-in animate-in-delay-2" style="margin-bottom:24px">
      <div class="card">
        <div class="card-header">
          <div><div class="card-title">📋 Laporan Terbaru Saya</div></div>
          <button class="btn btn-outline btn-sm" onclick="navigateTo('laporan-saya')">Lihat Semua →</button>
        </div>
        ${recentLaporan.length ? recentLaporan.map(l => laporanMiniCard(l)).join('') : emptyState('📋','Belum Ada Laporan','Buat laporan pertama Anda!')}
      </div>
      <div class="card">
        <div class="card-header">
          <div><div class="card-title">🚀 Aksi Cepat</div></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button class="quick-action-btn" onclick="navigateTo('buat-laporan')">
            <div style="font-size:28px">📝</div>
            <div><div style="font-weight:700;margin-bottom:2px">Buat Laporan Baru</div><div style="font-size:12px;color:var(--text-2)">Laporkan masalah di sekitar Anda</div></div>
          </button>
          <button class="quick-action-btn" onclick="navigateTo('peta')">
            <div style="font-size:28px">🗺️</div>
            <div><div style="font-weight:700;margin-bottom:2px">Lihat Peta Sebaran</div><div style="font-size:12px;color:var(--text-2)">Pantau laporan di wilayah Anda</div></div>
          </button>
          <button class="quick-action-btn" onclick="navigateTo('survei')">
            <div style="font-size:28px">⭐</div>
            <div><div style="font-weight:700;margin-bottom:2px">Isi Survei Kepuasan</div><div style="font-size:12px;color:var(--text-2)">Beri penilaian layanan</div></div>
          </button>
        </div>
      </div>
    </div>

    <div class="card animate-in animate-in-delay-3">
      <div class="card-header">
        <div><div class="card-title">📊 Statistik Kota Bogor</div></div>
      </div>
      <div class="grid-4">
        ${miniStatItem('📊',stats.total,'Total Laporan','#6366F1')}
        ${miniStatItem('✅',stats.selesai,'Selesai','#10B981')}
        ${miniStatItem('⚙️',stats.diproses,'Diproses','#3B82F6')}
        ${miniStatItem('⏳',stats.menunggu,'Menunggu','#F59E0B')}
      </div>
    </div>
  `;

  addQuickActionStyle();
}

// ---- ADMIN DASHBOARD ----
function renderDashboardAdmin(container, stats) {
  const menunggu = LAPORAN_DB.filter(l => l.status === 'menunggu');
  container.innerHTML = `
    <div class="page-header animate-in">
      <h1>Dashboard Admin Diskominfo</h1>
      <p>Pantau dan kelola seluruh laporan warga kota.</p>
    </div>

    <div class="grid-4 animate-in animate-in-delay-1" style="margin-bottom:24px">
      ${statCard('📋','Total Laporan',stats.total,'Semua kategori','#6366F1','rgba(99,102,241,0.15)')}
      ${statCard('⏳','Perlu Verifikasi',stats.menunggu,'Menunggu tindakan','#F59E0B','rgba(245,158,11,0.15)')}
      ${statCard('⚙️','Diproses',stats.diproses,'Aktif ditangani','#3B82F6','rgba(59,130,246,0.15)')}
      ${statCard('✅','Selesai',stats.selesai,'Berhasil diselesaikan','#10B981','rgba(16,185,129,0.15)')}
    </div>

    <div class="grid-2 animate-in animate-in-delay-2" style="margin-bottom:24px">
      <div class="card">
        <div class="card-header">
          <div><div class="card-title">⏳ Laporan Menunggu Verifikasi</div><div class="card-subtitle">${menunggu.length} laporan perlu ditindaklanjuti</div></div>
          <button class="btn btn-primary-solid btn-sm" onclick="navigateTo('verifikasi')">Lihat Semua</button>
        </div>
        ${menunggu.slice(0,3).map(l => laporanMiniCard(l, true)).join('') || emptyState('✅','Tidak Ada Laporan','Semua sudah diverifikasi')}
      </div>
      <div class="card">
        <div class="card-header">
          <div><div class="card-title">📊 Laporan per Kategori</div></div>
        </div>
        <div class="chart-bar-wrap">
          ${stats.byKategori.filter(k=>k.count>0).map(k=>`
            <div class="chart-bar-item">
              <div class="chart-bar-label">${k.icon} ${k.nama}</div>
              <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${(k.count/stats.total*100)||0}%;background:${k.color}"></div></div>
              <div class="chart-bar-val">${k.count}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="card animate-in animate-in-delay-3">
      <div class="card-header">
        <div><div class="card-title">📈 Ringkasan Status Laporan</div></div>
      </div>
      <div class="donut-wrap">
        ${renderDonut(stats.byStatus, stats.total)}
        <div class="donut-legend">
          ${stats.byStatus.map(s=>`
            <div class="donut-legend-item">
              <div class="donut-legend-color" style="background:${s.color}"></div>
              <span>${s.label}: <strong>${s.value}</strong></span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ---- OPD DASHBOARD ----
function renderDashboardOPD(container, stats) {
  const opdId = getOPDIdForUser();
  const opdName = currentUser.opd || 'OPD';
  const laporanOpd = LAPORAN_DB.filter(l => l.opdId === opdId);
  const pending = laporanOpd.filter(l => l.status === 'diteruskan').length;
  const selesai = laporanOpd.filter(l => l.status === 'selesai').length;

  container.innerHTML = `
    <div class="page-header animate-in">
      <h1>Dashboard ${opdName}</h1>
      <p>Kelola laporan yang didisposisi ke unit Anda.</p>
    </div>
    <div class="grid-4 animate-in animate-in-delay-1" style="margin-bottom:24px">
      ${statCard('📋','Total Disposisi',laporanOpd.length,'Laporan masuk','#6366F1','rgba(99,102,241,0.15)')}
      ${statCard('⚠️','Perlu Tindak Lanjut',pending,'Segera ditangani','#F59E0B','rgba(245,158,11,0.15)')}
      ${statCard('✅','Selesai',selesai,'Berhasil ditangani','#10B981','rgba(16,185,129,0.15)')}
      ${statCard('⭐',stats.avgRating,'Rating Kepuasan','Dari survei warga','#8B5CF6','rgba(139,92,246,0.15)')}
    </div>
    <div class="card animate-in animate-in-delay-2">
      <div class="card-header">
        <div><div class="card-title">📋 Laporan Terbaru Disposisi</div></div>
        <button class="btn btn-primary-solid btn-sm" onclick="navigateTo('laporan-opd')">Lihat Semua</button>
      </div>
      ${laporanOpd.slice(0,4).map(l => laporanMiniCard(l)).join('') || emptyState('📋','Belum Ada Laporan','Belum ada disposisi ke unit ini')}
    </div>
  `;
}

// ---- PIMPINAN DASHBOARD ----
function renderDashboardPimpinan(container, stats) {
  container.innerHTML = `
    <div class="page-header animate-in">
      <h1>Dashboard Pimpinan</h1>
      <p>Ringkasan kinerja penanganan laporan warga kota.</p>
    </div>
    <div class="grid-4 animate-in animate-in-delay-1" style="margin-bottom:24px">
      ${statCard('📋','Total Laporan',stats.total,'Semua laporan','#6366F1','rgba(99,102,241,0.15)')}
      ${statCard('✅','Selesai',stats.selesai,`${Math.round(stats.selesai/stats.total*100)}% tingkat penyelesaian`,'#10B981','rgba(16,185,129,0.15)')}
      ${statCard('👍',stats.totalDukungan,'Total Dukungan','Dari warga','#F59E0B','rgba(245,158,11,0.15)')}
      ${statCard('⭐',stats.avgRating,'Rating Kepuasan','Rata-rata survei','#8B5CF6','rgba(139,92,246,0.15)')}
    </div>
    <div class="grid-2 animate-in animate-in-delay-2" style="margin-bottom:24px">
      <div class="card">
        <div class="card-header"><div class="card-title">📊 Distribusi Status</div></div>
        <div class="donut-wrap">
          ${renderDonut(stats.byStatus, stats.total)}
          <div class="donut-legend">
            ${stats.byStatus.map(s=>`
              <div class="donut-legend-item">
                <div class="donut-legend-color" style="background:${s.color}"></div>
                <span>${s.label}: <strong>${s.value}</strong></span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">🏆 Kategori Terbanyak</div></div>
        <div class="chart-bar-wrap">
          ${stats.byKategori.filter(k=>k.count>0).map(k=>`
            <div class="chart-bar-item">
              <div class="chart-bar-label">${k.icon} ${k.nama}</div>
              <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${(k.count/stats.total*100)||0}%;background:${k.color}"></div></div>
              <div class="chart-bar-val">${k.count}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="card animate-in animate-in-delay-3">
      <div class="card-header"><div class="card-title">📈 Progress Penyelesaian</div></div>
      <div style="margin-bottom:10px;display:flex;justify-content:space-between;font-size:14px">
        <span>Tingkat Penyelesaian</span>
        <strong>${Math.round(stats.selesai/stats.total*100)}%</strong>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${Math.round(stats.selesai/stats.total*100)}%"></div></div>
      <div style="margin-top:16px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;text-align:center">
        ${stats.byStatus.map(s=>`
          <div style="background:var(--bg-3);padding:14px;border-radius:10px">
            <div style="font-size:22px;font-weight:800;color:${s.color}">${s.value}</div>
            <div style="font-size:11px;color:var(--text-2);margin-top:3px">${s.label}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ---- HELPERS ----
function statCard(icon, label, value, sub, color, bg) {
  return `<div class="stat-card animate-in">
    <div class="stat-icon" style="background:${bg};color:${color}">${icon}</div>
    <div class="stat-body">
      <div class="stat-value" style="color:${color}">${value}</div>
      <div class="stat-label">${label}</div>
      <div class="stat-change up" style="color:var(--text-3)">${sub}</div>
    </div>
  </div>`;
}

function miniStatItem(icon, val, label, color) {
  return `<div style="text-align:center;padding:14px;background:var(--bg-3);border-radius:10px">
    <div style="font-size:24px;margin-bottom:4px">${icon}</div>
    <div style="font-size:22px;font-weight:800;color:${color}">${val}</div>
    <div style="font-size:11px;color:var(--text-2);margin-top:2px">${label}</div>
  </div>`;
}

function laporanMiniCard(l, withVerif=false) {
  const kat = getKategori(l.kategoriId);
  return `<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--card-border);cursor:pointer" onclick="showLaporanDetail(${l.id})">
    <div style="width:40px;height:40px;border-radius:10px;background:var(--bg-3);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">${kat.icon||'📄'}</div>
    <div style="flex:1;min-width:0">
      <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${l.judul}</div>
      <div style="font-size:11px;color:var(--text-3);margin-top:2px">${l.tiket} · ${timeAgo(l.tanggal)}</div>
    </div>
    <span class="badge ${getStatusClass(l.status)}" style="font-size:10px">${getStatusLabel(l.status)}</span>
  </div>`;
}

function emptyState(icon, title, desc) {
  return `<div class="empty-state" style="padding:30px"><div class="empty-state-icon">${icon}</div><h3>${title}</h3><p>${desc}</p></div>`;
}

function renderDonut(data, total) {
  const r = 60, cx = 70, cy = 70;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const slices = data.map(d => {
    const pct = total ? d.value / total : 0;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const slice = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${d.color}" stroke-width="18"
      stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})" opacity="0.85"/>`;
    offset += dash;
    return slice;
  }).join('');
  return `<svg class="donut-svg" width="140" height="140" viewBox="0 0 140 140">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--bg-3)" stroke-width="18"/>
    ${slices}
    <text x="${cx}" y="${cy+5}" text-anchor="middle" fill="var(--text)" font-size="18" font-weight="800">${total}</text>
    <text x="${cx}" y="${cy+20}" text-anchor="middle" fill="var(--text-3)" font-size="10">Total</text>
  </svg>`;
}

function addQuickActionStyle() {
  if (document.getElementById('qa-style')) return;
  const s = document.createElement('style');
  s.id = 'qa-style';
  s.textContent = `.quick-action-btn{display:flex;align-items:center;gap:14px;padding:14px;border-radius:12px;background:var(--bg-3);border:1.5px solid var(--card-border);width:100%;text-align:left;cursor:pointer;transition:var(--transition)}.quick-action-btn:hover{border-color:var(--primary);background:rgba(99,102,241,0.08)}`;
  document.head.appendChild(s);
}
