import { cn } from "@/lib/utils";
import { useState } from "react";

const ExpandableText = ({
  text,
  maxLength = 180,
  className,
}: {
  text: string;
  maxLength?: number;
  className?: string;
}) => {
  const [expanded, setExpanded] = useState(false);

  const shouldTruncate = text.length > maxLength;

  const displayText =
    expanded || !shouldTruncate ? text : `${text.slice(0, maxLength)}...`;

  return (
    <div className={cn("", className)}>
      {displayText}

      {shouldTruncate && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="ml-2 font-medium text-primary text-sm hover:underline whitespace-nowrap"
        >
          {expanded ? "show less" : "show more"}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
