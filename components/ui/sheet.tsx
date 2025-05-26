import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export function Sheet({ 
  open, 
  onOpenChange, 
  children, 
  side = 'right',
  className 
}: SheetProps) {
  if (!open) return null;

  const sideStyles = {
    top: 'inset-x-0 top-0 border-b',
    right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
    bottom: 'inset-x-0 bottom-0 border-t',
    left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
  };

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="fixed inset-0 bg-black/80" 
        onClick={() => onOpenChange?.(false)} 
      />
      <div
        className={cn(
          'fixed bg-background p-6 shadow-lg transition ease-in-out',
          sideStyles[side],
          className
        )}
      >
        {children}
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          onClick={() => onOpenChange?.(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
}

export function SheetContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col space-y-4', className)} {...props}>
      {children}
    </div>
  );
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
  );
}

export function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
  );
}

export function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold text-foreground', className)} {...props} />;
}

export function SheetDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}