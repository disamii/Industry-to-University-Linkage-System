import IndustryDashboard from "@/pages/dashboard/industry/industry-dashboard";
import IndustryRequests from "@/pages/dashboard/industry/industry-requests";
import IndustrySubmitRequest from "@/pages/dashboard/industry/industry-submit-request";
import { RouteObject } from "react-router-dom";

const base = "dashboard/industry";

const withBase = (path: string) => `${base}/${path}`;

export const industryRoutes: RouteObject[] = [
  { path: withBase(""), element: <IndustryDashboard /> },
  { path: withBase("requests"), element: <IndustryRequests /> },
  { path: withBase("submit-request"), element: <IndustrySubmitRequest /> },
];
