import { forbidden, redirect } from "next/navigation";

import { auth } from "@/auth";

/**
 * Sumber kebenaran otorisasi. Semua pemanggilan dilakukan di server
 * (layout, page, server action, route handler) — bukan di proxy/middleware.
 */
export async function getSessionUser() {
  const session = await auth();

  return session?.user ?? null;
}

export async function requireUser(nextPath?: string) {
  const user = await getSessionUser();

  if (!user) {
    redirect(nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser("/admin");

  if (user.role !== "ADMIN") {
    forbidden();
  }

  return user;
}
