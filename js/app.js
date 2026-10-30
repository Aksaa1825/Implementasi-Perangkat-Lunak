// =============================================
// LaporWarga — Main App Logic
// =============================================

let currentUser = null;
let currentPage = 'dashboard';
let sidebarCollapsed = false;
let mapInstance = null;

// NAV CONFIG per role
const NAV_CONFIG = {
  warga: [
    { id:'dashboard', label:'Dashboard', icon:'🏠' },
    { id:'buat-laporan', label:'Buat Laporan', icon:'📝' },
    { id:'laporan-saya', label:'Laporan Saya', icon:'📋' },
    { id:'peta', label:'Peta Sebaran', icon:'🗺️' },
    { id:'survei', label:'Survei Kepuasan', icon:'⭐' },
    { id:'profil', label:'Profil Saya', icon:'👤' },
  ],
  admin: [
    { id:'dashboard', label:'Dashboard', icon:'🏠' },
    { section:'Manajemen Laporan' },
    { id:'verifikasi', label:'Verifikasi Laporan', icon:'✅', badge:'pending' },
    { id:'semua-laporan', label:'Semua Laporan', icon:'📋' },
    { id:'peta', label:'Peta Sebaran', icon:'🗺️' },
    { section:'Manajemen Sistem' },
    { id:'kelola-kategori', label:'Kategori & OPD', icon:'🏢' },
    { id:'kelola-pengguna', label:'Pengguna', icon:'👥' },
    { id:'statistik', label:'Statistik', icon:'📊' },
    { id:'profil', label:'Profil', icon:'👤' },
  ],
  opd: [
    { id:'dashboard', label:'Dashboard', icon:'🏠' },
    { id:'laporan-opd', label:'Laporan Masuk', icon:'📋', badge:'opd-pending' },
    { id:'tindak-lanjut', label:'Tindak Lanjut', icon:'🔧' },
    { id:'peta', label:'Peta Sebaran', icon:'🗺️' },
    { id:'statistik', label:'Statistik', icon:'📊' },
    { id:'profil', label:'Profil', icon:'👤' },
  ],
  pimpinan: [
    { id:'dashboard', label:'Dashboard', icon:'🏠' },
    { id:'semua-laporan', label:'Semua Laporan', icon:'📋' },
    { id:'statistik', label:'Dashboard Statistik', icon:'📊' },
    { id:'peta', label:'Peta Sebaran', icon:'🗺️' },
    { id:'profil', label:'Profil', icon:'👤' },
  ],
};

// =============================================
// INIT
// =============================================
window.addEventListener('DOMContentLoaded', () => {
  applyTheme(); // sync toggle button with saved theme

  const splash = document.getElementById('splash-screen');

  function hideSplash() {
    splash.style.display = 'none';
    // Check saved session
    const saved = sessionStorage.getItem('lw_user');
    if (saved) {
      try {
        currentUser = JSON.parse(saved);
        initAppShell();
      } catch(e) {
        sessionStorage.removeItem('lw_user');
        showPage('auth');
      }
    } else {
      showPage('auth');
    }
    setupAuthLinks();
  }

  // Listen for CSS animation end, fallback to setTimeout
  splash.addEventListener('animationend', hideSplash, { once: true });
  setTimeout(hideSplash, 2800); // fallback jika animasi tidak terpicu
});

// =============================================
// THEME TOGGLE
// =============================================
function applyTheme() {
  const saved = localStorage.getItem('lw_theme') || 'dark';
  const isLight = saved === 'light';
  document.documentElement.setAttribute('data-theme', isLight ? 'light' : '');
  // Update icon if button exists
  const icon = document.getElementById('theme-toggle-icon');
  if (icon) icon.textContent = isLight ? '☀️' : '🌙';
}

function toggleTheme() {
  const isCurrentlyLight = document.documentElement.getAttribute('data-theme') === 'light';
  const newTheme = isCurrentlyLight ? 'dark' : 'light';

  // Smooth transition effect on whole page
  document.documentElement.style.transition = 'background 0.4s ease, color 0.4s ease';

  // Apply theme
  if (newTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  // Save preference
  localStorage.setItem('lw_theme', newTheme);

  // Update button icon with spin animation
  const icon = document.getElementById('theme-toggle-icon');
  if (icon) {
    icon.style.transform = 'rotate(360deg) scale(0.5)';
    icon.style.opacity = '0';
    setTimeout(() => {
      icon.textContent = newTheme === 'light' ? '☀️' : '🌙';
      icon.style.transform = 'rotate(0deg) scale(1)';
      icon.style.opacity = '1';
    }, 200);
  }

  // Show toast feedback
  const label = newTheme === 'light' ? 'Mode Terang' : 'Mode Gelap';
  const icon2 = newTheme === 'light' ? '☀️' : '🌙';
  showToast('info', `${icon2} ${label} Aktif`, `Tampilan berhasil diganti ke ${label}.`, 2000);
}


function setupAuthLinks() {
  document.getElementById('goto-register').onclick = (e) => {
    e.preventDefault();
    document.getElementById('form-login').classList.add('hidden');
    document.getElementById('form-register').classList.remove('hidden');
  };
  document.getElementById('goto-login').onclick = (e) => {
    e.preventDefault();
    document.getElementById('form-register').classList.add('hidden');
    document.getElementById('form-login').classList.remove('hidden');
  };
}

function showPage(name) {
  document.getElementById('page-auth').classList.add('hidden');
  document.getElementById('app-shell').classList.add('hidden');
  if (name === 'auth') {
    document.getElementById('page-auth').classList.remove('hidden');
  } else {
    document.getElementById('app-shell').classList.remove('hidden');
  }
}

// =============================================
// AUTH
// =============================================
function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;
  const user = USERS.find(u => u.email === email && u.password === pass);
  if (!user) { showToast('error', 'Login Gagal', 'Email atau password salah.'); return; }
  loginUser(user);
}

function handleRegister() {
  const nama = document.getElementById('reg-nama').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-password').value;
  if (!nama || !email || !pass) { showToast('warning', 'Form Tidak Lengkap', 'Mohon isi semua field.'); return; }
  if (pass.length < 8) { showToast('warning', 'Password Terlalu Pendek', 'Minimal 8 karakter.'); return; }
  if (USERS.find(u => u.email === email)) { showToast('error', 'Email Sudah Digunakan', 'Gunakan email lain.'); return; }
  const newUser = {
    id: USERS.length + 1, nama, email, password: pass, role: 'warga',
    nik: document.getElementById('reg-nik').value,
    phone: document.getElementById('reg-phone').value,
    alamat: document.getElementById('reg-alamat').value,
    avatar: nama.charAt(0).toUpperCase()
  };
  USERS.push(newUser);
  showToast('success', 'Registrasi Berhasil', 'Akun berhasil dibuat. Silakan masuk.');
  document.getElementById('form-register').classList.add('hidden');
  document.getElementById('form-login').classList.remove('hidden');
}

function loginAs(role) {
  const user = USERS.find(u => u.role === role);
  if (user) loginUser(user);
}

function loginUser(user) {
  currentUser = user;
  sessionStorage.setItem('lw_user', JSON.stringify(user));
  initAppShell();
  showToast('success', 'Selamat Datang!', `Halo, ${user.nama}!`);
}

function handleLogout() {
  currentUser = null;
  sessionStorage.removeItem('lw_user');
  currentPage = 'dashboard';
  if (mapInstance) { mapInstance.remove(); mapInstance = null; }
  showPage('auth');
  document.getElementById('form-login').classList.remove('hidden');
  document.getElementById('form-register').classList.add('hidden');
}

function togglePassword(id, btn) {
  const input = document.getElementById(id);
  if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
  else { input.type = 'password'; btn.textContent = '👁'; }
}

// =============================================
// APP SHELL INIT
// =============================================
function initAppShell() {
  showPage('app');
  renderSidebar();
  renderTopbar();
  renderNotifList();
  navigateTo('dashboard');
}

function renderSidebar() {
  const nav = NAV_CONFIG[currentUser.role] || [];
  const navEl = document.getElementById('sidebar-nav');
  navEl.innerHTML = nav.map(item => {
    if (item.section) return `<div class="nav-section-label">${item.section}</div>`;
    const pendingCount = item.badge === 'pending' ? LAPORAN_DB.filter(l=>l.status==='menunggu').length
      : item.badge === 'opd-pending' ? LAPORAN_DB.filter(l=>l.status==='diteruskan' && l.opdId === getOPDIdForUser()).length : 0;
    return `<div class="nav-item ${currentPage===item.id?'active':''}" id="nav-${item.id}" onclick="navigateTo('${item.id}')">
      <span class="nav-icon">${item.icon}</span>
      <span class="nav-label">${item.label}</span>
      ${pendingCount > 0 ? `<span class="nav-badge">${pendingCount}</span>` : ''}
    </div>`;
  }).join('');

  document.getElementById('sidebar-avatar').textContent = currentUser.avatar;
  document.getElementById('sidebar-username').textContent = currentUser.nama;
  document.getElementById('sidebar-role-badge').textContent = getRoleLabel(currentUser.role);
}

function getOPDIdForUser() {
  if (currentUser.role !== 'opd') return null;
  const opd = OPDS.find(o => o.nama === currentUser.opd);
  return opd ? opd.id : null;
}

function getRoleLabel(role) {
  const map = { warga:'Warga', admin:'Admin Diskominfo', opd:'Petugas OPD', pimpinan:'Pimpinan' };
  return map[role] || role;
}

function renderTopbar() {
  document.getElementById('topbar-avatar').textContent = currentUser.avatar;
  document.getElementById('topbar-username').textContent = currentUser.nama;
  updateNotifBadge();
}

function updateNotifBadge() {
  const unread = NOTIFIKASI_DB.filter(n => n.userId === currentUser.id && !n.dibaca).length;
  const badge = document.getElementById('notif-badge');
  if (unread > 0) { badge.textContent = unread; badge.style.display = 'flex'; }
  else { badge.style.display = 'none'; }
}

// =============================================
// NAVIGATION
// =============================================
function navigateTo(pageId) {
  currentPage = pageId;
  // Update active nav
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navItem = document.getElementById('nav-' + pageId);
  if (navItem) navItem.classList.add('active');

  // Update breadcrumb
  const nav = NAV_CONFIG[currentUser.role] || [];
  const item = nav.find(n => n.id === pageId);
  document.getElementById('topbar-breadcrumb').textContent = item ? item.label : pageId;

  // Close notif panel
  document.getElementById('notif-panel').classList.add('hidden');

  // Render page
  const container = document.getElementById('pages-container');
  container.innerHTML = '';

  const pages = {
    dashboard: renderDashboard,
    'buat-laporan': renderBuatLaporan,
    'laporan-saya': renderLaporanSaya,
    peta: renderPeta,
    survei: renderSurvei,
    profil: renderProfil,
    verifikasi: renderVerifikasi,
    'semua-laporan': renderSemuaLaporan,
    'kelola-kategori': renderKelolaKategori,
    'kelola-pengguna': renderKelolaPengguna,
    statistik: renderStatistik,
    'laporan-opd': renderLaporanOPD,
    'tindak-lanjut': renderTindakLanjut,
  };

  if (pages[pageId]) pages[pageId](container);
  else container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🚧</div><h3>Halaman dalam pengembangan</h3></div>`;

  // Scroll to top
  container.scrollTop = 0;

  // Re-render sidebar for active state
  renderSidebar();
}

function goToProfile() { navigateTo('profil'); }

// =============================================
// SIDEBAR TOGGLE
// =============================================
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('main-content');
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle('mobile-open');
  } else {
    sidebarCollapsed = !sidebarCollapsed;
    sidebar.classList.toggle('collapsed', sidebarCollapsed);
    main.classList.toggle('sidebar-collapsed', sidebarCollapsed);
  }
}

// =============================================
// NOTIFICATIONS
// =============================================
function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  panel.classList.toggle('hidden');
  renderNotifList();
}

function renderNotifList() {
  const list = document.getElementById('notif-list');
  const userNotifs = NOTIFIKASI_DB.filter(n => n.userId === currentUser.id)
    .sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal));

  if (!userNotifs.length) {
    list.innerHTML = '<div class="empty-state" style="padding:30px"><div class="empty-state-icon">🔔</div><p>Tidak ada notifikasi</p></div>';
    return;
  }

  const icons = { success:'✅', info:'ℹ️', warning:'⚠️', error:'❌' };
  list.innerHTML = userNotifs.map(n => `
    <div class="notif-item ${n.dibaca?'':'unread'}" onclick="openNotif(${n.id})">
      <div class="notif-dot ${n.dibaca?'read':''}"></div>
      <div class="notif-text">
        <div class="notif-title">${icons[n.type]||'🔔'} ${n.judul}</div>
        <div class="notif-desc">${n.pesan}</div>
      </div>
      <div class="notif-time">${timeAgo(n.tanggal)}</div>
    </div>
  `).join('');
  updateNotifBadge();
}

function openNotif(id) {
  const n = NOTIFIKASI_DB.find(x => x.id === id);
  if (n) {
    n.dibaca = true;
    if (n.laporanId) showLaporanDetail(n.laporanId);
    document.getElementById('notif-panel').classList.add('hidden');
    renderNotifList();
  }
}

function markAllRead() {
  NOTIFIKASI_DB.filter(n => n.userId === currentUser.id).forEach(n => n.dibaca = true);
  renderNotifList();
  showToast('success', 'Semua Dibaca', 'Semua notifikasi telah ditandai dibaca.');
}

// =============================================
// MODAL
// =============================================
function openModal(title, bodyHtml, size='') {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('modal-overlay').classList.remove('hidden');
  if (size) document.getElementById('modal').style.maxWidth = size;
  else document.getElementById('modal').style.maxWidth = '600px';
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  document.getElementById('modal-overlay').classList.add('hidden');
}

// =============================================
// TOAST
// =============================================
function showToast(type, title, message, duration=3500) {
  const icons = { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' };
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type]||'🔔'}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastSlide 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// =============================================
// LAPORAN DETAIL MODAL
// =============================================
function showLaporanDetail(id) {
  const lap = LAPORAN_DB.find(l => l.id === id);
  if (!lap) return;
  const kat = getKategori(lap.kategoriId);
  const opd = lap.opdId ? getOPD(lap.opdId) : null;
  const komens = KOMENTAR_DB.filter(k => k.laporanId === id);
  const user = getUser(lap.userId);

  const timelineHtml = lap.timeline.map(t => `
    <div class="timeline-item">
      <div class="timeline-dot" style="background:${t.color}20;color:${t.color}">${t.icon}</div>
      <div class="timeline-body">
        <div class="timeline-title">${getStatusLabel(t.status)}</div>
        <div class="timeline-meta">${formatDateTime(t.tanggal)}</div>
        <div class="timeline-content">${t.keterangan}</div>
      </div>
    </div>
  `).join('');

  const komHtml = komens.map(k => `
    <div style="display:flex;gap:10px;margin-bottom:14px">
      <div class="user-avatar" style="width:32px;height:32px;font-size:13px;flex-shrink:0">${k.nama.charAt(0)}</div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
          <span style="font-weight:700;font-size:13px">${k.nama}</span>
          ${k.official ? '<span class="badge badge-diproses" style="font-size:10px">🛡️ Official</span>' : ''}
          <span style="font-size:11px;color:var(--text-3)">${timeAgo(k.tanggal)}</span>
        </div>
        <p style="font-size:13px;color:var(--text-2);line-height:1.6">${k.teks}</p>
      </div>
    </div>
  `).join('');

  const body = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
      <span class="badge ${getStatusClass(lap.status)}">${getStatusLabel(lap.status)}</span>
      <span class="badge ${getPrioritasClass(lap.prioritas)}">${lap.prioritas.toUpperCase()}</span>
      <span style="font-size:12px;color:var(--text-3);font-family:monospace">${lap.tiket}</span>
    </div>
    <div style="background:var(--bg-3);border-radius:var(--radius-lg);height:160px;display:flex;align-items:center;justify-content:center;font-size:56px;margin-bottom:16px">${lap.foto[0]||'📄'}</div>
    <h2 style="font-size:18px;font-weight:800;margin-bottom:8px">${lap.judul}</h2>
    <p style="color:var(--text-2);font-size:14px;line-height:1.7;margin-bottom:16px">${lap.deskripsi}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
      <div class="card card-sm"><div style="font-size:11px;color:var(--text-3);margin-bottom:4px">KATEGORI</div><div style="font-weight:600">${kat.icon||''} ${kat.nama||'-'}</div></div>
      <div class="card card-sm"><div style="font-size:11px;color:var(--text-3);margin-bottom:4px">LOKASI</div><div style="font-weight:600;font-size:12px">${lap.lokasi.alamat}</div></div>
      <div class="card card-sm"><div style="font-size:11px;color:var(--text-3);margin-bottom:4px">PELAPOR</div><div style="font-weight:600">${user.nama||'-'}</div></div>
      <div class="card card-sm"><div style="font-size:11px;color:var(--text-3);margin-bottom:4px">DITANGANI OPD</div><div style="font-weight:600;font-size:12px">${opd?opd.nama:'Belum ditetapkan'}</div></div>
    </div>
    ${lap.alasanTolak ? `<div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:var(--radius);padding:12px;margin-bottom:16px"><div style="font-size:12px;font-weight:700;color:var(--danger);margin-bottom:4px">❌ Alasan Penolakan</div><div style="font-size:13px;color:var(--text-2)">${lap.alasanTolak}</div></div>` : ''}
    <div style="margin-bottom:20px">
      <div style="font-size:13px;font-weight:700;margin-bottom:12px">📋 Riwayat Status</div>
      <div class="timeline">${timelineHtml}</div>
    </div>
    ${komens.length > 0 ? `<div>
      <div style="font-size:13px;font-weight:700;margin-bottom:12px">💬 Komentar (${komens.length})</div>
      ${komHtml}
    </div>` : ''}
    ${currentUser.role === 'warga' && lap.userId === currentUser.id ? `
    <div style="margin-top:16px;border-top:1px solid var(--card-border);padding-top:16px">
      <div style="font-size:13px;font-weight:600;margin-bottom:8px">Tambah Komentar</div>
      <textarea id="komentar-input" placeholder="Tulis komentar..." style="margin-bottom:10px"></textarea>
      <button class="btn btn-primary-solid btn-sm" onclick="tambahKomentar(${id})">Kirim Komentar</button>
    </div>` : ''}
    <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">
      <span style="font-size:13px;color:var(--text-2)">👍 ${lap.dukungan} dukungan</span>
      ${currentUser.role === 'warga' ? `<button class="btn btn-outline btn-sm" onclick="dukungLaporan(${id})">👍 Dukung</button>` : ''}
      ${currentUser.role === 'warga' && lap.status==='selesai' && !lap.survei ? `<button class="btn btn-primary-solid btn-sm" onclick="closeModal();navigateTo('survei')">⭐ Isi Survei</button>` : ''}
    </div>
  `;

  openModal(`📋 Detail Laporan`, body, '700px');
}

function tambahKomentar(laporanId) {
  const input = document.getElementById('komentar-input');
  const teks = input.value.trim();
  if (!teks) { showToast('warning', 'Komentar Kosong', 'Tulis komentar terlebih dahulu.'); return; }
  KOMENTAR_DB.push({
    id: KOMENTAR_DB.length + 1, laporanId, userId: currentUser.id,
    nama: currentUser.nama, teks, tanggal: new Date().toISOString(), dukungan: 0
  });
  showToast('success', 'Komentar Terkirim', 'Komentar Anda berhasil ditambahkan.');
  closeModal();
  setTimeout(() => showLaporanDetail(laporanId), 100);
}

function dukungLaporan(id) {
  const lap = LAPORAN_DB.find(l => l.id === id);
  if (lap) { lap.dukungan++; showToast('success', 'Dukungan Diberikan', 'Anda mendukung laporan ini.'); closeModal(); setTimeout(() => showLaporanDetail(id), 100); }
}
