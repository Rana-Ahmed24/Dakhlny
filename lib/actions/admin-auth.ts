"use server";

import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  verifyAdminPassword,
} from "@/lib/auth/admin";
import type { ActionResult } from "@/lib/types";

export async function loginAdmin(password: string): Promise<ActionResult> {
  if (!verifyAdminPassword(password)) {
    return { success: false, error: "Invalid password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, createAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return { success: true };
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
