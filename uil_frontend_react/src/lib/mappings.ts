/**
 * Utility
 */
import { ComponentVariant } from "@/types/interfaces";

export const variantContainers: Record<ComponentVariant, string> = {
  small: "p-2 text-sm",
  inline: "p-4 text-base",
  section: "p-12 border rounded-xl my-4",
  page: "min-h-[70vh] flex flex-col justify-center p-6",
};

/**
 * Industry Request
 */
import { IndustryRequestType } from "./enums";

export const INDUSTRY_REQUEST_FIELDS: Record<
  IndustryRequestType,
  readonly string[]
> = {
  [IndustryRequestType.RND]: ["request", "problem_statement", "research_area"],
  [IndustryRequestType.TECH_SUPPORT]: [
    "technology_required",
    "required_duration",
  ],
  [IndustryRequestType.CONSULTANCY]: ["consultancy_type"],
  [IndustryRequestType.TESTING]: ["item_to_test", "test_type"],
  [IndustryRequestType.TRAINING]: [
    "training_type",
    "number_of_trainees",
    "trainee_level",
  ],
  [IndustryRequestType.INTERNSHIP]: [
    "field_of_study",
    "number_of_students",
    "timeframe",
    "activities",
  ],
  [IndustryRequestType.RECRUITMENT]: [
    "field_of_study",
    "graduate_year",
    "requirements",
    "number_to_recruit",
  ],
  [IndustryRequestType.OTHER]: [],
};
