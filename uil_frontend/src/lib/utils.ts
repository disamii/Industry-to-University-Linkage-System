import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserRole } from "./enums";

import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const getAdminRole = (pathname: string) => {
  if (pathname.startsWith("/dashboard/office")) return "office";
  if (pathname.startsWith("/dashboard/industry")) return "industry";

  return "staff";
};

export const getAdminHomepageLink = (roles: UserRole[]) => {
  let targetPath = "/dashboard";

  if (roles.includes(UserRole.ADMIN)) targetPath += "/office";
  if (roles.includes(UserRole.INDUSTRY)) targetPath += "/industry";
  if (roles.length === 0 || roles.includes(UserRole.STAFF))
    targetPath += "/staff";

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

export function formatDate(
  date: string | Date | null | undefined,
  options?: { relative?: boolean; includeTime?: boolean },
) {
  if (!date) return "-";

  // parse string to Date if necessary
  const parsedDate = typeof date === "string" ? parseISO(date) : date;

  if (!isValid(parsedDate)) return "-";

  // if relative is true and date is within last 7 days, use "x days ago"
  if (options?.relative) {
    const diff = Date.now() - parsedDate.getTime();
    const diffDays = diff / (1000 * 60 * 60 * 24);

    if (diffDays <= 7) {
      return formatDistanceToNow(parsedDate, { addSuffix: true });
    }
  }

  // fallback: normal readable format
  return format(parsedDate, options?.includeTime ? "PPP p" : "PPP"); // e.g., Apr 5, 2026 10:27 PM
}
