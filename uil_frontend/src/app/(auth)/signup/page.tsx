"use client";

import { useState } from "react";
import SignupForm from "./_components/signup-form";
import SignupProgressBar from "./_components/signup-progress-bar";

export default function SignupPage() {
  const [step, setStep] = useState(1);

  return (
    <>
      <SignupProgressBar step={step} />
      <SignupForm step={step} setStep={setStep} />
    </>
  );
}
