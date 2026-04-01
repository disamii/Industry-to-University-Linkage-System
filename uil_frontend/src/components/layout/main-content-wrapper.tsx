import React from "react";

type Props = {
  children: React.ReactNode;
};

const MainContentWrapper = ({ children }: Props) => {
  return (
    <main className="flex justify-center items-center mx-auto px-3 lg:px-6 pt-40 pb-24 w-full max-w-7xl">
      {children}
    </main>
  );
};

export default MainContentWrapper;
