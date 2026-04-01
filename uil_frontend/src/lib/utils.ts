import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAdminRole = (pathname: string) => {
  if (pathname.startsWith("/dashboard/office")) return "office";
  if (pathname.startsWith("/dashboard/industry")) return "industry";

  return "staff";
};
