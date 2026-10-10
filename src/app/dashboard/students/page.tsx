"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Plus,
  Filter,
  CheckCircle,
  Archive,
  Phone,
  BookOpen,
  X,
  AlertCircle,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface StudentItem {
  id: number;
  nis: string | null;
  nisn: string | null;
  namaSiswa: string;
  jenisKelamin: string;
  idKelas: number;
  namaKelas: string;
  hpSiswa: string | null;
  hpOrtu: string | null;
  statusSiswa: string;
  totalBilled: number;
  totalPaid: number;
  totalOutstanding: number;
  monthsPaidCount: number;
}

interface ClassItem {
  id: number;
  namaKelas: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorModal, setErrorModal] = useState("");
  const [formData, setFormData] = useState({
    namaSiswa: "",
    nis: "",
    nisn: "",
    jenisKelamin: "L",
    idKelas: "",
    hpSiswa: "",
    hpOrtu: "",
  });

  const fetchStudents = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (classFilter) params.set("classId", classFilter);

    fetch(`/api/students?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStudents(data.data);
      })
      .catch((err) => console.error("Error fetching students:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/classes")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setClasses(data.data);
          if (data.data.length > 0 && !formData.idKelas) {
            setFormData((prev) => ({ ...prev, idKelas: String(data.data[0].id) }));
          }
        }
      });
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [search, classFilter]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorModal("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorModal(json.error || "Gagal menambahkan siswa.");
        setSubmitting(false);
        return;
      }

      setShowAddModal(false);
      setFormData({
        namaSiswa: "",
        nis: "",
        nisn: "",
        jenisKelamin: "L",
        idKelas: classes[0]?.id ? String(classes[0].id) : "",
        hpSiswa: "",
        hpOrtu: "",
      });
      fetchStudents();
    } catch {
      setErrorModal("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchiveStudent = async (id: number, nama: string) => {
    if (!confirm(`Arsipkan status siswa ${nama} menjadi ALUMNI?`)) return;

    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok) {
        alert(json.message);
        fetchStudents();
      } else {
        alert(json.error || "Gagal mengarsipkan siswa.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Direktori Siswa & Rombongan Belajar
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar siswa aktif, penetapan kelas, dan pemantauan billing SPP 12 bulan
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Siswa Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama, NIS, atau NISN..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Semua Rombel / Kelas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.namaKelas}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span>Memuat direktori siswa...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Tidak ditemukan siswa yang cocok dengan pencarian Anda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Nama Siswa & NIS</th>
                  <th className="px-5 py-3">Kelas</th>
                  <th className="px-5 py-3">Status SPP (12 Bulan)</th>
                  <th className="px-5 py-3">Terbayar</th>
                  <th className="px-5 py-3">Sisa Tunggakan</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{s.namaSiswa}</div>
                      <div className="text-[11px] text-slate-400">
                        NIS: {s.nis || "-"} &bull; NISN: {s.nisn || "-"} &bull; ({s.jenisKelamin})
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-700">
                      {s.namaKelas}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{s.monthsPaidCount}/12</span>
                        <span className="text-[11px] text-slate-500">Bulan Lunas</span>
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div
                          style={{ width: `${(s.monthsPaidCount / 12) * 100}%` }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-emerald-600">
                      {formatRupiah(s.totalPaid)}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-rose-600">
                      {formatRupiah(s.totalOutstanding)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.statusSiswa === "AKTIF"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {s.statusSiswa}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleArchiveStudent(s.id, s.namaSiswa)}
                        title="Arsipkan Siswa"
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Archive className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: TAMBAH SISWA BARU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-lg text-slate-900">
                Tambah Siswa Baru & Auto-Generate SPP
              </h3>
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

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  value={formData.namaSiswa}
                  onChange={(e) => setFormData({ ...formData, namaSiswa: e.target.value })}
                  placeholder="Contoh: Muhammad Farhan"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIS Siswa</label>
                  <input
                    type="text"
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    placeholder="Contoh: 260401"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NISN (Nasional)</label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="Contoh: 0089123401"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rombel / Kelas *</label>
                  <select
                    required
                    value={formData.idKelas}
                    onChange={(e) => setFormData({ ...formData, idKelas: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.namaKelas}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="L">Laki-Laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
                ℹ️ Sistem akan secara otomatis membangkitkan <strong>12 slot tagihan SPP</strong> (Juli – Juni) pada tarif standar Rp 250.000 untuk siswa ini.
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
                  {submitting ? "Menyimpan..." : "Simpan Siswa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
