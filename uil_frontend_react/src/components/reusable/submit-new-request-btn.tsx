import { LucideIcon, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

type Props = {
  Icon?: LucideIcon;
  to: string;
  label?: string;
};

const SubmitNewRequestBtn = ({
  Icon = Plus,
  to,
  label = "Submit New Request",
}: Props) => {
  return (
    <Button asChild size="lg" className="gap-3 text-base">
      <Link to={to}>
        <Icon className="size-4" />
        {label}
      </Link>
    </Button>
  );
};

export default SubmitNewRequestBtn;
