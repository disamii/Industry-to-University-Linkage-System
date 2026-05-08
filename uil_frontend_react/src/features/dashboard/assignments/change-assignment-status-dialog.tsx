import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AssignmentStatus } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { getAssignmentStatusConfig } from "./utils.assignments";
import { useManageAssignmentStatusMutation } from "@/data/assignments/manage-assignment-status-mutation";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment_id: number;
  status: AssignmentStatus | null;
  current_status?: AssignmentStatus;
};

const ChangeAssignmentStatusDialog = ({
  open,
  onOpenChange,
  assignment_id,
  status,
  current_status,
}: Props) => {
  const mutation = useManageAssignmentStatusMutation();

  if (!status) return null;

  const next = getAssignmentStatusConfig(status);
  const current = current_status
    ? getAssignmentStatusConfig(current_status)
    : null;

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
          <DialogTitle className="flex items-center gap-2 font-semibold text-base">
            <next.Icon className={cn("w-5 h-5", next.color)} />
            Confirm Status Change
          </DialogTitle>

          <DialogDescription className="space-y-2 pt-2">
            <p>You are about to change the assignment status:</p>

            <div className="flex items-center gap-2 text-sm">
              {current && (
                <span className={cn("font-medium", current.color)}>
                  {current.label}
                </span>
              )}

              <span className="text-muted-foreground">→</span>

              <span className={cn("font-semibold", next.color)}>
                {next.label}
              </span>
            </div>

            <p className="text-muted-foreground text-xs">
              This action will update all related records and may affect
              visibility and workflow.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
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
            className={cn(next.color, "hover:brightness-95 transition-all")}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <next.Icon className="w-4 h-4" />
                Confirm Change
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeAssignmentStatusDialog;
