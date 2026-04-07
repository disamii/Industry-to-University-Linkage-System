import { Spinner } from "@/components/reusable/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { useState } from "react";

type Props = {
  onSent: (value: boolean) => void;
};

const ForgotPasswordForm = ({ onSent }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSent(true);
    }, 1500);
  };

  return (
    <form
      id="form-forgot-password"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="space-y-2.5">
        <Label
          htmlFor="email"
          className="font-bold text-muted-foreground text-xs uppercase tracking-widest"
        >
          Work Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="name@organization.com"
          required
          className="bg-background border-border rounded-xl focus-visible:ring-primary/20 h-12 transition-all"
        />
      </div>

      <Button
        type="submit"
        form="form-forgot-password"
        className="hover:bg-primary/90 rounded-xl w-full h-12 font-bold text-xs uppercase tracking-widest transition-all"
        disabled={isLoading}
      >
        {isLoading ? (
          <Spinner size="sm" />
        ) : (
          <>
            Send Instructions
            <Send className="ml-2 w-3.5 h-3.5" />
          </>
        )}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
