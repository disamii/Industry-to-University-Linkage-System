import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

type Props = {
  to: string;
};

const SubmitNewRequestBtn = ({ to }: Props) => {
  return (
    <Button asChild size="lg" className="gap-3 text-base">
      <Link to={to}>
        <Plus className="size-4" />
        Submit New Request
      </Link>
    </Button>
  );
};

export default SubmitNewRequestBtn;
