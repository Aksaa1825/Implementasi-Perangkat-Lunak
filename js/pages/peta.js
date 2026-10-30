// =============================================
// Peta Sebaran Page — Google Maps Embed
// Pusat: Pekanbaru, Riau (0.4684645, 101.4452828)
// =============================================

// Koordinat pusat kota Pekanbaru
const MAP_CENTER_LAT = 0.4684645;
const MAP_CENTER_LNG = 101.4452828;
const MAP_DEFAULT_ZOOM = 14;

function renderPeta(container) {
  container.innerHTML = `
    <div class="page-header animate-in">
      <h1>🗺️ Peta Sebaran Laporan</h1>
      <p>Visualisasi distribusi laporan warga di wilayah Kota Pekanbaru.</p>
    </div>

    <div class="filter-bar animate-in animate-in-delay-1">
      <select id="peta-filter-status" onchange="updateMapPins()">
        <option value="">Semua Status</option>
        <option value="menunggu">Menunggu</option>
        <option value="diproses">Diproses</option>
        <option value="diteruskan">Diteruskan</option>
        <option value="selesai">Selesai</option>
        <option value="ditolak">Ditolak</option>
      </select>
      <select id="peta-filter-kat" onchange="updateMapPins()">
        <option value="">Semua Kategori</option>
        ${KATEGORIS.map(k=>`<option value="${k.id}">${k.icon} ${k.nama}</option>`).join('')}
      </select>
      <button class="btn btn-ghost" onclick="resetMapGmaps()">🎯 Reset Peta</button>
      <button class="btn btn-ghost" onclick="openFullMap()">🔗 Buka Google Maps</button>
    </div>

    <div class="map-legend animate-in animate-in-delay-2">
      <strong style="font-size:12px;color:var(--text-2)">LEGENDA:</strong>
      <div class="legend-item"><div class="legend-dot" style="background:#F59E0B"></div>Menunggu</div>
      <div class="legend-item"><div class="legend-dot" style="background:#3B82F6"></div>Diproses</div>
      <div class="legend-item"><div class="legend-dot" style="background:#8B5CF6"></div>Diteruskan</div>
      <div class="legend-item"><div class="legend-dot" style="background:#10B981"></div>Selesai</div>
      <div class="legend-item"><div class="legend-dot" style="background:#EF4444"></div>Ditolak</div>
    </div>

    <!-- Map wrapper with pin overlay -->
    <div id="map-container" class="animate-in animate-in-delay-3" style="position:relative;">
      <!-- Google Maps Embed iframe -->
      <iframe
        id="gmaps-iframe"
        width="100%"
        height="100%"
        style="border:0;display:block;border-radius:var(--radius-lg);"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
        src="https://maps.google.com/maps?q=${MAP_CENTER_LAT},${MAP_CENTER_LNG}&z=${MAP_DEFAULT_ZOOM}&output=embed&hl=id">
      </iframe>

      <!-- Custom pin overlay -->
      <div id="map-pins-overlay" style="
        position:absolute; inset:0; pointer-events:none;
        border-radius:var(--radius-lg); overflow:hidden;
      "></div>

      <!-- Map info panel (bottom-right) -->
      <div id="map-info-panel" style="
        position:absolute; bottom:14px; left:14px;
        background:var(--card); border:1px solid var(--card-border);
        border-radius:var(--radius-lg); padding:12px 16px;
        backdrop-filter:blur(18px); pointer-events:all;
        min-width:200px; box-shadow:var(--shadow-lg);
        z-index:10;
      ">
        <div style="font-size:11px;font-weight:800;color:var(--text-3);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">
          📍 Kota Pekanbaru, Riau
        </div>
        <div id="map-laporan-list" style="display:flex;flex-direction:column;gap:6px;max-height:220px;overflow-y:auto;"></div>
      </div>
    </div>

    <!-- Stat cards kategori -->
    <div class="grid-4 animate-in animate-in-delay-4" style="margin-top:20px">
      ${KATEGORIS.map(k => {
        const cnt = LAPORAN_DB.filter(l=>l.kategoriId===k.id).length;
        return `<div class="stat-card" style="cursor:default">
          <div class="stat-icon" style="background:${k.color}20;color:${k.color}">${k.icon}</div>
          <div class="stat-body">
            <div class="stat-value" style="color:${k.color};font-size:22px">${cnt}</div>
            <div class="stat-label" style="font-size:12px">${k.nama}</div>
          </div>
        </div>`;
      }).join('')}
    </div>
  `;

  // Render laporan list panel
  renderMapLaporanList(LAPORAN_DB);
}

// =============================================
// Warna & label status
// =============================================
function getPinColor(status) {
  const map = {
    menunggu:'#F59E0B', diproses:'#3B82F6',
    diteruskan:'#8B5CF6', selesai:'#10B981', ditolak:'#EF4444'
  };
  return map[status] || '#94A3B8';
}

// =============================================
// Render daftar laporan di panel kiri peta
// =============================================
function renderMapLaporanList(laporan) {
  const el = document.getElementById('map-laporan-list');
  if (!el) return;

  if (!laporan.length) {
    el.innerHTML = `<div style="font-size:12px;color:var(--text-3);text-align:center;padding:10px">Tidak ada laporan</div>`;
    return;
  }

  el.innerHTML = laporan.map(l => {
    const kat = getKategori(l.kategoriId);
    const color = getPinColor(l.status);
    return `
      <div onclick="showLaporanOnMap(${l.id})" style="
        display:flex;align-items:center;gap:8px;
        padding:7px 10px;border-radius:9px;
        background:var(--bg-4);border:1px solid var(--card-border);
        cursor:pointer;transition:all 0.18s;pointer-events:all;
      " onmouseover="this.style.background='var(--bg-5)';this.style.borderColor='${color}'"
         onmouseout="this.style.background='var(--bg-4)';this.style.borderColor='var(--card-border)'">
        <div style="
          width:10px;height:10px;border-radius:50%;flex-shrink:0;
          background:${color};box-shadow:0 0 8px ${color}88;
        "></div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:11px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${kat.icon} ${l.judul}</div>
          <div style="font-size:10px;color:var(--text-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">📍 ${l.lokasi.alamat}</div>
        </div>
      </div>
    `;
  }).join('');
}

// =============================================
// Klik laporan → buka Google Maps di koordinat tsb + tampilkan detail
// =============================================
function showLaporanOnMap(id) {
  const l = LAPORAN_DB.find(x => x.id === id);
  if (!l) return;

  // Update iframe ke koordinat laporan
  const iframe = document.getElementById('gmaps-iframe');
  if (iframe) {
    iframe.src = `https://maps.google.com/maps?q=${l.lokasi.lat},${l.lokasi.lng}&z=17&output=embed&hl=id`;
  }

  // Tampilkan detail laporan di modal
  showLaporanDetail(id);
}

// =============================================
// Filter
// =============================================
function updateMapPins() {
  const status = document.getElementById('peta-filter-status').value;
  const kat    = document.getElementById('peta-filter-kat').value;
  let filtered = [...LAPORAN_DB];
  if (status) filtered = filtered.filter(l => l.status === status);
  if (kat)    filtered = filtered.filter(l => l.kategoriId === parseInt(kat));

  renderMapLaporanList(filtered);

  // Update iframe ke pusat kota jika filter berubah
  const iframe = document.getElementById('gmaps-iframe');
  if (iframe) {
    if (filtered.length === 1) {
      iframe.src = `https://maps.google.com/maps?q=${filtered[0].lokasi.lat},${filtered[0].lokasi.lng}&z=16&output=embed&hl=id`;
    } else {
      resetIframeSrc();
    }
  }
}

// =============================================
// Reset
// =============================================
function resetMapGmaps() {
  document.getElementById('peta-filter-status').value = '';
  document.getElementById('peta-filter-kat').value   = '';
  resetIframeSrc();
  renderMapLaporanList(LAPORAN_DB);
}

function resetIframeSrc() {
  const iframe = document.getElementById('gmaps-iframe');
  if (iframe) {
    iframe.src = `https://maps.google.com/maps?q=${MAP_CENTER_LAT},${MAP_CENTER_LNG}&z=${MAP_DEFAULT_ZOOM}&output=embed&hl=id`;
  }
}

// =============================================
// Buka Google Maps di tab baru
// =============================================
function openFullMap() {
  window.open(
    `https://www.google.com/maps/@${MAP_CENTER_LAT},${MAP_CENTER_LNG},${MAP_DEFAULT_ZOOM}z`,
    '_blank'
  );
}
