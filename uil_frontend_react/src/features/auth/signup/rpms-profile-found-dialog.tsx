import { FormInput } from "@/components/reusable/form-components";
import SigninFormWrapper from "@/components/reusable/signin-form-wrapper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getFullName, getNameInitials } from "@/lib/helpers";
import { CheckStaffEmailResponse } from "@/types/interfaces.auth";
import { SigninInput, signinSchema } from "@/validation/validation.auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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
  const form = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
  });

  const fullName = getFullName(
    rpmsUserData?.first_name,
    rpmsUserData?.father_name,
    rpmsUserData?.grand_father_name,
  );

  useEffect(() => {
    if (rpmsUserData?.email) {
      form.setValue("username", rpmsUserData.email);
    }
  }, [rpmsUserData, form]);

  return (
    <Dialog open={showFoundDialog} onOpenChange={setShowFoundDialog}>
      <DialogContent className="flex flex-col max-h-[90vh] overflow-hidden">
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
      </DialogContent>
    </Dialog>
  );
};

export default RpmsProfileFoundDialog;
