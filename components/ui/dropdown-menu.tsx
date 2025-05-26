'use client';

import * as React from 'react';
import { ChevronRight, Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative inline-block text-left">{children}</div>;
};

export const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button ref={ref} className={cn('px-4 py-2', className)} {...props} />
));
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md border bg-popover p-1 text-popover-foreground shadow-lg',
      className
    )}
    {...props}
  />
));
DropdownMenuContent.displayName = 'DropdownMenuContent';

export const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'cursor-pointer select-none rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export const DropdownMenuSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr ref={ref} className={cn('my-1 h-px bg-muted', className)} {...props} />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export const DropdownMenuCheckboxItem = ({
  checked,
  children,
  ...props
}: {
  checked: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm hover:bg-accent hover:text-accent-foreground"
    {...props}
  >
    {checked && <Check className="absolute left-2 h-4 w-4" />}
    {children}
  </div>
);

export const DropdownMenuRadioItem = ({
  selected,
  children,
  ...props
}: {
  selected: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm hover:bg-accent hover:text-accent-foreground"
    {...props}
  >
    {selected && <Circle className="absolute left-2 h-2 w-2 fill-current" />}
    {children}
  </div>
);

export const DropdownMenuSub = ({ children }: { children: React.ReactNode }) => (
  <div className="relative group">{children}</div>
);

export const DropdownMenuSubTrigger = ({
  children,
  inset,
  ...props
}: {
  children: React.ReactNode;
  inset?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex items-center px-2 py-1.5 text-sm', inset && 'pl-8')}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </div>
);

export const DropdownMenuSubContent = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute left-full top-0 mt-0 ml-1 w-48 rounded-md bg-popover shadow-md p-1 z-50">
    {children}
  </div>
);

export const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)} {...props} />
);
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';