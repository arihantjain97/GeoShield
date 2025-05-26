'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export const HoverCard = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative group inline-block">{children}</div>;
};

export const HoverCardTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('cursor-pointer', className)}
    {...props}
  />
));
HoverCardTrigger.displayName = 'HoverCardTrigger';

export const HoverCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'absolute z-50 mt-2 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md hidden group-hover:block',
      className
    )}
    {...props}
  />
));
HoverCardContent.displayName = 'HoverCardContent';