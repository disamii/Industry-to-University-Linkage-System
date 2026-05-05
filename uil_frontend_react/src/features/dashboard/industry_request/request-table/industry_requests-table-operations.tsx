import { TableFilters } from "@/components/reusable/table-filters";
import TreeSelectOrgUnit from "@/components/reusable/tree-select-org_unit";
import { ActionType, IndustryRequestType } from "@/lib/enums";
import {
  defaultIndustryRequestParams,
  useIndustryRequestParams,
} from "./use-industry_request-params";
import { Filter } from "lucide-react";
import { SelectItem } from "@/components/ui/select";
import { useGetIndustryList } from "@/data/industry/industry-list-query";

type Props = {
  isOffice?: boolean;
};

const IndustryRequestsTableOperations = ({ isOffice }: Props) => {
  const { params, setParams, removeParams, clearAllParams } =
    useIndustryRequestParams();
  const query = useGetIndustryList();

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
          {isOffice && (
            <TableFilters.Select
              paramKey="industry"
              placeholder="All Industries"
              query={query}
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
            placeholder="All Industry Types"
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
          page_size: "Items Per Page",
          type: "Type",
          actions__type: "Action Type",
          academic_unit: "Academic Unit",
          industry: "Industry",
        }}
        defaults={defaultIndustryRequestParams}
      />
    </TableFilters.Root>
  );
};

export default IndustryRequestsTableOperations;
