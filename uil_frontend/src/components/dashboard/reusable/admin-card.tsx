import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

type Title = {
  label: string;
  Icon: LucideIcon;
};

type LinkType = {
  label: string;
  href: string;
};

type Props = {
  children: React.ReactNode;
  title?: Title | string;
  link?: LinkType;
  hasHeader?: boolean;
  className?: string;
  padding?: string;
};

const AdminCard = ({
  title,
  link,
  children,
  hasHeader = true,
  className,
  padding = "px-4 md:px-8 pt-4 md:pt-8",
}: Props) => {
  const titleHasIcon = typeof title !== "string";

  return (
    <Card
      className={cn("shadow-sm border-border/50 rounded-[2.5rem]", className)}
    >
      {hasHeader && (
        <CardHeader
          className={cn("flex flex-row justify-between items-center", padding)}
        >
          {title && (
            <CardTitle className="flex items-center gap-2 font-bold text-xl tracking-tight">
              {titleHasIcon ? (
                <>
                  {<title.Icon size={20} className="text-primary" />}
                  {title.label}
                </>
              ) : (
                title
              )}
            </CardTitle>
          )}

          {link && (
            <Link
              href={link.href}
              className="font-bold text-primary text-sm hover:underline"
            >
              {link.label}
            </Link>
          )}
        </CardHeader>
      )}

      <CardContent className={cn("space-y-4", padding)}>{children}</CardContent>
    </Card>
  );
};

export default AdminCard;
