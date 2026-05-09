import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { OrgUnitResponse } from "@/types/interfaces.org_units";
import { ChevronDown, Layers } from "lucide-react";

type Props = {
  academic_unit: OrgUnitResponse;
};

const OrgUnitCard = ({ academic_unit }: Props) => {
  const unitHierarchy = [...(academic_unit.ancestors || []), academic_unit];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold text-lg">
          <Layers className="w-5 h-5 text-primary" />
          Academic Unit
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Selected Unit Summary Section */}
        <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
          <div>
            <h3 className="font-semibold text-base tracking-tight">
              {academic_unit.name}
            </h3>
            <p className="text-xs">{academic_unit.total_subnodes} Sub Units</p>
          </div>
          <p className="text-muted-foreground text-sm capitalize">
            {academic_unit.unit_type}
          </p>
        </div>

        <Separator />

        {/* Tree-like Collapsible Hierarchy */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="group flex justify-between items-center hover:bg-muted/50 px-2 py-1.5 rounded-md w-full transition-colors">
            <span className="font-semibold text-muted-foreground text-xs uppercase">
              Unit Hierarchy
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform duration-200" />
          </CollapsibleTrigger>

          <CollapsibleContent className="relative ml-2 py-1 pl-4">
            <div className="space-y-0">
              {unitHierarchy.map((unit, index) => {
                const isSelected = unit.id === academic_unit.id;
                // Calculate indentation: each level is 1rem further in
                const indentation = index * 16;

                return (
                  <div
                    key={unit.id}
                    className="relative flex items-start gap-3 py-2"
                    style={{ paddingLeft: `${indentation}px` }}
                  >
                    {/* The "L" connector for children */}
                    {index > 0 && (
                      <div
                        className="top-0 -left-2 absolute border-muted border-b-2 border-l-2 rounded-bl-lg w-4 h-5"
                        style={{ left: `${indentation - 12}px` }}
                      />
                    )}

                    <div className="z-10 flex flex-col">
                      <span
                        className={`text-sm leading-none ${
                          isSelected
                            ? "font-bold text-primary"
                            : "font-medium text-foreground/80"
                        }`}
                      >
                        {unit.name}
                      </span>
                      <span className="mt-1 text-[10px] text-muted-foreground uppercase tracking-tighter">
                        {unit.unit_type}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="bg-primary mt-1.5 rounded-full w-1.5 h-1.5 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default OrgUnitCard;
