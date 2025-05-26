import * as React from 'react';
import { cn } from '@/lib/utils';

interface CollapsibleProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function Collapsible({ open, onOpenChange, children, className }: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);
  };

  return (
    <div className={cn('relative', className)}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === CollapsibleTrigger) {
            return React.cloneElement(child, { onClick: handleToggle });
          }
          if (child.type === CollapsibleContent) {
            return React.cloneElement(child, { isOpen });
          }
        }
        return child;
      })}
    </div>
  );
}

interface CollapsibleTriggerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function CollapsibleTrigger({ children, className, onClick }: CollapsibleTriggerProps) {
  return (
    <button 
      className={cn('flex items-center justify-between w-full', className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

interface CollapsibleContentProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
}

export function CollapsibleContent({ children, className, isOpen }: CollapsibleContentProps) {
  return (
    <div
      className={cn(
        'overflow-hidden transition-all',
        isOpen ? 'max-h-screen' : 'max-h-0',
        className
      )}
    >
      {children}
    </div>
  );
}