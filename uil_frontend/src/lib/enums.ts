export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  INDUSTRY = "industry",
}

export enum RequestStatus {
  PENDING = "PENDING",
  IN_REVIEW = "IN_REVIEW",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export const requestStatusOptions = Object.values(RequestStatus);

export enum RequestPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export const requestPriorityOptions = Object.values(RequestPriority);

export enum RequestType {
  TECHNICAL_SUPPORT = "technical_support",
  RESEARCH_COLLABORATION = "research_collaboration",
  WORKSHOP = "workshop",
  SEMINAR = "seminar",
  EMPLOYEE_TRAINING = "employee_training",
  INTERNSHIP = "internship",
  MAINTENANCE = "maintenance",
  OTHER = "other",
}

export const requestTypeOptions = Object.values(RequestType);
