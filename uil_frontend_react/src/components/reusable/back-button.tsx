import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

const BackButton = ({ children, className }: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onBack = () => {
    const segments = pathname.split("/").filter(Boolean);

    // already at root
    if (segments.length === 0) {
      navigate("/");
      return;
    }

    // remove last segment
    const parentPath = "/" + segments.slice(0, -1).join("/");

    navigate(parentPath || "/");
  };

  return (
    <Button
      variant="ghost"
      className={cn(
        "hover:bg-transparent px-0 text-muted-foreground hover:text-foreground",
        className,
      )}
      onClick={onBack}
    >
      {children ? (
        children
      ) : (
        <>
          <ArrowLeft />
          Go Back
        </>
      )}
    </Button>
  );
};

export default BackButton;
