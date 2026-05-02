import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import XIconButton from "./x-icon-button";

interface Filter {
  label: string;
  type: string;
}

interface ActiveFiltersProps {
  filters: Filter[];
  onClearFilter: (type: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilters({
  filters,
  onClearFilter,
  onClearAll,
}: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 bg-foreground p-3 rounded-lg">
      <span className="font-medium text-muted-background text-sm">
        Active filters:
      </span>

      {filters.map((filter, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="relative flex items-center gap-1"
        >
          {filter.label}
          <XIconButton
            onRemove={() => onClearFilter(filter.type)}
            className="ml-1"
          />
        </Badge>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="hover:bg-red-50 text-destructive hover:text-destructive/80"
      >
        Clear all
      </Button>
    </div>
  );
}
