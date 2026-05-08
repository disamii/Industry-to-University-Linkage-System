import { TableFilters } from "@/components/reusable/table-filters";
import { Filter } from "lucide-react";
import {
  defaultIndustryParams,
  useIndustryParams,
} from "../../../../data/industry/use-industry-params";
import { IndustryType } from "@/lib/enums";

const IndustriesTableOperations = () => {
  const { params, setParams, removeParams, clearAllParams } =
    useIndustryParams();

  return (
    <TableFilters.Root
      params={params}
      setParams={setParams}
      removeParams={removeParams}
      clearAllParams={clearAllParams}
    >
      <TableFilters.Group>
        <TableFilters.Sort
          defaultValue={defaultIndustryParams.ordering}
          options={[
            { label: "Name", value: "name" },
            { label: "Created Date", value: "created_at" },
          ]}
        />

        <TableFilters.Box Icon={Filter} name="Filters">
          <TableFilters.Select
            paramKey="industry_type"
            placeholder="All Types"
            options={Object.values(IndustryType)}
          />
        </TableFilters.Box>
      </TableFilters.Group>

      <TableFilters.Search placeholder="Search by name…" />

      <TableFilters.ActiveFilters
        labels={{
          page_size: "Items Per Page",
          industry_type: "Indsutry Type",
        }}
        defaults={defaultIndustryParams}
      />
    </TableFilters.Root>
  );
};

export default IndustriesTableOperations;
