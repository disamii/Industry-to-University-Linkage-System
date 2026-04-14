"use client";

import { QueryState } from "@/components/dashboard/reusable/query-state-ui";
import {
  ComboboxOption,
  SearchableCombobox,
} from "@/components/reusable/searchable-combobox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAssignStaffMutation } from "@/data/assignment/assignment-create-mutation";
import { useGetOrgUnitsList } from "@/data/org_unit/org_units-list-query";
import { useGetUsers } from "@/data/user/user-list-query";
import { getFullName } from "@/lib/helpers";
import { IndustryRequestResponse } from "@/types/interfaces.industry_requests";
import { AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";

interface AssignStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestInfo: IndustryRequestResponse;
  actionButtonLabel: string;
}

export function AssignStaffDialog({
  open,
  onOpenChange,
  requestInfo,
  actionButtonLabel,
}: AssignStaffDialogProps) {
  const usersQuery = useGetUsers();
  const orgUnitsQuery = useGetOrgUnitsList();

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | null
  >(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const { mutate, isPending: isAssigning } = useAssignStaffMutation();

  const handleAssign = async () => {
    if (selectedStaffId) {
      const data = {
        request_id: requestInfo.id,
        staff_id: selectedStaffId,
        department_id: selectedDepartmentId,
      };
      console.log(data);
      // mutate(data);
      onOpenChange(false);
    }
  };

  const departmentOptions = useMemo<ComboboxOption[]>(() => {
    const departments = orgUnitsQuery?.data?.items || [];

    return departments.map((d) => ({
      value: d.id,
      label: d.name,
      render: () => (
        <div className="flex justify-between items-center gap-3 w-full">
          <div className="flex-1">
            <p className="font-medium text-foreground text-sm">{d.name}</p>
          </div>
          {d.abbreviation && (
            <span className="bg-muted px-2 py-1 rounded font-medium text-muted-foreground text-xs shrink-0">
              {d.abbreviation}
            </span>
          )}
        </div>
      ),
    }));
  }, [orgUnitsQuery?.data?.items]);

  const staffOptions = useMemo<ComboboxOption[]>(() => {
    const users = usersQuery?.data?.items || [];

    return users.map((user) => {
      const fullName =
        getFullName(
          user.first_name,
          user.father_name,
          user.grand_father_name,
        ) || user.email;
      const numAssignments = user.assignments?.length;

      return {
        value: user.id,
        label: fullName || "",
        render: () => (
          <div className="flex justify-between items-start gap-3 w-full">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm">
                {user.academic_title} {fullName}
              </p>
              {user.email && (
                <p className="text-muted-foreground text-xs truncate">
                  {user.email}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="font-medium text-muted-foreground text-xs">
                {numAssignments} assigned
              </p>
            </div>
          </div>
        ),
      };
    });
  }, [usersQuery?.data?.items]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        {/* Header Section with Request Info */}
        <DialogHeader>
          <DialogTitle>{actionButtonLabel} Staff Member</DialogTitle>
          <DialogDescription>
            {actionButtonLabel} a staff member to this request
          </DialogDescription>
        </DialogHeader>
        {/* Request Information Card */}
        <div className="bg-accent/50 p-4 border rounded-lg">
          <h3 className="font-semibold text-foreground text-sm">
            {requestInfo.title}
          </h3>
          {requestInfo.description && (
            <p className="mt-1 text-muted-foreground text-sm">
              {requestInfo.description}
            </p>
          )}
          <p className="mt-2 text-muted-foreground text-sm capitalize">
            Request Type: {requestInfo.type.split("_").join(" ")}
          </p>
        </div>
        {/* Department Filter (Optional) */}
        <QueryState
          query={orgUnitsQuery}
          emptyMessage="No departments available"
          loadingMessage="Loading departments..."
        >
          {() => (
            <div className="space-y-2">
              <label className="font-medium text-foreground text-sm">
                Department{" "}
                <span className="text-muted-foreground">(Optional)</span>
              </label>
              <SearchableCombobox
                options={departmentOptions}
                value={selectedDepartmentId}
                onValueChange={setSelectedDepartmentId}
                placeholder="All departments"
                searchPlaceholder="Search departments..."
                emptyMessage="No departments found"
                disabled={isAssigning}
                renderValue={(option) => (
                  <span>
                    {option
                      ? orgUnitsQuery?.data?.items?.find(
                          (d) => d.id === option.value,
                        )?.name || option.label
                      : "All departments"}
                  </span>
                )}
              />
            </div>
          )}
        </QueryState>
        {/* Staff Member Selection */}
        <div className="space-y-2">
          <label className="font-medium text-foreground text-sm">
            Staff Member
          </label>

          <QueryState
            query={usersQuery}
            emptyMessage={
              selectedDepartmentId
                ? "No staff members in this department"
                : "No staff members available"
            }
            loadingMessage="Loading staff members..."
          >
            {() =>
              staffOptions.length === 0 ? (
                <div className="bg-muted/30 p-4 border border-muted border-dashed rounded-lg text-center">
                  <AlertCircle className="mx-auto mb-2 size-5 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm">
                    {selectedDepartmentId
                      ? "No staff members found in this department"
                      : "No staff members available"}
                  </p>
                </div>
              ) : (
                <SearchableCombobox
                  options={staffOptions}
                  value={selectedStaffId}
                  onValueChange={setSelectedStaffId}
                  placeholder="Select a staff member..."
                  searchPlaceholder="Search staff members..."
                  emptyMessage="No staff members found"
                  disabled={isAssigning}
                  renderValue={(option) => {
                    const staff = usersQuery?.data?.items?.find(
                      (s) => s.id === option?.value,
                    );
                    return (
                      <div className="flex justify-between items-center gap-2 w-full">
                        <span>
                          {staff
                            ? `${staff.academic_title ? `${staff.academic_title} ` : ""}${staff.first_name}`
                            : option?.label || "Select a staff member..."}
                        </span>
                      </div>
                    );
                  }}
                />
              )
            }
          </QueryState>
        </div>
        {/* Action Buttons */}
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="outline" disabled={isAssigning}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleAssign}
            disabled={!selectedStaffId || isAssigning}
          >
            {isAssigning ? "Assigning..." : actionButtonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
