import { ReactNode } from "react";
import AdminSidebar from "@/components/dashboard/layout/sidebar";
import AdminHeader from "@/components/dashboard/layout/header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start bg-[#fcfcfd] dark:bg-slate-950 min-h-screen">
      {/* Persistent Desktop Sidebar */}
      <AdminSidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <AdminHeader />

        {/* Content area with responsive padding */}
        <main className="flex-1 p-4 md:p-8 pt-2 animate-in duration-500 fade-in">
          <div className="mx-auto max-w-7xl">
            {" "}
            <div className="space-y-8 pb-10">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
