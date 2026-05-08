import IndustryManagementPage from "@/pages/dashboard/office/industry-management-page";
import IndustryRequestDetailOfficePage from "@/pages/dashboard/office/industry_requset-detail-office-page";
import AssignmentDetailPage from "@/pages/dashboard/office/office-assignment-detail-page";
import AssignmentsPage from "@/pages/dashboard/office/office-assignments-page";
import OfficeDashboard from "@/pages/dashboard/office/office-dashboard";
import PostsPage from "@/pages/dashboard/office/posts-page";
import RequestsOfficePage from "@/pages/dashboard/office/requests-office-page";
import SiteConfigPage from "@/pages/dashboard/office/site-config-page";
import { RouteObject } from "react-router-dom";

const base = "dashboard/office";

const withBase = (path: string) => `${base}/${path}`;

export const officeRoutes: RouteObject[] = [
  { path: withBase(""), element: <OfficeDashboard /> },
  { path: withBase("requests"), element: <RequestsOfficePage /> },
  {
    path: withBase("requests/:id"),
    element: <IndustryRequestDetailOfficePage />,
  },
  {
    path: withBase("assignments"),
    element: <AssignmentsPage />,
  },
  {
    path: withBase("assignments/:id"),
    element: <AssignmentDetailPage />,
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
