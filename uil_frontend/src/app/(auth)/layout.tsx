import { CardContent } from "@/components/ui/card";
import AuthFooter from "./_components/auth-footer";
import AuthFormWrapper from "./_components/auth-form-wrapper";
import AuthHeader from "./_components/auth-header";
import TermsPrivacyLinks from "./signin/_components/terms-privacy-links";
import ForgotPasswordContact from "./forgot-password/_components/forgot-password-contact";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col justify-center items-center bg-background px-3 lg:px-6 py-12 min-h-screen overflow-hidden">
      <div className="z-10 relative w-full">
        <div className="flex flex-col justify-center items-center">
          <div className="space-y-10 w-full max-w-md">
            <AuthHeader />
            <AuthFormWrapper>
              <CardContent className="p-6 lg:p-8">{children}</CardContent>

              <AuthFooter />
            </AuthFormWrapper>

            <TermsPrivacyLinks />
            <ForgotPasswordContact />
          </div>
        </div>
      </div>
    </div>
  );
}
