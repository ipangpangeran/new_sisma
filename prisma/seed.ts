import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SISMA NEW synthetic data seeding...");

  // 1. School Settings
  await prisma.pengaturan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      namaSekolah: "SMA Swasta Persiapan Stabat",
      npsn: "10201234",
      alamat: "Jl. KH. Zainul Arifin No. 12, Stabat, Kab. Langkat, Sumatera Utara",
      telepon: "(061) 8912345",
      email: "mail@dev.spp-smapersiapan.web.id",
      website: "https://dev.spp-smapersiapan.web.id",
      kepalaSekolah: "Drs. H. Ahmad Dahlan, M.Pd",
      nipKepalaSekolah: "19680512 199303 1 004",
      bendahara: "Siti Rahmah, S.Pd",
      nipBendahara: "19750820 200212 2 001",
    },
  });

  // 2. Academic Years
  const ta2026 = await prisma.tahunAjaran.upsert({
    where: { tahunAjaran: "2026/2027" },
    update: { status: "AKTIF" },
    create: {
      tahunAjaran: "2026/2027",
      status: "AKTIF",
    },
  });

  await prisma.tahunAjaran.upsert({
    where: { tahunAjaran: "2025/2026" },
    update: { status: "TIDAK_AKTIF" },
    create: {
      tahunAjaran: "2025/2026",
      status: "TIDAK_AKTIF",
    },
  });

  // 3. User Accounts with hashed passwords
  const passwordAdmin = await bcrypt.hash("admin123", 10);
  const passwordBendahara = await bcrypt.hash("bendahara123", 10);
  const passwordSiswa = await bcrypt.hash("siswa123", 10);

  const userAdmin = await prisma.user.upsert({
    where: { username: "admin" },
    update: { password: passwordAdmin },
    create: {
      username: "admin",
      password: passwordAdmin,
      namaLengkap: "Administrator Sistem",
      level: "admin",
      idTahunAjaran: ta2026.id,
    },
  });

  const userBendahara = await prisma.user.upsert({
    where: { username: "bendahara" },
    update: { password: passwordBendahara },
    create: {
      username: "bendahara",
      password: passwordBendahara,
      namaLengkap: "Siti Rahmah, S.Pd (Bendahara)",
      level: "bendahara",
      idTahunAjaran: ta2026.id,
    },
  });

  await prisma.user.upsert({
    where: { username: "siswa" },
    update: { password: passwordSiswa },
    create: {
      username: "siswa",
      password: passwordSiswa,
      namaLengkap: "Demo Siswa / Wali Siswa",
      level: "siswa",
      idTahunAjaran: ta2026.id,
    },
  });

  // 4. Classes
  const kelasX1 = await prisma.kelas.upsert({
    where: { namaKelas: "X MIPA 1" },
    update: {},
    create: { namaKelas: "X MIPA 1", keterangan: "Kelas 10 Matematika dan IPA 1" },
  });

  const kelasX2 = await prisma.kelas.upsert({
    where: { namaKelas: "X IPS 1" },
    update: {},
    create: { namaKelas: "X IPS 1", keterangan: "Kelas 10 Ilmu Pengetahuan Sosial 1" },
  });

  const kelasXI = await prisma.kelas.upsert({
    where: { namaKelas: "XI MIPA 1" },
    update: {},
    create: { namaKelas: "XI MIPA 1", keterangan: "Kelas 11 Matematika dan IPA 1" },
  });

  // 5. Pos Bayar
  const posSpp = await prisma.posBayar.upsert({
    where: { namaPosBayar: "SPP Bulanan" },
    update: {},
    create: { namaPosBayar: "SPP Bulanan", keterangan: "Iuran Pembinaan Pendidikan Bulanan Siswa" },
  });

  const posGedung = await prisma.posBayar.upsert({
    where: { namaPosBayar: "Uang Sarana Gedung" },
    update: {},
    create: { namaPosBayar: "Uang Sarana Gedung", keterangan: "Iuran Pembangunan Fasilitas Sekolah" },
  });

  // 6. Jenis Pembayaran
  let jenisSpp = await prisma.jenisPembayaran.findFirst({
    where: { idPosBayar: posSpp.id, idTahunAjaran: ta2026.id },
  });
  if (!jenisSpp) {
    jenisSpp = await prisma.jenisPembayaran.create({
      data: {
        idPosBayar: posSpp.id,
        idTahunAjaran: ta2026.id,
        tipeBayar: "bulanan",
      },
    });
  }

  let jenisGedung = await prisma.jenisPembayaran.findFirst({
    where: { idPosBayar: posGedung.id, idTahunAjaran: ta2026.id },
  });
  if (!jenisGedung) {
    jenisGedung = await prisma.jenisPembayaran.create({
      data: {
        idPosBayar: posGedung.id,
        idTahunAjaran: ta2026.id,
        tipeBayar: "bebas",
      },
    });
  }

  // 7. Synthetic Students (Purely fictional names & contact placeholders)
  const syntheticStudents = [
    { nis: "260101", nisn: "008101001", nama: "Ahmad Rizky Pratama", gender: "L", kelasId: kelasX1.id },
    { nis: "260102", nisn: "008101002", nama: "Anisa Putri Maharani", gender: "P", kelasId: kelasX1.id },
    { nis: "260103", nisn: "008101003", nama: "Bima Arya Wicaksono", gender: "L", kelasId: kelasX1.id },
    { nis: "260104", nisn: "008101004", nama: "Dewi Sekar Ayu", gender: "P", kelasId: kelasX1.id },
    { nis: "260105", nisn: "008101005", nama: "Farhan Maulana", gender: "L", kelasId: kelasX1.id },
    { nis: "260201", nisn: "008201001", nama: "Gilang Ramadhan", gender: "L", kelasId: kelasX2.id },
    { nis: "260202", nisn: "008201002", nama: "Hafizah Nur Syifa", gender: "P", kelasId: kelasX2.id },
    { nis: "260203", nisn: "008201003", nama: "Indra Kusuma Wardhana", gender: "L", kelasId: kelasX2.id },
    { nis: "260301", nisn: "007301001", nama: "Jessica Amanda", gender: "P", kelasId: kelasXI.id },
    { nis: "260302", nisn: "007301002", nama: "Kevin Kurniawan", gender: "L", kelasId: kelasXI.id },
  ];

  const months = [
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

  const monthlyFeeAmount = 250000; // Rp 250.000 / month

  for (const s of syntheticStudents) {
    const siswa = await prisma.siswa.upsert({
      where: { nis: s.nis },
      update: {
        namaSiswa: s.nama,
        idKelas: s.kelasId,
        jenisKelamin: s.gender,
      },
      create: {
        nis: s.nis,
        nisn: s.nisn,
        namaSiswa: s.nama,
        jenisKelamin: s.gender,
        idKelas: s.kelasId,
        hpSiswa: "0812-0000-00" + s.nis.slice(-2),
        hpOrtu: "0813-0000-00" + s.nis.slice(-2),
        statusSiswa: "AKTIF",
      },
    });

    // Generate 12-month SPP billing slots
    for (const m of months) {
      // Synthetic scenario: first 2-3 months paid for some students
      const shouldBePaid =
        (s.nis === "260101" && m.urutan <= 3) ||
        (s.nis === "260102" && m.urutan <= 2) ||
        (s.nis === "260103" && m.urutan <= 1) ||
        (s.nis === "260201" && m.urutan <= 2) ||
        (s.nis === "260301" && m.urutan <= 3);

      const tagihan = await prisma.tagihanBulanan.upsert({
        where: {
          idJenisPembayaran_idSiswa_urutanBulan: {
            idJenisPembayaran: jenisSpp.id,
            idSiswa: siswa.id,
            urutanBulan: m.urutan,
          },
        },
        update: {
          tarif: monthlyFeeAmount,
          statusBayar: shouldBePaid ? "LUNAS" : "BELUM_BAYAR",
        },
        create: {
          idJenisPembayaran: jenisSpp.id,
          idSiswa: siswa.id,
          bulan: m.nama,
          urutanBulan: m.urutan,
          tarif: monthlyFeeAmount,
          statusBayar: shouldBePaid ? "LUNAS" : "BELUM_BAYAR",
        },
      });

      if (shouldBePaid) {
        const noRef = `SPP-${s.nis}-${m.urutan.toString().padStart(2, "0")}`;
        await prisma.pembayaranBulanan.upsert({
          where: { noRef },
          update: {},
          create: {
            idTagihanBulanan: tagihan.id,
            jumlahBayar: monthlyFeeAmount,
            idUser: userBendahara.id,
            noRef,
            tglBayar: new Date(2026, 6 + m.urutan - 1, 10),
          },
        });
      }
    }

    // Generate Tagihan Bebas (Uang Gedung)
    const buildingTarget = 1500000;
    const buildingPaid = s.nis === "260101" ? 1500000 : s.nis === "260102" ? 750000 : 0;
    const buildingStatus = buildingPaid >= buildingTarget ? "LUNAS" : "BELUM_LUNAS";

    const tagihanBebas = await prisma.tagihanBebas.upsert({
      where: {
        idJenisPembayaran_idSiswa: {
          idJenisPembayaran: jenisGedung.id,
          idSiswa: siswa.id,
        },
      },
      update: {
        totalTagihan: buildingTarget,
        terbayar: buildingPaid,
        statusBayar: buildingStatus,
      },
      create: {
        idJenisPembayaran: jenisGedung.id,
        idSiswa: siswa.id,
        totalTagihan: buildingTarget,
        terbayar: buildingPaid,
        statusBayar: buildingStatus,
      },
    });

    if (buildingPaid > 0) {
      const refGedung = `GDG-${s.nis}-01`;
      await prisma.pembayaranBebas.upsert({
        where: { noRef: refGedung },
        update: {},
        create: {
          idTagihanBebas: tagihanBebas.id,
          jumlahBayar: buildingPaid,
          idUser: userBendahara.id,
          noRef: refGedung,
          keterangan: "Pembayaran Angsuran Fasilitas Gedung",
          tglBayar: new Date(2026, 6, 15),
        },
      });
    }
  }

  // 8. Cash Journal / Kas Entries
  await prisma.kas.createMany({
    data: [
      {
        uraian: "Setoran Tunai SPP Bulanan Periode Juli",
        pemasukan: 2750000,
        pengeluaran: 0,
        jenis: "masuk",
        idUser: userBendahara.id,
        idPosBayar: posSpp.id,
        tgl: new Date(2026, 6, 20),
      },
      {
        uraian: "Pengadaan Kertas Ujian dan ATK Kantor",
        pemasukan: 0,
        pengeluaran: 650000,
        jenis: "keluar",
        idUser: userAdmin.id,
        tgl: new Date(2026, 6, 22),
      },
      {
        uraian: "Bantuan Operasional Sekolah (BOS) Tahap 1",
        pemasukan: 12000000,
        pengeluaran: 0,
        jenis: "masuk",
        idUser: userAdmin.id,
        tgl: new Date(2026, 7, 5),
      },
      {
        uraian: "Biaya Pemeliharaan Jaringan Internet & Listrik",
        pemasukan: 0,
        pengeluaran: 1250000,
        jenis: "keluar",
        idUser: userBendahara.id,
        tgl: new Date(2026, 7, 8),
      },
    ],
  });

  console.log("✅ Synthetic demo data seeded successfully with zero PII!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
