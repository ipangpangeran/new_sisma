import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || (session.level !== "admin" && session.level !== "bendahara")) {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya bendahara atau admin yang dapat mencatat pembayaran." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { idTagihanBulanan, jumlahBayar } = body;

    if (!idTagihanBulanan) {
      return NextResponse.json(
        { error: "ID Tagihan Bulanan wajib disertakan." },
        { status: 400 }
      );
    }

    const tagihan = await prisma.tagihanBulanan.findUnique({
      where: { id: Number(idTagihanBulanan) },
      include: {
        siswa: true,
        jenisPembayaran: {
          include: { posBayar: true },
        },
      },
    });

    if (!tagihan) {
      return NextResponse.json(
        { error: "Data tagihan SPP tidak ditemukan." },
        { status: 404 }
      );
    }

    if (tagihan.statusBayar === "LUNAS") {
      return NextResponse.json(
        { error: `Tagihan SPP bulan ${tagihan.bulan} untuk siswa ${tagihan.siswa.namaSiswa} sudah berstatus LUNAS. Pembayaran ganda dicegah.` },
        { status: 400 }
      );
    }

    const nominalBayar = Number(jumlahBayar);
    if (isNaN(nominalBayar) || nominalBayar <= 0) {
      return NextResponse.json(
        { error: "Jumlah pembayaran harus berupa angka positif yang valid." },
        { status: 400 }
      );
    }

    // Strict validation: amount must match the configured monthly tariff
    if (nominalBayar !== tagihan.tarif) {
      return NextResponse.json(
        { error: `Jumlah bayar (Rp ${nominalBayar.toLocaleString("id-ID")}) tidak sesuai dengan tarif tagihan (Rp ${tagihan.tarif.toLocaleString("id-ID")}).` },
        { status: 400 }
      );
    }

    // Generate unique reference number: SPP-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const noRef = `SPP-${dateStr}-${tagihan.siswa.nis || tagihan.siswa.id}-${randomSuffix}`;

    // Execute atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create payment receipt record
      const pembayaran = await tx.pembayaranBulanan.create({
        data: {
          idTagihanBulanan: tagihan.id,
          jumlahBayar: nominalBayar,
          idUser: session.userId,
          noRef,
          tglBayar: now,
        },
      });

      // 2. Mark monthly bill as paid
      await tx.tagihanBulanan.update({
        where: { id: tagihan.id },
        data: { statusBayar: "LUNAS" },
      });

      // 3. Record in cash journal (Kas)
      await tx.kas.create({
        data: {
          uraian: `Pembayaran SPP ${tagihan.bulan} - ${tagihan.siswa.namaSiswa} (${noRef})`,
          pemasukan: nominalBayar,
          pengeluaran: 0,
          jenis: "masuk",
          idUser: session.userId,
          idPosBayar: tagihan.jenisPembayaran.idPosBayar,
          tgl: now,
        },
      });

      return pembayaran;
    });

    return NextResponse.json({
      success: true,
      message: `Pembayaran SPP bulan ${tagihan.bulan} berhasil dicatat.`,
      receipt: {
        noRef: result.noRef,
        tglBayar: result.tglBayar,
        jumlahBayar: result.jumlahBayar,
        siswa: tagihan.siswa.namaSiswa,
        nis: tagihan.siswa.nis,
        bulan: tagihan.bulan,
        kasir: session.namaLengkap,
      },
    });
  } catch (error) {
    console.error("Payment recording error:", error);
    return NextResponse.json(
      { error: "Gagal memproses transaksi pembayaran." },
      { status: 500 }
    );
  }
}
