'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, className, style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative w-full", className)}
        style={{
          ...style,
          aspectRatio: `${ratio}`,
        }}
        {...props}
      >
        <div className="absolute inset-0">{children}</div>
      </div>
    );
  }
);

AspectRatio.displayName = 'AspectRatio';

export { AspectRatio };