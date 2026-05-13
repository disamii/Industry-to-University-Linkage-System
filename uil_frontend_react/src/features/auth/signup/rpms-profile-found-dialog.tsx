import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FormInput } from "@/components/reusable/form-components";
import SigninFormWrapper from "@/components/reusable/signin-form-wrapper";
import { getFullName, getNameInitials } from "@/lib/utils";
import { CheckStaffEmailResponse } from "@/types/interfaces.auth";
import { SigninInput, signinSchema } from "@/validation/validation.auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  rpmsUserData: CheckStaffEmailResponse | null;
  showFoundDialog: boolean;
  setShowFoundDialog: (open: boolean) => void;
  isAdmin?: boolean;
  setRegisterUserDialog?: Dispatch<SetStateAction<boolean>>;
};

const RpmsProfileFoundDialog = ({
  rpmsUserData,
  showFoundDialog,
  setShowFoundDialog,
  isAdmin,
  setRegisterUserDialog,
}: Props) => {
  const form = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
  });

  const fullName = getFullName({ ...rpmsUserData });

  useEffect(() => {
    if (rpmsUserData?.email) {
      form.setValue("username", rpmsUserData.email);
    }
  }, [rpmsUserData, form]);

  // Content for when an Admin is registering the user
  const AdminSuccessContent = (
    <div className="space-y-6">
      <DialogHeader className="items-center space-y-4 text-center">
        <div className="relative bg-green-50 p-4 rounded-3xl">
          <ShieldCheck className="w-8 h-8 text-green-600" />
          <CheckCircle2 className="right-0 bottom-0 absolute bg-white rounded-full w-5 h-5 text-green-600" />
        </div>
        <div className="space-y-1">
          <DialogTitle className="font-bold text-2xl">
            RPMS Profile Found
          </DialogTitle>
          <DialogDescription className="text-sm">
            Member data has been successfully migrated to the UIL system.
          </DialogDescription>
        </div>
      </DialogHeader>

      <div className="flex items-center gap-4 bg-muted/40 p-3 border border-border rounded-md">
        <div className="flex justify-center items-center bg-primary/20 rounded-full w-10 h-10 font-bold text-primary text-sm shrink-0">
          {getNameInitials(fullName)}
        </div>
        <div className="overflow-hidden text-left">
          <p className="font-bold text-sm truncate leading-tight">{fullName}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
            {rpmsUserData?.email}
          </p>
        </div>
      </div>

      <div className="bg-primary/5 p-4 border border-primary/10 rounded-lg text-center">
        <p className="text-muted-foreground text-sm leading-relaxed">
          The member can now log in using their{" "}
          <span className="font-bold text-foreground">
            existing RPMS credentials
          </span>
          .
        </p>
      </div>

      <DialogFooter>
        <Button
          className="w-full"
          onClick={() => {
            setShowFoundDialog(false);
            setRegisterUserDialog?.(false);
          }}
        >
          Close & Continue
        </Button>
      </DialogFooter>
    </div>
  );

  // Content for when the User is registering themselves (requires password)
  const UserPasswordContent = (
    <SigninFormWrapper
      form={form}
      onCloseDialog={() => setShowFoundDialog(false)}
      className="px-2 overflow-y-auto custom-scrollbar"
    >
      <DialogHeader className="items-center space-y-4 text-center">
        <div className="bg-primary/10 p-4 rounded-3xl">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-1">
          <DialogTitle className="font-bold text-2xl">
            RPMS Profile Found
          </DialogTitle>
          <DialogDescription className="text-sm">
            Please enter your RPMS password to continue.
          </DialogDescription>
        </div>
      </DialogHeader>

      <div className="space-y-6">
        <div className="flex items-center gap-4 bg-muted/40 p-3 border border-border rounded-md">
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

        <FormInput
          type="password"
          form={form}
          name="password"
          label="RPMS Password"
          placeholder="Enter your RPMS Password"
        />
      </div>
    </SigninFormWrapper>
  );

  return (
    <Dialog open={showFoundDialog} onOpenChange={setShowFoundDialog}>
      <DialogContent className="flex flex-col max-h-[90vh] overflow-hidden">
        {isAdmin ? AdminSuccessContent : UserPasswordContent}
      </DialogContent>
    </Dialog>
  );
};

export default RpmsProfileFoundDialog;
