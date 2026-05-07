import { TableFilters } from "@/components/reusable/table-filters";
import { AssignmentStatus } from "@/lib/enums";
import { Filter } from "lucide-react";
import {
  defaultAssignmentParams,
  useAssignmentParams,
} from "./assignments-params";

const AssignmentsTableOperations = () => {
  const { params, setParams, removeParams, clearAllParams } =
    useAssignmentParams();

  return (
    <TableFilters.Root
      params={params}
      setParams={setParams}
      removeParams={removeParams}
      clearAllParams={clearAllParams}
    >
      <TableFilters.Group>
        <TableFilters.Sort
          defaultValue={defaultAssignmentParams.ordering}
          options={[
            { label: "Start Date", value: "start_date" },
            { label: "End Date", value: "end_date" },
          ]}
        />

        <TableFilters.Box Icon={Filter} name="Filters">
          <TableFilters.Select
            paramKey="status"
            placeholder="All Status"
            options={Object.values(AssignmentStatus)}
          />
        </TableFilters.Box>
      </TableFilters.Group>

      <TableFilters.Search placeholder="Search by industry or request title…" />

      <TableFilters.ActiveFilters
        labels={{
          page_size: "Items Per Page",
          status: "Status",
        }}
        defaults={defaultAssignmentParams}
      />
    </TableFilters.Root>
  );
};

export default AssignmentsTableOperations;
