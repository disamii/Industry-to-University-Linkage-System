import ConfirmDelete from "@/components/reusable/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePostDeleteMutation } from "@/data/posts/post-delete-muation";
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
  variant?: "table" | "detail";
  title: string;
};

const PostActions = ({ id, title, variant = "table" }: Props) => {
  const { mutate: deletePost, isPending: isDeleting } = usePostDeleteMutation();
  const [DeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const navigate = useNavigate();
  const isTable = variant === "table";

  return (
    <>
      <DropdownMenu key={id}>
        <DropdownMenuTrigger asChild>
          {isTable ? (
            <button className="hover:bg-muted p-2 rounded-md transition-colors">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          ) : (
            <Button variant="secondary">
              <Settings2 className="w-4 h-4" />
              <span>Manage Post</span>
              <ChevronDown className="opacity-50 w-4 h-4" />{" "}
            </Button>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className={cn(isTable && "w-40")}>
          {isTable && (
            <DropdownMenuItem onClick={() => navigate(`${id}`)}>
              <Eye className="mr-2 w-4 h-4" />
              View Details
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => navigate(`/dashboard/office/posts/${id}/edit`)}
          >
            <Pencil className="mr-2 w-4 h-4" />
            Edit Post
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 w-4 h-4" />
            Remove Post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDelete
        resourceName="Post"
        item={{ label: title }}
        isDeleting={isDeleting}
        onDelete={(targets) =>
          deletePost(targets, {
            onSuccess: () => {
              navigate(`/dashboard/office/posts/`);
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

export default PostActions;
