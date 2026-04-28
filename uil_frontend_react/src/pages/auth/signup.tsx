import { useState } from "react";
import SignupForm from "@/features/auth/signup/signup-form";
import SignupProgressBar from "@/features/auth/signup/signup-progress-bar";

const Signup = () => {
  const [step, setStep] = useState(1);

  return (
    <div>
      <SignupProgressBar step={step} />
      <SignupForm step={step} setStep={setStep} />
    </div>
  );
};

export default Signup;
