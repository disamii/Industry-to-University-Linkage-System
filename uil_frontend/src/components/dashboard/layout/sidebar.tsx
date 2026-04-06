"use client";

import Logo from "@/components/reusable/logo";
import { cn, getAdminRole } from "@/lib/utils";
import {
  Building2,
  CheckSquare,
  ClipboardList,
  ExternalLink,
  FileBarChart,
  FileText,
  LayoutDashboard,
  Lightbulb,
  Send,
  SquarePen,
  UserCircle,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ROUTES = {
  office: {
    label: "Office Portal",
    links: [
      { href: "/dashboard/office", icon: LayoutDashboard, label: "Overview" },
      { href: "/dashboard/office/requests", icon: FileText, label: "Requests" },
      {
        href: "/dashboard/office/assignments",
        icon: ClipboardList,
        label: "Assignments",
      },
      {
        href: "/dashboard/office/posts",
        icon: SquarePen,
        label: "Posts",
      },
      {
        href: "/dashboard/office/staff",
        icon: Users,
        label: "Staff Directory",
      },
      {
        href: "/dashboard/office/partners",
        icon: Building2,
        label: "Partners",
      },
      {
        href: "/dashboard/office/analytics",
        icon: FileBarChart,
        label: "Analytics",
      },
    ],
  },
  industry: {
    label: "Industry Portal",
    links: [
      {
        href: "/dashboard/industry",
        icon: LayoutDashboard,
        label: "Dashboard",
      },
      {
        href: "/dashboard/industry/requests",
        icon: FileText,
        label: "My Requests",
      },
      {
        href: "/dashboard/industry/requests/create",
        icon: Send,
        label: "Submit Request",
      },
      {
        href: "http://10.161.65.18/",
        icon: Lightbulb,
        label: "Explore Research",
      },
    ],
  },
  staff: {
    label: "Staff Portal",
    links: [
      { href: "/dashboard/staff", icon: LayoutDashboard, label: "Task Board" },
      { href: "/dashboard/staff/tasks", icon: CheckSquare, label: "My Tasks" },
      { href: "/dashboard/staff/account", icon: UserCircle, label: "Account" },
    ],
  },
};

const isExternal = (link: string) => !link.startsWith("/dashboard");

export const SidebarContent = ({
  role,
  pathname,
  setOpen,
}: {
  role: keyof typeof ROUTES;
  pathname: string;
  setOpen?: (open: boolean) => void;
}) => {
  const { links, label } = ROUTES[role];

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-slate-900 shadow-sm border border-border/50 lg:rounded-[2.5rem] overflow-hidden">
      <Logo label={label} />

      <nav className="flex-1 space-y-1.5 px-4">
        {links.map((link, idx) => {
          const isActive = pathname === link.href;
          const externalProps = isExternal(link.href)
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {};

          return (
            <Link
              key={`${link.href}-${idx}`}
              href={link.href}
              onClick={() => setOpen?.(false)}
              className={cn(
                "group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
              {...externalProps}
            >
              <link.icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-white" : "text-primary/40",
                )}
              />
              <span className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight">
                  {link.label}
                </span>
                {isExternal(link.href) && (
                  <ExternalLink size={12} className="opacity-40" />
                )}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-6">
        <div className="bg-accent/50 p-4 border border-border/50 rounded-2xl">
          <p className="font-bold text-[10px] text-muted-foreground text-center uppercase tracking-widest">
            v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden top-0 sticky lg:flex flex-col p-4 w-72 h-screen shrink-0">
      <SidebarContent role={getAdminRole(pathname)} pathname={pathname} />
    </aside>
  );
};

export default AdminSidebar;
