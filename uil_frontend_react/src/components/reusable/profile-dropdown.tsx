import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, Repeat, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmLogoutDialog from "./confirm-logout-dialog";
import UserAvatar from "./user-avatar";
import { useState } from "react";
import { getFullName } from "@/lib/helpers";

interface ProfileDropdownProps {
  className?: string;
}

export default function ProfileDropdown({ className }: ProfileDropdownProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { pathname } = useLocation();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const userName = getFullName(user?.first_name, user?.father_name);

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
          <span className="font-medium">{userName || "User"}</span>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="py-3 cursor-pointer"
          onClick={() => navigate("/manage-account/credentials")}
        >
          <User size={18} className="mr-2" />
          Manage your Profile
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
