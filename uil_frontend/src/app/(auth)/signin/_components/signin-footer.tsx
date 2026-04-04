import { CardFooter } from "@/components/ui/card";
import { LINKS } from "@/lib/constants";
import Link from "next/link";

const SigninFooter = () => {
  return (
    <CardFooter className="flex flex-col bg-muted/20 p-6 lg:p-8 border-border border-t">
      <p className="font-medium text-muted-foreground text-xs text-center">
        New to the platform?{" "}
        <Link
          href={LINKS.signin}
          className="font-bold text-primary hover:underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </CardFooter>
  );
};

export default SigninFooter;
