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
import { AssignmentStatus, UserRole } from "@/lib/enums";
import { colorVariants } from "@/lib/mappings";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Eye,
  MoreVertical,
  RefreshCcw,
  Settings2,
  UserCog,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAssignmentStatusConfig } from "./utils.assignments";
import { useGetRoleByPath } from "@/hooks/use-get-role-by-path";
import { useState } from "react";
import ManageUserAssignmentFormDialog from "./manage-user-assignment-form-dialog";
import { UserProfile } from "@/types/interfaces.user";
import ChangeAssignmentStatusDialog from "./change-assignment-status-dialog";

type Props = {
  assignment_id: number;
  request_title: string;
  request_description: string;
  assigned_users: UserProfile[];
  variant?: "table" | "detail";
  supported_actions: AssignmentStatus[];
};

const AssignmentActions = ({
  assignment_id,
  request_title,
  request_description,
  assigned_users,
  variant = "table",
  supported_actions,
}: Props) => {
  const navigate = useNavigate();
  const isTable = variant === "table";
  const currentRole = useGetRoleByPath();

  // Manage user Assignment
  const [dialogConfig, setDialogConfig] = useState<{
    open: boolean;
    action: "add" | "remove";
  }>({ open: false, action: "add" });

  const openDialog = (action: "add" | "remove") => {
    setDialogConfig({ open: true, action });
  };

  // Perform Status Change
  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    status: AssignmentStatus | null;
  }>({
    open: false,
    status: null,
  });
  const actionsToPerform = Object.values(AssignmentStatus).filter((status) =>
    supported_actions?.includes(status),
  );
  const openStatusDialog = (status: AssignmentStatus) => {
    setStatusDialog({
      open: true,
      status,
    });
  };

  return (
    <>
      <DropdownMenu key={assignment_id}>
        <DropdownMenuTrigger asChild>
          {isTable ? (
            <button className="hover:bg-muted p-2 rounded-md transition-colors">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          ) : (
            <Button variant="secondary">
              <Settings2 className="w-4 h-4" />
              <span>Manage Assignment</span>
              <ChevronDown className="opacity-50 w-4 h-4" />{" "}
            </Button>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className={cn(isTable && "w-48")}>
          {isTable && (
            <DropdownMenuItem onClick={() => navigate(`${assignment_id}`)}>
              <Eye className="mr-2 w-4 h-4" />
              View Details
            </DropdownMenuItem>
          )}

          {currentRole === UserRole.ADMIN && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserCog className="mr-2 w-4 h-4" />
                Manage Experts
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => openDialog("add")} // Trigger Add
                    className={cn(colorVariants.info, "bg-transparent")}
                  >
                    <UserPlus className="mr-2 w-4 h-4" />
                    Add Experts
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDialog("remove")} // Trigger Remove
                    className={cn(colorVariants.danger, "bg-transparent")}
                  >
                    <UserMinus className="mr-2 w-4 h-4" />
                    Remove Experts
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          )}

          {currentRole === UserRole.STAFF && actionsToPerform.length !== 0 && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="whitespace-nowrap">
                <RefreshCcw className="mr-2 w-4 h-4" />
                Change Status
              </DropdownMenuSubTrigger>

              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {actionsToPerform.map((stat, idx) => {
                    const { Icon, color, label } =
                      getAssignmentStatusConfig(stat);

                    return (
                      <DropdownMenuItem
                        key={`${stat}-${idx}`}
                        className={cn(color, "bg-transparent")}
                        onClick={() => openStatusDialog(stat)}
                      >
                        <Icon className="w-4 h-4" />
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

      <ManageUserAssignmentFormDialog
        open={dialogConfig.open}
        onOpenChange={(open) => setDialogConfig((prev) => ({ ...prev, open }))}
        action={dialogConfig.action}
        assignedUsers={assigned_users}
        assignment_id={assignment_id}
        request={{
          title: request_title,
          description: request_description,
        }}
      />

      <ChangeAssignmentStatusDialog
        open={statusDialog.open}
        onOpenChange={(open) =>
          setStatusDialog((prev) => ({
            ...prev,
            open,
          }))
        }
        assignment_id={assignment_id}
        status={statusDialog.status}
        request={{
          title: request_title,
          desc: request_description,
          assigned_users,
        }}
      />
    </>
  );
};

export default AssignmentActions;
