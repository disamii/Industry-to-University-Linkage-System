"use client";

import AdminCard from "@/components/dashboard/reusable/admin-card";
import AdminHeaderTitle from "@/components/dashboard/reusable/admin-header-title";
import { QueryState } from "@/components/dashboard/reusable/query-state-ui";
import { Badge } from "@/components/ui/badge";
import { recentRequests } from "@/data/dummy-data";
import { useGetIndustryDetail } from "@/data/industry/industry-detail-query";
import { formatDate } from "@/lib/utils";
import { Calendar, Globe, Mail, MapPin, Phone, User } from "lucide-react";
import IndustryRequestsTable from "../industry_requests/IndustryRequestsTable";

type Props = {
  id: string;
};

const IndustryDetailPage = ({ id }: Props) => {
  const detailQuery = useGetIndustryDetail(id);

  return (
    <QueryState
      query={detailQuery}
      emptyMessage="This specific industry record could not be found."
      loadingMessage="Fetching industry details..."
    >
      {(industry) => (
        <div className="space-y-8 pb-20">
          <div className="space-y-2">
            <AdminHeaderTitle
              title={industry.name}
              backLink={{
                linkLabel: "Back to Industries",
                href: "/dashboard/office/partners",
              }}
            />

            <div className="flex flex-wrap items-center gap-3">
              {/* <StatusBadge status={industry.status} /> */}
              {industry.industry_type && (
                <Badge variant="secondary" className="px-3 rounded-full h-6">
                  {industry.industry_type}
                </Badge>
              )}
              {industry.efficiency_level && (
                <Badge className="bg-amber-100 hover:bg-amber-100 px-3 border-amber-200 rounded-full h-6 text-amber-700">
                  {industry.efficiency_level} Efficiency
                </Badge>
              )}
            </div>
          </div>

          <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
            {/* Core Info */}
            <AdminCard
              title="Company Profile"
              padding="px-3 md:px-6 pt-1"
              className="col-span-2 py-6"
            >
              <>
                <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 bg-accent/30 mb-8 p-6 border border-border/40 rounded-3xl">
                  <div className="flex items-center gap-4">
                    <div className="bg-background shadow-sm p-3 border border-border/50 rounded-2xl text-primary">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                        Registered On
                      </p>
                      <p className="font-bold text-foreground">
                        {formatDate(industry.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-background shadow-sm p-3 border border-border/50 rounded-2xl text-blue-500">
                      <Globe size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                        Website
                      </p>
                      {industry.website ? (
                        <a
                          href={industry.website || "#"}
                          target="_blank"
                          className="block max-w-37.5 font-bold text-primary hover:underline truncate"
                        >
                          {industry.website}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">Not provided</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                        <MapPin size={18} className="text-primary" />
                        Location
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {industry.address || "No address provided."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                        <Mail size={18} className="text-primary" />
                        Official Email
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {industry.email}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            </AdminCard>

            {/* Primary Contact Card */}
            <AdminCard
              title="Primary Contact"
              padding="px-3 md:px-6 pt-0"
              className="py-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <User size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">
                    {industry.contact_person || "Not Assigned"}
                  </p>
                  <p className="font-medium text-muted-foreground text-xs uppercase tracking-tighter">
                    Point of Contact
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-border/60 border-t">
                <div className="flex items-center gap-3 text-muted-foreground text-sm">
                  <Phone size={14} className="text-primary" />
                  <span>{industry.phone || "No phone added"}</span>
                </div>
              </div>
            </AdminCard>

            {/* Include search and filters */}
            {/* Recent Requests Card */}
            <AdminCard
              title={`${industry.name} Requests`}
              className="col-span-full bg-transparent border-none"
              padding="px-3 md:px-8 pt-3"
            >
              <IndustryRequestsTable
                query={{
                  isLoading: false,
                  isError: false,
                  data: {
                    items: recentRequests || [],
                    total: 20,
                    page: 10,
                    size: 50,
                    pages: 20,
                  },
                }}
              />
            </AdminCard>
          </div>
        </div>
      )}
    </QueryState>
  );
};

export default IndustryDetailPage;
