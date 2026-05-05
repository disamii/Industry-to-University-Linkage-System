import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ConfirmLogoutDialog = ({ open, onOpenChange }: Props) => {
  const navigate = useNavigate();
  const { clearAuth, user } = useAuthStore();
  const queryClient = useQueryClient();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
          <DialogDescription>
            <strong>{user?.first_name}</strong> Are you sure do you want to
            logout from your account?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="-mb-3">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            onClick={() => {
              clearAuth();
              queryClient.clear();
              navigate("/auth");
            }}
          >
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmLogoutDialog;
