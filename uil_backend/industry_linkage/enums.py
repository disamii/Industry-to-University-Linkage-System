from django.db import models


class RequestingEntity(models.TextChoices):
    INDUSTRY = "industry", "Industry"
    ACADEMIC_UNIT = "academic_unit", "Academic Unit"
    STAFF = "staff", "Staff"
    STUDENT = "student", "Student"


class RequestType(models.TextChoices):
    # industry requests
    RND = "rnd", "Research & Development Services"
    TECH_SUPPORT = "tech_support", "Technology Support"
    CONSULTANCY = "consultancy", "Consultancy"
    TESTING = "testing", "Testing & QA"
    TRAINING = "training", "Training"
    INTERNSHIP = "internship", "Internship/Externship"
    RECRUITMENT = "recruitment", "Graduate Recruitment"

    # university requests
    CURRICULUM_REVIEW = "curriculum_review", "Curriculum Review"
    INDUSTRIAL_VISIT = "industrial_visit", "Industrial Visit"
    JOINT_RESEARCH = "joint_research", "Joint Research"
    GUEST_LECTURE = "guest_lecture", "Guest Lecturing"
    LAB_ACCESS = "lab_access", "Equipment / Lab Access"
    TECH_TRANSFER = "tech_transfer", "IP / Technology Transfer"
    WORKSHOP_CALL = "workshop_call", "Workshop Call"
    CONFERENCE_CALL = "conference_call", "Conference Call"
    EXHIBITION_CALL = "exhibition_call", "Exhibition Call"
    JOINT_COMMUNITY_ENGAGEMENT = "joint_community_engagement", "Joint Community Engagement"
    OTHER = "other", "Other"


class ActionTypes(models.TextChoices):
    INITIATED = "initiated", "Initiated"
    ASSIGNED = "assigned", "Assigned"
    FORWARDED = "forwarded", "Forwarded"
    POSTED_AS_THEMATIC = "posted_as_thematic", "Posted as Thematic Call"
    REJECTED = "rejected", "Rejected"
    COMPLETED = "completed", "Completed"
    CANCELLED = "cancelled", "Cancelled"
    ACCEPT_FORWARDED = "accept_forwarded", "Accept Forwarded"
    REPLIED = "replied", "Replied"
    REVERTED = "reverted", "Reverted"


class AssignmentStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    ACCEPTED = "accepted", "Accepted"
    REJECTED = "rejected", "Rejected"
    IN_PROGRESS = "in_progress", "In Progress"
    COMPLETED = "completed", "Completed"
    CANCELLED = "cancelled", "Cancelled"


ENTITY_MAP = {
    RequestingEntity.STAFF: {
        "app": "auth",
        "model": "user",
    },
    RequestingEntity.STUDENT: {
        "app": "auth",
        "model": "user",
    },
    RequestingEntity.INDUSTRY: {
        "app": "industry_linkage",
        "model": "industry",
    },
    RequestingEntity.ACADEMIC_UNIT: {
        "app": "organizational_structure",
        "model": "organizationalunit",
    },
}


ACTION_TRANSITIONS = {
    ActionTypes.INITIATED: [],

    ActionTypes.FORWARDED: [
        ActionTypes.ACCEPT_FORWARDED,
        ActionTypes.REJECTED,
    ],

    ActionTypes.ACCEPT_FORWARDED: [
        ActionTypes.REVERTED,
    ],

    ActionTypes.ASSIGNED: [
        ActionTypes.REVERTED,
    ],


    ActionTypes.POSTED_AS_THEMATIC: [
        ActionTypes.REVERTED,
    ],


    ActionTypes.REJECTED: [
        ActionTypes.REVERTED,
    ],

    ActionTypes.COMPLETED: [
        ActionTypes.REVERTED,
    ],

    ActionTypes.CANCELLED: [
        ActionTypes.REVERTED,
    ],

    ActionTypes.REPLIED: [
        ActionTypes.REPLIED,
        ActionTypes.REVERTED,
    ],

    ActionTypes.REVERTED: [],  
}



ACTION_TRANSITIONS = {
    ActionTypes.INITIATED: [],

    ActionTypes.FORWARDED: [
        ActionTypes.ACCEPT_FORWARDED,
        ActionTypes.REJECTED,
    ],

    ActionTypes.ACCEPT_FORWARDED: [
        ActionTypes.REVERTED,
    ],

    ActionTypes.ASSIGNED: [
        ActionTypes.REVERTED,
    ],



    ActionTypes.POSTED_AS_THEMATIC: [
        ActionTypes.REVERTED,
    ],


    ActionTypes.REJECTED: [
        ActionTypes.REVERTED,
    ],

    ActionTypes.COMPLETED: [
        ActionTypes.REVERTED,
    ],

    ActionTypes.CANCELLED: [
        ActionTypes.REVERTED,
    ],

    ActionTypes.REPLIED: [
        ActionTypes.REPLIED,
        ActionTypes.REVERTED,
    ],

    ActionTypes.REVERTED: [],  
}