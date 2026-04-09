import { DataTable } from "@/components/dashboard/table/data-table";
import {
  ActionDropdown,
  DropdownAction,
} from "@/components/dashboard/table/table-action-dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getFullName, getNameInitials } from "@/lib/helpers";
import { ApiPaginatedResponse, TableColumn } from "@/types/interfaces";
import { User } from "@/types/interfaces.user";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  query: {
    isLoading: boolean;
    isError: boolean;
    data?: ApiPaginatedResponse<User[]>;
    refetch?: () => void;
  };
};

const StaffTable = ({ query }: Props) => {
  const router = useRouter();

  const columns = [
    {
      key: "first_name",
      label: "Expert",
      render: (_, row) => {
        const fullName = getFullName(row.first_name, row.father_name);

        return (
          <div className="flex items-center gap-3">
            <Avatar className="border border-border/50 rounded-xl w-8 md:w-9 h-8 md:h-9">
              <AvatarImage
                src={row.profile_picture || ""}
                alt="Profile"
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 font-bold text-[10px] text-primary md:text-xs">
                {getNameInitials(fullName || row.email)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-0.5">
              <p className="font-bold">{fullName || "—"}</p>
              <p className="text-xs truncate leading-none">{row.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "academic_unit",
      label: "Academic Unit",
      render: (value) => (
        <Badge
          variant="outline"
          className="bg-accent/20 border-border/60 rounded-lg font-medium"
        >
          {value?.name}
        </Badge>
      ),
    },
    {
      key: "research_interests",
      label: "Research Interests",
      render: (value) => {
        if (!value) return null;

        const items = value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
        const visible = items.slice(0, 3);
        const hidden = items.slice(3);

        return (
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
            {visible.map((val, idx) => (
              <Badge key={`${val}-${idx}`} variant="outline">
                {val}
              </Badge>
            ))}

            {hidden.length > 0 && (
              <Popover>
                <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Badge variant="outline" className="cursor-pointer">
                    +{hidden.length} more
                  </Badge>
                </PopoverTrigger>

                <PopoverContent className="flex flex-wrap gap-2 max-w-xs">
                  {hidden.map((val, idx) => (
                    <Badge key={`${val}-${idx}`} variant="secondary">
                      {val}
                    </Badge>
                  ))}
                </PopoverContent>
              </Popover>
            )}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "",
      render: (_, row) => {
        const actions: DropdownAction[] = [
          {
            label: "View Profile",
            icon: Eye,
            onClick: () => router.push(`/dashboard/office/staff/${row.id}`),
          },
        ];

        return <ActionDropdown actions={actions} />;
      },
    },
  ] satisfies TableColumn<User>[];

  return (
    <div className="border border-border/40 rounded-[1.5rem] overflow-hidden">
      <DataTable
        columns={columns}
        data={query.data?.items || []}
        isLoading={query.isLoading}
        isError={query.isError}
        refetch={query.refetch}
        onRowClick={(row) => router.push(`/dashboard/office/staff/${row.id}`)}
      />
    </div>
  );
};

export default StaffTable;
