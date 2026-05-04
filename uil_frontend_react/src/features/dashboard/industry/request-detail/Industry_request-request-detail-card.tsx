import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AttachmentView from "@/features/dashboard/industry/request-detail/attachment-view";
import { IndustryRequestDetailResponse } from "@/types/interfaces.industry_requests";
import { Info } from "lucide-react";

type Props = IndustryRequestDetailResponse & {};

const RequestDetailCard = ({
  description,
  detail,
  type,
  attachment,
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold text-lg">
          <Info className="w-5 h-5 text-primary" />
          Request Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <p className="font-semibold text-base">Description</p>
            <p className="bg-muted/50 p-4 rounded-lg text-muted-foreground">
              {description}
            </p>
          </div>

          <Separator />

          {/* Type and Details Section */}
          <div className="space-y-2">
            <p className="font-semibold text-base">Extra Information</p>

            <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
              <div>
                <p className="font-medium">
                  Request Type —{" "}
                  <span className="font-normal capitalize">{type}</span>
                </p>
              </div>
              {detail && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    {Object.entries(detail).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Attachment Section */}
          <AttachmentView attachment={attachment} />
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestDetailCard;
