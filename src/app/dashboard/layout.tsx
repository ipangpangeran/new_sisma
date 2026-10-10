"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BookOpen,
  BarChart3,
  LogOut,
  Building,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Shield,
} from "lucide-react";

interface UserSession {
  userId: number;
  username: string;
  namaLengkap: string;
  level: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      })
      .catch(() => {
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const navItems = [
    {
      label: "Ringkasan Keuangan",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Loket Pembayaran SPP",
      href: "/dashboard/payments",
      icon: CreditCard,
      active: pathname === "/dashboard/payments",
    },
    {
      label: "Direktori Siswa & Kelas",
      href: "/dashboard/students",
      icon: Users,
      active: pathname === "/dashboard/students",
    },
    {
      label: "Jurnal Kas Operasional",
      href: "/dashboard/cash",
      icon: BookOpen,
      active: pathname === "/dashboard/cash",
    },
    {
      label: "Laporan & Asisten AI",
      href: "/dashboard/reports",
      icon: BarChart3,
      badge: "Claude AI",
      active: pathname === "/dashboard/reports",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Memuat sesi pengguna SISMA...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="h-16 border-b border-slate-800 px-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-white text-lg shadow-md shadow-emerald-500/30">
              S
            </div>
            <div>
              <span className="font-extrabold text-white tracking-tight text-lg">SISMA NEW</span>
              <span className="block text-[10px] text-emerald-400 font-medium">Finance SaaS</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Institution Info Card */}
        <div className="p-4 mx-4 mt-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Building className="w-3.5 h-3.5" /> SMA Swasta Persiapan
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5">T.A. 2026/2027 (Aktif)</p>
          <div className="mt-2 text-[10px] inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Database Terisolasi</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  item.active
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white uppercase">
                {user?.username?.slice(0, 2) || "US"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.namaLengkap}</p>
                <span className="text-[10px] text-emerald-400 uppercase font-semibold">
                  Role: {user?.level}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar (Logout)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block text-xs text-slate-500">
              Sistem Informasi Keuangan Sekolah &bull;{" "}
              <span className="font-semibold text-slate-700">SMA Swasta Persiapan Stabat</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sesi Terenkripsi Aktif</span>
            </div>
            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
            >
              Lihat Web Publik &rarr;
            </Link>
          </div>
        </header>

        {/* Child Pages */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
