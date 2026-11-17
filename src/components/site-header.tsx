import { Boxes } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";
import { auth } from "@/auth";

const NAV_LINKS = [{ href: "/products", label: "Katalog" }];

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-heading text-base font-semibold">
          <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Boxes className="size-4" aria-hidden />
          </span>
          Segmenta
        </Link>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Navigasi utama">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <UserMenu
              name={user.name ?? user.email ?? "Akun"}
              isAdmin={user.role === "ADMIN"}
            />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Daftar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
