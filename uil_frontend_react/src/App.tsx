import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import CustomToaster from "./components/reusable/custom-toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { getQueryClient } from "./data/query-client";
import { useErrorToast } from "./hooks/use-error-toast";
import { setGlobalToastHandler } from "./lib/global-error-handler";
import { router } from "./routes";

function App() {
  const { showErrorToast } = useErrorToast();
  const queryClient = getQueryClient();

  useEffect(() => {
    setGlobalToastHandler(showErrorToast);
  }, [showErrorToast]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />

        <CustomToaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
