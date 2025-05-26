import * as React from 'react';
import { cn } from '@/lib/utils';

export interface RadioGroupProps {
  name: string;
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function RadioGroup({ 
  name, 
  options, 
  value, 
  onChange, 
  className,
  disabled 
}: RadioGroupProps) {
  return (
    <div className={cn("space-y-2", className)} role="radiogroup">
      {options.map(option => (
        <label 
          key={option.value} 
          className={cn(
            "flex items-center space-x-2 cursor-pointer",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className={cn(
              "h-4 w-4 rounded-full border border-primary text-primary",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
          <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}

RadioGroup.displayName = "RadioGroup";