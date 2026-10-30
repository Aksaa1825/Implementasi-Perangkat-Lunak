CREATE DATABASE IF NOT EXISTS laporan_warga CHARACTER SET utf8mb4;
USE laporan_warga;
CREATE TABLE opd (id INT AUTO_INCREMENT PRIMARY KEY, nama VARCHAR(100) NOT NULL);
CREATE TABLE kategori (id INT AUTO_INCREMENT PRIMARY KEY, nama VARCHAR(100) NOT NULL);
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY, nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL,
  role ENUM('warga','admin','petugas','pimpinan') NOT NULL DEFAULT 'warga',
  opd_id INT NULL, FOREIGN KEY (opd_id) REFERENCES opd(id));
CREATE TABLE laporan (
  id INT AUTO_INCREMENT PRIMARY KEY, no_tiket VARCHAR(20) NOT NULL UNIQUE,
  user_id INT NOT NULL, kategori_id INT NOT NULL, judul VARCHAR(150) NOT NULL,
  deskripsi TEXT NOT NULL, foto VARCHAR(100), lat DECIMAL(10,7), lng DECIMAL(10,7),
  status ENUM('menunggu','diteruskan','diproses','selesai','ditolak') DEFAULT 'menunggu',
  opd_id INT NULL, catatan_admin TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (kategori_id) REFERENCES kategori(id),
  FOREIGN KEY (opd_id) REFERENCES opd(id));
CREATE TABLE dukungan (laporan_id INT, user_id INT, PRIMARY KEY (laporan_id,user_id),
  FOREIGN KEY (laporan_id) REFERENCES laporan(id) ON DELETE CASCADE);
CREATE TABLE komentar (id INT AUTO_INCREMENT PRIMARY KEY, laporan_id INT NOT NULL, user_id INT NOT NULL,
  isi TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (laporan_id) REFERENCES laporan(id) ON DELETE CASCADE);
CREATE TABLE tindak_lanjut (id INT AUTO_INCREMENT PRIMARY KEY, laporan_id INT NOT NULL, user_id INT NOT NULL,
  keterangan TEXT NOT NULL, bukti VARCHAR(100), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (laporan_id) REFERENCES laporan(id) ON DELETE CASCADE);
CREATE TABLE survei (laporan_id INT PRIMARY KEY, rating TINYINT NOT NULL, saran TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (laporan_id) REFERENCES laporan(id) ON DELETE CASCADE);
CREATE TABLE notifikasi (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, laporan_id INT,
  pesan VARCHAR(255) NOT NULL, dibaca TINYINT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

INSERT INTO opd (nama) VALUES ('Dinas PUPR'),('Dinas Kebersihan'),('Dinas Perhubungan'),('Dinas Kesehatan');
INSERT INTO kategori (nama) VALUES ('Jalan rusak'),('Sampah'),('Lampu jalan'),('Banjir / drainase'),('Layanan publik');
-- Semua akun demo berpassword: password
INSERT INTO users (nama,email,password,role,opd_id) VALUES
('Admin Diskominfo','admin@demo.test','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','admin',NULL),
('Petugas PUPR','pupr@demo.test','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','petugas',1),
('Pimpinan','pimpinan@demo.test','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','pimpinan',NULL),
('Warga Contoh','warga@demo.test','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','warga',NULL);
