import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CheckStaffEmailResponse } from "@/types/interfaces.auth";
import { AlertCircle, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { useCheckStaffEmail } from "@/data/auth/check-staff-email-mutation";
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
    e?.preventDefault();
    if (!email || isSubmitting) return;

    mutate(
      { email },
      {
        onSuccess: (data) => {
          if (data.id) {
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
          <p className="font-medium text-muted-foreground text-xs">
            RPMS Lookup{" "}
            <span className="text-primary">
              ( An active <strong>RPMS Account</strong> is required. )
            </span>
          </p>
        </div>

        <div className="space-y-2">
          <Field data-invalid={notFoundInRpms}>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              className={cn("py-5", notFoundInRpms && "border-destructive")}
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
          </Field>

          <NotFoundMsg notFound={notFoundInRpms} />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-10"
            onClick={() => setStep(1)}
          >
            Back
          </Button>
          <Button
            type="submit"
            form="form-check-staff-email"
            disabled={isSubmitting || !email}
            className="flex-1 h-10"
          >
            {isSubmitting && <Spinner data-icon="inline-start" />}
            {isSubmitting ? "Processing..." : "Continue"}
          </Button>
        </div>
      </div>

      <RpmsProfileFoundDialog
        rpmsUserData={rpmsUserData}
        showFoundDialog={showFoundDialog}
        setShowFoundDialog={setShowFoundDialog}
      />
    </form>
  );
};

const NotFoundMsg = ({ notFound }: { notFound: boolean }) => {
  if (!notFound) return null;

  return (
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
  );
};

export default CheckStaffEmailForm;
