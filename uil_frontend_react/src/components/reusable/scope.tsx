import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AcademicScope } from "@/types/interfaces";

interface Props {
  scope?: AcademicScope;
  className?: string;
  type?: "titled" | "regular";
}

const Scope = ({ scope, className = "", type = "titled" }: Props) => {
  if (!scope?.academic_units?.length) {
    return (
      <Badge variant="secondary" className={className}>
        Global Access
      </Badge>
    );
  }

  const Scope = () => (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <TooltipProvider>
        {scope.academic_units.map((unit) => (
          <Tooltip key={unit.id}>
            <TooltipTrigger asChild>
              <Badge className="cursor-pointer">{unit.name}</Badge>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              You have privilege in {unit.name}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );

  if (type === "titled")
    return (
      <div className="flex items-center gap-2 mt-1 px-4 py-1 border border-primary rounded-full">
        <span className="text-xs">Scope:</span>
        <Scope />
      </div>
    );

  return <Scope />;
};

export default Scope;
