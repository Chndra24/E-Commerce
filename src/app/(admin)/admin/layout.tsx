import { requireAdmin } from "@/lib/auth-guards";
import { AdminSidebar } from "@/components/admin-sidebar";

// Panel admin selalu dirender dinamis karena bergantung pada sesi.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="min-h-dvh bg-muted/30 lg:grid lg:grid-cols-[16rem_1fr]">
      <AdminSidebar />
      <div className="flex min-h-dvh flex-col">
        <header className="flex h-14 items-center gap-3 border-b bg-background px-4 lg:px-8">
          <span className="text-sm font-medium">Panel Admin</span>
          <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline">Masuk sebagai</span>
            <span className="font-medium text-foreground">{user.name ?? user.email}</span>
          </span>
        </header>
        <main className="flex-1 px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
