"use client";

import { useState } from "react";
import ForgotPasswordEmailSent from "./_components/forgot-password-email-sent";
import ForgotPasswordForm from "./_components/forgot-password-form";

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);

  return !isSent ? (
    <ForgotPasswordForm onSent={setIsSent} />
  ) : (
    <ForgotPasswordEmailSent onSent={setIsSent} />
  );
}
