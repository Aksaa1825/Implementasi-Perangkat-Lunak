<?php $me = user(); $nb = 0;
if ($me) $nb = q('SELECT COUNT(*) c FROM notifikasi WHERE user_id=? AND dibaca=0', [$me['id']])->fetch()['c']; ?>
<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title><?= h($judul ?? 'Lapor Warga') ?> - Lapor Warga</title>
<style>
:root{--bg:#f4f6f8;--ink:#1c2b36;--br:#0f5c6e;--mut:#6b7b86;--line:#dde3e8}
*{box-sizing:border-box}body{margin:0;font:15px/1.5 system-ui,sans-serif;background:var(--bg);color:var(--ink)}
nav{background:var(--br);color:#fff;padding:10px 20px;display:flex;flex-wrap:wrap;gap:14px;align-items:center}
nav a{color:#fff;text-decoration:none}nav b{margin-right:auto;font-size:17px}
main{max-width:920px;margin:20px auto;padding:0 16px}
.card{background:#fff;border:1px solid var(--line);border-radius:8px;padding:16px;margin-bottom:14px}
h1{font-size:22px;margin:0 0 14px}h2{font-size:17px;margin:0 0 10px}
label{display:block;margin:10px 0 3px;font-weight:600}
input,select,textarea{width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;font:inherit}
button,.btn{background:var(--br);color:#fff;border:0;padding:8px 14px;border-radius:6px;cursor:pointer;text-decoration:none;display:inline-block;font:inherit;margin-top:10px}
.btn2{background:#8a2f2f}.err{background:#fde8e8;color:#8a2f2f;padding:8px;border-radius:6px;margin-bottom:10px}
table{width:100%;border-collapse:collapse}td,th{padding:8px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
.tag{padding:2px 8px;border-radius:10px;font-size:12px;background:#e3eef1;color:var(--br)}
.s-selesai{background:#dff3e4;color:#1d6b33}.s-ditolak{background:#fde8e8;color:#8a2f2f}.s-menunggu{background:#fff2d6;color:#8a5a00}
.bar{background:#e3eef1;border-radius:4px;height:14px}.bar i{display:block;height:14px;background:var(--br);border-radius:4px}
.mut{color:var(--mut);font-size:13px}.row{display:flex;gap:10px;flex-wrap:wrap}.row>*{flex:1;min-width:160px}
img.foto{max-width:100%;max-height:320px;border-radius:6px}
</style></head><body>
<nav><b>Lapor Warga</b>
<?php if ($me): ?>
  <a href="dashboard.php">Beranda</a><a href="daftar.php">Laporan</a>
  <?php if ($me['role']=='warga'): ?><a href="laporan_baru.php">Buat laporan</a><?php endif; ?>
  <a href="peta.php">Peta sebaran</a>
  <?php if ($me['role']=='admin'): ?><a href="master.php">Kelola data</a><?php endif; ?>
  <a href="notif.php">Notifikasi<?= $nb ? " ($nb)" : '' ?></a>
  <a href="logout.php">Keluar (<?= h($me['nama']) ?>)</a>
<?php else: ?><a href="login.php">Masuk</a><a href="register.php">Daftar</a><?php endif; ?>
</nav><main>
