import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Daftar",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Buat akun</CardTitle>
          <CardDescription>
            Registrasi aktif pada M1 Fase B, bersamaan dengan modul autentikasi.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Setelah aktif, akun baru otomatis masuk sebagai pelanggan dan dapat langsung berbelanja.
          </p>
          <Button variant="outline" asChild className="w-full">
            <Link href="/login">Sudah punya akun? Masuk</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
