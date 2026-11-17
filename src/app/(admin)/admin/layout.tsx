import { notFound } from "next/navigation";

import { AdminSidebar } from "@/components/admin-sidebar";

// Panel admin selalu dirender dinamis karena nanti bergantung pada sesi.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // SEMENTARA — M1 Fase A belum punya lapisan autentikasi, jadi panel ditutup
  // rapat di production agar tidak pernah ter-deploy tanpa proteksi.
  // M1 Fase B: ganti blok ini dengan `await requireAdmin()` dari @/lib/auth-guards
  // (otorisasi di server, bukan hanya middleware) lalu hapus early-return ini.
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="min-h-dvh bg-muted/30 lg:grid lg:grid-cols-[16rem_1fr]">
      <AdminSidebar />
      <div className="flex min-h-dvh flex-col">
        <header className="flex h-14 items-center gap-3 border-b bg-background px-4 lg:px-8">
          <span className="text-sm font-medium">Panel Admin</span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
            Mode pengembangan
          </span>
        </header>
        <main className="flex-1 px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
