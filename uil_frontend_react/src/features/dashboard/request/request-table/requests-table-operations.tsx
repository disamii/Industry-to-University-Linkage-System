import { TableFilters } from "@/components/reusable/table-filters";
import TreeSelectOrgUnit from "@/components/reusable/tree-select-org_unit";
import { SelectItem } from "@/components/ui/select";
import { useGetIndustryList } from "@/data/industry/industry-list-query";
import {
  defaultRequestParams,
  useRequestParams,
} from "@/data/requests/use-request-params";
import { ActionType, Entity } from "@/lib/enums";
import { Filter } from "lucide-react";
import { getEntityFormConfig, SupportedEntity } from "../utils.request";

type Props = {
  requesting_entity: Entity;
};

const RequestsTableOperations = ({ requesting_entity }: Props) => {
  const { params, setParams, removeParams, clearAllParams } =
    useRequestParams();
  const entityConfig = getEntityFormConfig(
    requesting_entity as SupportedEntity,
  );

  const industriesQuery = useGetIndustryList(
    requesting_entity !== Entity.INDUSTRY,
  );

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
          {requesting_entity !== Entity.INDUSTRY && (
            <TableFilters.Select
              paramKey="industry"
              placeholder="All Industries"
              query={industriesQuery}
              checkEmpty={(data) => !data || data.results.length === 0}
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
            options={Object.values(entityConfig.types)}
          />

          <TreeSelectOrgUnit variant="filter" namespace="requests" />

          <TableFilters.Select
            paramKey="actions__type"
            placeholder="All Activities"
            options={Object.values(ActionType)}
          />
        </TableFilters.Box>
      </TableFilters.Group>

      <TableFilters.Search
        placeholder={
          requesting_entity !== Entity.INDUSTRY
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
