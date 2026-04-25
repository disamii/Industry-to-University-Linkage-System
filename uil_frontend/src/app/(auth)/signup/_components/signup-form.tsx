import { useState } from "react";
import CreateIndustryForm from "./create-industry-form";
import CheckStaffEmailForm from "./check-staff-email-form";
import SignupChooseRole from "./signup-choose-role";
import SignupSuccess from "./signup-success";

type Props = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const SignupForm = ({ step, setStep }: Props) => {
  const [role, setRole] = useState<"industry" | "staff" | null>(null);

  return (
    <>
      <div className="pt-6">
        {step === 1 && (
          <SignupChooseRole role={role} setRole={setRole} setStep={setStep} />
        )}

        {step >= 2 &&
          step < 3 &&
          (role === "staff" ? (
            <CheckStaffEmailForm setStep={setStep} />
          ) : (
            <CreateIndustryForm setStep={setStep} step={step} />
          ))}

        {step === 3 && <SignupSuccess />}
      </div>
    </>
  );
};

export default SignupForm;
