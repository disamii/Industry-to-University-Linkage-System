import { Spinner } from "@/components/reusable/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CheckStaffEmailResponse } from "@/types/interfaces.auth";
import { AlertCircle, ExternalLink, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useCheckStaffEmail } from "../../_hooks/useAuth";
import RpmsProfileFoundDialog from "./rpms-profile-found-dialog";

type Props = {
  setStep: (step: number) => void;
};

const CheckStaffEmailForm = ({ setStep }: Props) => {
  const [email, setEmail] = useState("");
  const { mutate, isPending: isSubmitting } = useCheckStaffEmail();

  const [showFoundDialog, setShowFoundDialog] = useState(false);
  const [rpmsUserData, setRpmsUserData] =
    useState<CheckStaffEmailResponse | null>(null);
  const [notFoundInRpms, setNotFoundInRpms] = useState(false);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (notFoundInRpms) setNotFoundInRpms(false);
  };

  const handleCheckEmail = (e?: React.FormEvent) => {
    e?.preventDefault(); // FIX: Prevent page reload on form submit
    if (!email || isSubmitting) return;

    mutate(
      { email },
      {
        onSuccess: (data) => {
          if (data.exists) {
            setRpmsUserData(data);
            setShowFoundDialog(true);
          } else {
            setNotFoundInRpms(true);
          }
        },
      },
    );
  };

  return (
    <>
      <form
        id="form-check-staff-email"
        onSubmit={handleCheckEmail}
        className="space-y-6"
      >
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="font-bold text-xl tracking-tight">
              Staff Verification
            </h2>
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              RPMS (Researcher Profile) Lookup
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-blue-500/5 p-3 border border-blue-500/10 rounded-xl">
              <ShieldCheck className="mt-0.5 w-4 h-4 text-blue-500 shrink-0" />
              <p className="text-[11px] text-blue-700/80 leading-tight">
                <strong>Priority:</strong> An active{" "}
                <strong>RPMS Account</strong> is required.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                Email Address
              </Label>
              <Input
                type="email"
                placeholder="Enter your email"
                className={cn(
                  "bg-background rounded-xl h-12",
                  notFoundInRpms ? "border-destructive" : "",
                )}
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
              />
            </div>

            {notFoundInRpms && (
              <div className="space-y-2 bg-destructive/5 p-4 border border-destructive/20 rounded-2xl animate-in fade-in zoom-in">
                <div className="flex items-center gap-2 font-bold text-[11px] text-destructive uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4" /> Not Found in RPMS
                </div>
                <p className="text-[12px] text-muted-foreground">
                  Your account must be created in RPMS first.
                </p>
                <Button
                  asChild
                  variant="link"
                  className="p-0 h-auto font-bold text-primary text-xs underline"
                >
                  <a href={LINKS.rpms} target="_blank">
                    Register Now <ExternalLink className="ml-1 w-3 h-3" />
                  </a>
                </Button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl h-12 font-bold text-xs"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              type="submit"
              form="form-check-staff-email"
              className="flex-1 rounded-xl h-12 font-bold text-xs uppercase tracking-widest"
              disabled={isSubmitting || !email}
            >
              {isSubmitting ? <Spinner size="sm" /> : "Continue"}
            </Button>
          </div>
        </div>
      </form>

      <RpmsProfileFoundDialog
        rpmsUserData={rpmsUserData}
        showFoundDialog={showFoundDialog}
        setShowFoundDialog={setShowFoundDialog}
      />
    </>
  );
};

export default CheckStaffEmailForm;
