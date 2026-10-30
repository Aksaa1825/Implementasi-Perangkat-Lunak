// =============================================
// Admin Pages: Verifikasi, Kelola Kategori, Pengguna
// =============================================

// ---- VERIFIKASI LAPORAN ----
function renderVerifikasi(container) {
  const pending = LAPORAN_DB.filter(l => l.status === 'menunggu')
    .sort((a,b) => new Date(a.tanggal) - new Date(b.tanggal));

  container.innerHTML = `
    <div class="page-header animate-in">
      <h1>✅ Verifikasi Laporan</h1>
      <p>${pending.length} laporan menunggu verifikasi admin.</p>
    </div>
    <div id="verifikasi-list" class="animate-in animate-in-delay-1">
      ${pending.length ? pending.map(l => renderVerifikasiCard(l)).join('') : emptyState('✅','Semua Sudah Diverifikasi','Tidak ada laporan yang perlu diverifikasi.')}
    </div>
  `;
}

function renderVerifikasiCard(l) {
  const kat = getKategori(l.kategoriId);
  const user = getUser(l.userId);
  return `
  <div class="card animate-in" style="margin-bottom:16px" id="ver-card-${l.id}">
    <div style="display:flex;gap:16px;flex-wrap:wrap">
      <div style="width:80px;height:80px;border-radius:12px;background:var(--bg-3);display:flex;align-items:center;justify-content:center;font-size:36px;flex-shrink:0">${kat.icon||'📄'}</div>
      <div style="flex:1;min-width:200px">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px">
          <span style="font-size:12px;font-family:monospace;color:var(--text-3)">${l.tiket}</span>
          <span class="badge badge-menunggu">Menunggu</span>
          <span class="badge ${getPrioritasClass(l.prioritas)}">${l.prioritas.toUpperCase()}</span>
        </div>
        <h3 style="font-size:16px;font-weight:700;margin-bottom:6px">${l.judul}</h3>
        <p style="font-size:13px;color:var(--text-2);line-height:1.6;margin-bottom:10px">${l.deskripsi}</p>
        <div style="display:flex;flex-wrap:wrap;gap:12px;font-size:12px;color:var(--text-3)">
          <span>${kat.icon} ${kat.nama}</span>
          <span>📍 ${l.lokasi.alamat}</span>
          <span>👤 ${user.nama}</span>
          <span>📅 ${formatDateTime(l.tanggal)}</span>
          <span>👍 ${l.dukungan} dukungan</span>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;min-width:160px">
        <button class="btn btn-success btn-sm" onclick="openDisposisiModal(${l.id})">✅ Verifikasi & Disposisi</button>
        <button class="btn btn-danger btn-sm" onclick="openTolakModal(${l.id})">❌ Tolak / Duplikat</button>
        <button class="btn btn-ghost btn-sm" onclick="showLaporanDetail(${l.id})">👁 Lihat Detail</button>
      </div>
    </div>
  </div>`;
}

function openDisposisiModal(laporanId) {
  const l = LAPORAN_DB.find(x => x.id === laporanId);
  const kat = getKategori(l.kategoriId);
  const suggestedOPD = OPDS.find(o => o.kategori.includes(l.kategoriId));

  openModal('✅ Verifikasi & Disposisi Laporan', `
    <div style="background:var(--bg-3);border-radius:var(--radius);padding:14px;margin-bottom:16px">
      <div style="font-weight:700;margin-bottom:4px">${l.judul}</div>
      <div style="font-size:12px;color:var(--text-2)">${kat.icon} ${kat.nama} · ${l.tiket}</div>
    </div>
    <div class="form-group">
      <label>Disposisi ke OPD *</label>
      <select id="disposisi-opd">
        <option value="">-- Pilih OPD --</option>
        ${OPDS.map(o=>`<option value="${o.id}" ${suggestedOPD?.id===o.id?'selected':''}>${o.nama}</option>`).join('')}
      </select>
      ${suggestedOPD ? `<div style="font-size:11px;color:var(--success);margin-top:4px">💡 Rekomendasi: ${suggestedOPD.nama}</div>` : ''}
    </div>
    <div class="form-group">
      <label>Catatan untuk OPD</label>
      <textarea id="disposisi-catatan" placeholder="Catatan tambahan untuk petugas OPD..."></textarea>
    </div>
    <div class="form-actions">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-success" onclick="prosesDisposisi(${laporanId})">✅ Konfirmasi Disposisi</button>
    </div>
  `);
}

function prosesDisposisi(laporanId) {
  const opdId = parseInt(document.getElementById('disposisi-opd').value);
  if (!opdId) { showToast('warning','Pilih OPD','Pilih OPD tujuan disposisi.'); return; }

  const l = LAPORAN_DB.find(x => x.id === laporanId);
  const opd = getOPD(opdId);
  const user = getUser(l.userId);

  l.status = 'diteruskan';
  l.opdId = opdId;
  l.tanggalUpdate = new Date().toISOString();
  l.timeline.push({ status:'diproses', tanggal: new Date().toISOString(), keterangan:`Admin memverifikasi laporan — valid`, icon:'✅', color:'#3B82F6' });
  l.timeline.push({ status:'diteruskan', tanggal: new Date().toISOString(), keterangan:`Laporan didisposisi ke ${opd.nama}`, icon:'📤', color:'#8B5CF6' });

  // Notif ke warga
  NOTIFIKASI_DB.push({ id: NOTIFIKASI_DB.length+1, userId: l.userId, judul:'Status Laporan Diperbarui', pesan:`Laporan ${l.tiket} telah diverifikasi dan diteruskan ke ${opd.nama}.`, tanggal: new Date().toISOString(), dibaca:false, type:'info', laporanId });
  // Notif ke petugas OPD (user id 3 simulasi)
  NOTIFIKASI_DB.push({ id: NOTIFIKASI_DB.length+1, userId: 3, judul:'Disposisi Laporan Baru', pesan:`Laporan ${l.tiket} didisposisi ke ${opd.nama}. Segera tindak lanjuti.`, tanggal: new Date().toISOString(), dibaca:false, type:'warning', laporanId });

  closeModal();
  showToast('success','Disposisi Berhasil',`Laporan diteruskan ke ${opd.nama}.`);
  setTimeout(() => navigateTo('verifikasi'), 500);
}

function openTolakModal(laporanId) {
  const l = LAPORAN_DB.find(x => x.id === laporanId);
  openModal('❌ Tolak Laporan', `
    <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:var(--radius);padding:14px;margin-bottom:16px">
      <div style="font-weight:700;margin-bottom:4px;color:var(--danger)">⚠️ Tindakan ini tidak dapat dibatalkan</div>
      <div style="font-size:13px;color:var(--text-2)">Laporan "${l.judul}" akan ditolak dan warga akan mendapat notifikasi.</div>
    </div>
    <div class="form-group">
      <label>Alasan Penolakan *</label>
      <select id="tolak-alasan">
        <option value="">-- Pilih Alasan --</option>
        <option value="Laporan duplikat dengan laporan sebelumnya yang sedang ditangani.">Duplikat</option>
        <option value="Informasi laporan tidak lengkap dan tidak dapat diproses.">Informasi Tidak Lengkap</option>
        <option value="Laporan tidak sesuai dengan yurisdiksi pemerintah kota.">Di Luar Yurisdiksi</option>
        <option value="Laporan tidak disertai bukti yang memadai.">Bukti Tidak Memadai</option>
        <option value="Laporan mengandung informasi yang tidak akurat.">Informasi Tidak Akurat</option>
      </select>
    </div>
    <div class="form-group">
      <label>Keterangan Tambahan</label>
      <textarea id="tolak-keterangan" placeholder="Tambahan penjelasan untuk warga..."></textarea>
    </div>
    <div class="form-actions">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-danger" onclick="prosesTolak(${laporanId})">❌ Tolak Laporan</button>
    </div>
  `);
}

function prosesTolak(laporanId) {
  const alasan = document.getElementById('tolak-alasan').value;
  const ket = document.getElementById('tolak-keterangan').value;
  if (!alasan) { showToast('warning','Pilih Alasan','Pilih alasan penolakan.'); return; }

  const l = LAPORAN_DB.find(x => x.id === laporanId);
  l.status = 'ditolak';
  l.alasanTolak = alasan + (ket ? ` ${ket}` : '');
  l.tanggalUpdate = new Date().toISOString();
  l.timeline.push({ status:'ditolak', tanggal: new Date().toISOString(), keterangan:`Laporan ditolak: ${alasan}`, icon:'❌', color:'#EF4444' });

  NOTIFIKASI_DB.push({ id: NOTIFIKASI_DB.length+1, userId: l.userId, judul:'Laporan Ditolak', pesan:`Laporan ${l.tiket} ditolak. Alasan: ${alasan}`, tanggal: new Date().toISOString(), dibaca:false, type:'error', laporanId });

  closeModal();
  showToast('info','Laporan Ditolak','Warga sudah mendapatkan notifikasi.');
  setTimeout(() => navigateTo('verifikasi'), 500);
}

// ---- KELOLA KATEGORI & OPD ----
function renderKelolaKategori(container) {
  container.innerHTML = `
    <div class="page-header animate-in">
      <h1>🏢 Kelola Kategori & OPD</h1>
      <p>Manajemen kategori laporan dan data organisasi perangkat daerah.</p>
    </div>
    <div class="tabs animate-in animate-in-delay-1" id="kategori-tabs">
      <button class="tab-btn active" onclick="switchKatTab('kategori', this)">📋 Kategori</button>
      <button class="tab-btn" onclick="switchKatTab('opd', this)">🏢 OPD</button>
    </div>
    <div id="kat-tab-content" class="animate-in animate-in-delay-2">
      ${renderKategoriTab()}
    </div>
  `;
}

function switchKatTab(tab, btn) {
  document.querySelectorAll('#kategori-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('kat-tab-content').innerHTML = tab === 'kategori' ? renderKategoriTab() : renderOPDTab();
}

function renderKategoriTab() {
  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">Daftar Kategori Laporan</div>
        <button class="btn btn-primary-solid btn-sm" onclick="openModal('Tambah Kategori', tambahKategoriForm())">+ Tambah Kategori</button>
      </div>
      <div class="grid-3" style="gap:14px">
        ${KATEGORIS.map(k=>`
          <div class="card card-sm" style="display:flex;align-items:center;gap:12px">
            <div style="font-size:28px;width:48px;height:48px;border-radius:10px;background:${k.color}20;display:flex;align-items:center;justify-content:center">${k.icon}</div>
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:14px">${k.nama}</div>
              <div style="font-size:11px;color:var(--text-3)">${k.opd}</div>
              <div style="font-size:11px;color:var(--primary-light);margin-top:2px">${LAPORAN_DB.filter(l=>l.kategoriId===k.id).length} laporan</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

function renderOPDTab() {
  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">Daftar OPD</div>
        <button class="btn btn-primary-solid btn-sm">+ Tambah OPD</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Nama OPD</th><th>Kepala</th><th>Email</th><th>Laporan</th><th>Aksi</th></tr></thead>
          <tbody>
          ${OPDS.map(o=>`<tr>
            <td style="font-weight:700">${o.nama}</td>
            <td>${o.kepala}</td>
            <td style="color:var(--text-2)">${o.email}</td>
            <td><span class="badge badge-diproses">${LAPORAN_DB.filter(l=>l.opdId===o.id).length}</span></td>
            <td><button class="btn btn-ghost btn-sm">Edit</button></td>
          </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

function tambahKategoriForm() {
  return `<div class="form-group"><label>Nama Kategori</label><input type="text" id="new-kat-nama" placeholder="Nama kategori..." /></div>
  <div class="form-group"><label>Icon (Emoji)</label><input type="text" id="new-kat-icon" placeholder="🏗️" maxlength="4" /></div>
  <div class="form-group"><label>OPD Terkait</label><select id="new-kat-opd">${OPDS.map(o=>`<option>${o.nama}</option>`).join('')}</select></div>
  <div class="form-actions"><button class="btn btn-outline" onclick="closeModal()">Batal</button><button class="btn btn-primary-solid" onclick="tambahKategori()">Simpan</button></div>`;
}

function tambahKategori() {
  const nama = document.getElementById('new-kat-nama').value.trim();
  const icon = document.getElementById('new-kat-icon').value.trim() || '📋';
  if (!nama) { showToast('warning','Nama Kosong','Isi nama kategori.'); return; }
  KATEGORIS.push({ id: KATEGORIS.length+1, nama, icon, opd: document.getElementById('new-kat-opd').value, color:'#6366F1' });
  closeModal();
  showToast('success','Kategori Ditambahkan','Kategori baru berhasil ditambahkan.');
  navigateTo('kelola-kategori');
}

// ---- KELOLA PENGGUNA ----
function renderKelolaPengguna(container) {
  container.innerHTML = `
    <div class="page-header animate-in">
      <h1>👥 Kelola Pengguna</h1>
      <p>Manajemen akun pengguna sistem.</p>
    </div>
    <div class="card animate-in animate-in-delay-1">
      <div class="card-header">
        <div class="card-title">Daftar Pengguna</div>
        <div style="display:flex;gap:8px">
          <input type="text" id="user-search" placeholder="Cari pengguna..." style="width:200px" oninput="filterPengguna()" />
          <select id="user-role-filter" onchange="filterPengguna()">
            <option value="">Semua Role</option>
            <option value="warga">Warga</option>
            <option value="admin">Admin</option>
            <option value="opd">Petugas OPD</option>
            <option value="pimpinan">Pimpinan</option>
          </select>
        </div>
      </div>
      <div class="table-wrapper" id="pengguna-table">
        ${renderPenggunaTable(USERS)}
      </div>
    </div>
  `;
}

function filterPengguna() {
  const s = document.getElementById('user-search').value.toLowerCase();
  const r = document.getElementById('user-role-filter').value;
  let filtered = [...USERS];
  if (s) filtered = filtered.filter(u => u.nama.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
  if (r) filtered = filtered.filter(u => u.role === r);
  document.getElementById('pengguna-table').innerHTML = renderPenggunaTable(filtered);
}

function renderPenggunaTable(users) {
  return `<table>
    <thead><tr><th>Nama</th><th>Email</th><th>Role</th><th>Laporan</th><th>Aksi</th></tr></thead>
    <tbody>
    ${users.map(u=>`<tr>
      <td><div style="display:flex;align-items:center;gap:10px">
        <div class="user-avatar" style="width:32px;height:32px;font-size:13px">${u.avatar}</div>
        <div><div style="font-weight:600">${u.nama}</div><div style="font-size:11px;color:var(--text-3)">${u.nik||'-'}</div></div>
      </div></td>
      <td style="color:var(--text-2)">${u.email}</td>
      <td><span class="badge badge-diproses">${getRoleLabel(u.role)}</span></td>
      <td>${LAPORAN_DB.filter(l=>l.userId===u.id).length}</td>
      <td><div style="display:flex;gap:6px">
        <button class="btn btn-ghost btn-sm" onclick="lihatProfilUser(${u.id})">Lihat</button>
      </div></td>
    </tr>`).join('')}
    </tbody>
  </table>`;
}

function lihatProfilUser(userId) {
  const u = getUser(userId);
  const laporans = LAPORAN_DB.filter(l=>l.userId===userId);
  openModal(`👤 Profil ${u.nama}`, `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
      <div class="user-avatar" style="width:60px;height:60px;font-size:24px">${u.avatar}</div>
      <div>
        <div style="font-size:18px;font-weight:800">${u.nama}</div>
        <div style="color:var(--text-2)">${u.email}</div>
        <span class="badge badge-diproses" style="margin-top:4px">${getRoleLabel(u.role)}</span>
      </div>
    </div>
    <div class="grid-3" style="margin-bottom:16px;gap:10px">
      <div style="background:var(--bg-3);padding:12px;border-radius:10px;text-align:center"><div style="font-size:20px;font-weight:800;color:var(--primary)">${laporans.length}</div><div style="font-size:11px;color:var(--text-2)">Total Laporan</div></div>
      <div style="background:var(--bg-3);padding:12px;border-radius:10px;text-align:center"><div style="font-size:20px;font-weight:800;color:var(--success)">${laporans.filter(l=>l.status==='selesai').length}</div><div style="font-size:11px;color:var(--text-2)">Selesai</div></div>
      <div style="background:var(--bg-3);padding:12px;border-radius:10px;text-align:center"><div style="font-size:20px;font-weight:800;color:var(--warning)">${laporans.filter(l=>l.status==='menunggu').length}</div><div style="font-size:11px;color:var(--text-2)">Menunggu</div></div>
    </div>
    <div style="display:grid;gap:8px;font-size:13px">
      <div style="display:flex;justify-content:space-between"><span style="color:var(--text-2)">NIK</span><span>${u.nik||'-'}</span></div>
      <div style="display:flex;justify-content:space-between"><span style="color:var(--text-2)">Telepon</span><span>${u.phone||'-'}</span></div>
      <div style="display:flex;justify-content:space-between"><span style="color:var(--text-2)">Alamat</span><span style="text-align:right;max-width:60%">${u.alamat||'-'}</span></div>
    </div>
  `, '500px');
}
