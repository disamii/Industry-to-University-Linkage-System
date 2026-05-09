import IndustryManagementPage from "@/pages/dashboard/office/industry-management-page";
import OfficeAssignmentDetailPage from "@/pages/dashboard/office/office-assignment-detail-page";
import AssignmentsPage from "@/pages/dashboard/office/office-assignments-page";
import OfficeDashboard from "@/pages/dashboard/office/office-dashboard";
import OfficeRequestDetailPage from "@/pages/dashboard/office/office_request-detail-page";
import OfficeRequestEditPage from "@/pages/dashboard/office/office_request-edit-page";
import OfficeRequestSubmitPage from "@/pages/dashboard/office/office_request-submit-page";
import OfficeRequestsPage from "@/pages/dashboard/office/office_requests-page";
import PostsPage from "@/pages/dashboard/office/posts-page";
import SiteConfigPage from "@/pages/dashboard/office/site-config-page";
import { RouteObject } from "react-router-dom";

const base = "dashboard/office";

const withBase = (path: string) => `${base}/${path}`;

export const officeRoutes: RouteObject[] = [
  { path: withBase(""), element: <OfficeDashboard /> },
  { path: withBase("requests"), element: <OfficeRequestsPage /> },
  {
    path: withBase("requests/:id"),
    element: <OfficeRequestDetailPage />,
  },
  { path: withBase("requests/create"), element: <OfficeRequestSubmitPage /> },
  { path: withBase("requests/:id/edit"), element: <OfficeRequestEditPage /> },
  {
    path: withBase("assignments"),
    element: <AssignmentsPage />,
  },
  {
    path: withBase("assignments/:id"),
    element: <OfficeAssignmentDetailPage />,
  },
  {
    path: withBase("posts"),
    element: <PostsPage />,
  },
  {
    path: withBase("industries"),
    element: <IndustryManagementPage />,
  },
  {
    path: withBase("site-config"),
    element: <SiteConfigPage />,
  },
];
