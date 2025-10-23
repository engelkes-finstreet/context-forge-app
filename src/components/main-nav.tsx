'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { toast } from '@/lib/toast';
import { TypedLink, useTypedRouter, routes } from '@/lib/routes';
import { ModeToggle } from '@/components/mode-toggle';

export function MainNav() {
  const pathname = usePathname();
  const router = useTypedRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

//   const routes = [
//     {
//       href: '/projects',
//       label: 'Projects',
//       active: pathname.startsWith('/projects'),
//     },
//     {
//       href: '/developers',
//       label: 'Developers',
//       active: pathname.startsWith('/developers'),
//     },
//   ];

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push(routes.auth.signIn);
      toast.success('Signed out successfully');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className={cn(
      "sticky top-0 z-50 border-b transition-all duration-300",
      scrolled && "glass shadow-md"
    )}>
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center gap-6">
          <TypedLink route={routes.projects.list} params={{}} className="font-semibold text-lg transition-colors hover:text-primary">
            Context Forge
          </TypedLink>
          <nav className="flex items-center gap-4">
            <TypedLink
              route={routes.projects.list}
              params={{}}
              className={cn(
                'hover:text-primary text-sm font-medium transition-colors',
                pathname.startsWith('/projects') ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              Projects
            </TypedLink>
            <TypedLink
              route={routes.markdownDemo}
              params={{}}
              className={cn(
                'hover:text-primary text-sm font-medium transition-colors',
                pathname === '/markdown-demo' ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              Markdown Demo
            </TypedLink>
          </nav>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
