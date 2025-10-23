import { ReactNode } from 'react';

interface PageHeaderProps {
  children: ReactNode;
}

interface PageHeaderTitleProps {
  title: string;
  subtitle?: string;
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

function PageHeaderTitle({ title, subtitle }: PageHeaderTitleProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gradient">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground mt-2">{subtitle}</p>
      )}
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
