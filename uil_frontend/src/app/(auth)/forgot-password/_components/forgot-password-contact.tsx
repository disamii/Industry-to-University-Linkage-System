"use client";

import { UIL_CONTACT_INFO } from "@/lib/constants";
import { usePathname } from "next/navigation";

const ForgotPasswordContact = () => {
  const pathname = usePathname();
  const pageKey = pathname.split("/").at(-1) || "";

  if (pageKey !== "forgot-password") return null;

  return (
    <p className="px-8 font-medium text-[10px] text-muted-foreground text-center uppercase leading-loose tracking-widest">
      Having trouble? Contact{" "}
      <a
        href={UIL_CONTACT_INFO.email.href}
        className="text-foreground hover:text-primary decoration-border underline underline-offset-4 transition-colors"
      >
        {UIL_CONTACT_INFO.email.value}
      </a>
    </p>
  );
};

export default ForgotPasswordContact;
