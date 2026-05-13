import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TabsContent } from "@/components/ui/tabs";
import { useGetUsers } from "@/data/user/user-list-query";
import CheckStaffEmailForm from "@/features/auth/signup/check-staff-email-form";
import StaffTable from "@/features/dashboard/office/staff-management/staff-table";
import StaffTableOperations from "@/features/dashboard/office/staff-management/staff-table-operations";
import { UserPlus } from "lucide-react";
import { useState } from "react";

const StaffManagementTab = () => {
  const query = useGetUsers();
  const [registerUserDialog, setRegisterUserDialog] = useState(false);

  return (
    <TabsContent value="staff_management" className="space-y-6 mt-4">
      <div className="flex justify-between">
        <DashboardContentHeader
          title="Staff Management"
          desc="Manage staff members"
          hasBackBtn={false}
          scope={query.data?.scope}
        />

        <Dialog open={registerUserDialog} onOpenChange={setRegisterUserDialog}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-3">
              <UserPlus className="size-4" />
              Register user
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader className="sr-only">
              <DialogTitle>Register staff members</DialogTitle>
            </DialogHeader>
            <CheckStaffEmailForm
              isAdmin={true}
              setRegisterUserDialog={setRegisterUserDialog}
            />
          </DialogContent>
        </Dialog>
      </div>

      <QueryState query={query} checkEmpty={(data) => !data} variant="page">
        {(data) => {
          return (
            <div className="space-y-6">
              <StaffTableOperations />
              <StaffTable data={data} />
            </div>
          );
        }}
      </QueryState>
    </TabsContent>
  );
};

export default StaffManagementTab;
