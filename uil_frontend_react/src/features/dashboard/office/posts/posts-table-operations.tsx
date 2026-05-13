import { TableFilters } from "@/components/reusable/table-filters";
import { PostType } from "@/lib/enums";
import { Filter } from "lucide-react";
import {
  defaultPostParams,
  usePostParams,
} from "../../../../data/posts/use-post-params";

const PostsTableOperations = () => {
  const { params, setParams, removeParams, clearAllParams } = usePostParams();

  return (
    <TableFilters.Root
      params={params}
      setParams={setParams}
      removeParams={removeParams}
      clearAllParams={clearAllParams}
    >
      <TableFilters.Group>
        <TableFilters.Sort
          defaultValue={defaultPostParams.ordering}
          options={[
            { label: "Title", value: "title" },
            { label: "Registration Date", value: "created_at" },
            { label: "Published Date", value: "published_at" },
          ]}
        />

        <TableFilters.Box Icon={Filter} name="Filters">
          <TableFilters.Select
            paramKey="post_type"
            placeholder="All Post Types"
            options={Object.values(PostType)}
          />

          {/* <TableFilters.Select
            paramKey="content_type"
            placeholder="All Content Types"
            options={Object.values(PostContentType)}
          /> */}

          <TableFilters.Checkbox
            items={[
              {
                paramKey: "is_published",
                label: "Published Only",
              },
              {
                paramKey: "is_internal_only",
                label: "Internal Only",
              },
            ]}
          />
        </TableFilters.Box>
      </TableFilters.Group>

      <TableFilters.Search placeholder="Search by post title…" />

      <TableFilters.ActiveFilters
        labels={{
          post_type: "Post Type",
          is_published: "Show published posts only",
          is_internal_only: "Show internal posts only",
        }}
        defaults={defaultPostParams}
      />
    </TableFilters.Root>
  );
};

export default PostsTableOperations;
