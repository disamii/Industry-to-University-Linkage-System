import React from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({
  title = "No results found",
  description = "We couldn't find what you were looking for. Try adjusting your filters or adding something new.",
  icon,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col justify-center items-center bg-gray-50/50 p-8 border-2 border-gray-200 border-dashed rounded-xl text-center">
      {/* Icon Circle */}
      <div className="flex justify-center items-center bg-white shadow-sm mb-4 rounded-full w-16 h-16 text-gray-400">
        {icon || (
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>

      <h3 className="mb-1 font-semibold text-gray-900 text-lg">{title}</h3>
      <p className="mb-6 max-w-xs text-gray-500 text-sm">{description}</p>

      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg focus:ring-4 focus:ring-blue-100 font-medium text-white text-sm transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
