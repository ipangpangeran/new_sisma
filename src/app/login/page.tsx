"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, ShieldCheck, UserCheck, KeyRound, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Gagal masuk ke sistem.");
        setLoading(false);
        return;
      }

      // Successful login
      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan. Coba beberapa saat lagi.");
      setLoading(false);
    }
  };

  const fillCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6 ml-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Halaman Utama
        </Link>

        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-600 text-white items-center justify-center font-black text-2xl shadow-lg shadow-emerald-600/30">
            S
          </div>
          <h2 className="mt-4 text-2xl font-black text-slate-900 tracking-tight">
            Masuk ke SISMA NEW
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Sistem Informasi Keuangan & Loket SPP Sekolah
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-200/80">
          <form className="space-y-5" onSubmit={handleLogin}>
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Pengguna (Username)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: bendahara"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Memverifikasi...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Masuk ke Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Reviewer / Demo Credentials Helper */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Akun Demonstrasi Sintetis
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Klik salah satu akun di bawah untuk mengisi formulir login secara instan:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillCredentials("bendahara", "bendahara123")}
                className="w-full text-left p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-emerald-950 block">Bendahara Sekolah</span>
                  <span className="text-[11px] text-emerald-700">User: bendahara | Sandi: bendahara123</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                  Gunakan
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials("admin", "admin123")}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800 block">Administrator Sistem</span>
                  <span className="text-[11px] text-slate-500">User: admin | Sandi: admin123</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  Gunakan
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-500">
          SISMA — Sistem Informasi Keuangan Sekolah • SMA Swasta Persiapan Stabat
        </div>
      </div>
    </div>
  );
}
