import RequestActionBadge from "@/components/reusable/request-action-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionType } from "@/lib/enums";
import { formatDate } from "@/lib/utils";
import { RequestAction } from "@/types/interfaces.actions";
import { Calendar, Clock, Logs, StickyNote, Wrench } from "lucide-react";
import RequestActions from "../request-actions";
import {
  formatRevertDescription,
  getActionTypeConfig,
} from "../utils.request-actions";
import ActionActorToFromDisplay from "./action-actor-to-from-display";
import ActionResultedObjectDisplay from "./action-resulted-object-display";

const ActionTimelineList = ({
  action,
  idx,
  actionsCount,
  request,
}: {
  action: RequestAction;
  idx: number;
  actionsCount: number;

  request: { id: number; title: string; description: string };
}) => {
  const config = getActionTypeConfig(action.type);

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

  const renderDescription = () => {
    if (action.type === ActionType.REVERTED) {
      const { actionName, revertedFrom, note } = formatRevertDescription(
        action.description,
      );

      return (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base leading-none">
              {actionName}
            </h3>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-sm">
            {revertedFrom && (
              <div className="flex items-center gap-1.5">
                <span className="font-medium">Original Action:</span>
                <RequestActionBadge
                  type={revertedFrom}
                  className="opacity-80! text-[10px]"
                />
              </div>
            )}

            {note && (
              <div className="flex items-center gap-1.5 text-xs">
                <StickyNote className="w-3 h-3" />
                <span>{note}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Default view for normal actions
    return (
      <h3 className="font-semibold text-base leading-none">
        {action.description}
      </h3>
    );
  };

  return (
    <div className="relative overflow-hidden">
      {/* Timeline connector line */}
      {idx < actionsCount && (
        <div className="top-12 bottom-0 left-5 absolute bg-border/60 w-px" />
      )}

      <div className="top-0 right-0 absolute">
        <RequestActions
          id={action.id}
          title={request.title}
          description={request.description}
          supported_actions={action.supported_actions}
          showViewDetails={false}
          actionToPerform="alter"
        />
      </div>

      <div className="flex gap-6 pr-2 pb-8 transition-all">
        {/* Timeline dot with icon */}
        <div className="z-10 relative shrink-0">
          {config ? (
            <div
              className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center shadow-sm ring-4 ring-background`}
            >
              <config.Icon className="w-5 h-5" />
            </div>
          ) : (
            <Wrench className="w-5 h-5" />
          )}
        </div>

        {/* Content Container */}
        <div className="flex-1 pt-0.5 min-w-0">
          <div className="flex flex-col gap-2">
            <div className="flex-1">{renderDescription()}</div>

            {/* Action Badge */}
            <div className="flex items-center gap-3">
              <RequestActionBadge type={action.type} />

              <time className="flex gap-1 tabular-nums text-muted-foreground text-xs item-center">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(action.created_at)}
              </time>
            </div>

            {/* Action Details */}
            {currentDetailConfig && (
              <div className="space-y-2 bg-muted/50 mt-2 p-3 rounded-lg w-full">
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
  );
};

type Props = {
  actions: RequestAction[];
  request: { id: number; title: string; description: string };
};

const ActionTimeline = ({ actions, request }: Props) => {
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
              .map((action, index) => (
                <ActionTimelineList
                  key={`${action.id} — ${index}`}
                  action={action}
                  idx={index}
                  actionsCount={actions.length}
                  request={request}
                />
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionTimeline;
