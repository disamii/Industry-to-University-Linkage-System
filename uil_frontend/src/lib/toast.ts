import { toast } from "sonner";

// https://shadcnstudio.com/docs/components/sonner

const style = {
  warning: {
    "--normal-bg": "light-dark(var(--color-amber-600), var(--color-amber-400))",
    "--normal-text": "var(--color-white)",
    "--normal-border":
      "light-dark(var(--color-amber-600), var(--color-amber-400))",
  } as React.CSSProperties,

  error: {
    "--normal-bg":
      "light-dark(var(--destructive), color-mix(in oklab, var(--destructive) 60%, var(--background)))",
    "--normal-text": "var(--color-white)",
    "--normal-border": "transparent",
  } as React.CSSProperties,

  success: {
    "--normal-bg": "light-dark(var(--color-green-600), var(--color-green-400))",
    "--normal-text": "var(--color-white)",
    "--normal-border":
      "light-dark(var(--color-green-600), var(--color-green-400))",
  } as React.CSSProperties,
};

export const appToast = {
  warning: (message: string) =>
    toast.warning(message, { style: style.warning }),

  error: (message: string) =>
    toast.error(message, {
      style: style.error,
    }),

  success: (message: string) =>
    toast.success(message, {
      style: style.success,
    }),
};
