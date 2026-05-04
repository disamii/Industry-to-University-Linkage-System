/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useContext } from "react";
import { Card } from "../ui/card";

type FiltersContextType = {
  params: Record<string, any>;
  setParams: (p: Record<string, any>) => void;
  removeParams: (keys: any[]) => void;
  clearAllParams: () => void;
};

const FiltersContext = createContext<FiltersContextType | null>(null);

const useFilters = () => {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("Must be used within TableFilters");
  return ctx;
};

type RootProps = FiltersContextType & {
  children: ReactNode;
};

const Root = ({ children, ...ctx }: RootProps) => {
  return (
    <FiltersContext.Provider value={ctx}>
      <div className="justify-start items-center gap-5 grid grid-cols-[1fr_auto]">
        {children}
      </div>
    </FiltersContext.Provider>
  );
};

const Group = ({ children }: { children: ReactNode }) => (
  <div className="flex items-stretch gap-4">{children}</div>
);

const Box = ({
  children,
  Icon,
  name,
}: {
  children: ReactNode;
  Icon: LucideIcon;
  name: string;
}) => (
  <Card className="flex-row items-center gap-2 px-3 py-1.5 h-12">
    <div className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
      <Icon className="w-4 h-4" />
      {name}:
    </div>

    {children}
  </Card>
);

import { parseSort } from "@/lib/utils";
import { ArrowUpDown, ListFilter, LucideIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type SortOption<T extends string> = {
  label: string;
  value: T;
};

type SortProps<T extends string> = {
  paramKey?: string;
  options: SortOption<T>[];
  defaultValue: T;
};

const Sort = <T extends string>({
  paramKey = "ordering",
  options,
  defaultValue,
}: SortProps<T>) => {
  const { params, setParams } = useFilters();

  const raw = params[paramKey] ?? `-${defaultValue}`;
  const parsed = parseSort<T>(raw) ?? {
    field: defaultValue,
    dir: "desc" as const,
  };

  const { field, dir } = parsed;

  const toggleDirection = () => {
    const next = dir === "asc" ? `-${field}` : field;
    setParams({ [paramKey]: next });
  };

  return (
    <Box Icon={ArrowUpDown} name="Sort By">
      <Select
        value={field}
        onValueChange={(value: T) =>
          setParams({
            [paramKey]: dir === "desc" ? `-${value}` : value,
          })
        }
      >
        <SelectTrigger className="w-20 h-7">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button size="icon" variant="ghost" onClick={toggleDirection}>
        <ArrowUpDown
          className={`h-4 w-4 transition-transform ${
            dir === "desc" ? "rotate-180" : ""
          }`}
        />
      </Button>
    </Box>
  );
};

type SelectFilterProps = {
  paramKey: string;
  placeholder: string;
  options: string[];
};

const SelectFilter = ({
  paramKey,
  placeholder,
  options,
}: SelectFilterProps) => {
  const { params, setParams, removeParams } = useFilters();

  return (
    <Select
      value={params[paramKey] ?? "all"}
      onValueChange={(value) =>
        value !== "all"
          ? setParams({ [paramKey]: value })
          : removeParams([paramKey])
      }
    >
      <SelectTrigger className="w-40 h-7">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>

        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt.replaceAll("_", " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

import { useDebounce } from "@/hooks/use-debounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

const SearchInput = () => {
  const { setParams } = useFilters();

  const [value, setValue] = useState("");
  const debounced = useDebounce(value, 300);

  useEffect(() => {
    setParams({ search: debounced });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className="relative justify-self-end">
      <Search className="top-2.5 left-2 absolute w-4 h-4" />
      <Input
        className="pl-8 w-80"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search..."
      />
    </div>
  );
};

type ActiveFiltersProps = {
  exclude?: string[];
  labels?: Record<string, string>;
  defaults?: Record<string, any>;
};

const ActiveFilters = ({
  exclude = ["search", "ordering"],
  labels = {},
  defaults = {},
}: ActiveFiltersProps) => {
  const { params, removeParams, clearAllParams } = useFilters();

  const entries = Object.entries(params).filter(([key, value]) => {
    if (!value) return false;
    if (exclude.includes(key)) return false;

    // 👇 exclude default values
    if (key in defaults && defaults[key] === value) return false;

    return true;
  });

  if (entries.length === 0) return null;

  return (
    <Box Icon={ListFilter} name="Active Filters">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md text-xs"
        >
          <span className="font-medium text-muted-foreground">
            {labels[key]}:
          </span>
          <span className="font-medium">{value}</span>

          <button
            onClick={() => removeParams([key])}
            className="bg-destructive/10 ml-1 p-0.5 rounded-full text-destructive"
          >
            <XIcon className="w-3 h-3" />
          </button>
        </div>
      ))}

      <Button
        variant="destructive"
        size="xs"
        onClick={() => clearAllParams()}
        className="flex items-center gap-1 ml-auto"
      >
        <XIcon />
        Clear all
      </Button>
    </Box>
  );
};

export const TableFilters = {
  Root,
  Group,
  Box,
  Sort,
  Select: SelectFilter,
  Search: SearchInput,
  ActiveFilters,
};
