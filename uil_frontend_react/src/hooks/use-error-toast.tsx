import toast from "react-hot-toast";
import {
  AlertCircle,
  Lock,
  Shield,
  Search,
  Server,
  AlertTriangle,
  X,
} from "lucide-react";
import type { ErrorResponse } from "@/types/interfaces";

export function useErrorToast() {
  const showErrorToast = (error: ErrorResponse) => {
    const normalizedError = error.error?.toLowerCase();

    const getErrorConfig = () => {
      switch (normalizedError) {
        case "invalid_token":
        case "not_authenticated":
          return {
            icon: Lock,
            title: "Session Expired",
            actionText: "Login",
            actionFn: () => {
              localStorage.clear();
              window.location.href = "/auth";
            },
          };
        case "forbidden":
        case "permission_denied":
          return {
            icon: Shield,
            title: "Access Denied",
          };
        case "not_found":
          return {
            icon: Search,
            title: "Not Found",
          };
        case "server_error":
          return {
            icon: Server,
            title: "Server Error",
            actionText: "Retry",
            actionFn: () => window.location.reload(),
          };
        case "validation_error":
          return {
            icon: AlertTriangle,
            title: "Validation Error",
          };
        case "parse_error":
          return {
            icon: AlertTriangle,
            title: "Parsing Error",
          };
        default:
          return {
            icon: AlertCircle,
            title: "Error",
          };
      }
    };

    const config = getErrorConfig();
    const IconComponent = config.icon;

    const renderDetails = () => {
      if (!error.details || typeof error.details !== "object") return null;
      return Object.entries(error.details as Record<string, string[] | string>)
        .map(
          ([field, messages]) =>
            `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`,
        )
        .join("\n");
    };

    const details = renderDetails();
    const fullMessage = `${error.message}${details ? `\n\n${details}` : ""}`;

    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } pointer-events-auto flex w-full max-w-md rounded-lg border-l-4 border-red-500 bg-white shadow-lg`}
        >
          <div className="flex-1 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <IconComponent className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">
                  {config.title}
                </p>
                <p className="mt-1 text-gray-600 text-sm whitespace-pre-line">
                  {fullMessage}
                </p>
                {config.actionFn && (
                  <button
                    onClick={() => {
                      config.actionFn?.();
                      toast.dismiss(t.id);
                    }}
                    className="inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 mt-3 px-3 py-1.5 rounded font-medium text-white text-xs transition-colors"
                  >
                    {config.actionText}
                  </button>
                )}
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-right",
      },
    );
  };

  return { showErrorToast };
}
