import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateFinancialSummaryWithClaude, FinancialAggregatePayload } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    // 1. Server-side Authentication & Authorization Check
    const session = await getSession(req);
    if (!session || (session.level !== "admin" && session.level !== "bendahara")) {
      return NextResponse.json(
        {
          error: "Akses ditolak. Fitur AI Financial Report Assistant hanya dapat diakses oleh administrator dan bendahara terotentikasi.",
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const userPrompt = typeof body.prompt === "string" ? body.prompt.trim() : undefined;

    // 2. Fetch fresh aggregates from database (NEVER fetch or send student PII)
    const activeTA = await prisma.tahunAjaran.findFirst({
      where: { status: "AKTIF" },
    });

    const totalStudents = await prisma.siswa.count({
      where: { statusSiswa: "AKTIF" },
    });

    const tagihanAll = await prisma.tagihanBulanan.findMany({
      select: { tarif: true, statusBayar: true },
    });

    const totalMonthlyBilled = tagihanAll.reduce((acc, t) => acc + t.tarif, 0);
    const totalMonthlyCollected = tagihanAll
      .filter((t) => t.statusBayar === "LUNAS")
      .reduce((acc, t) => acc + t.tarif, 0);
    const totalMonthlyOutstanding = totalMonthlyBilled - totalMonthlyCollected;
    const collectionRatePercentage =
      totalMonthlyBilled > 0 ? (totalMonthlyCollected / totalMonthlyBilled) * 100 : 0;

    const kasAll = await prisma.kas.findMany({
      select: { pemasukan: true, pengeluaran: true },
    });
    const totalCashIncome = kasAll.reduce((acc, k) => acc + k.pemasukan, 0);
    const totalCashExpense = kasAll.reduce((acc, k) => acc + k.pengeluaran, 0);
    const netCashBalance = totalCashIncome - totalCashExpense;

    const aggregatePayload: FinancialAggregatePayload = {
      academicYear: activeTA?.tahunAjaran || "2026/2027",
      totalStudents,
      totalMonthlyBilled,
      totalMonthlyCollected,
      totalMonthlyOutstanding,
      totalCashIncome,
      totalCashExpense,
      netCashBalance,
      collectionRatePercentage,
    };

    // 3. Call Claude Integration
    const result = await generateFinancialSummaryWithClaude(aggregatePayload, userPrompt);

    return NextResponse.json({
      ...result,
      aggregates: aggregatePayload,
      requestedBy: session.namaLengkap,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI Report Assistant error:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan internal saat memproses ringkasan laporan keuangan AI.",
      },
      { status: 500 }
    );
  }
}
