import { LINKS } from "@/lib/constants";
import { Link, useLocation } from "react-router-dom";
import { UIL_CONTACT_INFO } from "@/lib/constants";

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
  const { pathname } = useLocation();
  const pageKey = pathname.split("/").at(-1) || "";
  const footer = FOOTER_MESSAGES[pageKey];

  if (!footer) return null;

  return (
    <div className="flex flex-col space-y-2 bg-muted/20 p-6 lg:p-8 border-border border-t text-center">
      <p className="text-xs">
        {footer.text}{" "}
        <Link
          to={footer.linkHref}
          className="font-medium text-primary hover:underline underline-offset-4 transition-all"
        >
          {footer.linkLabel}
        </Link>
      </p>

      <p className="px-8 text-[10px] text-muted-foreground">
        Having trouble? Contact{" "}
        <a
          href={UIL_CONTACT_INFO.email.href}
          className="text-foreground hover:text-primary transition-colors"
        >
          {UIL_CONTACT_INFO.email.value}
        </a>
      </p>
    </div>
  );
};

export default AuthFooter;
