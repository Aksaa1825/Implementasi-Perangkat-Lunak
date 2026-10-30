<?php require 'config.php'; need();
$rows = q('SELECT * FROM notifikasi WHERE user_id=? ORDER BY id DESC LIMIT 50', [user()['id']])->fetchAll();
q('UPDATE notifikasi SET dibaca=1 WHERE user_id=?', [user()['id']]);
$judul = 'Notifikasi'; require 'header.php'; ?>
<h1>Notifikasi</h1><div class="card">
<?php foreach ($rows as $r) echo '<p'.($r['dibaca'] ? '' : ' style="font-weight:600"').'><a href="detail.php?id='.(int)$r['laporan_id'].'">'.h($r['pesan']).'</a> <span class="mut">'.h($r['created_at']).'</span></p>';
if (!$rows) echo '<p class="mut">Belum ada notifikasi.</p>'; ?></div>
<?php require 'footer.php';
