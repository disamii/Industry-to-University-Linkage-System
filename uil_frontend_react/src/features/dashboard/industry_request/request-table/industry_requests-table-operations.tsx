import { TableFilters } from "@/components/reusable/table-filters";
import TreeSelectOrgUnit from "@/components/reusable/tree-select-org_unit";
import { ActionType, IndustryRequestType } from "@/lib/enums";
import {
  defaultIndustryRequestParams,
  useIndustryRequestParams,
} from "./use-industry_request-params";
import { Filter } from "lucide-react";

const IndustryRequestsTableOperations = () => {
  const { params, setParams, removeParams, clearAllParams } =
    useIndustryRequestParams();

  return (
    <TableFilters.Root
      params={params}
      setParams={setParams}
      removeParams={removeParams}
      clearAllParams={clearAllParams}
    >
      <TableFilters.Group>
        <TableFilters.Sort
          defaultValue="created_at"
          options={[
            { label: "Date", value: "created_at" },
            { label: "Title", value: "title" },
          ]}
        />

        <TableFilters.Box Icon={Filter} name="Filters">
          <TableFilters.Select
            paramKey="type"
            placeholder="All Types"
            options={Object.values(IndustryRequestType)}
          />

          <TreeSelectOrgUnit variant="filter" />

          <TableFilters.Select
            paramKey="actions__type"
            placeholder="All Action Types"
            options={Object.values(ActionType)}
          />
        </TableFilters.Box>
      </TableFilters.Group>

      <TableFilters.Search />

      <TableFilters.ActiveFilters
        labels={{
          type: "Type",
          actions__type: "Action Type",
          academic_unit: "Academic Unit",
        }}
        defaults={defaultIndustryRequestParams}
      />
    </TableFilters.Root>
  );
};

export default IndustryRequestsTableOperations;
