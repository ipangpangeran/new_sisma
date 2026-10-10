import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export const BULAN_SPP = [
  { urutan: 1, nama: "Juli" },
  { urutan: 2, nama: "Agustus" },
  { urutan: 3, nama: "September" },
  { urutan: 4, nama: "Oktober" },
  { urutan: 5, nama: "November" },
  { urutan: 6, nama: "Desember" },
  { urutan: 7, nama: "Januari" },
  { urutan: 8, nama: "Februari" },
  { urutan: 9, nama: "Maret" },
  { urutan: 10, nama: "April" },
  { urutan: 11, nama: "Mei" },
  { urutan: 12, nama: "Juni" },
];
