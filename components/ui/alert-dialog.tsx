import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Continue",
  onConfirm,
  variant = 'default'
}: AlertDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange?.(false)}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={() => {
              onConfirm();
              onOpenChange?.(false);
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

AlertDialog.displayName = "AlertDialog";