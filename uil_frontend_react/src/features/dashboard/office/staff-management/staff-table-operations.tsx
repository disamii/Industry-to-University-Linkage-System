import { TableFilters } from "@/components/reusable/table-filters";
import TreeSelectOrgUnit from "@/components/reusable/tree-select-org_unit";
import { defaultUserParams, useUserParams } from "@/data/user/use-user-params";
import { Filter } from "lucide-react";

const StaffTableOperations = () => {
  const { params, setParams, removeParams, clearAllParams } = useUserParams();

  return (
    <TableFilters.Root
      params={params}
      setParams={setParams}
      removeParams={removeParams}
      clearAllParams={clearAllParams}
    >
      <TableFilters.Group>
        <TableFilters.Sort
          defaultValue={defaultUserParams.ordering}
          options={[
            { label: "Name", value: "first_name" },
            { label: "Registration Date", value: "created_at" },
          ]}
        />

        <TableFilters.Box Icon={Filter} name="Filters">
          <TreeSelectOrgUnit variant="filter" namespace="users" />
        </TableFilters.Box>
      </TableFilters.Group>

      <TableFilters.Search placeholder="Search by name or email…" />

      <TableFilters.ActiveFilters
        labels={{
          industry_type: "Indsutry Type",
        }}
        defaults={defaultUserParams}
      />
    </TableFilters.Root>
  );
};

export default StaffTableOperations;
