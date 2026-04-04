"use client";

import HeaderSearchInput from "./header-search-input";
import NotificationBtn from "../../layout/notification-btn";
import ProfileDropdown from "../../layout/profile-dropdown";
import SidebarTrigger from "./sidebar-trigger";
import { ThemeToggle } from "@/components/theme-toggle";

const AdminHeader = () => {
  return (
    <header className="flex justify-between items-center bg-transparent px-4 md:px-8 h-20 shrink-0">
      <div className="flex flex-1 items-center gap-4">
        <SidebarTrigger />
        <HeaderSearchInput />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
        <NotificationBtn />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default AdminHeader;
