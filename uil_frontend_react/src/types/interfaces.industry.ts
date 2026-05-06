import { IndustryBase } from "@/validation/validation.industry";
import { Metadata } from "./interfaces";

export type IndustryParams = {
  search?: string;
};

export type IndustryResponse = IndustryBase &
  Metadata & {
    id: string;
    status: string;
  };
