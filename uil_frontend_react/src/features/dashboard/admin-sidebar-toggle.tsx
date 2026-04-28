import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

const SidebarToggle = () => {
  const { showSidebar, toggleSidebar } = useSidebar();

  return (
    <Button
      onClick={toggleSidebar}
      variant="ghost"
      className={cn(
        "self-center px-4 py-6 cursor-pointer",
        !showSidebar && "top-6 left-2 absolute text-center",
      )}
    >
      <Menu className="size-7" />
    </Button>
  );
};

export default SidebarToggle;
