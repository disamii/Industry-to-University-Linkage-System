/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { UserRole } from "./enums";
import { ACADEMIC_STOP_WORDS } from "./constants";

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
export const toFormData = (
  data: Record<string, any>,
  excludeKeys: string[] = [],
): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    // Skip excluded keys
    if (excludeKeys.includes(key)) {
      return;
    }

    // Skip null or undefined
    if (value === null || value === undefined) {
      return;
    }

    // Handle Files/Blobs directly
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    }
    // Handle Dates
    else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    }
    // Handle Objects/Arrays
    else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    }
    // Handle primitives
    else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

/**
 * Generic utility to handle bulk operations with individual result tracking.
 */
export const bulkOperationHandler = async <T extends number | string>(
  ids: T[],
  operation: (id: T) => Promise<any>,
) => {
  const results: { id: T; success: boolean; error?: string }[] = [];

  for (const id of ids) {
    try {
      await operation(id);
      results.push({ id, success: true });
    } catch (error: any) {
      results.push({
        id,
        success: false,
        error: error.message || "Operation failed",
      });
    }
  }

  return results;
};

export const getAcademicUnitAbbr = (name: string, abbr?: string | null) => {
  if (abbr) return abbr;

  const parts = name.split(/[\s-]+/).filter(Boolean);

  let filtered = parts.filter((w) => !ACADEMIC_STOP_WORDS.has(w.toLowerCase()));

  if (filtered.length === 0) filtered = parts;

  return filtered
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

export const getFullName = (
  user: {
    first_name?: string | null;
    father_name?: string | null;
    grand_father_name?: string | null;
    email?: string;
  },
  level?: 1 | 2 | 3, // 3 = full, 2 = first+father, 1 = father+grand
) => {
  const { first_name, father_name, grand_father_name, email } = user;

  const parts = [first_name, father_name, grand_father_name];

  // Decide how many parts to include based on level
  const slicedParts = level ? parts.slice(0, level) : parts;

  const fullName = slicedParts.filter(Boolean).join(" ");

  return fullName.length > 0 ? fullName : (email ?? "Unknown");
};

export const formatType = (type: string) =>
  type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
