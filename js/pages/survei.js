// =============================================
// Survei Kepuasan Page
// =============================================
let selectedRating = 0;
let selectedLaporanId = null;

function renderSurvei(container) {
  const selesai = LAPORAN_DB.filter(l => l.userId === currentUser.id && l.status === 'selesai' && !l.survei);
  const sudahSurvei = SURVEI_DB.filter(s => {
    const l = LAPORAN_DB.find(x => x.id === s.laporanId);
    return l && l.userId === currentUser.id;
  });

  selectedRating = 0;
  selectedLaporanId = selesai.length > 0 ? selesai[0].id : null;

  container.innerHTML = `
    <div class="page-header animate-in">
      <h1>⭐ Survei Kepuasan</h1>
      <p>Berikan penilaian untuk laporan yang telah diselesaikan.</p>
    </div>

    <div class="grid-2 animate-in animate-in-delay-1" style="align-items:start;gap:20px">
      <!-- Survei Form -->
      <div>
        ${selesai.length > 0 ? `
        <div class="card" style="margin-bottom:16px">
          <div class="card-header"><div class="card-title">📝 Isi Survei</div></div>

          ${selesai.length > 1 ? `
          <div class="form-group">
            <label>Pilih Laporan</label>
            <select id="survei-laporan-select" onchange="piliSurveiLaporan(this.value)">
              ${selesai.map(l=>`<option value="${l.id}">${l.tiket} — ${l.judul}</option>`).join('')}
            </select>
          </div>` : `<div style="background:var(--bg-3);border-radius:10px;padding:12px;margin-bottom:16px">
            <div style="font-size:12px;color:var(--text-3)">Laporan</div>
            <div style="font-weight:700">${selesai[0].tiket} — ${selesai[0].judul}</div>
          </div>`}

          <div id="survei-laporan-preview" style="margin-bottom:20px"></div>

          <div class="form-group">
            <label style="font-size:14px;margin-bottom:12px;display:block;text-align:center">Seberapa puas Anda dengan penanganan laporan ini?</label>
            <div class="star-rating" id="star-rating" style="justify-content:center">
              ${[1,2,3,4,5].map(r=>`<span class="star" id="star-${r}" onclick="setRating(${r})" onmouseover="hoverRating(${r})" onmouseout="resetHover()">⭐</span>`).join('')}
            </div>
            <div id="rating-label" style="text-align:center;margin-top:8px;font-size:13px;color:var(--text-3);min-height:20px"></div>
          </div>

          <div class="form-group">
            <label>Komentar / Masukan (opsional)</label>
            <textarea id="survei-komentar" placeholder="Berikan komentar atau saran untuk peningkatan layanan..." style="min-height:100px"></textarea>
          </div>

          <div style="margin-bottom:16px">
            <label style="font-size:13px;font-weight:600;display:block;margin-bottom:10px">Aspek Kepuasan</label>
            <div style="display:grid;gap:8px">
              ${['Kecepatan Respon','Kualitas Penanganan','Komunikasi Petugas','Hasil Akhir'].map(a=>`
              <label class="checkbox-label" style="background:var(--bg-3);padding:10px 14px;border-radius:8px;border:1px solid var(--card-border)">
                <input type="checkbox" name="aspek" value="${a}" /> ${a}
              </label>`).join('')}
            </div>
          </div>

          <button class="btn btn-primary-solid btn-full btn-lg" onclick="kirimSurvei()">⭐ Kirim Survei</button>
        </div>` : `
        <div class="card">
          <div class="empty-state">
            <div class="empty-state-icon">✅</div>
            <h3>Semua Survei Terisi</h3>
            <p>Tidak ada laporan selesai yang memerlukan survei saat ini. Terima kasih atas partisipasi Anda!</p>
          </div>
        </div>`}
      </div>

      <!-- Riwayat Survei -->
      <div>
        <div class="card">
          <div class="card-header"><div class="card-title">📊 Riwayat Survei Saya</div></div>
          ${sudahSurvei.length ? sudahSurvei.map(s => {
            const l = LAPORAN_DB.find(x=>x.id===s.laporanId);
            return `<div style="background:var(--bg-3);border-radius:12px;padding:14px;margin-bottom:12px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                <div style="font-weight:700;font-size:14px">${l?l.judul:'Laporan'}</div>
                <div style="font-size:20px">${'⭐'.repeat(s.rating)}</div>
              </div>
              <div style="font-size:11px;color:var(--text-3);margin-bottom:6px">${l?l.tiket:''} · ${formatDate(s.tanggal)}</div>
              ${s.komentar ? `<p style="font-size:13px;color:var(--text-2);line-height:1.6;font-style:italic">"${s.komentar}"</p>` : ''}
            </div>`;
          }).join('') : emptyState('⭐','Belum Ada Survei','Survei akan muncul setelah laporan Anda selesai ditangani.')}
        </div>

        <!-- Info Card -->
        <div class="card" style="margin-top:16px;background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(14,165,233,0.1));border-color:rgba(99,102,241,0.2)">
          <div style="font-size:20px;margin-bottom:10px">💡</div>
          <h3 style="font-size:15px;font-weight:700;margin-bottom:8px">Mengapa Survei Penting?</h3>
          <p style="font-size:13px;color:var(--text-2);line-height:1.7">Penilaian Anda membantu pemerintah kota meningkatkan kualitas pelayanan publik. Setiap masukan adalah bahan bakar perbaikan sistem pelaporan yang lebih baik.</p>
        </div>
      </div>
    </div>
  `;

  if (selesai.length > 0) {
    renderSurveiLaporanPreview(selesai[0]);
  }
}

function piliSurveiLaporan(id) {
  selectedLaporanId = parseInt(id);
  const l = LAPORAN_DB.find(x => x.id === selectedLaporanId);
  renderSurveiLaporanPreview(l);
}

function renderSurveiLaporanPreview(l) {
  const kat = getKategori(l.kategoriId);
  const el = document.getElementById('survei-laporan-preview');
  if (!el) return;
  el.innerHTML = `<div style="background:var(--bg-3);border-radius:10px;padding:12px;display:flex;gap:10px;align-items:center">
    <div style="font-size:28px">${kat.icon}</div>
    <div>
      <div style="font-weight:700;font-size:13px">${l.judul}</div>
      <div style="font-size:11px;color:var(--text-3)">${kat.nama} · Diselesaikan ${timeAgo(l.tanggalUpdate)}</div>
    </div>
  </div>`;
}

const ratingLabels = { 1:'😞 Sangat Tidak Puas', 2:'😕 Tidak Puas', 3:'😐 Cukup Puas', 4:'😊 Puas', 5:'🤩 Sangat Puas!' };

function setRating(r) {
  selectedRating = r;
  updateStars(r);
  document.getElementById('rating-label').textContent = ratingLabels[r] || '';
  document.getElementById('rating-label').style.color = r >= 4 ? 'var(--success)' : r >= 3 ? 'var(--warning)' : 'var(--danger)';
}

function hoverRating(r) { updateStars(r, true); }
function resetHover() { updateStars(selectedRating); }

function updateStars(active, isHover=false) {
  [1,2,3,4,5].forEach(i => {
    const star = document.getElementById('star-' + i);
    if (!star) return;
    star.style.filter = i <= active ? 'none' : 'grayscale(1) opacity(0.3)';
    star.style.transform = i <= active ? 'scale(1.2)' : 'scale(1)';
  });
}

function kirimSurvei() {
  if (!selectedRating) { showToast('warning','Pilih Rating','Klik bintang untuk memberikan penilaian.'); return; }
  if (!selectedLaporanId) { showToast('error','Error','Pilih laporan terlebih dahulu.'); return; }

  const komentar = document.getElementById('survei-komentar').value.trim();
  SURVEI_DB.push({
    laporanId: selectedLaporanId,
    userId: currentUser.id,
    rating: selectedRating,
    komentar,
    tanggal: new Date().toISOString(),
  });

  const l = LAPORAN_DB.find(x => x.id === selectedLaporanId);
  if (l) l.survei = true;

  showToast('success','Survei Terkirim! ⭐',`Terima kasih atas penilaian ${selectedRating} bintang Anda!`, 4000);
  selectedRating = 0;
  selectedLaporanId = null;
  setTimeout(() => navigateTo('survei'), 800);
}
