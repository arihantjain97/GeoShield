import * as React from 'react';
import { cn } from '@/lib/utils';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  viewportRef?: React.RefObject<HTMLDivElement>;
}

export function ScrollArea({ className, children, viewportRef, ...props }: ScrollAreaProps) {
  return (
    <div className={cn('relative overflow-hidden', className)} {...props}>
      <div 
        ref={viewportRef}
        className="h-full w-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        {children}
      </div>
    </div>
  );
}

export function ScrollBar() {
  return null; // Replaced by native scrollbar with custom styling
}