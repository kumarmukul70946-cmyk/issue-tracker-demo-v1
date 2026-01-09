import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const Button = ({ children, variant = 'primary', className, ...props }) => {
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200',
        secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200',
        ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    };

    return (
        <button
            className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export const Card = ({ children, className }) => (
    <div className={cn('bg-white rounded-xl shadow-sm border border-slate-100 p-6', className)}>
        {children}
    </div>
);

export const Badge = ({ children, color = 'gray' }) => {
    const colors = {
        gray: 'bg-slate-100 text-slate-600',
        green: 'bg-green-100 text-green-700',
        blue: 'bg-blue-100 text-blue-700',
        yellow: 'bg-amber-100 text-amber-700',
        red: 'bg-red-100 text-red-700',
        purple: 'bg-purple-100 text-purple-700',
    };

    return (
        <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', colors[color])}>
            {children}
        </span>
    );
};
