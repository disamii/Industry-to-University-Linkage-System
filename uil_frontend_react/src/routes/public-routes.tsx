import Home from "@/pages/public/home";
import { RouteObject } from "react-router-dom";

export const publicRoutes: RouteObject[] = [
  {
    index: true,
    element: <Home />,
  },
];
