import ConfirmDelete from "@/components/reusable/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIndustryRequestDeleteMutation } from "@/data/industry_requests/industry/industry_request-delete-mutation";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Eye,
  MoreVertical,
  Pencil,
  Settings2,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  id: number;
  title: string;
  description: string;
  variant?: "table" | "detail";
  isOffice?: boolean;
};

const IndustryRequestActions = ({
  id,
  title,
  description,
  variant = "table",
  isOffice,
}: Props) => {
  const { mutate: deleteRequest, isPending: isDeleting } =
    useIndustryRequestDeleteMutation();
  const [DeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const isTable = variant === "table";

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
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDelete
        resourceName="Industry Request"
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
