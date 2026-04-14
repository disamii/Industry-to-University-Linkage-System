"use client";

import { ActivityTimeline } from "@/components/dashboard/reusable/activity-timeline";
import AdminCard from "@/components/dashboard/reusable/admin-card";
import AdminHeaderTitle from "@/components/dashboard/reusable/admin-header-title";
import {
  DefaultBadge,
  PriorityBadge,
  StatusBadge,
} from "@/components/dashboard/reusable/badges";
import { QueryState } from "@/components/dashboard/reusable/query-state-ui";
import { timeline } from "@/data/dummy-data";
import { useGetIndustryRequestDetailForAdmin } from "@/data/industry_requests/industry_request-detail-query-for-admin";
import { RequestStatus } from "@/lib/enums";
import { cn, formatDate } from "@/lib/utils";
import { IndustryRequestResponseForAdmin } from "@/types/interfaces.industry_requests";
import {
  Building2,
  Calendar,
  ChartNoAxesGantt,
  DollarSign,
  FileText,
  Globe,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";
import { AssignStaffDialog } from "../assignment/assign-staff-dialog";

const ASSIGN_LABELS: Partial<Record<RequestStatus, string>> = {
  [RequestStatus.PENDING]: "Assign",
  [RequestStatus.IN_REVIEW]: "Assign",
  [RequestStatus.ASSIGNED]: "ReAssign",
};

type Props = {
  id: string;
};

const IndustryRequestDetailPageForAdmin = ({ id }: Props) => {
  const detailQuery = useGetIndustryRequestDetailForAdmin(id);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const onChangeStatus = () => {};

  return (
    <QueryState<IndustryRequestResponseForAdmin>
      query={detailQuery}
      emptyMessage="This specific request could not be found."
      loadingMessage="Analyzing industry data..."
    >
      {(request) => {
        const { industry } = request;
        const requestStatus = request.status;

        const label = ASSIGN_LABELS[requestStatus];
        const isAssigned = requestStatus === RequestStatus.ASSIGNED;

        const headerLinks = [
          ...(label
            ? [
                {
                  onClick: () => setAssignDialogOpen(true),
                  Icon: User,
                  linkLabel: `${label} Expert`,
                },
              ]
            : []),
          ...(!isAssigned
            ? [
                {
                  onClick: onChangeStatus,
                  Icon: ChartNoAxesGantt,
                  linkLabel: "Change Status",
                  variant: "secondary" as const,
                },
              ]
            : []),
        ];

        return (
          <div className="space-y-8">
            {/* 1. HEADER SECTION */}
            <div className="space-y-4">
              <AdminHeaderTitle
                title={request.title}
                backLink={{ linkLabel: "Back to My Requests" }}
                links={headerLinks}
              />
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={request.status} />
                <PriorityBadge priority={request.priority} />
                <DefaultBadge value={request.type.split("_").join(" ")} />
              </div>
            </div>

            <AssignStaffDialog
              open={assignDialogOpen}
              onOpenChange={setAssignDialogOpen}
              requestInfo={request}
              actionButtonLabel={label || ""}
            />

            {/* 2. TOP SECTION: REQUEST OVERVIEW (PRIMARY) */}
            <AdminCard
              title="Request Overview"
              padding="px-3 md:px-6 pt-1"
              className="py-6"
            >
              <div className="gap-6 grid grid-cols-1 md:grid-cols-3 bg-accent/30 mb-8 p-6 border border-border/40 rounded-3xl">
                <div className="flex items-center gap-4">
                  <div className="bg-background shadow-sm p-3 border border-border/50 rounded-2xl text-primary">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                      Submission Date
                    </p>
                    <p className="font-bold">
                      {formatDate(request.created_at, { includeTime: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-background shadow-sm p-3 border border-border/50 rounded-2xl text-emerald-500">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                      Est. Budget
                    </p>
                    <p className="font-bold">{request.budget_required}</p>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-4 pl-6 border-border/40 border-l",
                    !isAssigned && "bg-destructive/10 rounded-xl",
                  )}
                >
                  <div className="bg-background shadow-sm p-3 border border-border/50 rounded-2xl text-orange-500">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                      Assigned Expert
                    </p>
                    <p
                      className={cn(
                        "font-bold text-sm",
                        !isAssigned && "text-destructive",
                      )}
                    >
                      {!isAssigned ? "Not Assigned yet" : "Sisay Kewiti"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                  <FileText size={18} className="text-primary" />
                  Description
                </div>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  {request.description}
                </p>
              </div>
            </AdminCard>

            {/* 3. SIDE-BY-SIDE SECTION: COMPANY PROFILE & ACTIVITY HISTORY */}
            <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
              {/* Company & Contact Details */}
              <AdminCard
                title="Company Profile & Primary Contact"
                padding="px-3 md:px-6 pt-1"
                className="py-6 h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <Building2 size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{industry?.name}</h4>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Globe size={12} />
                      <span className="max-w-37.5 truncate">
                        {industry?.website || "No Website"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="gap-4 grid grid-cols-1 bg-accent/20 p-4 border border-border/30 rounded-2xl">
                    <div className="space-y-1">
                      <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-tighter">
                        Location
                      </p>
                      <p className="font-medium text-sm">
                        {industry?.address || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-tighter">
                        Official Email
                      </p>
                      <p className="font-medium text-sm">{industry?.email}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-border/40 border-t">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">
                          {industry?.contact_person || "Not Assigned"}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase">
                          Point of Contact
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3 pl-11 text-muted-foreground text-sm">
                      <Phone size={14} className="text-primary" />
                      <span>{industry?.phone || "No phone added"}</span>
                    </div>
                  </div>
                </div>
              </AdminCard>

              {/* Activity History */}
              <AdminCard
                title="Activity History"
                padding="px-3 md:px-6 pt-2"
                className="py-6 h-full"
              >
                <div className="pr-2 max-h-100 overflow-y-auto custom-scrollbar">
                  <ActivityTimeline items={timeline} />
                </div>
              </AdminCard>
            </div>
          </div>
        );
      }}
    </QueryState>
  );
};

export default IndustryRequestDetailPageForAdmin;
