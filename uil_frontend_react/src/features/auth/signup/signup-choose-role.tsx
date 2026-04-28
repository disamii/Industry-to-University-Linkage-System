import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";

type Role = "industry" | "staff";

type Props = {
  role: Role | null;
  setRole: (value: Role) => void;
  setStep: (value: number) => void;
};

const roleOptions = [
  {
    value: "industry",
    title: "Industry Partner",
    desc: "Direct signup for companies",
    Icon: Building2,
  },
  {
    value: "staff",
    title: "University Staff",
    desc: "Authenticate via RPMS Profile",
    Icon: GraduationCap,
  },
];

const SignupChooseRole = ({ role, setRole, setStep }: Props) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="font-bold text-xl tracking-tight">Choose your path</h2>
        <p className="font-medium text-muted-foreground text-xs tracking-wider">
          Select your registration type
        </p>
      </div>

      <div className="space-y-4 w-full">
        {roleOptions.map((r) => (
          <button
            key={r.value}
            onClick={() => setRole(r.value as Role)}
            className={`group p-3 border rounded-md text-left transition-all flex items-center gap-4 w-full ${role === r.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
          >
            <div
              className={`p-3 rounded-sm ${role === r.value ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
            >
              <r.Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm">{r.title}</div>
              <div className="mt-1 font-medium text-[11px] text-muted-foreground leading-none">
                {r.desc}
              </div>
            </div>
          </button>
        ))}
      </div>

      <Button
        onClick={() => setStep(2)}
        disabled={!role}
        className="w-full h-10"
      >
        Continue <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </div>
  );
};

export default SignupChooseRole;
