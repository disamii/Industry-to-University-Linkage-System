import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";

type Targets<T> = T | T[];

interface Props<T> {
  resourceName: string;
  item?: {
    label: string;
    sublabel?: string;
  };
  isDeleting: boolean;
  onDelete: (targets: T[], options?: { onSuccess: () => void }) => void;
  targets?: Targets<T>;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

function ConfirmDelete<T>({
  resourceName,
  item,
  isDeleting,
  onDelete,
  targets,
  open,
  onOpenChange,
}: Props<T>) {
  const normalizedTargets = Array.isArray(targets)
    ? targets
    : targets != null
      ? [targets]
      : [];

  const handleDelete = () => {
    if (!normalizedTargets.length) return;

    onDelete(normalizedTargets, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {resourceName}</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{" "}
            {normalizedTargets.length > 1 ? "these" : "this"}{" "}
            {resourceName.toLowerCase()}
            {normalizedTargets.length > 1 ? "s" : ""}? This action cannot be
            undone.
          </DialogDescription>

          {item && (
            <div className="bg-gray-50 mt-2 p-3 rounded-md">
              <div className="font-medium">{item.label}</div>
              {item.sublabel && (
                <div className="mt-1 text-gray-500 text-sm">
                  {item.sublabel}
                </div>
              )}
            </div>
          )}
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            disabled={isDeleting || !normalizedTargets.length}
            variant="destructive"
            onClick={handleDelete}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDelete;
