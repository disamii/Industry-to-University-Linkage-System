import { Transition } from "@headlessui/react";
import { resolveValue, Toaster, ToastIcon } from "react-hot-toast";

export default function CustomToaster() {
  return (
    <Toaster
      position="top-center"
      gutter={12}
      containerStyle={{ margin: "8px" }}
      toastOptions={{
        success: {
          duration: 3000,
        },
        error: { duration: 5000 },
      }}
    >
      {(t) => (
        <Transition
          appear
          show={t.visible}
          as="div"
          className="z-50 flex items-center gap-4 bg-gray-100 dark:bg-gray-800 px-6 py-4 border border-gray-200 dark:border-gray-700 rounded-md max-w-125 text-gray-800 dark:text-gray-100"
          enter="transition-all duration-150"
          enterFrom="opacity-0 scale-50"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-75"
        >
          <ToastIcon toast={t} />
          <p className="px-2">{resolveValue(t.message, t)}</p>
        </Transition>
      )}
    </Toaster>
  );
}
