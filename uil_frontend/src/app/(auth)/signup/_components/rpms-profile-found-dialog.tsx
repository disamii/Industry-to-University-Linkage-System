"use client";

import SubmitButton from "@/components/dashboard/forms/submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckStaffEmailResponse } from "@/types/interfaces.auth";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useSignin } from "../../_hooks/useSignin";
import { getFullName, getNameInitials } from "@/lib/helpers";

type Props = {
  rpmsUserData: CheckStaffEmailResponse | null;
  showFoundDialog: boolean;
  setShowFoundDialog: (open: boolean) => void;
};

const RpmsProfileFoundDialog = ({
  rpmsUserData,
  showFoundDialog,
  setShowFoundDialog,
}: Props) => {
  const [password, setPassword] = useState("");
  const fullName = getFullName(
    rpmsUserData?.first_name,
    rpmsUserData?.father_name,
    rpmsUserData?.grand_father_name,
  );

  // Destructure state and formAction from our DRY hook
  const { state, formAction } = useSignin(() => {
    setPassword("");
    setShowFoundDialog(false);
  });

  return (
    <Dialog open={showFoundDialog} onOpenChange={setShowFoundDialog}>
      <DialogContent className="flex flex-col shadow-2xl p-0 border-none rounded-[2.5rem] sm:max-w-106.25 max-h-[90vh] overflow-hidden">
        <form
          id="form-rpms-signin"
          action={formAction}
          className="flex flex-col h-full"
        >
          {/* Hidden input to pass the email from rpmsUserData to the Server Action */}
          <input
            type="hidden"
            name="username"
            value={rpmsUserData?.email || ""}
          />

          <div className="p-8 overflow-y-auto custom-scrollbar">
            <DialogHeader className="items-center space-y-4 text-center">
              <div className="bg-primary/10 p-4 rounded-3xl">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="font-bold text-2xl tracking-tight">
                  RPMS Profile Found
                </DialogTitle>
                <DialogDescription className="text-sm">
                  Please verify your credentials to continue.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              <div className="flex items-center gap-4 bg-muted/40 p-4 border border-border rounded-2xl">
                <div className="flex justify-center items-center bg-primary/20 rounded-full w-10 h-10 font-bold text-primary text-sm shrink-0">
                  {getNameInitials(fullName)}
                </div>
                <div className="overflow-hidden text-left">
                  <p className="font-bold text-sm truncate leading-tight">
                    {fullName}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
                    {rpmsUserData?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-left">
                <Label className="ml-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                  RPMS Password
                </Label>
                <Input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your RPMS Password"
                  className="bg-muted/20 rounded-xl h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {state?.error && (
                  <div className="flex items-center gap-2 ml-1 font-bold text-[11px] text-destructive animate-in fade-in">
                    <AlertCircle className="w-3 h-3" /> {state.error}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex sm:flex-row flex-col gap-3 p-8 pt-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowFoundDialog(false)}
              className="flex-1 rounded-xl h-12 font-bold text-xs uppercase tracking-widest"
            >
              Cancel
            </Button>

            <div className="flex-1">
              <SubmitButton label="Verify & Sign in" form="form-rpms-signin" />
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RpmsProfileFoundDialog;
