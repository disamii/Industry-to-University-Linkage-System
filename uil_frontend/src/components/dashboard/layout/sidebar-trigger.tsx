"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getAdminRole } from "@/lib/utils";
import { Menu } from "lucide-react";
import { SidebarContent } from "./sidebar";
import { usePathname } from "next/navigation";
import { useState } from "react";

const SidebarTrigger = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
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
      <SheetContent side="left" className="bg-transparent p-4 border-none w-80">
        <SidebarContent
          role={getAdminRole(pathname)}
          pathname={pathname}
          setOpen={setOpen}
        />
      </SheetContent>
    </Sheet>
  );
};

export default SidebarTrigger;
