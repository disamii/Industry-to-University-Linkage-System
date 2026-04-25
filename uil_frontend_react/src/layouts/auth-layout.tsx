import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="p-4 grow">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
