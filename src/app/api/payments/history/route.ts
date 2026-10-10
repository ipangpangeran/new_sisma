import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 20;

    const payments = await prisma.pembayaranBulanan.findMany({
      take: limit,
      orderBy: { tglBayar: "desc" },
      include: {
        tagihanBulanan: {
          include: {
            siswa: {
              include: { kelas: true },
            },
          },
        },
        user: {
          select: { namaLengkap: true, username: true },
        },
      },
    });

    const formatted = payments.map((p) => ({
      id: p.id,
      noRef: p.noRef,
      tglBayar: p.tglBayar,
      jumlahBayar: p.jumlahBayar,
      bulan: p.tagihanBulanan.bulan,
      urutanBulan: p.tagihanBulanan.urutanBulan,
      siswa: {
        id: p.tagihanBulanan.siswa.id,
        nama: p.tagihanBulanan.siswa.namaSiswa,
        nis: p.tagihanBulanan.siswa.nis,
        kelas: p.tagihanBulanan.siswa.kelas.namaKelas,
      },
      kasir: p.user.namaLengkap,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("Payment history error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil riwayat pembayaran." },
      { status: 500 }
    );
  }
}
