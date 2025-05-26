import * as React from 'react';
import { cn } from '@/lib/utils';

interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function Popover({ trigger, content, align = 'center', className }: PopoverProps) {
  const [open, setOpen] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            'absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
            'animate-in fade-in-0 zoom-in-95',
            {
              'left-0': align === 'start',
              'left-1/2 -translate-x-1/2': align === 'center',
              'right-0': align === 'end',
            },
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export const PopoverTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('cursor-pointer', className)} {...props} />
));
PopoverTrigger.displayName = 'PopoverTrigger';

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));
PopoverContent.displayName = 'PopoverContent';