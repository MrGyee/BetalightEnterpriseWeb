"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/auth/session";

export interface LoginState {
  error?: string;
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return { error: "Admin credentials are not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local." };
  }

  if (email !== adminEmail || password !== adminPassword) {
    return { error: "Invalid email or password." };
  }

  await createSession(email);
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
