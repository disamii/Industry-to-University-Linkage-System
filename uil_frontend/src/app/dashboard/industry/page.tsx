"use client";

import AdminCard from "@/components/dashboard/reusable/admin-card";
import AdminHeaderTitle from "@/components/dashboard/reusable/admin-header-title";
import { StatusBadge } from "@/components/dashboard/reusable/badges";
import { StatCard } from "@/components/dashboard/reusable/stat-card";
import { notifications, recentRequests, stats } from "@/data/dummy-data";
import { formatDate } from "@/lib/utils";
import { BellRing, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

export default function IndustryDashboard() {
  return (
    <>
      <AdminHeaderTitle
        title="Dashboard"
        desc="Welcome back! Here's your collaboration overview."
        links={{
          href: "/dashboard/industry/requests/create",
          Icon: Plus,
          linkLabel: "Submit New Request",
        }}
      />

      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <StatCard key={`${stat.title}—${idx}`} {...stat} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
        <AdminCard
          title="Recent Requests"
          link={{ label: "View all", href: "/dashboard/industry/requests" }}
        >
          {recentRequests.map((request) => (
            <Link
              key={request.id}
              href={`/dashboard/industry/requests/${request.id}`}
              className="group flex justify-between items-center bg-accent/30 hover:bg-accent/60 p-4 border border-transparent hover:border-border/60 rounded-3xl transition-all"
            >
              <div className="flex-1">
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {request.title}
                </h3>
                <p className="mt-1 text-muted-foreground text-xs">
                  {formatDate(request.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={request.status} />
                <ChevronRight
                  size={16}
                  className="text-muted-foreground transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </AdminCard>

        <AdminCard title={{ label: "Notifications", Icon: BellRing }}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-accent/30 p-5 border border-transparent hover:border-border/40 rounded-3xl transition-colors"
            >
              <p className="font-semibold text-foreground text-sm leading-snug">
                {notification.message}
              </p>
              <div className="flex items-center gap-2 mt-3 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                <div className="bg-primary rounded-full w-1.5 h-1.5 animate-pulse" />
                {notification.time}
              </div>
            </div>
          ))}
        </AdminCard>
      </div>
    </>
  );
}
