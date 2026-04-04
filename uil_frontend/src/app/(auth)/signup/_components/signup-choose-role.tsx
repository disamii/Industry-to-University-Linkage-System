import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";

type Role = "industry" | "staff";

type Props = {
  role: Role | null;
  setRole: (value: Role) => void;
  setStep: (value: number) => void;
};

const SignupChooseRole = ({ role, setRole, setStep }: Props) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="font-bold text-xl tracking-tight">Choose your path</h2>
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
  );
};

export default SignupChooseRole;
