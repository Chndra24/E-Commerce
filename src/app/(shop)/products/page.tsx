import { Package } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Katalog",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Katalog</h1>
        <p className="mt-2 text-muted-foreground">
          Semua produk yang dijual Segmenta, lengkap dengan pencarian, filter kategori, dan urutan harga.
        </p>
      </header>

      <Card className="mt-8 border-dashed">
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="grid size-11 place-items-center rounded-full bg-muted">
            <Package className="size-5 text-muted-foreground" aria-hidden />
          </span>
          <p className="font-medium">Katalog produk sedang disiapkan</p>
          <p className="max-w-md text-sm text-muted-foreground">
            Daftar produk, halaman detail, dan keranjang aktif pada milestone M2. Data produk diisi oleh
            seed generator pada M3.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
