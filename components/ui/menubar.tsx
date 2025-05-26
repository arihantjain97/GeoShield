import * as React from 'react';
import { cn } from '@/lib/utils';

interface MenubarProps {
  children: React.ReactNode;
  className?: string;
}

export function Menubar({ children, className }: MenubarProps) {
  return (
    <nav className={cn('flex h-10 items-center space-x-1 rounded-md border bg-background p-1', className)}>
      {children}
    </nav>
  );
}

interface MenubarItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function MenubarItem({ children, className, onClick, disabled }: MenubarItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none',
        'focus:bg-accent focus:text-accent-foreground',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
    >
      {children}
    </button>
  );
}

interface MenubarSeparatorProps {
  className?: string;
}

export function MenubarSeparator({ className }: MenubarSeparatorProps) {
  return <div className={cn('-mx-1 my-1 h-px bg-muted', className)} />;
}