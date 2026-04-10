import RequestDetailPage from "@/features/dashboard/industry_requests/IndustryRequestDetailPage";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <RequestDetailPage id={id} />;
}
