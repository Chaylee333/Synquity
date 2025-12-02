import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium",
    "transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-primary/30",
    "active:scale-[0.97]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25",
        ].join(" "),
        destructive: [
          "bg-destructive text-white",
          "hover:bg-destructive/90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-destructive/25",
          "focus-visible:ring-destructive/30",
        ].join(" "),
        outline: [
          "border-2 border-border bg-background text-foreground",
          "hover:bg-accent hover:text-accent-foreground hover:border-primary/30 hover:-translate-y-0.5",
        ].join(" "),
        secondary: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary/80 hover:-translate-y-0.5",
        ].join(" "),
        ghost: [
          "text-foreground",
          "hover:bg-accent hover:text-accent-foreground",
        ].join(" "),
        link: "text-primary underline-offset-4 hover:underline",
        gradient: [
          "bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white",
          "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30",
          "bg-[length:200%_100%] hover:bg-right transition-all duration-500",
        ].join(" "),
        success: [
          "bg-emerald-500 text-white",
          "hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25",
        ].join(" "),
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3 text-xs",
        lg: "h-12 rounded-xl px-8 has-[>svg]:px-6 text-base",
        xl: "h-14 rounded-2xl px-10 has-[>svg]:px-8 text-lg font-semibold",
        icon: "size-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
