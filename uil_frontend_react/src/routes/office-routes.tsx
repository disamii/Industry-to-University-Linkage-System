import IndustryDetailPage from "@/pages/dashboard/office/industry/industry-detail-page";
import IndustryManagementPage from "@/pages/dashboard/office/industry/industry-management-page";
import OfficeAssignmentDetailPage from "@/pages/dashboard/office/assignment/office-assignment-detail-page";
import AssignmentsPage from "@/pages/dashboard/office/assignment/office-assignments-page";
import OfficeDashboard from "@/pages/dashboard/office/office-dashboard";
import OfficeRequestDetailPage from "@/pages/dashboard/office/request/office_request-detail-page";
import OfficeRequestEditPage from "@/pages/dashboard/office/request/office_request-edit-page";
import OfficeRequestSubmitPage from "@/pages/dashboard/office/request/office_request-submit-page";
import OfficeRequestsPage from "@/pages/dashboard/office/request/office_requests-page";
import PostCreatePage from "@/pages/dashboard/office/post/post-create-page";
import PostsPage from "@/pages/dashboard/office/post/posts-page";
import SiteConfigPage from "@/pages/dashboard/office/site-config-page";
import { RouteObject } from "react-router-dom";
import PostEditPage from "@/pages/dashboard/office/post/post-edit-page";
import PostDetailPage from "@/pages/dashboard/office/post/post-detail-page";

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
    path: withBase("posts/:id"),
    element: <PostDetailPage />,
  },
  {
    path: withBase("posts/create"),
    element: <PostCreatePage />,
  },
  {
    path: withBase("posts/:id/edit"),
    element: <PostEditPage />,
  },
  {
    path: withBase("industries"),
    element: <IndustryManagementPage />,
  },
  {
    path: withBase("industries/:id"),
    element: <IndustryDetailPage />,
  },
  {
    path: withBase("site-config"),
    element: <SiteConfigPage />,
  },
];
