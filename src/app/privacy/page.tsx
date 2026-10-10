import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, Database, Cpu } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Kebijakan Privasi SISMA
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
              <ShieldCheck className="w-4 h-4" /> Perlindungan Privasi & Keamanan Data
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Kebijakan Privasi SISMA
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Terakhir diperbarui: Oktober 2026 • Versi Aplikasi: 1.0 (Development Preview)
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 space-y-6 text-sm leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" /> 1. Gambaran Umum & Komitmen
              </h2>
              <p>
                SISMA (Sistem Informasi Keuangan Sekolah) dikembangkan untuk membantu institusi
                sekolah mengelola administrasi iuran SPP, kas operasional, dan pelaporan keuangan.
                Kami sangat menghormati privasi seluruh pengguna, staf sekolah, siswa, dan orang tua.
                Kebijakan ini menguraikan jenis data yang dikumpulkan, bagaimana data tersebut disimpan,
                serta langkah perlindungan yang diterapkan.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" /> 2. Kategori Data yang Dikelola
              </h2>
              <p>Aplikasi memproses kategori data administratif sekolah berikut:</p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong>Data Identitas Siswa:</strong> Nomor Induk Siswa (NIS), NISN, nama lengkap siswa, kelas, jenis kelamin, dan nomor kontak perwakilan orang tua/wali untuk keperluan komunikasi administrasi.
                </li>
                <li>
                  <strong>Data Keuangan & Pembayaran:</strong> Riwayat tagihan SPP bulanan, nominal iuran, bukti transaksi pembayaran, tanggal pelunasan, nomor referensi unik kwitansi, dan jurnal arus kas.
                </li>
                <li>
                  <strong>Akun Pengguna Sistem:</strong> Nama pengguna (username), nama lengkap, dan kata sandi terenkripsi (hashed) milik administrator, bendahara, atau siswa.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-600" /> 3. Pembatasan Akses (Role-Based Access Control)
              </h2>
              <p>
                Akses ke data keuangan sekolah dibatasi secara ketat berdasarkan peran pengguna (RBAC):
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong>Administrator:</strong> Mengelola data master (kelas, tahun ajaran, pengguna sistem, dan pengaturan umum sekolah).
                </li>
                <li>
                  <strong>Bendahara:</strong> Mencatat pembayaran iuran siswa, mencetak kwitansi pembayaran, memasukkan jurnal kas masuk/keluar, dan mengunduh laporan keuangan.
                </li>
                <li>
                  <strong>Siswa / Wali:</strong> Memiliki akses hanya-baca (read-only) untuk memantau status iuran bulanan dan mengunduh bukti kwitansi mandiri.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-600" /> 4. Penggunaan Kecerdasan Buatan (Claude AI)
              </h2>
              <p>
                SISMA menyediakan fitur opsional <em>AI Financial Report Assistant</em> yang didukung oleh Anthropic Claude API. Untuk menjaga kerahasiaan:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  Hanya data agregat numerik (seperti total iuran terbayar, total tunggakan, dan persentase kolektibilitas) yang dikirim ke API server-side.
                </li>
                <li>
                  Data identitas pribadi siswa (nama, NIS, NISN, nomor telepon) <strong>TIDAK PERNAH</strong> dikirimkan ke model AI.
                </li>
                <li>
                  Model AI hanya berfungsi memberikan ringkasan analisis deskriptif dan <strong>TIDAK PERNAH</strong> dapat memodifikasi, menambah, atau membatalkan data transaksi keuangan.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">5. Lingkungan Pengembangan & Data Sintetis</h2>
              <p>
                Seluruh data yang ditampilkan pada preview publik dan demonstrasi produk merupakan <strong>data sintetis (dummy)</strong> yang tidak merepresentasikan catatan siswa atau saldo rekening riil. Kunci rahasia API dan berkas konfigurasi privat diisolasi dari repositori publik.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">6. Kontak & Pertanyaan Privasi</h2>
              <p>
                Jika Anda memiliki pertanyaan mengenai kebijakan privasi atau pengelolaan data pada SISMA, silakan hubungi tim pengembangan melalui surat elektronik:
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-900">Email Kontak Resmi:</p>
                <a
                  href="mailto:mail@dev.spp-smapersiapan.web.id"
                  className="text-emerald-600 hover:text-emerald-700 font-medium underline"
                >
                  mail@dev.spp-smapersiapan.web.id
                </a>
                <p className="text-xs text-slate-500 mt-1">
                  SMA Swasta Persiapan Stabat • Kab. Langkat, Sumatera Utara
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} SISMA — Sistem Informasi Keuangan Sekolah. Hak Cipta Dilindungi.
        </div>
      </footer>
    </div>
  );
}
