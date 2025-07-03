import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-gray-100 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
