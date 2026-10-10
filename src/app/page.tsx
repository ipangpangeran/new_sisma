"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  CreditCard,
  Users,
  BarChart3,
  BookOpen,
  Calendar,
  Lock,
  Mail,
  Building,
  ChevronRight,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";

export default function PublicHomePage() {
  const [activePreviewTab, setActivePreviewTab] = useState<"dashboard" | "matrix" | "ai">("dashboard");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* 1. TOP NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-500/20">
              S
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">SISMA</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                v1.0 Dev Preview
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#overview" className="hover:text-emerald-600 transition-colors">
              Ikhtisar
            </a>
            <a href="#features" className="hover:text-emerald-600 transition-colors">
              Fitur Utama
            </a>
            <a href="#preview" className="hover:text-emerald-600 transition-colors">
              Pratinjau Aplikasi
            </a>
            <a href="#about" className="hover:text-emerald-600 transition-colors">
              Tentang & Kontak
            </a>
            <Link href="/privacy" className="hover:text-emerald-600 transition-colors">
              Privasi
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Lock className="w-4 h-4" />
              <span>Masuk Aplikasi</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section id="overview" className="relative pt-16 pb-20 overflow-hidden bg-gradient-to-b from-slate-100/60 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Status Pengembangan: Aktif Dikembangkan (Active Development)</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              School Fee Management,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Made Simpler.
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              SISMA adalah aplikasi manajemen keuangan sekolah berbasis web yang dirancang untuk
              membantu staf tata usaha dan bendahara mengorganisasi tagihan SPP siswa, memantau
              status pelunasan 12 bulan, dan mengelola arus kas secara transparan.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#preview"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-sm transition-all"
              >
                <span>Jelajahi Demo Produk</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02]"
              >
                <span>Buka Dashboard Bendahara</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Matriks SPP</div>
                <div className="text-xl font-bold text-slate-900 mt-1">12 Bulan Penuh</div>
                <div className="text-xs text-emerald-600 font-medium mt-0.5">Siklus Juli – Juni</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verifikasi</div>
                <div className="text-xl font-bold text-slate-900 mt-1">Validasi Server</div>
                <div className="text-xs text-emerald-600 font-medium mt-0.5">Anti Dobel Bayar</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Assistant</div>
                <div className="text-xl font-bold text-slate-900 mt-1">Claude 3.5 Sonnet</div>
                <div className="text-xs text-emerald-600 font-medium mt-0.5">Ringkasan Eksekutif</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Data Testing</div>
                <div className="text-xl font-bold text-slate-900 mt-1">Sintetis Aman</div>
                <div className="text-xs text-emerald-600 font-medium mt-0.5">Zero Student PII</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT FEATURES */}
      <section id="features" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Modul Fungsional</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Kemampuan Inti Aplikasi SISMA
            </h3>
            <p className="text-slate-600 text-sm">
              Semua modul berikut telah diimplementasikan pada aplikasi dan didukung oleh database relasional yang terisolasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-slate-900">Manajemen Siswa & Kelas</h4>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Tersedia
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kelola direktori siswa dengan NIS, NISN, status keaktifan, dan penempatan kelas. Pembuatan siswa baru otomatis membangkitkan 12 slot tagihan SPP untuk tahun ajaran berjalan.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-slate-900">Loket & Matriks SPP Bulanan</h4>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Tersedia
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Matriks visual pembayaran 12 bulan (Juli sampai Juni). Pencatatan transaksi satu klik dengan nomor referensi unik kwitansi dan proteksi pencegahan pembayaran ganda di server.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-slate-900">Jurnal Arus Kas (Kas Masuk/Keluar)</h4>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Tersedia
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pencatatan pembukuan kas operasional sekolah, dana BOS, perbaikan sarana, dan sinkronisasi otomatis setoran SPP langsung ke buku kas induk sekolah.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-slate-900">Ikhtisar & Laporan Keuangan</h4>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Tersedia
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Agregasi real-time dari database: total tagihan terjadwal, total dana terhimpun, total tunggakan siswa, dan rasio kolektibilitas per bulan.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-slate-900">AI Report Assistant (Claude)</h4>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  Integrasi Resmi
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Asisten AI resmi berbasis Anthropic Claude SDK untuk merangkum kesehatan keuangan sekolah berdasarkan angka agregat riil tanpa mengirim data pribadi siswa.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-slate-900">Otorisasi & Keamanan Multi-Role</h4>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Tersedia
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sistem otentikasi sesi HTTP-only cookie, hashing Bcrypt, serta pemisahan peran ketat antara Administrator, Bendahara Kasir, dan Siswa Read-Only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE PRODUCT PREVIEW */}
      <section id="preview" className="py-20 bg-slate-100/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Pratinjau Nyata</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Eksplorasi Antarmuka SISMA
            </h3>
            <p className="text-slate-600 text-sm">
              Klik tab di bawah untuk melihat cuplikan antarmuka kerja aplikasi yang dibangun dengan data sintetis sekolah.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm gap-1">
              <button
                onClick={() => setActivePreviewTab("dashboard")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activePreviewTab === "dashboard"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Dashboard Keuangan
              </button>
              <button
                onClick={() => setActivePreviewTab("matrix")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activePreviewTab === "matrix"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Matriks Loket SPP 12 Bulan
              </button>
              <button
                onClick={() => setActivePreviewTab("ai")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activePreviewTab === "ai"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Claude AI Financial Assistant
              </button>
            </div>
          </div>

          {/* Tab Content Box */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
            {/* Top Mock Window Bar */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
                <span className="ml-3 text-xs font-mono text-slate-400">
                  sisma.internal/dashboard/{activePreviewTab}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">T.A. 2026/2027</span>
                <span className="hidden sm:inline">SMA Swasta Persiapan Stabat</span>
              </div>
            </div>

            {/* Tab 1: Dashboard */}
            {activePreviewTab === "dashboard" && (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80">
                    <div className="text-xs font-bold text-emerald-800 uppercase">SPP Terbayar (Realisasi)</div>
                    <div className="text-2xl font-black text-emerald-950 mt-1">Rp 2.750.000</div>
                    <div className="text-xs text-emerald-700 mt-1">11 Pembayaran tercatat</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200/80">
                    <div className="text-xs font-bold text-rose-800 uppercase">Sisa Tunggakan SPP</div>
                    <div className="text-2xl font-black text-rose-950 mt-1">Rp 27.250.000</div>
                    <div className="text-xs text-rose-700 mt-1">Dari total target 120 slot bulan</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-700 uppercase">Saldo Kas Operasional</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">Rp 12.850.000</div>
                    <div className="text-xs text-emerald-600 font-medium mt-1">Surplus kas bersih</div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-emerald-600" /> Transaksi Terakhir (Data Sintetis)
                    </h4>
                    <span className="text-xs text-slate-500">Auto-sync dengan Kas</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900">Ahmad Rizky Pratama (X MIPA 1)</span>
                        <span className="text-slate-400 ml-2">SPP September 2026</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600">+Rp 250.000</span>
                        <span className="block text-[10px] text-slate-400">Ref: SPP-260101-03</span>
                      </div>
                    </div>
                    <div className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900">Anisa Putri Maharani (X MIPA 1)</span>
                        <span className="text-slate-400 ml-2">SPP Agustus 2026</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600">+Rp 250.000</span>
                        <span className="block text-[10px] text-slate-400">Ref: SPP-260102-02</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: SPP Matrix */}
            {activePreviewTab === "matrix" && (
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">Loket SPP Siswa: Ahmad Rizky Pratama</h4>
                    <p className="text-xs text-slate-500">NIS: 260101 • Kelas: X MIPA 1 • Tarif: Rp 250.000 / bulan</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    3/12 Bulan Lunas
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 text-xs">
                  {["Juli", "Agustus", "September"].map((m) => (
                    <div key={m} className="p-3 rounded-xl border border-emerald-300 bg-emerald-50 text-center">
                      <div className="font-bold text-emerald-900">{m}</div>
                      <div className="text-[11px] text-emerald-700 font-semibold mt-1">LUNAS</div>
                      <div className="text-[10px] text-emerald-600 mt-0.5">Rp 250.000</div>
                    </div>
                  ))}
                  {["Oktober", "November", "Desember", "Januari", "Februari", "Maret", "April", "Mei", "Juni"].map(
                    (m) => (
                      <div key={m} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-center">
                        <div className="font-bold text-slate-700">{m}</div>
                        <div className="text-[11px] text-rose-600 font-semibold mt-1">BELUM</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Rp 250.000</div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Claude AI */}
            {activePreviewTab === "ai" && (
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-purple-50 border border-purple-200">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-950 text-sm">AI Financial Report Assistant</h4>
                    <p className="text-xs text-purple-800">
                      Didukung oleh Anthropic Claude API (model claude-3-5-sonnet). Server-side only & zero PII.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-700">Contoh Ringkasan Analisis Eksekutif:</span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">AI-Generated</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-4 rounded-xl border border-slate-200">
                    &quot;Berdasarkan data keuangan tahun ajaran 2026/2027, realisasi penerimaan SPP saat ini mencapai
                    Rp 2.750.000 dari total tagihan terjadwal Rp 30.000.000 (rasio kolektibilitas 9,2% pada kuartal pertama).
                    Posisi kas operasional menunjukkan saldo bersih yang sehat sebesar Rp 12.850.000 didukung penerimaan
                    bantuan BOS. Disarankan bagi bendahara untuk menindaklanjuti penerbitan surat pengingat tagihan bulan
                    Oktober bagi siswa yang belum melunasi.&quot;
                  </p>
                  <p className="text-[11px] text-slate-500">
                    ⚠️ Peringatan: Ringkasan ini adalah alat bantu analisis. Rekomendasi tetap memerlukan verifikasi manusia.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Callout */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <span className="text-slate-500">
                Ingin mencoba alur input dan cetak kwitansi secara langsung?
              </span>
              <Link
                href="/login"
                className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Masuk dengan Akun Demo Bendahara</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT & CONTACT */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Identitas Produk</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Tentang SISMA & Pengembang
            </h3>
            <p className="text-slate-600 text-sm">
              Informasi jujur mengenai status pengembangan produk dan kontak pengembang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-slate-900">Tujuan & Lingkup Penggunaan</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                SISMA (Sistem Informasi Keuangan Sekolah) dibangun secara spesifik untuk memodernisasi
                dan mempermudah pencatatan administrasi SPP di <strong>SMA Swasta Persiapan Stabat</strong>.
                Versi ini merupakan aplikasi baru yang dibangun independen untuk menggantikan sistem legacy
                setelah melalui proses pengujian menyeluruh.
              </p>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                Status Rilis: <strong>v1.0 (Testing & Readiness Evaluation)</strong>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-slate-900">Kontak Resmi & Komunikasi</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pertanyaan teknis, evaluasi review startup, atau konfirmasi implementasi dapat dikirimkan
                melalui email resmi domain pengembang:
              </p>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="text-xs text-slate-500 block">Surel Perusahaan/Domain:</span>
                <a
                  href="mailto:mail@dev.spp-smapersiapan.web.id"
                  className="font-bold text-emerald-600 hover:text-emerald-700 text-sm underline"
                >
                  mail@dev.spp-smapersiapan.web.id
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-400 py-12 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center">
              S
            </div>
            <div>
              <span className="font-bold text-white">SISMA</span>
              <span className="text-xs block text-slate-500">
                Sistem Informasi Keuangan Sekolah • SMA Swasta Persiapan Stabat
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Login Pengguna
            </Link>
            <a
              href="mailto:mail@dev.spp-smapersiapan.web.id"
              className="hover:text-white transition-colors"
            >
              Kontak Email
            </a>
          </div>

          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} SISMA NEW. Seluruh data demonstrasi menggunakan data sintetis.
          </div>
        </div>
      </footer>
    </div>
  );
}
