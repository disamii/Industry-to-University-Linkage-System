"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFullName, getNameInitials } from "@/lib/helpers";
import { useHasHydrated, useUserStore } from "@/store/useUserStore";
import { ArrowRightLeft, ChevronDown, Menu, Settings } from "lucide-react";
import LogoutBtn from "../reusable/logout-btn";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getAdminHomepageLink } from "@/lib/utils";
import { LINKS } from "@/lib/constants";
import HeaderLink from "./header-link";

const authLinks = [
  { href: LINKS.signin, label: "Sign in", variant: "secondary" as const },
  { href: LINKS.signup, label: "Get Started", variant: "default" as const },
];

const ProfileDropdown = () => {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const hasHydrated = useHasHydrated();

  const isDashboard = pathname.startsWith("/dashboard");

  if (!hasHydrated) {
    return <div className="bg-muted/20 border-b h-16 animate-pulse" />;
  }

  if (!user && !isDashboard)
    return (
      <>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {authLinks.map((link, idx) => (
            <HeaderLink key={idx} {...link} />
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={12}
              className="flex flex-col gap-2 bg-background/95 shadow-xl backdrop-blur-lg p-3 border-border/50 rounded-2xl w-56"
            >
              {/* Auth Links */}
              {authLinks.map((link, idx) => (
                <DropdownMenuItem
                  key={idx}
                  asChild
                  className="focus:bg-transparent p-0"
                >
                  <HeaderLink {...link} />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </>
    );

  if (!user) return null;

  const fullName =
    getFullName(user.first_name, user.father_name, user.grand_father_name) ||
    user.email;
  const initials = getNameInitials(fullName);
  const dashboardLink = getAdminHomepageLink(user.role);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-white dark:hover:bg-slate-900 p-1 pr-1 md:pr-3 border border-transparent hover:border-border/40 rounded-2xl h-auto transition-all"
        >
          <Avatar className="border border-border/50 rounded-xl w-8 md:w-9 h-8 md:h-9">
            <AvatarImage
              src={user.profile_picture || ""}
              alt="Profile"
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 font-bold text-[10px] text-primary md:text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Desktop Name/Role - Passing props down */}
          <UserInfo
            mode="trigger"
            user={user}
            fullName={fullName}
            initials={initials}
          />

          <ChevronDown className="ml-1 md:ml-2 w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="shadow-2xl mt-2 p-2 border-border/40 rounded-2xl w-60"
      >
        {/* Mobile Name/Role/Avatar - Passing props down */}
        <UserInfo
          mode="content"
          user={user}
          fullName={fullName}
          initials={initials}
        />

        <DropdownMenuItem className="p-3 rounded-xl cursor-pointer">
          <Settings className="mr-2 w-4 h-4" /> Settings
        </DropdownMenuItem>

        <DropdownMenuItem className="p-3 rounded-xl cursor-pointer" asChild>
          <Link href={isDashboard ? "/" : dashboardLink}>
            <ArrowRightLeft className="mr-2 w-4 h-4" />
            Switch to {isDashboard ? "User" : "Dashboard"}
          </Link>
        </DropdownMenuItem>

        <LogoutBtn />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UserInfo = ({
  mode,
  user,
  fullName,
  initials,
}: {
  mode: "trigger" | "content";
  user: any;
  fullName: string;
  initials: string;
}) => {
  const isContent = mode === "content";

  return (
    <div
      className={`flex items-center ${
        isContent
          ? "p-3 mb-2 border-b border-border/40 md:hidden"
          : "hidden md:flex ml-3 text-left"
      }`}
    >
      {isContent && (
        <Avatar className="mr-3 border border-border/50 rounded-xl w-10 h-10">
          <AvatarImage
            src={user.profile_picture || ""}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/10 font-bold text-primary text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}

      <div className="max-w-35 overflow-hidden">
        <p className="font-bold text-sm truncate leading-none">{fullName}</p>
        <p className="mt-1 text-[10px] text-muted-foreground truncate capitalize tracking-tight">
          {user.role} User Account
        </p>
      </div>
    </div>
  );
};

export default ProfileDropdown;
