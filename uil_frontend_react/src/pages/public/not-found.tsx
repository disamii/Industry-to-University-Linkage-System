import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useNavigateHome } from "@/hooks/use-navigate-home";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const to = useNavigateHome();

  return (
    <div className="flex justify-center items-center bg-background p-4 w-full min-h-screen">
      <Card className="border-dashed w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-muted p-3 rounded-full">
              <FileSearch className="w-10 h-10 text-muted-foreground" />
            </div>
          </div>

          <CardTitle className="font-bold text-3xl tracking-tight">
            404
          </CardTitle>
          <CardHeader className="p-0 font-semibold text-xl">
            Page Not Found
          </CardHeader>
          <CardDescription className="mt-2 text-slate-500">
            Oops! The page you're looking for doesn't exist or has been moved.
            Check the URL or head back home.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full h-10">
            <Link to={to}>Return to Homepage</Link>
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="w-full h-10"
          >
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
