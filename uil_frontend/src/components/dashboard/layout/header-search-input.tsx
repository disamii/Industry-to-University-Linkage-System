"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const HeaderSearchInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when dialog opens
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <div className="relative flex-1 max-w-md">
      {/* Desktop search input */}
      <div className="group hidden sm:block relative">
        <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors -translate-y-1/2" />
        <Input
          placeholder="Search dashboard..."
          className="bg-white dark:bg-slate-900 shadow-sm pl-10 border-border/40 rounded-xl focus:ring-primary w-full h-11"
        />
      </div>

      {/* Mobile search dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="sm:hidden p-2 rounded-md">
            <Search className="w-5 h-5 text-muted-foreground" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:hidden bg-white dark:bg-slate-900 rounded-xl">
          <DialogTitle className="sr-only">Search Input</DialogTitle>
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              placeholder="Search dashboard..."
              className="rounded-md focus:ring-primary"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeaderSearchInput;
