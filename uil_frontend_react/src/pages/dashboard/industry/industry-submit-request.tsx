import { Button } from "@/components/ui/button";
import CreateEditIndustryRequestsForm from "@/features/dashboard/industry/create-edit-industry_request-form";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const IndustrySubmitRequest = () => {
  return (
    <div className="space-y-3">
      <Button
        asChild
        variant="ghost"
        className="hover:bg-transparent px-0 text-muted-foreground hover:text-foreground"
      >
        <Link to="/dashboard/industry">
          <ArrowLeft />
          Back to Dashboard
        </Link>
      </Button>

      <div className="space-y-1 mb-8">
        <h1 className="font-bold text-3xl">Submit New Request</h1>
        <p className="text-muted-foreground">
          Complete the details below to initiate a new request
        </p>
      </div>

      <CreateEditIndustryRequestsForm />
    </div>
  );
};

export default IndustrySubmitRequest;
