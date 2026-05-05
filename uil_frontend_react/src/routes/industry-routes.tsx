import IndustryDashboard from "@/pages/dashboard/industry/industry-dashboard";
import IndustryEditRequestPage from "@/pages/dashboard/industry/industry-edit-request-page";
import IndustryRequestDetailPage from "@/pages/dashboard/industry/industry-request-detail-page";
import IndustryRequestsPage from "@/pages/dashboard/industry/industry-requests-page";

import IndustrySubmitRequestPage from "@/pages/dashboard/industry/industry-submit-request-page";
import { RouteObject } from "react-router-dom";

const base = "dashboard/industry";

const withBase = (path: string) => `${base}/${path}`;

export const industryRoutes: RouteObject[] = [
  { path: withBase(""), element: <IndustryDashboard /> },
  { path: withBase("requests"), element: <IndustryRequestsPage /> },
  { path: withBase("requests/:id"), element: <IndustryRequestDetailPage /> },
  { path: withBase("requests/create"), element: <IndustrySubmitRequestPage /> },
  { path: withBase("requests/:id/edit"), element: <IndustryEditRequestPage /> },
];
