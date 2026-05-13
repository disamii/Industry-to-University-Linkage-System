import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  IndustryDetailResponse,
  IndustryResponse,
} from "@/types/interfaces.industry";
import { Building2 } from "lucide-react";

type Props = {
  industry: IndustryDetailResponse | IndustryResponse;
};

const IndustryInfoCard = ({ industry }: Props) => {
  const {
    industry_email,
    phone_number,
    website,
    number_of_employees,
    location,
    address,
    contact_full_name,
    contact_email,
    contact_person_phone_number,
  } = industry;

  const industryDetails = [
    { label: "Email", value: industry_email },
    { label: "Phone", value: phone_number },
    { label: "Website", value: "Visit", href: website },
    { label: "Employees", value: number_of_employees },
    { label: "City/Woreda", value: `${location}` },
    { label: "Physical Address", value: `${address}` },
  ].filter((item) => item.value);

  const contactPersonDetails = [
    { label: "Name", value: contact_full_name },
    { label: "Email", value: contact_email },
    { label: "Phone", value: contact_person_phone_number },
  ].filter((item) => item.value);

  const renderItems = (
    item: {
      label: string;
      value?: string | null | number;
      href?: string | null;
    },
    idx: number,
  ) => {
    return (
      <div
        key={`${item.value}—${idx}`}
        className="grid grid-cols-[8rem_1fr] overflow-hidden"
      >
        <span className="text-muted-foreground">{item.label}</span>
        {item.href ? (
          <a
            href={item.href}
            target="_blank"
            className="justify-self-end text-primary underline"
          >
            {item.value}
          </a>
        ) : (
          <span className="justify-self-end">{item.value}</span>
        )}
      </div>
    );
  };

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
                {industryDetails.map(renderItems)}
              </div>
            </div>

            {/* Contact Person */}
            <div className="space-y-2">
              <p className="font-semibold text-base">Contact Person</p>

              <div className="space-y-3 bg-muted/50 p-4 rounded-lg text-sm">
                {contactPersonDetails.map(renderItems)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustryInfoCard;
