import { RouteObject } from "react-router-dom";
import Signin from "@/pages/auth/signin";
import Signup from "@/pages/auth/signup";
import ForgotPassword from "@/pages/auth/forgot-password";

export const authRoutes: RouteObject[] = [
  { path: "signin", element: <Signin /> },
  { path: "signup", element: <Signup /> },
  { path: "forgot-password", element: <ForgotPassword /> },
];
