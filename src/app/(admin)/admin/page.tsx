import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SEGMENT_KEYS, SEGMENT_META } from "@/lib/segments";

export const metadata = {
  title: "Ringkasan Admin",
};

const KPI_PLACEHOLDERS = [
  "Pendapatan bulan ini",
  "Pesanan bulan ini",
  "Rata-rata nilai pesanan",
  "Pelanggan aktif",
];

const MILESTONES = [
  { id: "M1", label: "Fondasi, autentikasi, dan CI", state: "berjalan" },
  { id: "M2", label: "Katalog, keranjang, checkout", state: "menunggu" },
  { id: "M3", label: "Seed dataset 18 bulan", state: "menunggu" },
  { id: "M4", label: "Mesin RFM dan snapshot", state: "menunggu" },
  { id: "M5", label: "Cohort, tren, funnel, migration", state: "menunggu" },
  { id: "M6", label: "Export, dokumentasi, rilis", state: "menunggu" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Ringkasan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kerangka panel admin. Metrik akan terisi setelah mesin RFM (M4) dan halaman analitik (M5)
          selesai dibangun.
        </p>
      </header>

      <section aria-label="Indikator utama" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_PLACEHOLDERS.map((label) => (
          <Card key={label}>
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-2xl text-muted-foreground">—</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status milestone</CardTitle>
            <CardDescription>Acuan pengerjaan sesuai PRD §16.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y text-sm">
              {MILESTONES.map((milestone) => (
                <li key={milestone.id} className="flex items-center justify-between gap-4 py-2">
                  <span>
                    <span className="font-mono text-xs text-muted-foreground">{milestone.id}</span>{" "}
                    {milestone.label}
                  </span>
                  <span
                    className={
                      milestone.state === "berjalan"
                        ? "text-xs font-medium text-emerald-700"
                        : "text-xs text-muted-foreground"
                    }
                  >
                    {milestone.state}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11 segmen RFM</CardTitle>
            <CardDescription>
              Legenda warna dipakai konsisten di tabel, chart, dan migration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2">
              {SEGMENT_KEYS.map((key) => (
                <li key={key} className="flex items-center gap-2 text-sm">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: SEGMENT_META[key].color }}
                    aria-hidden
                  />
                  <span className="truncate">{SEGMENT_META[key].label}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
