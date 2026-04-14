import IndustryRequestDetailPageForAdmin from "@/features/dashboard/industry_requests/IndustryRequestDetailPageForAdmin";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <IndustryRequestDetailPageForAdmin id={id} />;
}
