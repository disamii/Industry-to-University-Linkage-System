import { QueryState } from "@/components/reusable/query-state-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useManageUserAssignmentMutation } from "@/data/assignments/manage-user-assignment-mutation";
import { useUserParams } from "@/data/user/use-user-params";
import { useGetUsers } from "@/data/user/user-list-query";
import { useDebounce } from "@/hooks/use-debounce";
import { colorVariants } from "@/lib/mappings";
import { cn, getFullName } from "@/lib/utils";
import { UserProfile } from "@/types/interfaces.user";
import { Check, ChevronsUpDown, Minus, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Action = "add" | "remove";

const actionMap = {
  add: {
    title: "Assign Users to Request",
    description: "Select users to assign to this request",
    Icon: Plus,
    label: "Assign Users",
  },
  remove: {
    title: "Remove Assigned Users",
    description: "Select users to remove from this request",
    Icon: Minus,
    label: "Remove Users",
  },
};

type FormFieldProps = {
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  action: Action;
  assignedUsers: UserProfile[];
};

const FormField = ({
  selectedIds,
  setSelectedIds,
  action,
  assignedUsers,
}: FormFieldProps) => {
  const [open, setOpen] = useState(false);

  const assignedIds = assignedUsers.map((u) => u.id);

  const usersQuery = useGetUsers();
  const { setParams: setUserParams } = useUserParams();

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    setUserParams({ search: debouncedSearch }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const toggleUser = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  if (action === "remove") {
    const usersToRemove = assignedUsers.filter((u) =>
      selectedIds.includes(u.id),
    );
    const isLastUser = usersToRemove.length === 1;

    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="font-medium text-sm">Users to Remove</label>
        </div>

        <div className="flex flex-wrap gap-2 bg-muted/20 p-3 border rounded-md min-h-25">
          {usersToRemove.length === 0 ? (
            <p className="text-muted-foreground text-sm">No assigned users.</p>
          ) : (
            usersToRemove.map((user) => (
              <Badge
                key={user.id}
                variant="secondary"
                className="gap-1 py-1 pr-1 pl-2"
              >
                {getFullName(user)}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        if (isLastUser) return;
                        toggleUser(user.id);
                      }}
                      disabled={isLastUser}
                      className={cn(
                        "p-0.5 rounded-full",
                        isLastUser
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-muted",
                      )}
                    >
                      <X className="size-3" />
                    </button>
                  </TooltipTrigger>

                  {isLastUser && (
                    <TooltipContent className="bg-destructive">
                      <p>You can't remove the last assigned user.</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </Badge>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="font-medium text-sm">Assign New Users</label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="justify-between mt-2 w-full font-normal"
          >
            {selectedIds.length > 0
              ? `${selectedIds.length} users selected`
              : "Select users to add..."}

            <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="p-0 w-(--radix-popover-trigger-width)"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search users..."
              value={searchValue}
              onValueChange={setSearchValue}
            />

            <CommandList>
              <QueryState
                query={usersQuery}
                checkEmpty={(data) =>
                  data?.results?.filter((u) => !assignedIds.includes(u.id))
                    .length === 0
                }
                variant="small"
              >
                {(data) => (
                  <CommandGroup>
                    {data.results
                      .filter((user) => !assignedIds.includes(user.id))
                      .map((user) => {
                        const isSelected = selectedIds.includes(user.id);

                        return (
                          <CommandItem
                            key={user.id}
                            onSelect={() => toggleUser(user.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 w-4 h-4",
                                isSelected ? "opacity-100" : "opacity-0",
                              )}
                            />

                            {getFullName(user)}
                          </CommandItem>
                        );
                      })}
                  </CommandGroup>
                )}
              </QueryState>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-1 mt-2">
        {selectedIds.map((id) => {
          const user = usersQuery.data?.results?.find(
            (u: UserProfile) => u.id === id,
          );

          return (
            <Badge key={id} variant="secondary" className="capitalize">
              {user ? getFullName(user) : `ID: ${id}`}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

type ManageDialogProps = {
  assignment_id: number;
  request: {
    title: string;
    description: string;
  };
  action: Action;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignedUsers: UserProfile[];
};

const ManageUserAssignmentFormDialog = ({
  assignment_id,
  request,
  action,
  open,
  onOpenChange,
  assignedUsers = [],
}: ManageDialogProps) => {
  const { title, description, Icon, label } = actionMap[action];

  const { mutate, isPending } = useManageUserAssignmentMutation();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const assignedIds = useMemo(
    () => assignedUsers.map((u) => u.id),
    [assignedUsers],
  );

  const currentActionConfig = {
    remove: colorVariants.danger,
    add: colorVariants.info,
  };
  const disabled =
    isPending ||
    selectedIds.length === 0 ||
    (action === "remove" &&
      assignedIds.filter((id) => !selectedIds.includes(id)).length === 0);

  useEffect(() => {
    if (!open) return;

    if (action === "remove") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedIds(assignedIds);
    } else {
      setSelectedIds([]);
    }
  }, [open, action, assignedIds]);

  const onSubmit = () => {
    const user_ids =
      action === "remove"
        ? assignedIds.filter((id) => !selectedIds.includes(id))
        : selectedIds;

    mutate(
      {
        assignment_id,
        action,
        user_ids,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSelectedIds([]);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={assignment_id}>
      <DialogContent className="flex flex-col sm:max-w-106.25 max-h-[90dvh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl">{title}</DialogTitle>

          <DialogDescription>
            {description}: <strong>{request.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <FormField
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            action={action}
            assignedUsers={assignedUsers}
          />

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              onClick={onSubmit}
              disabled={disabled}
              className={cn(
                currentActionConfig[action],
                `hover:${currentActionConfig[action]} hover:brightness-95 transition-all `,
              )}
            >
              {isPending ? (
                <Spinner variant="small" className="mr-2" />
              ) : (
                <Icon className="mr-2 size-4" />
              )}

              {label}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageUserAssignmentFormDialog;
