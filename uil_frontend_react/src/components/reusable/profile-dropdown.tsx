import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetRoleByPath } from "@/hooks/use-get-role-by-path";
import { getAdminHomepageLink, getFullName } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import { LogOut, Repeat, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ConfirmLogoutDialog from "./confirm-logout-dialog";
import UserAvatar from "./user-avatar";

interface ProfileDropdownProps {
  className?: string;
}

export default function ProfileDropdown({ className }: ProfileDropdownProps) {
  const { user } = useAuthStore();

  const { pathname } = useLocation();

  const role = useGetRoleByPath();
  const homepage = getAdminHomepageLink(role ? [role] : []);

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const userName = getFullName({ ...user });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <div className="cursor-pointer">
          <UserAvatar
            imageUrl={user?.profile_picture}
            userName={userName}
            size="sm"
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-60 font-medium">
        <div className="flex items-center gap-3 p-3">
          <UserAvatar
            imageUrl={user?.profile_picture}
            userName={userName}
            size="md"
          />
          <div className="">
            <p className="font-medium">{userName || "User"}</p>
            <p className="max-w-40 text-muted-foreground text-xs truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="py-3 cursor-pointer" asChild>
          <Link to={`${homepage}/manage-account`}>
            <User size={18} className="mr-2" />
            Manage your Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="py-3 cursor-pointer">
          <Repeat size={18} className="mr-2" />
          Switch to {pathname.startsWith("dashboard") ? "Admin" : "User"}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="hover:bg-destructive/10! py-3 text-destructive hover:text-destructive! cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setOpenLogoutDialog(true);
          }}
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </DropdownMenuItem>

        <ConfirmLogoutDialog
          open={openLogoutDialog}
          onOpenChange={setOpenLogoutDialog}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
