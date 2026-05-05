import { AcademicScope } from "@/types/interfaces";
import BackButton from "./back-button";
import Scope from "./scope";

type Props = {
  title: string;
  desc?: string;
  hasBackBtn?: boolean;
  scope?: AcademicScope;
};

const DashboardContentHeader = ({
  title,
  desc,
  hasBackBtn = true,
  scope,
}: Props) => {
  return (
    <div className="space-y-3">
      {hasBackBtn && <BackButton />}

      <div className="flex items-start gap-4">
        <div className="space-y-1">
          <h1 className="font-bold text-3xl">{title}</h1>
          {desc && <p className="text-muted-foreground">{desc}</p>}
        </div>

        {scope && <Scope scope={scope} />}
      </div>
    </div>
  );
};

export default DashboardContentHeader;
