"use server";

import { UserRole } from "@/lib/enums";
import { decodeJwt } from "jose";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SigninInput } from "../../validation/validation.auth";
import { getMe } from "@/data/user/user-profile-query";
import { signin } from "@/data/auth/sigin-mutation";
import { getAdminHomepageLink } from "@/lib/utils";

export async function signinAction(data: SigninInput) {
  const response = await signin(data);
  const { access_token, refresh_token } = response;

  const payload = decodeJwt(access_token);
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
  cookieStore.set({
    name: "refresh_token",
    value: refresh_token,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  // Fetch Profile immediately using the new token
  const userProfile = await getMe();

  // Map roles to paths
  const targetPath = getAdminHomepageLink(role);

  revalidatePath(targetPath);

  return { user: userProfile, path: targetPath };
}

export async function logoutAction() {
  const cookieStore = await cookies();

  // Delete the cookie by setting an expired date
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}
