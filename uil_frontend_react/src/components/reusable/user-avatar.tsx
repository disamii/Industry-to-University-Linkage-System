import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNameInitials } from "@/lib/helpers";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  imageUrl?: string | null;
  userName?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function UserAvatar({
  imageUrl,
  userName,
  size = "md",
  className,
}: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {imageUrl && (
        <AvatarImage
          src={imageUrl || "/placeholder.svg"}
          alt={`${userName || "User"} profile`}
          className="object-cover"
        />
      )}
      <AvatarFallback>{userName && getNameInitials(userName)}</AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
