import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CheckEmailDialog from "./check-email-dialog";
import CreateIndustryForm from "./create-industry-form";
import { CreateIndustryInput } from "@/validation/validation.auth";
import { useCreateIndustryMutation } from "../../_hooks/useAuth";

const MOCK_RPMS_DB = {
  "admin@rpms.com": {
    fullName: "Dr. Sarah Jenkins",
    exists: true,
    correctPass: "password123",
  },
};

// Props required by the SignupForm
type Props = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const SignupForm = ({ step, setStep }: Props) => {
  const [notFoundInRpms, setNotFoundInRpms] = useState(false);
  const createIndsutryMutation = useCreateIndustryMutation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // RPMS State
  const [showRpmsDialog, setShowRpmsDialog] = useState(false);
  const [rpmsUserData, setRpmsUserData] = useState<{
    fullName: string;
    email: string;
  } | null>(null);

  const [role, setRole] = useState<"industry" | "staff" | null>(null);

  const handleContinue = async () => {
    setIsSubmitting(true);
    setNotFoundInRpms(false);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (role === "staff") {
      const user = MOCK_RPMS_DB[email as keyof typeof MOCK_RPMS_DB];
      if (user) {
        setRpmsUserData({ fullName: user.fullName, email: email });
        setShowRpmsDialog(true);
      } else {
        setNotFoundInRpms(true);
      }
    } else {
      setStep(3);
    }
    setIsSubmitting(false);
  };

  const handleSubmit = (data: CreateIndustryInput) => {
    if (role === "industry")
      createIndsutryMutation.mutate(data, { onSuccess: () => setStep(3) });
  };

  return (
    <>
      <div className="pt-6">
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="font-bold text-xl tracking-tight">
                Choose your path
              </h2>
              <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Select your registration type
              </p>
            </div>
            <div className="gap-3 grid">
              <button
                onClick={() => setRole("industry")}
                className={`group p-5 border rounded-2xl text-left transition-all flex items-center gap-4 ${role === "industry" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
              >
                <div
                  className={`p-3 rounded-xl ${role === "industry" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">Industry Partner</div>
                  <div className="mt-1 font-medium text-[11px] text-muted-foreground leading-none">
                    Direct signup for companies
                  </div>
                </div>
              </button>
              <button
                onClick={() => setRole("staff")}
                className={`group p-5 border rounded-2xl text-left transition-all flex items-center gap-4 ${role === "staff" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
              >
                <div
                  className={`p-3 rounded-xl ${role === "staff" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                >
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">University Staff</div>
                  <div className="mt-1 font-medium text-[11px] text-muted-foreground leading-none">
                    Authenticate via RPMS Profile
                  </div>
                </div>
              </button>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!role}
              className="mt-2 rounded-xl w-full h-12 font-bold text-xs uppercase tracking-widest"
            >
              Continue <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {step === 2 &&
          (role === "staff" ? (
            <StaffVerificationForm
              email={email}
              setEmail={setEmail}
              notFoundInRpms={notFoundInRpms}
              isSubmitting={isSubmitting}
              onBack={() => setStep(1)}
              onContinue={handleContinue}
            />
          ) : (
            <CreateIndustryForm
              isSubmitting={createIndsutryMutation.isPending}
              onSubmit={handleSubmit}
              onBack={() => setStep(1)}
            />
          ))}

        {step === 3 && (
          <div className="space-y-8 py-6 text-center animate-in fade-in zoom-in">
            <div className="flex justify-center items-center bg-emerald-500/10 mx-auto rounded-full w-20 h-20">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="font-bold text-2xl tracking-tighter">
              Registration Success!
            </h2>
            <Link href="/signin" className="block w-full">
              <Button className="rounded-xl w-full h-12 font-bold text-xs uppercase tracking-widest">
                Return to Login
              </Button>
            </Link>
          </div>
        )}
      </div>

      <CheckEmailDialog
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        showRpmsDialog={showRpmsDialog}
        setShowRpmsDialog={setShowRpmsDialog}
        email={email}
        password={password}
        setPassword={setPassword}
        setEmail={setEmail}
        MOCK_RPMS_DB={MOCK_RPMS_DB}
        rpmsUserData={rpmsUserData}
        setRpmsUserData={setRpmsUserData}
      />
    </>
  );
};

type BaseFormProps = {
  email: string;
  setEmail: (value: string) => void;
  isSubmitting: boolean;
  onBack: () => void;
  onContinue: () => void;
};

type StaffVerificationFormProps = BaseFormProps & {
  notFoundInRpms: boolean;
};

const StaffVerificationForm = ({
  email,
  setEmail,
  notFoundInRpms,
  isSubmitting,
  onBack,
  onContinue,
}: StaffVerificationFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="font-bold text-xl tracking-tight">Staff Verification</h2>
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          RPMS (Researcher Profile) Lookup
        </p>
      </div>

      <div className="space-y-4">
        {/* Info box */}
        <div className="flex items-start gap-3 bg-blue-500/5 p-3 border border-blue-500/10 rounded-xl">
          <ShieldCheck className="mt-0.5 w-4 h-4 text-blue-500 shrink-0" />
          <p className="text-[11px] text-blue-700/80 leading-tight">
            <strong>Priority:</strong> An active <strong>RPMS Account</strong>{" "}
            is required.
          </p>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
            Email Address
          </Label>
          <Input
            type="email"
            placeholder="Enter your email"
            className={`bg-background rounded-xl h-12 ${
              notFoundInRpms ? "border-destructive" : ""
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

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
                <a href="https://rpms.university.edu/register" target="_blank">
                  Register Now <ExternalLink className="ml-1 w-3 h-3" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 rounded-xl h-12 font-bold text-xs"
        >
          Back
        </Button>
        <Button
          onClick={onContinue}
          disabled={isSubmitting || !email}
          className="flex-1 rounded-xl h-12 font-bold text-xs uppercase tracking-widest"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
};

export default SignupForm;
