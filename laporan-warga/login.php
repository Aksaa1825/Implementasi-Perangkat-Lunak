<?php require 'config.php'; $err = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $u = q('SELECT * FROM users WHERE email=?', [trim($_POST['email'])])->fetch();
  if ($u && password_verify($_POST['password'], $u['password'])) {
    session_regenerate_id(true); unset($u['password']); $_SESSION['u'] = $u;
    header('Location: dashboard.php'); exit;
  }
  $err = 'Email atau password salah.';
}
$judul = 'Masuk'; require 'header.php'; ?>
<div class="card" style="max-width:420px;margin:auto"><h1>Masuk</h1>
<?php if ($err): ?><div class="err"><?= h($err) ?></div><?php endif; ?>
<form method="post"><?= csrf() ?>
<label>Email</label><input type="email" name="email" required>
<label>Password</label><input type="password" name="password" required>
<button>Masuk</button></form>
<p class="mut">Belum punya akun? <a href="register.php">Daftar sebagai warga</a></p></div>
<?php require 'footer.php';
