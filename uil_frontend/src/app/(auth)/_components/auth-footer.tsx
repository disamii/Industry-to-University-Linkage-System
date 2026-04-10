"use client";

import { CardFooter } from "@/components/ui/card";
import { LINKS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FOOTER_MESSAGES: Record<
  string,
  { text: string; linkLabel: string; linkHref: string }
> = {
  signup: {
    text: "Already have an account?",
    linkLabel: "Sign In",
    linkHref: LINKS.signin,
  },
  signin: {
    text: "Don't have an account?",
    linkLabel: "Sign Up",
    linkHref: LINKS.signup,
  },
  "forgot-password": {
    text: "Remembered your password?",
    linkLabel: "Sign In",
    linkHref: LINKS.signin,
  },
};

const AuthFooter = () => {
  const pathname = usePathname();
  const pageKey = pathname.split("/").at(-1) || "";
  const footer = FOOTER_MESSAGES[pageKey];

  if (!footer) return null;

  return (
    <>
      <CardFooter className="flex flex-col bg-muted/20 p-6 lg:p-8 border-border border-t">
        <p className="font-medium text-muted-foreground text-xs text-center">
          {footer.text}{" "}
          <Link
            href={footer.linkHref}
            className="font-bold text-primary hover:underline underline-offset-4 transition-all"
          >
            {footer.linkLabel}
          </Link>
        </p>
      </CardFooter>
    </>
  );
};

export default AuthFooter;
