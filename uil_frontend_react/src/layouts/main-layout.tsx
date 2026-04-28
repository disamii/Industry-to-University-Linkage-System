import { ScrollToTop } from "@/lib/utils";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <ScrollToTop />

      <Outlet />
    </div>
  );
};

export default MainLayout;
