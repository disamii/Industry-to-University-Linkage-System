import { Pagination } from "@/components/reusable/pagination";
import Table from "@/components/reusable/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { PAGE_SIZE } from "@/lib/constants";
import { colorVariants } from "@/lib/mappings";
import { cn, formatDate, formatType } from "@/lib/utils";
import { ApiPaginatedResponse, ITableHead } from "@/types/interfaces";
import { PostResponse } from "@/types/interfaces.posts";
import { MoreVertical } from "lucide-react";
import { useRef } from "react";
import { usePostParams } from "../../../../data/posts/use-post-params";

type RowProps = {
  item: PostResponse;
  index: number;
};

const PostTableRow = ({ item, index }: RowProps) => {
  const { params } = usePostParams();

  const currentPage = params.page;
  const currentIndex = (currentPage - 1) * PAGE_SIZE;

  const yesNoColorVariant = (state: boolean) =>
    state ? colorVariants.success : colorVariants.danger;

  return (
    <TableRow>
      <TableCell>{currentIndex + index + 1}</TableCell>
      <TableCell>
        <h4 className="font-bold">{item.title}</h4>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="capitalize">
          {formatType(item.post_type)}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant="secondary"
          className={cn(yesNoColorVariant(item.is_published))}
        >
          {item.is_published ? "Yes" : "No"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant="secondary"
          className={cn(yesNoColorVariant(item.is_internal_only))}
        >
          {item.is_internal_only ? "Yes" : "No"}
        </Badge>
      </TableCell>
      <TableCell>
        <p className="text-muted-foreground text-xs">
          {formatDate(item.published_at)}
        </p>
      </TableCell>
      <TableCell>
        <p className="text-muted-foreground text-xs">
          {formatDate(item.expires_at)}
        </p>
      </TableCell>
      <TableCell className="text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:bg-muted p-2 rounded-md transition-colors">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>CONTENT</DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

type TableProps = {
  data: ApiPaginatedResponse<PostResponse>;
};

const PostsTable = ({ data }: TableProps) => {
  const { pagination, results } = data;
  const topCardRef = useRef<HTMLDivElement>(null);

  const tableHeads: ITableHead[] = [
    // {
    //   content: (
    //     <Checkbox
    //       checked={isAllSelected}
    //       onCheckedChange={handleSelectAll}
    //       aria-label="Select all"
    //     />
    //   ),
    // },
    { content: "#", className: "py-3" },
    { content: "Title" },
    { content: "Post Type" },
    { content: "Is Published" },
    { content: "Is Internal Only" },
    { content: "Published At" },
    { content: "Expires At" },
    { content: "Actions", className: "text-center" },
  ].filter(Boolean);

  return (
    <Table topCardRef={topCardRef}>
      <Table.Header heads={tableHeads} />

      <Table.Body
        data={results}
        render={(item, idx) => (
          <PostTableRow key={`${item.id}—${idx}`} item={item} index={idx} />
        )}
      />

      <Table.Footer>
        <Pagination
          variant="table"
          totalItems={pagination.total}
          scrollRef={topCardRef}
          namespace="posts"
        />
      </Table.Footer>
    </Table>
  );
};

export default PostsTable;
