import {
  Entity,
  IndustryRequestType,
  OfficeRequestType,
  StaffRequestType,
} from "@/lib/enums";
import {
  INDUSTRY_REQUEST_HINTS,
  OFFICE_REQUEST_HINTS,
  STAFF_REQUEST_HINTS,
} from "@/lib/mappings";
import {
  industryRequestCreateSchema,
  industryRequestUpdateSchema,
  officeRequestCreateSchema,
  officeRequestUpdateSchema,
  staffRequestCreateSchema,
  staffRequestUpdateSchema,
} from "@/validation/validation.requests";
import type { ZodSchema } from "zod";

type SchemaConfig = {
  create: ZodSchema;
  update: ZodSchema;
};

type EntityFormConfig = {
  schema: SchemaConfig;
  hints: Record<string, unknown>;
  types: Record<string, string>;
};

const ENTITY_FORM_CONFIG = {
  [Entity.INDUSTRY]: {
    schema: {
      create: industryRequestCreateSchema,
      update: industryRequestUpdateSchema,
    },
    hints: INDUSTRY_REQUEST_HINTS,
    types: IndustryRequestType,
  },
  [Entity.ACADEMIC_UNIT]: {
    schema: {
      create: officeRequestCreateSchema,
      update: officeRequestUpdateSchema,
    },
    hints: OFFICE_REQUEST_HINTS,
    types: OfficeRequestType,
  },
  [Entity.STAFF]: {
    schema: {
      create: staffRequestCreateSchema,
      update: staffRequestUpdateSchema,
    },
    hints: STAFF_REQUEST_HINTS,
    types: StaffRequestType,
  },
} satisfies Record<Exclude<Entity, Entity.STUDENT>, EntityFormConfig>;

export type SupportedEntity = keyof typeof ENTITY_FORM_CONFIG;

export const getEntityFormConfig = <T extends SupportedEntity>(
  val: T,
): (typeof ENTITY_FORM_CONFIG)[T] => {
  return ENTITY_FORM_CONFIG[val];
};
