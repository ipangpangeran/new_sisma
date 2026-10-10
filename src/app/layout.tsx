import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SISMA — Sistem Informasi Keuangan Sekolah",
  description:
    "SISMA is a web-based school finance management application designed to help school administrators organize student tuition payments, review payment status, and maintain financial records in one place.",
  keywords: [
    "SISMA",
    "School Finance Management",
    "Sistem Informasi SPP",
    "Keuangan Sekolah",
    "Tuition Management",
    "SMA Swasta Persiapan Stabat",
  ],
  authors: [{ name: "SISMA Development Team" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "SISMA — School Fee Management, Made Simpler",
    description:
      "Modern web-based school tuition and finance management SaaS for Indonesian schools.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
