# SISMA NEW — Sistem Informasi Keuangan Sekolah

> **School Fee Management, Made Simpler.**  
> Web-based school tuition (SPP) and finance management SaaS for Indonesian schools.

---

## 📌 Gambaran Umum Produk (Product Overview)
**SISMA NEW** adalah aplikasi *Software-as-a-Service* (SaaS) pengelolaan keuangan dan administrasi pembayaran SPP sekolah. Aplikasi ini dirancang untuk mempermudah bendahara sekolah dalam mengatur jadwal penagihan iuran bulanan siswa, memantau status pelunasan 12 bulan (Juli sampai Juni), mencatat transaksi secara real-time, menerbitkan kwitansi pembayaran digital, serta mengelola pembukuan jurnal kas sekolah secara transparan.

Aplikasi ini dikembangkan secara independen dan terisolasi sebagai modernisasi sistem tata usaha untuk **SMA Swasta Persiapan Stabat**.

---

## 🚦 Status Pengembangan Produk (Product Status)
- **Status Saat Ini:** **Dalam Pengembangan Aktif (Under Active Development)**.
- **Versi:** 1.0 (Development & Startup Review Readiness Preview).
- **Integritas Informasi:** Seluruh data yang ditampilkan dalam demonstrasi publik menggunakan data sintetis (dummy) tanpa melibatkan informasi pribadi siswa (Zero PII).

---

## 🚀 Fitur Terverifikasi (Verified Implemented Features)

### 1. Website Publik & Discoverability (Public Portal)
- Halaman beranda responsif tanpa memerlukan otentikasi awal (`/`).
- Informasi produk yang jujur, transparan, dan dapat diverifikasi.
- Pratinjau interaktif antarmuka kerja (Dashboard, Matriks SPP, AI Assistant).
- Halaman Kebijakan Privasi resmi (`/privacy`) dengan transparansi pengelolaan data dan batasan model AI.
- Tombol akses masuk (Sign In) ke portal aplikasi terotentikasi.

### 2. Otentikasi & Otorisasi Multi-Peran (RBAC)
- Otentikasi berbasis sesi terenkripsi (HTTP-only cookie JWT via `jose`).
- Hashing kata sandi menggunakan Bcrypt.
- Proteksi route server-side untuk peran `admin`, `bendahara`, dan `siswa`.

### 3. Manajemen Siswa & Kelas (Student Directory)
- Direktori siswa aktif dengan pencarian nama, NIS, dan NISN.
- Pengelompokan rombongan belajar (Kelas/Rombel).
- **Auto-Generate Billing:** Penambahan siswa baru otomatis membangkitkan 12 slot tagihan SPP untuk tahun ajaran aktif.
- Pengarsipan data siswa (soft-archive ke status ALUMNI).

### 4. Loket Pembayaran SPP 12 Bulan (Payment Counter)
- Matriks pembayaran visual 12 bulan (Juli sampai Juni) per siswa.
- Pencatatan transaksi satu klik dengan validasi nominal di sisi server.
- **Pencegahan Pembayaran Ganda:** Sistem secara tegas menolak duplikasi pelunasan pada bulan yang sama.
- Sinkronisasi otomatis ke Jurnal Kas Operasional.
- Penerbitan modal Kwitansi Digital Resmi dengan nomor referensi unik (`SPP-YYYYMMDD-...`), stempel identitas sekolah, dan fitur cetak kwitansi.

### 5. Jurnal Kas Operasional (Cash Flow Ledger)
- Pembukuan kas masuk (pemasukan) dan kas keluar (pengeluaran).
- Penghitungan otomatis saldo kas bersih (surplus/defisit).
- Filter transaksi berdasarkan jenis arus kas.

### 6. Laporan Rekapitulasi & AI Financial Assistant (Claude API)
- Rekapitulasi penagihan bulanan (Target, Realisasi, Sisa Tunggakan, Rasio Kolektibilitas %).
- **AI Financial Report Assistant:** Integrasi resmi `@anthropic-ai/sdk` (Claude 3.5 Sonnet) di sisi server untuk menganalisis kesehatan keuangan sekolah berbasis angka agregat riil.
- **Perlindungan Privasi AI:** Zero PII dikirim ke Anthropic. AI dibatasi hanya memberikan ringkasan analisis tanpa dapat memanipulasi catatan keuangan riil.

---

## 🛠️ Arsitektur & Teknologi (Tech Stack)
- **Framework:** Next.js 14 (App Router)
- **Bahasa:** TypeScript
- **Database & ORM:** SQLite (pengembangan lokal terisolasi via `prisma/dev.db`) & Prisma ORM
- **Styling:** Tailwind CSS & Lucide React
- **Keamanan:** Bcrypt.js, Jose (JWT), HTTP-Only Cookies
- **AI Provider:** Anthropic Claude API (`@anthropic-ai/sdk`)

---

## 💻 Panduan Instalasi Lokal (Development Setup)

### 1. Prasyarat
- Node.js versi 18+ atau 22+
- npm versi 9+ atau 10+
- Git

### 2. Kloning Repositori
```bash
git clone https://github.com/ipangpangeran/new_sisma.git
cd new_sisma
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Konfigurasi Lingkungan (.env)
Salin berkas contoh konfigurasi:
```bash
cp .env.example .env
```
Isi konfigurasi berikut:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="masukkan-kunci-rahasia-jwt-minimal-32-karakter"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Opsional: Kunci resmi Anthropic Claude API untuk fitur AI Report Assistant
ANTHROPIC_API_KEY=""
```

### 5. Inisialisasi Database & Seeder Data Sintetis
Jalankan migrasi skema dan seeder data sintetis (bebas data riil):
```bash
npx prisma db push
npm run db:seed
```

### 6. Menjalankan Server Pengembangan
```bash
npm run dev
```
Akses aplikasi melalui peramban: `http://localhost:3000`

---

## 🔑 Akun Demo Pengujian (Synthetic Credentials)
Untuk keperluan review dan evaluasi fungsional:
| Peran (Role) | Nama Pengguna (Username) | Kata Sandi (Password) |
|---|---|---|
| **Bendahara Sekolah** | `bendahara` | `bendahara123` |
| **Administrator Sistem** | `admin` | `admin123` |
| **Siswa / Wali Siswa** | `siswa` | `siswa123` |

---

## ⚠️ Batasan yang Diketahui (Known Limitations)
1. **Model Database Lokal:** Pada fase pengembangan ini, database menggunakan SQLite lokal (`prisma/dev.db`) untuk memastikan isolasi 100% dari basis data legacy. Migrasi ke PostgreSQL/MySQL akan disiapkan pada saat implementasi server produksi.
2. **Kunci API Claude:** Fitur AI Assistant memerlukan `ANTHROPIC_API_KEY` aktif pada server. Jika kunci tidak disetel, antarmuka akan menampilkan panduan konfigurasi yang jelas tanpa memalsukan keberhasilan integrasi.
3. **Pembayaran Gateway Eksternal:** Integrasi pembayaran pihak ketiga (misalnya Midtrans/Xendit) berada pada tahap rancangan arsitektur dan belum dihubungkan ke akun merchant produksi.

---

## 📬 Kontak & Komunikasi Pengembang
- **Sekolah Target:** SMA Swasta Persiapan Stabat
- **Alamat:** Jl. KH. Zainul Arifin No. 12, Stabat, Kab. Langkat, Sumatera Utara
- **Surel Domain Resmi:** [mail@dev.spp-smapersiapan.web.id](mailto:mail@dev.spp-smapersiapan.web.id)
- **Website Pengembangan:** [https://dev.spp-smapersiapan.web.id/](https://dev.spp-smapersiapan.web.id/)

---
*© 2026 SISMA NEW. Seluruh hak cipta dilindungi.*
