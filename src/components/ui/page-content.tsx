import { ReactNode } from 'react';

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

export function PageContent({ children, className = '' }: PageContentProps) {
  return (
    <div className={`mt-8 ${className}`.trim()}>
      {children}
    </div>
  );
}
