import Image from "next/image";
import logoImg from "../../public/logo/uil-logo-no-bg.png";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Logo = ({
  size = 64,
  hasLabel = false,
  forceLabel = false,
}: {
  size?: number;
  hasLabel?: boolean;
  forceLabel?: boolean;
}) => {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
    >
      <div className="inline-block relative">
        <Image
          src={logoImg}
          alt="University-Industry Linkage logo"
          width={size}
          height={size}
          className="object-contain"
        />
      </div>

      {hasLabel && (
        <div className={cn(!forceLabel && "hidden sm:block")}>
          <div className="font-semibold text-foreground text-sm md:text-base leading-tight">
            University–Industry Linkage
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Collaboration Platform
          </div>
        </div>
      )}
    </Link>
  );
};

export default Logo;
