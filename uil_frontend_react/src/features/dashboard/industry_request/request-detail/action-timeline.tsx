import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { RequestAction } from "@/types/interfaces.actions";
import { Calendar, Clock, Logs } from "lucide-react";
import ActionTimelineDetailDialog from "./action-timeline-detail-dialog";
import { ACTION_CONFIG } from "../utils.industry_request-actions";

type Props = {
  actions: RequestAction[];
};

const ActionTimeline = ({ actions }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold text-lg">
          <Logs className="w-5 h-5 text-primary" />
          Activity Log
        </CardTitle>
      </CardHeader>

      <CardContent>
        {actions.length === 0 ? (
          <div className="py-12 text-center">
            <Clock className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">No actions yet</p>
          </div>
        ) : (
          <div>
            {actions
              .slice()
              .reverse()
              .map((action, index) => {
                const { Icon, color } = ACTION_CONFIG[action.type];

                return (
                  <Dialog key={action.id}>
                    <DialogTrigger asChild>
                      <div className="group relative outline-none cursor-pointer">
                        {/* Timeline connector line */}
                        {index < actions.length - 1 && (
                          <div className="top-12 bottom-0 left-5 absolute bg-border/60 w-px" />
                        )}

                        <div className="flex gap-6 pr-2 pb-8 transition-transform group-hover:translate-x-3 duration-300 ease-out">
                          {/* Timeline dot with icon */}
                          <div className="z-10 relative shrink-0">
                            <div
                              className={`w-10 h-10 rounded-full ${color} flex items-center justify-center shadow-sm ring-4 ring-background`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                          </div>

                          {/* Content Container */}
                          <div className="flex-1 pt-0.5 min-w-0">
                            <div className="flex flex-col gap-2">
                              {/* Header: Action + Time */}
                              <h3 className="font-semibold text-base leading-none">
                                {action.description}
                              </h3>

                              {/* Action Badge */}
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant="secondary"
                                  className={`capitalize text-[10px] font-bold px-2 py-0 h-5 leading-none ${color}`}
                                >
                                  {action.type.replace(/_/g, " ")}
                                </Badge>

                                <time className="flex gap-1 tabular-nums text-muted-foreground text-xs item-center">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {formatDate(action.created_at)}
                                </time>
                              </div>

                              {/* Details Grid: Styled as a subtle "card" section */}
                              <div className="gap-x-4 gap-y-1.5 grid grid-cols-1 sm:grid-cols-2 bg-muted/50 mt-2 p-3 rounded-lg text-xs">
                                {action.performed_by && (
                                  <DetailItem
                                    label="By"
                                    value={action.performed_by}
                                  />
                                )}
                                {action.from_industry && (
                                  <DetailItem
                                    label="From"
                                    value={action.from_industry}
                                  />
                                )}
                                {action.to_industry && (
                                  <DetailItem
                                    label="To"
                                    value={action.to_industry}
                                  />
                                )}
                                {action.from_unit && (
                                  <DetailItem
                                    label="From Unit"
                                    value={action.from_unit}
                                  />
                                )}
                                {action.to_unit && (
                                  <DetailItem
                                    label="To Unit"
                                    value={action.to_unit}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>

                    {/* The wider setup component */}
                    <ActionTimelineDetailDialog action={action} />
                  </Dialog>
                );
              })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <span className="shrink-0">{label}:</span>
      <span className="text-muted-foreground truncate">{value}</span>
    </div>
  );
}

export default ActionTimeline;
