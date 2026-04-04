import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

const NotificationBtn = () => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="relative bg-white dark:bg-slate-900 shadow-sm border-border/40 rounded-xl w-10 h-10"
    >
      <Bell className="w-4 h-4" />
      <span className="top-2.5 right-2.5 absolute bg-primary border-2 border-white dark:border-slate-900 rounded-full w-2 h-2" />
    </Button>
  );
};

export default NotificationBtn;
