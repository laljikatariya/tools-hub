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
      'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      default: 'border border-[#4F46E5] bg-[#4F46E5] text-white hover:bg-[#4338CA] hover:border-[#4338CA]',
      secondary: 'border border-[#C7D2E5] bg-white text-[#1E293B] hover:bg-[#F3F6FC]',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      outline: 'border border-[#C7D2E5] bg-white text-[#1E293B] hover:bg-[#F3F6FC]',
      ghost: 'text-[#475569] hover:bg-[#F3F6FC]',
    };

    const sizes = {
      default: 'px-4 py-2.5 text-sm sm:text-base min-h-[44px]',
      sm: 'px-3 py-2 text-xs sm:text-sm min-h-[40px]',
      lg: 'px-6 py-3 text-base min-h-[48px]',
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
