
import { PageHeaderTitle } from '@/components/ui/page-header/page-header-title';
import { ReactNode } from 'react';

interface PageHeaderProps {
  children: ReactNode;
}

interface PageHeaderActionsProps {
  children: ReactNode;
}

function PageHeaderRoot({ children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      {children}
    </div>
  );
}

function PageHeaderActions({ children }: PageHeaderActionsProps) {
  return <div>{children}</div>;
}

export const PageHeader = Object.assign(PageHeaderRoot, {
  Title: PageHeaderTitle,
  Actions: PageHeaderActions,
});
