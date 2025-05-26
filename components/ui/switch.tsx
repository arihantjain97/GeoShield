import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        className={cn(
          "peer relative h-5 w-10 cursor-pointer appearance-none rounded-full bg-gray-300",
          "after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all",
          "checked:bg-primary checked:after:translate-x-5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      />
    );
  }
);

Switch.displayName = "Switch";