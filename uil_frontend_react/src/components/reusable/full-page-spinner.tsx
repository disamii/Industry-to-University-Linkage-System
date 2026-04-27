import { Spinner } from "../ui/spinner";

const FullPageSpinner = () => {
  return (
    <div className="flex justify-center items-center w-full min-h-dvh">
      <Spinner className="size-8" />
    </div>
  );
};

export default FullPageSpinner;
