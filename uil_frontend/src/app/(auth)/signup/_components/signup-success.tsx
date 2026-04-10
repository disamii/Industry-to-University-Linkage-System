import { Button } from "@/components/ui/button";
import { LINKS } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

const SignupSuccess = () => {
  return (
    <div className="space-y-8 py-6 text-center animate-in fade-in zoom-in">
      <div className="flex justify-center items-center bg-emerald-500/10 mx-auto rounded-full w-20 h-20">
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
      </div>
      <h2 className="font-bold text-2xl tracking-tighter">
        Registration Success!
      </h2>
      <Link href={LINKS.signin} className="block w-full">
        <Button className="rounded-xl w-full h-12 font-bold text-xs uppercase tracking-widest">
          Return to Login
        </Button>
      </Link>
    </div>
  );
};

export default SignupSuccess;
