<?php require 'config.php'; $err = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $n = trim($_POST['nama']); $e = trim($_POST['email']); $p = $_POST['password'];
  if (strlen($p) < 6) $err = 'Password minimal 6 karakter.';
  elseif (q('SELECT 1 FROM users WHERE email=?', [$e])->fetch()) $err = 'Email sudah terdaftar.';
  else {
    q('INSERT INTO users(nama,email,password,role) VALUES(?,?,?,"warga")', [$n,$e,password_hash($p, PASSWORD_DEFAULT)]);
    header('Location: login.php'); exit;
  }
}
$judul = 'Daftar'; require 'header.php'; ?>
<div class="card" style="max-width:420px;margin:auto"><h1>Daftar warga</h1>
<?php if ($err): ?><div class="err"><?= h($err) ?></div><?php endif; ?>
<form method="post"><?= csrf() ?>
<label>Nama lengkap</label><input name="nama" required>
<label>Email</label><input type="email" name="email" required>
<label>Password</label><input type="password" name="password" required>
<button>Daftar</button></form></div>
<?php require 'footer.php';
