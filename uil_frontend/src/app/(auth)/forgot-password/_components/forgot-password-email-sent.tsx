import { CheckCircle2 } from "lucide-react";

type Props = {
  onSent: (value: boolean) => void;
};

const ForgotPasswordEmailSent = ({ onSent }: Props) => {
  return (
    <div className="flex flex-col items-center py-4 text-center">
      <div className="bg-emerald-500/10 mb-6 p-4 rounded-full">
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
      </div>
      <p className="font-medium text-muted-foreground text-xs leading-relaxed">
        Didn&apos;t receive the email? Check your spam folder or
        <button
          onClick={() => onSent(false)}
          className="ml-1 font-bold text-primary hover:underline"
        >
          try another address.
        </button>
      </p>
    </div>
  );
};

export default ForgotPasswordEmailSent;
