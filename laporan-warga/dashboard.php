<?php require 'config.php'; need(); $me = user();
if ($me['role'] == 'warga') { header('Location: daftar.php'); exit; }
$w = $me['role'] == 'petugas' ? ' WHERE opd_id=' . (int)$me['opd_id'] : '';
$per = fn($sql) => q($sql)->fetchAll();
$status = $per("SELECT status n, COUNT(*) c FROM laporan $w GROUP BY status");
$kat = $per("SELECT k.nama n, COUNT(*) c FROM laporan l JOIN kategori k ON k.id=l.kategori_id " . str_replace('opd_id','l.opd_id',$w) . " GROUP BY k.id");
$opd = $per("SELECT o.nama n, COUNT(*) c FROM laporan l JOIN opd o ON o.id=l.opd_id " . str_replace('opd_id','l.opd_id',$w) . " GROUP BY o.id");
$rt = q('SELECT ROUND(AVG(rating),2) r, COUNT(*) c FROM survei')->fetch();
$tot = array_sum(array_column($status, 'c'));
function bars($rows, $labels = null){ global $tot; foreach ($rows as $r) {
  $p = $tot ? round($r['c']/$tot*100) : 0; $n = $labels[$r['n']] ?? $r['n'];
  echo '<div style="margin:6px 0"><div>'.h($n).' <b>'.$r['c'].'</b></div><div class="bar"><i style="width:'.$p.'%"></i></div></div>'; } }
$judul = 'Dashboard statistik'; require 'header.php'; ?>
<h1>Dashboard statistik</h1>
<div class="row"><div class="card"><div class="mut">Total laporan</div><h1><?= $tot ?></h1></div>
<div class="card"><div class="mut">Kepuasan warga (<?= (int)$rt['c'] ?> survei)</div><h1><?= $rt['r'] ?: '-' ?> / 5</h1></div></div>
<div class="row"><div class="card"><h2>Per status</h2><?php bars($status, $ST); ?></div>
<div class="card"><h2>Per kategori</h2><?php bars($kat); ?></div></div>
<div class="card"><h2>Per OPD</h2><?php bars($opd); if (!$opd) echo '<p class="mut">Belum ada laporan yang diteruskan.</p>'; ?></div>
<?php require 'footer.php';
