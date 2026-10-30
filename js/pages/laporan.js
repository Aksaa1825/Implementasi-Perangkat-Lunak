// =============================================
// Laporan Pages (Buat, Saya, Semua)
// =============================================

// ---- BUAT LAPORAN ----
let uploadedFiles = [];
let currentStep = 1;
let formLokasi = { lat: -6.5971, lng: 106.8060, alamat: 'Kota Bogor, Jawa Barat' };

function renderBuatLaporan(container) {
  container.innerHTML = `
    <div class="page-header animate-in">
      <h1>📝 Buat Laporan Baru</h1>
      <p>Isi formulir laporan dengan lengkap dan akurat untuk penanganan yang lebih cepat.</p>
    </div>
    <div class="step-indicator animate-in animate-in-delay-1" id="step-indicator">
      <div class="step active" id="step-el-1">
        <div class="step-circle">1</div>
        <div class="step-label">Informasi Laporan</div>
        <div class="step-line"></div>
      </div>
      <div class="step" id="step-el-2">
        <div class="step-circle">2</div>
        <div class="step-label">Foto & Lokasi</div>
        <div class="step-line"></div>
      </div>
      <div class="step" id="step-el-3">
        <div class="step-circle">3</div>
        <div class="step-label">Konfirmasi</div>
      </div>
    </div>

    <div class="form-card animate-in animate-in-delay-2" id="laporan-form-card">
      <!-- Step 1 -->
      <div id="step-content-1">
        <div class="form-section-title">📋 Informasi Laporan</div>
        <div class="form-group">
          <label for="lap-kategori">Kategori Laporan *</label>
          <select id="lap-kategori">
            <option value="">-- Pilih Kategori --</option>
            ${KATEGORIS.map(k => `<option value="${k.id}">${k.icon} ${k.nama}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="lap-judul">Judul Laporan *</label>
          <input type="text" id="lap-judul" placeholder="Deskripsikan masalah secara singkat..." maxlength="100" />
          <div style="font-size:11px;color:var(--text-3);margin-top:4px">Maksimal 100 karakter</div>
        </div>
        <div class="form-group">
          <label for="lap-deskripsi">Deskripsi Detail *</label>
          <textarea id="lap-deskripsi" placeholder="Jelaskan masalah secara detail: lokasi spesifik, kondisi, dampak yang ditimbulkan..." style="min-height:120px"></textarea>
        </div>
        <div class="form-group">
          <label for="lap-prioritas">Tingkat Prioritas</label>
          <select id="lap-prioritas">
            <option value="rendah">🟢 Rendah — Tidak mendesak</option>
            <option value="sedang" selected>🟡 Sedang — Perlu perhatian</option>
            <option value="tinggi">🟠 Tinggi — Mengganggu aktivitas warga</option>
            <option value="darurat">🔴 Darurat — Mengancam keselamatan jiwa</option>
          </select>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary-solid" onclick="stepLaporan(2)">Lanjut: Foto & Lokasi →</button>
        </div>
      </div>

      <!-- Step 2 -->
      <div id="step-content-2" class="hidden">
        <div class="form-section-title">📸 Foto & Lokasi</div>
        <div class="form-group">
          <label>Foto Laporan</label>
          <div class="file-upload-zone" id="upload-zone" onclick="document.getElementById('file-input').click()" ondragover="handleDragOver(event)" ondrop="handleDrop(event)">
            <div class="file-upload-icon">📸</div>
            <div class="file-upload-text">Klik atau seret foto ke sini (<span>pilih file</span>)</div>
            <div class="file-upload-hint">Format: JPG, PNG, WEBP · Maks 5MB per file · Maks 5 foto</div>
          </div>
          <input type="file" id="file-input" accept="image/*" multiple style="display:none" onchange="handleFileSelect(event)" />
          <div class="file-preview-list" id="file-preview"></div>
        </div>
        <div class="form-group">
          <label for="lap-alamat">Alamat / Lokasi *</label>
          <input type="text" id="lap-alamat" placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan..." value="${formLokasi.alamat}" />
        </div>
        <div class="form-group">
          <label>Koordinat GPS</label>
          <div style="display:flex;gap:10px">
            <input type="number" id="lap-lat" placeholder="Latitude" value="${formLokasi.lat}" step="any" style="flex:1" />
            <input type="number" id="lap-lng" placeholder="Longitude" value="${formLokasi.lng}" step="any" style="flex:1" />
            <button class="btn btn-ghost" onclick="getGPSLocation()">📍 Gunakan GPS</button>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-outline" onclick="stepLaporan(1)">← Kembali</button>
          <button class="btn btn-primary-solid" onclick="stepLaporan(3)">Lanjut: Konfirmasi →</button>
        </div>
      </div>

      <!-- Step 3 -->
      <div id="step-content-3" class="hidden">
        <div class="form-section-title">✅ Konfirmasi Laporan</div>
        <div id="konfirmasi-preview"></div>
        <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:var(--radius);padding:14px;margin-bottom:20px">
          <p style="font-size:13px;color:var(--text-2)">⚠️ Dengan mengirim laporan, Anda menyatakan bahwa informasi yang disampaikan adalah benar dan akurat. Laporan palsu dapat dikenakan sanksi sesuai peraturan yang berlaku.</p>
        </div>
        <div class="form-actions">
          <button class="btn btn-outline" onclick="stepLaporan(2)">← Kembali</button>
          <button class="btn btn-primary-solid btn-lg" onclick="kirimLaporan()">📤 Kirim Laporan</button>
        </div>
      </div>
    </div>
  `;
  uploadedFiles = [];
  currentStep = 1;
}

function stepLaporan(step) {
  // Validate current step
  if (step > currentStep) {
    if (currentStep === 1) {
      if (!document.getElementById('lap-kategori').value) { showToast('warning','Pilih Kategori','Pilih kategori laporan terlebih dahulu.'); return; }
      if (!document.getElementById('lap-judul').value.trim()) { showToast('warning','Judul Kosong','Isi judul laporan.'); return; }
      if (!document.getElementById('lap-deskripsi').value.trim()) { showToast('warning','Deskripsi Kosong','Isi deskripsi laporan.'); return; }
    }
    if (currentStep === 2) {
      if (!document.getElementById('lap-alamat').value.trim()) { showToast('warning','Alamat Kosong','Isi alamat lokasi kejadian.'); return; }
    }
  }

  // Hide all steps
  [1,2,3].forEach(s => {
    document.getElementById(`step-content-${s}`).classList.add('hidden');
    const el = document.getElementById(`step-el-${s}`);
    el.classList.remove('active','done');
    if (s < step) el.classList.add('done');
    if (s === step) el.classList.add('active');
  });
  document.getElementById(`step-content-${step}`).classList.remove('hidden');
  currentStep = step;

  if (step === 3) renderKonfirmasi();
}

function renderKonfirmasi() {
  const katId = parseInt(document.getElementById('lap-kategori').value);
  const kat = getKategori(katId);
  const judul = document.getElementById('lap-judul').value;
  const deskripsi = document.getElementById('lap-deskripsi').value;
  const prioritas = document.getElementById('lap-prioritas').value;
  const alamat = document.getElementById('lap-alamat').value;

  document.getElementById('konfirmasi-preview').innerHTML = `
    <div class="card" style="margin-bottom:16px">
      <div style="display:grid;gap:12px">
        <div style="display:flex;justify-content:space-between"><span style="color:var(--text-2)">Kategori</span><strong>${kat.icon} ${kat.nama}</strong></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--text-2)">Judul</span><strong style="text-align:right;max-width:60%">${judul}</strong></div>
        <div><span style="color:var(--text-2)">Deskripsi</span><p style="font-size:13px;margin-top:4px;line-height:1.6;color:var(--text)">${deskripsi}</p></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--text-2)">Prioritas</span><span class="badge ${getPrioritasClass(prioritas)}">${prioritas.toUpperCase()}</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--text-2)">Lokasi</span><strong style="text-align:right;max-width:60%">${alamat}</strong></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--text-2)">Foto</span><strong>${uploadedFiles.length} foto dilampirkan</strong></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--text-2)">Pelapor</span><strong>${currentUser.nama}</strong></div>
      </div>
    </div>
  `;
}

function kirimLaporan() {
  const katId = parseInt(document.getElementById('lap-kategori').value);
  const kat = getKategori(katId);
  const tiket = generateTiket();
  const newLaporan = {
    id: LAPORAN_DB.length + 1,
    tiket,
    judul: document.getElementById('lap-judul').value,
    deskripsi: document.getElementById('lap-deskripsi').value,
    kategoriId: katId,
    status: 'menunggu',
    prioritas: document.getElementById('lap-prioritas').value,
    lokasi: {
      lat: parseFloat(document.getElementById('lap-lat').value) || -6.5971,
      lng: parseFloat(document.getElementById('lap-lng').value) || 106.8060,
      alamat: document.getElementById('lap-alamat').value,
    },
    userId: currentUser.id,
    foto: uploadedFiles.length > 0 ? uploadedFiles : [kat.icon || '📄'],
    tanggal: new Date().toISOString(),
    tanggalUpdate: new Date().toISOString(),
    opdId: null, petugas: null, komentar: 0, dukungan: 0,
    timeline: [{ status:'menunggu', tanggal: new Date().toISOString(), keterangan:'Laporan diterima, nomor tiket dibuat secara otomatis', icon:'📨', color:'#F59E0B' }],
    buktiFoto: [], rating: null, survei: false,
  };
  LAPORAN_DB.push(newLaporan);

  // Add notification
  NOTIFIKASI_DB.push({
    id: NOTIFIKASI_DB.length + 1, userId: currentUser.id,
    judul: 'Laporan Berhasil Dikirim!',
    pesan: `Laporan "${newLaporan.judul}" dengan tiket ${tiket} telah diterima.`,
    tanggal: new Date().toISOString(), dibaca: false, type:'success', laporanId: newLaporan.id,
  });

  // Admin notification
  NOTIFIKASI_DB.push({
    id: NOTIFIKASI_DB.length + 1, userId: 2,
    judul: 'Laporan Baru Masuk',
    pesan: `Laporan ${tiket} tentang "${newLaporan.judul}" menunggu verifikasi.`,
    tanggal: new Date().toISOString(), dibaca: false, type:'info', laporanId: newLaporan.id,
  });

  updateNotifBadge();
  showToast('success','Laporan Terkirim! 🎉',`Nomor tiket Anda: ${tiket}`, 5000);
  setTimeout(() => navigateTo('laporan-saya'), 1200);
}

function getGPSLocation() {
  if (!navigator.geolocation) { showToast('error','GPS Tidak Tersedia','Browser tidak mendukung geolokasi.'); return; }
  showToast('info','Mendapatkan Lokasi...','Mohon tunggu sebentar.');
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      document.getElementById('lap-lat').value = pos.coords.latitude.toFixed(6);
      document.getElementById('lap-lng').value = pos.coords.longitude.toFixed(6);
      document.getElementById('lap-alamat').value = `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`;
      showToast('success','Lokasi Ditemukan','Koordinat GPS berhasil didapatkan.');
    },
    () => showToast('error','GPS Gagal','Tidak dapat mengakses lokasi Anda.')
  );
}

function handleFileSelect(e) {
  const files = Array.from(e.target.files);
  addFiles(files);
}
function handleDragOver(e) { e.preventDefault(); document.getElementById('upload-zone').classList.add('dragover'); }
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('upload-zone').classList.remove('dragover');
  addFiles(Array.from(e.dataTransfer.files));
}
function addFiles(files) {
  files.forEach(f => {
    if (!f.type.startsWith('image/')) { showToast('warning','File Tidak Valid','Hanya gambar yang diizinkan.'); return; }
    if (f.size > 5*1024*1024) { showToast('warning','File Terlalu Besar','Maksimal 5MB per file.'); return; }
    if (uploadedFiles.length >= 5) { showToast('warning','Batas Foto','Maksimal 5 foto.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      uploadedFiles.push(ev.target.result);
      renderFilePreviews();
    };
    reader.readAsDataURL(f);
  });
}
function renderFilePreviews() {
  const list = document.getElementById('file-preview');
  list.innerHTML = uploadedFiles.map((src,i) => `
    <div class="file-preview-item">
      <img src="${src}" alt="preview ${i+1}" />
      <div class="file-preview-remove" onclick="removeFile(${i})">✕</div>
    </div>
  `).join('');
}
function removeFile(i) { uploadedFiles.splice(i,1); renderFilePreviews(); }


// ---- LAPORAN SAYA ----
function renderLaporanSaya(container) {
  const myLaporan = LAPORAN_DB.filter(l => l.userId === currentUser.id)
    .sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal));

  container.innerHTML = `
    <div class="page-header animate-in">
      <h1>📋 Laporan Saya</h1>
      <p>Pantau status semua laporan yang telah Anda buat.</p>
    </div>
    <div class="filter-bar animate-in animate-in-delay-1">
      <div class="search-input-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" id="filter-search" placeholder="Cari laporan..." oninput="filterLaporanSaya()" />
      </div>
      <select id="filter-status" onchange="filterLaporanSaya()">
        <option value="">Semua Status</option>
        <option value="menunggu">Menunggu Verifikasi</option>
        <option value="diproses">Sedang Diproses</option>
        <option value="diteruskan">Diteruskan ke OPD</option>
        <option value="selesai">Selesai</option>
        <option value="ditolak">Ditolak</option>
      </select>
      <button class="btn btn-primary-solid" onclick="navigateTo('buat-laporan')">+ Buat Laporan</button>
    </div>
    <div id="laporan-saya-list" class="animate-in animate-in-delay-2">
      ${renderLaporanList(myLaporan)}
    </div>
  `;
}

function filterLaporanSaya() {
  const search = document.getElementById('filter-search').value.toLowerCase();
  const status = document.getElementById('filter-status').value;
  let filtered = LAPORAN_DB.filter(l => l.userId === currentUser.id);
  if (search) filtered = filtered.filter(l => l.judul.toLowerCase().includes(search) || l.tiket.toLowerCase().includes(search));
  if (status) filtered = filtered.filter(l => l.status === status);
  document.getElementById('laporan-saya-list').innerHTML = renderLaporanList(filtered);
}

// ---- SEMUA LAPORAN (Admin/Pimpinan) ----
function renderSemuaLaporan(container) {
  container.innerHTML = `
    <div class="page-header animate-in">
      <h1>📋 Semua Laporan</h1>
      <p>Daftar seluruh laporan masuk dari warga.</p>
    </div>
    <div class="filter-bar animate-in animate-in-delay-1">
      <div class="search-input-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" id="admin-search" placeholder="Cari tiket, judul..." oninput="filterSemuaLaporan()" />
      </div>
      <select id="admin-filter-status" onchange="filterSemuaLaporan()">
        <option value="">Semua Status</option>
        <option value="menunggu">Menunggu</option>
        <option value="diproses">Diproses</option>
        <option value="diteruskan">Diteruskan</option>
        <option value="selesai">Selesai</option>
        <option value="ditolak">Ditolak</option>
      </select>
      <select id="admin-filter-kat" onchange="filterSemuaLaporan()">
        <option value="">Semua Kategori</option>
        ${KATEGORIS.map(k=>`<option value="${k.id}">${k.icon} ${k.nama}</option>`).join('')}
      </select>
    </div>
    <div class="card animate-in animate-in-delay-2">
      <div class="table-wrapper" id="all-laporan-table">
        ${renderLaporanTable(LAPORAN_DB)}
      </div>
    </div>
  `;
}

function filterSemuaLaporan() {
  const search = document.getElementById('admin-search').value.toLowerCase();
  const status = document.getElementById('admin-filter-status').value;
  const kat = document.getElementById('admin-filter-kat').value;
  let filtered = [...LAPORAN_DB];
  if (search) filtered = filtered.filter(l => l.judul.toLowerCase().includes(search) || l.tiket.toLowerCase().includes(search));
  if (status) filtered = filtered.filter(l => l.status === status);
  if (kat) filtered = filtered.filter(l => l.kategoriId === parseInt(kat));
  document.getElementById('all-laporan-table').innerHTML = renderLaporanTable(filtered);
}

// ---- SHARED RENDER HELPERS ----
function renderLaporanList(list) {
  if (!list.length) return emptyState('📋','Belum Ada Laporan','Tidak ada laporan yang ditemukan.');
  return list.map(l => {
    const kat = getKategori(l.kategoriId);
    return `<div class="laporan-list-item animate-in" onclick="showLaporanDetail(${l.id})" style="margin-bottom:10px">
      <div class="laporan-list-thumb">${kat.icon||'📄'}</div>
      <div class="laporan-list-info">
        <div class="laporan-list-title">${l.judul}</div>
        <div class="laporan-list-desc">${l.deskripsi}</div>
        <div class="laporan-list-tags">
          <span class="laporan-list-tag">📍 ${l.lokasi.alamat}</span>
          <span class="laporan-list-tag">📅 ${formatDate(l.tanggal)}</span>
          <span class="laporan-list-tag">👍 ${l.dukungan}</span>
        </div>
      </div>
      <div class="laporan-list-side">
        <span class="badge ${getStatusClass(l.status)}">${getStatusLabel(l.status)}</span>
        <span class="badge ${getPrioritasClass(l.prioritas)}" style="font-size:10px">${l.prioritas}</span>
        <span style="font-size:11px;color:var(--text-3);font-family:monospace">${l.tiket}</span>
      </div>
    </div>`;
  }).join('');
}

function renderLaporanTable(list) {
  if (!list.length) return `<div class="empty-state" style="padding:40px"><div class="empty-state-icon">📋</div><h3>Tidak Ada Data</h3></div>`;
  return `<table>
    <thead><tr>
      <th>Tiket</th><th>Judul</th><th>Kategori</th><th>Status</th><th>Prioritas</th><th>Tanggal</th><th>Aksi</th>
    </tr></thead>
    <tbody>
    ${list.sort((a,b)=>new Date(b.tanggal)-new Date(a.tanggal)).map(l => {
      const kat = getKategori(l.kategoriId);
      return `<tr>
        <td style="font-family:monospace;font-size:12px;color:var(--text-2)">${l.tiket}</td>
        <td style="font-weight:600;max-width:200px"><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${l.judul}</div></td>
        <td>${kat.icon} ${kat.nama}</td>
        <td><span class="badge ${getStatusClass(l.status)}">${getStatusLabel(l.status)}</span></td>
        <td><span class="badge ${getPrioritasClass(l.prioritas)}">${l.prioritas}</span></td>
        <td style="font-size:12px;color:var(--text-2)">${formatDate(l.tanggal)}</td>
        <td><button class="btn btn-ghost btn-sm" onclick="showLaporanDetail(${l.id})">Lihat →</button></td>
      </tr>`;
    }).join('')}
    </tbody>
  </table>`;
}
