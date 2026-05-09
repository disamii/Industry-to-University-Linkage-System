import { TableFilters } from "@/components/reusable/table-filters";
import TreeSelectOrgUnit from "@/components/reusable/tree-select-org_unit";
import { SelectItem } from "@/components/ui/select";
import { useGetIndustryList } from "@/data/industry/industry-list-query";
import { useGetRoleByPath } from "@/hooks/use-get-role-by-path";
import { ActionType, IndustryRequestType, UserRole } from "@/lib/enums";
import { Filter } from "lucide-react";
import {
  defaultRequestParams,
  useRequestParams,
} from "@/data/requests/use-request-params";

const RequestsTableOperations = () => {
  const { params, setParams, removeParams, clearAllParams } =
    useRequestParams();

  const currentRole = useGetRoleByPath();
  const isOffice = currentRole === UserRole.ADMIN;

  const industriesQuery = useGetIndustryList(isOffice);

  return (
    <TableFilters.Root
      params={params}
      setParams={setParams}
      removeParams={removeParams}
      clearAllParams={clearAllParams}
    >
      <TableFilters.Group>
        <TableFilters.Sort
          defaultValue={defaultRequestParams.ordering}
          options={[
            { label: "Date", value: "created_at" },
            { label: "Title", value: "title" },
          ]}
        />

        <TableFilters.Box Icon={Filter} name="Filters">
          {isOffice && (
            <TableFilters.Select
              paramKey="industry"
              placeholder="All Industries"
              query={industriesQuery}
              checkEmpty={(data) => data.results.length === 0}
              children={({ data, registerLabels }) => {
                const map: Record<string, string> = {};

                const items = data.results.map((item, idx) => {
                  map[item.id] = item.name;

                  return (
                    <SelectItem
                      key={`${item.id}—${idx}`}
                      value={item.id.toString()}
                    >
                      {item.name}
                    </SelectItem>
                  );
                });

                registerLabels?.("industry", map);

                return items;
              }}
            />
          )}

          <TableFilters.Select
            paramKey="type"
            placeholder="All Request Types"
            options={Object.values(IndustryRequestType)}
          />

          <TreeSelectOrgUnit variant="filter" />

          <TableFilters.Select
            paramKey="actions__type"
            placeholder="All Activities"
            options={Object.values(ActionType)}
          />
        </TableFilters.Box>
      </TableFilters.Group>

      <TableFilters.Search
        placeholder={
          isOffice
            ? "Search by industry or request title…"
            : "Search by request title..."
        }
      />

      <TableFilters.ActiveFilters
        labels={{
          type: "Type",
          actions__type: "Action Type",
          academic_unit: "Academic Unit",
          industry: "Industry",
        }}
        defaults={defaultRequestParams}
      />
    </TableFilters.Root>
  );
};

export default RequestsTableOperations;
