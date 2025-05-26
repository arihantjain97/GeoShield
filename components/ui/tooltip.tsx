import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: React.ReactNode;
  title: string;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
}

export function Tooltip({ children, title, className, side = "top" }: TooltipProps) {
  const [show, setShow] = React.useState(false);

  const positions = {
    top: "-translate-y-full -mt-2",
    right: "translate-x-2 ml-2 top-0",
    bottom: "translate-y-2 mt-2",
    left: "-translate-x-full -ml-2 top-0",
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 px-2 py-1 text-xs rounded bg-black text-white",
            "animate-in fade-in-0 zoom-in-95",
            positions[side],
            className
          )}
        >
          {title}
        </div>
      )}
    </div>
  );
}