<?php require 'config.php'; need('admin'); $err = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  try {
    $a = $_POST['aksi'];
    if ($a == 'kat') q('INSERT INTO kategori(nama) VALUES(?)', [trim($_POST['nama'])]);
    if ($a == 'opd') q('INSERT INTO opd(nama) VALUES(?)', [trim($_POST['nama'])]);
    if ($a == 'del_kat') q('DELETE FROM kategori WHERE id=?', [(int)$_POST['id']]);
    if ($a == 'del_opd') q('DELETE FROM opd WHERE id=?', [(int)$_POST['id']]);
    if ($a == 'del_user' && (int)$_POST['id'] != user()['id']) q('DELETE FROM users WHERE id=?', [(int)$_POST['id']]);
    if ($a == 'user') {
      $r = in_array($_POST['role'], ['admin','petugas','pimpinan','warga']) ? $_POST['role'] : 'warga';
      q('INSERT INTO users(nama,email,password,role,opd_id) VALUES(?,?,?,?,?)', [trim($_POST['nama']), trim($_POST['email']),
        password_hash($_POST['password'], PASSWORD_DEFAULT), $r, $r == 'petugas' ? (int)$_POST['opd_id'] : null]);
    }
  } catch (PDOException $e) { $err = 'Gagal: data sudah dipakai (duplikat atau masih terhubung ke laporan).'; }
  if (!$err) { header('Location: master.php'); exit; }
}
$kat = q('SELECT * FROM kategori')->fetchAll(); $opd = q('SELECT * FROM opd')->fetchAll();
$usr = q('SELECT u.*, o.nama opd FROM users u LEFT JOIN opd o ON o.id=u.opd_id ORDER BY u.role, u.nama')->fetchAll();
function list_($rows, $del){ foreach ($rows as $r) echo '<form method="post" style="display:flex;gap:8px;align-items:center">'.csrf().'<input type="hidden" name="aksi" value="'.$del.'"><input type="hidden" name="id" value="'.$r['id'].'"><span style="flex:1">'.h($r['nama']).'</span><button class="btn2" style="margin:2px" onclick="return confirm(\'Hapus?\')">Hapus</button></form>'; }
$judul = 'Kelola data'; require 'header.php'; ?>
<h1>Kelola kategori, OPD & pengguna</h1>
<?php if ($err) echo '<div class="err">'.h($err).'</div>'; ?>
<div class="row"><div class="card"><h2>Kategori</h2><?php list_($kat, 'del_kat'); ?>
<form method="post"><?= csrf() ?><input type="hidden" name="aksi" value="kat"><input name="nama" placeholder="Kategori baru" required><button>Tambah</button></form></div>
<div class="card"><h2>OPD</h2><?php list_($opd, 'del_opd'); ?>
<form method="post"><?= csrf() ?><input type="hidden" name="aksi" value="opd"><input name="nama" placeholder="OPD baru" required><button>Tambah</button></form></div></div>
<div class="card"><h2>Pengguna</h2><table><tr><th>Nama</th><th>Email</th><th>Peran</th><th></th></tr>
<?php foreach ($usr as $u): ?><tr><td><?= h($u['nama']) ?></td><td><?= h($u['email']) ?></td><td><?= h($u['role'] . ($u['opd'] ? ' - ' . $u['opd'] : '')) ?></td>
<td><?php if ($u['id'] != user()['id']): ?><form method="post"><?= csrf() ?><input type="hidden" name="aksi" value="del_user"><input type="hidden" name="id" value="<?= $u['id'] ?>"><button class="btn2" style="margin:0" onclick="return confirm('Hapus?')">Hapus</button></form><?php endif; ?></td></tr><?php endforeach; ?></table>
<h2 style="margin-top:16px">Tambah pengguna</h2>
<form method="post"><?= csrf() ?><input type="hidden" name="aksi" value="user"><div class="row">
<input name="nama" placeholder="Nama" required><input type="email" name="email" placeholder="Email" required><input type="password" name="password" placeholder="Password" required>
<select name="role"><option>petugas</option><option>admin</option><option>pimpinan</option><option>warga</option></select>
<select name="opd_id"><?php foreach ($opd as $o) echo '<option value="'.$o['id'].'">'.h($o['nama']).'</option>'; ?></select></div>
<p class="mut">OPD hanya dipakai untuk peran petugas.</p><button>Tambah pengguna</button></form></div>
<?php require 'footer.php';
