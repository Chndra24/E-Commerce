"use server";

import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { loginSchema, registerSchema } from "@/lib/validators/auth";

export type AuthActionState = { error: string } | null;

/** Hanya izinkan path internal agar `next` tidak bisa dipakai untuk open redirect. */
function safeNextPath(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";

  if (!next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }

  return next;
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data yang dikirim tidak valid." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: safeNextPath(formData.get("next")),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error:
          error.type === "CredentialsSignin"
            ? "Email atau kata sandi salah."
            : "Gagal masuk. Silakan coba lagi.",
      };
    }

    // NEXT_REDIRECT dan error lain harus diteruskan.
    throw error;
  }

  return null;
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data yang dikirim tidak valid." };
  }

  const { name, email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return { error: "Email ini sudah terdaftar. Silakan masuk." };
  }

  const passwordHash = await hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "CUSTOMER",
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?registered=1");
    }

    throw error;
  }

  return null;
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
