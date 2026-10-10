import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { BULAN_SPP } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const classId = searchParams.get("classId");
    const status = searchParams.get("status") || "";

    const where: any = {};

    if (search) {
      where.OR = [
        { namaSiswa: { contains: search } },
        { nis: { contains: search } },
        { nisn: { contains: search } },
      ];
    }

    if (classId && !isNaN(Number(classId))) {
      where.idKelas = Number(classId);
    }

    if (status) {
      where.statusSiswa = status;
    }

    const students = await prisma.siswa.findMany({
      where,
      include: {
        kelas: true,
        tagihanBulanan: {
          select: {
            tarif: true,
            statusBayar: true,
          },
        },
      },
      orderBy: { namaSiswa: "asc" },
    });

    const formatted = students.map((s) => {
      const totalBilled = s.tagihanBulanan.reduce((acc, t) => acc + t.tarif, 0);
      const totalPaid = s.tagihanBulanan
        .filter((t) => t.statusBayar === "LUNAS")
        .reduce((acc, t) => acc + t.tarif, 0);
      const totalOutstanding = totalBilled - totalPaid;
      const monthsPaidCount = s.tagihanBulanan.filter((t) => t.statusBayar === "LUNAS").length;

      return {
        id: s.id,
        nis: s.nis,
        nisn: s.nisn,
        namaSiswa: s.namaSiswa,
        jenisKelamin: s.jenisKelamin,
        idKelas: s.idKelas,
        namaKelas: s.kelas.namaKelas,
        hpSiswa: s.hpSiswa,
        hpOrtu: s.hpOrtu,
        statusSiswa: s.statusSiswa,
        totalBilled,
        totalPaid,
        totalOutstanding,
        monthsPaidCount,
      };
    });

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("Students fetch error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data siswa." },
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
    const { nis, nisn, namaSiswa, jenisKelamin, idKelas, hpSiswa, hpOrtu } = body;

    if (!namaSiswa || !idKelas) {
      return NextResponse.json(
        { error: "Nama siswa dan kelas wajib diisi." },
        { status: 400 }
      );
    }

    // Check unique NIS
    if (nis) {
      const existing = await prisma.siswa.findUnique({
        where: { nis: String(nis).trim() },
      });
      if (existing) {
        return NextResponse.json(
          { error: `NIS ${nis} sudah terdaftar.` },
          { status: 400 }
        );
      }
    }

    const newStudent = await prisma.siswa.create({
      data: {
        nis: nis ? String(nis).trim() : null,
        nisn: nisn ? String(nisn).trim() : null,
        namaSiswa: String(namaSiswa).trim(),
        jenisKelamin: jenisKelamin === "P" ? "P" : "L",
        idKelas: Number(idKelas),
        hpSiswa: hpSiswa?.trim() || null,
        hpOrtu: hpOrtu?.trim() || null,
        statusSiswa: "AKTIF",
      },
    });

    // Auto-generate 12-month SPP billing slots for active academic year
    const activeTA = await prisma.tahunAjaran.findFirst({
      where: { status: "AKTIF" },
    });

    if (activeTA) {
      const sppPos = await prisma.posBayar.findFirst({
        where: { namaPosBayar: { contains: "SPP" } },
      });

      if (sppPos) {
        const jenisSpp = await prisma.jenisPembayaran.findFirst({
          where: { idPosBayar: sppPos.id, idTahunAjaran: activeTA.id },
        });

        if (jenisSpp) {
          const defaultMonthlyTarif = 250000;
          const billingSlots = BULAN_SPP.map((b) => ({
            idJenisPembayaran: jenisSpp.id,
            idSiswa: newStudent.id,
            bulan: b.nama,
            urutanBulan: b.urutan,
            tarif: defaultMonthlyTarif,
            statusBayar: "BELUM_BAYAR",
          }));

          await prisma.tagihanBulanan.createMany({
            data: billingSlots,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: newStudent,
      message: "Data siswa dan tagihan SPP 12 bulan berhasil dibuat.",
    });
  } catch (error) {
    console.error("Student creation error:", error);
    return NextResponse.json(
      { error: "Gagal membuat data siswa baru." },
      { status: 500 }
    );
  }
}
