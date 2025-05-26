'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const FormField = React.forwardRef<HTMLLabelElement, FormFieldProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('text-sm font-medium leading-none', className)}
        {...props}
      >
        {children}
        {required && <span className="text-destructive">*</span>}
      </label>
    );
  }
);
FormField.displayName = 'FormField';

interface FormControlProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const FormControl = React.forwardRef<HTMLInputElement, FormControlProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);
FormControl.displayName = 'FormControl';

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-[0.8rem] font-medium text-destructive', className)}
        {...props}
      />
    );
  }
);
FormMessage.displayName = 'FormMessage';