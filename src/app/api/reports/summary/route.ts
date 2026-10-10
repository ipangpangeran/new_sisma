import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BULAN_SPP } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const activeTA = await prisma.tahunAjaran.findFirst({
      where: { status: "AKTIF" },
    });

    const totalStudents = await prisma.siswa.count({
      where: { statusSiswa: "AKTIF" },
    });

    const tagihanAll = await prisma.tagihanBulanan.findMany({
      select: {
        tarif: true,
        statusBayar: true,
        bulan: true,
        urutanBulan: true,
        siswa: {
          select: {
            idKelas: true,
            kelas: { select: { namaKelas: true } },
          },
        },
      },
    });

    const totalMonthlyBilled = tagihanAll.reduce((acc, t) => acc + t.tarif, 0);
    const totalMonthlyCollected = tagihanAll
      .filter((t) => t.statusBayar === "LUNAS")
      .reduce((acc, t) => acc + t.tarif, 0);
    const totalMonthlyOutstanding = totalMonthlyBilled - totalMonthlyCollected;
    const collectionRatePercentage =
      totalMonthlyBilled > 0 ? (totalMonthlyCollected / totalMonthlyBilled) * 100 : 0;

    // Monthly breakdown
    const monthlyStats = BULAN_SPP.map((b) => {
      const monthItems = tagihanAll.filter((t) => t.urutanBulan === b.urutan);
      const billed = monthItems.reduce((acc, t) => acc + t.tarif, 0);
      const collected = monthItems
        .filter((t) => t.statusBayar === "LUNAS")
        .reduce((acc, t) => acc + t.tarif, 0);
      const paidStudents = monthItems.filter((t) => t.statusBayar === "LUNAS").length;
      return {
        bulan: b.nama,
        urutan: b.urutan,
        billed,
        collected,
        outstanding: billed - collected,
        paidStudents,
        totalStudents: monthItems.length,
      };
    });

    // Cash Ledger Summary
    const kasAll = await prisma.kas.findMany({
      select: { pemasukan: true, pengeluaran: true },
    });
    const totalCashIncome = kasAll.reduce((acc, k) => acc + k.pemasukan, 0);
    const totalCashExpense = kasAll.reduce((acc, k) => acc + k.pengeluaran, 0);
    const netCashBalance = totalCashIncome - totalCashExpense;

    return NextResponse.json({
      success: true,
      academicYear: activeTA?.tahunAjaran || "2026/2027",
      totalStudents,
      totalMonthlyBilled,
      totalMonthlyCollected,
      totalMonthlyOutstanding,
      collectionRatePercentage,
      totalCashIncome,
      totalCashExpense,
      netCashBalance,
      monthlyStats,
    });
  } catch (error) {
    console.error("Report summary error:", error);
    return NextResponse.json(
      { error: "Gagal menghitung ringkasan laporan keuangan." },
      { status: 500 }
    );
  }
}
