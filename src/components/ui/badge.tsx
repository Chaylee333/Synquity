import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium",
    "w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none",
    "transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
    "focus-visible:ring-[3px] focus-visible:ring-primary/20",
    "overflow-hidden",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-transparent bg-primary/10 text-primary",
          "[a&]:hover:bg-primary/20 [a&]:hover:scale-105",
        ].join(" "),
        secondary: [
          "border-transparent bg-secondary text-secondary-foreground",
          "[a&]:hover:bg-secondary/80 [a&]:hover:scale-105",
        ].join(" "),
        destructive: [
          "border-transparent bg-destructive/10 text-destructive",
          "[a&]:hover:bg-destructive/20 [a&]:hover:scale-105",
        ].join(" "),
        outline: [
          "border-border/50 text-foreground bg-transparent",
          "[a&]:hover:bg-accent [a&]:hover:border-primary/30 [a&]:hover:scale-105",
        ].join(" "),
        success: [
          "border-transparent bg-emerald-500/10 text-emerald-600",
          "[a&]:hover:bg-emerald-500/20 [a&]:hover:scale-105",
        ].join(" "),
        warning: [
          "border-transparent bg-amber-500/10 text-amber-600",
          "[a&]:hover:bg-amber-500/20 [a&]:hover:scale-105",
        ].join(" "),
        gradient: [
          "border-transparent bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10",
          "text-primary [a&]:hover:scale-105",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
