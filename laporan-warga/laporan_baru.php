<?php require 'config.php'; need('warga'); $err = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $foto = upload($_FILES['foto'] ?? []);
  if (trim($_POST['judul']) === '' || trim($_POST['deskripsi']) === '') $err = 'Judul dan deskripsi wajib diisi.';
  else {
    $tiket = 'LP' . date('ymd') . strtoupper(substr(bin2hex(random_bytes(2)), 0, 4));
    q('INSERT INTO laporan(no_tiket,user_id,kategori_id,judul,deskripsi,foto,lat,lng) VALUES(?,?,?,?,?,?,?,?)',
      [$tiket, user()['id'], (int)$_POST['kategori'], trim($_POST['judul']), trim($_POST['deskripsi']), $foto,
       $_POST['lat'] !== '' ? $_POST['lat'] : null, $_POST['lng'] !== '' ? $_POST['lng'] : null]);
    $id = $GLOBALS['pdo']->lastInsertId();
    notif(user()['id'], $id, "Laporan $tiket diterima.");
    foreach (q('SELECT id FROM users WHERE role="admin"') as $a) notif($a['id'], $id, "Laporan baru $tiket perlu diverifikasi.");
    header('Location: detail.php?id=' . $id); exit;
  }
}
$kat = q('SELECT * FROM kategori ORDER BY nama')->fetchAll();
$judul = 'Buat laporan'; require 'header.php'; ?>
<div class="card"><h1>Buat laporan</h1>
<?php if ($err): ?><div class="err"><?= h($err) ?></div><?php endif; ?>
<form method="post" enctype="multipart/form-data"><?= csrf() ?>
<label>Kategori</label><select name="kategori"><?php foreach ($kat as $k) echo '<option value="'.$k['id'].'">'.h($k['nama']).'</option>'; ?></select>
<label>Judul</label><input name="judul" maxlength="150" required>
<label>Deskripsi</label><textarea name="deskripsi" rows="4" required></textarea>
<label>Foto (jpg/png, maks 2 MB)</label><input type="file" name="foto" accept="image/*">
<div class="row"><div><label>Latitude</label><input name="lat" id="lat" readonly></div><div><label>Longitude</label><input name="lng" id="lng" readonly></div></div>
<button type="button" onclick="gps()">Ambil lokasi GPS saya</button> <button>Kirim laporan</button></form></div>
<script>function gps(){navigator.geolocation?navigator.geolocation.getCurrentPosition(function(p){lat.value=p.coords.latitude.toFixed(7);lng.value=p.coords.longitude.toFixed(7)},function(){alert('Lokasi tidak bisa diambil. Izinkan akses lokasi di browser.')}):alert('Browser tidak mendukung GPS')}</script>
<?php require 'footer.php';
