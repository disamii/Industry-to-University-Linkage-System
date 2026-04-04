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
import { ChevronDown, Settings } from "lucide-react";
import LogoutBtn from "./logout-btn";

const ProfileDropdown = () => {
  const user = useUserStore((state) => state.user);
  const hasHydrated = useHasHydrated();

  if (!hasHydrated) {
    return <div className="bg-muted/20 border-b h-16 animate-pulse" />;
  }

  if (!user) return null;

  const fullName =
    getFullName(user.first_name, user.father_name, user.grand_father_name) ||
    user.email;
  const initials = getNameInitials(fullName, user.email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-white dark:hover:bg-slate-900 p-1 pr-2 md:pr-3 border border-transparent hover:border-border/40 rounded-2xl h-auto transition-all"
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
          <div className="hidden md:block ml-3 max-w-35 text-left">
            <p className="font-bold text-sm truncate leading-none">
              {fullName}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground truncate capitalize tracking-tight">
              {user.role} User Account
            </p>
          </div>
          <ChevronDown className="ml-1 md:ml-2 w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="shadow-2xl mt-2 p-2 border-border/40 rounded-2xl w-56"
      >
        <DropdownMenuItem className="p-3 rounded-xl cursor-pointer">
          <Settings className="mr-2 w-4 h-4" /> Settings
        </DropdownMenuItem>
        <LogoutBtn />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
