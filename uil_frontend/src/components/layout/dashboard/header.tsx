"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SidebarContent } from "./sidebar";
import { Input } from "@/components/ui/input";
import { getAdminRole } from "@/lib/utils";

const AdminHeader = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex justify-between items-center bg-transparent px-4 md:px-8 h-20 shrink-0">
      <div className="flex flex-1 items-center gap-4">
        {/* Mobile Menu Trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-white dark:hover:bg-slate-900 shadow-sm border border-transparent hover:border-border/40 rounded-xl"
            >
              <Menu className="w-5 h-5 text-muted-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-transparent p-4 border-none w-80"
          >
            <SidebarContent
              role={getAdminRole(pathname)}
              pathname={pathname}
              setOpen={setOpen}
            />
          </SheetContent>
        </Sheet>

        {/* Search - Hidden on small mobile */}
        <div className="hidden sm:block flex-1 max-w-md">
          <div className="group relative">
            <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors -translate-y-1/2" />
            <Input
              placeholder="Search dashboard..."
              className="bg-white dark:bg-slate-900 shadow-sm pl-10 border-border/40 rounded-xl focus:ring-primary w-full h-11"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="outline"
          size="icon"
          className="relative bg-white dark:bg-slate-900 shadow-sm border-border/40 rounded-xl w-10 h-10"
        >
          <Bell className="w-4 h-4" />
          <span className="top-2.5 right-2.5 absolute bg-primary border-2 border-white dark:border-slate-900 rounded-full w-2 h-2" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="hover:bg-white dark:hover:bg-slate-900 p-1 pr-2 md:pr-3 border border-transparent hover:border-border/40 rounded-2xl h-auto transition-all"
            >
              <Avatar className="border border-border/50 rounded-xl w-8 md:w-9 h-8 md:h-9">
                <AvatarFallback className="bg-primary/10 font-bold text-[10px] text-primary md:text-xs">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block ml-3 text-left">
                <p className="font-bold text-sm leading-none">John Doe</p>
                <p className="mt-1 text-[10px] text-muted-foreground capitalize tracking-tight">
                  {getAdminRole(pathname)} User Account
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
            <DropdownMenuItem className="focus:bg-destructive/10 p-3 rounded-xl text-destructive focus:text-destructive cursor-pointer">
              <LogOut className="mr-2 w-4 h-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
