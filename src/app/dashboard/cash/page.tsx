"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  X,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";

interface CashEntry {
  id: number;
  tgl: string;
  uraian: string;
  pemasukan: number;
  pengeluaran: number;
  jenis: "masuk" | "keluar";
  user: { namaLengkap: string };
  posBayar?: { namaPosBayar: string } | null;
}

interface CashSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export default function CashLedgerPage() {
  const [entries, setEntries] = useState<CashEntry[]>([]);
  const [summary, setSummary] = useState<CashSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [filterType, setFilterType] = useState<"all" | "masuk" | "keluar">("all");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorModal, setErrorModal] = useState("");
  const [formData, setFormData] = useState({
    uraian: "",
    nominal: "",
    jenis: "masuk",
  });

  const fetchCash = () => {
    setLoading(true);
    fetch("/api/cash")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setEntries(data.data);
          setSummary(data.summary);
        }
      })
      .catch((err) => console.error("Error fetching cash:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCash();
  }, []);

  const handleCreateCash = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorModal("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/cash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorModal(json.error || "Gagal mencatat kas.");
        setSubmitting(false);
        return;
      }

      setShowAddModal(false);
      setFormData({ uraian: "", nominal: "", jenis: "masuk" });
      fetchCash();
    } catch {
      setErrorModal("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredEntries = entries.filter((e) => {
    if (filterType === "all") return true;
    return e.jenis === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Jurnal Kas Operasional Sekolah
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan arus kas masuk (pemasukan) dan arus kas keluar (pengeluaran) operasional
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Transaksi Kas</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Total Pemasukan Kas</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {formatRupiah(summary.totalIncome)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Termasuk penerimaan SPP & BOS</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Total Pengeluaran Kas</span>
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700">
            {formatRupiah(summary.totalExpense)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Biaya listrik, ATK & pemeliharaan</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Saldo Kas Bersih</span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatRupiah(summary.balance)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Posisi surplus kas</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterType("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterType === "all"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Semua Arus Kas
        </button>
        <button
          onClick={() => setFilterType("masuk")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterType === "masuk"
              ? "bg-emerald-600 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Pemasukan Saja
        </button>
        <button
          onClick={() => setFilterType("keluar")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterType === "keluar"
              ? "bg-rose-600 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Pengeluaran Saja
        </button>
      </div>

      {/* Cash Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Memuat jurnal kas...</div>
        ) : filteredEntries.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Tidak ada transaksi kas yang tercatat.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3">Uraian Transaksi</th>
                  <th className="px-5 py-3">Jenis Kas</th>
                  <th className="px-5 py-3 text-right">Pemasukan</th>
                  <th className="px-5 py-3 text-right">Pengeluaran</th>
                  <th className="px-5 py-3">Petugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEntries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                      {formatDate(e.tgl)}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{e.uraian}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          e.jenis === "masuk"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {e.jenis === "masuk" ? "KAS MASUK" : "KAS KELUAR"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-emerald-600">
                      {e.pemasukan > 0 ? formatRupiah(e.pemasukan) : "-"}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-rose-600">
                      {e.pengeluaran > 0 ? formatRupiah(e.pengeluaran) : "-"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{e.user.namaLengkap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: TAMBAH TRANSAKSI KAS */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-base text-slate-900">Catat Jurnal Kas Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorModal && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorModal}</span>
              </div>
            )}

            <form onSubmit={handleCreateCash} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Arus Kas</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, jenis: "masuk" })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      formData.jenis === "masuk"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    Pemasukan (Masuk)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, jenis: "keluar" })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      formData.jenis === "keluar"
                        ? "bg-rose-600 text-white border-rose-600"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    Pengeluaran (Keluar)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Uraian / Keterangan Transaksi *
                </label>
                <input
                  type="text"
                  required
                  value={formData.uraian}
                  onChange={(e) => setFormData({ ...formData, uraian: e.target.value })}
                  placeholder="Contoh: Pengadaan Modul Ajar dan ATK"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nominal (Rupiah) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.nominal}
                  onChange={(e) => setFormData({ ...formData, nominal: e.target.value })}
                  placeholder="Contoh: 500000"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan ke Kas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
