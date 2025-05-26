import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  value: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

interface AccordionProps {
  type?: 'single' | 'multiple';
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
  children: React.ReactNode;
}

export function Accordion({ 
  type = 'single',
  value,
  onValueChange,
  className,
  children 
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(
    type === 'single' 
      ? value ? [value as string] : []
      : value as string[] || []
  );

  const handleItemClick = (itemValue: string) => {
    let newOpenItems: string[];
    
    if (type === 'single') {
      newOpenItems = openItems[0] === itemValue ? [] : [itemValue];
    } else {
      newOpenItems = openItems.includes(itemValue)
        ? openItems.filter(v => v !== itemValue)
        : [...openItems, itemValue];
    }
    
    setOpenItems(newOpenItems);
    onValueChange?.(type === 'single' ? newOpenItems[0] : newOpenItems);
  };

  return (
    <div className={cn('space-y-1', className)}>
      {React.Children.map(children, child => {
        if (React.isValidElement<AccordionItemProps>(child)) {
          return React.cloneElement(child, {
            isOpen: openItems.includes(child.props.value),
            onToggle: () => handleItemClick(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
}

export function AccordionItem({ 
  value,
  trigger,
  content,
  className,
  isOpen,
  onToggle,
}: AccordionItemProps & { 
  isOpen?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className={cn('border-b', className)}>
      <button
        className="flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:underline"
        onClick={onToggle}
      >
        {trigger}
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all',
          isOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className="pb-4 pt-0">{content}</div>
      </div>
    </div>
  );
}