import { IndustryBase } from "@/validation/validation.industry";
import { Metadata } from "./interfaces";

export type IndustryStats = {
  total: number;
  industries_with_requests: number;
  industries_registered_this_year: number;
};

export type IndustryResponse = IndustryBase &
  Metadata & {
    id: number;
  };
