// =============================================
// Profil Page
// =============================================
function renderProfil(container) {
  const u = currentUser;
  const myLaporan = LAPORAN_DB.filter(l => l.userId === u.id);
  const mySelesai = myLaporan.filter(l => l.status === 'selesai').length;
  const myDukungan = myLaporan.reduce((a,l) => a+l.dukungan, 0);

  container.innerHTML = `
    <div class="page-header animate-in">
      <h1>👤 Profil Saya</h1>
      <p>Kelola informasi akun dan preferensi Anda.</p>
    </div>

    <div class="grid-2 animate-in animate-in-delay-1" style="gap:20px;align-items:start">
      <!-- Left: Profile Card -->
      <div>
        <div style="border-radius:var(--radius-lg);overflow:hidden;margin-bottom:16px;box-shadow:var(--shadow)">
          <div class="profile-cover">
            <div class="profile-cover-art"></div>
            <div class="profile-avatar-wrap">
              <div class="profile-avatar">${u.avatar}</div>
            </div>
          </div>
          <div class="profile-body">
            <div class="profile-name">${u.nama}</div>
            <div class="profile-email">${u.email}</div>
            <div style="margin-top:10px"><span class="badge badge-diproses">${getRoleLabel(u.role)}</span></div>
            <div class="profile-stats">
              <div class="profile-stat">
                <div class="profile-stat-val" style="color:var(--primary)">${myLaporan.length}</div>
                <div class="profile-stat-label">Laporan</div>
              </div>
              <div class="profile-stat">
                <div class="profile-stat-val" style="color:var(--success)">${mySelesai}</div>
                <div class="profile-stat-label">Selesai</div>
              </div>
              <div class="profile-stat">
                <div class="profile-stat-val" style="color:var(--warning)">${myDukungan}</div>
                <div class="profile-stat-label">Dukungan</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card">
          <div class="card-header"><div class="card-title">🕐 Aktivitas Terbaru</div></div>
          <div class="timeline">
            ${myLaporan.slice(-4).reverse().map(l => {
              const kat = getKategori(l.kategoriId);
              const lastTimeline = l.timeline[l.timeline.length-1];
              return `<div class="timeline-item">
                <div class="timeline-dot" style="background:${lastTimeline.color}20;color:${lastTimeline.color};font-size:14px">${lastTimeline.icon}</div>
                <div class="timeline-body">
                  <div class="timeline-title">${l.judul}</div>
                  <div class="timeline-meta">${kat.icon} ${kat.nama} · ${timeAgo(l.tanggalUpdate)}</div>
                  <div class="timeline-content"><span class="badge ${getStatusClass(l.status)}" style="font-size:10px">${getStatusLabel(l.status)}</span></div>
                </div>
              </div>`;
            }).join('') || '<p style="color:var(--text-3);font-size:13px">Belum ada aktivitas.</p>'}
          </div>
        </div>
      </div>

      <!-- Right: Edit Form -->
      <div>
        <div class="card" style="margin-bottom:16px">
          <div class="card-header">
            <div class="card-title">✏️ Edit Informasi Profil</div>
          </div>
          <div class="form-group">
            <label>Nama Lengkap</label>
            <input type="text" id="edit-nama" value="${u.nama}" />
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label>Email</label>
              <input type="email" id="edit-email" value="${u.email}" />
            </div>
            <div class="form-group">
              <label>No. Telepon</label>
              <input type="tel" id="edit-phone" value="${u.phone||''}" placeholder="08xx..." />
            </div>
          </div>
          <div class="form-group">
            <label>Alamat</label>
            <textarea id="edit-alamat" style="min-height:70px">${u.alamat||''}</textarea>
          </div>
          ${u.role === 'warga' ? `
          <div class="form-group">
            <label>NIK</label>
            <input type="text" id="edit-nik" value="${u.nik||''}" placeholder="16 digit NIK" maxlength="16" />
          </div>` : ''}
          <div class="form-actions">
            <button class="btn btn-primary-solid" onclick="simpanProfil()">💾 Simpan Perubahan</button>
          </div>
        </div>

        <div class="card" style="margin-bottom:16px">
          <div class="card-header"><div class="card-title">🔐 Ganti Password</div></div>
          <div class="form-group">
            <label>Password Saat Ini</label>
            <input type="password" id="pw-lama" placeholder="••••••••" />
          </div>
          <div class="form-group">
            <label>Password Baru</label>
            <input type="password" id="pw-baru" placeholder="Min. 8 karakter" />
          </div>
          <div class="form-group">
            <label>Konfirmasi Password Baru</label>
            <input type="password" id="pw-konfirm" placeholder="Ulangi password baru" />
          </div>
          <div class="form-actions">
            <button class="btn btn-outline" onclick="gantiPassword()">🔒 Ganti Password</button>
          </div>
        </div>

        <div class="card" style="border:1px solid rgba(239,68,68,0.2)">
          <div class="card-header"><div class="card-title" style="color:var(--danger)">⚠️ Zona Berbahaya</div></div>
          <p style="font-size:13px;color:var(--text-2);margin-bottom:16px">Tindakan berikut tidak dapat dibatalkan. Harap berhati-hati.</p>
          <button class="btn btn-danger" onclick="handleLogout()">🚪 Keluar dari Akun</button>
        </div>
      </div>
    </div>
  `;
}

function simpanProfil() {
  const nama = document.getElementById('edit-nama').value.trim();
  const email = document.getElementById('edit-email').value.trim();
  const phone = document.getElementById('edit-phone').value.trim();
  const alamat = document.getElementById('edit-alamat').value.trim();

  if (!nama || !email) { showToast('warning','Form Tidak Lengkap','Nama dan email wajib diisi.'); return; }

  // Update user data
  const idx = USERS.findIndex(u => u.id === currentUser.id);
  if (idx >= 0) {
    USERS[idx].nama = nama;
    USERS[idx].email = email;
    USERS[idx].phone = phone;
    USERS[idx].alamat = alamat;
    USERS[idx].avatar = nama.charAt(0).toUpperCase();
    if (document.getElementById('edit-nik')) {
      USERS[idx].nik = document.getElementById('edit-nik').value;
    }
  }
  currentUser.nama = nama;
  currentUser.email = email;
  currentUser.phone = phone;
  currentUser.alamat = alamat;
  currentUser.avatar = nama.charAt(0).toUpperCase();
  sessionStorage.setItem('lw_user', JSON.stringify(currentUser));

  renderTopbar();
  renderSidebar();
  showToast('success','Profil Diperbarui','Informasi profil berhasil disimpan.');
}

function gantiPassword() {
  const lama = document.getElementById('pw-lama').value;
  const baru = document.getElementById('pw-baru').value;
  const konfirm = document.getElementById('pw-konfirm').value;

  if (!lama || !baru || !konfirm) { showToast('warning','Form Tidak Lengkap','Isi semua field password.'); return; }
  if (lama !== currentUser.password) { showToast('error','Password Salah','Password saat ini tidak sesuai.'); return; }
  if (baru.length < 8) { showToast('warning','Password Terlalu Pendek','Minimal 8 karakter.'); return; }
  if (baru !== konfirm) { showToast('error','Password Tidak Cocok','Konfirmasi password tidak sama.'); return; }

  const idx = USERS.findIndex(u => u.id === currentUser.id);
  if (idx >= 0) USERS[idx].password = baru;
  currentUser.password = baru;
  sessionStorage.setItem('lw_user', JSON.stringify(currentUser));

  document.getElementById('pw-lama').value = '';
  document.getElementById('pw-baru').value = '';
  document.getElementById('pw-konfirm').value = '';
  showToast('success','Password Diubah','Password berhasil diganti.');
}
