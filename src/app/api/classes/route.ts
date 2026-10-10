import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const classes = await prisma.kelas.findMany({
      orderBy: { namaKelas: "asc" },
      include: {
        _count: {
          select: { siswa: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: classes });
  } catch (error) {
    console.error("Classes fetch error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kelas." },
      { status: 500 }
    );
  }
}
