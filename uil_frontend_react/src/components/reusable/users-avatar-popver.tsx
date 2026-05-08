import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, getFullName, getNameInitials } from "@/lib/utils";
import { UserProfile } from "@/types/interfaces.user";

type Props = {
  users?: UserProfile[];
  maxVisible?: number;
};

const UsersAvatarPopover = ({ users = [], maxVisible = 2 }: Props) => {
  if (!users.length) {
    return <span className="text-muted-foreground text-xs">No users</span>;
  }

  const visibleUsers = users.slice(0, maxVisible);
  const remainingUsers = users.slice(maxVisible);

  const UserAvatar = ({
    user,
    index,
  }: {
    user: UserProfile;
    index: number;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex justify-center items-center bg-muted border rounded-full w-7 h-7 font-medium text-xs cursor-pointer",
            index !== 0 && "-ml-2",
          )}
        >
          {getNameInitials(getFullName(user, 2))}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-64">
        <div className="flex items-center gap-2">
          <div className="flex justify-center items-center bg-muted rounded-full w-8 h-8 font-medium text-xs">
            {getNameInitials(getFullName(user, 2))}
          </div>

          <div className="flex flex-col">
            <p className="font-medium text-sm">{getFullName(user, 2)}</p>
            <p className="text-muted-foreground text-xs">{user.email}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

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
