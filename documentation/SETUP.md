# Panduan Setup Database Google Spreadsheet (Gorengan HN)

Dokumen ini memandu Anda menghubungkan website company profile dengan Google Spreadsheet sebagai basis data (database) melalui Google Apps Script.

---

## Mengapa Menggunakan Arsitektur Ini?
Website Anda tidak pernah memanggil Google Spreadsheet secara langsung dari peramban (browser). Semua pertukaran data dilewatkan melalui server Next.js menggunakan token rahasia bersama (*secret token*), sehingga tautan dan isi spreadsheet Anda tetap aman dari pihak luar.

---

## Langkah 1: Buat Google Spreadsheet Baru
1. Buka [Google Sheets](https://sheets.new) di browser Anda.
2. Beri nama spreadsheet Anda, misalnya: **Database Gorengan HN**.

---

## Langkah 2: Buka Editor Apps Script
1. Di menu atas Google Spreadsheet, klik **Ekstensi (Extensions)** > **Apps Script**.
2. Beri nama proyek Apps Script di pojok kiri atas, misalnya: **Gorengan HN API**.

---

## Langkah 3: Masukkan Kode Skrip
Di dalam proyek ini ada dua file skrip di root folder yang sudah kami siapkan:

1. **File `code.gs`**:
   - Di editor Apps Script, buka file `Code.gs` yang sudah ada secara bawaan.
   - Hapus semua isinya, lalu salin seluruh isi file `code.gs` dari folder proyek Anda ke sana.

2. **File `setup.gs`**:
   - Klik tombol **+** di sebelah kiri menu editor Apps Script > pilih **Script**.
   - Beri nama file baru tersebut: `setup`.
   - Salin seluruh isi file `setup.gs` dari proyek Anda ke file `setup.gs` di editor Apps Script.
   - Klik ikon **Simpan (Save)** (ikon disket) atau tekan `Ctrl + S`.

---   

## Langkah 4: Simpan Secret Token di Script Properties
1. Di bilah menu sebelah kiri Apps Script, klik ikon **Roda Gigi (Project Settings)**.
2. Gulir ke bawah hingga bagian **Script Properties (Properti Skrip)**.
3. Klik tombol **Add script property (Tambahkan properti skrip)**:
   - **Property (Properti):** `APPS_SCRIPT_SECRET`
   - **Value (Nilai):** Buat kata sandi/kunci acak yang aman (misalnya: `KunciRahasiaHN_2026!xyz`)
4. Klik **Save script properties (Simpan properti skrip)**.

---

## Langkah 5: Jalankan Inisiasi Tabel Awal
1. Kembali ke tab **Editor** (ikon `< >` di menu kiri).
2. Di baris menu atas, pada menu dropdown pilihan fungsi, pilih **`initTables`**.
3. Klik tombol **Run (Jalankan)**.
4. Google akan meminta izin otorisasi (*Review Permissions*):
   - Klik akun Google Anda.
   - Klik **Advanced (Lanjutan)** > klik tautan **Go to Gorengan HN API (unsafe)**.
   - Klik **Allow (Izinkan)**.
5. Periksa spreadsheet Anda! Sheet **Roles**, **Users**, dan **News** akan otomatis dibuat lengkap beserta data akun admin awal (`admin@gmail.com`) dan artikel bawaan.

---

## Langkah 6: Deploy sebagai Web App
1. Di pojok kanan atas editor Apps Script, klik tombol biru **Deploy** > **New deployment (Penerapan baru)**.
2. Klik ikon gerigi di sebelah kiri (*Select type*) > pilih **Web app**.
3. Isi kolom:
   - **Description:** `Production API v1`
   - **Execute as:** `Me (email Anda)`
   - **Who has access:** `Anyone (Siapa saja)`
4. Klik **Deploy**.
5. Salin tautan yang ada pada bagian **Web app URL** (berakhiran `/exec`).

---

## Langkah 7: Masukkan ke Environment Variable Proyek
Buat file baru bernama `.env.local` di dalam folder `gorengan-hn/` (atau ubah dari `.env.example`):

```env
APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
APPS_SCRIPT_SECRET=KunciRahasiaHN_2026!xyz
JWT_SECRET=gorengan_hn_super_secret_jwt_key_2026
```

Restart server development lokal Anda:
```bash
npm run dev
```

Selamat! Website Anda sekarang telah resmi terhubung secara langsung dua arah dengan Google Spreadsheet!

