import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, getFullName, getNameInitials } from "@/lib/utils";
import { UserProfile } from "@/types/interfaces.user";
import { Crown } from "lucide-react";

type Props = {
  users?: UserProfile[];
  maxVisible?: number;
};

const UsersAvatarPopover = ({ users = [], maxVisible = 2 }: Props) => {
  if (!users.length) {
    return <span className="text-muted-foreground text-xs">No users</span>;
  }

  const sortedUsers = [...users].sort((a, b) => {
    if (a.is_pi) return -1;
    if (b.is_pi) return 1;
    return 0;
  });

  const visibleUsers = sortedUsers.slice(0, maxVisible);
  const remainingUsers = sortedUsers.slice(maxVisible);

  const UserAvatar = ({
    user,
    index,
  }: {
    user: UserProfile;
    index: number;
  }) => {
    const isPI = user.is_pi;

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "relative flex justify-center items-center border rounded-full w-7 h-7 font-medium text-xs cursor-pointer",
              index !== 0 && "-ml-2",

              isPI
                ? "bg-amber-100 border-amber-300 text-amber-700"
                : "bg-muted",
            )}
          >
            {getNameInitials(getFullName(user, 2))}

            {isPI && (
              <div className="-top-1 -right-1 absolute flex justify-center items-center bg-amber-500 rounded-full w-3.5 h-3.5">
                <Crown className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-64">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "relative flex justify-center items-center rounded-full w-8 h-8 font-medium text-xs",
                isPI ? "bg-amber-100 text-amber-700" : "bg-muted",
              )}
            >
              {getNameInitials(getFullName(user, 2))}

              {isPI && (
                <div className="-top-1 -right-1 absolute flex justify-center items-center bg-amber-500 rounded-full w-4 h-4">
                  <Crown className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <p className="font-medium text-sm">{getFullName(user, 2)}</p>

                {isPI && (
                  <span className="font-medium text-amber-600 text-xs">PI</span>
                )}
              </div>

              <p className="text-muted-foreground text-xs">{user.email}</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="flex items-center">
      {visibleUsers.map((user, index) => (
        <UserAvatar key={user.id} user={user} index={index} />
      ))}

      {remainingUsers.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex justify-center items-center bg-background hover:bg-muted -ml-2 border rounded-full w-7 h-7 font-medium text-xs">
              +{remainingUsers.length}
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-64">
            <div className="flex flex-col gap-2">
              {remainingUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-2">
                  <div className="flex justify-center items-center bg-muted rounded-full w-8 h-8 font-medium text-xs">
                    {getNameInitials(getFullName(user, 2))}
                  </div>

                  <div className="flex flex-col">
                    <p className="font-medium text-sm">
                      {getFullName(user, 2)}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default UsersAvatarPopover;
