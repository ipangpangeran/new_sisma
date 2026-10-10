import Anthropic from "@anthropic-ai/sdk";

export interface FinancialAggregatePayload {
  academicYear: string;
  totalStudents: number;
  totalMonthlyBilled: number;
  totalMonthlyCollected: number;
  totalMonthlyOutstanding: number;
  totalCashIncome: number;
  totalCashExpense: number;
  netCashBalance: number;
  collectionRatePercentage: number;
}

export interface AiSummaryResult {
  success: boolean;
  summary?: string;
  model?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  disclaimer: string;
  error?: string;
  isConfigured: boolean;
}

export async function generateFinancialSummaryWithClaude(
  data: FinancialAggregatePayload,
  userPrompt?: string
): Promise<AiSummaryResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();

  const standardDisclaimer =
    "Peringatan: Ringkasan ini dihasilkan oleh AI (Claude) sebagai alat bantu analisis ikhtisar keuangan. Informasi ini bukan audit resmi dan tidak mengubah catatan keuangan apapun. Keputusan finansial tetap memerlukan verifikasi manusia.";

  if (!apiKey) {
    return {
      success: false,
      isConfigured: false,
      disclaimer: standardDisclaimer,
      error:
        "ANTHROPIC_API_KEY belum dikonfigurasi di lingkungan server (.env). Fitur AI Financial Report Assistant memerlukan API key resmi dari Anthropic untuk menghasilkan ringkasan langsung.",
    };
  }

  try {
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const systemPrompt = `Anda adalah asisten analisis keuangan sekolah untuk sistem SISMA (Sistem Informasi Keuangan Sekolah).
Tugas Anda adalah membuat ringkasan eksekutif berbasis data agregat keuangan yang diberikan secara ketat.

ATURAN KETAT:
1. Gunakan HANYA data dan angka yang disediakan dalam prompt. JANGAN PERNAH mengarang angka, siswa, atau persentase yang tidak ada dalam data.
2. Jelaskan performa penagihan SPP (tingkat ketercapaian/kolektibilitas) dan posisi kas operasional.
3. Berikan 2-3 poin observasi faktual dan rekomendasi administratif tindak lanjut yang memerlukan verifikasi bendahara/kepala sekolah.
4. Anda TIDAK MEMILIKI otorisasi untuk mengubah, menambah, atau membatalkan transaksi keuangan apapun.
5. Gunakan bahasa Indonesia yang profesional, ringkas, dan jelas.`;

    const contentPrompt = `Data Agregat Keuangan Sekolah Tahun Ajaran ${data.academicYear}:
- Total Siswa Terdaftar: ${data.totalStudents} siswa
- Total Tagihan SPP Bulanan Terjadwal: Rp ${data.totalMonthlyBilled.toLocaleString("id-ID")}
- Total SPP Terbayar (Realisasi): Rp ${data.totalMonthlyCollected.toLocaleString("id-ID")}
- Total Tunggakan SPP: Rp ${data.totalMonthlyOutstanding.toLocaleString("id-ID")}
- Rasio Kolektibilitas SPP: ${data.collectionRatePercentage.toFixed(1)}%
- Total Pemasukan Kas Operasional: Rp ${data.totalCashIncome.toLocaleString("id-ID")}
- Total Pengeluaran Kas Operasional: Rp ${data.totalCashExpense.toLocaleString("id-ID")}
- Saldo Kas Bersih: Rp ${data.netCashBalance.toLocaleString("id-ID")}

${userPrompt ? `Pertanyaan/Fokus Khusus dari Bendahara: "${userPrompt}"` : "Mohon berikan ringkasan eksekutif dan rekomendasi administratif berdasarkan angka-angka di atas."}`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: contentPrompt,
        },
      ],
    });

    const textContent = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { text: string }).text)
      .join("\n\n");

    return {
      success: true,
      isConfigured: true,
      summary: textContent,
      model: response.model,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
      disclaimer: standardDisclaimer,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan saat menghubungi API Claude";
    return {
      success: false,
      isConfigured: true,
      disclaimer: standardDisclaimer,
      error: `Gagal memproses permintaan ke Anthropic API: ${errorMessage}`,
    };
  }
}
