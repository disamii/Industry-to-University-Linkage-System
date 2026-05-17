import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import UpdateUserAccountForm from "@/features/auth/update-user-account-form";
import UpdateUserPasswordForm from "@/features/auth/update-user-password-form";

const OfficeManageAccountPage = () => {
  return (
    <div className="space-y-6">
      <DashboardContentHeader
        title="Manage Account"
        desc="Update your account information."
        hasBackBtn
      />

      <div className="gap-8 grid grid-cols-2">
        <UpdateUserAccountForm />
        <UpdateUserPasswordForm />
      </div>
    </div>
  );
};

export default OfficeManageAccountPage;
