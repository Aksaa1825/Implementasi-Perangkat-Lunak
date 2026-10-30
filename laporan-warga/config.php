<?php
session_start();
$pdo = new PDO('mysql:host=localhost;dbname=laporan_warga;charset=utf8mb4', 'root', '', [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
$ST = ['menunggu'=>'Menunggu verifikasi','diteruskan'=>'Diteruskan ke OPD','diproses'=>'Sedang diproses','selesai'=>'Selesai','ditolak'=>'Ditolak / duplikat'];
function h($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
function user(){ return $_SESSION['u'] ?? null; }
function need($roles = null){
  if (!user()) { header('Location: login.php'); exit; }
  if ($roles && !in_array(user()['role'], (array)$roles)) { http_response_code(403); exit('Akses ditolak'); }
}
function q($sql, $p = []){ global $pdo; $s = $pdo->prepare($sql); $s->execute($p); return $s; }
function notif($uid, $lid, $msg){ q('INSERT INTO notifikasi(user_id,laporan_id,pesan) VALUES(?,?,?)', [$uid,$lid,$msg]); }
function upload($f){
  if (empty($f['name']) || $f['error'] !== 0) return null;
  $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
  if (!in_array($ext, ['jpg','jpeg','png']) || $f['size'] > 2*1024*1024 || !@getimagesize($f['tmp_name'])) return null;
  if (!is_dir(__DIR__.'/uploads')) mkdir(__DIR__.'/uploads');
  $n = bin2hex(random_bytes(8)).'.'.$ext;
  move_uploaded_file($f['tmp_name'], __DIR__.'/uploads/'.$n);
  return $n;
}
function csrf(){ $_SESSION['t'] = $_SESSION['t'] ?? bin2hex(random_bytes(16)); return '<input type="hidden" name="t" value="'.$_SESSION['t'].'">'; }
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !hash_equals($_SESSION['t'] ?? '', $_POST['t'] ?? '')) exit('Token tidak valid, muat ulang halaman.');
