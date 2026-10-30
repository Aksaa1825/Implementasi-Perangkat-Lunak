// =============================================
// LaporWarga — Mock Data
// =============================================

const USERS = [
  { id: 1, nama: 'Budi Santoso', email: 'budi@email.com', password: '12345678', role: 'warga', nik: '3201010101800001', phone: '08123456789', alamat: 'Jl. Merdeka No. 12, Kec. Bogor Tengah', avatar: 'B' },
  { id: 2, nama: 'Admin Diskominfo', email: 'admin@diskominfo.go.id', password: '12345678', role: 'admin', phone: '0251-123456', alamat: 'Kantor Diskominfo Kota Bogor', avatar: 'A' },
  { id: 3, nama: 'Petugas DLH', email: 'petugas@dlh.go.id', password: '12345678', role: 'opd', opd: 'Dinas Lingkungan Hidup', phone: '0251-234567', alamat: 'Kantor DLH Kota Bogor', avatar: 'P' },
  { id: 4, nama: 'Ir. Surya Wijaya', email: 'pimpinan@bogor.go.id', password: '12345678', role: 'pimpinan', jabatan: 'Walikota Bogor', phone: '0251-345678', alamat: 'Balaikota Bogor', avatar: 'S' },
  { id: 5, nama: 'Siti Rahayu', email: 'siti@email.com', password: '12345678', role: 'warga', nik: '3201010102850002', phone: '08234567890', alamat: 'Jl. Pahlawan No. 5, Kec. Bogor Utara', avatar: 'S' },
];

const KATEGORIS = [
  { id: 1, nama: 'Jalan & Infrastruktur', icon: '🛣️', opd: 'Dinas PUPR', color: '#F59E0B' },
  { id: 2, nama: 'Sampah & Kebersihan', icon: '🗑️', opd: 'Dinas Lingkungan Hidup', color: '#10B981' },
  { id: 3, nama: 'Lampu Jalan', icon: '💡', opd: 'Dinas Perhubungan', color: '#F59E0B' },
  { id: 4, nama: 'Drainase & Banjir', icon: '🌊', opd: 'Dinas PUPR', color: '#3B82F6' },
  { id: 5, nama: 'Pohon & Taman', icon: '🌳', opd: 'Dinas Pertamanan', color: '#10B981' },
  { id: 6, nama: 'Ketertiban Umum', icon: '🚔', opd: 'Satpol PP', color: '#EF4444' },
  { id: 7, nama: 'Air Bersih', icon: '💧', opd: 'PDAM Tirta Pakuan', color: '#0EA5E9' },
  { id: 8, nama: 'Fasilitas Umum', icon: '🏗️', opd: 'Dinas PUPR', color: '#8B5CF6' },
];

const OPDS = [
  { id: 1, nama: 'Dinas PUPR', kepala: 'Dr. Ridwan Hidayat', email: 'pupr@bogor.go.id', phone: '0251-345001', kategori: [1, 4, 8] },
  { id: 2, nama: 'Dinas Lingkungan Hidup', kepala: 'Ir. Maya Sari', email: 'dlh@bogor.go.id', phone: '0251-345002', kategori: [2] },
  { id: 3, nama: 'Dinas Perhubungan', kepala: 'Drs. Anton Nugroho', email: 'dishub@bogor.go.id', phone: '0251-345003', kategori: [3] },
  { id: 4, nama: 'Dinas Pertamanan', kepala: 'Hj. Rina Wati', email: 'pertamanan@bogor.go.id', phone: '0251-345004', kategori: [5] },
  { id: 5, nama: 'Satpol PP', kepala: 'Kol. Bambang Sutrisno', email: 'satpol@bogor.go.id', phone: '0251-345005', kategori: [6] },
  { id: 6, nama: 'PDAM Tirta Pakuan', kepala: 'Ir. Dewi Kusuma', email: 'pdam@bogor.go.id', phone: '0251-345006', kategori: [7] },
];

let LAPORAN_DB = [
  {
    id: 1, tiket: 'LW-2024-0001', judul: 'Jalan Berlubang Berbahaya',
    deskripsi: 'Terdapat lubang besar di Jl. Sudirman depan pasar yang sangat membahayakan pengendara motor. Lubang berukuran sekitar 50x50 cm dengan kedalaman 20 cm.',
    kategoriId: 1, status: 'selesai', prioritas: 'tinggi',
    lokasi: { lat: 0.5065, lng: 101.4475, alamat: 'Jl. Sudirman, Pekanbaru' },
    userId: 1, foto: ['🛣️'],
    tanggal: '2024-10-01T08:30:00', tanggalUpdate: '2024-10-15T14:00:00',
    opdId: 1, petugas: 'Petugas DLH', komentar: 3, dukungan: 24,
    timeline: [
      { status: 'menunggu', tanggal: '2024-10-01T08:30:00', keterangan: 'Laporan diterima, nomor tiket dibuat', icon: '📨', color: '#F59E0B' },
      { status: 'diproses', tanggal: '2024-10-03T09:00:00', keterangan: 'Laporan diverifikasi dan diteruskan ke Dinas PUPR', icon: '✅', color: '#3B82F6' },
      { status: 'diteruskan', tanggal: '2024-10-05T10:00:00', keterangan: 'Petugas PUPR dijadwalkan untuk perbaikan', icon: '🏗️', color: '#8B5CF6' },
      { status: 'selesai', tanggal: '2024-10-15T14:00:00', keterangan: 'Perbaikan jalan selesai dilaksanakan', icon: '🎉', color: '#10B981' },
    ],
    buktiFoto: ['✅'], rating: 5, survei: true,
  },
  {
    id: 2, tiket: 'LW-2024-0002', judul: 'Tumpukan Sampah Tidak Terangkut',
    deskripsi: 'Sampah di TPS Jl. Ahmad Yani sudah menumpuk selama 3 hari tidak diangkut. Menimbulkan bau tidak sedap dan mengundang lalat.',
    kategoriId: 2, status: 'diteruskan', prioritas: 'sedang',
    lokasi: { lat: 0.4960, lng: 101.4380, alamat: 'Jl. Ahmad Yani, Pekanbaru' },
    userId: 5, foto: ['🗑️'],
    tanggal: '2024-10-10T10:00:00', tanggalUpdate: '2024-10-13T11:00:00',
    opdId: 2, petugas: 'Petugas DLH', komentar: 5, dukungan: 47,
    timeline: [
      { status: 'menunggu', tanggal: '2024-10-10T10:00:00', keterangan: 'Laporan diterima', icon: '📨', color: '#F59E0B' },
      { status: 'diproses', tanggal: '2024-10-11T08:00:00', keterangan: 'Diverifikasi admin, diteruskan ke DLH', icon: '✅', color: '#3B82F6' },
      { status: 'diteruskan', tanggal: '2024-10-13T11:00:00', keterangan: 'Petugas DLH sedang menangani lokasi', icon: '🚚', color: '#8B5CF6' },
    ],
    buktiFoto: [], rating: null, survei: false,
  },
  {
    id: 3, tiket: 'LW-2024-0003', judul: 'Lampu Jalan Mati Sepekan',
    deskripsi: 'Lampu jalan di Jl. Pajajaran RT 02/05 sudah mati selama satu minggu. Sangat gelap dan rawan terjadi kecelakaan atau kejahatan di malam hari.',
    kategoriId: 3, status: 'menunggu', prioritas: 'tinggi',
    lokasi: { lat: 0.4820, lng: 101.4290, alamat: 'Jl. Harapan Raya, Pekanbaru' },
    userId: 1, foto: ['💡'],
    tanggal: '2024-10-15T19:30:00', tanggalUpdate: '2024-10-15T19:30:00',
    opdId: null, petugas: null, komentar: 1, dukungan: 12,
    timeline: [
      { status: 'menunggu', tanggal: '2024-10-15T19:30:00', keterangan: 'Laporan diterima, menunggu verifikasi admin', icon: '📨', color: '#F59E0B' },
    ],
    buktiFoto: [], rating: null, survei: false,
  },
  {
    id: 4, tiket: 'LW-2024-0004', judul: 'Gorong-gorong Tersumbat Menyebabkan Banjir',
    deskripsi: 'Gorong-gorong di pertigaan Jl. Raya Tajur tersumbat sampah, setiap hujan lebat menyebabkan banjir setinggi 30-40 cm.',
    kategoriId: 4, status: 'diproses', prioritas: 'tinggi',
    lokasi: { lat: 0.4580, lng: 101.4620, alamat: 'Jl. Raya Rumbai, Pekanbaru' },
    userId: 5, foto: ['🌊'],
    tanggal: '2024-10-08T14:00:00', tanggalUpdate: '2024-10-10T09:00:00',
    opdId: 1, petugas: null, komentar: 8, dukungan: 89,
    timeline: [
      { status: 'menunggu', tanggal: '2024-10-08T14:00:00', keterangan: 'Laporan diterima', icon: '📨', color: '#F59E0B' },
      { status: 'diproses', tanggal: '2024-10-10T09:00:00', keterangan: 'Sedang diverifikasi tim admin Diskominfo', icon: '🔍', color: '#3B82F6' },
    ],
    buktiFoto: [], rating: null, survei: false,
  },
  {
    id: 5, tiket: 'LW-2024-0005', judul: 'Pohon Tumbang Menghalangi Jalan',
    deskripsi: 'Pohon besar tumbang akibat angin kencang kemarin malam. Menutup setengah badan jalan Jl. Sempur dan menyebabkan kemacetan panjang.',
    kategoriId: 5, status: 'selesai', prioritas: 'darurat',
    lokasi: { lat: 0.4720, lng: 101.4410, alamat: 'Jl. Nangka, Pekanbaru' },
    userId: 1, foto: ['🌳'],
    tanggal: '2024-10-12T06:00:00', tanggalUpdate: '2024-10-12T16:00:00',
    opdId: 4, petugas: 'Petugas Pertamanan', komentar: 2, dukungan: 67,
    timeline: [
      { status: 'menunggu', tanggal: '2024-10-12T06:00:00', keterangan: 'Laporan darurat diterima', icon: '🚨', color: '#EF4444' },
      { status: 'diproses', tanggal: '2024-10-12T07:00:00', keterangan: 'Verifikasi cepat — status darurat', icon: '✅', color: '#3B82F6' },
      { status: 'diteruskan', tanggal: '2024-10-12T08:00:00', keterangan: 'Tim Pertamanan dikerahkan', icon: '🌳', color: '#8B5CF6' },
      { status: 'selesai', tanggal: '2024-10-12T16:00:00', keterangan: 'Pohon berhasil dipindahkan, jalan sudah lancar', icon: '🎉', color: '#10B981' },
    ],
    buktiFoto: ['✅'], rating: 4, survei: true,
  },
  {
    id: 6, tiket: 'LW-2024-0006', judul: 'PKL Liar Mengganggu Trotoar',
    deskripsi: 'Pedagang kaki lima liar berjualan di trotoar Jl. Dewi Sartika menghalangi pejalan kaki dan penyandang disabilitas.',
    kategoriId: 6, status: 'ditolak', prioritas: 'rendah',
    lokasi: { lat: 0.4685, lng: 101.4453, alamat: 'Jl. Tuanku Tambusai, Pekanbaru' },
    userId: 5, foto: ['🚔'],
    tanggal: '2024-10-05T11:00:00', tanggalUpdate: '2024-10-06T09:00:00',
    opdId: null, petugas: null, komentar: 4, dukungan: 18,
    alasanTolak: 'Laporan duplikat — sudah ada laporan serupa (LW-2024-0003) yang sedang ditangani.',
    timeline: [
      { status: 'menunggu', tanggal: '2024-10-05T11:00:00', keterangan: 'Laporan diterima', icon: '📨', color: '#F59E0B' },
      { status: 'ditolak', tanggal: '2024-10-06T09:00:00', keterangan: 'Laporan ditolak: Duplikat dengan laporan sebelumnya', icon: '❌', color: '#EF4444' },
    ],
    buktiFoto: [], rating: null, survei: false,
  },
  {
    id: 7, tiket: 'LW-2024-0007', judul: 'Pipa Air PDAM Bocor',
    deskripsi: 'Pipa air PDAM bocor di Jl. Batutulis menyebabkan air menggenang di jalan dan pemborosan air bersih.',
    kategoriId: 7, status: 'diteruskan', prioritas: 'tinggi',
    lokasi: { lat: 0.4740, lng: 101.4530, alamat: 'Jl. Diponegoro, Pekanbaru' },
    userId: 1, foto: ['💧'],
    tanggal: '2024-10-14T07:30:00', tanggalUpdate: '2024-10-15T10:00:00',
    opdId: 6, petugas: 'Teknisi PDAM', komentar: 6, dukungan: 33,
    timeline: [
      { status: 'menunggu', tanggal: '2024-10-14T07:30:00', keterangan: 'Laporan diterima', icon: '📨', color: '#F59E0B' },
      { status: 'diproses', tanggal: '2024-10-14T09:00:00', keterangan: 'Verifikasi admin — diteruskan ke PDAM', icon: '✅', color: '#3B82F6' },
      { status: 'diteruskan', tanggal: '2024-10-15T10:00:00', keterangan: 'Tim PDAM sedang melakukan perbaikan', icon: '🔧', color: '#8B5CF6' },
    ],
    buktiFoto: [], rating: null, survei: false,
  },
];

let KOMENTAR_DB = [
  { id: 1, laporanId: 1, userId: 5, nama: 'Siti Rahayu', teks: 'Saya juga sering lewat jalan ini, sangat berbahaya!', tanggal: '2024-10-02T10:00:00', dukungan: 5 },
  { id: 2, laporanId: 1, userId: 2, nama: 'Admin Diskominfo', teks: 'Laporan sudah kami teruskan ke Dinas PUPR untuk ditindaklanjuti.', tanggal: '2024-10-03T09:00:00', dukungan: 3, official: true },
  { id: 3, laporanId: 1, userId: 1, nama: 'Budi Santoso', teks: 'Terima kasih atas responnya, semoga segera diperbaiki.', tanggal: '2024-10-03T11:00:00', dukungan: 1 },
  { id: 4, laporanId: 2, userId: 1, nama: 'Budi Santoso', teks: 'Betul, sudah 3 hari ini baunya sangat menyengat.', tanggal: '2024-10-10T12:00:00', dukungan: 8 },
  { id: 5, laporanId: 4, userId: 1, nama: 'Budi Santoso', teks: 'Banjirnya parah sekali, sampai masuk ke rumah warga!', tanggal: '2024-10-09T08:00:00', dukungan: 15 },
];

let NOTIFIKASI_DB = [
  { id: 1, userId: 1, judul: 'Laporan Selesai!', pesan: 'Laporan LW-2024-0001 tentang Jalan Berlubang telah diselesaikan.', tanggal: '2024-10-15T14:00:00', dibaca: false, type: 'success', laporanId: 1 },
  { id: 2, userId: 1, judul: 'Update Status Laporan', pesan: 'Laporan LW-2024-0007 telah diteruskan ke PDAM Tirta Pakuan.', tanggal: '2024-10-15T10:00:00', dibaca: false, type: 'info', laporanId: 7 },
  { id: 3, userId: 1, judul: 'Laporan Ditolak', pesan: 'Laporan LW-2024-0006 ditolak karena duplikat.', tanggal: '2024-10-06T09:00:00', dibaca: false, type: 'warning', laporanId: 6 },
  { id: 4, userId: 2, judul: 'Laporan Baru Masuk', pesan: 'Laporan LW-2024-0003 tentang Lampu Jalan menunggu verifikasi.', tanggal: '2024-10-15T19:30:00', dibaca: false, type: 'info', laporanId: 3 },
  { id: 5, userId: 3, judul: 'Disposisi Baru', pesan: 'Laporan LW-2024-0002 telah didisposisi ke Dinas Lingkungan Hidup.', tanggal: '2024-10-11T08:00:00', dibaca: true, type: 'info', laporanId: 2 },
];

let SURVEI_DB = [
  { laporanId: 1, userId: 1, rating: 5, komentar: 'Sangat puas! Respon cepat dan perbaikan berkualitas.', tanggal: '2024-10-15T15:00:00' },
  { laporanId: 5, userId: 1, rating: 4, komentar: 'Cukup cepat penanganannya, terima kasih.', tanggal: '2024-10-12T17:00:00' },
];

// =============================================
// HELPER FUNCTIONS
// =============================================
function getKategori(id) { return KATEGORIS.find(k => k.id === id) || {}; }
function getUser(id) { return USERS.find(u => u.id === id) || {}; }
function getOPD(id) { return OPDS.find(o => o.id === id) || {}; }

function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
function formatDateTime(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function timeAgo(iso) {
  if (!iso) return '';
  const now = new Date();
  const past = new Date(iso);
  const diff = Math.floor((now - past) / 1000);
  if (diff < 60) return 'baru saja';
  if (diff < 3600) return Math.floor(diff/60) + ' menit lalu';
  if (diff < 86400) return Math.floor(diff/3600) + ' jam lalu';
  return Math.floor(diff/86400) + ' hari lalu';
}

function getStatusLabel(s) {
  const map = { menunggu:'Menunggu Verifikasi', diproses:'Sedang Diproses', diteruskan:'Diteruskan ke OPD', selesai:'Selesai', ditolak:'Ditolak', duplikat:'Duplikat' };
  return map[s] || s;
}
function getStatusClass(s) {
  const map = { menunggu:'badge-menunggu', diproses:'badge-diproses', diteruskan:'badge-diteruskan', selesai:'badge-selesai', ditolak:'badge-ditolak', duplikat:'badge-duplikat' };
  return map[s] || '';
}
function getPrioritasClass(p) {
  const map = { darurat:'badge-ditolak', tinggi:'badge-diteruskan', sedang:'badge-diproses', rendah:'badge-duplikat' };
  return map[p] || '';
}

function generateTiket() {
  const n = LAPORAN_DB.length + 1;
  const year = new Date().getFullYear();
  return `LW-${year}-${String(n).padStart(4,'0')}`;
}

function getStatistik() {
  const total = LAPORAN_DB.length;
  const selesai = LAPORAN_DB.filter(l => l.status === 'selesai').length;
  const diproses = LAPORAN_DB.filter(l => l.status === 'diproses' || l.status === 'diteruskan').length;
  const menunggu = LAPORAN_DB.filter(l => l.status === 'menunggu').length;
  const ditolak = LAPORAN_DB.filter(l => l.status === 'ditolak').length;
  const totalDukungan = LAPORAN_DB.reduce((a,l) => a + l.dukungan, 0);
  const avgRating = SURVEI_DB.length ? (SURVEI_DB.reduce((a,s)=>a+s.rating,0)/SURVEI_DB.length).toFixed(1) : '-';

  const byKategori = KATEGORIS.map(k => ({
    ...k,
    count: LAPORAN_DB.filter(l => l.kategoriId === k.id).length
  })).sort((a,b) => b.count - a.count);

  const byStatus = [
    { label:'Menunggu', value: menunggu, color:'#F59E0B' },
    { label:'Diproses', value: diproses, color:'#3B82F6' },
    { label:'Selesai', value: selesai, color:'#10B981' },
    { label:'Ditolak', value: ditolak, color:'#EF4444' },
  ];

  return { total, selesai, diproses, menunggu, ditolak, totalDukungan, avgRating, byKategori, byStatus };
}
