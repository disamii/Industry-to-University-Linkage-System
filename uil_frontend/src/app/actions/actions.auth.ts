"use server";

import { UserRole } from "@/lib/enums";
import { decodeJwt } from "jose";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SigninInput } from "@/validation/validation.auth";
import { getMe } from "@/data/user/current_user-profile-query";
import { signin } from "@/data/auth/sigin-mutation";
import { getAdminHomepageLink } from "@/lib/utils";
import { getRefreshToken } from "@/data/auth/refresh-token-mutation";

export async function signinAction(data: SigninInput) {
  const response = await signin(data);
  // const { access_token, refresh_token } = response;
  const { access } = response;

  const payload = decodeJwt(access);
  const roles = payload.roles as UserRole[];

  const cookieStore = await cookies();

  // Save JWT in httpOnly cookie
  cookieStore.set({
    name: "access_token",
    value: access,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  // cookieStore.set({
  //   name: "refresh_token",
  //   value: refresh_token,
  //   httpOnly: true,
  //   path: "/",
  //   sameSite: "lax",
  //   secure: process.env.NODE_ENV === "production",
  // });

  // Fetch Profile immediately using the new token
  const userProfile = await getMe();

  // Map roles to paths
  const targetPath = getAdminHomepageLink(roles);

  revalidatePath(targetPath);

  return { user: userProfile, path: targetPath };
}

export async function refreshTokenAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) throw new Error("No refresh token");

  try {
    // Call your backend refresh endpoint
    const response = await getRefreshToken({ refresh_token: refreshToken });
    const { access } = response;

    // Update the cookies
    cookieStore.set({
      name: "access_token",
      value: access,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // cookieStore.set({
    //   name: "refresh_token",
    //   value: refresh_token,
    //   httpOnly: true,
    //   path: "/",
    //   sameSite: "lax",
    //   secure: process.env.NODE_ENV === "production",
    // });

    return { success: true };
  } catch {
    await logoutAction(); // Clear cookies if refresh fails
    return { success: false };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();

  // Delete the cookie by setting an expired date
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}
