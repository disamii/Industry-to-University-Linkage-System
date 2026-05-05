import IndustryDashboard from "@/pages/dashboard/industry/industry-dashboard";
import IndustryRequestEditPage from "@/pages/dashboard/industry/industry_request-edit-page";
import IndustryRequestDetailPage from "@/pages/dashboard/industry/industry_request-detail-page";
import IndustryRequestsPage from "@/pages/dashboard/industry/industry_requests-page";

import IndustryRequestSubmitPage from "@/pages/dashboard/industry/industry_request-submit-page";
import { RouteObject } from "react-router-dom";

const base = "dashboard/industry";

const withBase = (path: string) => `${base}/${path}`;

export const industryRoutes: RouteObject[] = [
  { path: withBase(""), element: <IndustryDashboard /> },
  { path: withBase("requests"), element: <IndustryRequestsPage /> },
  { path: withBase("requests/:id"), element: <IndustryRequestDetailPage /> },
  { path: withBase("requests/create"), element: <IndustryRequestSubmitPage /> },
  { path: withBase("requests/:id/edit"), element: <IndustryRequestEditPage /> },
];
