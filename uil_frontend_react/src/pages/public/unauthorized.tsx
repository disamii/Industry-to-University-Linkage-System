import { ShieldAlert } from "lucide-react"; // Optional icon for flair
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LINKS } from "@/lib/constants";
import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="flex justify-center items-center bg-background w-full min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-destructive/10 p-3 rounded-full">
              <ShieldAlert className="w-10 h-10 text-destructive" />
            </div>
          </div>

          <CardTitle className="font-bold text-2xl tracking-tight">
            Access Denied
          </CardTitle>
          <CardDescription className="mt-2 text-slate-500">
            You don't have the required permissions to access this resource.
            Please contact your administrator if you believe this is an error.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="h-10">
            <Link to="/">Return to Hompage</Link>
          </Button>
          <Button variant="secondary" asChild className="h-10">
            <Link to={LINKS.signin}>Login with a different account</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
