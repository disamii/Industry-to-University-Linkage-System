"use client";

import { Card } from "@/components/ui/card";
import SigninFooter from "./_components/signin-footer";
import SinginForm from "./_components/signin-form";
import SigninHeader from "./_components/singin-header";
import TermsPrivacyLinks from "./_components/terms-privacy-links";

export default function SigninPage() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="space-y-10 w-full max-w-100">
        <SigninHeader />

        <Card className="bg-card/50 shadow-none backdrop-blur-sm border-border rounded-[2rem] overflow-hidden">
          <SinginForm />
          <SigninFooter />
        </Card>

        <TermsPrivacyLinks />
      </div>
    </div>
  );
}
