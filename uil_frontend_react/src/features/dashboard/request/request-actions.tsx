import ConfirmDelete from "@/components/reusable/confirm-delete-dialog";
import RequestActionBadge from "@/components/reusable/request-action-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRequestDeleteMutation } from "@/data/requests/request-delete-mutation";
import { useGetRoleByPath } from "@/hooks/use-get-role-by-path";
import useTabParams from "@/hooks/use-tab-params";
import { ActionType } from "@/lib/enums";
import { mapEntity } from "@/lib/mappings";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Eye,
  MoreVertical,
  Pencil,
  Settings2,
  Trash,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PeformActionFormDialog from "./perform-action-form-dialog";

type Props = {
  id: number;
  title: string;
  description: string;
  variant?: "table" | "detail";
  supported_actions?: ActionType[];
  showViewDetails?: boolean;
  actionToPerform?: "alter" | "create";
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
};

const RequestActions = ({
  id,
  title,
  description,
  variant = "table",
  supported_actions,
  showViewDetails = true,
  actionToPerform,
  onEdit,
  onDelete,
  onView,
}: Props) => {
  const { mutate: deleteRequest, isPending: isDeleting } =
    useRequestDeleteMutation();
  const [DeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const isTable = variant === "table";

  const {
    params: { tab: requestDirection },
  } = useTabParams();

  const currentRole = useGetRoleByPath();
  const currentEntity = currentRole ? mapEntity[currentRole] : undefined;

  // Perform Actions
  const actionsToPerform = Object.values(ActionType).filter((type) =>
    supported_actions?.includes(type),
  );
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);

  const handleActionClick = (type: ActionType) => {
    setSelectedAction(type);
    setActionDialogOpen(true);
  };

  const renderTrigger = () => {
    if (
      (isTable && actionToPerform !== "alter") ||
      (isTable && actionToPerform === "alter" && actionsToPerform.length !== 0)
    )
      return (
        <button className="hover:bg-muted p-2 rounded-md transition-colors">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      );

    if (!isTable && actionsToPerform.length !== 0)
      return (
        <Button variant="secondary">
          <Settings2 className="w-4 h-4" />
          <span>Manage Request</span>
          <ChevronDown className="opacity-50 w-4 h-4" />{" "}
        </Button>
      );

    return null;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{renderTrigger()}</DropdownMenuTrigger>

        <DropdownMenuContent align="end" className={cn(isTable && "w-45")}>
          {isTable && showViewDetails && (
            <DropdownMenuItem
              onClick={() =>
                onView?.(id) || navigate(`${id}?tab=${requestDirection}`)
              }
            >
              <Eye className="mr-2 w-4 h-4" />
              View Details
            </DropdownMenuItem>
          )}

          {requestDirection === "outgoing" && (
            <>
              <DropdownMenuItem onClick={() => onEdit?.(id)}>
                <Pencil className="mr-2 w-4 h-4" />
                Edit Request
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 w-4 h-4" />
                Remove Request
              </DropdownMenuItem>
            </>
          )}

          {actionsToPerform.length !== 0 && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="whitespace-nowrap">
                <Wrench className="mr-2 w-4 h-4" />
                Perform Actions
              </DropdownMenuSubTrigger>

              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {actionsToPerform.map((type, idx) => {
                    return (
                      <DropdownMenuItem
                        key={`${type}-${idx}`}
                        onClick={() => handleActionClick(type)}
                      >
                        <RequestActionBadge
                          type={type}
                          className="bg-transparent p-0! text-sm"
                        />
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <PeformActionFormDialog
        request={{ id, title }}
        actionType={selectedAction}
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        from_entity={currentEntity?.from}
        to_entity={currentEntity?.to}
        actionToPerform={actionToPerform}
      />

      <ConfirmDelete
        resourceName="Request"
        item={{ label: title, sublabel: description }}
        isDeleting={isDeleting}
        onDelete={(targets) =>
          deleteRequest(targets, {
            onSuccess: () => {
              onDelete?.(id);
            },
          })
        }
        targets={id}
        open={DeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
};

export default RequestActions;
