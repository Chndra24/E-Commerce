import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth-guards";

export const metadata = {
  title: "Masuk",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; registered?: string }>;
}) {
  const params = await searchParams;
  const user = await getSessionUser();

  if (user) {
    redirect(params.next?.startsWith("/") ? params.next : "/");
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Masuk</CardTitle>
          <CardDescription>
            Masuk untuk melanjutkan belanja atau membuka panel admin.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {params.registered ? (
            <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Akun berhasil dibuat. Silakan masuk.
            </p>
          ) : null}

          <LoginForm next={params.next} />

          <div className="space-y-2 rounded-lg bg-muted p-3 text-xs">
            <p className="font-medium text-foreground">Akun demo (dari seed:auth)</p>
            <p className="font-mono text-muted-foreground">admin@segmenta.test · Segmenta123!</p>
            <p className="font-mono text-muted-foreground">customer@segmenta.test · Segmenta123!</p>
          </div>

          <p className="text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
              Daftar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
