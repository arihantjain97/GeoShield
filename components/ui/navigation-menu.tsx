import * as React from 'react';
import { cn } from '@/lib/utils';

interface NavigationMenuProps {
  children: React.ReactNode;
  className?: string;
}

interface NavigationMenuListProps {
  children: React.ReactNode;
  className?: string;
}

interface NavigationMenuItemProps {
  children: React.ReactNode;
  className?: string;
}

interface NavigationMenuLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function NavigationMenu({ children, className }: NavigationMenuProps) {
  return (
    <nav className={cn('relative z-10 flex max-w-max flex-1 items-center justify-center', className)}>
      {children}
    </nav>
  );
}

export function NavigationMenuList({ children, className }: NavigationMenuListProps) {
  return (
    <ul className={cn('group flex flex-1 list-none items-center justify-center space-x-1', className)}>
      {children}
    </ul>
  );
}

export function NavigationMenuItem({ children, className }: NavigationMenuItemProps) {
  return (
    <li className={cn('relative', className)}>
      {children}
    </li>
  );
}

export function NavigationMenuLink({ href, children, className }: NavigationMenuLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
        className
      )}
    >
      {children}
    </a>
  );
}