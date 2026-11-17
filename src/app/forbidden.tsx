import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Forbidden() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-16">
      <Card>
        <CardHeader>
          <p className="font-mono text-xs text-muted-foreground">403</p>
          <CardTitle className="text-xl">Akses ditolak</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Akun kamu tidak memiliki izin untuk membuka halaman ini. Panel admin hanya untuk
            pengguna dengan peran admin.
          </p>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/">Ke beranda</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">Lihat katalog</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
