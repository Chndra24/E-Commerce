/**
 * Katalog 11 segmen RFM.
 *
 * Urutan kunci di objek ini mengikuti prioritas aturan PRD §10.2 (aturan pertama
 * yang cocok menang) dan dipakai sebagai urutan tampilan di seluruh UI.
 * Warna disimpan sebagai hex karena dipakai juga oleh library chart.
 */

export type SegmentMeta = {
  /** Label yang ditampilkan di UI (Bahasa Indonesia). */
  label: string;
  /** Penjelasan singkat untuk tooltip / kartu segmen. */
  description: string;
  /** Warna utama, dipakai untuk badge dan chart. */
  color: string;
};

export const SEGMENT_META = {
  CHAMPIONS: {
    label: "Champion",
    description: "Pembelian terakhir sangat baru, sering, dan bernilai tinggi.",
    color: "#16a34a",
  },
  CANNOT_LOSE_THEM: {
    label: "Jangan Sampai Hilang",
    description: "Dulu sangat aktif dan bernilai tinggi, tetapi mulai jarang.",
    color: "#0891b2",
  },
  LOYAL: {
    label: "Loyal",
    description: "Sering berbelanja dan masih aktif dalam setahun terakhir.",
    color: "#0d9488",
  },
  AT_RISK: {
    label: "Berisiko",
    description: "Dulu sering berbelanja, tetapi sudah lama tidak kembali.",
    color: "#dc2626",
  },
  POTENTIAL_LOYALIST: {
    label: "Calon Loyal",
    description: "Masih aktif dan mulai menunjukkan frekuensi berbelanja.",
    color: "#2563eb",
  },
  NEW: {
    label: "Pelanggan Baru",
    description: "Baru bertransaksi dan belum punya pola frekuensi.",
    color: "#7c3aed",
  },
  PROMISING: {
    label: "Menjanjikan",
    description: "Baru beberapa kali bertransaksi tetapi masih aktif.",
    color: "#c026d3",
  },
  NEED_ATTENTION: {
    label: "Perlu Perhatian",
    description: "Frekuensi dan nilai menengah, aktivitas mulai melambat.",
    color: "#d97706",
  },
  ABOUT_TO_SLEEP: {
    label: "Mulai Pasif",
    description: "Aktivitas menurun dan berpotensi berhenti berbelanja.",
    color: "#ea580c",
  },
  HIBERNATING: {
    label: "Hibernasi",
    description: "Sudah lama tidak aktif dengan riwayat nilai rendah.",
    color: "#64748b",
  },
  LOST: {
    label: "Hilang",
    description: "Tidak bertransaksi dalam waktu lama dan nilai rendah.",
    color: "#334155",
  },
} as const satisfies Record<string, SegmentMeta>;

export type SegmentKey = keyof typeof SEGMENT_META;

/** Urutan prioritas aturan PRD §10.2. */
export const SEGMENT_KEYS = Object.keys(SEGMENT_META) as SegmentKey[];

export function isSegmentKey(value: string): value is SegmentKey {
  return value in SEGMENT_META;
}

export function segmentLabel(value: SegmentKey): string {
  return SEGMENT_META[value].label;
}

export function segmentColor(value: SegmentKey): string {
  return SEGMENT_META[value].color;
}
