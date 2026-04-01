export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col justify-center items-center bg-background px-3 lg:px-6 py-12 min-h-screen overflow-hidden">
      <div className="z-10 relative w-full">{children}</div>
    </div>
  );
}
