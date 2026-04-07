import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropdownAction = {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: "default" | "destructive";
  showSeparator?: boolean; // Adds a separator BEFORE this item
};

interface ReusableActionDropdownProps {
  actions: DropdownAction[];
  triggerIcon?: LucideIcon;
  align?: "start" | "center" | "end";
  className?: string;
}

export const ActionDropdown = ({
  actions,
  triggerIcon: TriggerIcon = MoreVertical,
  align = "end",
  className,
}: ReusableActionDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8"
          onClick={(e) => e.stopPropagation()}
        >
          <TriggerIcon className="w-4 h-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className={cn("w-44", className)}>
        {actions.map((action, index) => (
          <React.Fragment key={action.label}>
            {action.showSeparator && index !== 0 && <DropdownMenuSeparator />}

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              className={cn(
                "cursor-pointer",
                action.variant === "destructive" &&
                  "text-red-600 focus:text-red-600 focus:bg-red-50",
              )}
            >
              {action.icon && <action.icon className="mr-2 w-4 h-4" />}
              {action.label}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
