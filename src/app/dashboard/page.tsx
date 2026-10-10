"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Users,
  TrendingUp,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Sparkles,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";

interface SummaryData {
  academicYear: string;
  totalStudents: number;
  totalMonthlyBilled: number;
  totalMonthlyCollected: number;
  totalMonthlyOutstanding: number;
  collectionRatePercentage: number;
  totalCashIncome: number;
  totalCashExpense: number;
  netCashBalance: number;
}

interface PaymentHistoryItem {
  id: number;
  noRef: string;
  tglBayar: string;
  jumlahBayar: number;
  bulan: string;
  siswa: {
    nama: string;
    nis: string;
    kelas: string;
  };
  kasir: string;
}

export default function DashboardOverviewPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [history, setHistory] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/reports/summary").then((r) => r.json()),
      fetch("/api/payments/history?limit=6").then((r) => r.json()),
    ])
      .then(([summaryRes, historyRes]) => {
        if (summaryRes.success) setSummary(summaryRes);
        if (historyRes.success) setHistory(historyRes.data);
      })
      .catch((err) => console.error("Dashboard error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-500">Menghitung agregat keuangan dari database...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Ringkasan Keuangan Sekolah
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tahun Ajaran: <strong className="text-slate-800">{summary?.academicYear}</strong> • SMA Swasta Persiapan Stabat
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/payments"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Loket Bayar SPP</span>
          </Link>
          <Link
            href="/dashboard/reports"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analisis AI</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: SPP Terkumpul */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>SPP Terbayar (Realisasi)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatRupiah(summary?.totalMonthlyCollected || 0)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <span>Tercapai: {summary?.collectionRatePercentage?.toFixed(1)}%</span>
            <span className="text-slate-400 font-normal">dari total kuota tahunan</span>
          </div>
        </div>

        {/* Card 2: Tunggakan SPP */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Sisa Tunggakan SPP</span>
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700">
            {formatRupiah(summary?.totalMonthlyOutstanding || 0)}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Target Penuh: {formatRupiah(summary?.totalMonthlyBilled || 0)}
          </div>
        </div>

        {/* Card 3: Saldo Kas Bersih */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Saldo Kas Operasional</span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatRupiah(summary?.netCashBalance || 0)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span className="text-emerald-600 font-medium">+{formatRupiah(summary?.totalCashIncome || 0)}</span>
            <span>&bull;</span>
            <span className="text-rose-600 font-medium">-{formatRupiah(summary?.totalCashExpense || 0)}</span>
          </div>
        </div>

        {/* Card 4: Siswa Terdaftar */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Siswa Aktif Terdaftar</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {summary?.totalStudents || 0}{" "}
            <span className="text-sm font-semibold text-slate-500">Siswa</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            100% dialokasikan 12 bulan billing
          </div>
        </div>
      </div>

      {/* Progress & Collection Status Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900">Progres Penagihan SPP Tahun Ajaran {summary?.academicYear}</span>
            <span className="text-slate-400 ml-2">Realisasi vs Target Pembukuan</span>
          </div>
          <span className="font-mono font-bold text-emerald-600">
            {summary?.collectionRatePercentage?.toFixed(1)}% Terpenuhi
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${Math.min(summary?.collectionRatePercentage || 0, 100)}%` }}
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span>Terkumpul: {formatRupiah(summary?.totalMonthlyCollected || 0)}</span>
          <span>Tunggakan: {formatRupiah(summary?.totalMonthlyOutstanding || 0)}</span>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Transaksi Pembayaran Terakhir
            </h2>
          </div>
          <Link
            href="/dashboard/payments"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Buka Loket Lengkap &rarr;
          </Link>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Belum ada transaksi pembayaran yang dicatat.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">No. Referensi</th>
                  <th className="px-5 py-3">Nama Siswa & Kelas</th>
                  <th className="px-5 py-3">Bulan SPP</th>
                  <th className="px-5 py-3">Nominal Bayar</th>
                  <th className="px-5 py-3">Tanggal Bayar</th>
                  <th className="px-5 py-3">Petugas Kasir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-semibold text-slate-800">
                      {item.noRef}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{item.siswa.nama}</div>
                      <div className="text-[11px] text-slate-400">
                        NIS: {item.siswa.nis} &bull; {item.siswa.kelas}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
                        SPP {item.bulan}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-emerald-600">
                      {formatRupiah(item.jumlahBayar)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{formatDate(item.tglBayar)}</td>
                    <td className="px-5 py-3.5 text-slate-600">{item.kasir}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
