"use client";

import AdminCard from "@/components/dashboard/reusable/admin-card";
import AdminHeaderTitle from "@/components/dashboard/reusable/admin-header-title";
import { QueryState } from "@/components/dashboard/reusable/query-state-ui";
import { useGetUserDetail } from "@/data/user/user-detail-query";
import {
  AcademicRankLabels,
  AuthorCategoryLabels,
  QualificationLabels,
} from "@/lib/enums";
import { getFullName } from "@/lib/helpers";
import { formatDate } from "@/lib/utils";
import { User } from "@/types/interfaces.user";
import {
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  User as UserIcon,
} from "lucide-react";

type Props = {
  id: string;
};

const UserDetailPage = ({ id }: Props) => {
  const detailQuery = useGetUserDetail(id);

  return (
    <QueryState
      query={detailQuery}
      emptyMessage="This specific user record could not be found."
      loadingMessage="Fetching user details..."
    >
      {(user: User) => {
        const fullName = getFullName(
          user.first_name,
          user.father_name,
          user.grand_father_name,
        );

        return (
          <div className="space-y-8 pb-20">
            <AdminHeaderTitle
              backLink={{
                linkLabel: "Back to Users",
                href: "/dashboard/office/staff",
              }}
            />

            <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
              {/* Core Profile Info */}
              <AdminCard
                title="Personal Information"
                padding="px-3 md:px-6 pt-1"
                className="col-span-2 py-6"
              >
                <>
                  <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 bg-accent/30 mb-8 p-6 border border-border/40 rounded-3xl">
                    <div className="flex items-center gap-4">
                      <div className="bg-background shadow-sm p-3 border border-border/50 rounded-2xl text-orange-500">
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                          FullName
                        </p>
                        <p className="font-bold text-foreground truncate">
                          {fullName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-background shadow-sm p-3 border border-border/50 rounded-2xl text-primary">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                          Academic Unit
                        </p>
                        <p className="font-bold text-foreground">
                          {user.academic_unit?.name || "Unassigned"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                          <Mail size={18} className="text-primary" />
                          Email Address
                        </div>
                        <p className="text-muted-foreground text-sm truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                          <Phone size={18} className="text-primary" />
                          Phone Number
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {user.phone_number || "No phone added"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 md:pl-6 border-border/40 md:border-l">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                          <BookOpen size={18} className="text-primary" />
                          Research Interests
                        </div>
                        <p className="text-muted-foreground text-sm italic leading-relaxed">
                          {user.research_interests || "No interests specified."}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                          <Calendar size={18} className="text-primary" />
                          Joined Date
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {user.created_at
                            ? formatDate(user.created_at)
                            : "N/A"}{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              </AdminCard>

              {/* Task Assigned */}
              <AdminCard
                title="Assignement Status"
                padding="px-3 md:px-6 pt-0"
                className="py-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <GraduationCap size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground leading-tight">
                      {user.author_academic_rank
                        ? AcademicRankLabels[user.author_academic_rank]
                        : "Rank Not Set"}
                    </p>
                    <p className="font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
                      Academic Standing
                    </p>
                  </div>
                </div>

                <div className="space-y-5 pt-5 border-border/60 border-t">
                  <div className="flex items-start gap-3 text-sm">
                    <Building2
                      size={16}
                      className="mt-0.5 text-primary shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-foreground text-xs uppercase tracking-tighter">
                        Academic Unit
                      </p>
                      <p className="text-muted-foreground">
                        {user.academic_unit?.name || "Unassigned"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <Briefcase
                      size={16}
                      className="mt-0.5 text-primary shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-foreground text-xs uppercase tracking-tighter">
                        Qualification
                      </p>
                      <p className="text-muted-foreground">
                        {user.author_qualification
                          ? QualificationLabels[user.author_qualification]
                          : "Not Specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <GraduationCap
                      size={16}
                      className="mt-0.5 text-primary shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-foreground text-xs uppercase tracking-tighter">
                        Author Category
                      </p>
                      <p className="text-muted-foreground">
                        {user.author_category
                          ? AuthorCategoryLabels[user.author_category]
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </AdminCard>

              {/* Academic/Professional Context Card */}
              <AdminCard
                title="Academic Profile"
                padding="px-3 md:px-6 pt-0"
                className="py-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <GraduationCap size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground leading-tight">
                      {user.author_academic_rank
                        ? AcademicRankLabels[user.author_academic_rank]
                        : "Rank Not Set"}
                    </p>
                    <p className="font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
                      Academic Standing
                    </p>
                  </div>
                </div>

                <div className="space-y-5 pt-5 border-border/60 border-t">
                  <div className="flex items-start gap-3 text-sm">
                    <Building2
                      size={16}
                      className="mt-0.5 text-primary shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-foreground text-xs uppercase tracking-tighter">
                        Academic Unit
                      </p>
                      <p className="text-muted-foreground">
                        {user.academic_unit?.name || "Unassigned"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <Briefcase
                      size={16}
                      className="mt-0.5 text-primary shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-foreground text-xs uppercase tracking-tighter">
                        Qualification
                      </p>
                      <p className="text-muted-foreground">
                        {user.author_qualification
                          ? QualificationLabels[user.author_qualification]
                          : "Not Specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <GraduationCap
                      size={16}
                      className="mt-0.5 text-primary shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-foreground text-xs uppercase tracking-tighter">
                        Author Category
                      </p>
                      <p className="text-muted-foreground">
                        {user.author_category
                          ? AuthorCategoryLabels[user.author_category]
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </AdminCard>

              {/* Biography */}
              <AdminCard
                title="Biography"
                className="col-span-2"
                padding="px-3 md:px-8 pt-3"
              >
                <div className="bg-accent/20 p-6 border border-border border-dashed rounded-2xl">
                  <p className="text-muted-foreground text-sm leading-7">
                    {user.biography ||
                      "The user has not provided a biography yet."}
                  </p>
                </div>
              </AdminCard>
            </div>
          </div>
        );
      }}
    </QueryState>
  );
};

export default UserDetailPage;
