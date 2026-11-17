"use client";

import {
  ChartLine,
  LayoutDashboard,
  Package,
  Receipt,
  ShoppingCart,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Diisi bila halaman belum dibangun; item dirender non-aktif. */
  pendingMilestone?: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produk", icon: Package, pendingMilestone: "M2" },
  { href: "/admin/orders", label: "Pesanan", icon: ShoppingCart, pendingMilestone: "M2" },
  { href: "/admin/customers", label: "Pelanggan", icon: Users, pendingMilestone: "M4" },
  { href: "/admin/analytics/rfm", label: "Segmentasi RFM", icon: ChartLine, pendingMilestone: "M4" },
  { href: "/admin/analytics/cohort", label: "Cohort & tren", icon: Workflow, pendingMilestone: "M5" },
  { href: "/admin/jobs", label: "Job analitik", icon: Receipt, pendingMilestone: "M4" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 z-30 border-b bg-background lg:h-dvh lg:border-r lg:border-b-0">
      <div className="flex h-14 items-center gap-2 px-4 lg:px-5">
        <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Workflow className="size-4" aria-hidden />
        </span>
        <span className="font-heading text-sm font-semibold">Segmenta Admin</span>
      </div>

      <nav
        aria-label="Navigasi admin"
        className="flex gap-1 overflow-x-auto px-2 pb-2 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-4"
      >
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
          const baseClass =
            "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors";

          if (item.pendingMilestone) {
            return (
              <span
                key={item.href}
                aria-disabled="true"
                className={cn(baseClass, "text-muted-foreground/60")}
              >
                <item.icon className="size-4" aria-hidden />
                <span className="whitespace-nowrap">{item.label}</span>
                <Badge variant="outline" className="ml-auto hidden text-[10px] lg:inline-flex">
                  {item.pendingMilestone}
                </Badge>
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                baseClass,
                active
                  ? "bg-secondary font-medium text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4" aria-hidden />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
