import OfficeDashboard from "@/pages/dashboard/office/office-dashboard";
import OfficeIndustryRequests from "@/pages/dashboard/office/office-industry_requests";
import { RouteObject } from "react-router-dom";

const base = "dashboard/office";

const withBase = (path: string) => `${base}/${path}`;

export const officeRoutes: RouteObject[] = [
  { path: withBase(""), element: <OfficeDashboard /> },
  { path: withBase("requests"), element: <OfficeIndustryRequests /> },
];
