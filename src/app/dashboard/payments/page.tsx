"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  Search,
  CheckCircle,
  AlertCircle,
  Receipt,
  Printer,
  X,
  UserCheck,
  Calendar,
  Building,
} from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";

interface StudentOption {
  id: number;
  nis: string | null;
  namaSiswa: string;
  namaKelas: string;
}

interface MonthlyBillingSlot {
  id: number;
  bulan: string;
  urutanBulan: number;
  tarif: number;
  statusBayar: "BELUM_BAYAR" | "LUNAS";
  pembayaranBulanan: Array<{
    id: number;
    noRef: string;
    tglBayar: string;
    jumlahBayar: number;
    user: { namaLengkap: string };
  }>;
}

interface StudentDetail {
  id: number;
  nis: string | null;
  namaSiswa: string;
  kelas: { namaKelas: string };
  tagihanBulanan: MonthlyBillingSlot[];
}

interface ReceiptData {
  noRef: string;
  tglBayar: string;
  jumlahBayar: number;
  siswa: string;
  nis: string | null;
  bulan: string;
  kasir: string;
}

export default function SppPaymentCounterPage() {
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [studentDetail, setStudentDetail] = useState<StudentDetail | null>(null);
  const [search, setSearch] = useState("");
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [payingMonthId, setPayingMonthId] = useState<number | null>(null);

  // Digital Receipt Modal
  const [activeReceipt, setActiveReceipt] = useState<ReceiptData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setStudents(data.data);
          setSelectedStudentId(data.data[0].id);
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedStudentId) return;
    setLoadingDetail(true);
    setErrorMessage("");

    fetch(`/api/students/${selectedStudentId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStudentDetail(data.data);
      })
      .catch((err) => console.error("Error loading student detail:", err))
      .finally(() => setLoadingDetail(false));
  }, [selectedStudentId]);

  const handlePayMonth = async (slot: MonthlyBillingSlot) => {
    if (slot.statusBayar === "LUNAS") return;
    if (!confirm(`Konfirmasi pembayaran SPP bulan ${slot.bulan} sebesar ${formatRupiah(slot.tarif)}?`)) {
      return;
    }

    setPayingMonthId(slot.id);
    setErrorMessage("");

    try {
      const res = await fetch("/api/payments/spp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idTagihanBulanan: slot.id,
          jumlahBayar: slot.tarif,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.error || "Gagal mencatat pembayaran.");
        setPayingMonthId(null);
        return;
      }

      // Show digital receipt modal
      setActiveReceipt(json.receipt);

      // Refresh student detail
      if (selectedStudentId) {
        const refreshed = await fetch(`/api/students/${selectedStudentId}`).then((r) => r.json());
        if (refreshed.success) setStudentDetail(refreshed.data);
      }
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan.");
    } finally {
      setPayingMonthId(null);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.namaSiswa.toLowerCase().includes(search.toLowerCase()) ||
      (s.nis && s.nis.includes(search))
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Loket Pembayaran SPP Siswa (12 Bulan)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan langsung tagihan bulanan dengan verifikasi server dan kwitansi digital
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Left Student Selector, Right 12-Month Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Student Selector */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Search className="w-4 h-4 text-emerald-600" />
            <span>Pilih Siswa</span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ketik nama atau NIS siswa..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-1">
            {filteredStudents.map((s) => {
              const isSelected = s.id === selectedStudentId;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudentId(s.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all my-1 flex items-center justify-between ${
                    isSelected
                      ? "bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold"
                      : "hover:bg-slate-50 text-slate-700 border border-transparent"
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{s.namaSiswa}</div>
                    <div className="text-[11px] text-slate-400 font-normal">
                      NIS: {s.nis || "-"} &bull; {s.namaKelas}
                    </div>
                  </div>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: 12-Month Matrix */}
        <div className="lg:col-span-2 space-y-6">
          {loadingDetail || !studentDetail ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              Memuat data billing siswa...
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              {/* Student Header Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                    Siswa Terpilih
                  </span>
                  <h2 className="text-xl font-black text-slate-900">
                    {studentDetail.namaSiswa}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    NIS: {studentDetail.nis || "-"} &bull; Kelas: {studentDetail.kelas.namaKelas} &bull; T.A. 2026/2027
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Status Pelunasan</span>
                    <span className="text-xs font-black text-emerald-700">
                      {studentDetail.tagihanBulanan.filter((t) => t.statusBayar === "LUNAS").length} dari 12 Bulan
                    </span>
                  </div>
                </div>
              </div>

              {/* 12 Months Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {studentDetail.tagihanBulanan.map((slot) => {
                  const isPaid = slot.statusBayar === "LUNAS";
                  const paymentRecord = slot.pembayaranBulanan[0];

                  return (
                    <div
                      key={slot.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isPaid
                          ? "bg-emerald-50/70 border-emerald-300"
                          : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-extrabold text-sm text-slate-900">
                            {slot.bulan}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isPaid
                                ? "bg-emerald-200 text-emerald-900"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {isPaid ? "LUNAS" : "BELUM BAYAR"}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-600">
                          {formatRupiah(slot.tarif)}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60">
                        {isPaid ? (
                          <div className="space-y-2">
                            <div className="text-[10px] text-emerald-800 font-mono truncate">
                              Ref: {paymentRecord?.noRef}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setActiveReceipt({
                                  noRef: paymentRecord?.noRef || "SPP-REF",
                                  tglBayar: paymentRecord?.tglBayar || new Date().toISOString(),
                                  jumlahBayar: slot.tarif,
                                  siswa: studentDetail.namaSiswa,
                                  nis: studentDetail.nis,
                                  bulan: slot.bulan,
                                  kasir: paymentRecord?.user.namaLengkap || "Bendahara",
                                })
                              }
                              className="w-full py-1.5 px-2 rounded-xl text-[11px] font-bold bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>Lihat Kwitansi</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={payingMonthId === slot.id}
                            onClick={() => handlePayMonth(slot)}
                            className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{payingMonthId === slot.id ? "Memproses..." : "Bayar Sekarang"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: KWITANSI RESMI DIGITAL PEMBAYARAN */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            {/* Header Sekolah */}
            <div className="text-center pb-4 border-b border-slate-200 relative">
              <button
                onClick={() => setActiveReceipt(null)}
                className="absolute right-0 top-0 p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                Kwitansi Pembayaran Sah
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mt-1">
                SMA SWASTA PERSIAPAN STABAT
              </h3>
              <p className="text-[10px] text-slate-400">
                Jl. KH. Zainul Arifin No. 12, Stabat &bull; Telp: (061) 8912345
              </p>
            </div>

            {/* Receipt Body */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Nomor Referensi:</span>
                <span className="font-mono font-bold text-slate-900">{activeReceipt.noRef}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Tanggal Bayar:</span>
                <span className="font-semibold text-slate-900">{formatDate(activeReceipt.tglBayar)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Nama Siswa:</span>
                <span className="font-bold text-slate-900">{activeReceipt.siswa}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">NIS Siswa:</span>
                <span className="font-mono text-slate-900">{activeReceipt.nis || "-"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Pembayaran Iuran:</span>
                <span className="font-bold text-emerald-700">SPP Bulan {activeReceipt.bulan}</span>
              </div>
              <div className="flex justify-between py-2 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-900">Total Nominal:</span>
                <span className="font-black text-emerald-950 text-sm">
                  {formatRupiah(activeReceipt.jumlahBayar)}
                </span>
              </div>
              <div className="flex justify-between py-1 text-[11px] text-slate-500">
                <span>Petugas Bendahara:</span>
                <span className="font-semibold text-slate-700">{activeReceipt.kasir}</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400 italic">
              * Bukti pembayaran ini telah dicatat dan terverifikasi secara sah dalam pembukuan kas sekolah.
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Kwitansi</span>
              </button>
              <button
                onClick={() => setActiveReceipt(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
