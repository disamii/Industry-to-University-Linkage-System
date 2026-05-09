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
import { useIndustryRequestDeleteMutation } from "@/data/industry_requests/industry/industry_request-delete-mutation";
import { useGetRoleByPath } from "@/hooks/use-get-role-by-path";
import { ActionType, UserRole } from "@/lib/enums";
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
};

const IndustryRequestActions = ({
  id,
  title,
  description,
  variant = "table",
  supported_actions,
  showViewDetails = true,
  actionToPerform,
}: Props) => {
  const { mutate: deleteRequest, isPending: isDeleting } =
    useIndustryRequestDeleteMutation();
  const [DeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const isTable = variant === "table";

  const currentRole = useGetRoleByPath();

  const isOffice = currentRole === UserRole.ADMIN;
  const currentEntity = currentRole ? mapEntity[currentRole] : undefined;

  // Perform Actions
  const actionsToPerform = Object.values(ActionType)
    .filter((type) => supported_actions?.includes(type))
    .filter(
      (action) =>
        action !== ActionType.REVOKED && action !== ActionType.ACCEPT_FORWARDED,
    );
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);

  const handleActionClick = (type: ActionType) => {
    setSelectedAction(type);
    setActionDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isTable ? (
            <button className="hover:bg-muted p-2 rounded-md transition-colors">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          ) : (isOffice && actionsToPerform.length !== 0) || !isOffice ? (
            <Button variant="secondary">
              <Settings2 className="w-4 h-4" />
              <span>Manage Request</span>
              <ChevronDown className="opacity-50 w-4 h-4" />{" "}
            </Button>
          ) : null}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className={cn(isTable && "w-45")}>
          {isTable && showViewDetails && (
            <DropdownMenuItem onClick={() => navigate(`${id}`)}>
              <Eye className="mr-2 w-4 h-4" />
              View Details
            </DropdownMenuItem>
          )}

          {!isOffice && (
            <>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/dashboard/industry/requests/${id}/edit`)
                }
              >
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

          {isOffice && actionsToPerform.length !== 0 && (
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
            onSuccess: () => navigate(`/dashboard/industry/requests/`),
          })
        }
        targets={id}
        open={DeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
};

export default IndustryRequestActions;
