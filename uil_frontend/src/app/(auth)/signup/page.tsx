"use client";

import { useState } from "react";
import SignupForm from "./_components/signup-form";
import SignupProgressBar from "./_components/signup-progress-bar";

// --- DUMMY DATA FOR TESTING ---
const MOCK_RPMS_DB = {
  "admin@rpms.com": {
    fullName: "Dr. Sarah Jenkins",
    exists: true,
    correctPass: "password123",
  },
};

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // RPMS State
  const [showRpmsDialog, setShowRpmsDialog] = useState(false);
  const [rpmsUserData, setRpmsUserData] = useState<{
    fullName: string;
    email: string;
  } | null>(null);

  return (
    <>
      <SignupProgressBar step={step} />

      <SignupForm
        step={step}
        setStep={setStep}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        setShowRpmsDialog={setShowRpmsDialog}
        setRpmsUserData={setRpmsUserData}
        MOCK_RPMS_DB={MOCK_RPMS_DB}
        rpmsUserData={rpmsUserData}
        showRpmsDialog={showRpmsDialog}
      />
    </>
  );
}
