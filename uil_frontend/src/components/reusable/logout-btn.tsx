"use client";

import { logoutAction } from "@/app/actions/actions.auth";
import { ConfirmDialog } from "@/components/reusable/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LogoutBtn = () => {
  const clearUser = useUserStore((state) => state.clearUser);
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsPending(true);
    try {
      await logoutAction(); // Call server first
      clearUser(); // Clear local state
      setOpen(false); // Finally close
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        className="justify-start w-full h-10"
        onClick={() => setOpen(true)}
      >
        <LogOut className="mr-2 w-4 h-4" /> Logout
      </Button>

      <ConfirmDialog
        onOpen={open}
        onOpenChange={setOpen}
        onConfirm={handleLogout}
        isLoading={isPending}
        title="Confirm Logout"
        description="Are you sure you want to logout?"
        confirmText="Logout"
        variant="destructive"
      />
    </>
  );
};

export default LogoutBtn;
