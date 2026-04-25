import { Progress } from "@/components/ui/progress";

type Props = {
  step: number;
};

const SignupProgressBar = ({ step }: Props) => {
  const totalSteps = 2;
  const progress = step === 3 ? 100 : (step / (totalSteps + 1)) * 100;

  if (step >= 3) return null;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
          Step 0{Math.floor(step)}
        </span>
        <span className="font-bold text-[10px] text-primary uppercase tracking-widest">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <Progress value={progress} className="bg-muted h-1" />
    </div>
  );
};

export default SignupProgressBar;
