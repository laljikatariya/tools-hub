'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:scale-95';

    const variants = {
      default: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
      secondary: 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 hover:bg-slate-300 dark:hover:bg-slate-700',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      outline: 'border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800',
      ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800',
    };

    const sizes = {
      default: 'px-4 py-2 text-sm sm:text-base min-h-[40px]',
      sm: 'px-3 py-1.5 text-xs sm:text-sm min-h-[36px]',
      lg: 'px-6 py-3 text-base sm:text-lg min-h-[44px]',
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
