import Image from "next/image";
import logoImg from "../../public/logo/uil-logo-no-bg.png";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Logo = ({
  size = 64,
  hasLabel = false,
  forceLabel = false,
  label,
}: {
  size?: number;
  hasLabel?: boolean;
  forceLabel?: boolean;
  label?: string;
}) => {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3 hover:opacity-80 transition-opacity",
        label && "p-4",
      )}
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

      {label && (
        <div>
          <p className="font-bold text-primary text-xl">UIL</p>
          <p className="font-semibold text-xs uppercase">{label}</p>
        </div>
      )}
    </Link>
  );
};

export default Logo;
