import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Masuk",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Masuk</CardTitle>
          <CardDescription>
            Form autentikasi aktif pada M1 Fase B. Sementara ini halaman hanya menampilkan kerangka.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Akun demo akan tersedia setelah modul autentikasi dan seed selesai:
          </p>
          <ul className="space-y-1 rounded-lg bg-muted p-3 font-mono text-xs">
            <li>admin@segmenta.test</li>
            <li>customer@segmenta.test</li>
          </ul>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Kembali ke beranda</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
