import { ScrollToTop } from "@/lib/utils";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="p-4 grow">
        <ScrollToTop />

        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
