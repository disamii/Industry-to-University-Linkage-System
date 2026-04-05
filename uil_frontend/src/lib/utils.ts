import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserRole } from "./enums";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAdminRole = (pathname: string) => {
  if (pathname.startsWith("/dashboard/office")) return "office";
  if (pathname.startsWith("/dashboard/industry")) return "industry";

  return "staff";
};

export const getAdminHomepageLink = (role: UserRole) => {
  let targetPath = "/dashboard";

  if (role === UserRole.ADMIN) targetPath += "/office";
  if (role === UserRole.INDUSTRY) targetPath += "/industry";
  if (role === UserRole.USER) targetPath += "/staff";

  return targetPath;
};

export const formatSelectOptions = (options: string[]) =>
  options.map((opt) => ({
    label: opt
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    value: opt,
  }));
