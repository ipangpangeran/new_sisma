"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Sparkles,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  Cpu,
  Info,
  Calendar,
  Send,
  Loader2,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface MonthStat {
  bulan: string;
  urutan: number;
  billed: number;
  collected: number;
  outstanding: number;
  paidStudents: number;
  totalStudents: number;
}

interface ReportData {
  academicYear: string;
  totalStudents: number;
  totalMonthlyBilled: number;
  totalMonthlyCollected: number;
  totalMonthlyOutstanding: number;
  collectionRatePercentage: number;
  totalCashIncome: number;
  totalCashExpense: number;
  netCashBalance: number;
  monthlyStats: MonthStat[];
}

interface AiResponse {
  success: boolean;
  summary?: string;
  model?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  disclaimer: string;
  error?: string;
  isConfigured: boolean;
  requestedBy?: string;
}

export default function ReportsAndAiPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loadingReport, setLoadingReport] = useState(true);

  // AI Assistant State
  const [promptInput, setPromptInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiResponse | null>(null);

  useEffect(() => {
    fetch("/api/reports/summary")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setReport(data);
      })
      .catch((err) => console.error("Report fetch error:", err))
      .finally(() => setLoadingReport(false));
  }, []);

  const handleGenerateAiSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);

    try {
      const res = await fetch("/api/ai/report-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptInput }),
      });

      const data = await res.json();
      setAiResult(data);
    } catch {
      setAiResult({
        success: false,
        isConfigured: false,
        disclaimer: "Terjadi gangguan koneksi ke server.",
        error: "Gagal menghubungkan ke endpoint AI server.",
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Laporan Rekapitulasi & AI Financial Assistant
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tahun Ajaran: <strong className="text-slate-800">{report?.academicYear}</strong> • SMA Swasta Persiapan Stabat
        </p>
      </div>

      {/* SECTION 1: AI FINANCIAL REPORT ASSISTANT (PHASE 5) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">AI Financial Report Assistant</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 font-bold">
                  Anthropic Claude 3.5 Sonnet
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Meringkas kesehatan keuangan berdasarkan agregat riil database secara otomatis dan aman (Zero PII).
              </p>
            </div>
          </div>
        </div>

        {/* AI Input Form */}
        <form onSubmit={handleGenerateAiSummary} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Contoh: Buat analisis ringkas performa penagihan kuartal pertama dan saran tindak lanjut..."
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-xs hover:from-purple-600 hover:to-indigo-600 shadow-md shadow-purple-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menganalisis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Jalankan Analisis AI</span>
                </>
              )}
            </button>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>
              Sistem hanya mengirimkan angka agregat total kas dan SPP. Nama siswa, NIS, dan data personal tidak pernah dikirimkan.
            </span>
          </div>
        </form>

        {/* AI Result Card */}
        {aiResult && (
          <div className="mt-4 p-5 rounded-2xl bg-slate-950/80 border border-purple-500/40 space-y-4">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
              <span className="font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Hasil Ringkasan Analisis Keuangan
              </span>
              {aiResult.model && (
                <span className="font-mono text-[10px] text-slate-400">
                  Model: {aiResult.model} • Tokens: {(aiResult.usage?.inputTokens || 0) + (aiResult.usage?.outputTokens || 0)}
                </span>
              )}
            </div>

            {aiResult.success && aiResult.summary ? (
              <div className="space-y-4">
                <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line bg-slate-900/60 p-4 rounded-xl border border-slate-800 font-sans">
                  {aiResult.summary}
                </div>

                <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/60 text-[11px] text-purple-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{aiResult.disclaimer}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-xs text-rose-200 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">Status Integrasi Anthropic API</span>
                    <span>{aiResult.error}</span>
                  </div>
                </div>

                {!aiResult.isConfigured && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 space-y-2">
                    <span className="font-bold text-white block">Cara Mengaktifkan Fitur Claude API:</span>
                    <ol className="list-decimal pl-5 space-y-1 text-slate-400 text-[11px]">
                      <li>Buka berkas <code className="text-purple-300">.env</code> di root folder proyek SISMA NEW.</li>
                      <li>Masukkan API Key resmi Anda: <code className="text-purple-300">ANTHROPIC_API_KEY=&quot;sk-ant-api03-...&quot;</code></li>
                      <li>Simpan berkas dan tekan kembali tombol <strong>Jalankan Analisis AI</strong> di atas.</li>
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION 2: 12-MONTH SPP RECAP TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Rekapitulasi Penagihan SPP Bulanan (12 Bulan)
            </h3>
          </div>
          <span className="text-xs text-slate-500">T.A. {report?.academicYear}</span>
        </div>

        {loadingReport ? (
          <div className="p-12 text-center text-xs text-slate-500">Memuat rekapitulasi data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Urutan & Bulan</th>
                  <th className="px-5 py-3 text-right">Target Tagihan</th>
                  <th className="px-5 py-3 text-right">Realisasi Masuk</th>
                  <th className="px-5 py-3 text-right">Sisa Tunggakan</th>
                  <th className="px-5 py-3 text-center">Siswa Lunas</th>
                  <th className="px-5 py-3 text-right">Rasio Capaian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report?.monthlyStats.map((m) => {
                  const rate = m.billed > 0 ? (m.collected / m.billed) * 100 : 0;
                  return (
                    <tr key={m.urutan} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {m.urutan}. {m.bulan}
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-slate-700">
                        {formatRupiah(m.billed)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-emerald-600">
                        {formatRupiah(m.collected)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-rose-600">
                        {formatRupiah(m.outstanding)}
                      </td>
                      <td className="px-5 py-3.5 text-center font-semibold text-slate-800">
                        {m.paidStudents} / {m.totalStudents} Siswa
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                            rate >= 100
                              ? "bg-emerald-100 text-emerald-800"
                              : rate > 0
                              ? "bg-blue-100 text-blue-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {rate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
