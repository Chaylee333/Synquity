import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        "flex h-11 w-full min-w-0 rounded-xl border px-4 py-2.5 text-base",
        // Colors
        "bg-slate-50/80 border-slate-200/60 text-foreground",
        "placeholder:text-muted-foreground/60",
        // Selection
        "selection:bg-primary selection:text-primary-foreground",
        // Transitions
        "transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        // Hover
        "hover:border-slate-300 hover:bg-slate-50",
        // Focus
        "focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 focus:outline-none",
        // File input
        "file:inline-flex file:h-8 file:border-0 file:bg-primary/10 file:text-primary file:text-sm file:font-medium file:rounded-lg file:px-3 file:mr-3",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100",
        // Invalid
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive aria-invalid:focus:ring-destructive/20",
        // Dark mode
        "dark:bg-slate-800/50 dark:border-slate-700 dark:hover:border-slate-600 dark:focus:bg-slate-800",
        // Responsive
        "md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
