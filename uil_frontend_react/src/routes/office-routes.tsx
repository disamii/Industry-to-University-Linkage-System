import AssignmentsPage from "@/pages/dashboard/office/assignments-page";
import IndustryRequestsOfficePage from "@/pages/dashboard/office/industry_requests-office-page";
import IndustryRequestDetailOfficePage from "@/pages/dashboard/office/industry_requset-detail-office-page";
import OfficeDashboard from "@/pages/dashboard/office/office-dashboard";
import PostsPage from "@/pages/dashboard/office/posts-page";
import SiteConfigPage from "@/pages/dashboard/office/site-config-page";
import { RouteObject } from "react-router-dom";

const base = "dashboard/office";

const withBase = (path: string) => `${base}/${path}`;

export const officeRoutes: RouteObject[] = [
  { path: withBase(""), element: <OfficeDashboard /> },
  { path: withBase("requests"), element: <IndustryRequestsOfficePage /> },
  {
    path: withBase("requests/:id"),
    element: <IndustryRequestDetailOfficePage />,
  },
  {
    path: withBase("assignments"),
    element: <AssignmentsPage />,
  },
  {
    path: withBase("posts"),
    element: <PostsPage />,
  },
  {
    path: withBase("site-config"),
    element: <SiteConfigPage />,
  },
];
