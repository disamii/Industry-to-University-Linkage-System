import { ReactNode } from "react";
import AdminSidebar from "@/components/layout/dashboard/sidebar";
import AdminHeader from "@/components/layout/dashboard/header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex bg-[#fcfcfd] dark:bg-slate-950 min-h-screen overflow-x-hidden">
      {/* Persistent Desktop Sidebar */}
      <AdminSidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <AdminHeader />

        {/* Content area with responsive padding */}
        <main className="flex-1 p-4 md:p-8 pt-2 animate-in duration-500 fade-in">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
