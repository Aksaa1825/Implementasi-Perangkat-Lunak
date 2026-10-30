<?php require 'config.php'; need();
$pts = q('SELECT id,no_tiket,judul,status,lat,lng FROM laporan WHERE lat IS NOT NULL')->fetchAll();
$judul = 'Peta sebaran'; require 'header.php'; ?>
<h1>Peta sebaran laporan</h1>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<div id="map" style="height:480px;border-radius:8px"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
var pts = <?= json_encode($pts) ?>, st = <?= json_encode($ST) ?>;
var m = L.map('map').setView([-6.2, 106.82], 11);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '© OpenStreetMap'}).addTo(m);
var b = [];
pts.forEach(function (p) {
  var ll = [parseFloat(p.lat), parseFloat(p.lng)]; b.push(ll);
  L.marker(ll).addTo(m).bindPopup('<b>' + p.no_tiket + '</b><br>' + p.judul.replace(/</g, '&lt;') + '<br>' + st[p.status] + '<br><a href="detail.php?id=' + p.id + '">Lihat detail</a>');
});
if (b.length) m.fitBounds(b, {maxZoom: 15});
</script>
<?php require 'footer.php';
