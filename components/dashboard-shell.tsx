import type React from 'react';
interface DashboardShellProps {
    children: React.ReactNode;
    className?: string;
}

export function DashboardShell({ children, ...props }: DashboardShellProps) {
    return (
        <div
            className="grid items-start gap-8 h-full rounded-lg border bg-card p-6 shadow-sm"
            {...props}
        >
            {children}
        </div>
    );
}
