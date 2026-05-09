import StatCard, { Stat } from "@/components/reusable/stat-card";
import { PostStats } from "@/types/interfaces.posts";
import { Antenna, BookOpen, Newspaper } from "lucide-react";

type Props = {
  stats: PostStats;
};

const PostsStat = ({ stats }: Props) => {
  const {
    total_posts,
    success_story,
    thematic_area,
    open_request,
    announcement,
    guideline,
  } = stats;

  const formattedStats: Stat[] = [
    {
      title: "Total Posts",
      value: total_posts.toString(),
      Icon: Newspaper,
      colorVariant: "info",
    },
    {
      title: "Thematic Area",
      value: thematic_area.toString(),
      Icon: BookOpen,
      colorVariant: "warning",
      subStats: [
        {
          label: "Success Story",
          value: success_story.toString(),
          colorVariant: "success",
        },
        {
          label: "Guideline",
          value: guideline.toString(),
          colorVariant: "secondary",
        },
      ],
    },
    {
      title: "Open Requests",
      value: open_request.toString(),
      Icon: Antenna,
      colorVariant: "primary",
      subStats: [
        {
          label: "Announcement",
          value: announcement.toString(),
          colorVariant: "warning",
        },
      ],
    },
  ];

  return <StatCard stats={formattedStats} />;
};

export default PostsStat;
