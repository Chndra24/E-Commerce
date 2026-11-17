import { ArrowRight, ChartColumn, Users, Workflow } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const VALUE_PROPS = [
  {
    icon: Users,
    title: "Segmentasi RFM otomatis",
    description:
      "Setiap periode, seluruh pelanggan dinilai berdasarkan Recency, Frequency, dan Monetary lalu dipetakan ke 11 segmen perilaku.",
  },
  {
    icon: ChartColumn,
    title: "Cohort & tren penjualan",
    description:
      "Retensi per cohort akuisisi, tren penjualan bulanan, produk best-seller, dan funnel konversi — bukan sekadar angka.",
  },
  {
    icon: Workflow,
    title: "Riwayat yang bisa dibandingkan",
    description:
      "Hasil segmentasi disimpan sebagai snapshot, sehingga perpindahan segmen antar bulan dapat dilihat dan ditindaklanjuti.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="border-b bg-gradient-to-b from-muted/60 to-background">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <Badge variant="secondary">Tahap pengembangan · M1</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Toko online yang tahu <span className="text-muted-foreground">siapa pelanggannya.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Katalog dan checkout yang wajar, ditambah panel admin yang mengelompokkan pelanggan dengan
            RFM, membaca retensi per cohort, dan menunjukkan segmen mana yang perlu ditindaklanjuti.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href="/products">
                Lihat katalog
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Masuk sebagai admin</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {VALUE_PROPS.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <span className="mb-2 grid size-9 place-items-center rounded-lg bg-muted text-foreground">
                  <item.icon className="size-4" aria-hidden />
                </span>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
