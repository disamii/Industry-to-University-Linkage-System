import ConfirmDelete from "@/components/reusable/confirm-delete-dialog";
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
import { ActionType, UserRole } from "@/lib/enums";
import { cn, getRoleByPath } from "@/lib/utils";
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
import { useLocation, useNavigate } from "react-router-dom";
import { ACTION_CONFIG } from "./utils.industry_request-actions";
import { ActionDialog } from "./perform-action-form-dialog";

type Props = {
  id: number;
  title: string;
  description: string;
  variant?: "table" | "detail";
  supported_actions?: ActionType[];
};

const IndustryRequestActions = ({
  id,
  title,
  description,
  variant = "table",
  supported_actions,
}: Props) => {
  const { mutate: deleteRequest, isPending: isDeleting } =
    useIndustryRequestDeleteMutation();
  const [DeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const isTable = variant === "table";

  const { pathname } = useLocation();
  const isOffice = getRoleByPath(pathname) === UserRole.ADMIN;

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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isTable ? (
            <button className="hover:bg-muted p-2 rounded-md transition-colors">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          ) : (
            <Button variant="secondary">
              <Settings2 className="w-4 h-4" />
              <span>Manage Request</span>
              <ChevronDown className="opacity-50 w-4 h-4" />{" "}
            </Button>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className={cn(isTable && "w-42")}>
          {isTable && (
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
                <Wrench className="size-3.5" />
                Perform Actions
              </DropdownMenuSubTrigger>

              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {actionsToPerform.map((type, idx) => {
                    const { Icon, color, label } = ACTION_CONFIG[type];

                    return (
                      <DropdownMenuItem
                        key={`${type}-${idx}`}
                        className={cn(color, "bg-transparent")}
                        onClick={() => handleActionClick(type)}
                      >
                        <Icon className="size-3.5" />
                        {label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ActionDialog
        requestId={id}
        actionType={selectedAction}
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
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
