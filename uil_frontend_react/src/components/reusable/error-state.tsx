interface ErrorStateProps {
  error?: Error | null;
  reset?: () => void;
  title?: string;
  message?: string;
}

export const ErrorState = ({
  error,
  reset,
  title = "Connection Error",
  message = "We're having trouble loading this data right now. Please check your internet connection or try again.",
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col justify-center items-center bg-red-50/30 p-8 border-2 border-red-100 rounded-xl text-center">
      {/* Warning Icon */}
      <div className="flex justify-center items-center bg-red-100 mb-4 rounded-full w-16 h-16 text-red-600">
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h3 className="mb-1 font-semibold text-red-900 text-lg">{title}</h3>

      {/* Display actual error message if in development or specific enough */}
      <p className="mb-6 max-w-xs text-red-600/80 text-sm">
        {error?.message || message}
      </p>

      <div className="flex gap-3">
        {reset && (
          <button
            onClick={() => reset()}
            className="inline-flex items-center bg-red-600 hover:bg-red-700 shadow-red-200 shadow-sm px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors"
          >
            <svg
              className="mr-2 w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
        )}

        <button
          onClick={() => window.location.reload()}
          className="bg-white hover:bg-red-50 px-4 py-2 border border-red-200 rounded-lg font-medium text-red-700 text-sm"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};
