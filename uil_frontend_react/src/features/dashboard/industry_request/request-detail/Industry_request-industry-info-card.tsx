import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IndustryRequestDetailResponse } from "@/types/interfaces.industry_requests";
import { Building2, User } from "lucide-react";

type Props = {
  industry: IndustryRequestDetailResponse["industry"];
};

const IndustryInfoCard = ({ industry }: Props) => {
  if (!industry) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold text-lg">
          <Building2 className="w-5 h-5 text-primary" />
          Industry Information
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="flex gap-2 space-y-2 item-center">
            <p className="font-semibold text-xl">{industry.name}</p>
            <Badge variant="outline" className="capitalize">
              {industry.industry_type}
            </Badge>
          </div>

          <Separator />

          <div className="gap-6 grid grid-cols-2">
            {/* Contact + Core Info */}
            <div className="space-y-2">
              <p className="font-semibold text-base">Industry Details</p>

              <div className="space-y-3 bg-muted/50 p-4 rounded-lg text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{industry.industry_email}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{industry.phone_number}</span>
                </div>

                {industry.website && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Website</span>
                    <a
                      href={industry.website}
                      target="_blank"
                      className="text-primary underline"
                    >
                      Visit
                    </a>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employees</span>
                  <span>{industry.number_of_employees}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span>{industry.location}</span>
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div className="space-y-2">
              <p className="font-semibold text-base">Contact Person</p>

              <div className="space-y-3 bg-muted/50 p-4 rounded-lg text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span>{industry.contact_full_name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{industry.contact_email}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{industry.contact_person_phone_number}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustryInfoCard;
