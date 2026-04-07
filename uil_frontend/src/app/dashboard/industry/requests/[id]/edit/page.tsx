import AdminHeaderTitle from "@/components/dashboard/reusable/admin-header-title";
import { Spinner } from "@/components/reusable/spinner";
import { getIndustryRequestDetail } from "@/data/industry_requests/industry_request-detail-mutation";
import CreateEditIndustryRequestsForm from "@/features/dashboard/industry_requests/create-edit-industry_requests-form";
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

const EditIndustryRequestsPage = async ({ params }: Props) => {
  const { id } = await params;
  const requestToEdit = await getIndustryRequestDetail(id);

  return (
    <div className="space-y-8 mx-auto">
      <AdminHeaderTitle
        title="Edit Your Request"
        backLink={{
          linkLabel: "Back to Requests",
          href: "/dashboard/industry/requests",
        }}
      />

      <Suspense fallback={<Spinner size="lg" />}>
        <CreateEditIndustryRequestsForm requestToEdit={requestToEdit} />
      </Suspense>
    </div>
  );
};

export default EditIndustryRequestsPage;
