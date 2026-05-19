import PublicFooter from "@/features/public/layout/footer";
import PublicHeader from "@/features/public/layout/header";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-6 w-full min-h-screen">
      <div className="space-y-10 w-full">
        <PublicHeader />
        <main className="flex justify-center items-center mx-auto px-3 lg:px-6 pt-40 pb-24 w-full max-w-7xl">
          <Outlet />
        </main>
        <PublicFooter />
      </div>
    </div>
  );
};

export default PublicLayout;
