import { LINKS } from "@/lib/constants";
import HomePage from "@/pages/public/home-page";
import NotFoundPage from "@/pages/not-found";
import UnauthorizedPage from "@/pages/unauthorized";
import { RouteObject } from "react-router-dom";
import TermsPage from "@/pages/public/terms-page";
import PrivacyPage from "@/pages/public/privacy-page";

export const publicRoutes: RouteObject[] = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    // path: LINKS.about,
    // element: <AboutPage />,
  },
  {
    path: LINKS.terms,
    element: <TermsPage />,
  },
  {
    path: LINKS.privacy,
    element: <PrivacyPage />,
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
