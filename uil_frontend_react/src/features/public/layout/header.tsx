import Logo from "@/components/reusable/logo";
import ProfileDropdown from "@/components/reusable/profile-dropdown";

const PublicHeader = () => {
  return (
    <header className="top-4 z-50 fixed inset-x-0 px-3 lg:px-6">
      <nav className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center bg-background/60 shadow-sm backdrop-blur-xl px-4 py-2 md:py-3 border border-border/50 rounded-full">
          <Logo hasLabel={true} />
          <ProfileDropdown />
        </div>
      </nav>
    </header>
  );
};

export default PublicHeader;
