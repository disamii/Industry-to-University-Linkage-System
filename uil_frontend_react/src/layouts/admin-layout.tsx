import { useSidebar } from "@/contexts/sidebar-context";
import AdminHeader from "@/features/dashboard/layout/admin-header";
import AdminSidebar from "@/features/dashboard/layout/admin-sidebar";
import { type ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AppLayoutProps) {
  const { showSidebar } = useSidebar();

  return (
    <div className="grid grid-rows-[auto_1fr] w-full">
      <AdminSidebar />
      <AdminHeader />

      <main
        className={`w-full ${showSidebar ? "pl-80 pr-40 py-10" : "pl-30 pr-15 py-10"}  flex-1 overflow-y-auto px-2 mx-auto`}
      >
        {children}
      </main>
    </div>
  );
}
