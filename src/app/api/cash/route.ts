import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const entries = await prisma.kas.findMany({
      orderBy: { tgl: "desc" },
      include: {
        user: { select: { namaLengkap: true } },
        posBayar: { select: { namaPosBayar: true } },
      },
    });

    const totalIncome = entries.reduce((acc, e) => acc + e.pemasukan, 0);
    const totalExpense = entries.reduce((acc, e) => acc + e.pengeluaran, 0);
    const balance = totalIncome - totalExpense;

    return NextResponse.json({
      success: true,
      summary: {
        totalIncome,
        totalExpense,
        balance,
      },
      data: entries,
    });
  } catch (error) {
    console.error("Cash ledger fetch error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data jurnal kas." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || (session.level !== "admin" && session.level !== "bendahara")) {
      return NextResponse.json(
        { error: "Akses ditolak. Memerlukan hak akses admin atau bendahara." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { uraian, nominal, jenis, idPosBayar } = body;

    if (!uraian || !nominal || !jenis) {
      return NextResponse.json(
        { error: "Uraian, nominal, dan jenis kas wajib diisi." },
        { status: 400 }
      );
    }

    const amount = Number(nominal);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Nominal harus berupa angka positif." },
        { status: 400 }
      );
    }

    const pemasukan = jenis === "masuk" ? amount : 0;
    const pengeluaran = jenis === "keluar" ? amount : 0;

    const newKas = await prisma.kas.create({
      data: {
        uraian: String(uraian).trim(),
        pemasukan,
        pengeluaran,
        jenis: jenis === "masuk" ? "masuk" : "keluar",
        idUser: session.userId,
        idPosBayar: idPosBayar ? Number(idPosBayar) : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Transaksi kas berhasil dicatat.",
      data: newKas,
    });
  } catch (error) {
    console.error("Cash ledger creation error:", error);
    return NextResponse.json(
      { error: "Gagal mencatat transaksi kas." },
      { status: 500 }
    );
  }
}
