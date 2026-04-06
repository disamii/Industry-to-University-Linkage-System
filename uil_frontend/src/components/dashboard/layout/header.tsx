"use client";

import HeaderSearchInput from "./header-search-input";
import NotificationBtn from "../../layout/notification-btn";
import ProfileDropdown from "../../layout/profile-dropdown";
import SidebarTrigger from "./sidebar-trigger";
import { ThemeToggle } from "@/components/reusable/theme-toggle";

const AdminHeader = () => {
  return (
    <header className="top-0 sticky bg-transparent w-full shrink-0">
      <div className="flex justify-between items-center backdrop-blur-3xl mt-4 px-2 md:px-6 py-3 rounded-full">
        <div className="flex flex-1 items-center gap-4">
          <SidebarTrigger />
          <HeaderSearchInput />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <NotificationBtn />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
