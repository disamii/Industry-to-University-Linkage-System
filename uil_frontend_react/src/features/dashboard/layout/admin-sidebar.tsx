import Logo from "@/components/reusable/logo";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/contexts/sidebar-context";
import { LINKS } from "@/lib/constants";
import { UserRole } from "@/lib/enums";
import { getRoleByPath } from "@/lib/utils";
import {
  Building2,
  CheckSquare,
  ClipboardList,
  ExternalLink,
  FileBarChart,
  FileText,
  LayoutDashboard,
  Lightbulb,
  LucideIcon,
  Send,
  Settings,
  SquarePen,
  UserCheck,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import SidebarToggle from "./admin-sidebar-toggle";

type SupportedRole = Exclude<UserRole, UserRole.SUPER_ADMIN>;

const ROUTES: Record<
  SupportedRole,
  {
    label: string;
    links: { href: string; icon: LucideIcon; label: string }[];
  }
> = {
  [UserRole.ADMIN]: {
    label: "Office Portal",
    links: [
      { href: "/dashboard/office", icon: LayoutDashboard, label: "Dashboard" },
      {
        href: "/dashboard/office/requests",
        icon: ClipboardList,
        label: "Request Management",
      },
      {
        href: "/dashboard/office/assignments",
        icon: UserCheck,
        label: "Assignment Management",
      },
      {
        href: "/dashboard/office/posts",
        icon: SquarePen,
        label: "Post Management",
      },
      {
        href: "/dashboard/office/staff",
        icon: Users,
        label: "Staff Management",
      },
      {
        href: "/dashboard/office/partners",
        icon: Building2,
        label: "Industry Management",
      },
      {
        href: "/dashboard/office/analytics",
        icon: FileBarChart,
        label: "Analytics",
      },
      {
        href: "/dashboard/office/site-config",
        icon: Settings,
        label: "Site Configuration",
      },
    ],
  },
  [UserRole.INDUSTRY]: {
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
        href: LINKS.rpms,
        icon: Lightbulb,
        label: "Explore Research",
      },
    ],
  },
  [UserRole.STAFF]: {
    label: "Staff Portal",
    links: [
      { href: "/dashboard/staff", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/dashboard/staff/tasks", icon: CheckSquare, label: "My Tasks" },
    ],
  },
};

const isExternal = (link: string) => !link.startsWith("/dashboard");

function AdminSidebar() {
  const { showSidebar } = useSidebar();
  const { pathname } = useLocation();
  const role = getRoleByPath(pathname);

  const { links } = ROUTES[role as SupportedRole];

  return (
    <div
      className={`fixed left-0 top-0 z-50 h-screen ${showSidebar ? "w-72" : "w-20"} bg-white`}
    >
      <aside
        className={`relative flex flex-col p-4 border-background border-r-2 py-6`}
      >
        {showSidebar ? (
          <Logo hasLabel={true} className="pb-8" />
        ) : (
          <>
            <SidebarToggle />
            <Separator className="mt-17.5 mb-8" />
          </>
        )}

        <nav className={`space-y-2`}>
          {links.map((link) => (
            <AdminSidebarLink
              key={link.href}
              link={link}
              showSidebar={showSidebar}
              size={showSidebar ? 5 : 6}
            />
          ))}
        </nav>
      </aside>
    </div>
  );
}

interface SidebarLinkData {
  href: string;
  icon: LucideIcon;
  label: string;
}

interface SidebarLinkProps {
  link: SidebarLinkData;
  showSidebar?: boolean;
  size?: number;
}

function AdminSidebarLink({ link, showSidebar, size = 6 }: SidebarLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === link.href;
  const externalProps = isExternal(link.href)
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const linkClasses = `flex items-center gap-4 rounded-lg ${
    showSidebar ? "justify-start px-4 py-3.5" : "mb-6 justify-center px-1 py-2"
  } transition-colors ${
    isActive ? "text-bold bg-primary text-gray-50" : "hover:bg-primary/20"
  }`;

  const iconElement = <link.icon className={`size-${size}`} />;

  return showSidebar ? (
    <Link to={link.href} className={linkClasses} {...externalProps}>
      {iconElement}
      <span>{link.label}</span>
      {isExternal(link.href) && (
        <ExternalLink size={12} className="opacity-40" />
      )}
    </Link>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={link.href} className={linkClasses} {...externalProps}>
          {iconElement}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-sm">
        {link.label}
      </TooltipContent>
    </Tooltip>
  );
}

export default AdminSidebar;
