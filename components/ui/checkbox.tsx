import * as React from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={cn("h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary", className)}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";