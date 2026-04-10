import StaffDetailPage from "@/features/dashboard/staff/StaffDetailPage";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <StaffDetailPage id={id} />;
}
