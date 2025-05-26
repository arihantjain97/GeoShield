'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CommandDialog = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-background max-w-lg w-full rounded-md shadow-lg overflow-hidden p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Command = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className
    )}
    {...props}
  />
));
Command.displayName = 'Command';

export const CommandInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = 'CommandInput';

export const CommandList = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
));
CommandList.displayName = 'CommandList';

export const CommandEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('py-6 text-center text-sm', className)}
    {...props}
  />
));
CommandEmpty.displayName = 'CommandEmpty';

export const CommandGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-foreground [&_[data-heading]]:px-2 [&_[data-heading]]:py-1.5 [&_[data-heading]]:text-xs [&_[data-heading]]:font-medium [&_[data-heading]]:text-muted-foreground',
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = 'CommandGroup';

export const CommandItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
));
CommandItem.displayName = 'CommandItem';

export const CommandSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn('-mx-1 h-px bg-border', className)}
    {...props}
  />
));
CommandSeparator.displayName = 'CommandSeparator';

export const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        className
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = 'CommandShortcut';