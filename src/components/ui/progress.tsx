"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const ProgressBar = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressBarProps
>(({ className, value, showLabel = false, size = "md", ...props }, ref) => {
  const height = size === "sm" ? "h-2" : size === "lg" ? "h-4" : "h-3";

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-2 flex justify-between text-sm font-medium text-muted">
          <span>Progress</span>
          <span>{value}%</span>
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn("relative w-full overflow-hidden rounded-full bg-gray-200", height, className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className="h-full w-full flex-1 rounded-full bg-primary transition-all duration-500"
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
});
ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
