import Logo from "@/components/reusable/logo";
import ProfileDropdown from "@/components/reusable/profile-dropdown";
import { useSidebar } from "@/contexts/SidebarContext";
import SidebarToggle from "./admin-sidebar-toggle";

function AdminHeader() {
  const { showSidebar } = useSidebar();

  return (
    <header className="top-0 sticky bg-white shadow-xs w-full">
      <nav
        className={`${showSidebar ? "ml-72 pl-4 pr-12" : "ml-20 px-6"} flex items-center justify-between p-6 py-4`}
      >
        {showSidebar ? <SidebarToggle /> : <Logo hasLabel={true} />}

        <div className="flex items-center gap-2 px-6 shrink-0">
          <div className="mx-2 bg-border w-0.5 h-6" />
          <ProfileDropdown />
        </div>
      </nav>
    </header>
  );
}

export default AdminHeader;
