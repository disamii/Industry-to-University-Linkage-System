import { Footer } from "@/components/layout/user/footer";
import { Header } from "@/components/layout/user/header";
import MainContentWrapper from "@/components/layout/user/main-content-wrapper";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col justify-center items-center min-h-dvh">
      <Header />
      <MainContentWrapper>{children}</MainContentWrapper>
      <Footer />
    </div>
  );
}
