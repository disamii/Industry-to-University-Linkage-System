import { IndustryBase } from "@/validation/validation.industry";
import { Metadata } from "./interfaces";

export type IndustryResponse = IndustryBase &
  Metadata & {
    id: string;
    status: string;
  };
