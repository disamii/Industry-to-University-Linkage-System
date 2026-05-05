import { IndustryCreateInput } from "@/validation/validation.industry";
import { Metadata } from "./interfaces";

export type IndustryResponse = IndustryCreateInput &
  Metadata & {
    id: number;
  };
