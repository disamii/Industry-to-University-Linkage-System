import { Transition } from "@headlessui/react";
import { XIcon } from "lucide-react";
import { resolveValue, Toaster, ToastIcon, toast } from "react-hot-toast";

const ReactHotToaster = () => {
  return (
    <Toaster
      position="top-center"
      gutter={12}
      containerStyle={{ margin: "8px" }}
      toastOptions={{
        success: {
          duration: 3000,
        },
        error: { duration: 4000 },
      }}
    >
      {(t) => (
        <Transition
          appear
          show={t.visible}
          as="div"
          className="z-50 flex items-center gap-4 bg-background shadow-lg px-6 py-4 border rounded-md max-w-125 text-foreground"
          enter="transition-all duration-150"
          enterFrom="opacity-0 scale-50"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-75"
        >
          <ToastIcon toast={t} />
          <p className="flex-1 px-2 font-medium text-sm">
            {resolveValue(t.message, t)}
          </p>

          {/* Close Button */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="hover:bg-muted/50 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-muted transition-colors"
            aria-label="Close"
          >
            <XIcon className="opacity-60 hover:opacity-100 w-5 h-5" />
          </button>
        </Transition>
      )}
    </Toaster>
  );
};

export default ReactHotToaster;
