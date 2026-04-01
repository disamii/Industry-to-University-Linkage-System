import Link from "next/link";
import { Button } from "../ui/button";

type Props = {
  href: string;
  variant?: "default" | "secondary";
  label: string;
};

const HeaderLink = ({ href, variant, label }: Props) => {
  return (
    <Link href={href}>
      <Button
        variant={variant}
        className="px-6 rounded-full w-full font-medium"
      >
        {label}
      </Button>
    </Link>
  );
};

export default HeaderLink;
