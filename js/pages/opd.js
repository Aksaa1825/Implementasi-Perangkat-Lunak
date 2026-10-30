// =============================================
// OPD Pages: Laporan OPD, Tindak Lanjut
// =============================================

// ---- LAPORAN MASUK OPD ----
function renderLaporanOPD(container) {
  const opdId = getOPDIdForUser();
  const laporanOpd = LAPORAN_DB.filter(l => l.opdId === opdId)
    .sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal));
  const pending = laporanOpd.filter(l => l.status === 'diteruskan');

  container.innerHTML = `
    <div class="page-header animate-in">
      <h1>📋 Laporan Masuk — ${currentUser.opd || 'OPD'}</h1>
      <p>${pending.length} laporan perlu ditindaklanjuti.</p>
    </div>
    <div class="grid-3 animate-in animate-in-delay-1" style="margin-bottom:20px">
      ${statCard('📋','Total Disposisi',laporanOpd.length,'','#6366F1','rgba(99,102,241,0.15)')}
      ${statCard('⚠️','Perlu Tindak Lanjut',pending.length,'','#F59E0B','rgba(245,158,11,0.15)')}
      ${statCard('✅','Selesai',laporanOpd.filter(l=>l.status==='selesai').length,'','#10B981','rgba(16,185,129,0.15)')}
    </div>
    <div class="filter-bar animate-in animate-in-delay-2">
      <div class="search-input-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" id="opd-search" placeholder="Cari laporan..." oninput="filterLaporanOPD()" />
      </div>
      <select id="opd-filter-status" onchange="filterLaporanOPD()">
        <option value="">Semua Status</option>
        <option value="diteruskan">Perlu Tindak Lanjut</option>
        <option value="selesai">Selesai</option>
      </select>
    </div>
    <div id="opd-laporan-list" class="animate-in animate-in-delay-3">
      ${renderOPDLaporanList(laporanOpd)}
    </div>
  `;
}

function filterLaporanOPD() {
  const s = document.getElementById('opd-search').value.toLowerCase();
  const st = document.getElementById('opd-filter-status').value;
  const opdId = getOPDIdForUser();
  let filtered = LAPORAN_DB.filter(l => l.opdId === opdId);
  if (s) filtered = filtered.filter(l => l.judul.toLowerCase().includes(s));
  if (st) filtered = filtered.filter(l => l.status === st);
  document.getElementById('opd-laporan-list').innerHTML = renderOPDLaporanList(filtered);
}

function renderOPDLaporanList(list) {
  if (!list.length) return emptyState('📋','Tidak Ada Laporan','Belum ada laporan yang didisposisi ke unit ini.');
  return list.map(l => {
    const kat = getKategori(l.kategoriId);
    const user = getUser(l.userId);
    const isDone = l.status === 'selesai';
    return `
    <div class="card animate-in" style="margin-bottom:14px">
      <div style="display:flex;gap:14px;flex-wrap:wrap">
        <div style="width:72px;height:72px;border-radius:12px;background:var(--bg-3);display:flex;align-items:center;justify-content:center;font-size:32px;flex-shrink:0">${kat.icon||'📄'}</div>
        <div style="flex:1;min-width:200px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">
            <span style="font-size:11px;font-family:monospace;color:var(--text-3)">${l.tiket}</span>
            <span class="badge ${getStatusClass(l.status)}">${getStatusLabel(l.status)}</span>
            <span class="badge ${getPrioritasClass(l.prioritas)}">${l.prioritas.toUpperCase()}</span>
          </div>
          <h3 style="font-size:15px;font-weight:700;margin-bottom:4px">${l.judul}</h3>
          <p style="font-size:13px;color:var(--text-2);margin-bottom:8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${l.deskripsi}</p>
          <div style="display:flex;flex-wrap:wrap;gap:10px;font-size:12px;color:var(--text-3)">
            <span>📍 ${l.lokasi.alamat}</span>
            <span>👤 Pelapor: ${user.nama}</span>
            <span>📅 ${formatDate(l.tanggal)}</span>
            <span>👍 ${l.dukungan} dukungan</span>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;min-width:160px">
          ${!isDone ? `<button class="btn btn-primary-solid btn-sm" onclick="openTindakLanjutModal(${l.id})">🔧 Tindak Lanjut</button>` : ''}
          <button class="btn btn-ghost btn-sm" onclick="showLaporanDetail(${l.id})">👁 Lihat Detail</button>
          ${isDone && l.buktiFoto.length > 0 ? `<span style="font-size:11px;color:var(--success)">✅ Bukti sudah diunggah</span>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');
}

// ---- TINDAK LANJUT PAGE ----
function renderTindakLanjut(container) {
  const opdId = getOPDIdForUser();
  const aktif = LAPORAN_DB.filter(l => l.opdId === opdId && l.status === 'diteruskan');

  container.innerHTML = `
    <div class="page-header animate-in">
      <h1>🔧 Tindak Lanjut Laporan</h1>
      <p>Proses tindak lanjut dan unggah bukti penyelesaian.</p>
    </div>
    <div id="tindak-lanjut-list" class="animate-in animate-in-delay-1">
      ${aktif.length ? aktif.map(l => renderTindakLanjutCard(l)).join('') : emptyState('✅','Semua Selesai','Tidak ada laporan yang perlu ditindaklanjuti.')}
    </div>
  `;
}

function renderTindakLanjutCard(l) {
  const kat = getKategori(l.kategoriId);
  return `
  <div class="card animate-in" style="margin-bottom:16px">
    <div style="display:flex;align-items:start;gap:16px;flex-wrap:wrap">
      <div style="font-size:40px;width:60px;height:60px;background:var(--bg-3);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${kat.icon}</div>
      <div style="flex:1;min-width:200px">
        <div style="font-size:12px;font-family:monospace;color:var(--text-3);margin-bottom:4px">${l.tiket}</div>
        <div style="font-size:16px;font-weight:700;margin-bottom:6px">${l.judul}</div>
        <div style="font-size:13px;color:var(--text-2);margin-bottom:10px">${l.deskripsi}</div>
        <div class="timeline" style="margin-top:8px">
          ${l.timeline.map(t=>`
            <div class="timeline-item">
              <div class="timeline-dot" style="background:${t.color}20;color:${t.color};width:28px;height:28px;font-size:12px">${t.icon}</div>
              <div class="timeline-body" style="padding-bottom:12px">
                <div class="timeline-title" style="font-size:12px">${t.keterangan}</div>
                <div class="timeline-meta">${formatDateTime(t.tanggal)}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;min-width:180px">
        <button class="btn btn-primary-solid" onclick="openTindakLanjutModal(${l.id})">🔧 Update & Unggah Bukti</button>
        <button class="btn btn-ghost btn-sm" onclick="showLaporanDetail(${l.id})">👁 Detail Lengkap</button>
      </div>
    </div>
  </div>`;
}

function openTindakLanjutModal(laporanId) {
  const l = LAPORAN_DB.find(x => x.id === laporanId);
  openModal('🔧 Tindak Lanjut & Unggah Bukti', `
    <div style="background:var(--bg-3);border-radius:var(--radius);padding:12px;margin-bottom:16px">
      <div style="font-weight:700">${l.judul}</div>
      <div style="font-size:12px;color:var(--text-2)">${l.tiket}</div>
    </div>
    <div class="form-group">
      <label>Update Keterangan Tindak Lanjut *</label>
      <textarea id="tl-keterangan" placeholder="Jelaskan tindakan yang sudah dilakukan..." style="min-height:100px"></textarea>
    </div>
    <div class="form-group">
      <label>Bukti Penyelesaian (Foto)</label>
      <div class="file-upload-zone" onclick="document.getElementById('bukti-input').click()" style="padding:20px">
        <div style="font-size:24px;margin-bottom:6px">📸</div>
        <div style="font-size:13px;color:var(--text-2)">Klik untuk pilih foto bukti</div>
      </div>
      <input type="file" id="bukti-input" accept="image/*" multiple style="display:none" onchange="handleBuktiSelect(event)" />
      <div id="bukti-preview" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px"></div>
    </div>
    <div class="form-group">
      <label>Tandai sebagai Selesai?</label>
      <label class="checkbox-label">
        <input type="checkbox" id="tl-selesai" onchange="toggleSelesaiNote(this)" />
        <span>Laporan telah selesai ditangani sepenuhnya</span>
      </label>
    </div>
    <div id="selesai-note" class="hidden" style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius);padding:12px;margin-bottom:12px">
      <p style="font-size:13px;color:var(--success)">✅ Laporan akan ditandai SELESAI. Warga akan mendapat notifikasi dan diminta mengisi survei kepuasan.</p>
    </div>
    <div class="form-actions">
      <button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-primary-solid" onclick="simpanTindakLanjut(${laporanId})">💾 Simpan Update</button>
    </div>
  `);
  window._buktiFotoTL = [];
}

function toggleSelesaiNote(cb) {
  document.getElementById('selesai-note').classList.toggle('hidden', !cb.checked);
}

function handleBuktiSelect(e) {
  const files = Array.from(e.target.files);
  const preview = document.getElementById('bukti-preview');
  files.forEach(f => {
    const reader = new FileReader();
    reader.onload = ev => {
      window._buktiFotoTL = window._buktiFotoTL || [];
      window._buktiFotoTL.push(ev.target.result);
      preview.innerHTML = (window._buktiFotoTL || []).map((src,i)=>`
        <div style="width:70px;height:70px;border-radius:8px;overflow:hidden;border:1px solid var(--card-border)">
          <img src="${src}" style="width:100%;height:100%;object-fit:cover" />
        </div>`).join('');
    };
    reader.readAsDataURL(f);
  });
}

function simpanTindakLanjut(laporanId) {
  const ket = document.getElementById('tl-keterangan').value.trim();
  const isSelesai = document.getElementById('tl-selesai').checked;
  if (!ket) { showToast('warning','Keterangan Kosong','Isi keterangan tindak lanjut.'); return; }

  const l = LAPORAN_DB.find(x => x.id === laporanId);
  const newStatus = isSelesai ? 'selesai' : 'diteruskan';

  if (isSelesai) {
    l.status = 'selesai';
    l.buktiFoto = window._buktiFotoTL || ['✅'];
    l.timeline.push({ status:'selesai', tanggal: new Date().toISOString(), keterangan: ket, icon:'🎉', color:'#10B981' });

    // Notif ke warga
    NOTIFIKASI_DB.push({ id: NOTIFIKASI_DB.length+1, userId: l.userId, judul:'Laporan Selesai! 🎉', pesan:`Laporan ${l.tiket} telah diselesaikan. Kami mohon Anda mengisi survei kepuasan.`, tanggal: new Date().toISOString(), dibaca:false, type:'success', laporanId });

    showToast('success','Laporan Diselesaikan! 🎉','Warga akan mendapat notifikasi dan diundang survei kepuasan.');
  } else {
    l.timeline.push({ status:'diteruskan', tanggal: new Date().toISOString(), keterangan: ket, icon:'🔧', color:'#8B5CF6' });
    showToast('success','Update Tersimpan','Keterangan tindak lanjut berhasil disimpan.');
  }

  l.tanggalUpdate = new Date().toISOString();
  closeModal();
  updateNotifBadge();
  setTimeout(() => navigateTo('laporan-opd'), 500);
}
