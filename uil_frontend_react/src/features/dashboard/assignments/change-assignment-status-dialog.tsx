import UsersAvatarPopover from "@/components/reusable/users-avatar-popver";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useManageAssignmentStatusMutation } from "@/data/assignments/manage-assignment-status-mutation";
import { AssignmentStatus } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types/interfaces.user";
import { Loader2 } from "lucide-react";
import { getAssignmentStatusConfig } from "./utils.assignments";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment_id: number;
  status: AssignmentStatus | null;
  request: { title: string; desc: string; assigned_users: UserProfile[] };
};

const ChangeAssignmentStatusDialog = ({
  open,
  onOpenChange,
  assignment_id,
  status,
  request,
}: Props) => {
  const mutation = useManageAssignmentStatusMutation();

  if (!status) return null;

  const { Icon, color, label } = getAssignmentStatusConfig(status);

  const handleConfirm = async () => {
    await mutation.mutateAsync({
      assignment_id,
      status,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-bold text-lg">
            Confirm Status Change
          </DialogTitle>

          <DialogDescription className="space-y-4 pt-2">
            <div className="space-y-2">
              <p>You are about to change the assignment status for:</p>

              {/* Request Context Box */}
              <div className="bg-muted/50 p-3 rounded-lg">
                <h4 className="font-semibold text-foreground text-sm truncate">
                  {request.title}
                </h4>
                <p className="mt-1 overflow-hidden text-muted-foreground text-xs">
                  {request.desc}
                </p>

                <Separator className="my-2" />

                <div className="flex items-center gap-2">
                  <p className="text-xs">Assigned Users:</p>

                  {/* Assigned Users Avatars/List */}
                  <UsersAvatarPopover
                    users={request.assigned_users}
                    maxVisible={4}
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              This action will update all related records and may affect
              visibility and workflow.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={mutation.isPending}
            className={cn(color, "hover:brightness-95 transition-all")}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Icon className="w-4 h-4" />
                {label}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeAssignmentStatusDialog;
