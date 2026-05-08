/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { UserRole } from "./enums";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export const getAdminHomepageLink = (roles: UserRole[]) => {
  let targetPath = "/dashboard";

  if (roles.includes(UserRole.ADMIN) || roles.includes(UserRole.SUPER_ADMIN))
    targetPath += "/office";
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

/**
 * Converts a flat object to FormData, skipping null/undefined values.
 * Useful for Edit/Create toggles where empty fields shouldn't overwrite data.
 */
export const toFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    // 1. Skip null or undefined (prevents the error you saw)
    if (value === null || value === undefined) {
      return;
    }

    // 2. Handle Files/Blobs directly
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    }
    // 3. Handle Dates (convert to ISO string)
    else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    }
    // 4. Handle Objects/Arrays (stringify them if your backend expects JSON)
    else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    }
    // 5. Standard strings/numbers
    else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

export const getAcademicUnitAbbr = (name: string, abbr?: string | null) => {
  if (abbr) return abbr;

  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
};

type SortResult<T extends string> = {
  field: T;
  dir: "asc" | "desc";
};

export function parseSort<T extends string>(
  sort?: T | `-${T}`,
): SortResult<T> | null {
  if (!sort) return null;

  const isDesc = sort.startsWith("-");
  const field = (isDesc ? sort.slice(1) : sort) as T;

  return {
    field,
    dir: isDesc ? "desc" : "asc",
  };
}

export const getNameInitials = (name: string) =>
  name
    ?.split(" ")
    ?.slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

export const getFullName = (user: {
  first_name?: string | null;
  father_name?: string | null;
  grand_father_name?: string | null;
  email?: string;
}) => {
  const { first_name, father_name, grand_father_name, email } = user;

  // Build the name string
  const fullName = [first_name, father_name, grand_father_name]
    .filter(Boolean)
    .join(" ");

  // Return name, or fallback to email, or fallback to default
  return fullName.length > 0 ? fullName : (email ?? "Unknown");
};

export const formatType = (type: string) =>
  type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
