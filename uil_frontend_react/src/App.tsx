import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import CustomToaster from "./components/reusable/custom-toaster";
import { useErrorToast } from "./hooks/use-error-toast";
import { setGlobalToastHandler } from "./lib/global-error-handler";
import { router } from "./routes";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

function App() {
  const { showErrorToast } = useErrorToast();

  useEffect(() => {
    setGlobalToastHandler(showErrorToast);
  }, [showErrorToast]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      <CustomToaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
