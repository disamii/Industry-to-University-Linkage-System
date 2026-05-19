import { Button } from "@/components/ui/button"; // Added Button import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LINKS } from "@/lib/constants";
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

const ProfileDropdown = ({ className }: ProfileDropdownProps) => {
  const { user } = useAuthStore();
  const homepage = getAdminHomepageLink(user?.roles ? user?.roles : []);

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const userName = getFullName({ ...user }, 2);

  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/dashboard");

  // 1. Render Login/Signup buttons if the user is not authenticated
  if (!user) {
    return (
      <div className={`flex items-center gap-2 ${className || ""}`}>
        <Button variant="ghost" asChild>
          <Link to={LINKS.signin}>Login</Link>
        </Button>
        <Button asChild>
          <Link to={LINKS.signup}>Sign Up</Link>
        </Button>
      </div>
    );
  }

  // 2. Render the original dropdown if the user IS authenticated
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

        <DropdownMenuItem className="py-3 cursor-pointer" asChild>
          <Link to={isAdmin ? "/" : homepage}>
            <Repeat size={18} className="mr-2" />
            Switch to {isAdmin ? "User" : "Admin"}
          </Link>
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
};

export default ProfileDropdown;
