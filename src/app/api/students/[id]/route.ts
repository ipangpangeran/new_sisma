import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = Number(params.id);
    if (isNaN(studentId)) {
      return NextResponse.json({ error: "ID siswa tidak valid." }, { status: 400 });
    }

    const student = await prisma.siswa.findUnique({
      where: { id: studentId },
      include: {
        kelas: true,
        tagihanBulanan: {
          include: {
            pembayaranBulanan: {
              include: {
                user: {
                  select: { namaLengkap: true },
                },
              },
            },
          },
          orderBy: { urutanBulan: "asc" },
        },
        tagihanBebas: {
          include: {
            jenisPembayaran: {
              include: { posBayar: true },
            },
            pembayaranBebas: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Siswa tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    console.error("Student detail error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data detail siswa." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    if (!session || (session.level !== "admin" && session.level !== "bendahara")) {
      return NextResponse.json(
        { error: "Akses ditolak. Memerlukan hak akses admin atau bendahara." },
        { status: 403 }
      );
    }

    const studentId = Number(params.id);
    const body = await req.json();
    const { namaSiswa, nis, nisn, idKelas, hpSiswa, hpOrtu, statusSiswa } = body;

    const updated = await prisma.siswa.update({
      where: { id: studentId },
      data: {
        ...(namaSiswa && { namaSiswa: String(namaSiswa).trim() }),
        ...(nis !== undefined && { nis: nis ? String(nis).trim() : null }),
        ...(nisn !== undefined && { nisn: nisn ? String(nisn).trim() : null }),
        ...(idKelas && { idKelas: Number(idKelas) }),
        ...(hpSiswa !== undefined && { hpSiswa: hpSiswa?.trim() || null }),
        ...(hpOrtu !== undefined && { hpOrtu: hpOrtu?.trim() || null }),
        ...(statusSiswa && { statusSiswa }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Student update error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data siswa." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    if (!session || session.level !== "admin") {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya admin yang dapat mengarsipkan siswa." },
        { status: 403 }
      );
    }

    const studentId = Number(params.id);
    // Soft-archive by setting status to ALUMNI instead of hard deleting historical financial rows
    const archived = await prisma.siswa.update({
      where: { id: studentId },
      data: { statusSiswa: "ALUMNI" },
    });

    return NextResponse.json({
      success: true,
      message: "Data siswa berhasil diarsipkan ke status ALUMNI.",
      data: archived,
    });
  } catch (error) {
    console.error("Student archive error:", error);
    return NextResponse.json(
      { error: "Gagal mengarsipkan data siswa." },
      { status: 500 }
    );
  }
}
