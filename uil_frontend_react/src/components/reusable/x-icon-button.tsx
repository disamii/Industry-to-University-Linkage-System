import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";

type Props = {
  onRemove: (e?: React.MouseEvent) => void;
  className?: string;
};

const XIconButton = ({ onRemove, className }: Props) => {
  return (
    <button
      type="button"
      onClick={onRemove}
      className={cn(
        "bg-destructive/10 hover:bg-destructive p-1.5 rounded-full text-destructive hover:text-foreground transition-colors",
        className,
      )}
      aria-label="Remove file"
    >
      <XIcon className="w-4 h-4" />
    </button>
  );
};

export default XIconButton;
