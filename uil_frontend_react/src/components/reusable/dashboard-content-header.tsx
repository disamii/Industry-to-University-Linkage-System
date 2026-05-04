import BackButton from "./back-button";

type Props = {
  title: string;
  desc?: string;
  hasBackBtn?: boolean;
};

const DashboardContentHeader = ({ title, desc, hasBackBtn = true }: Props) => {
  return (
    <div className="space-y-3">
      {hasBackBtn && <BackButton />}

      <div className="space-y-1 mb-8">
        <h1 className="font-bold text-3xl">{title}</h1>
        {desc && <p className="text-muted-foreground">{desc}</p>}
      </div>

      {/* <Scope scope={data?.scope} /> */}
    </div>
  );
};

export default DashboardContentHeader;
