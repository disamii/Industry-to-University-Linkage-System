"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SigninInput } from "../../validation/validation.auth";
import { decodeJwt } from "jose";
import { UserRole } from "@/lib/enums";

export async function signinAction(data: SigninInput) {
  const res = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Incorrect Email or Password");
  }

  const { access_token } = await res.json();
  const payload = decodeJwt(access_token); // Assuming role is in JWT
  const role = payload.role as UserRole;

  const cookieStore = await cookies();

  // Save JWT in httpOnly cookie
  cookieStore.set({
    name: "access_token",
    value: access_token,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  // Map roles to paths
  let targetPath = "/dashboard";

  switch (role) {
    case UserRole.ADMIN:
      targetPath = "/dashboard/office";
      break;
    case UserRole.INDUSTRY:
      targetPath = "/dashboard/industry";
      break;
    case UserRole.USER:
      targetPath = "/dashboard/staff";
      break;
    default:
      break;
  }

  revalidatePath(targetPath);
  redirect(targetPath);
}
