<?php require 'config.php'; need(); $me = user();
$w = []; $p = [];
if ($me['role'] == 'warga' && empty($_GET['semua'])) { $w[] = 'l.user_id=?'; $p[] = $me['id']; }
if ($me['role'] == 'petugas') { $w[] = 'l.opd_id=?'; $p[] = $me['opd_id']; }
if (!empty($_GET['status']) && isset($ST[$_GET['status']])) { $w[] = 'l.status=?'; $p[] = $_GET['status']; }
$rows = q('SELECT l.*, k.nama kat, (SELECT COUNT(*) FROM dukungan d WHERE d.laporan_id=l.id) dk FROM laporan l JOIN kategori k ON k.id=l.kategori_id'
  . ($w ? ' WHERE ' . implode(' AND ', $w) : '') . ' ORDER BY l.id DESC', $p)->fetchAll();
$judul = 'Laporan'; require 'header.php'; ?>
<h1>Laporan</h1>
<form method="get" class="row" style="margin-bottom:10px"><select name="status" onchange="this.form.submit()">
<option value="">Semua status</option><?php foreach ($ST as $k => $v) echo '<option value="'.$k.'"'.(($_GET['status'] ?? '') == $k ? ' selected' : '').'>'.h($v).'</option>'; ?></select>
<?php if ($me['role'] == 'warga'): ?><label style="margin:8px 0"><input type="checkbox" name="semua" value="1" style="width:auto" onchange="this.form.submit()" <?= !empty($_GET['semua']) ? 'checked' : '' ?>> Tampilkan laporan semua warga</label><?php endif; ?></form>
<div class="card"><table><tr><th>Tiket</th><th>Laporan</th><th>Status</th><th>Dukungan</th></tr>
<?php foreach ($rows as $r): ?><tr><td><a href="detail.php?id=<?= $r['id'] ?>"><?= h($r['no_tiket']) ?></a></td>
<td><?= h($r['judul']) ?><div class="mut"><?= h($r['kat']) ?> · <?= h($r['created_at']) ?></div></td>
<td><span class="tag s-<?= $r['status'] ?>"><?= h($ST[$r['status']]) ?></span></td><td><?= $r['dk'] ?></td></tr>
<?php endforeach; if (!$rows) echo '<tr><td colspan="4" class="mut">Belum ada laporan.</td></tr>'; ?></table></div>
<?php require 'footer.php';
