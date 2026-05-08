import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ActionType } from "@/lib/enums";
import { formatDate, formatType } from "@/lib/utils";
import { RequestAction } from "@/types/interfaces.actions";
import { Calendar, Clock, Logs } from "lucide-react";
import { ACTION_CONFIG } from "../utils.industry_request-actions";
import ActionActorToFromDisplay from "./action-actor-to-from-display";
import ActionResultedObjectDisplay from "./action-resulted-object-display";

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
                const detailConfig: Partial<
                  Record<
                    ActionType,
                    {
                      from?: RequestAction["actor_from"];
                      to?: RequestAction["actor_to"];
                      result?: RequestAction["resulted_object"];
                    }
                  >
                > = {
                  [ActionType.FORWARDED]: { to: action.actor_to },
                  [ActionType.REPLIED]: {
                    from: action.actor_from,
                    to: action.actor_to,
                  },
                  [ActionType.POSTED_AS_THEMATIC]: {
                    result: action.resulted_object,
                  },
                  [ActionType.ASSIGNED]: { result: action.resulted_object },
                };
                const currentDetailConfig = detailConfig[action.type];

                return (
                  <Dialog key={action.id}>
                    <DialogTrigger asChild>
                      <div className="group relative">
                        {/* Timeline connector line */}
                        {index < actions.length - 1 && (
                          <div className="top-12 bottom-0 left-5 absolute bg-border/60 w-px" />
                        )}

                        <div className="flex gap-6 pr-2 pb-8 transition-all">
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
                                  {formatType(action.type)}
                                </Badge>

                                <time className="flex gap-1 tabular-nums text-muted-foreground text-xs item-center">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {formatDate(action.created_at)}
                                </time>
                              </div>

                              {/* Action Details */}
                              {currentDetailConfig && (
                                <div className="space-y-2 bg-muted/50 mt-2 p-3 rounded-lg">
                                  {currentDetailConfig.from && (
                                    <ActionActorToFromDisplay
                                      actor={currentDetailConfig.from}
                                      direction="received"
                                    />
                                  )}

                                  {currentDetailConfig.to && (
                                    <ActionActorToFromDisplay
                                      actor={currentDetailConfig.to}
                                      direction="sent"
                                    />
                                  )}

                                  {currentDetailConfig.result && (
                                    <ActionResultedObjectDisplay
                                      result={currentDetailConfig.result}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                  </Dialog>
                );
              })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionTimeline;
