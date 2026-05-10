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
} as const;

export const getEntityFormConfig = (val: Entity) => {
  return ENTITY_FORM_CONFIG[val];
};
