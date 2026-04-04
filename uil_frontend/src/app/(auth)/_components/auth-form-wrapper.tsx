import { Card } from "@/components/ui/card";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const AuthFormWrapper = ({ children }: Props) => {
  return (
    <Card className="bg-card/50 shadow-none backdrop-blur-sm border-border rounded-[2.5rem] overflow-hidden">
      {children}
    </Card>
  );
};

export default AuthFormWrapper;
