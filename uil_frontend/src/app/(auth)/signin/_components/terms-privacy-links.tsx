import { LINKS } from "@/lib/constants";
import NextLink from "next/link";

const TermsPrivacyLinks = () => {
  return (
    <p className="px-8 font-medium text-[10px] text-muted-foreground text-center uppercase leading-loose tracking-widest">
      By signing in, you agree to our <Link href={LINKS.terms} label="Terms" />{" "}
      and <Link href={LINKS.privacy} label="Privacy" />.
    </p>
  );
};

const Link = ({ href, label }: { href: string; label: string }) => (
  <NextLink
    href={href}
    className="text-foreground hover:text-primary decoration-border underline underline-offset-4 transition-colors"
  >
    {label}
  </NextLink>
);

export default TermsPrivacyLinks;
