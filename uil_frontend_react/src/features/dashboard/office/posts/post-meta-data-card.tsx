import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { PostDetailResponse } from "@/types/interfaces.posts";
import { CalendarDays } from "lucide-react";

const PostMetaDataCard = ({
  published_at,
  expires_at,
  created_at,
  updated_at,
}: PostDetailResponse) => {
  const metadata = [
    {
      label: "Published At",
      value: formatDate(published_at),
    },
    {
      label: "Expires At",
      value: formatDate(expires_at),
    },
    {
      label: "Created At",
      value: formatDate(created_at),
    },
    {
      label: "Updated At",
      value: formatDate(updated_at),
    },
  ];

  const renderItems = (
    item: {
      label: string;
      value?: string | null;
    },
    idx: number,
  ) => {
    return (
      <div key={`${item.label}-${idx}`} className="grid grid-cols-[9rem_1fr]">
        <span className="text-muted-foreground">{item.label}</span>

        <span className="justify-self-end text-right">{item.value || "—"}</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold text-lg">
          <CalendarDays className="w-5 h-5 text-primary" />
          Metadata
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 bg-muted/50 p-4 rounded-lg text-sm">
          {metadata.map(renderItems)}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostMetaDataCard;
