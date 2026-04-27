import Logo from "@/components/reusable/logo";
import { useLocation } from "react-router-dom";

const AUTH_PAGES: Record<string, { title: string; desc?: string }> = {
  signup: { title: "Create Account" },
  signin: {
    title: "Welcome back",
    desc: "Please enter your professional credentials",
  },
  "forgot-password": {
    title: "Reset password",
    desc: "Enter your email to reset your password. If an account exists, we’ll send you instructions.",
  },
};

const AuthHeader = () => {
  const { pathname } = useLocation();
  const pageKey = pathname.split("/").at(-1) || "";
  const { title, desc } = AUTH_PAGES[pageKey] || { title: "" };

  return (
    <div className="flex flex-col items-center text-center">
      <Logo hasLabel={true} />
      {title && (
        <h1 className="mt-4 font-bold text-3xl md:text-4xl tracking-tighter">
          {title}
        </h1>
      )}
      {desc && (
        <p className="mx-auto mt-2 max-w-70 text-muted-foreground text-sm">
          {desc}
        </p>
      )}
    </div>
  );
};

export default AuthHeader;
