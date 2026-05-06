import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

const BackButton = ({ children, className }: Props) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      className={cn(
        "hover:bg-transparent px-0 text-muted-foreground hover:text-foreground",
        className,
      )}
      onClick={() => navigate(-1)}
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
