import StaffAssignments from "@/pages/dashboard/staff/staff-assignments";
import StaffDashboard from "@/pages/dashboard/staff/staff-dashboard";
import { RouteObject } from "react-router-dom";

const base = "dashboard/staff";

const withBase = (path: string) => `${base}/${path}`;

export const staffRoutes: RouteObject[] = [
  { path: withBase(""), element: <StaffDashboard /> },
  { path: withBase("assignments"), element: <StaffAssignments /> },
];
