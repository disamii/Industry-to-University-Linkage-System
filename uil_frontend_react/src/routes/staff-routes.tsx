import StaffAssignmentsPage from "@/pages/dashboard/staff/staff-assignments-page";
import StaffDashboard from "@/pages/dashboard/staff/staff-dashboard";
import SubmitRequestStaff from "@/pages/dashboard/staff/submit-request-staff";
import { RouteObject } from "react-router-dom";

const base = "dashboard/staff";

const withBase = (path: string) => `${base}/${path}`;

export const staffRoutes: RouteObject[] = [
  { path: withBase(""), element: <StaffDashboard /> },
  { path: withBase("assignments"), element: <StaffAssignmentsPage /> },
  // {
  //   path: withBase("assignments/:id"),
  //   element: <StaffAssignmentDetail />,
  // },
  { path: withBase("requests/create"), element: <SubmitRequestStaff /> },
];
