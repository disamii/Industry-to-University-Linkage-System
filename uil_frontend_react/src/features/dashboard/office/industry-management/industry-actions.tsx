import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, Eye, MoreVertical, Send, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  id: number;
  variant?: "table" | "detail";
};

const IndustryActions = ({ id, variant = "table" }: Props) => {
  const navigate = useNavigate();
  const isTable = variant === "table";

  return (
    <DropdownMenu key={id}>
      <DropdownMenuTrigger asChild>
        {isTable ? (
          <button className="hover:bg-muted p-2 rounded-md transition-colors">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        ) : (
          <Button variant="secondary">
            <Settings2 className="w-4 h-4" />
            <span>Manage Industry</span>
            <ChevronDown className="opacity-50 w-4 h-4" />{" "}
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className={cn(isTable && "w-45")}>
        {isTable && (
          <DropdownMenuItem onClick={() => navigate(`${id}`)}>
            <Eye className="mr-2 w-4 h-4" />
            View Details
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={() => navigate("/dashboard/office/requests/create")}
        >
          <Send className="mr-2 w-4 h-4" />
          Send Request
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default IndustryActions;
