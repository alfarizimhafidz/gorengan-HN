# Progres Proyek - Gorengan HN

Terakhir diperbarui: 11 November 2026  
Posisi saat ini: **Step 3 - Sistem Pemesanan / Booking (Selesai)**

## Checklist Proyek

- [x] Inisiasi (data usaha & referensi desain terkumpul)
- [x] **STEP 1 - Landing page**
  - [x] Hero, About, Service, Berita/Post, Contact + Google Maps
  - [x] Dikonfirmasi pengguna
- [x] **STEP 2 - User management & dashboard**
  - [x] Apps Script (`code.gs`, `setup.gs`) disiapkan di root project
  - [x] Panduan database Google Spreadsheet (`documentation/SETUP.md`)
  - [x] Login (`/login`) & Register (`/register`) dengan hashing bcrypt
  - [x] Role admin & user bawaan sistem dengan proteksi sesi JWT cookie
  - [x] Middleware proteksi rute `/dashboard/*`
  - [x] Dashboard: Manajemen User (cari, ganti role, aktif/nonaktif, hapus)
  - [x] Dashboard: Manajemen Role (tambah role kustom, proteksi role sistem)
  - [x] Dashboard: CRUD Berita (tulis artikel, pratinjau, status draft/published)
  - [x] Upload media lokal (`public/uploads/` via `lib/storage.ts`)
  - [x] Integrasi publik: landing page otomatis menampilkan berita aktif dari database
  - [x] Dikonfirmasi pengguna
- [x] **STEP 3 - Sistem Pemesanan / Booking & QRIS**
  - [x] Katalog menu produk & harga langsung (`/pesan`)
  - [x] Kalkulasi live harga real-time (tambah/kurang kuantitas, hitung subtotal & total)
  - [x] Formulir checkout (nama, WA, alamat antar, jadwal tanggal/jam, catatan)
  - [x] Halaman pembayaran ber-barcode QRIS resmi HN (`/pesanan/[id]/bayar`)
  - [x] Tiket pesanan otomatis berstatus `menunggu_konfirmasi`
  - [x] Riwayat pesanan pengguna terdaftar (`/pesanan`)
  - [x] Menu Dashboard Admin: Manajemen Pesanan Masuk (`/dashboard/orders`)
  - [x] Aksi admin: Konfirmasi pembayaran, tolak/batalkan, dan tombol chat WhatsApp langsung
  - [x] Skema tabel `Orders` idempoten di `setup.gs`
  - [ ] Dikonfirmasi pengguna
- [ ] **STEP 4 - Deploy & maintenance**
  - [ ] Deploy ke Vercel
  - [ ] Dikonfirmasi pengguna

## Akun Admin Bawaan (Development)
- **Email:** `admin@gmail.com`
- **Password:** `123456`
> ⚠️ **Peringatan Keamanan:** Kredensial ini bersifat publik untuk kemudahan pengujian awal. Harap ganti kata sandi admin sebelum website diluncurkan ke production di Vercel.

## Cara Menguji Sistem Pemesanan (Step 3)
1. **Buka Halaman Pemesanan:** [http://localhost:3000/pesan](http://localhost:3000/pesan)
   - Pilih aneka gorengan, snack box, atau hampers dengan mengklik tombol **+ Tambah**.
   - Perhatikan total harga di panel kanan langsung terhitung secara otomatis (*real-time*).
2. **Kirim Pesanan:**
   - Masukkan nama, nomor WhatsApp, dan alamat pengantaran.
   - Klik **Lanjut ke Pembayaran QRIS**.
3. **Lakukan Pembayaran:**
   - Anda akan diarahkan ke tiket pembayaran [http://localhost:3000/pesanan/[ID]/bayar](http://localhost:3000/pesan).
   - Terdapat barcode QRIS HN, detail nominal, dan tombol konfirmasi WhatsApp ke admin.
4. **Verifikasi Pesanan di Dashboard Admin:**
   - Buka menu [http://localhost:3000/dashboard/orders](http://localhost:3000/dashboard/orders).
   - Klik tombol **Konfirmasi Pembayaran**.
5. **Cek Status di Halaman "Pesanan Anda":**
   - Buka [http://localhost:3000/pesanan](http://localhost:3000/pesanan).
   - Status pesanan Anda otomatis berubah menjadi **Dikonfirmasi** lengkap dengan ucapan selamat dari Gorengan HN!
