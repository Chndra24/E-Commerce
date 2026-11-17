import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Halaman tidak ditemukan</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Alamat yang kamu buka tidak tersedia. Halaman yang belum dibangun juga akan tampil seperti ini.
      </p>
      <Button asChild>
        <Link href="/">Kembali ke beranda</Link>
      </Button>
    </div>
  );
}
