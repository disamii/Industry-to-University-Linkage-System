"use client";

import { ActivityTimeline } from "@/components/dashboard/reusable/activity-timeline";
import AdminCard from "@/components/dashboard/reusable/admin-card";
import AdminHeaderTitle from "@/components/dashboard/reusable/admin-header-title";
import {
  PriorityBadge,
  StatusBadge,
} from "@/components/dashboard/reusable/badges";
import { QueryState } from "@/components/dashboard/reusable/query-state-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { timeline } from "@/data/dummy-data";
import { useGetIndustryRequestDetail } from "@/data/industry_requests/industry_request-detail-query";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  DollarSign,
  FileText,
  HelpCircle,
  Pencil,
  User,
} from "lucide-react";

type Props = {
  id: string;
};

const RequestDetailPage = ({ id }: Props) => {
  const detailQuery = useGetIndustryRequestDetail(id);

  return (
    <QueryState
      query={detailQuery}
      emptyMessage="This specific request could not be found."
      loadingMessage="Analyzing industry data..."
    >
      {(request) => (
        <div className="space-y-8 pb-20">
          <div className="space-y-2">
            <AdminHeaderTitle
              title={request.title}
              backLink={{
                linkLabel: "Back to My Requests",
                // href: "/dashboard/industry/requests",
              }}
              links={{
                href: `${request.id}/edit`,
                Icon: Pencil,
                linkLabel: "Edit Request",
              }}
            />

            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={request.status} />
              <PriorityBadge priority={request.priority} />
              <Badge variant="secondary" className="px-3 rounded-full h-6">
                {request.type}
              </Badge>
            </div>
          </div>

          <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
            {/* Left Column: Details & Content */}
            <div className="space-y-8 lg:col-span-2">
              <AdminCard
                title="Request Overview"
                padding="px-3 md:px-6 pt-1"
                className="py-6"
              >
                <>
                  <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 bg-accent/30 p-6 border border-border/40 rounded-3xl">
                    <div className="flex items-center gap-4">
                      <div className="bg-background shadow-sm p-3 border border-border/50 rounded-2xl text-primary">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                          Submission Date
                        </p>
                        <p className="font-bold text-foreground">
                          {formatDate(request.created_at, {
                            includeTime: true,
                          })}
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
                        <p className="font-bold text-foreground">
                          {request.budget_required}
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
                </>
              </AdminCard>

              {/* Activity Timeline Card */}
              <AdminCard
                title="Activity History"
                padding="px-3 md:px-6 pt-2"
                className="py-6"
              >
                <ActivityTimeline items={timeline} />
              </AdminCard>
            </div>

            {/* Right Column: Sidebar */}
            <div className="space-y-8">
              {/* Assignment Card */}
              <AdminCard
                title="Assigned Expert"
                padding="px-3 md:px-6 pt-0 "
                className="py-6"
              >
                <div className="flex items-center gap-4">
                  <User size={28} className="text-primary" />
                  <div>
                    <p className="font-bold text-foreground">
                      {"Sisay Kewiti"}
                    </p>
                    <p className="font-medium text-muted-foreground text-xs">
                      {"Computer Engineering"}
                    </p>
                  </div>
                </div>

                <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                  Direct Contact: {"siisaykewiti@gmail.com"}
                </p>
              </AdminCard>

              {/* Help/Support Box */}
              <div className="space-y-4 bg-slate-900 shadow-xl p-8 rounded-[2.5rem] text-white">
                <div className="flex justify-center items-center bg-white/10 rounded-xl w-10 h-10">
                  <HelpCircle size={20} className="text-white" />
                </div>
                <h3 className="font-bold text-lg">Need clarification?</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  If you have questions regarding the assignment or current
                  progress, our Linkage Office is here to assist you.
                </p>
                <Button className="bg-white hover:bg-slate-200 rounded-xl w-full h-11 font-bold text-slate-900">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </QueryState>
  );
};

export default RequestDetailPage;
