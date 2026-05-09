import { Badge } from "@/components/ui/badge";
import { Entity } from "@/lib/enums";
import { getFullName } from "@/lib/utils";
import { RequestAction } from "@/types/interfaces.actions";
import { IndustryResponse } from "@/types/interfaces.industry";
import { OrgUnitResponse } from "@/types/interfaces.org_units";
import { UserProfile } from "@/types/interfaces.user";
import { Building2, GraduationCap, LucideIcon, User } from "lucide-react";
import React from "react";

type ActionActor = RequestAction["actor_to"] | RequestAction["actor_from"];

const getActorType = (actor: NonNullable<ActionActor>) => {
  if ("username" in actor) return Entity.STAFF;
  if ("industry_type" in actor) return Entity.INDUSTRY;
  if ("unit_type" in actor) return Entity.ACADEMIC_UNIT;

  return Entity.STUDENT;
};

interface ActorConfig {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

const actorConfigMap: Record<Entity, (actor: any) => ActorConfig> = {
  [Entity.INDUSTRY]: (actor: IndustryResponse) => ({
    icon: Building2,
    title: actor.name || actor.contact_full_name,
    subtitle: actor.industry_email || actor.contact_email,
  }),

  [Entity.ACADEMIC_UNIT]: (actor: OrgUnitResponse) => ({
    icon: GraduationCap,
    title: actor.name,
    subtitle: actor.unit_type,
  }),

  [Entity.STAFF]: (actor: UserProfile) => ({
    icon: User,
    title: getFullName(actor),
    subtitle: actor.email,
  }),

  [Entity.STUDENT]: (actor: UserProfile) => ({
    icon: User,
    title: getFullName(actor),
    subtitle: actor.email,
  }),
};

interface ActorBadgeProps {
  actor: NonNullable<ActionActor>;
  direction?: "sent" | "received";
}

const ActionActorToFromDisplay: React.FC<ActorBadgeProps> = ({
  actor,
  direction = "received",
}) => {
  const actorType = getActorType(actor);
  const { icon: Icon, title, subtitle } = actorConfigMap[actorType](actor);

  return (
    <div className="flex items-start gap-1">
      <div className="flex items-start gap-3 min-w-0">
        <Icon className="mt-0.5 size-5 text-muted-foreground shrink-0" />

        <div className="min-w-0">
          <h4 className="font-semibold truncate">{title}</h4>
          <p className="text-muted-foreground text-xs truncate">{subtitle}</p>
        </div>
      </div>

      <Badge variant="outline" className="text-[10px] shrink-0">
        {direction === "received" ? "From" : "To"}
      </Badge>
    </div>
  );
};

export default ActionActorToFromDisplay;
