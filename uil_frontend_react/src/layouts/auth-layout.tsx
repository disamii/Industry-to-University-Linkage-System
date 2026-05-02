import AuthFooter from "@/features/auth/auth-footer";
import AuthHeader from "@/features/auth/auth-header";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-6 p-6 min-h-screen">
      <main className="space-y-10">
        <AuthHeader />
        <Outlet />
        <AuthFooter />
      </main>
    </div>
  );
};

export default AuthLayout;
