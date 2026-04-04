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
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type RpmsUserData = {
  fullName: string;
  email: string;
};

type MockUserEntry = {
  fullName: string;
  exists: boolean;
  correctPass: string;
};

type MockRpmsDb = {
  [email: string]: MockUserEntry;
};

type Props = {
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  showRpmsDialog: boolean;
  setShowRpmsDialog: React.Dispatch<React.SetStateAction<boolean>>;

  // Form Inputs
  email: string;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;

  // Data
  rpmsUserData: RpmsUserData | null;
  setRpmsUserData: React.Dispatch<React.SetStateAction<RpmsUserData | null>>;
  MOCK_RPMS_DB: MockRpmsDb;
};

const CheckEmailDialog = ({
  isSubmitting,
  setIsSubmitting,
  MOCK_RPMS_DB,
  password,
  showRpmsDialog,
  setShowRpmsDialog,
  rpmsUserData,
  email,
  setEmail,
  setPassword,
}: Props) => {
  const router = useRouter();
  const [rpmsError, setRpmsError] = useState("");

  const handleRpmsVerify = async () => {
    setIsSubmitting(true);
    setRpmsError("");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = MOCK_RPMS_DB[email as keyof typeof MOCK_RPMS_DB];
    if (password === user?.correctPass) {
      setShowRpmsDialog(false);
      router.push("/dashboard/staff");
    } else {
      setRpmsError("Password mismatch with RPMS records.");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={showRpmsDialog} onOpenChange={setShowRpmsDialog}>
      <DialogContent className="flex flex-col shadow-2xl p-0 border-none rounded-[2.5rem] sm:max-w-106.25 max-h-[90vh] overflow-hidden">
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
                {rpmsUserData?.fullName.charAt(0)}
              </div>
              <div className="overflow-hidden text-left">
                <p className="font-bold text-sm truncate leading-tight">
                  {rpmsUserData?.fullName}
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
                placeholder="Enter your RPMS Password"
                className="bg-muted/20 rounded-xl h-12"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setRpmsError("");
                }}
              />
              {rpmsError && (
                <div className="flex items-center gap-2 ml-1 font-bold text-[11px] text-destructive animate-in fade-in">
                  <AlertCircle className="w-3 h-3" /> {rpmsError}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex sm:flex-row flex-col gap-3 p-8 pt-0">
          <Button
            variant="ghost"
            onClick={() => {
              setShowRpmsDialog(false);
              setEmail("");
              setPassword("");
            }}
            className="flex-1 rounded-xl h-12 font-bold text-xs uppercase tracking-widest"
          >
            Re-enter Email
          </Button>
          <Button
            onClick={handleRpmsVerify}
            disabled={isSubmitting || !password}
            className="flex-1 rounded-xl h-12 font-bold text-xs uppercase tracking-widest"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Verify & Enter"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckEmailDialog;
