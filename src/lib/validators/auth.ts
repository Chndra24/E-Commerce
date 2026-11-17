import { z } from "zod";

export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email wajib diisi.")
  .max(254, "Email terlalu panjang.")
  .email("Format email tidak valid.");

export const loginSchema = z.object({
  email: emailField,
  // Sengaja tidak memakai aturan panjang minimum saat login: aturan panjang
  // hanya relevan ketika membuat akun, dan pesan error tidak boleh membocorkan
  // informasi tentang kata sandi yang tersimpan.
  password: z.string().min(1, "Kata sandi wajib diisi."),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Nama minimal 2 karakter.")
      .max(80, "Nama maksimal 80 karakter."),
    email: emailField,
    password: z
      .string()
      .min(8, "Kata sandi minimal 8 karakter.")
      .max(72, "Kata sandi maksimal 72 karakter."),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
