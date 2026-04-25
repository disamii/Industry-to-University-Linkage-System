import { RouteObject } from "react-router-dom";
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";
import ForgotPassword from "@/pages/auth/forgot-password";

export const authRoutes: RouteObject[] = [
  { path: "login", element: <Login /> },
  { path: "signup", element: <Signup /> },
  { path: "forgot-password", element: <ForgotPassword /> },
];
