import Link from "next/link";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth-guards";

export const metadata = {
  title: "Daftar",
};

export default async function RegisterPage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Buat akun</CardTitle>
          <CardDescription>
            Akun baru otomatis terdaftar sebagai pelanggan dan langsung bisa berbelanja.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <RegisterForm />

          <p className="text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
              Masuk
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
