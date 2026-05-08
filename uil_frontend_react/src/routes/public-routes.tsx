import { LINKS } from "@/lib/constants";
import Home from "@/pages/public/home";
import NotFoundPage from "@/pages/not-found";
import UnauthorizedPage from "@/pages/unauthorized";
import { RouteObject } from "react-router-dom";

export const publicRoutes: RouteObject[] = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: LINKS.unauthorized,
    element: <UnauthorizedPage />,
  },
  {
    path: LINKS.not_found,
    element: <NotFoundPage />,
  },
];
