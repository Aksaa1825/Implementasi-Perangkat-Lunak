<?php require 'config.php'; need(); $me = user(); $role = $me['role']; $id = (int)($_GET['id'] ?? 0); $msg = '';
$l = q('SELECT l.*, k.nama kategori, o.nama opd, u.nama pelapor FROM laporan l JOIN kategori k ON k.id=l.kategori_id
  JOIN users u ON u.id=l.user_id LEFT JOIN opd o ON o.id=l.opd_id WHERE l.id=?', [$id])->fetch();
if (!$l) exit('Laporan tidak ditemukan');
if ($role == 'petugas' && $l['opd_id'] != $me['opd_id']) { http_response_code(403); exit('Akses ditolak'); }
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $a = $_POST['aksi'] ?? '';
  if ($a == 'dukung' && $role == 'warga') {
    if (q('SELECT 1 FROM dukungan WHERE laporan_id=? AND user_id=?', [$id,$me['id']])->fetch()) q('DELETE FROM dukungan WHERE laporan_id=? AND user_id=?', [$id,$me['id']]);
    else q('INSERT INTO dukungan VALUES(?,?)', [$id,$me['id']]);
  }
  if ($a == 'komentar' && trim($_POST['isi'] ?? '') !== '') q('INSERT INTO komentar(laporan_id,user_id,isi) VALUES(?,?,?)', [$id,$me['id'],trim($_POST['isi'])]);
  if ($a == 'disposisi' && $role == 'admin' && $l['status'] == 'menunggu') {
    $o = (int)$_POST['opd_id'];
    q('UPDATE laporan SET status="diteruskan", opd_id=?, catatan_admin=? WHERE id=?', [$o, trim($_POST['catatan']), $id]);
    notif($l['user_id'], $id, "Laporan {$l['no_tiket']} telah diverifikasi dan diteruskan ke OPD.");
    foreach (q('SELECT id FROM users WHERE role="petugas" AND opd_id=?', [$o]) as $p) notif($p['id'], $id, "Laporan baru {$l['no_tiket']} ditugaskan ke OPD Anda.");
  }
  if ($a == 'tolak' && $role == 'admin' && $l['status'] == 'menunggu') {
    $c = trim($_POST['catatan']); if (trim($_POST['duplikat']) !== '') $c = 'Digabung dengan laporan ' . trim($_POST['duplikat']) . '. ' . $c;
    q('UPDATE laporan SET status="ditolak", catatan_admin=? WHERE id=?', [$c, $id]);
    notif($l['user_id'], $id, "Laporan {$l['no_tiket']} ditolak / digabung. Lihat alasannya.");
  }
  if ($a == 'tindak' && $role == 'petugas' && in_array($l['status'], ['diteruskan','diproses'])) {
    $f = upload($_FILES['bukti'] ?? []); $selesai = isset($_POST['selesai']);
    if ($selesai && !$f) $msg = 'Penyelesaian wajib disertai foto bukti (jpg/png, maks 2 MB).';
    elseif (trim($_POST['keterangan']) === '') $msg = 'Keterangan wajib diisi.';
    else {
      q('INSERT INTO tindak_lanjut(laporan_id,user_id,keterangan,bukti) VALUES(?,?,?,?)', [$id,$me['id'],trim($_POST['keterangan']),$f]);
      q('UPDATE laporan SET status=? WHERE id=?', [$selesai ? 'selesai' : 'diproses', $id]);
      notif($l['user_id'], $id, $selesai ? "Laporan {$l['no_tiket']} selesai. Isi survei kepuasan." : "Laporan {$l['no_tiket']} sedang diproses.");
    }
  }
  if ($a == 'survei' && $role == 'warga' && $l['user_id'] == $me['id'] && $l['status'] == 'selesai')
    q('INSERT IGNORE INTO survei(laporan_id,rating,saran) VALUES(?,?,?)', [$id, max(1, min(5, (int)$_POST['rating'])), trim($_POST['saran'])]);
  if (!$msg) { header('Location: detail.php?id=' . $id); exit; }
}
$tl = q('SELECT t.*, u.nama FROM tindak_lanjut t JOIN users u ON u.id=t.user_id WHERE laporan_id=? ORDER BY t.id', [$id])->fetchAll();
$kom = q('SELECT c.*, u.nama FROM komentar c JOIN users u ON u.id=c.user_id WHERE laporan_id=? ORDER BY c.id', [$id])->fetchAll();
$dk = q('SELECT COUNT(*) c FROM dukungan WHERE laporan_id=?', [$id])->fetch()['c'];
$sdh = q('SELECT 1 FROM dukungan WHERE laporan_id=? AND user_id=?', [$id,$me['id']])->fetch();
$sv = q('SELECT * FROM survei WHERE laporan_id=?', [$id])->fetch();
$opds = q('SELECT * FROM opd ORDER BY nama')->fetchAll();
$judul = $l['no_tiket']; require 'header.php'; ?>
<?php if ($msg): ?><div class="err"><?= h($msg) ?></div><?php endif; ?>
<div class="card"><h1><?= h($l['judul']) ?></h1>
<p><span class="tag s-<?= $l['status'] ?>"><?= h($ST[$l['status']]) ?></span> <span class="mut"><?= h($l['no_tiket']) ?> · <?= h($l['kategori']) ?> · oleh <?= h($l['pelapor']) ?> · <?= h($l['created_at']) ?></span></p>
<p><?= nl2br(h($l['deskripsi'])) ?></p>
<?php if ($l['foto']) echo '<img class="foto" src="uploads/'.h($l['foto']).'" alt="Foto laporan">'; ?>
<?php if ($l['lat']) echo '<p class="mut">Lokasi: '.h($l['lat']).', '.h($l['lng']).' (<a target="_blank" href="https://www.openstreetmap.org/?mlat='.h($l['lat']).'&mlon='.h($l['lng']).'&zoom=17">lihat peta</a>)</p>'; ?>
<?php if ($l['opd']) echo '<p>Ditangani: <b>'.h($l['opd']).'</b></p>'; ?>
<?php if ($l['catatan_admin']) echo '<p class="mut">Catatan admin: '.h($l['catatan_admin']).'</p>'; ?>
<?php if ($role == 'warga'): ?><form method="post"><?= csrf() ?><input type="hidden" name="aksi" value="dukung"><button><?= $sdh ? 'Batal dukung' : 'Dukung laporan ini' ?></button> <span class="mut"><?= $dk ?> dukungan</span></form><?php else: echo '<p class="mut">'.$dk.' dukungan</p>'; endif; ?></div>

<?php if ($role == 'admin' && $l['status'] == 'menunggu'): ?>
<div class="card"><h2>Verifikasi laporan</h2>
<form method="post"><?= csrf() ?><input type="hidden" name="aksi" value="disposisi">
<label>Disposisi ke OPD</label><select name="opd_id"><?php foreach ($opds as $o) echo '<option value="'.$o['id'].'">'.h($o['nama']).'</option>'; ?></select>
<label>Catatan</label><input name="catatan"><button>Valid, teruskan ke OPD</button></form><hr>
<form method="post"><?= csrf() ?><input type="hidden" name="aksi" value="tolak">
<label>No tiket laporan asli (jika duplikat, boleh kosong)</label><input name="duplikat">
<label>Alasan penolakan</label><input name="catatan" required><button class="btn2">Tolak / gabung duplikat</button></form></div>
<?php endif; ?>

<?php if ($tl): ?><div class="card"><h2>Riwayat tindak lanjut</h2>
<?php foreach ($tl as $t) { echo '<p><b>'.h($t['nama']).'</b> <span class="mut">'.h($t['created_at']).'</span><br>'.nl2br(h($t['keterangan'])); if ($t['bukti']) echo '<br><img class="foto" src="uploads/'.h($t['bukti']).'" alt="Bukti">'; echo '</p>'; } ?></div><?php endif; ?>

<?php if ($role == 'petugas' && in_array($l['status'], ['diteruskan','diproses'])): ?>
<div class="card"><h2>Tindak lanjut</h2><form method="post" enctype="multipart/form-data"><?= csrf() ?><input type="hidden" name="aksi" value="tindak">
<label>Keterangan progres</label><textarea name="keterangan" rows="3" required></textarea>
<label>Foto bukti</label><input type="file" name="bukti" accept="image/*">
<label><input type="checkbox" name="selesai" value="1" style="width:auto"> Tandai selesai (wajib foto bukti)</label><button>Simpan</button></form></div>
<?php endif; ?>

<?php if ($role == 'warga' && $l['user_id'] == $me['id'] && $l['status'] == 'selesai'): ?>
<div class="card"><h2>Survei kepuasan</h2>
<?php if ($sv): echo '<p>Terima kasih. Penilaian Anda: <b>'.(int)$sv['rating'].' / 5</b></p>'; else: ?>
<form method="post"><?= csrf() ?><input type="hidden" name="aksi" value="survei">
<label>Penilaian</label><select name="rating"><option value="5">5 - Sangat puas</option><option value="4">4 - Puas</option><option value="3">3 - Cukup</option><option value="2">2 - Kurang</option><option value="1">1 - Sangat kurang</option></select>
<label>Saran</label><textarea name="saran" rows="2"></textarea><button>Kirim survei</button></form><?php endif; ?></div>
<?php endif; ?>

<div class="card"><h2>Komentar (<?= count($kom) ?>)</h2>
<?php foreach ($kom as $c) echo '<p><b>'.h($c['nama']).'</b> <span class="mut">'.h($c['created_at']).'</span><br>'.nl2br(h($c['isi'])).'</p>'; ?>
<form method="post"><?= csrf() ?><input type="hidden" name="aksi" value="komentar"><textarea name="isi" rows="2" required></textarea><button>Kirim komentar</button></form></div>
<?php require 'footer.php';
