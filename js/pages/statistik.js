// =============================================
// Statistik Page
// =============================================
function renderStatistik(container) {
  const stats = getStatistik();
  container.innerHTML = `
    <div class="page-header animate-in">
      <h1>📊 Dashboard Statistik</h1>
      <p>Analitik mendalam penanganan laporan warga kota.</p>
    </div>

    <div class="grid-4 animate-in animate-in-delay-1" style="margin-bottom:24px">
      ${statCard('📋','Total Laporan',stats.total,'Seluruh kategori','#6366F1','rgba(99,102,241,0.15)')}
      ${statCard('✅','Diselesaikan',stats.selesai,`${Math.round(stats.selesai/stats.total*100)}% tingkat penyelesaian`,'#10B981','rgba(16,185,129,0.15)')}
      ${statCard('⭐',stats.avgRating,'Rating Kepuasan','Rata-rata dari survei','#F59E0B','rgba(245,158,11,0.15)')}
      ${statCard('👍',stats.totalDukungan,'Total Dukungan','Dari warga aktif','#8B5CF6','rgba(139,92,246,0.15)')}
    </div>

    <div class="grid-2 animate-in animate-in-delay-2" style="margin-bottom:24px">
      <div class="card">
        <div class="card-header"><div class="card-title">📊 Distribusi Status Laporan</div></div>
        <div class="donut-wrap">
          ${renderDonut(stats.byStatus, stats.total)}
          <div style="flex:1">
            <div class="donut-legend" style="margin-bottom:16px">
              ${stats.byStatus.map(s=>`
                <div class="donut-legend-item">
                  <div class="donut-legend-color" style="background:${s.color}"></div>
                  <span style="flex:1">${s.label}</span>
                  <strong>${s.value}</strong>
                  <span style="color:var(--text-3);font-size:11px;width:32px;text-align:right">${Math.round(s.value/stats.total*100)}%</span>
                </div>
              `).join('')}
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${Math.round(stats.selesai/stats.total*100)}%"></div></div>
            <div style="font-size:12px;color:var(--text-2);margin-top:6px">Tingkat Penyelesaian: ${Math.round(stats.selesai/stats.total*100)}%</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">📋 Laporan per Kategori</div></div>
        <div class="chart-bar-wrap" id="cat-chart">
          ${stats.byKategori.map(k=>`
            <div class="chart-bar-item">
              <div class="chart-bar-label">${k.icon} ${k.nama}</div>
              <div class="chart-bar-track"><div class="chart-bar-fill" id="bar-${k.id}" style="width:0%;background:${k.color}" data-w="${k.count&&stats.total?(k.count/stats.total*100):0}"></div></div>
              <div class="chart-bar-val">${k.count}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="grid-2 animate-in animate-in-delay-3" style="margin-bottom:24px">
      <div class="card">
        <div class="card-header"><div class="card-title">🏢 Kinerja OPD</div></div>
        <div class="table-wrapper">
          <table>
            <thead><tr><th>OPD</th><th>Total</th><th>Selesai</th><th>Rate</th></tr></thead>
            <tbody>
            ${OPDS.map(o=>{
              const total = LAPORAN_DB.filter(l=>l.opdId===o.id).length;
              const done = LAPORAN_DB.filter(l=>l.opdId===o.id&&l.status==='selesai').length;
              const rate = total ? Math.round(done/total*100) : 0;
              return `<tr>
                <td style="font-weight:600;font-size:13px">${o.nama}</td>
                <td>${total}</td>
                <td style="color:var(--success)">${done}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div style="flex:1;height:6px;background:var(--bg-3);border-radius:99px;overflow:hidden">
                      <div style="width:${rate}%;height:100%;background:var(--success);border-radius:99px"></div>
                    </div>
                    <span style="font-size:12px;font-weight:700;color:var(--success)">${rate}%</span>
                  </div>
                </td>
              </tr>`;
            }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">⭐ Hasil Survei Kepuasan</div></div>
        ${SURVEI_DB.length ? `
          <div style="text-align:center;margin-bottom:20px">
            <div style="font-size:48px;font-weight:900;color:var(--warning)">${stats.avgRating}</div>
            <div style="font-size:24px;margin-bottom:4px">${'⭐'.repeat(Math.round(parseFloat(stats.avgRating)))}</div>
            <div style="color:var(--text-2);font-size:13px">dari ${SURVEI_DB.length} survei yang masuk</div>
          </div>
          ${[5,4,3,2,1].map(r=>{
            const cnt = SURVEI_DB.filter(s=>s.rating===r).length;
            const pct = SURVEI_DB.length ? cnt/SURVEI_DB.length*100 : 0;
            return `<div class="chart-bar-item" style="margin-bottom:6px">
              <div class="chart-bar-label" style="width:60px">${r} ${'⭐'}</div>
              <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${pct}%;background:#F59E0B"></div></div>
              <div class="chart-bar-val">${cnt}</div>
            </div>`;
          }).join('')}
          <div style="margin-top:16px;border-top:1px solid var(--card-border);padding-top:16px">
            ${SURVEI_DB.map(s=>{
              const l = LAPORAN_DB.find(x=>x.id===s.laporanId);
              return `<div style="margin-bottom:12px;background:var(--bg-3);border-radius:10px;padding:12px">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                  <strong style="font-size:12px">${l?l.judul:'Laporan'}</strong>
                  <span>${'⭐'.repeat(s.rating)}</span>
                </div>
                <p style="font-size:12px;color:var(--text-2)">${s.komentar}</p>
              </div>`;
            }).join('')}
          </div>
        ` : emptyState('⭐','Belum Ada Data Survei','Survei kepuasan belum tersedia.')}
      </div>
    </div>

    <div class="card animate-in animate-in-delay-4">
      <div class="card-header"><div class="card-title">📈 Prioritas Laporan</div></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;text-align:center">
        ${['darurat','tinggi','sedang','rendah'].map(p=>{
          const cnt = LAPORAN_DB.filter(l=>l.prioritas===p).length;
          const colors = {darurat:'#EF4444',tinggi:'#F59E0B',sedang:'#3B82F6',rendah:'#64748B'};
          return `<div style="background:${colors[p]}15;border:1px solid ${colors[p]}30;border-radius:12px;padding:16px">
            <div style="font-size:24px;font-weight:800;color:${colors[p]}">${cnt}</div>
            <div style="font-size:12px;font-weight:600;color:${colors[p]};text-transform:capitalize">${p}</div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;

  // Animate bar charts
  setTimeout(() => {
    document.querySelectorAll('.chart-bar-fill[data-w]').forEach(el => {
      el.style.width = el.dataset.w + '%';
    });
  }, 200);
}
