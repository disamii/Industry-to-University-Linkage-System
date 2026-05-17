import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { TabsContent } from "@/components/ui/tabs";
import { useGetIndustryMe } from "@/data/industry/industry-current-profile-query";
import ContactPersonInfoUpdateForm from "@/features/dashboard/industry/manage-account/contact-person-info-update-form";
import ContactPersonPasswordUpdateForm from "@/features/dashboard/industry/manage-account/contact-person-password-update-form";
import IndustryUpdateForm from "@/features/dashboard/industry/manage-account/industry-update-form";
import AdminTabs from "@/features/dashboard/layout/admin-tabs";
import { Building2, UserRoundCog } from "lucide-react";

const tabs = [
  {
    value: "contact_person",
    label: "Manage Contact Person Info",
    Icon: UserRoundCog,
  },
  {
    value: "industry",
    label: "Manage Industry Details",
    Icon: Building2,
  },
];

const IndustryManageAccountPage = () => {
  const query = useGetIndustryMe();

  return (
    <div className="space-y-6">
      <DashboardContentHeader
        title={`Account Management`}
        desc="Update your contact information and manage your industry profile details."
        hasBackBtn={true}
      />

      <AdminTabs defaultValue="contact_person" tabs={tabs}>
        <QueryState
          query={query}
          checkEmpty={(data) => !data}
          variant="section"
        >
          {(data) => (
            <>
              <TabsContent value="contact_person" className="mt-4">
                <div className="gap-12 grid grid-cols-2">
                  <ContactPersonInfoUpdateForm {...data} />
                  <ContactPersonPasswordUpdateForm />
                </div>
              </TabsContent>

              <TabsContent value="industry" className="space-y-6 mt-4">
                <IndustryUpdateForm {...data} />
              </TabsContent>
            </>
          )}
        </QueryState>
      </AdminTabs>
    </div>
  );
};

export default IndustryManageAccountPage;
