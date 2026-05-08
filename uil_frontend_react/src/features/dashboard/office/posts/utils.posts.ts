import {
  Trophy,
  Layers3,
  HandHelping,
  Megaphone,
  BookOpen,
  LucideIcon,
} from "lucide-react";
import { PostType } from "@/lib/enums";

export type PostTypeConfig = {
  label: string;
  Icon: LucideIcon;
  color: string;
  description: string;
};

export const POST_TYPE_CONFIG: Record<PostType, PostTypeConfig> = {
  [PostType.SUCCESS_STORY]: {
    label: "Success Story",
    Icon: Trophy,
    color: "bg-emerald-100 text-emerald-700",
    description: "Highlights achievements, impact, or completed success cases.",
  },

  [PostType.THEMATIC_AREA]: {
    label: "Thematic Area",
    Icon: Layers3,
    color: "bg-violet-100 text-violet-700",
    description: "Content grouped under a strategic or thematic focus area.",
  },

  [PostType.OPEN_REQUEST]: {
    label: "Open Request",
    Icon: HandHelping,
    color: "bg-amber-100 text-amber-700",
    description: "A request seeking collaboration, support, or participation.",
  },

  [PostType.ANNOUNCEMENT]: {
    label: "Announcement",
    Icon: Megaphone,
    color: "bg-blue-100 text-blue-700",
    description: "Important updates, notices, or public communications.",
  },

  [PostType.GUIDELINE]: {
    label: "Guideline",
    Icon: BookOpen,
    color: "bg-slate-100 text-slate-700",
    description: "Instructions, procedures, or best-practice references.",
  },
};

/**
 * Helper to get config safely
 */
export const getPostTypeConfig = (type: PostType) => {
  return POST_TYPE_CONFIG[type];
};
