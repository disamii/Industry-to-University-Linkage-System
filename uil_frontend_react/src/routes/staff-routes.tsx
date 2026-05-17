import StaffAssignmentDetail from "@/pages/dashboard/staff/staff-assignment-detail-page";
import StaffAssignmentsPage from "@/pages/dashboard/staff/staff-assignments-page";
import StaffDashboard from "@/pages/dashboard/staff/staff-dashboard";
import StaffManageAccountPage from "@/pages/dashboard/staff/staff-manage-account-page";
import StaffRequestDetailPage from "@/pages/dashboard/staff/staff_request-detail-page";
import StaffRequestEditPage from "@/pages/dashboard/staff/staff_request-edit-page";
import StaffRequestSubmitPage from "@/pages/dashboard/staff/staff_request-submit-page";
import StaffRequestsPage from "@/pages/dashboard/staff/staff_requests-page";
import { RouteObject } from "react-router-dom";

const base = "dashboard/staff";

const withBase = (path: string) => `${base}/${path}`;

export const staffRoutes: RouteObject[] = [
  { path: withBase(""), element: <StaffDashboard /> },
  { path: withBase("manage-account"), element: <StaffManageAccountPage /> },
  { path: withBase("assignments"), element: <StaffAssignmentsPage /> },
  {
    path: withBase("assignments/:id"),
    element: <StaffAssignmentDetail />,
  },
  { path: withBase("requests"), element: <StaffRequestsPage /> },
  {
    path: withBase("requests/:id"),
    element: <StaffRequestDetailPage />,
  },
  { path: withBase("requests/create"), element: <StaffRequestSubmitPage /> },
  { path: withBase("requests/:id/edit"), element: <StaffRequestEditPage /> },
];
