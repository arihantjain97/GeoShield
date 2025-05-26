import * as React from 'react';
import { cn } from '@/lib/utils';

interface ContextMenuProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

export function ContextMenu({ children, content, className }: ContextMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onContextMenu={handleContextMenu} className={className}>
      {children}
      {isOpen && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: position.y,
            left: position.x,
            zIndex: 50,
          }}
          className={cn(
            'min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
            'animate-in fade-in-0 zoom-in-95'
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export function ContextMenuItem({
  children,
  onClick,
  className,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'focus:bg-accent focus:text-accent-foreground',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
    >
      {children}
    </button>
  );
}