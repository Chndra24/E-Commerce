"use client";

import { ChevronDown, LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/lib/actions/auth";

export function UserMenu({ name, isAdmin }: { name: string; isAdmin: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="max-w-[12rem]">
          <span className="truncate">{name}</span>
          <ChevronDown className="opacity-60" aria-hidden />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="truncate">{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isAdmin ? (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <ShieldCheck aria-hidden />
              Panel admin
            </Link>
          </DropdownMenuItem>
        ) : null}

        <form action={logoutAction}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full">
              <LogOut aria-hidden />
              Keluar
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
