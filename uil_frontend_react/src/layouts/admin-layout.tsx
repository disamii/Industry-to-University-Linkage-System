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
        className={`${showSidebar ? "ml-80 py-10 pr-20" : "ml-30 py-10"}  flex-1 overflow-y-auto max-w-7xl px-2`}
      >
        {children}
      </main>
    </div>
  );
}
